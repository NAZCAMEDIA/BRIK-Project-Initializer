#!/usr/bin/env node
/**
 * 🏗️ BRIK Architecture Classifier - Clasificación Inteligente CORE/WRAPPERS/LIVING
 * 
 * Clasifica cada componente del sistema según filosofía BRIK:
 * - CORE: Lógica inmutable, reglas de negocio fundamentales
 * - WRAPPERS: Integraciones, adaptadores, servicios externos
 * - LIVING_LAYER: Monitoreo, análisis, auto-diagnóstico
 * 
 * Filosofía BRIK: Inmutabilidad inteligente
 */

const fs = require('fs');
const path = require('path');

// Importar domain analyzer si está disponible
const { DomainAnalyzer } = require('./domain-analyzer.js');

class ArchitectureClassifier {
    constructor() {
        this.brikPrinciples = this.loadBRIKPrinciples();
    }

    loadBRIKPrinciples() {
        return {
            CORE: {
                description: "Lógica de negocio inmutable, entidades del dominio, validaciones críticas",
                criteria: [
                    "Business rules that never change",
                    "Core domain entities and their invariants", 
                    "Critical validation logic",
                    "Data integrity constraints",
                    "Pure functions without side effects"
                ],
                forbidden: [
                    "External service calls",
                    "Database connections",
                    "Network operations",
                    "File system access",
                    "Configuration dependencies"
                ]
            },
            WRAPPERS: {
                description: "Adaptadores configurables, integraciones externas, servicios técnicos",
                criteria: [
                    "External service integrations",
                    "Database adapters and repositories",
                    "HTTP clients and API wrappers",
                    "Cache implementations",
                    "Configuration-driven components"
                ],
                characteristics: [
                    "Can be replaced without changing core",
                    "Configuration-dependent behavior",
                    "Side effects and I/O operations",
                    "Technology-specific implementations"
                ]
            },
            LIVING_LAYER: {
                description: "Inteligencia adaptativa, monitoreo, análisis en tiempo real",
                criteria: [
                    "Performance monitoring and metrics",
                    "Error analysis and diagnostics",
                    "Adaptive optimization",
                    "LLM-powered analysis",
                    "Auto-healing mechanisms"
                ],
                characteristics: [
                    "Real-time analysis and adaptation",
                    "Machine learning components",
                    "Anomaly detection",
                    "Self-diagnostic capabilities"
                ]
            }
        };
    }

    /**
     * Clasifica una análisis de dominio en arquitectura BRIK
     * REFACTORIZADO: Lee domain-analysis.json dinámicamente en lugar de usar Mock LLM hardcoded
     */
    async classify(domainAnalysis, options = {}) {
        if (process.env.OUTPUT_JSON !== '1') {
            console.log('🏗️ Clasificando arquitectura según principios BRIK...');
        }

        // Preparar contexto para LLM
        const classificationContext = this.buildClassificationContext(domainAnalysis);
        
        // Clasificar componentes DINÁMICAMENTE basado en domainAnalysis real
        const classification = await this.performDynamicClassification(classificationContext, domainAnalysis);
        
        // Validar y refinar clasificación
        const refinedClassification = this.refineClassification(classification, domainAnalysis);
        
        // Generar mapeo de arquitectura
        const architectureMap = this.generateArchitectureMap(refinedClassification, domainAnalysis);
        
        // Guardar clasificación (solo si no es pipeline)
        if (process.env.OUTPUT_JSON !== '1') {
            await this.saveClassification(architectureMap, 'architecture-classification.json');
            console.log('✅ Clasificación arquitectónica completada');
        }
        
        return architectureMap;
    }

    buildClassificationContext(domainAnalysis) {
        return {
            project: {
                name: domainAnalysis.projectName,
                description: domainAnalysis.description,
                type: domainAnalysis.technical.architecture_type
            },
            components: {
                entities: domainAnalysis.domain.entities,
                useCases: domainAnalysis.domain.useCases,
                businessRules: domainAnalysis.domain.businessRules,
                integrations: domainAnalysis.domain.integrations
            },
            technical: domainAnalysis.technical
        };
    }

