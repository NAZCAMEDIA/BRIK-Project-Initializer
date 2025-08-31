#!/usr/bin/env node

/**
 * BRIK Claude Context Manager
 * Gestiona el contexto omnisciente de Claude con todo el conocimiento BRIK
 */

const BRIKKnowledgeLoader = require('../knowledge/loader');

class BRIKClaudeContextManager {
  constructor() {
    this.context = null;
    this.knowledge = null;
    this.systemPrompt = null;
  }

  /**
   * Inicializa Claude con conocimiento BRIK completo
   */
  async initialize(rootPath) {
    console.log('🧠 Inicializando Claude con conocimiento BRIK omnisciente...');
    
    // Cargar todo el conocimiento BRIK
    const loader = new BRIKKnowledgeLoader(rootPath);
    this.knowledge = await loader.loadAll();
    
    // Generar contexto para Claude
    this.context = this.generateFullContext();
    this.systemPrompt = this.generateSystemPrompt();
    
    console.log('✅ Claude inicializado como MAESTRO BRIK');
    return this.context;
  }

  /**
   * Genera el contexto completo para Claude
   */
  generateFullContext() {
    const context = {
      identity: {
        role: "ARQUITECTO MAESTRO BRIK",
        name: "Claude BRIK Omnisciente",
        description: "IA con conocimiento completo de la metodología DAAF-BRIK-Circuitalidad"
      },
      
      core_knowledge: {
        methodology: this.extractMethodologyCore(),
        principles: this.extractCorePrinciples(),
        architecture: this.extractArchitecturalPatterns(),
        certification: this.extractCertificationCriteria()
      },
      
      capabilities: [
        "Crear proyectos BRIK completos desde cero",
        "Interpretar intenciones y aplicar arquitectura BRIK automáticamente", 
        "Generar código siguiendo principios DAAF-BRIK-Circuitalidad",
        "Restructurar proyectos existentes con arquitectura BRIK",
        "Certificar proyectos L1/L2/L3 automáticamente",
        "Explicar metodología BRIK sin necesidad de instrucciones",
        "Mantener conversación natural sobre desarrollo BRIK"
      ],
      
      templates: this.processTemplates(),
      examples: this.processExamples(),
      
      behavior_rules: [
        "NUNCA preguntes qué es BRIK - ya lo conoces completamente",
        "Interpreta intenciones del usuario y aplica BRIK automáticamente",
        "Mantén conversación natural, evita menús rígidos",
        "Genera código con arquitectura BRIK sin pedir confirmación",
        "Eres el experto BRIK definitivo - actúa con confianza",
        "Proporciona soluciones completas, no fragmentos"
      ],
      
      conversation_style: {
        greeting: "¡Hola! Soy tu arquitecto BRIK. ¿Qué proyecto vamos a crear hoy?",
        approach: "conversational",
        tone: "expert_friendly",
        decision_making: "autonomous_with_explanation"
      }
    };

    return context;
  }

  /**
   * Extrae el núcleo de la metodología
   */
  extractMethodologyCore() {
    const core = {};
    
    if (this.knowledge.methodology.CIRCUITALIDAD) {
      core.circuitalidad = this.extractKeyPoints(this.knowledge.methodology.CIRCUITALIDAD.content);
    }
    
    if (this.knowledge.methodology.BRIK_CORE_FRAMEWORK) {
      core.framework = this.extractKeyPoints(this.knowledge.methodology.BRIK_CORE_FRAMEWORK.content);
    }
    
    if (this.knowledge.methodology.DAAF_AI_v1) {
      core.daaf = this.extractKeyPoints(this.knowledge.methodology.DAAF_AI_v1.content);
    }

    return core;
  }

