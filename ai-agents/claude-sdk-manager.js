/**
 * 🤖 BRIK Claude SDK Manager
 * Integración nativa con el SDK oficial de Anthropic
 * Usa @anthropic-ai/sdk para comunicación directa con Claude
 */

const fs = require('fs');
const path = require('path');

// Manager principal con SDK oficial
class ClaudeSDKManager {
  constructor() {
    this.client = null;
    this.Anthropic = null;
    this.config = this.loadConfig();
    this.modelAliases = {
      'opus': 'claude-3-opus-20240229',
      'sonnet': 'claude-3-sonnet-20240229', 
      'haiku': 'claude-3-haiku-20240307',
      'claude-3': 'claude-3-opus-20240229',
      'default': 'claude-3-opus-20240229'
    };
  }

  loadConfig() {
    const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.brik-claude-config.json');
    
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    // Configuración por defecto
    return {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-opus-20240229',
      maxTokens: 4096,
      temperature: 0.7,
      systemPrompt: this.getDefaultSystemPrompt()
    };
  }

  getDefaultSystemPrompt() {
    return `Eres un experto en arquitectura BRIK y principios DAAF-Circuitalidad Digital.
    
Tu misión es generar código de máxima calidad siguiendo estos principios:

1. ARQUITECTURA DE 3 CAPAS:
   - CORE: Lógica de negocio pura e inmutable
   - WRAPPERS: Adaptadores para servicios externos
   - LIVING LAYER: Monitoreo y consciencia del sistema

2. CALIDAD DEL CÓDIGO:
   - 100% de cobertura de tests obligatorio
   - Código funcional y compilable
   - Documentación inline completa
   - Manejo de errores robusto

3. FILOSOFÍA BRIK:
   - Inmutabilidad del core post-deployment
   - Evolución controlada vía wrappers
   - Consciencia activa del sistema
   - Circuitalidad digital completa

Genera código profesional, production-ready y siguiendo las mejores prácticas del lenguaje especificado.`;
  }

  async initialize() {
    try {
      // Intentar cargar el SDK de Anthropic
      try {
        this.Anthropic = require('@anthropic-ai/sdk');
        console.log('✅ SDK de Anthropic cargado exitosamente');
      } catch (error) {
        console.error('⚠️ SDK de Anthropic no instalado. Instalando...');
        await this.installSDK();
        this.Anthropic = require('@anthropic-ai/sdk');
      }

      // Inicializar cliente
      if (!this.config.apiKey) {
        throw new Error('API Key de Anthropic no configurada. Configura ANTHROPIC_API_KEY o usa el menú de configuración.');
      }

      this.client = new this.Anthropic({
        apiKey: this.config.apiKey
      });

      console.log('✅ Cliente Claude inicializado correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error inicializando Claude SDK:', error.message);
      return false;
    }
  }

  async installSDK() {
    const { execSync } = require('child_process');
    console.log('📦 Instalando @anthropic-ai/sdk...');
    
    try {
      execSync('npm install @anthropic-ai/sdk', { stdio: 'inherit' });
      console.log('✅ SDK instalado exitosamente');
    } catch (error) {
      throw new Error('No se pudo instalar el SDK. Por favor ejecuta: npm install @anthropic-ai/sdk');
    }
  }

  async generateBrikProject(description, language, integrations) {
    if (!this.client) {
      await this.initialize();
    }

    const prompt = this.buildProjectPrompt(description, language, integrations);
    
    try {
      console.log('🧠 Consultando a Claude para generar arquitectura BRIK...');
      
      const message = await this.client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        system: this.config.systemPrompt,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      return this.parseClaudeResponse(message);
    } catch (error) {
      console.error('❌ Error en generación:', error.message);
      throw error;
    }
  }