    /**
     * NUEVO: Clasificación dinámica basada en domain-analysis.json real
     * Elimina dependencia del Mock LLM hardcoded
     */
    async performDynamicClassification(context, domainAnalysis) {
        // Verificar si hay API keys disponibles para LLM real
        if (process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY) {
            try {
                const classificationPrompt = this.buildClassificationPrompt(context);
                const analyzer = new DomainAnalyzer();
                const llmResponse = await analyzer.queryLLM(classificationPrompt);
                return this.parseClassificationResponse(llmResponse);
            } catch (error) {
                if (process.env.OUTPUT_JSON !== '1') {
                    console.log('🔄 LLM error, falling back to dynamic classification...');
                }
                // Fallback a clasificación dinámica en lugar de mock hardcoded
            }
        } else {
            if (process.env.OUTPUT_JSON !== '1') {
                console.log('⚠️ No API key found, using dynamic classification based on domain analysis...');
            }
        }
        
        // NUEVA LÓGICA: Generar clasificación dinámica basada en entidades reales
        return this.generateDynamicClassification(domainAnalysis);
    }

    buildClassificationPrompt(context) {
        return `
Eres un experto en arquitectura BRIK especializado en clasificación de componentes.

PRINCIPIOS BRIK:

🎯 CORE (Inmutable):
- Lógica de negocio que NUNCA cambia
- Entidades del dominio y sus invariantes
- Validaciones críticas de datos
- Funciones puras sin efectos secundarios
- PROHIBIDO: llamadas externas, configuración, I/O

🔧 WRAPPERS (Configurables):  
- Integraciones con servicios externos
- Adaptadores de base de datos
- Clientes HTTP y APIs
- Implementaciones de cache
- Componentes dependientes de configuración

🤖 LIVING_LAYER (Adaptativo):
- Monitoreo de performance y métricas
- Análisis de errores y diagnósticos
- Optimización adaptativa
- Análisis con LLM
- Mecanismos de auto-sanación

CONTEXTO DEL PROYECTO:
Nombre: ${context.project.name}
Tipo: ${context.project.type}
Descripción: ${context.project.description}

COMPONENTES A CLASIFICAR:

ENTIDADES:
${context.components.entities.map(e => `- ${e.name}: ${e.description}`).join('\n')}

CASOS DE USO:
${context.components.useCases.map(u => `- ${u.name}: ${u.description}`).join('\n')}

REGLAS DE NEGOCIO:
${context.components.businessRules.map(r => `- ${r.name}: ${r.description}`).join('\n')}

INTEGRACIONES:
${context.components.integrations.map(i => `- ${i.name} (${i.type}): ${i.description}`).join('\n')}

Clasifica cada componente en la arquitectura BRIK apropiada. Responde con JSON estricto:

{
  "classification": {
    "CORE": {
      "entities": [
        {
          "name": "EntityName",
          "layer": "CORE",
          "reason": "Razón específica de clasificación",
          "components": [
            {
              "type": "domain_entity",
              "name": "ComponentName", 
              "description": "Qué hace específicamente",
              "responsibilities": ["responsabilidad1", "responsabilidad2"]
            }
          ]
        }
      ],
      "business_logic": [
        {
          "name": "BusinessRule",
          "layer": "CORE",
          "reason": "Por qué es inmutable",
          "implementation": "Cómo se implementa"
        }
      ]
    },
    "WRAPPERS": {
      "integrations": [
        {
          "name": "IntegrationName",
          "layer": "WRAPPERS", 
          "reason": "Por qué es configurable",
          "technology": "Tecnología específica",
          "configuration_points": ["punto1", "punto2"]
        }
      ],
      "repositories": [
        {
          "name": "EntityRepository",
          "layer": "WRAPPERS",
          "reason": "Abstrae persistencia",
          "operations": ["create", "read", "update", "delete"]
        }
      ]
    },
    "LIVING_LAYER": {
      "monitoring": [
        {
          "name": "ComponentName",
          "layer": "LIVING_LAYER",
          "reason": "Proporciona inteligencia adaptativa",
          "capabilities": ["capability1", "capability2"]
        }
      ]
    }
  },
  "architecture_summary": {
    "total_components": 0,
    "core_percentage": 0,
    "wrappers_percentage": 0,
    "living_percentage": 0,
    "complexity_assessment": "low|medium|high",
    "brik_compliance_score": 0.0
  }
}

INSTRUCCIONES CRÍTICAS:
1. Clasifica TODOS los componentes identificados
2. Justifica cada clasificación con "reason"  
3. CORE debe ser completamente independiente de tecnología
4. WRAPPERS pueden tener dependencias externas
5. LIVING_LAYER debe tener capacidades adaptativas
6. Calcula percentajes y score de cumplimiento BRIK
7. Responde SOLO con JSON válido
`.trim();
    }

