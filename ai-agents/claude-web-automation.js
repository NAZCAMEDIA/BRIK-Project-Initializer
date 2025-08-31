/**
 * 🤖 Claude Web Automation Manager
 * Interactúa con Claude a través de tu cuenta Pro/Max usando Playwright
 * No requiere API Key - usa tu suscripción directamente
 */

const playwright = require('playwright');
const fs = require('fs');
const path = require('path');

class ClaudeWebAutomation {
  constructor() {
    this.browser = null;
    this.page = null;
    this.context = null;
    this.isAuthenticated = false;
    this.config = this.loadConfig();
  }

  loadConfig() {
    const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.claude-web-config.json');
    
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    return {
      headless: false, // Mostrar navegador para login inicial
      sessionPath: path.join(process.env.HOME || process.env.USERPROFILE, '.claude-session'),
      claudeUrl: 'https://claude.ai',
      timeout: 60000
    };
  }

  async initialize(options = {}) {
    console.log('🌐 Iniciando navegador para Claude Web...');
    
    try {
      // Lanzar navegador con contexto persistente para mantener sesión
      this.browser = await playwright.chromium.launchPersistentContext(
        this.config.sessionPath,
        {
          headless: options.headless ?? this.config.headless,
          viewport: { width: 1280, height: 800 },
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      );

      // Abrir página de Claude
      this.page = await this.browser.newPage();
      await this.page.goto(this.config.claudeUrl, { waitUntil: 'networkidle' });

      // Verificar si ya está autenticado
      await this.checkAuthentication();

      if (!this.isAuthenticated) {
        console.log('📝 Por favor inicia sesión en Claude con tu cuenta Pro/Max');
        console.log('⏳ Esperando login...');
        
        // Esperar a que el usuario inicie sesión
        await this.waitForLogin();
      }

      console.log('✅ Conectado a Claude Web exitosamente');
      
      // Cambiar a modo headless después del login
      if (this.isAuthenticated && !this.config.headless) {
        this.config.headless = true;
        this.saveConfig();
      }

      return true;
    } catch (error) {
      console.error('❌ Error inicializando Claude Web:', error.message);
      return false;
    }
  }

  async checkAuthentication() {
    try {
      // Buscar elementos que indiquen sesión activa
      const newChatButton = await this.page.$('button:has-text("New chat")');
      const chatInput = await this.page.$('textarea[placeholder*="Message Claude"]');
      
      this.isAuthenticated = !!(newChatButton || chatInput);
      
      if (this.isAuthenticated) {
        console.log('✅ Sesión activa detectada');
      }
      
      return this.isAuthenticated;
    } catch {
      return false;
    }
  }

  async waitForLogin() {
    // Esperar hasta que aparezca el área de chat
    await this.page.waitForSelector('textarea[placeholder*="Message Claude"]', {
      timeout: 300000 // 5 minutos para login
    });
    
    this.isAuthenticated = true;
    console.log('✅ Login exitoso');
  }

  async sendMessage(prompt, options = {}) {
    if (!this.page || !this.isAuthenticated) {
      throw new Error('No conectado a Claude. Ejecuta initialize() primero');
    }

    try {
      // Asegurarse de estar en un chat nuevo si es necesario
      if (options.newChat) {
        await this.startNewChat();
      }

      // Buscar el textarea de mensaje
      const messageInput = await this.page.waitForSelector(
        'textarea[placeholder*="Message Claude"], div[contenteditable="true"]',
        { timeout: 10000 }
      );

      // Escribir el mensaje
      await messageInput.click();
      await messageInput.fill(prompt);

      // Enviar mensaje (Enter o botón de enviar)
      await this.page.keyboard.press('Enter');
      
      // Esperar respuesta
      console.log('⏳ Esperando respuesta de Claude...');
      const response = await this.waitForResponse();
      
      return response;
    } catch (error) {
      console.error('❌ Error enviando mensaje:', error.message);
      throw error;
    }
  }

  async waitForResponse() {
    // Esperar a que Claude termine de responder
    await this.page.waitForFunction(
      () => {
        // Buscar indicador de que Claude está escribiendo
        const typingIndicator = document.querySelector('[data-state="typing"], .typing-indicator');
        const stopButton = document.querySelector('button:has-text("Stop")');
        
        // Si no hay indicador de escritura y no hay botón de stop, la respuesta está completa
        return !typingIndicator && !stopButton;
      },
      { timeout: this.config.timeout }
    );

    // Obtener la última respuesta de Claude
    const responses = await this.page.$$eval(
      '[data-message-author="assistant"], .assistant-message, div[class*="assistant"]',
      elements => elements.map(el => el.textContent)
    );

    return responses[responses.length - 1] || '';
  }

  async startNewChat() {
    try {
      // Buscar y hacer clic en "New chat"
      const newChatButton = await this.page.$('button:has-text("New chat"), button[aria-label*="New"]');
      if (newChatButton) {
        await newChatButton.click();
        await this.page.waitForTimeout(1000);
      }
    } catch (error) {
      console.warn('⚠️ No se pudo iniciar nuevo chat:', error.message);
    }
  }

  async generateBrikProject(description, language, integrations) {
    const prompt = `Genera un proyecto completo siguiendo la arquitectura BRIK (DAAF-Circuitalidad Digital) con estas características:

PROYECTO: ${description}
LENGUAJE: ${language}
INTEGRACIONES: ${integrations || 'ninguna'}

Requisitos BRIK obligatorios:
1. ESTRUCTURA DE 3 CAPAS:
   - src/core/: Lógica de negocio pura e inmutable
   - src/components/: Wrappers y adaptadores para servicios externos
   - src/living-layer/: Monitoreo, métricas y consciencia del sistema

2. TESTS con 100% de cobertura:
   - tests/unit/: Tests unitarios
   - tests/integration/: Tests de integración
   - tests/property/: Property-based testing
   - tests/immutability/: Tests de inmutabilidad

3. DOCUMENTACIÓN COMPLETA:
   - docs/product/: PRD, user stories
   - docs/technical/: Arquitectura, APIs
   - docs/operational/: Deploy, configuración

4. CÓDIGO:
   - 100% funcional y compilable
   - Documentación inline completa
   - Manejo de errores robusto
   - Mejores prácticas del lenguaje

Genera el código completo para cada archivo necesario. Usa el formato:

[FILE: path/to/file.ext]
\`\`\`${language}
// código aquí
\`\`\`

Incluye TODOS los archivos necesarios para que el proyecto funcione.`;

    const response = await this.sendMessage(prompt, { newChat: true });
    return this.parseProjectResponse(response);
  }

  parseProjectResponse(response) {
    const files = {};
    
    // Buscar patrón [FILE: ...] o similar
    const filePattern = /\[FILE:\s*(.+?)\][\s\S]*?```[\w]*\n([\s\S]*?)```/g;
    let match;
    
    while ((match = filePattern.exec(response)) !== null) {
      const filepath = match[1].trim();
      const content = match[2].trim();
      files[filepath] = content;
    }

    // Si no encuentra archivos con ese formato, buscar bloques de código
    if (Object.keys(files).length === 0) {
      // Buscar archivos mencionados y sus códigos
      const codeBlocks = response.match(/```[\w]*\n[\s\S]*?```/g);
      
      if (codeBlocks) {
        codeBlocks.forEach((block, index) => {
          // Intentar extraer el nombre del archivo del contexto
          const beforeBlock = response.substring(0, response.indexOf(block));
          const fileNameMatch = beforeBlock.match(/(?:file|archivo|create|crear)\s+`?([^\s`]+(?:\.[a-z]+)?)`?[:\s]*$/i);
          
          if (fileNameMatch) {
            const filename = fileNameMatch[1];
            const code = block.replace(/```[\w]*\n/, '').replace(/```$/, '');
            files[filename] = code;
          } else {
            // Generar nombre genérico
            const lang = block.match(/```(\w+)/)?.[1] || 'txt';
            files[`file_${index + 1}.${lang}`] = block.replace(/```[\w]*\n/, '').replace(/```$/, '');
          }
        });
      }
    }

    return {
      files,
      rawResponse: response
    };
  }

  async analyzeProject(projectPath) {
    const projectStructure = this.scanProjectStructure(projectPath);
    
    const prompt = `Analiza este proyecto y evalúa su cumplimiento con los principios BRIK:

ESTRUCTURA ACTUAL:
${JSON.stringify(projectStructure, null, 2)}

Genera un análisis detallado que incluya:
1. Nivel de cumplimiento BRIK (0-100%)
2. Componentes CORE identificados vs faltantes
3. WRAPPERS necesarios para las integraciones
4. LIVING LAYER recomendado
5. Plan de reestructuración paso a paso
6. Estimación de esfuerzo (horas)
7. Recomendaciones específicas

Formato: Análisis estructurado y claro`;

    const response = await this.sendMessage(prompt, { newChat: true });
    return response;
  }

  scanProjectStructure(projectPath) {
    const structure = {
      files: [],
      directories: [],
      languages: new Set(),
      hasBrikStructure: false,
      coverage: 'unknown'
    };

    const scan = (dir, level = 0) => {
      if (level > 3) return;
      
      try {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
          if (item.startsWith('.') || item === 'node_modules' || item === 'target') return;
          
          const fullPath = path.join(dir, item);
          const stats = fs.statSync(fullPath);
          
          if (stats.isDirectory()) {
            structure.directories.push(path.relative(projectPath, fullPath));
            
            // Detectar estructura BRIK
            if (item === 'core' || item === 'components' || item === 'living-layer') {
              structure.hasBrikStructure = true;
            }
            
            scan(fullPath, level + 1);
          } else {
            const relativePath = path.relative(projectPath, fullPath);
            structure.files.push(relativePath);
            
            // Detectar lenguajes
            const ext = path.extname(item);
            if (['.rs', '.ts', '.js', '.py', '.go'].includes(ext)) {
              structure.languages.add(ext.slice(1));
            }
          }
        });
      } catch (error) {
        console.error(`Error escaneando ${dir}:`, error.message);
      }
    };

    scan(projectPath);
    structure.languages = Array.from(structure.languages);
    
    return structure;
  }

  async uploadFile(filePath) {
    // Para subir archivos a Claude si es necesario
    if (!this.page) {
      throw new Error('No conectado a Claude');
    }

    try {
      // Buscar input de archivo
      const fileInput = await this.page.$('input[type="file"]');
      
      if (fileInput) {
        await fileInput.setInputFiles(filePath);
        console.log(`📎 Archivo subido: ${path.basename(filePath)}`);
        return true;
      }
      
      console.warn('⚠️ No se encontró input de archivo');
      return false;
    } catch (error) {
      console.error('❌ Error subiendo archivo:', error.message);
      return false;
    }
  }

  async extractCode() {
    // Extraer bloques de código de la respuesta actual
    const codeBlocks = await this.page.$$eval(
      'pre code, .code-block, [class*="language-"]',
      elements => elements.map(el => ({
        language: el.className?.match(/language-(\w+)/)?.[1] || 'text',
        content: el.textContent
      }))
    );

    return codeBlocks;
  }

  async copyLastResponse() {
    // Copiar la última respuesta al portapapeles
    try {
      const lastResponse = await this.page.$eval(
        '[data-message-author="assistant"]:last-child, .assistant-message:last-child',
        el => el.textContent
      );

      return lastResponse;
    } catch {
      return null;
    }
  }

  async exportChat(outputPath) {
    // Exportar toda la conversación
    try {
      const messages = await this.page.$$eval(
        '[data-message-author], .message',
        elements => elements.map(el => ({
          role: el.getAttribute('data-message-author') || 
                (el.classList.contains('user') ? 'user' : 'assistant'),
          content: el.textContent
        }))
      );

      const chatExport = {
        timestamp: new Date().toISOString(),
        messages
      };

      fs.writeFileSync(outputPath, JSON.stringify(chatExport, null, 2));
      console.log(`💾 Chat exportado a: ${outputPath}`);
      
      return true;
    } catch (error) {
      console.error('❌ Error exportando chat:', error.message);
      return false;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      console.log('🔚 Navegador cerrado');
    }
  }

  saveConfig() {
    const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.claude-web-config.json');
    fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
  }
}

