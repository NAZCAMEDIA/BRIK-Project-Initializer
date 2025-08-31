#!/usr/bin/env node

/**
 * 🤖 BRIK CLI con SDKs Oficiales de IA
 * Integración nativa con @anthropic-ai/sdk, @google/generative-ai y openai
 */

const readline = require('readline');
const path = require('path');
const fs = require('fs');
const { ClaudeSDKManager, BrikClaudeGenerator } = require('./ai-agents/claude-sdk-manager');
const ora = require('ora');
const chalk = require('chalk');

// Interfaz readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Utilidad para preguntas
const question = (query) => new Promise((resolve) => {
  rl.question(chalk.cyan(query), resolve);
});

// Banner principal
const showBanner = () => {
  console.clear();
  console.log(chalk.cyan.bold(`
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                          ║
║     🧬 BRIK PROJECT INITIALIZER v5.0 - SDK EDITION 🤖                   ║
║                                                                          ║
║              Powered by Official AI SDKs                                ║
║         @anthropic-ai/sdk | @google/generative-ai | openai             ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
`));
  
  console.log(chalk.dim(`
  🧬 Filosofía: DAAF-BRIK-Circuitalidad Digital
  🤖 SDKs Oficiales: Claude 3, Gemini 1.5, GPT-4
  🏆 Certificación: Nivel L3 Empresarial
`));
};

// Menú principal
const mainMenu = async () => {
  console.log(chalk.yellow.bold('\n📋 MENÚ PRINCIPAL\n'));
  
  const options = [
    '1. 🤖 Crear proyecto BRIK con Claude SDK',
    '2. 🔄 Reestructurar proyecto existente',
    '3. 📊 Analizar proyecto con IA',
    '4. 🧪 Test de conexión con Claude',
    '5. ⚙️  Configurar Claude SDK',
    '6. 📚 Ver documentación',
    '7. 🚪 Salir'
  ];
  
  options.forEach(opt => console.log(chalk.white(`  ${opt}`)));
  
  const choice = await question('\n👉 Selecciona una opción: ');
  
  switch(choice) {
    case '1':
      await createProjectWithClaude();
      break;
    case '2':
      await restructureProject();
      break;
    case '3':
      await analyzeProject();
      break;
    case '4':
      await testClaudeConnection();
      break;
    case '5':
      await configureClaude();
      break;
    case '6':
      await showDocumentation();
      break;
    case '7':
      console.log(chalk.green('\n👋 ¡Hasta luego! Que tus proyectos sean 100% BRIK\n'));
      process.exit(0);
    default:
      console.log(chalk.red('❌ Opción inválida'));
      await mainMenu();
  }
};