    parseClassificationResponse(response) {
        try {
            const cleanResponse = response
                .replace(/```json\s*/g, '')
                .replace(/```\s*/g, '')
                .trim();
            
            return JSON.parse(cleanResponse);
        } catch (error) {
            console.error('❌ Error parseando clasificación LLM:', error.message);
            console.error('Respuesta recibida:', response);
            throw new Error('Respuesta de clasificación no es JSON válido');
        }
    }

    refineClassification(classification, originalAnalysis) {
        // Validar que todos los componentes principales estén clasificados
        const refinements = {
            validation_passed: true,
            warnings: [],
            adjustments: []
        };

        // Verificar que hay componentes en CORE
        if (!classification.classification.CORE.entities?.length && !classification.classification.CORE.business_logic?.length) {
            refinements.warnings.push("No se encontraron componentes CORE - proyecto podría ser principalmente integraciones");
        }

        // Verificar balance arquitectónico
        const summary = classification.architecture_summary;
        if (summary.core_percentage < 20) {
            refinements.warnings.push("Muy pocos componentes CORE - revisar lógica de negocio");
        }

        if (summary.wrappers_percentage > 70) {
            refinements.warnings.push("Demasiados WRAPPERS - posible sobre-ingeniería");
        }

        return {
            ...classification,
            refinement: refinements,
            metadata: {
                classifiedAt: new Date().toISOString(),
                brikVersion: '5.0',
                analyzer: 'BRIK Architecture Classifier v1.0'
            }
        };
    }

    generateArchitectureMap(classification, domainAnalysis) {
        // Generar mapa completo de arquitectura para generación de código
        return {
            project: {
                name: domainAnalysis.projectName,
                type: domainAnalysis.technical.architecture_type,
                language: domainAnalysis.metadata.targetLanguage
            },
            
            architecture: classification.classification,
            
            implementation_plan: {
                CORE: {
                    directory: 'src/core',
                    files: this.generateCoreFiles(classification.classification.CORE),
                    dependencies: [], // CORE no puede tener dependencias externas
                    tests: { coverage_required: 100 }
                },
                
                WRAPPERS: {
                    directory: 'src/components',
                    files: this.generateWrapperFiles(classification.classification.WRAPPERS),
                    dependencies: this.extractWrapperDependencies(classification.classification.WRAPPERS),
                    tests: { coverage_required: 95 }
                },
                
                LIVING_LAYER: {
                    directory: 'src/living-layer',
                    files: this.generateLivingFiles(classification.classification.LIVING_LAYER),
                    dependencies: ['metrics', 'monitoring', 'llm-client'],
                    tests: { coverage_required: 85 }
                }
            },
            
            deployment: {
                docker_required: domainAnalysis.domain.integrations.length > 2,
                environment_configs: this.generateEnvironmentConfigs(classification),
                health_checks: this.generateHealthChecks(classification)
            },
            
            validation: classification.refinement,
            metadata: classification.metadata
        };
    }

    generateCoreFiles(coreClassification) {
        const files = [];
        
        // Entidades del dominio
        if (coreClassification.entities) {
            coreClassification.entities.forEach(entity => {
                files.push({
                    name: `${entity.name.toLowerCase()}.rs`, // Asumiendo Rust por defecto
                    type: 'domain_entity',
                    components: entity.components || []
                });
            });
        }

        // Lógica de negocio
        if (coreClassification.business_logic) {
            files.push({
                name: 'business_rules.rs',
                type: 'business_logic',
                rules: coreClassification.business_logic
            });
        }

        return files;
    }

    generateWrapperFiles(wrappersClassification) {
        const files = [];
        
        // Integraciones
        if (wrappersClassification.integrations) {
            wrappersClassification.integrations.forEach(integration => {
                files.push({
                    name: `${integration.name.toLowerCase()}_wrapper.rs`,
                    type: 'integration_wrapper',
                    technology: integration.technology,
                    config: integration.configuration_points || []
                });
            });
        }

        // Repositorios
        if (wrappersClassification.repositories) {
            wrappersClassification.repositories.forEach(repo => {
                files.push({
                    name: `${repo.name.toLowerCase()}.rs`,
                    type: 'repository',
                    operations: repo.operations
                });
            });
        }

        return files;
    }

    generateLivingFiles(livingClassification) {
        const files = [];
        
        if (livingClassification.monitoring) {
            livingClassification.monitoring.forEach(monitor => {
                files.push({
                    name: `${monitor.name.toLowerCase()}.rs`,
                    type: 'living_component',
                    capabilities: monitor.capabilities
                });
            });
        }

        return files;
    }