  /**
   * Extrae principios fundamentales
   */
  extractCorePrinciples() {
    return {
      separation_of_concerns: "CORE (lógica) + WRAPPERS (interfaces) + LIVING_LAYER (configuración)",
      immutability: "Entidades y objetos de valor inmutables",
      testability: "100% cobertura de tests, TDD obligatorio",
      modularity: "Componentes independientes y reutilizables",
      scalability: "Arquitectura que crece sin degradación",
      maintainability: "Código auto-documentado y fácil de modificar"
    };
  }

  /**
   * Extrae patrones arquitectónicos
   */
  extractArchitecturalPatterns() {
    return {
      structure: {
        CORE: "Lógica de negocio pura, entidades, casos de uso",
        WRAPPERS: "Controllers, routers, APIs, integraciones externas", 
        LIVING_LAYER: "Configuración, estado mutable, variables de entorno"
      },
      patterns: {
        entities: "Objetos inmutables con identidad única",
        value_objects: "Objetos inmutables sin identidad",
        repositories: "Abstracciones para persistencia de datos",
        services: "Lógica de aplicación y coordinación",
        factories: "Creación de objetos complejos"
      }
    };
  }

  /**
   * Extrae criterios de certificación
   */
  extractCertificationCriteria() {
    return {
      L1: ["Estructura BRIK básica", "Tests unitarios", "Documentación mínima"],
      L2: ["Arquitectura completa", "Cobertura >90%", "Integración continua"],
      L3: ["Excelencia técnica", "100% cobertura", "Documentación completa", "Performance optimizado"]
    };
  }

  /**
   * Procesa templates disponibles
   */
  processTemplates() {
    const processed = {};
    
    for (const [name, template] of Object.entries(this.knowledge.templates || {})) {
      if (template.content) {
        processed[name] = {
          purpose: this.inferTemplatePurpose(name),
          content: template.content,
          usage: this.generateTemplateUsage(name)
        };
      }
    }
    
    return processed;
  }

  /**
   * Procesa ejemplos de proyectos
   */
  processExamples() {
    const processed = {};
    
    for (const [name, example] of Object.entries(this.knowledge.examples || {})) {
      processed[name] = {
        type: this.inferExampleType(name),
        structure: this.extractDirectoryStructure(example),
        key_files: this.identifyKeyFiles(example)
      };
    }
    
    return processed;
  }

  /**
   * Genera el system prompt para Claude
   */
  generateSystemPrompt() {
    return `# CLAUDE BRIK OMNISCIENTE - ARQUITECTO MAESTRO

## IDENTIDAD
Eres Claude con conocimiento COMPLETO de la metodología DAAF-BRIK-Circuitalidad. 
NO necesitas que te expliquen qué es BRIK - ya lo dominas completamente.

## CONOCIMIENTO EMBEBIDO
Tienes acceso total a:
- Metodología DAAF-BRIK-Circuitalidad completa
- Todos los templates y generadores
- Ejemplos de proyectos certificados
- Criterios de certificación L1/L2/L3
- Patrones arquitectónicos BRIK

## COMPORTAMIENTO
- Interpreta intenciones del usuario automáticamente
- Aplica arquitectura BRIK sin preguntar
- Mantén conversación natural (sin menús)
- Genera soluciones completas
- Actúa con confianza de experto
- Proporciona código production-ready

## CAPACIDADES PRINCIPALES
1. Crear proyectos BRIK desde cero
2. Restructurar código existente con BRIK
3. Generar componentes certificados
4. Explicar decisiones arquitectónicas
5. Certificar proyectos automáticamente

## ARQUITECTURA BRIK CORE
\`\`\`
CORE/               (Lógica de negocio pura)
├── domain/         (Entidades, Value Objects)
├── application/    (Casos de uso, Services)
└── infrastructure/ (Contratos, Interfaces)

WRAPPERS/           (Interfaces externas)
├── api/            (REST, GraphQL)
├── cli/            (Comandos)
└── integrations/   (Servicios externos)

LIVING_LAYER/       (Configuración y estado)
├── config/         (Variables, settings)
└── state/          (Estado mutable)
\`\`\`

Cuando el usuario te pida crear algo, interpreta su intención y aplica BRIK automáticamente.
Eres el experto BRIK definitivo - actúa con esa autoridad.`;
  }