  async analyzeProject(projectPath) {
    if (!this.client) {
      await this.initialize();
    }

    const projectStructure = this.scanProject(projectPath);
    const prompt = `Analiza este proyecto y genera un reporte BRIK detallado:

Estructura actual:
${JSON.stringify(projectStructure, null, 2)}

Genera un análisis que incluya:
1. Nivel de cumplimiento BRIK (0-100%)
2. Componentes CORE identificados
3. WRAPPERS necesarios
4. LIVING LAYER recomendado
5. Plan de reestructuración
6. Estimación de esfuerzo

Formato de respuesta: JSON estructurado`;

    const message = await this.client.messages.create({
      model: this.config.model,
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return this.parseClaudeResponse(message);
  }

  async generateCode(specification, language) {
    if (!this.client) {
      await this.initialize();
    }

    const examples = this.getLanguageExamples(language);
    
    const prompt = `Genera código ${language} completo para esta especificación BRIK:

${JSON.stringify(specification, null, 2)}

Ejemplos de estructura esperada:
${examples}

Requisitos:
- Código 100% funcional
- Tests con cobertura completa
- Documentación inline
- Manejo de errores
- Mejores prácticas del lenguaje

Genera todos los archivos necesarios en formato:
[FILENAME: nombre.ext]
[CODE]
contenido del archivo
[/CODE]`;

    const message = await this.client.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return this.parseCodeResponse(message);
  }

  async streamGeneration(prompt, onChunk) {
    if (!this.client) {
      await this.initialize();
    }

    try {
      const stream = await this.client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        messages: [{
          role: 'user',
          content: prompt
        }],
        stream: true
      });

      let fullResponse = '';
      
      for await (const messageStreamEvent of stream) {
        if (messageStreamEvent.type === 'content_block_delta') {
          const chunk = messageStreamEvent.delta.text;
          fullResponse += chunk;
          
          if (onChunk) {
            onChunk(chunk);
          }
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('❌ Error en streaming:', error.message);
      throw error;
    }
  }

  async useTools(prompt, tools) {
    if (!this.client) {
      await this.initialize();
    }

    // Claude 3 soporta function calling / tool use
    const message = await this.client.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      tools: tools,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return this.parseToolResponse(message);
  }

  buildProjectPrompt(description, language, integrations) {
    return `Genera una arquitectura BRIK completa para el siguiente proyecto:

DESCRIPCIÓN: ${description}
LENGUAJE: ${language}
INTEGRACIONES: ${integrations || 'ninguna'}

Estructura el proyecto siguiendo estrictamente:

1. CORE (src/core/):
   - Entidades de dominio puras
   - Lógica de negocio inmutable
   - Sin dependencias externas
   - Value objects y aggregates

2. WRAPPERS (src/components/):
   - Adaptadores para ${integrations}
   - Patrón Repository
   - Interfaces de servicios externos
   - Manejo de errores y retry logic

3. LIVING LAYER (src/living-layer/):
   - Monitoreo de métricas
   - Health checks
   - Auto-scaling logic
   - Alertas y notificaciones

Genera el análisis completo en formato JSON con:
- Lista de archivos a crear
- Estructura de cada componente
- Relaciones entre capas
- Tests necesarios para 100% cobertura`;
  }

  parseClaudeResponse(message) {
    if (!message.content || !message.content[0]) {
      throw new Error('Respuesta vacía de Claude');
    }

    const content = message.content[0].text;
    
    // Intentar extraer JSON si está presente
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (error) {
        console.warn('⚠️ No se pudo parsear JSON, devolviendo texto plano');
      }
    }

    // Buscar JSON sin marcadores
    try {
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}') + 1;
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        return JSON.parse(content.substring(jsonStart, jsonEnd));
      }
    } catch {}

