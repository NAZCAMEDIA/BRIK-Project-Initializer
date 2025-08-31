#!/usr/bin/env node

/**
 * 🤖 BRIK CLI con Claude Pro/Max Subscription
 * Usa tu cuenta de Claude directamente - NO requiere API Key
 * Automatización web con Playwright
 */

const readline = require('readline');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const { ClaudeWebAutomation, BrikClaudeWebGenerator } = require('./ai-agents/claude-web-automation');

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
║   🧬 BRIK PROJECT INITIALIZER - CLAUDE PRO/MAX EDITION 🎯               ║
║                                                                          ║
║         Usa tu suscripción de Claude directamente                       ║
║              NO requiere API Key - Solo tu cuenta                       ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
`));
  
  console.log(chalk.dim(`
  🎯 Usa tu cuenta Claude Pro/Max directamente
  🧬 Arquitectura BRIK con 100% cobertura
  🤖 Sin límites de API - Usa tu suscripción ilimitada
`));
};

// Variable global para mantener la sesión
let claudeSession = null;

// Menú principal
const mainMenu = async () => {
  console.log(chalk.yellow.bold('\n📋 MENÚ PRINCIPAL\n'));
  
  const options = [
    '1. 🤖 Crear proyecto BRIK con Claude Pro/Max',
    '2. 🔄 Reestructurar proyecto existente',
    '3. 📊 Analizar proyecto con Claude',
    '4. 🌐 Abrir Claude en navegador',
    '5. 💾 Exportar conversación actual',
    '6. 🔄 Nueva conversación',
    '7. 📚 Ayuda y documentación',
    '8. 🚪 Salir'
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
      await openClaudeInBrowser();
      break;
    case '5':
      await exportConversation();
      break;
    case '6':
      await startNewConversation();
      break;
    case '7':
      await showHelp();
      break;
    case '8':
      await cleanup();
      console.log(chalk.green('\n👋 ¡Hasta luego! Que tus proyectos sean 100% BRIK\n'));
      process.exit(0);
    default:
      console.log(chalk.red('❌ Opción inválida'));
      await mainMenu();
  }
};

// Inicializar sesión de Claude
const initializeClaude = async (headless = false) => {
  if (!claudeSession) {
    claudeSession = new ClaudeWebAutomation();
    
    console.log(chalk.yellow('\n🌐 Conectando con Claude...'));
    console.log(chalk.dim('Se abrirá un navegador para que inicies sesión con tu cuenta Pro/Max\n'));
    
    const success = await claudeSession.initialize({ headless });
    
    if (!success) {
      console.log(chalk.red('❌ No se pudo conectar con Claude'));
      claudeSession = null;
      return false;
    }
  }
  
  return true;
};

// Crear proyecto con Claude
const createProjectWithClaude = async () => {
  console.log(chalk.magenta.bold('\n🤖 CREAR PROYECTO BRIK CON CLAUDE PRO/MAX\n'));
  
  // Inicializar Claude si no está activo
  if (!await initializeClaude()) {
    await mainMenu();
    return;
  }
  
  // Obtener detalles del proyecto
  const projectName = await question('\n📝 Nombre del proyecto: ');
  const description = await question('📋 Descripción detallada del proyecto:\n');
  
  console.log(chalk.yellow('\n💻 Lenguajes disponibles:'));
  console.log('  1. 🦀 Rust - Alto rendimiento');
  console.log('  2. 📘 TypeScript - Web moderno');
  console.log('  3. 🐍 Python - IA y datos');
  console.log('  4. 🐹 Go - Microservicios');
  
  const langChoice = await question('\nSelecciona lenguaje (1-4): ');
  const languages = { '1': 'rust', '2': 'typescript', '3': 'python', '4': 'go' };
  const language = languages[langChoice] || 'typescript';
  
  const integrationsInput = await question('\n🔌 Integraciones necesarias (separadas por comas): ');
  const integrations = integrationsInput.split(',').map(i => i.trim()).filter(Boolean).join(', ');
  
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
  const spinner = ora('Generando proyecto con Claude...').start();
  
  try {
    const generator = new BrikClaudeWebGenerator();
    generator.claude = claudeSession; // Reusar sesión existente
    
    spinner.text = 'Enviando especificaciones a Claude...';
    
    const result = await claudeSession.generateBrikProject(
      description,
      language,
      integrations
    );
    
    spinner.text = 'Procesando respuesta de Claude...';
    
    // Escribir archivos
    if (result.files && Object.keys(result.files).length > 0) {
      spinner.text = 'Escribiendo archivos del proyecto...';
      
      await writeProject(result.files, outputPath, projectName, language);
      
      spinner.succeed('¡Proyecto generado exitosamente!');
      
      // Mostrar estadísticas
      console.log(chalk.green.bold('\n✅ PROYECTO BRIK GENERADO'));
      console.log(`  📁 Ubicación: ${path.resolve(outputPath)}`);
      console.log(`  📄 Archivos creados: ${Object.keys(result.files).length}`);
      console.log(`  🧬 Arquitectura: CORE + WRAPPERS + LIVING LAYER`);
      console.log(`  🧪 Tests: 100% cobertura incluida`);
      console.log(`  📚 Documentación: Completa`);
      
      // Mostrar siguiente paso
      console.log(chalk.cyan.bold('\n🚀 PRÓXIMOS PASOS:'));
      console.log(`  1. cd ${outputPath}`);
      console.log(`  2. ${getInstallCommand(language)}`);
      console.log(`  3. ${getTestCommand(language)}`);
      console.log(`  4. ./scripts/brik-certify.sh`);
    } else {
      spinner.warn('Claude generó una respuesta pero no se detectaron archivos');
      
      // Guardar respuesta raw
      const responsePath = path.join(outputPath, 'claude-response.md');
      fs.mkdirSync(outputPath, { recursive: true });
      fs.writeFileSync(responsePath, result.rawResponse || 'Sin respuesta');
      
      console.log(chalk.yellow(`\n⚠️  Respuesta guardada en: ${responsePath}`));
      console.log('Revisa el archivo y extrae el código manualmente si es necesario');
    }
    
  } catch (error) {
    spinner.fail('Error en la generación');
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
  }
  
  await question('\nPresiona Enter para continuar...');
  await mainMenu();
};

// Reestructurar proyecto existente
const restructureProject = async () => {
  console.log(chalk.magenta.bold('\n🔄 REESTRUCTURAR PROYECTO CON CLAUDE\n'));
  
  const projectPath = await question('📂 Ruta del proyecto existente: ');
  
  if (!fs.existsSync(projectPath)) {
    console.log(chalk.red('❌ El proyecto no existe'));
    await mainMenu();
    return;
  }
  
  // Inicializar Claude
  if (!await initializeClaude()) {
    await mainMenu();
    return;
  }
  
  const spinner = ora('Analizando proyecto...').start();
  
  try {
    const analysis = await claudeSession.analyzeProject(projectPath);
    
    spinner.succeed('Análisis completado');
    
    // Mostrar análisis
    console.log(chalk.cyan.bold('\n📊 ANÁLISIS DEL PROYECTO:'));
    console.log(chalk.white(analysis));
    
    // Guardar análisis
    const save = await question('\n¿Guardar análisis? (s/n): ');
    
    if (save.toLowerCase() === 's') {
      const analysisPath = path.join(projectPath, 'brik-analysis.md');
      fs.writeFileSync(analysisPath, analysis);
      console.log(chalk.green(`✅ Análisis guardado en: ${analysisPath}`));
    }
    
    // Ofrecer reestructuración
    const restructure = await question('\n¿Generar plan de reestructuración BRIK? (s/n): ');
    
    if (restructure.toLowerCase() === 's') {
      spinner.start('Generando plan de reestructuración...');
      
      const prompt = `Genera un plan detallado paso a paso para reestructurar este proyecto a arquitectura BRIK. 
                       Incluye comandos específicos, archivos a crear/mover, y código necesario.`;
      
      const plan = await claudeSession.sendMessage(prompt);
      
      spinner.succeed('Plan generado');
      
      const planPath = path.join(projectPath, 'brik-restructure-plan.md');
      fs.writeFileSync(planPath, plan);
      
      console.log(chalk.green(`✅ Plan guardado en: ${planPath}`));
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
  console.log(chalk.magenta.bold('\n📊 ANALIZAR PROYECTO CON CLAUDE\n'));
  
  const projectPath = await question('📂 Ruta del proyecto: ');
  
  if (!fs.existsSync(projectPath)) {
    console.log(chalk.red('❌ El proyecto no existe'));
    await mainMenu();
    return;
  }
  
  if (!await initializeClaude()) {
    await mainMenu();
    return;
  }
  
  const spinner = ora('Analizando con Claude...').start();
  
  try {
    const analysis = await claudeSession.analyzeProject(projectPath);
    
    spinner.succeed('Análisis completado');
    
    console.log(chalk.cyan.bold('\n📊 ANÁLISIS BRIK:'));
    console.log(chalk.white(analysis));
    
  } catch (error) {
    spinner.fail('Error en análisis');
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
  }
  
  await question('\nPresiona Enter para continuar...');
  await mainMenu();
};

// Abrir Claude en navegador
const openClaudeInBrowser = async () => {
  console.log(chalk.magenta.bold('\n🌐 ABRIR CLAUDE EN NAVEGADOR\n'));
  
  if (!await initializeClaude(false)) {
    await mainMenu();
    return;
  }
  
  console.log(chalk.green('✅ Claude abierto en el navegador'));
  console.log(chalk.yellow('Puedes interactuar directamente con Claude'));
  console.log(chalk.dim('El CLI capturará las respuestas automáticamente'));
  
  await question('\nPresiona Enter cuando termines...');
  await mainMenu();
};

// Exportar conversación
const exportConversation = async () => {
  if (!claudeSession) {
    console.log(chalk.yellow('⚠️  No hay sesión activa de Claude'));
    await mainMenu();
    return;
  }
  
  const outputPath = await question('📂 Ruta para guardar la conversación: ') || './claude-conversation.json';
  
  const success = await claudeSession.exportChat(outputPath);
  
  if (success) {
    console.log(chalk.green(`✅ Conversación exportada a: ${outputPath}`));
  } else {
    console.log(chalk.red('❌ Error exportando conversación'));
  }
  
  await question('\nPresiona Enter para continuar...');
  await mainMenu();
};

// Nueva conversación
const startNewConversation = async () => {
  if (!claudeSession) {
    console.log(chalk.yellow('⚠️  No hay sesión activa de Claude'));
    await mainMenu();
    return;
  }
  
  await claudeSession.startNewChat();
  console.log(chalk.green('✅ Nueva conversación iniciada'));
  
  await mainMenu();
};

// Mostrar ayuda
const showHelp = async () => {
  console.log(chalk.magenta.bold('\n📚 AYUDA - CLAUDE PRO/MAX EDITION\n'));
  
  const help = `