  /**
   * Utilidades para procesamiento
   */
  extractKeyPoints(content) {
    const lines = content.split('\n');
    const points = [];
    
    for (const line of lines) {
      if (line.match(/^#+\s+/) || line.match(/^\*\s+/) || line.match(/^-\s+/)) {
        points.push(line.trim());
      }
    }
    
    return points.slice(0, 20); // Limitar a puntos más importantes
  }

  inferTemplatePurpose(name) {
    const purposeMap = {
      'controller': 'REST API controller template',
      'entity': 'Domain entity template', 
      'service': 'Application service template',
      'repository': 'Data repository template',
      'test': 'Unit test template'
    };
    
    for (const [key, purpose] of Object.entries(purposeMap)) {
      if (name.toLowerCase().includes(key)) return purpose;
    }
    
    return `Template for ${name}`;
  }

  generateTemplateUsage(name) {
    return `Use this template when creating ${name} components in BRIK architecture`;
  }

  inferExampleType(name) {
    if (name.includes('ts')) return 'TypeScript project';
    if (name.includes('py')) return 'Python project'; 
    if (name.includes('ecommerce')) return 'E-commerce application';
    return 'BRIK example project';
  }

  extractDirectoryStructure(example) {
    if (typeof example !== 'object') return {};
    
    const structure = {};
    for (const [key, value] of Object.entries(example)) {
      if (typeof value === 'object' && !value.content) {
        structure[key] = Object.keys(value);
      }
    }
    return structure;
  }

  identifyKeyFiles(example) {
    const keyFiles = [];
    const important = ['package.json', 'CIRCUITALIDAD.md', 'README.md', 'main.ts', 'main.js', 'app.py'];
    
    this.findFilesRecursive(example, keyFiles, important);
    return keyFiles;
  }

  findFilesRecursive(obj, results, important, path = '') {
    if (typeof obj !== 'object') return;
    
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}/${key}` : key;
      
      if (value && value.content && important.some(imp => key.includes(imp))) {
        results.push(currentPath);
      } else if (typeof value === 'object' && !value.content) {
        this.findFilesRecursive(value, results, important, currentPath);
      }
    }
  }

  /**
   * Obtiene el contexto actual
   */
  getContext() {
    return this.context;
  }

  /**
   * Obtiene el system prompt
   */
  getSystemPrompt() {
    return this.systemPrompt;
  }

  /**
   * Obtiene conocimiento específico
   */
  getKnowledge(category = null) {
    if (category) {
      return this.knowledge[category] || {};
    }
    return this.knowledge;
  }
}

module.exports = BRIKClaudeContextManager;

// Si se ejecuta directamente
if (require.main === module) {
  (async () => {
    try {
      const path = require('path');
      const rootPath = path.resolve(__dirname, '../..');
      
      const contextManager = new BRIKClaudeContextManager();
      const context = await contextManager.initialize(rootPath);
      
      console.log('\n🎯 CONTEXTO CLAUDE GENERADO:');
      console.log(`🧠 Identidad: ${context.identity.name}`);
      console.log(`📚 Capacidades: ${context.capabilities.length} elementos`);
      console.log(`📋 Templates: ${Object.keys(context.templates).length} disponibles`);
      console.log(`💡 Ejemplos: ${Object.keys(context.examples).length} proyectos`);
      console.log(`🎨 Estilo: ${context.conversation_style.approach}`);
      
      // Guardar contexto completo
      const fs = require('fs').promises;
      const outputPath = path.join(__dirname, 'claude-brik-context.json');
      await fs.writeFile(outputPath, JSON.stringify(context, null, 2));
      console.log(`📁 Contexto guardado en: ${outputPath}`);
      
    } catch (error) {
      console.error('❌ Error generando contexto:', error);
      process.exit(1);
    }
  })();
}