// Generador BRIK usando Claude Web
class BrikClaudeWebGenerator {
  constructor() {
    this.claude = new ClaudeWebAutomation();
  }

  async generateFullProject(projectName, description, language, integrations, outputPath) {
    console.log('\n🧬 BRIK Generator con Claude Web (Suscripción Pro/Max)');
    console.log('═══════════════════════════════════════════════════════\n');

    try {
      // Inicializar Claude Web
      console.log('🌐 Conectando con Claude Web...');
      await this.claude.initialize();

      // Generar proyecto
      console.log('\n📊 Generando arquitectura BRIK...');
      const result = await this.claude.generateBrikProject(
        description,
        language,
        integrations
      );

      // Escribir archivos
      console.log('\n💾 Escribiendo proyecto...');
      await this.writeProject(result.files, outputPath, projectName);

      // Generar archivos adicionales
      await this.generateExtras(outputPath, projectName, language);

      console.log('\n✅ Proyecto BRIK generado exitosamente!');
      
      return {
        files: Object.keys(result.files),
        path: outputPath
      };

    } catch (error) {
      console.error('❌ Error:', error.message);
      throw error;
    } finally {
      // Mantener navegador abierto para futuras operaciones
      // await this.claude.close();
    }
  }

  async writeProject(files, outputPath, projectName) {
    fs.mkdirSync(outputPath, { recursive: true });

    for (const [filepath, content] of Object.entries(files)) {
      const fullPath = path.join(outputPath, filepath);
      const dir = path.dirname(fullPath);
      
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(fullPath, content);
      
      console.log(`  ✅ ${filepath}`);
    }
  }

  async generateExtras(outputPath, projectName, language) {
    // Generar .brik-dna.yml
    const brikDna = {
      project: {
        name: projectName,
        version: '1.0.0',
        philosophy: 'DAAF-BRIK-CircuitalidadDigital',
        generated_by: 'Claude Web (Pro/Max Subscription)',
        timestamp: new Date().toISOString()
      },
      language,
      compliance: {
        coverage_requirement: 100,
        immutability_check: true,
        documentation_completeness: true
      }
    };

    fs.writeFileSync(
      path.join(outputPath, '.brik-dna.yml'),
      `# BRIK DNA - Generado con Claude Pro/Max\n${JSON.stringify(brikDna, null, 2)}`
    );

    // Copiar scripts de validación
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

module.exports = {
  ClaudeWebAutomation,
  BrikClaudeWebGenerator
};