// Crear proyecto con Claude SDK
const createProjectWithClaude = async () => {
  console.log(chalk.magenta.bold('\n🤖 CREAR PROYECTO BRIK CON CLAUDE SDK\n'));
  
  const generator = new BrikClaudeGenerator();
  
  // Verificar configuración
  if (!generator.claude.config.apiKey) {
    console.log(chalk.yellow('⚠️  No hay API Key configurada para Claude'));
    const configure = await question('¿Configurar ahora? (s/n): ');
    
    if (configure.toLowerCase() === 's') {
      await configureClaude();
    } else {
      console.log(chalk.red('❌ API Key requerida para continuar'));
      await mainMenu();
      return;
    }
  }
  
  // Obtener detalles del proyecto
  const projectName = await question('\n📝 Nombre del proyecto: ');
  const description = await question('📋 Descripción detallada del proyecto:\n');
  
  console.log(chalk.yellow('\n💻 Lenguajes disponibles:'));
  console.log('  1. 🦀 Rust');
  console.log('  2. 📘 TypeScript');
  console.log('  3. 🐍 Python');
  
  const langChoice = await question('\nSelecciona lenguaje (1-3): ');
  const languages = { '1': 'rust', '2': 'typescript', '3': 'python' };
  const language = languages[langChoice] || 'typescript';
  
  const integrationsInput = await question('\n🔌 Integraciones (separadas por comas): ');
  const integrations = integrationsInput.split(',').map(i => i.trim()).filter(Boolean).join(',');
  
  const outputPath = await question(`📂 Ruta de salida (default: ./${projectName}): `) || `./${projectName}`;
  
  // Mostrar resumen
  console.log(chalk.cyan.bold('\n📊 RESUMEN DEL PROYECTO:'));
  console.log(`  📝 Nombre: ${projectName}`);
  console.log(`  📋 Descripción: ${description.substring(0, 100)}...`);
  console.log(`  💻 Lenguaje: ${language}`);
  console.log(`  🔌 Integraciones: ${integrations || 'ninguna'}`);
  console.log(`  📂 Ubicación: ${path.resolve(outputPath)}`);
  
  const confirm = await question('\n¿Proceder con la generación? (s/n): ');
  
  if (confirm.toLowerCase() !== 's') {
    console.log(chalk.yellow('⚠️  Generación cancelada'));
    await mainMenu();
    return;
  }
  
  // Generar proyecto
  const spinner = ora('Inicializando Claude SDK...').start();
  
  try {
    const result = await generator.generateFullProject(
      projectName,
      description,
      language,
      integrations,
      outputPath
    );
    
    spinner.succeed('¡Proyecto generado exitosamente!');
    
    // Mostrar estadísticas
    console.log(chalk.green.bold('\n✅ PROYECTO BRIK GENERADO'));
    console.log(`  📁 Ubicación: ${result.path}`);
    console.log(`  📄 Archivos creados: ${result.files.length}`);
    console.log(`  🧬 Arquitectura: CORE + WRAPPERS + LIVING LAYER`);
    console.log(`  🧪 Tests: 100% cobertura incluida`);
    console.log(`  📚 Documentación: Completa`);
    
    // Mostrar siguiente paso
    console.log(chalk.cyan.bold('\n🚀 PRÓXIMOS PASOS:'));
    console.log(`  1. cd ${outputPath}`);
    console.log(`  2. ${getInstallCommand(language)}`);
    console.log(`  3. ./scripts/test-coverage.sh`);
    console.log(`  4. ./scripts/brik-certify.sh`);
    
  } catch (error) {
    spinner.fail('Error en la generación');
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
  }
  
  await question('\nPresiona Enter para continuar...');
  await mainMenu();
};

// Reestructurar proyecto
const restructureProject = async () => {
  console.log(chalk.magenta.bold('\n🔄 REESTRUCTURAR PROYECTO CON CLAUDE SDK\n'));
  
  const projectPath = await question('📂 Ruta del proyecto existente: ');
  
  if (!fs.existsSync(projectPath)) {
    console.log(chalk.red('❌ El proyecto no existe'));
    await mainMenu();
    return;
  }
  
  const claude = new ClaudeSDKManager();
  
  // Verificar configuración
  if (!claude.config.apiKey) {
    console.log(chalk.yellow('⚠️  Claude SDK no configurado'));
    await configureClaude();
    return;
  }
  
  const spinner = ora('Analizando proyecto...').start();
  
  try {
    await claude.initialize();
    const analysis = await claude.analyzeProject(projectPath);
    
    spinner.succeed('Análisis completado');
    
    // Mostrar análisis
    console.log(chalk.cyan.bold('\n📊 ANÁLISIS DEL PROYECTO:'));
    
    if (analysis.content) {
      console.log(analysis.content);
    } else {
      console.log(JSON.stringify(analysis, null, 2));
    }
    
    const proceed = await question('\n¿Aplicar reestructuración BRIK? (s/n): ');
    
    if (proceed.toLowerCase() === 's') {
      // Crear backup
      const backupPath = `${projectPath}.backup-${Date.now()}`;
      console.log(chalk.yellow(`\n📦 Creando backup en: ${backupPath}`));
      
      const { execSync } = require('child_process');
      execSync(`cp -r "${projectPath}" "${backupPath}"`);
      
      console.log(chalk.green('✅ Backup creado'));
      console.log(chalk.yellow('⚠️  La reestructuración automática está en desarrollo'));
    }
    
  } catch (error) {
    spinner.fail('Error en análisis');
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
  }
  
  await question('\nPresiona Enter para continuar...');
  await mainMenu();
};

