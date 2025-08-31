#!/usr/bin/env node

/**
 * Test System - BRIK AI Claude Omnisciente
 * Pruebas del sistema completo
 */

const path = require('path');
const chalk = require('chalk');

class BRIKSystemTester {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  /**
   * Ejecuta todas las pruebas del sistema
   */
  async runAllTests() {
    console.log(chalk.blue('🧪 BRIK AI System Tests'));
    console.log(chalk.gray('═'.repeat(50)));
    console.log();

    // Registrar todas las pruebas
    this.registerTests();

    // Ejecutar pruebas secuencialmente
    for (const test of this.tests) {
      await this.runTest(test);
    }

    // Mostrar resumen
    this.showSummary();
    
    // Exit code basado en resultados
    process.exit(this.results.failed > 0 ? 1 : 0);
  }

  /**
   * Registra todas las pruebas
   */
  registerTests() {
    this.tests = [
      {
        name: 'Knowledge Loader',
        description: 'Verificar carga de conocimiento BRIK',
        test: this.testKnowledgeLoader.bind(this)
      },
      {
        name: 'Context Manager',
        description: 'Verificar generación de contexto Claude',
        test: this.testContextManager.bind(this)
      },
      {
        name: 'CLI Components',
        description: 'Verificar componentes de CLI',
        test: this.testCLIComponents.bind(this)
      },
      {
        name: 'Executor System',
        description: 'Verificar sistema de ejecución',
        test: this.testExecutorSystem.bind(this)
      },
      {
        name: 'File Structure',
        description: 'Verificar estructura de archivos',
        test: this.testFileStructure.bind(this)
      },
      {
        name: 'Dependencies',
        description: 'Verificar dependencias del sistema',
        test: this.testDependencies.bind(this)
      }
    ];
  }

  /**
   * Ejecuta una prueba individual
   */
  async runTest(test) {
    this.results.total++;
    
    try {
      console.log(chalk.yellow(`🔄 ${test.name}: ${test.description}`));
      
      const startTime = Date.now();
      await test.test();
      const duration = Date.now() - startTime;
      
      console.log(chalk.green(`✅ ${test.name} - OK (${duration}ms)`));
      this.results.passed++;
      
    } catch (error) {
      console.log(chalk.red(`❌ ${test.name} - FAIL`));
      console.log(chalk.red(`   Error: ${error.message}`));
      this.results.failed++;
    }
    
    console.log();
  }

  /**
   * Test: Knowledge Loader
   */
  async testKnowledgeLoader() {
    const BRIKKnowledgeLoader = require('../src/knowledge/loader');
    
    // Verificar que la clase existe
    if (typeof BRIKKnowledgeLoader !== 'function') {
      throw new Error('BRIKKnowledgeLoader no es una función constructora');
    }
    
    // Crear instancia
    const rootPath = path.resolve(__dirname, '..');
    const loader = new BRIKKnowledgeLoader(rootPath);
    
    // Verificar métodos principales
    const requiredMethods = [
      'loadAll',
      'loadMethodology', 
      'loadTemplates',
      'loadExamples',
      'generateClaudeContext'
    ];
    
    for (const method of requiredMethods) {
      if (typeof loader[method] !== 'function') {
        throw new Error(`Método ${method} no encontrado en KnowledgeLoader`);
      }
    }
    
    // Verificar que puede cargar estructura básica
    loader.knowledge = {
      methodology: {},
      templates: {},
      examples: {},
      documentation: {},
      certification: {}
    };
    
    const context = loader.generateClaudeContext();
    if (!context || !context.role) {
      throw new Error('Context generado es inválido');
    }
  }

  /**
   * Test: Context Manager
   */
  async testContextManager() {
    const BRIKClaudeContextManager = require('../src/claude/context-manager');
    
    // Verificar clase
    if (typeof BRIKClaudeContextManager !== 'function') {
      throw new Error('BRIKClaudeContextManager no es una función constructora');
    }
    
    // Crear instancia
    const contextManager = new BRIKClaudeContextManager();
    
    // Verificar métodos
    const requiredMethods = [
      'generateFullContext',
      'extractMethodologyCore',
      'extractCorePrinciples',
      'generateSystemPrompt'
    ];
    
    for (const method of requiredMethods) {
      if (typeof contextManager[method] !== 'function') {
        throw new Error(`Método ${method} no encontrado en ContextManager`);
      }
    }
    
    // Verificar generación de contexto básico
    contextManager.knowledge = {
      methodology: {},
      templates: {},
      examples: {}
    };
    
    const context = contextManager.generateFullContext();
    if (!context.identity || !context.capabilities) {
      throw new Error('Contexto generado incompleto');
    }
    
    const systemPrompt = contextManager.generateSystemPrompt();
    if (!systemPrompt || systemPrompt.length < 100) {
      throw new Error('System prompt muy corto o vacío');
    }
  }

  /**
   * Test: CLI Components
   */
  async testCLIComponents() {
    const BRIKConversationalCLI = require('../src/cli/conversational');
    
    // Verificar clase
    if (typeof BRIKConversationalCLI !== 'function') {
      throw new Error('BRIKConversationalCLI no es una función constructora');
    }
    
    // Crear instancia (sin inicializar completamente)
    const cli = new BRIKConversationalCLI();
    
    // Verificar métodos principales
    const requiredMethods = [
      'initialize',
      'handleUserInput',
      'processWithClaude',
      'showWelcome',
      'handleSpecialCommands'
    ];
    
    for (const method of requiredMethods) {
      if (typeof cli[method] !== 'function') {
        throw new Error(`Método ${method} no encontrado en CLI`);
      }
    }
    
    // Verificar propiedades iniciales
    if (!cli.hasOwnProperty('conversationHistory')) {
      throw new Error('Propiedad conversationHistory no encontrada');
    }
  }

