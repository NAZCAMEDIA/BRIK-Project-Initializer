#!/usr/bin/env node

/**
 * BRIK Conversational CLI
 * Interfaz conversacional con Claude omnisciente BRIK
 */

const readline = require('readline');
const chalk = require('chalk');
const figlet = require('figlet');
const BRIKClaudeContextManager = require('../claude/context-manager');
const BRIKExecutor = require('../execution/executor');

class BRIKConversationalCLI {
  constructor() {
    this.rl = null;
    this.contextManager = null;
    this.executor = null;
    this.context = null;
    this.conversationHistory = [];
    this.currentProject = null;
  }

  /**
   * Inicializa la CLI conversacional
   */
  async initialize() {
    console.clear();
    
    // Banner ASCII
    this.showBanner();
    
    // Inicializar componentes
    await this.initializeComponents();
    
    // Configurar readline
    this.setupReadline();
    
    // Mensaje de bienvenida
    this.showWelcome();
    
    // Iniciar conversación
    this.startConversation();
  }

  /**
   * Muestra banner ASCII
   */
  showBanner() {
    const banner = figlet.textSync('BRIK AI', {
      font: 'ANSI Shadow',
      horizontalLayout: 'fitted'
    });
    
    console.log(chalk.cyan(banner));
    console.log(chalk.gray('━'.repeat(80)));
    console.log(chalk.blue('🧬 BRIK Conversational AI Assistant'));
    console.log(chalk.gray('Powered by Claude with omniscient BRIK knowledge'));
    console.log(chalk.gray('━'.repeat(80)));
  }

  /**
   * Inicializa componentes principales
   */
  async initializeComponents() {
    const path = require('path');
    const rootPath = path.resolve(__dirname, '../..');
    
    console.log(chalk.yellow('🔄 Inicializando Claude con conocimiento BRIK...'));
    
    // Context Manager
    this.contextManager = new BRIKClaudeContextManager();
    this.context = await this.contextManager.initialize(rootPath);
    
    // Executor
    this.executor = new BRIKExecutor();
    
    console.log(chalk.green('✅ Claude BRIK listo para conversación'));
  }

