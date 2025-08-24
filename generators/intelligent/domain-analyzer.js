#!/usr/bin/env node
/**
 * 🧠 BRIK Domain Analyzer - LLM-Powered Project Analysis
 * 
 * Analiza descripciones en lenguaje natural y extrae:
 * - Entidades del dominio
 * - Casos de uso principales
 * - Reglas de negocio
 * - Integraciones externas
 * - Requerimientos técnicos
 * 
 * Filosofía BRIK: Inteligencia para simplicidad
 */

const fs = require('fs');
const path = require('path');

// Configuración LLM (Claude/OpenAI compatible)
const LLM_CONFIG = {
    provider: process.env.LLM_PROVIDER || 'anthropic', // anthropic, openai
    apiKey: process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY,
    model: process.env.LLM_MODEL || 'claude-3-haiku-20240307',
    maxTokens: 4000,
    temperature: 0.1 // Precision over creativity
};

class DomainAnalyzer {
    constructor(config = LLM_CONFIG) {
        this.config = config;
        this.validateConfig();
    }

    validateConfig() {
        if (!this.config.apiKey && process.env.OUTPUT_JSON !== '1') {
            console.log('⚠️ No API key found, mock LLM will be used for testing');
        }
    }

    /**
     * Analiza descripción de proyecto y extrae estructura de dominio
     */
    async analyze(description, integrations = [], language = 'rust') {
        if (process.env.OUTPUT_JSON !== '1') {
            console.log('🧠 Analizando dominio del proyecto...');
        }
        
        const analysisPrompt = this.buildAnalysisPrompt(description, integrations, language);
        const llmResponse = await this.queryLLM(analysisPrompt);
        const domainAnalysis = this.parseAnalysisResponse(llmResponse);
        
        // Validar y enriquecer análisis
        const enrichedAnalysis = this.enrichAnalysis(domainAnalysis, description, integrations, language);
        
        // Guardar análisis para debugging (solo si no es pipeline)
        if (process.env.OUTPUT_JSON !== '1') {
            await this.saveAnalysis(enrichedAnalysis, 'domain-analysis.json');
            console.log('✅ Análisis de dominio completado');
        }
        
        return enrichedAnalysis;
    }

    buildAnalysisPrompt(description, integrations, language) {
        return `
Eres un experto arquitecto de software especializado en análisis de dominios para sistemas BRIK.

DESCRIPCIÓN DEL PROYECTO:
"${description}"

INTEGRACIONES ESPECIFICADAS:
${integrations.map(i => `- ${i}`).join('\n') || '- Ninguna especificada'}

LENGUAJE OBJETIVO: ${language}

Analiza esta descripción y extrae la siguiente información en formato JSON estricto:

{
  "projectName": "nombre-del-proyecto",
  "description": "descripción limpia y estructurada",
  "domain": {
    "entities": [
      {
        "name": "EntityName",
        "description": "Descripción de la entidad",
        "attributes": ["attr1: Type", "attr2: Type"],
        "relationships": [{"entity": "OtherEntity", "type": "OneToMany|ManyToOne|ManyToMany"}],
        "businessRules": ["regla específica del negocio"]
      }
    ],
    "useCases": [
      {
        "name": "CreateEntity",
        "description": "Descripción del caso de uso",
        "actor": "User|System|Admin",
        "inputs": ["input1: Type", "input2: Type"],
        "outputs": ["output: Type"],
        "businessLogic": ["lógica paso a paso"]
      }
    ],
    "businessRules": [
      {
        "name": "ReglaValidacion",
        "description": "Descripción detallada",
        "applies_to": ["EntityName"],
        "condition": "condición específica",
        "action": "acción a ejecutar"
      }
    ],
    "integrations": [
      {
        "name": "ServiceName",
        "type": "database|payment|cache|email|api",
        "description": "Propósito de la integración",
        "operations": ["operation1", "operation2"]
      }
    ]
  },
  "technical": {
    "architecture_type": "api|web_app|microservice|cli_tool",
    "data_persistence": "postgresql|sqlite|file|memory",
    "auth_required": true|false,
    "real_time": true|false,
    "scalability_requirements": "low|medium|high",
    "performance_requirements": "standard|high|critical"
  }
}

INSTRUCCIONES CRÍTICAS:
1. Extrae SOLO información presente o claramente inferible de la descripción
2. Sé específico y técnico, no genérico
3. Para cada entidad, identifica atributos reales del dominio
4. Para casos de uso, describe lógica de negocio concreta
5. Mantén nombres en inglés y CamelCase
6. Responde SOLO con JSON válido, sin texto adicional
`.trim();
    }