    // Devolver como texto si no es JSON
    return { content, type: 'text' };
  }

  parseCodeResponse(message) {
    const content = message.content[0].text;
    const files = {};
    
    // Buscar patrón [FILENAME: ...] [CODE] ... [/CODE]
    const filePattern = /\[FILENAME:\s*(.+?)\]\s*\[CODE\]([\s\S]*?)\[\/CODE\]/g;
    let match;
    
    while ((match = filePattern.exec(content)) !== null) {
      const filename = match[1].trim();
      const code = match[2].trim();
      files[filename] = code;
    }

    // Si no hay archivos con ese formato, buscar bloques de código
    if (Object.keys(files).length === 0) {
      const codeBlocks = content.match(/```[\w]*\n([\s\S]*?)```/g);
      if (codeBlocks) {
        codeBlocks.forEach((block, index) => {
          const code = block.replace(/```[\w]*\n/, '').replace(/```$/, '');
          files[`file_${index + 1}`] = code;
        });
      }
    }

    return files;
  }

  parseToolResponse(message) {
    // Parsear respuestas de tool use
    if (message.stop_reason === 'tool_use') {
      return {
        toolCalls: message.content.filter(c => c.type === 'tool_use'),
        text: message.content.filter(c => c.type === 'text').map(c => c.text).join('')
      };
    }
    
    return this.parseClaudeResponse(message);
  }

  scanProject(projectPath) {
    const structure = {
      files: [],
      directories: [],
      hasBrik: false,
      hasCore: false,
      hasWrappers: false,
      hasLivingLayer: false
    };

    const scan = (dir, level = 0) => {
      if (level > 3) return; // Limitar profundidad
      
      try {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
          if (item.startsWith('.') || item === 'node_modules') return;
          
          const fullPath = path.join(dir, item);
          const stats = fs.statSync(fullPath);
          const relativePath = path.relative(projectPath, fullPath);
          
          if (stats.isDirectory()) {
            structure.directories.push(relativePath);
            
            // Detectar estructura BRIK
            if (item === 'core') structure.hasCore = true;
            if (item === 'components' || item === 'wrappers') structure.hasWrappers = true;
            if (item === 'living-layer') structure.hasLivingLayer = true;
            
            scan(fullPath, level + 1);
          } else {
            structure.files.push(relativePath);
            if (item === '.brik-dna.yml') structure.hasBrik = true;
          }
        });
      } catch (error) {
        console.error(`Error escaneando ${dir}:`, error.message);
      }
    };

    scan(projectPath);
    return structure;
  }

  getLanguageExamples(language) {
    const examples = {
      rust: `
// CORE Entity
pub struct User {
    id: Uuid,
    email: String,
}

// WRAPPER
pub struct PostgresUserRepository {
    pool: PgPool,
}

// LIVING LAYER  
pub struct UserMetricsMonitor {
    metrics: Arc<Metrics>,
}`,
      typescript: `
// CORE Entity
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string
  ) {}
}

// WRAPPER
export class PostgresUserRepository {
  constructor(private pool: Pool) {}
}

// LIVING LAYER
export class UserMetricsMonitor {
  constructor(private metrics: MetricsClient) {}
}`,
      python: `
# CORE Entity
@dataclass(frozen=True)
class User:
    id: str
    email: str

# WRAPPER
class PostgresUserRepository:
    def __init__(self, pool: Pool):
        self.pool = pool

# LIVING LAYER
class UserMetricsMonitor:
    def __init__(self, metrics: MetricsClient):
        self.metrics = metrics`
    };

    return examples[language] || examples.typescript;
  }

  // Métodos de configuración

  async configureApiKey(apiKey) {
    this.config.apiKey = apiKey;
    this.saveConfig();
    await this.initialize();
  }

  setModel(modelAlias) {
    const model = this.modelAliases[modelAlias] || modelAlias;
    this.config.model = model;
    this.saveConfig();
    console.log(`✅ Modelo configurado: ${model}`);
  }

  setMaxTokens(maxTokens) {
    this.config.maxTokens = maxTokens;
    this.saveConfig();
  }

  setSystemPrompt(prompt) {
    this.config.systemPrompt = prompt;
    this.saveConfig();
  }

  saveConfig() {
    const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.brik-claude-config.json');
    fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
  }

  // Métodos de utilidad

  async testConnection() {
    try {
      if (!this.client) {
        await this.initialize();
      }

      const message = await this.client.messages.create({
        model: this.config.model,
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: 'Di "BRIK TEST OK" si me recibes'
        }]
      });

      const response = message.content[0].text;
      
      if (response.includes('BRIK TEST OK')) {
        console.log('✅ Conexión con Claude exitosa');
        console.log(`   Modelo: ${this.config.model}`);
        console.log(`   Tokens usados: ${message.usage.input_tokens + message.usage.output_tokens}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Error en test de conexión:', error.message);
      return false;
    }
  }

  getUsageStats(message) {
    if (!message.usage) return null;
    
    return {
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
      totalTokens: message.usage.input_tokens + message.usage.output_tokens,
      estimatedCost: this.calculateCost(message.usage)
    };
  }

  calculateCost(usage) {
    // Precios aproximados por millón de tokens (pueden variar)
    const pricing = {
      'claude-3-opus-20240229': { input: 15, output: 75 },
      'claude-3-sonnet-20240229': { input: 3, output: 15 },
      'claude-3-haiku-20240307': { input: 0.25, output: 1.25 }
    };

    const modelPricing = pricing[this.config.model] || pricing['claude-3-opus-20240229'];
    
    const inputCost = (usage.input_tokens / 1000000) * modelPricing.input;
    const outputCost = (usage.output_tokens / 1000000) * modelPricing.output;
    
    return {
      input: inputCost.toFixed(4),
      output: outputCost.toFixed(4),
      total: (inputCost + outputCost).toFixed(4),
      currency: 'USD'
    };
  }
}

// Clase de alto nivel para generación BRIK
class BrikClaudeGenerator {
  constructor() {
    this.claude = new ClaudeSDKManager();
  }

  async generateFullProject(projectName, description, language, integrations, outputPath) {
    console.log('\n🧬 BRIK Generator con Claude SDK');
    console.log('═══════════════════════════════════════\n');

    // Inicializar Claude
    if (!await this.claude.initialize()) {
      throw new Error('No se pudo inicializar Claude SDK');
    }

    // Test de conexión
    console.log('🔍 Verificando conexión con Claude...');
    if (!await this.claude.testConnection()) {
      throw new Error('No se pudo conectar con Claude');
    }

    try {
      // Fase 1: Análisis y arquitectura
      console.log('\n📊 Fase 1: Generando arquitectura BRIK...');
      const architecture = await this.claude.generateBrikProject(
        description,
        language,
        integrations
      );

      // Fase 2: Generación de código
      console.log('\n💻 Fase 2: Generando código completo...');
      const code = await this.claude.generateCode(architecture, language);

      // Fase 3: Escribir proyecto
      console.log('\n💾 Fase 3: Escribiendo archivos...');
      await this.writeProject(code, outputPath, projectName);

      // Fase 4: Generar extras
      console.log('\n📚 Fase 4: Generando documentación y scripts...');
      await this.generateExtras(outputPath, architecture);

      console.log('\n✅ Proyecto BRIK generado exitosamente!');
      
      return {
        architecture,
        files: Object.keys(code),
        path: outputPath
      };

    } catch (error) {
      console.error('❌ Error en generación:', error.message);
      throw error;
    }
  }

  async writeProject(files, outputPath, projectName) {
    // Crear directorio principal
    fs.mkdirSync(outputPath, { recursive: true });

    // Escribir cada archivo
    for (const [filename, content] of Object.entries(files)) {
      const filePath = path.join(outputPath, filename);
      const dir = path.dirname(filePath);
      
      // Crear directorio si no existe
      fs.mkdirSync(dir, { recursive: true });
      
      // Escribir archivo
      fs.writeFileSync(filePath, content);
      console.log(`  ✅ ${filename}`);
    }
  }

  async generateExtras(outputPath, architecture) {
    // Generar .brik-dna.yml
    const brikDna = {
      project: {
        name: path.basename(outputPath),
        version: '1.0.0',
        philosophy: 'DAAF-BRIK-CircuitalidadDigital',
        generated_by: 'Claude SDK',
        model: this.claude.config.model,
        timestamp: new Date().toISOString()
      },
      architecture: architecture,
      compliance: {
        coverage_requirement: 100,
        immutability_check: true,
        documentation_completeness: true
      }
    };

    fs.writeFileSync(
      path.join(outputPath, '.brik-dna.yml'),
      `# BRIK DNA - Generado por Claude\n${JSON.stringify(brikDna, null, 2)}`
    );

    // Copiar scripts de validación si existen
    const scriptsDir = path.join(__dirname, '..', 'scripts');
    if (fs.existsSync(scriptsDir)) {
      const targetScriptsDir = path.join(outputPath, 'scripts');
      fs.mkdirSync(targetScriptsDir, { recursive: true });
      
      ['test-coverage.sh', 'brik-certify.sh', 'validate-docs.sh'].forEach(script => {
        const source = path.join(scriptsDir, script);
        if (fs.existsSync(source)) {
          const target = path.join(targetScriptsDir, script);
          fs.copyFileSync(source, target);
          fs.chmodSync(target, '755');
        }
      });
    }
  }
}

// Exportar clases
module.exports = {
  ClaudeSDKManager,
  BrikClaudeGenerator
};