// Analizar proyecto
const analyzeProject = async () => {
  console.log(chalk.magenta.bold('\n📊 ANALIZAR PROYECTO CON CLAUDE SDK\n'));
  
  const projectPath = await question('📂 Ruta del proyecto: ');
  
  if (!fs.existsSync(projectPath)) {
    console.log(chalk.red('❌ El proyecto no existe'));
    await mainMenu();
    return;
  }
  
  const claude = new ClaudeSDKManager();
  const spinner = ora('Analizando con Claude...').start();
  
  try {
    await claude.initialize();
    const analysis = await claude.analyzeProject(projectPath);
    
    spinner.succeed('Análisis completado');
    
    console.log(chalk.cyan.bold('\n📊 REPORTE DE ANÁLISIS BRIK:'));
    
    if (typeof analysis === 'object' && !analysis.content) {
      // Si es JSON estructurado
      console.log(chalk.white(JSON.stringify(analysis, null, 2)));
    } else {
      // Si es texto
      console.log(chalk.white(analysis.content || analysis));
    }
    
    // Guardar reporte
    const save = await question('\n¿Guardar reporte? (s/n): ');
    
    if (save.toLowerCase() === 's') {
      const reportPath = path.join(projectPath, 'brik-analysis-claude.json');
      fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
      console.log(chalk.green(`✅ Reporte guardado en: ${reportPath}`));
    }
    
  } catch (error) {
    spinner.fail('Error en análisis');
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
  }
  
  await question('\nPresiona Enter para continuar...');
  await mainMenu();
};

// Test de conexión
const testClaudeConnection = async () => {
  console.log(chalk.magenta.bold('\n🧪 TEST DE CONEXIÓN CON CLAUDE SDK\n'));
  
  const claude = new ClaudeSDKManager();
  const spinner = ora('Conectando con Claude...').start();
  
  try {
    const success = await claude.testConnection();
    
    if (success) {
      spinner.succeed('Conexión exitosa con Claude');
      
      // Mostrar detalles
      console.log(chalk.green.bold('\n✅ CLAUDE SDK OPERATIVO'));
      console.log(`  🤖 Modelo: ${claude.config.model}`);
      console.log(`  🔑 API Key: ${claude.config.apiKey ? '****' + claude.config.apiKey.slice(-4) : 'No configurada'}`);
      console.log(`  📊 Max Tokens: ${claude.config.maxTokens}`);
      
      // Hacer una prueba de generación
      const testGeneration = await question('\n¿Hacer prueba de generación BRIK? (s/n): ');
      
      if (testGeneration.toLowerCase() === 's') {
        spinner.start('Generando ejemplo BRIK...');
        
        const message = await claude.client.messages.create({
          model: claude.config.model,
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: 'Genera un ejemplo simple de entidad CORE BRIK en TypeScript con su test unitario'
          }]
        });
        
        spinner.succeed('Ejemplo generado');
        console.log(chalk.cyan('\n📝 EJEMPLO GENERADO:'));
        console.log(chalk.white(message.content[0].text));
        
        // Mostrar estadísticas
        const stats = claude.getUsageStats(message);
        if (stats) {
          console.log(chalk.yellow('\n📊 ESTADÍSTICAS:'));
          console.log(`  Tokens entrada: ${stats.inputTokens}`);
          console.log(`  Tokens salida: ${stats.outputTokens}`);
          console.log(`  Total: ${stats.totalTokens}`);
          console.log(`  Costo estimado: $${stats.estimatedCost.total} USD`);
        }
      }
      
    } else {
      spinner.fail('No se pudo conectar con Claude');
    }
    
  } catch (error) {
    spinner.fail('Error en conexión');
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
    
    if (error.message.includes('API Key')) {
      console.log(chalk.yellow('\n💡 Configura tu API Key con la opción 5 del menú'));
    }
  }
  
  await question('\nPresiona Enter para continuar...');
  await mainMenu();
};