    async queryLLM(prompt) {
        // Si no hay API key, usar mock para testing
        if (!this.config.apiKey) {
            if (process.env.OUTPUT_JSON !== '1') {
                console.log('⚠️ No API key found, using mock LLM for testing...');
            }
            const { MockLLM } = require('./mock-llm.js');
            return MockLLM.getDomainAnalysisResponse("e-commerce API", "postgresql,redis,stripe");
        }
        
        try {
            if (this.config.provider === 'anthropic') {
                return await this.queryAnthropic(prompt);
            } else if (this.config.provider === 'openai') {
                return await this.queryOpenAI(prompt);
            } else {
                throw new Error(`Proveedor LLM no soportado: ${this.config.provider}`);
            }
        } catch (error) {
            if (process.env.OUTPUT_JSON !== '1') {
                console.error('❌ Error consultando LLM:', error.message);
                console.log('🔄 Falling back to mock LLM...');
            }
            const { MockLLM } = require('./mock-llm.js');
            return MockLLM.getDomainAnalysisResponse("e-commerce API", "postgresql,redis,stripe");
        }
    }

    async queryAnthropic(prompt) {
        // Implementación usando fetch (compatible con Node.js 18+)
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.config.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.config.model,
                max_tokens: this.config.maxTokens,
                temperature: this.config.temperature,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Anthropic API Error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    async queryOpenAI(prompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model.includes('gpt') ? this.config.model : 'gpt-3.5-turbo',
                max_tokens: this.config.maxTokens,
                temperature: this.config.temperature,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    parseAnalysisResponse(response) {
        try {
            // Limpiar respuesta de posibles caracteres extra
            const cleanResponse = response
                .replace(/```json\s*/g, '')
                .replace(/```\s*/g, '')
                .trim();
            
            return JSON.parse(cleanResponse);
        } catch (error) {
            console.error('❌ Error parseando respuesta LLM:', error.message);
            console.error('Respuesta recibida:', response);
            throw new Error('Respuesta LLM no es JSON válido');
        }
    }

    enrichAnalysis(analysis, originalDescription, integrations, language) {
        // Enriquecer con metadata adicional
        return {
            ...analysis,
            metadata: {
                generatedAt: new Date().toISOString(),
                originalDescription,
                requestedIntegrations: integrations,
                targetLanguage: language,
                analyzedBy: `BRIK Domain Analyzer v1.0`,
                confidence: this.calculateConfidence(analysis, originalDescription)
            }
        };
    }

    calculateConfidence(analysis, description) {
        // Heurística simple para calcular confianza en el análisis
        let confidence = 0.5; // Base confidence
        
        // Más entidades = más confianza
        if (analysis.domain.entities.length > 0) confidence += 0.2;
        if (analysis.domain.entities.length > 2) confidence += 0.1;
        
        // Casos de uso bien definidos
        if (analysis.domain.useCases.length > 0) confidence += 0.2;
        
        // Reglas de negocio específicas
        if (analysis.domain.businessRules.length > 0) confidence += 0.1;
        
        return Math.min(confidence, 1.0);
    }

    async saveAnalysis(analysis, filename) {
        try {
            const outputPath = path.join(process.cwd(), filename);
            await fs.promises.writeFile(outputPath, JSON.stringify(analysis, null, 2), 'utf8');
            console.log(`💾 Análisis guardado: ${filename}`);
        } catch (error) {
            console.warn('⚠️ No se pudo guardar análisis:', error.message);
        }
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log(`
🧠 BRIK Domain Analyzer

USAGE:
  node domain-analyzer.js "descripción del proyecto" [integraciones] [lenguaje]

EXAMPLES:
  node domain-analyzer.js "API e-commerce con usuarios y productos"
  node domain-analyzer.js "Sistema CRM con clientes, leads, ventas" "postgresql,stripe,sendgrid" rust
  node domain-analyzer.js "Blog con posts, comentarios, autenticación" "" typescript

ENVIRONMENT:
  ANTHROPIC_API_KEY=...  # Para usar Claude
  OPENAI_API_KEY=...     # Para usar GPT
  LLM_PROVIDER=anthropic # anthropic|openai
  LLM_MODEL=claude-3-haiku-20240307  # Modelo específico
        `.trim());
        process.exit(1);
    }

    try {
        const description = args[0];
        const integrations = args[1] ? args[1].split(',').map(s => s.trim()) : [];
        const language = args[2] || 'rust';

        const analyzer = new DomainAnalyzer();
        const analysis = await analyzer.analyze(description, integrations, language);

        // JSON output para pipeline
        if (process.env.OUTPUT_JSON === '1') {
            // Solo output JSON puro para el pipeline
            console.log(JSON.stringify(analysis, null, 2));
            return; // Salir sin más output
        }

        console.log('🚀 BRIK Domain Analyzer');
        console.log(`📝 Descripción: ${description}`);
        console.log(`🔌 Integraciones: ${integrations.join(', ') || 'Ninguna'}`);
        console.log(`💻 Lenguaje: ${language}`);
        console.log('');

        // Output para consumo por otros scripts
        console.log('\n🎯 ANÁLISIS COMPLETADO:');
        console.log(`📊 Entidades encontradas: ${analysis.domain.entities.length}`);
        console.log(`⚙️ Casos de uso: ${analysis.domain.useCases.length}`);
        console.log(`📋 Reglas de negocio: ${analysis.domain.businessRules.length}`);
        console.log(`🔌 Integraciones: ${analysis.domain.integrations.length}`);
        console.log(`🎯 Confianza: ${(analysis.metadata.confidence * 100).toFixed(1)}%`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}

module.exports = { DomainAnalyzer };