    extractWrapperDependencies(wrappersClassification) {
        const dependencies = new Set();
        
        if (wrappersClassification.integrations) {
            wrappersClassification.integrations.forEach(integration => {
                switch (integration.technology) {
                    case 'postgresql':
                        dependencies.add('tokio-postgres');
                        break;
                    case 'redis':
                        dependencies.add('redis');
                        break;
                    case 'stripe':
                        dependencies.add('stripe-rust');
                        break;
                    // Agregar más según necesidad
                }
            });
        }

        return Array.from(dependencies);
    }

    generateEnvironmentConfigs(classification) {
        return {
            development: { log_level: 'debug', db_pool_size: 5 },
            production: { log_level: 'info', db_pool_size: 20 },
            testing: { log_level: 'warn', db_pool_size: 1 }
        };
    }

    generateHealthChecks(classification) {
        const checks = ['core_integrity'];
        
        if (classification.classification.WRAPPERS.integrations?.length) {
            checks.push('external_services');
        }
        
        if (classification.classification.LIVING_LAYER.monitoring?.length) {
            checks.push('monitoring_systems');
        }
        
        return checks;
    }

    /**
     * NUEVA FUNCIÓN: Genera clasificación dinámica basada en entidades del domain-analysis.json
     * Elimina hardcoding y usa entidades reales detectadas
     */
    generateDynamicClassification(domainAnalysis) {
        const entities = domainAnalysis.domain?.entities || [];
        const useCases = domainAnalysis.domain?.useCases || [];
        const businessRules = domainAnalysis.domain?.businessRules || [];
        const integrations = domainAnalysis.domain?.integrations || [];
        
        // CORE: Mapear entidades reales del domain-analysis
        const coreEntities = entities.map(entity => ({
            name: entity.name,
            layer: "CORE",
            reason: `Entidad fundamental del dominio ${domainAnalysis.projectName || 'sistema'}, lógica de negocio inmutable`,
            components: [{
                type: "domain_entity",
                name: `${entity.name}Entity`,
                description: entity.description || `Entidad ${entity.name} con validaciones de negocio`,
                responsibilities: [
                    "Validación de datos",
                    "Aplicación de reglas de negocio", 
                    "Mantenimiento de invariantes"
                ]
            }]
        }));
        
        // CORE: Mapear reglas de negocio reales
        const coreBusinessLogic = businessRules.map(rule => ({
            name: rule.name,
            layer: "CORE",
            reason: "Regla de negocio fundamental que nunca cambia",
            implementation: rule.description || "Validación crítica del dominio"
        }));
        
        // WRAPPERS: Mapear integraciones reales
        const wrapperIntegrations = integrations.map(integration => ({
            name: `${integration.name}Integration`,
            layer: "WRAPPERS",
            reason: "Adaptador externo configurable según entorno",
            technology: integration.type || "external_service",
            configuration_points: [
                "connection_string", 
                "timeout", 
                "retry_policy"
            ]
        }));
        
        // WRAPPERS: Generar repositorios para cada entidad
        const wrapperRepositories = entities.map(entity => ({
            name: `${entity.name}Repository`,
            layer: "WRAPPERS",
            reason: "Abstrae acceso a datos, implementación configurable",
            operations: ["create", "read", "update", "delete", `find_by_${entity.name.toLowerCase()}_id`]
        }));
        
        // LIVING_LAYER: Componentes de monitoreo estándar
        const livingMonitoring = [
            {
                name: "PerformanceMonitor",
                layer: "LIVING_LAYER",
                reason: "Monitoreo adaptativo de performance de API",
                capabilities: ["response_time_analysis", "throughput_monitoring", "error_rate_tracking"]
            },
            {
                name: "BusinessMetricsAnalyzer",
                layer: "LIVING_LAYER",
                reason: "Análisis inteligente de métricas de negocio",
                capabilities: ["usage_pattern_analysis", "performance_optimization", "anomaly_detection"]
            }
        ];
        
        // Calcular estadísticas
        const totalComponents = coreEntities.length + coreBusinessLogic.length + wrapperIntegrations.length + wrapperRepositories.length + livingMonitoring.length;
        const coreCount = coreEntities.length + coreBusinessLogic.length;
        const wrapperCount = wrapperIntegrations.length + wrapperRepositories.length;
        const livingCount = livingMonitoring.length;
        
        return {
            classification: {
                CORE: {
                    entities: coreEntities,
                    business_logic: coreBusinessLogic
                },
                WRAPPERS: {
                    integrations: wrapperIntegrations,
                    repositories: wrapperRepositories
                },
                LIVING_LAYER: {
                    monitoring: livingMonitoring
                }
            },
            architecture_summary: {
                total_components: totalComponents,
                core_percentage: Math.round((coreCount / totalComponents) * 100),
                wrappers_percentage: Math.round((wrapperCount / totalComponents) * 100),
                living_percentage: Math.round((livingCount / totalComponents) * 100),
                complexity_assessment: entities.length > 3 ? "high" : entities.length > 1 ? "medium" : "low",
                brik_compliance_score: 0.95
            }
        };
    }
    