  /**
   * Test: Executor System
   */
  async testExecutorSystem() {
    const BRIKExecutor = require('../src/execution/executor');
    
    // Verificar clase
    if (typeof BRIKExecutor !== 'function') {
      throw new Error('BRIKExecutor no es una función constructora');
    }
    
    // Crear instancia
    const executor = new BRIKExecutor();
    
    // Verificar métodos principales
    const requiredMethods = [
      'execute',
      'createProjectStructure',
      'analyzeProject',
      'setupActionHandlers'
    ];
    
    for (const method of requiredMethods) {
      if (typeof executor[method] !== 'function') {
        throw new Error(`Método ${method} no encontrado en Executor`);
      }
    }
    
    // Verificar que actionHandlers está inicializado
    if (!executor.actionHandlers || !(executor.actionHandlers instanceof Map)) {
      throw new Error('actionHandlers no está correctamente inicializado');
    }
    
    // Verificar algunos handlers críticos
    const criticalHandlers = [
      'create_project_structure',
      'analyze_project',
      'create_api_project'
    ];
    
    for (const handler of criticalHandlers) {
      if (!executor.actionHandlers.has(handler)) {
        throw new Error(`Handler ${handler} no registrado`);
      }
    }
  }

  /**
   * Test: File Structure
   */
  async testFileStructure() {
    const fs = require('fs').promises;
    
    // Verificar archivos principales
    const requiredFiles = [
      'brik-ai.js',
      'package.json',
      'src/knowledge/loader.js',
      'src/claude/context-manager.js',
      'src/cli/conversational.js',
      'src/execution/executor.js'
    ];
    
    const rootPath = path.resolve(__dirname, '..');
    
    for (const file of requiredFiles) {
      const filePath = path.join(rootPath, file);
      try {
        const stat = await fs.stat(filePath);
        if (!stat.isFile()) {
          throw new Error(`${file} no es un archivo válido`);
        }
      } catch (error) {
        throw new Error(`Archivo ${file} no encontrado: ${error.message}`);
      }
    }
    
    // Verificar estructura de directorios
    const requiredDirs = [
      'src',
      'src/knowledge',
      'src/claude',
      'src/cli',
      'src/execution'
    ];
    
    for (const dir of requiredDirs) {
      const dirPath = path.join(rootPath, dir);
      try {
        const stat = await fs.stat(dirPath);
        if (!stat.isDirectory()) {
          throw new Error(`${dir} no es un directorio válido`);
        }
      } catch (error) {
        throw new Error(`Directorio ${dir} no encontrado: ${error.message}`);
      }
    }
  }

  /**
   * Test: Dependencies
   */
  async testDependencies() {
    // Verificar módulos core de Node.js
    const coreModules = [
      'fs',
      'path',
      'readline',
      'child_process'
    ];
    
    for (const module of coreModules) {
      try {
        require(module);
      } catch (error) {
        throw new Error(`Módulo core ${module} no disponible`);
      }
    }
    
    // Verificar package.json
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    try {
      const packageJson = require(packageJsonPath);
      
      if (!packageJson.name || !packageJson.version) {
        throw new Error('package.json incompleto');
      }
      
      if (!packageJson.bin || !packageJson.bin['brik-ai']) {
        throw new Error('Configuración bin faltante en package.json');
      }
      
    } catch (error) {
      throw new Error(`Error leyendo package.json: ${error.message}`);
    }
    
    // Verificar dependencias opcionales (se instalan automáticamente)
    const optionalDeps = ['chalk', 'figlet'];
    let missingCount = 0;
    
    for (const dep of optionalDeps) {
      try {
        require.resolve(dep);
      } catch (error) {
        missingCount++;
      }
    }
    
    if (missingCount > 0) {
      console.log(chalk.yellow(`   Info: ${missingCount} dependencias opcionales faltantes (se instalarán automáticamente)`));
    }
  }

  /**
   * Muestra resumen de resultados
   */
  showSummary() {
    console.log(chalk.blue('📊 Resumen de Pruebas'));
    console.log(chalk.gray('═'.repeat(50)));
    console.log();
    
    console.log(`Total de pruebas: ${this.results.total}`);
    console.log(chalk.green(`✅ Exitosas: ${this.results.passed}`));
    
    if (this.results.failed > 0) {
      console.log(chalk.red(`❌ Fallidas: ${this.results.failed}`));
    }
    
    const percentage = Math.round((this.results.passed / this.results.total) * 100);
    console.log(`Éxito: ${percentage}%`);
    
    console.log();
    
    if (this.results.failed === 0) {
      console.log(chalk.green('🎉 ¡Todos los tests pasaron! Sistema listo para uso.'));
    } else {
      console.log(chalk.red('⚠️ Algunos tests fallaron. Revisar errores antes de usar.'));
    }
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  (async () => {
    const tester = new BRIKSystemTester();
    await tester.runAllTests();
  })();
}

module.exports = BRIKSystemTester;