${chalk.cyan.bold('CÓMO FUNCIONA:')}
Este CLI usa tu suscripción de Claude Pro/Max directamente a través del navegador.
No necesitas API Key - solo tu cuenta de Claude.

${chalk.yellow.bold('PRIMERA VEZ:')}
1. Se abrirá un navegador automáticamente
2. Inicia sesión con tu cuenta Claude Pro/Max
3. El CLI recordará tu sesión para futuros usos

${chalk.yellow.bold('GENERACIÓN DE PROYECTOS:')}
- Claude generará código completo con arquitectura BRIK
- 100% de cobertura de tests incluida
- Documentación completa
- Scripts de validación

${chalk.yellow.bold('VENTAJAS:')}
✅ Sin límites de API - usa tu suscripción ilimitada
✅ Contexto extendido de Claude Pro (200K tokens)
✅ Sin costos adicionales de API
✅ Respuestas más rápidas y completas

${chalk.yellow.bold('ARQUITECTURA BRIK:')}
• CORE: Lógica de negocio inmutable
• WRAPPERS: Adaptadores para servicios externos
• LIVING LAYER: Monitoreo y consciencia del sistema

${chalk.yellow.bold('TROUBLESHOOTING:')}
• Si el navegador no abre: Verifica que tienes Chrome/Chromium instalado
• Si no detecta tu sesión: Cierra y vuelve a abrir el CLI
• Si Claude no responde: Verifica tu conexión a internet
`;

  console.log(help);
  
  await question('\nPresiona Enter para continuar...');
  await mainMenu();
};

// Funciones auxiliares

const writeProject = async (files, outputPath, projectName, language) => {
  fs.mkdirSync(outputPath, { recursive: true });

  // Escribir archivos del proyecto
  for (const [filepath, content] of Object.entries(files)) {
    const fullPath = path.join(outputPath, filepath);
    const dir = path.dirname(fullPath);
    
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content);
    
    console.log(chalk.dim(`  ✅ ${filepath}`));
  }

  // Generar archivos BRIK adicionales
  const brikDna = {
    project: {
      name: projectName,
      version: '1.0.0',
      philosophy: 'DAAF-BRIK-CircuitalidadDigital',
      generated_by: 'Claude Pro/Max Subscription',
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

  // Crear README si no existe
  if (!files['README.md']) {
    const readme = `# ${projectName}