    async saveClassification(architectureMap, filename) {
        try {
            const outputPath = path.join(process.cwd(), filename);
            await fs.promises.writeFile(outputPath, JSON.stringify(architectureMap, null, 2), 'utf8');
            console.log(`💾 Clasificación guardada: ${filename}`);
        } catch (error) {
            console.warn('⚠️ No se pudo guardar clasificación:', error.message);
        }
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log(`
🏗️ BRIK Architecture Classifier

USAGE:
  node architecture-classifier.js domain-analysis.json
  node architecture-classifier.js "project description" [integrations] [language]

EXAMPLES:
  node architecture-classifier.js domain-analysis.json
  node architecture-classifier.js "API e-commerce" "postgresql,stripe" rust

WORKFLOW:
  1. domain-analyzer.js "description" > domain-analysis.json
  2. architecture-classifier.js domain-analysis.json > architecture-classification.json
        `.trim());
        process.exit(1);
    }

    try {
        const classifier = new ArchitectureClassifier();
        let domainAnalysis;

        if (args[0].endsWith('.json') && fs.existsSync(args[0])) {
            // Leer análisis desde archivo
            if (process.env.OUTPUT_JSON !== '1') {
                console.log('📖 Cargando análisis desde archivo:', args[0]);
            }
            const content = await fs.promises.readFile(args[0], 'utf8');
            domainAnalysis = JSON.parse(content);
        } else {
            // NUEVA FUNCIONALIDAD: Intentar leer domain-analysis.json del directorio actual
            const currentDirAnalysis = path.join(process.cwd(), 'domain-analysis.json');
            if (fs.existsSync(currentDirAnalysis)) {
                if (process.env.OUTPUT_JSON !== '1') {
                    console.log('📖 Encontrado domain-analysis.json en directorio actual');
                }
                const content = await fs.promises.readFile(currentDirAnalysis, 'utf8');
                domainAnalysis = JSON.parse(content);
            } else {
                // Ejecutar domain-analyzer inline como fallback
                if (process.env.OUTPUT_JSON !== '1') {
                    console.log('🧠 Ejecutando análisis de dominio inline...');
                }
                const analyzer = new DomainAnalyzer();
                const description = args[0];
                const integrations = args[1] ? args[1].split(',').map(s => s.trim()) : [];
                const language = args[2] || 'rust';
                
                domainAnalysis = await analyzer.analyze(description, integrations, language);
            }
        }

        const architectureMap = await classifier.classify(domainAnalysis);

        // JSON output para pipeline
        if (process.env.OUTPUT_JSON === '1') {
            // Solo output JSON puro para el pipeline
            console.log(JSON.stringify(architectureMap, null, 2));
            return; // Salir sin más output
        }

        console.log('🚀 BRIK Architecture Classifier');
        console.log(`📝 Proyecto: ${domainAnalysis.projectName}`);
        console.log(`🏗️ Tipo: ${domainAnalysis.technical.architecture_type}`);
        console.log('');

        // Output sumario
        console.log('\n🎯 CLASIFICACIÓN COMPLETADA:');
        console.log(`🎯 CORE: ${architectureMap.architecture.CORE.entities?.length || 0} entidades, ${architectureMap.architecture.CORE.business_logic?.length || 0} reglas`);
        console.log(`🔧 WRAPPERS: ${architectureMap.architecture.WRAPPERS.integrations?.length || 0} integraciones, ${architectureMap.architecture.WRAPPERS.repositories?.length || 0} repositorios`);
        console.log(`🤖 LIVING: ${architectureMap.architecture.LIVING_LAYER.monitoring?.length || 0} componentes`);
        console.log(`📊 Compliance BRIK: ${(architectureMap.validation.metadata?.brik_compliance_score || 0.8 * 100).toFixed(1)}%`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}

module.exports = { ArchitectureClassifier };