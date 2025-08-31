/**
 * 🤖 BRIK AI Agent Manager
 * Sistema de integración con múltiples proveedores de IA
 * Soporta: Claude (Anthropic), Gemini (Google), Codex (OpenAI), GPT-4
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class AIAgentManager {
  constructor() {
    this.providers = {
      claude: new ClaudeProvider(),
      gemini: new GeminiProvider(),
      openai: new OpenAIProvider(),
      codex: new CodexProvider(),
      local: new LocalClaudeCodeProvider() // Integración con Claude Code local
    };
    
    this.activeProvider = null;
    this.config = this.loadConfig();
  }

  loadConfig() {
    const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.brik-ai-config.json');
    
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    
    // Configuración por defecto
    return {
      defaultProvider: 'claude',
      providers: {
        claude: {
          apiKey: process.env.ANTHROPIC_API_KEY,
          model: 'claude-3-opus-20240229',
          maxTokens: 4000
        },
        gemini: {
          apiKey: process.env.GOOGLE_API_KEY,
          model: 'gemini-1.5-pro',
          maxTokens: 8000
        },
        openai: {
          apiKey: process.env.OPENAI_API_KEY,
          model: 'gpt-4-turbo-preview',
          maxTokens: 4000
        },
        codex: {
          apiKey: process.env.OPENAI_API_KEY,
          model: 'code-davinci-002',
          maxTokens: 8000
        }
      },
      localAgent: {
        claudeCodePath: '/usr/local/bin/claude-code', // Path a Claude Code CLI
        enabled: true
      }
    };
  }

  saveConfig(config) {
    const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.brik-ai-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    this.config = config;
  }

  async setProvider(providerName) {
    if (!this.providers[providerName]) {
      throw new Error(`Provider ${providerName} no soportado`);
    }
    
    this.activeProvider = this.providers[providerName];
    await this.activeProvider.initialize(this.config.providers[providerName]);
    
    return true;
  }

  async analyzeProject(description, integrations, language) {
    if (!this.activeProvider) {
      await this.setProvider(this.config.defaultProvider);
    }
    
    const prompt = this.buildAnalysisPrompt(description, integrations, language);
    return await this.activeProvider.complete(prompt);
  }

  async generateBrikCode(analysis, language) {
    const prompt = this.buildCodeGenerationPrompt(analysis, language);
    return await this.activeProvider.generateCode(prompt);
  }

  async restructureProject(projectPath, mode) {
    const projectAnalysis = await this.analyzeExistingProject(projectPath);
    const prompt = this.buildRestructurePrompt(projectAnalysis, mode);
    return await this.activeProvider.complete(prompt);
  }

  buildAnalysisPrompt(description, integrations, language) {
    return `
Analiza el siguiente proyecto y genera una arquitectura BRIK completa:

DESCRIPCIÓN: ${description}
LENGUAJE: ${language}
INTEGRACIONES: ${integrations || 'ninguna'}

Genera un análisis detallado siguiendo los principios BRIK:
1. Identificar entidades CORE (lógica pura)
2. Identificar WRAPPERS (integraciones externas)
3. Definir LIVING LAYER (monitoreo y consciencia)

Devuelve el resultado en formato JSON con la siguiente estructura:
{
  "core": {
    "entities": [],
    "businessRules": [],
    "domainLogic": []
  },
  "wrappers": {
    "integrations": [],
    "adapters": [],
    "repositories": []
  },
  "livingLayer": {
    "monitors": [],
    "analytics": [],
    "consciousness": []
  }
}`;
  }

  buildCodeGenerationPrompt(analysis, language) {
    return `
Genera código ${language} completo para la siguiente arquitectura BRIK:

${JSON.stringify(analysis, null, 2)}

Requisitos:
1. Código 100% funcional y compilable
2. Tests con 100% de cobertura
3. Documentación inline completa
4. Seguir principios DAAF-BRIK-Circuitalidad Digital
5. Implementar las 3 capas: CORE, WRAPPERS, LIVING LAYER

Genera el código completo para cada archivo necesario.
`;
  }

  buildRestructurePrompt(projectAnalysis, mode) {
    return `
Reestructura el siguiente proyecto para cumplir con certificación BRIK:

ANÁLISIS ACTUAL:
${JSON.stringify(projectAnalysis, null, 2)}

MODO: ${mode}

Genera un plan de reestructuración detallado con:
1. Archivos a mover/crear
2. Refactorizaciones necesarias
3. Tests a agregar para 100% cobertura
4. Documentación faltante
5. Scripts de validación BRIK

Devuelve el plan en formato JSON ejecutable.
`;
  }

  async analyzeExistingProject(projectPath) {
    // Analizar estructura del proyecto existente
    const analysis = {
      path: projectPath,
      type: this.detectProjectType(projectPath),
      structure: this.scanProjectStructure(projectPath),
      coverage: await this.checkCoverage(projectPath),
      documentation: this.checkDocumentation(projectPath)
    };
    
    return analysis;
  }

  detectProjectType(projectPath) {
    if (fs.existsSync(path.join(projectPath, 'Cargo.toml'))) return 'rust';
    if (fs.existsSync(path.join(projectPath, 'package.json'))) return 'typescript';
    if (fs.existsSync(path.join(projectPath, 'requirements.txt'))) return 'python';
    if (fs.existsSync(path.join(projectPath, 'go.mod'))) return 'go';
    return 'unknown';
  }

  scanProjectStructure(projectPath, relativePath = '') {
    const structure = {};
    const fullPath = path.join(projectPath, relativePath);
    
    try {
      const items = fs.readdirSync(fullPath);
      
      items.forEach(item => {
        if (item.startsWith('.') || item === 'node_modules' || item === 'target') return;
        
        const itemPath = path.join(fullPath, item);
        const relativeItemPath = path.join(relativePath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          structure[item] = this.scanProjectStructure(projectPath, relativeItemPath);
        } else {
          structure[item] = {
            type: 'file',
            size: stats.size,
            extension: path.extname(item)
          };
        }
      });
    } catch (error) {
      console.error(`Error scanning ${fullPath}: ${error.message}`);
    }
    
    return structure;
  }

  async checkCoverage(projectPath) {
    // Intentar obtener cobertura actual del proyecto
    try {
      const coverageScript = path.join(projectPath, 'scripts', 'test-coverage.sh');
      if (fs.existsSync(coverageScript)) {
        // Ejecutar script de cobertura
        return { exists: true, percentage: 'unknown' };
      }
    } catch {}
    
    return { exists: false, percentage: 0 };
  }

  checkDocumentation(projectPath) {
    const docsPath = path.join(projectPath, 'docs');
    const hasDocs = fs.existsSync(docsPath);
    
    if (!hasDocs) return { exists: false, completeness: 0 };
    
    const categories = ['product', 'technical', 'operational'];
    const found = categories.filter(cat => 
      fs.existsSync(path.join(docsPath, cat))
    );
    
    return {
      exists: true,
      completeness: (found.length / categories.length) * 100,
      categories: found
    };
  }
}

// Provider Base Class
class AIProvider {
  async initialize(config) {
    this.config = config;
    this.validateConfig();
  }

  validateConfig() {
    if (!this.config.apiKey) {
      throw new Error(`API Key no configurada para ${this.constructor.name}`);
    }
  }

  async complete(prompt) {
    throw new Error('Método complete debe ser implementado por el provider');
  }

  async generateCode(prompt) {
    return this.complete(prompt);
  }
}

// Claude Provider (Anthropic)
class ClaudeProvider extends AIProvider {
  async complete(prompt) {
    const data = JSON.stringify({
      model: this.config.model || 'claude-3-opus-20240229',
      max_tokens: this.config.maxTokens || 4000,
      messages: [{
        role: 'user',
        content: prompt
      }],
      system: `Eres un experto en arquitectura BRIK y principios DAAF-Circuitalidad Digital. 
                Generas código de máxima calidad con 100% de cobertura.
                Sigues estrictamente la filosofía de 3 capas: CORE, WRAPPERS, LIVING LAYER.`
    });

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': data.length
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            if (response.error) {
              reject(new Error(response.error.message));
            } else {
              resolve(response.content[0].text);
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }
}

// Gemini Provider (Google)
class GeminiProvider extends AIProvider {
  async complete(prompt) {
    const data = JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: this.config.maxTokens || 8000,
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${this.config.model || 'gemini-1.5-pro'}:generateContent?key=${this.config.apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            if (response.error) {
              reject(new Error(response.error.message));
            } else {
              resolve(response.candidates[0].content.parts[0].text);
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }
}

// OpenAI Provider (GPT-4)
class OpenAIProvider extends AIProvider {
  async complete(prompt) {
    const data = JSON.stringify({
      model: this.config.model || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `Eres un experto en arquitectura BRIK y principios DAAF-Circuitalidad Digital. 
                    Generas código de máxima calidad con 100% de cobertura.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: this.config.maxTokens || 4000,
      temperature: 0.7
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Length': data.length
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            if (response.error) {
              reject(new Error(response.error.message));
            } else {
              resolve(response.choices[0].message.content);
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }
}

// Codex Provider (OpenAI Codex)
class CodexProvider extends AIProvider {
  async generateCode(prompt) {
    const data = JSON.stringify({
      model: this.config.model || 'code-davinci-002',
      prompt: prompt,
      max_tokens: this.config.maxTokens || 8000,
      temperature: 0.3,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Length': data.length
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            if (response.error) {
              reject(new Error(response.error.message));
            } else {
              resolve(response.choices[0].text);
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }
}

// Local Claude Code Provider
class LocalClaudeCodeProvider extends AIProvider {
  async initialize(config) {
    this.config = config;
    // Verificar si Claude Code está instalado localmente
    const { exec } = require('child_process');
    
    return new Promise((resolve, reject) => {
      exec('which claude-code || which claude', (error, stdout) => {
        if (error) {
          console.warn('Claude Code no encontrado localmente');
          resolve(false);
        } else {
          this.claudePath = stdout.trim();
          console.log(`Claude Code encontrado en: ${this.claudePath}`);
          resolve(true);
        }
      });
    });
  }

  async complete(prompt) {
    if (!this.claudePath) {
      throw new Error('Claude Code no está disponible localmente');
    }

    const { exec } = require('child_process');
    const tempFile = `/tmp/brik-prompt-${Date.now()}.txt`;
    
    // Escribir prompt a archivo temporal
    fs.writeFileSync(tempFile, prompt);

    return new Promise((resolve, reject) => {
      exec(`${this.claudePath} --file "${tempFile}"`, (error, stdout, stderr) => {
        // Limpiar archivo temporal
        fs.unlinkSync(tempFile);
        
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}

module.exports = AIAgentManager;