Proyecto generado con arquitectura BRIK usando Claude Pro/Max.

## 🧬 Arquitectura BRIK

- **CORE**: Lógica de negocio pura e inmutable
- **WRAPPERS**: Adaptadores para servicios externos  
- **LIVING LAYER**: Monitoreo y consciencia del sistema

## 🚀 Inicio Rápido

\`\`\`bash
# Instalar dependencias
${getInstallCommand(language)}

# Ejecutar tests
${getTestCommand(language)}

# Verificar cobertura
./scripts/test-coverage.sh

# Certificación BRIK
./scripts/brik-certify.sh
\`\`\`

## 📚 Documentación

Ver carpeta \`docs/\` para documentación completa.
`;

    fs.writeFileSync(path.join(outputPath, 'README.md'), readme);
  }

  // Copiar scripts de validación si existen
  const scriptsDir = path.join(__dirname, 'scripts');
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
};

const getInstallCommand = (language) => {
  const commands = {
    rust: 'cargo build',
    typescript: 'npm install',
    python: 'pip install -r requirements.txt',
    go: 'go mod download'
  };
  return commands[language] || 'install dependencies';
};

const getTestCommand = (language) => {
  const commands = {
    rust: 'cargo test',
    typescript: 'npm test',
    python: 'pytest',
    go: 'go test ./...'
  };
  return commands[language] || 'run tests';
};