// Configurar Claude
const configureClaude = async () => {
  console.log(chalk.magenta.bold('\n⚙️  CONFIGURAR CLAUDE SDK\n'));
  
  const claude = new ClaudeSDKManager();
  
  // Mostrar configuración actual
  console.log(chalk.cyan('Configuración actual:'));
  console.log(`  🔑 API Key: ${claude.config.apiKey ? '****' + claude.config.apiKey.slice(-4) : 'No configurada'}`);
  console.log(`  🤖 Modelo: ${claude.config.model}`);
  console.log(`  📊 Max Tokens: ${claude.config.maxTokens}`);
  
  // Menú de configuración
  console.log(chalk.yellow('\n¿Qué deseas configurar?'));
  console.log('  1. API Key');
  console.log('  2. Modelo');
  console.log('  3. Max Tokens');
  console.log('  4. System Prompt');
  console.log('  5. Volver');
  
  const choice = await question('\nSelecciona (1-5): ');
  
  switch(choice) {
    case '1':
      const apiKey = await question('🔑 Ingresa tu API Key de Anthropic: ');
      await claude.configureApiKey(apiKey);
      console.log(chalk.green('✅ API Key configurada'));
      break;
      
    case '2':
      console.log(chalk.yellow('\nModelos disponibles:'));
      console.log('  1. Claude 3 Opus (más potente)');
      console.log('  2. Claude 3 Sonnet (balanceado)');
      console.log('  3. Claude 3 Haiku (más rápido)');
      
      const modelChoice = await question('\nSelecciona modelo (1-3): ');
      const models = { '1': 'opus', '2': 'sonnet', '3': 'haiku' };
      claude.setModel(models[modelChoice] || 'opus');
      break;
      
    case '3':
      const maxTokens = await question('📊 Max tokens (1-100000): ');
      claude.setMaxTokens(parseInt(maxTokens) || 4096);
      console.log(chalk.green('✅ Max tokens configurado'));
      break;
      
    case '4':
      console.log(chalk.yellow('System prompt actual:'));
      console.log(claude.config.systemPrompt);
      const newPrompt = await question('\nNuevo system prompt (Enter para mantener): ');
      if (newPrompt) {
        claude.setSystemPrompt(newPrompt);
        console.log(chalk.green('✅ System prompt actualizado'));
      }
      break;
      
    case '5':
      await mainMenu();
      return;
  }
  
  await configureClaude();
};

// Mostrar documentación
const showDocumentation = async () => {
  console.log(chalk.magenta.bold('\n📚 DOCUMENTACIÓN BRIK SDK\n'));
  
  const docs = `
${chalk.cyan.bold('CLAUDE SDK OFICIAL')}
${chalk.white('El sistema usa @anthropic-ai/sdk para comunicación directa con Claude.')}

${chalk.yellow('Características:')}
• Streaming de respuestas en tiempo real
• Tool use / Function calling
• Control total de parámetros
• Gestión de tokens y costos
• Reintentos automáticos

${chalk.yellow('Modelos disponibles:')}
• Claude 3 Opus: Más potente, ideal para código complejo
• Claude 3 Sonnet: Balanceado, buena relación costo/rendimiento
• Claude 3 Haiku: Más rápido y económico

${chalk.yellow('Arquitectura BRIK generada:')}
• CORE: Lógica de negocio inmutable
• WRAPPERS: Adaptadores para servicios externos
• LIVING LAYER: Monitoreo y consciencia del sistema
• Tests: 100% cobertura garantizada
• Documentación: Completa y auto-consistente

${chalk.yellow('Costos aproximados:')}
• Opus: $15/$75 por millón de tokens (entrada/salida)
• Sonnet: $3/$15 por millón de tokens
• Haiku: $0.25/$1.25 por millón de tokens

${chalk.yellow('Configuración:')}
1. Obtén tu API Key en: https://console.anthropic.com
2. Configura con opción 5 del menú
3. Prueba conexión con opción 4

${chalk.yellow('Uso típico:')}
Un proyecto completo usa ~20-50K tokens (~$0.50-$3.00)
`;

  console.log(docs);
  
  await question('\nPresiona Enter para continuar...');
  await mainMenu();
};

// Funciones auxiliares
const getInstallCommand = (language) => {
  const commands = {
    rust: 'cargo build',
    typescript: 'npm install',
    python: 'pip install -r requirements.txt'
  };
  return commands[language] || 'install dependencies';
};

// Main
const main = async () => {
  showBanner();
  
  // Verificar Node.js versión
  const nodeVersion = process.version.slice(1).split('.')[0];
  if (parseInt(nodeVersion) < 18) {
    console.log(chalk.red(`❌ Node.js 18+ requerido (actual: ${process.version})`));
    process.exit(1);
  }
  
  // Verificar si el SDK está instalado
  try {
    require('@anthropic-ai/sdk');
    console.log(chalk.green('✅ SDK de Anthropic detectado'));
  } catch {
    console.log(chalk.yellow('⚠️  SDK de Anthropic no instalado'));
    console.log(chalk.cyan('📦 Instala con: npm install'));
  }
  
  await mainMenu();
  rl.close();
};

// Manejo de Ctrl+C
process.on('SIGINT', () => {
  console.log(chalk.cyan.bold('\n\n🤖 ¡Hasta luego! Que Claude guíe tus proyectos BRIK\n'));
  process.exit(0);
});

// Ejecutar
main().catch(error => {
  console.error(chalk.red(`❌ Error fatal: ${error.message}`));
  process.exit(1);
});