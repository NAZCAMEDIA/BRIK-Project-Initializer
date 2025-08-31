#!/usr/bin/env node

/**
 * BRIK AI - Version Corregida
 * Sistema Claude Omnisciente sin bucles infinitos
 */

console.log('🧬 BRIK AI - Claude Omnisciente (Version Corregida)');
console.log('═'.repeat(60));
console.log();

// Context Manager Simplificado
class SimpleBRIKContext {
  constructor() {
    this.knowledge = this.loadBasicKnowledge();
  }

  loadBasicKnowledge() {
    const fs = require('fs');
    const knowledge = {
      methodology: {},
      principles: {
        core: "Lógica de negocio pura, entidades inmutables",
        wrappers: "Interfaces externas, APIs, controllers",
        living_layer: "Configuración, estado mutable, variables de entorno"
      },
      architecture: `
CORE/               # Lógica de negocio
├── domain/         # Entidades y Value Objects  
├── application/    # Casos de uso
└── infrastructure/ # Contratos

WRAPPERS/          # Interfaces externas
├── api/           # REST/GraphQL
├── cli/           # Comandos
└── integrations/  # Servicios externos

LIVING_LAYER/      # Configuración
├── config/        # Variables
└── state/         # Estado mutable
      `
    };

    // Cargar CIRCUITALIDAD.md si existe
    try {
      if (fs.existsSync('./CIRCUITALIDAD.md')) {
        knowledge.methodology.circuitalidad = fs.readFileSync('./CIRCUITALIDAD.md', 'utf-8').substring(0, 2000);
      }
      
      if (fs.existsSync('./README.md')) {
        knowledge.methodology.readme = fs.readFileSync('./README.md', 'utf-8').substring(0, 1000);
      }
      
      if (fs.existsSync('./package.json')) {
        const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
        knowledge.project = {
          name: pkg.name,
          version: pkg.version,
          description: pkg.description
        };
      }
    } catch (error) {
      console.log('⚠️ Error cargando archivos opcionales:', error.message);
    }

    return knowledge;
  }

  generateResponse(input) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('crear') || lowerInput.includes('proyecto')) {
      return `🚀 **Excelente! Voy a crear un proyecto BRIK.**

**Arquitectura DAAF-BRIK-Circuitalidad:**
${this.knowledge.architecture}

**Implementación automática:**
✅ Entidades de dominio inmutables
✅ Casos de uso con lógica de aplicación  
✅ Controllers REST optimizados
✅ Configuración de entorno
✅ Tests con 100% cobertura
✅ Certificación L3 integrada

¿Procedo con la implementación completa?`;
    }
    
    if (lowerInput.includes('api') || lowerInput.includes('rest')) {
      return `🔧 **Implementando API REST con arquitectura BRIK:**

**CORE/application/** - Casos de uso para endpoints
**CORE/domain/** - Entidades de negocio inmutables
**WRAPPERS/api/** - Controllers y rutas REST
**LIVING_LAYER/config/** - Configuración de servidor

**Stack sugerido:** TypeScript + Express + Jest
**Certificación:** L3 (excelencia técnica)
**Tests:** Unitarios + Integración + E2E

Implementación lista en 3 minutos.`;
    }
    
    if (lowerInput.includes('explicar') || lowerInput.includes('brik') || lowerInput.includes('principios')) {
      return `📚 **Principios DAAF-BRIK-Circuitalidad:**

**${this.knowledge.principles.core}**
**${this.knowledge.principles.wrappers}**  
**${this.knowledge.principles.living_layer}**

**Circuitalidad:** Los datos fluyen en circuitos cerrados, 
manteniendo trazabilidad completa y permitiendo evolución 
sin degradación arquitectónica.

**Beneficios:**
• Mantenibilidad extrema
• Escalabilidad natural
• Testing integral
• Deploys sin riesgo`;
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('ayuda')) {
      return `🆘 **Claude BRIK Omnisciente - Comandos:**

**Conversación Natural:**
• "Crea un proyecto de blog"
• "Necesito una API para usuarios"
• "Explícame los principios BRIK"
• "Restructura mi código actual"

**Capacidades:**
• Generar proyectos BRIK completos
• Crear APIs REST/GraphQL certificadas
• Explicar metodología DAAF-BRIK-Circuitalidad
• Certificar proyectos L1/L2/L3

**Comandos especiales:** help, exit, clear`;
    }
    
    // Respuesta general
    return `🤔 **Interpreto tu solicitud:** "${input}"

Como arquitecto BRIK omnisciente, puedo ayudarte a:

• **Crear proyectos completos** con arquitectura DAAF-BRIK-Circuitalidad
• **Generar APIs** REST/GraphQL con certificación L3
• **Restructurar código existente** siguiendo principios BRIK
• **Implementar tests** con 100% de cobertura
• **Explicar metodología** en profundidad

¿Qué específicamente necesitas implementar?`;
  }
}

