#!/usr/bin/env node

/**
 * BRIK Knowledge Loader
 * Extrae toda la metodología BRIK del proyecto para crear el contexto omnisciente de Claude
 */

const fs = require('fs').promises;
const path = require('path');

class BRIKKnowledgeLoader {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.knowledge = {
      methodology: {},
      templates: {},
      generators: {},
      examples: {},
      documentation: {},
      certification: {}
    };
  }

  /**
   * Carga todo el conocimiento BRIK del proyecto
   */
  async loadAll() {
    console.log('🧠 Cargando conocimiento BRIK omnisciente...');
    
    await this.loadMethodology();
    await this.loadTemplates();
    await this.loadGenerators();
    await this.loadExamples();
    await this.loadDocumentation();
    await this.loadCertification();
    
    console.log('✅ Conocimiento BRIK completamente cargado');
    return this.knowledge;
  }

  /**
   * Carga la metodología fundamental BRIK
   */
  async loadMethodology() {
    const methodologyFiles = [
      'CIRCUITALIDAD.md',
      'brikseed/docs/BRIK_CORE_FRAMEWORK.md',
      'brikseed/docs/BRIK4.0_FUNDACIONAL.md',
      'brikseed/docs/DAAF_AI_v1.0.md',
      'brikseed/docs/ADN_FUNDACIONAL.md',
      'brikseed/docs/brik-v5-manifiesto-fundacional.md'
    ];

    for (const file of methodologyFiles) {
      try {
        const filePath = path.join(this.rootPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const key = path.basename(file, '.md');
        this.knowledge.methodology[key] = {
          path: filePath,
          content: content,
          summary: this.extractSummary(content)
        };
      } catch (error) {
        console.warn(`⚠️ No se pudo cargar ${file}: ${error.message}`);
      }
    }
  }

  /**
   * Carga todos los templates BRIK
   */
  async loadTemplates() {
    try {
      const templatesDir = path.join(this.rootPath, 'templates');
      await this.loadDirectory(templatesDir, this.knowledge.templates);
    } catch (error) {
      console.warn(`⚠️ No se pudieron cargar templates: ${error.message}`);
    }
  }

  /**
   * Carga todos los generadores
   */
  async loadGenerators() {
    try {
      const generatorsDir = path.join(this.rootPath, 'generators');
      await this.loadDirectory(generatorsDir, this.knowledge.generators);
    } catch (error) {
      console.warn(`⚠️ No se pudieron cargar generators: ${error.message}`);
    }
  }

  /**
   * Carga ejemplos de proyectos BRIK
   */
  async loadExamples() {
    const exampleDirs = ['demo-ts', 'demo-py', 'demo-brik', 'test-ecommerce'];
    
    for (const dir of exampleDirs) {
      try {
        const examplePath = path.join(this.rootPath, dir);
        this.knowledge.examples[dir] = {};
        await this.loadDirectory(examplePath, this.knowledge.examples[dir], 2); // Profundidad limitada
      } catch (error) {
        console.warn(`⚠️ No se pudo cargar ejemplo ${dir}: ${error.message}`);
      }
    }
  }

  /**
   * Carga documentación técnica
   */
  async loadDocumentation() {
    const docFiles = [
      'README.md',
      'CONTRIBUTING.md',
      'brikseed/docs/Glosario DAAF AI v1.0.md',
      'V1_MASTER_PLAN_EXECUTION_SUMMARY.md'
    ];

    for (const file of docFiles) {
      try {
        const filePath = path.join(this.rootPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const key = path.basename(file, '.md');
        this.knowledge.documentation[key] = {
          path: filePath,
          content: content
        };
      } catch (error) {
        console.warn(`⚠️ No se pudo cargar doc ${file}: ${error.message}`);
      }
    }
  }

  /**
   * Carga información sobre certificación BRIK
   */
  async loadCertification() {
    try {
      const certFiles = await this.findFiles(this.rootPath, /certification|cert/i);
      for (const file of certFiles) {
        const content = await fs.readFile(file, 'utf-8');
        const key = path.basename(file, path.extname(file));
        this.knowledge.certification[key] = {
          path: file,
          content: content
        };
      }
    } catch (error) {
      console.warn(`⚠️ No se pudo cargar certificación: ${error.message}`);
    }
  }

  /**
   * Carga un directorio completo de forma recursiva
   */
  async loadDirectory(dirPath, target, maxDepth = 3, currentDepth = 0) {
    if (currentDepth >= maxDepth) return;

    try {
      const items = await fs.readdir(dirPath);
      
      for (const item of items) {
        if (item.startsWith('.') || item === 'node_modules') continue;
        
        const itemPath = path.join(dirPath, item);
        const stat = await fs.stat(itemPath);
        
        if (stat.isDirectory()) {
          target[item] = {};
          await this.loadDirectory(itemPath, target[item], maxDepth, currentDepth + 1);
        } else if (this.isRelevantFile(item)) {
          const content = await fs.readFile(itemPath, 'utf-8');
          target[item] = {
            path: itemPath,
            content: content,
            type: path.extname(item),
            size: stat.size
          };
        }
      }
    } catch (error) {
      console.warn(`⚠️ Error cargando directorio ${dirPath}: ${error.message}`);
    }
  }

  /**
   * Encuentra archivos por patrón
   */
  async findFiles(dirPath, pattern, maxDepth = 3, currentDepth = 0) {
    const results = [];
    
    if (currentDepth >= maxDepth) return results;

    try {
      const items = await fs.readdir(dirPath);
      
      for (const item of items) {
        if (item.startsWith('.') || item === 'node_modules') continue;
        
        const itemPath = path.join(dirPath, item);
        const stat = await fs.stat(itemPath);
        
        if (stat.isDirectory()) {
          const subResults = await this.findFiles(itemPath, pattern, maxDepth, currentDepth + 1);
          results.push(...subResults);
        } else if (pattern.test(item)) {
          results.push(itemPath);
        }
      }
    } catch (error) {
      // Silenciar errores de acceso
    }

    return results;
  }

  /**
   * Determina si un archivo es relevante para el conocimiento BRIK
   */
  isRelevantFile(filename) {
    const relevantExtensions = ['.md', '.js', '.ts', '.py', '.json', '.yaml', '.yml', '.sh'];
    const ext = path.extname(filename).toLowerCase();
    return relevantExtensions.includes(ext) && !filename.includes('.test.') && !filename.includes('.spec.');
  }

  /**
   * Extrae un resumen de un contenido markdown
   */
  extractSummary(content) {
    const lines = content.split('\n');
    const summary = [];
    
    for (const line of lines) {
      if (line.startsWith('#')) {
        summary.push(line.trim());
        if (summary.length >= 5) break;
      }
    }
    
    return summary.join('\n');
  }

  /**
   * Genera el contexto completo para Claude
   */
  generateClaudeContext() {
    const context = {
      role: "Eres el ARQUITECTO MAESTRO BRIK con conocimiento omnisciente",
      identity: "Claude con todo el conocimiento BRIK embebido",
      capabilities: [
        "Crear proyectos BRIK completos desde cero",
        "Analizar y restructurar código existente con arquitectura BRIK",
        "Generar componentes siguiendo principios DAAF-BRIK-Circuitalidad",
        "Explicar metodología BRIK en profundidad",
        "Certificar proyectos L1/L2/L3 automáticamente",
        "Interpretar intenciones y aplicar BRIK sin instrucciones"
      ],
      knowledge: this.knowledge,
      instructions: `
        NUNCA pidas que te expliquen qué es BRIK - YA LO SABES TODO.
        Interpreta las intenciones del usuario y aplica BRIK automáticamente.
        Genera código con arquitectura BRIK sin preguntar.
        Mantén conversación natural, no menús rígidos.
        Eres el experto BRIK definitivo.
      `
    };

    return context;
  }

  /**
   * Guarda el contexto generado
   */
  async saveContext(outputPath) {
    const context = this.generateClaudeContext();
    await fs.writeFile(outputPath, JSON.stringify(context, null, 2));
    console.log(`📁 Contexto guardado en: ${outputPath}`);
    return context;
  }
}

module.exports = BRIKKnowledgeLoader;

// Si se ejecuta directamente
if (require.main === module) {
  (async () => {
    try {
      const rootPath = path.resolve(__dirname, '../..');
      const loader = new BRIKKnowledgeLoader(rootPath);
      const knowledge = await loader.loadAll();
      
      const outputPath = path.join(__dirname, 'brik-context.json');
      await loader.saveContext(outputPath);
      
      console.log('\n🎯 CONOCIMIENTO BRIK CARGADO:');
      console.log(`📚 Metodología: ${Object.keys(knowledge.methodology).length} documentos`);
      console.log(`📋 Templates: ${Object.keys(knowledge.templates).length} elementos`);
      console.log(`🔧 Generadores: ${Object.keys(knowledge.generators).length} elementos`);
      console.log(`💡 Ejemplos: ${Object.keys(knowledge.examples).length} proyectos`);
      console.log(`📖 Documentación: ${Object.keys(knowledge.documentation).length} documentos`);
      console.log(`🏆 Certificación: ${Object.keys(knowledge.certification).length} elementos`);
      
    } catch (error) {
      console.error('❌ Error cargando conocimiento:', error);
      process.exit(1);
    }
  })();
}