  /**
   * Configura readline para entrada interactiva
   */
  setupReadline() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.cyan('🧬 BRIK > ')
    });

    // Handlers de readline
    this.rl.on('line', (input) => this.handleUserInput(input.trim()));
    this.rl.on('close', () => this.handleExit());
    
    // Autocompletado (futuro)
    this.rl.on('tab', () => {
      // Implementar autocompletado contextual
    });
  }

  /**
   * Mensaje de bienvenida personalizado
   */
  showWelcome() {
    console.log();
    console.log(chalk.blue('👋 ¡Hola! Soy tu Arquitecto BRIK con conocimiento omnisciente.'));
    console.log(chalk.gray('   Puedo ayudarte a:'));
    console.log(chalk.gray('   • Crear proyectos BRIK completos desde cero'));
    console.log(chalk.gray('   • Restructurar código existente con arquitectura BRIK'));
    console.log(chalk.gray('   • Generar componentes certificados L1/L2/L3'));
    console.log(chalk.gray('   • Explicar principios DAAF-BRIK-Circuitalidad'));
    console.log();
    console.log(chalk.green('💬 Háblame naturalmente sobre lo que necesitas. ¡No hay menús!'));
    console.log(chalk.gray('   Ejemplos:'));
    console.log(chalk.gray('   - "Quiero crear un API REST para e-commerce"'));
    console.log(chalk.gray('   - "Ayúdame a restructurar este proyecto con BRIK"'));
    console.log(chalk.gray('   - "Explícame los principios de Circuitalidad"'));
    console.log();
    console.log(chalk.dim('Escribe "exit" para salir, "help" para ayuda, "clear" para limpiar'));
    console.log();
  }

  /**
   * Inicia el bucle de conversación
   */
  startConversation() {
    this.rl.prompt();
  }

  /**
   * Maneja la entrada del usuario
   */
  async handleUserInput(input) {
    if (!input) {
      this.rl.prompt();
      return;
    }

    // Comandos especiales
    if (await this.handleSpecialCommands(input)) {
      this.rl.prompt();
      return;
    }

    try {
      // Mostrar que está procesando
      console.log(chalk.yellow('🤔 Analizando tu solicitud...'));
      
      // Procesar con Claude omnisciente
      const response = await this.processWithClaude(input);
      
      // Mostrar respuesta
      this.displayResponse(response);
      
      // Ejecutar acciones si las hay
      if (response.actions && response.actions.length > 0) {
        await this.executeActions(response.actions);
      }
      
      // Guardar en historial
      this.conversationHistory.push({
        timestamp: new Date(),
        user: input,
        claude: response.message,
        actions: response.actions || []
      });
      
    } catch (error) {
      console.log();
      console.log(chalk.red('❌ Error procesando solicitud:'), error.message);
      console.log();
    }

    this.rl.prompt();
  }

  /**
   * Maneja comandos especiales del CLI
   */
  async handleSpecialCommands(input) {
    const command = input.toLowerCase();

    switch (command) {
      case 'exit':
      case 'quit':
      case 'bye':
        this.handleExit();
        return true;

      case 'clear':
      case 'cls':
        console.clear();
        this.showBanner();
        return true;

      case 'help':
        this.showHelp();
        return true;

      case 'history':
        this.showHistory();
        return true;

      case 'context':
        this.showContext();
        return true;

      case 'status':
        await this.showStatus();
        return true;

      default:
        return false;
    }
  }

  /**
   * Procesa entrada con Claude omnisciente
   */
  async processWithClaude(userInput) {
    // Simular procesamiento con Claude (aquí iría la integración real)
    return await this.simulateClaudeResponse(userInput);
  }

  /**
   * Simula respuesta de Claude (placeholder para integración real)
   */
  async simulateClaudeResponse(input) {
    // Delay para simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerInput = input.toLowerCase();

    // Detección de intenciones basada en conocimiento BRIK
    if (lowerInput.includes('crear') || lowerInput.includes('nuevo proyecto')) {
      return this.generateProjectCreationResponse(input);
    }
    
    if (lowerInput.includes('api') || lowerInput.includes('rest') || lowerInput.includes('graphql')) {
      return this.generateApiResponse(input);
    }
    
    if (lowerInput.includes('restructurar') || lowerInput.includes('refactor')) {
      return this.generateRestructureResponse(input);
    }
    
    if (lowerInput.includes('explicar') || lowerInput.includes('qué es') || lowerInput.includes('principios')) {
      return this.generateExplanationResponse(input);
    }

    // Respuesta general
    return {
      message: `Entiendo tu solicitud: "${input}"\n\nComo arquitecto BRIK, puedo ayudarte a implementar esto siguiendo los principios DAAF-BRIK-Circuitalidad. ¿Te gustaría que proceda con la implementación o prefieres que primero te explique el enfoque arquitectónico?`,
      actions: [],
      context: 'general_assistance'
    };
  }

  /**
   * Genera respuesta para creación de proyectos
   */
  generateProjectCreationResponse(input) {
    return {
      message: `🏗️ **Perfecto! Voy a crear un proyecto BRIK para ti.**

Basándome en tu solicitud, voy a implementar:

**Arquitectura BRIK:**
\`\`\`
CORE/                  # Lógica de negocio pura
├── domain/           # Entidades y Value Objects
├── application/      # Casos de uso
└── infrastructure/   # Contratos

WRAPPERS/            # Interfaces externas  
├── api/             # REST endpoints
├── cli/             # Comandos
└── integrations/    # Servicios externos

LIVING_LAYER/        # Configuración
├── config/          # Variables de entorno
└── state/           # Estado mutable
\`\`\`

**Características:**
✅ Arquitectura DAAF-BRIK-Circuitalidad completa
✅ Tests con 100% de cobertura
✅ Documentación integrada
✅ Certificación L3 automática

¿Procedo con la implementación?`,
      actions: [
        {
          type: 'create_project_structure',
          data: { architecture: 'brik', level: 'L3' }
        }
      ],
      context: 'project_creation'
    };
  }

  /**
   * Genera respuesta para APIs
   */
  generateApiResponse(input) {
    return {
      message: `🚀 **Excelente! Voy a crear una API con arquitectura BRIK.**

**Implementación BRIK para API:**

**CORE/domain/** - Entidades de negocio inmutables
**CORE/application/** - Casos de uso y servicios
**WRAPPERS/api/** - Controllers y rutas REST
**LIVING_LAYER/config/** - Configuración de servidor

**Patrones incluidos:**
• Repository Pattern para persistencia
• Dependency Injection
• Error handling centralizado
• Validación de entrada
• Serialización de respuesta
• Tests de integración

**Stack sugerido:** TypeScript + Express + Jest
**Certificación:** L3 (excelencia técnica)

¿Te parece bien este enfoque?`,
      actions: [
        {
          type: 'create_api_project',
          data: { type: 'rest', framework: 'express' }
        }
      ],
      context: 'api_creation'
    };
  }

  /**
   * Genera respuesta para restructuración
   */
  generateRestructureResponse(input) {
    return {
      message: `🔄 **Perfecto! Voy a restructurar tu proyecto con arquitectura BRIK.**

**Proceso de Restructuración:**

1. **Análisis del código actual**
2. **Identificación de componentes CORE vs WRAPPERS**
3. **Separación de responsabilidades**
4. **Migración gradual a arquitectura BRIK**
5. **Implementación de tests**
6. **Certificación L1/L2/L3**

**Beneficios esperados:**
✅ Código más mantenible
✅ Mayor testabilidad
✅ Mejor separación de responsabilidades
✅ Escalabilidad mejorada

¿Quieres que analice tu código actual primero?`,
      actions: [
        {
          type: 'analyze_project',
          data: { purpose: 'restructure' }
        }
      ],
      context: 'restructure'
    };
  }

  /**
   * Genera respuesta explicativa
   */
  generateExplanationResponse(input) {
    return {
      message: `📚 **Como arquitecto BRIK, te explico los principios fundamentales:**

## DAAF-BRIK-Circuitalidad

**CORE** = Lógica de negocio pura
- Entidades inmutables
- Casos de uso sin dependencias externas
- Reglas de negocio centralizadas

**WRAPPERS** = Interfaces con el mundo exterior
- APIs REST/GraphQL
- Integraciones con servicios
- Controllers y adaptadores

**LIVING_LAYER** = Configuración y estado
- Variables de entorno
- Estado mutable necesario
- Configuración de aplicación

**Principio de Circuitalidad:**
Los datos fluyen en circuitos cerrados, manteniendo trazabilidad completa y permitiendo evolución sin degradación.

¿Quieres que profundice en algún aspecto específico?`,
      actions: [],
      context: 'explanation'
    };
  }

  /**
   * Muestra respuesta de Claude
   */
  displayResponse(response) {
    console.log();
    console.log(chalk.blue('🧬 Claude BRIK:'));
    console.log(response.message);
    
    if (response.actions && response.actions.length > 0) {
      console.log();
      console.log(chalk.yellow(`⚡ Acciones a ejecutar: ${response.actions.length}`));
    }
    
    console.log();
  }

  /**
   * Ejecuta acciones generadas por Claude
   */
  async executeActions(actions) {
    console.log(chalk.yellow('🔧 Ejecutando acciones...'));
    
    for (const action of actions) {
      try {
        await this.executor.execute(action);
        console.log(chalk.green(`✅ ${action.type} completada`));
      } catch (error) {
        console.log(chalk.red(`❌ Error en ${action.type}: ${error.message}`));
      }
    }
    
    console.log();
  }

  /**
   * Muestra ayuda
   */
  showHelp() {
    console.log();
    console.log(chalk.blue('📖 Ayuda BRIK AI'));
    console.log(chalk.gray('━'.repeat(50)));
    console.log();
    console.log(chalk.green('Comandos especiales:'));
    console.log('  help     - Muestra esta ayuda');
    console.log('  clear    - Limpia la pantalla');
    console.log('  history  - Muestra historial de conversación');
    console.log('  context  - Muestra contexto actual');
    console.log('  status   - Estado del sistema');
    console.log('  exit     - Sale de la aplicación');
    console.log();
    console.log(chalk.green('Ejemplos de conversación:'));
    console.log('  "Crea un proyecto de blog con BRIK"');
    console.log('  "Necesito una API para gestión de usuarios"'); 
    console.log('  "Explícame el principio de Circuitalidad"');
    console.log('  "Restructura mi proyecto actual"');
    console.log();
  }

  /**
   * Muestra historial de conversación
   */
  showHistory() {
    console.log();
    console.log(chalk.blue('📜 Historial de Conversación'));
    console.log(chalk.gray('━'.repeat(50)));
    
    if (this.conversationHistory.length === 0) {
      console.log(chalk.dim('No hay conversaciones previas'));
    } else {
      this.conversationHistory.slice(-5).forEach((entry, index) => {
        console.log();
        console.log(chalk.cyan(`[${entry.timestamp.toLocaleTimeString()}] Usuario:`));
        console.log(chalk.dim(`  ${entry.user}`));
        console.log(chalk.blue('Claude:'));
        console.log(chalk.dim(`  ${entry.claude.substring(0, 100)}...`));
        if (entry.actions.length > 0) {
          console.log(chalk.yellow(`  Acciones: ${entry.actions.length}`));
        }
      });
    }
    console.log();
  }

  /**
   * Muestra contexto actual
   */
  showContext() {
    console.log();
    console.log(chalk.blue('🧠 Contexto Claude BRIK'));
    console.log(chalk.gray('━'.repeat(50)));
    console.log(`Identidad: ${this.context?.identity?.name || 'No disponible'}`);
    console.log(`Capacidades: ${this.context?.capabilities?.length || 0}`);
    console.log(`Proyecto actual: ${this.currentProject || 'Ninguno'}`);
    console.log(`Conversaciones: ${this.conversationHistory.length}`);
    console.log();
  }

  /**
   * Muestra estado del sistema
   */
  async showStatus() {
    console.log();
    console.log(chalk.blue('⚡ Estado del Sistema'));
    console.log(chalk.gray('━'.repeat(50)));
    console.log(`Claude Context: ${this.context ? '✅ Cargado' : '❌ No disponible'}`);
    console.log(`Executor: ${this.executor ? '✅ Listo' : '❌ No disponible'}`);
    console.log(`Conocimiento BRIK: ${this.contextManager ? '✅ Cargado' : '❌ No disponible'}`);
    console.log(`Directorio actual: ${process.cwd()}`);
    console.log();
  }

  /**
   * Maneja salida del programa
   */
  handleExit() {
    console.log();
    console.log(chalk.blue('👋 ¡Hasta luego! Que tengas un excelente desarrollo BRIK.'));
    console.log();
    
    if (this.rl) {
      this.rl.close();
    }
    
    process.exit(0);
  }
}

module.exports = BRIKConversationalCLI;

// Si se ejecuta directamente
if (require.main === module) {
  (async () => {
    try {
      const cli = new BRIKConversationalCLI();
      await cli.initialize();
    } catch (error) {
      console.error(chalk.red('❌ Error iniciando CLI:'), error);
      process.exit(1);
    }
  })();
}