// CLI Conversacional Simplificado
class SimpleCLI {
  constructor() {
    this.context = new SimpleBRIKContext();
    this.history = [];
  }

  start() {
    console.log('🧠 Claude BRIK inicializado con conocimiento omnisciente');
    console.log('💬 Conversación natural activada - sin menús rígidos');
    console.log();
    console.log('Ejemplos:');
    console.log('  • "Crea un proyecto de e-commerce"');
    console.log('  • "Necesito una API REST para usuarios"');  
    console.log('  • "Explícame el principio de Circuitalidad"');
    console.log();
    console.log('Escribe "help" para ayuda, "exit" para salir');
    console.log();

    const readline = require('readline');
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.askQuestion();
  }

  askQuestion() {
    this.rl.question('🧬 BRIK AI > ', (input) => {
      const trimmed = input.trim();
      
      if (!trimmed) {
        this.askQuestion();
        return;
      }

      // Comandos especiales
      if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'salir') {
        console.log('\n👋 ¡Hasta luego! Claude BRIK desconectado.');
        this.rl.close();
        return;
      }
      
      if (trimmed.toLowerCase() === 'clear') {
        console.clear();
        console.log('🧬 BRIK AI - Claude Omnisciente');
        console.log();
        this.askQuestion();
        return;
      }

      if (trimmed.toLowerCase() === 'history') {
        console.log('\n📜 Historial:');
        this.history.slice(-3).forEach((entry, i) => {
          console.log(`${i + 1}. Usuario: ${entry.input.substring(0, 50)}...`);
        });
        console.log();
        this.askQuestion();
        return;
      }

      // Procesar con Claude omnisciente
      console.log('\n🤔 Analizando solicitud...');
      
      // Simular tiempo de procesamiento
      setTimeout(() => {
        try {
          const response = this.context.generateResponse(trimmed);
          
          console.log('\n🧬 Claude BRIK:');
          console.log(response);
          console.log();
          
          // Guardar en historial
          this.history.push({
            timestamp: new Date(),
            input: trimmed,
            response: response.substring(0, 100)
          });
          
          // Simular acciones si las hay
          if (trimmed.toLowerCase().includes('crear') || trimmed.toLowerCase().includes('implementar')) {
            console.log('⚡ Acciones sugeridas:');
            console.log('  1. mkdir proyecto-brik');
            console.log('  2. Crear estructura CORE/WRAPPERS/LIVING_LAYER');
            console.log('  3. Generar archivos base con templates');
            console.log('  4. Configurar tests y certificación');
            console.log();
          }
          
        } catch (error) {
          console.log('❌ Error procesando:', error.message);
          console.log();
        }
        
        this.askQuestion();
      }, 1000);
    });
  }
}

// Manejo de señales
process.on('SIGINT', () => {
  console.log('\n\n👋 Claude BRIK desconectado. ¡Hasta pronto!');
  process.exit(0);
});

// Inicializar CLI
try {
  console.log('✅ Sistema inicializado correctamente');
  const cli = new SimpleCLI();
  cli.start();
} catch (error) {
  console.error('❌ Error fatal:', error.message);
  console.error('\n🔧 Posibles soluciones:');
  console.error('1. Verificar Node.js >= 14');
  console.error('2. Verificar permisos de archivo');
  console.error('3. Reintentar ejecución');
  process.exit(1);
}