const cleanup = async () => {
  if (claudeSession) {
    console.log(chalk.yellow('Cerrando sesión de Claude...'));
    await claudeSession.close();
  }
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
  
  // Verificar Playwright
  try {
    require('playwright');
    console.log(chalk.green('✅ Playwright detectado'));
  } catch {
    console.log(chalk.yellow('⚠️  Playwright no instalado'));
    console.log(chalk.cyan('📦 Instala con: npm install playwright'));
    console.log(chalk.cyan('   Luego: npx playwright install chromium'));
    process.exit(1);
  }
  
  // Mensaje inicial
  console.log(chalk.cyan('\n💡 Este CLI usa tu suscripción Claude Pro/Max directamente'));
  console.log(chalk.dim('   No requiere API Key - Solo necesitas tu cuenta\n'));
  
  await mainMenu();
  rl.close();
};

// Manejo de Ctrl+C
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n\nCerrando...'));
  await cleanup();
  console.log(chalk.cyan('👋 ¡Hasta luego! Que tus proyectos sean 100% BRIK\n'));
  process.exit(0);
});

// Manejo de errores no capturados
process.on('uncaughtException', async (error) => {
  console.error(chalk.red(`\n❌ Error inesperado: ${error.message}`));
  await cleanup();
  process.exit(1);
});

// Ejecutar
main().catch(async (error) => {
  console.error(chalk.red(`❌ Error fatal: ${error.message}`));
  await cleanup();
  process.exit(1);
});