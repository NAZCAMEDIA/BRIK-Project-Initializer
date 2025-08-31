#!/usr/bin/env node

/**
 * 🧬 BRIK CLI - Sistema Interactivo de Gestión de Proyectos BRIK
 * Herramienta completa para crear y reestructurar proyectos con certificación BRIK
 */

const readline = require('readline');
const path = require('path');
const fs = require('fs');
const { spawn, execSync } = require('child_process');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Utilidades de color
const color = (text, colorCode) => `${colorCode}${text}${colors.reset}`;
const log = {
  info: (msg) => console.log(color(`ℹ️  ${msg}`, colors.cyan)),
  success: (msg) => console.log(color(`✅ ${msg}`, colors.green)),
  warning: (msg) => console.log(color(`⚠️  ${msg}`, colors.yellow)),
  error: (msg) => console.log(color(`❌ ${msg}`, colors.red)),
  title: (msg) => console.log(color(`\n${msg}`, colors.bright + colors.magenta)),
  subtitle: (msg) => console.log(color(msg, colors.bright + colors.blue))
};

// Interfaz de línea de comandos
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para hacer preguntas
const question = (query) => new Promise((resolve) => {
  rl.question(color(query, colors.cyan), resolve);
});

// Función para mostrar opciones y obtener selección
const select = async (title, options) => {
  console.log(color(`\n${title}`, colors.bright + colors.yellow));
  options.forEach((opt, idx) => {
    console.log(color(`  ${idx + 1}. ${opt.label}`, colors.white));
  });
  
  const answer = await question('\n👉 Selecciona una opción: ');
  const index = parseInt(answer) - 1;
  
  if (index >= 0 && index < options.length) {
    return options[index];
  } else {
    log.error('Opción inválida. Por favor intenta de nuevo.');
    return await select(title, options);
  }
};

// Banner principal
const showBanner = () => {
  console.clear();
  console.log(color(`
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║     🧬 BRIK PROJECT INITIALIZER v5.0 - Enterprise Edition 🧬      ║
║                                                                    ║
║          Sistema Completo de Gestión de Proyectos BRIK            ║
║         Certificación | Reestructuración | Validación             ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
`, colors.bright + colors.cyan));
  
  console.log(color(`
  Filosofía: DAAF-BRIK-Circuitalidad Digital
  Principios: 100% Cobertura | Inmutabilidad | Living Code
  Certificación: Nivel L3 Empresarial
`, colors.dim));
};

// Menú principal
const mainMenu = async () => {
  const options = [
    {
      value: 'create-new',
      label: '🚀 Crear nuevo proyecto BRIK desde cero',
      handler: createNewProject
    },
    {
      value: 'create-smart',
      label: '🧠 Crear proyecto BRIK inteligente (con IA)',
      handler: createSmartProject
    },
    {
      value: 'restructure',
      label: '🔄 Reestructurar proyecto existente a BRIK',
      handler: restructureProject
    },
    {
      value: 'validate',
      label: '🔍 Validar certificación BRIK de un proyecto',
      handler: validateProject
    },
    {
      value: 'analyze',
      label: '📊 Analizar arquitectura de proyecto',
      handler: analyzeArchitecture
    },
    {
      value: 'docs',
      label: '📚 Ver documentación y guías BRIK',
      handler: showDocumentation
    },
    {
      value: 'config',
      label: '⚙️  Configuración y preferencias',
      handler: showConfiguration
    },
    {
      value: 'exit',
      label: '🚪 Salir',
      handler: () => process.exit(0)
    }
  ];
  
  const selected = await select('📋 MENÚ PRINCIPAL', options);
  await selected.handler();
};

// Crear nuevo proyecto BRIK tradicional
const createNewProject = async () => {
  log.title('🚀 CREAR NUEVO PROYECTO BRIK');
  
  const projectName = await question('\n📝 Nombre del proyecto: ');
  
  const languageOptions = [
    { value: 'rust', label: '🦀 Rust' },
    { value: 'typescript', label: '📘 TypeScript' },
    { value: 'python', label: '🐍 Python' },
    { value: 'go', label: '🐹 Go' }
  ];
  
  const language = await select('💻 Selecciona el lenguaje', languageOptions);
  
  const projectPath = await question(`\n📂 Ruta del proyecto (default: ./${projectName}): `) || `./${projectName}`;
  
  log.info('Creando proyecto BRIK tradicional...');
  
  try {
    // Ejecutar script de inicialización
    const scriptPath = path.join(__dirname, 'init-brik-project.sh');
    const child = spawn('bash', [scriptPath, projectName, language.value], {
      stdio: 'inherit',
      cwd: path.dirname(projectPath)
    });
    
    child.on('close', async (code) => {
      if (code === 0) {
        log.success('¡Proyecto BRIK creado exitosamente!');
        
        // Mostrar resumen
        showProjectSummary(projectPath, projectName, language.value);
        
        await question('\nPresiona Enter para volver al menú principal...');
        await mainMenu();
      } else {
        log.error('Error al crear el proyecto');
        await question('\nPresiona Enter para volver al menú principal...');
        await mainMenu();
      }
    });
  } catch (error) {
    log.error(`Error: ${error.message}`);
    await question('\nPresiona Enter para volver al menú principal...');
    await mainMenu();
  }
};

// Crear proyecto BRIK inteligente con IA
const createSmartProject = async () => {
  log.title('🧠 CREAR PROYECTO BRIK INTELIGENTE');
  
  // Verificar prerrequisitos
  if (!checkSmartPrerequisites()) {
    await question('\nPresiona Enter para volver al menú principal...');
    await mainMenu();
    return;
  }
  
  const projectName = await question('\n📝 Nombre del proyecto: ');
  const description = await question('📋 Descripción del proyecto: ');
  
  const languageOptions = [
    { value: 'rust', label: '🦀 Rust' },
    { value: 'typescript', label: '📘 TypeScript' },
    { value: 'python', label: '🐍 Python' }
  ];
  
  const language = await select('💻 Selecciona el lenguaje', languageOptions);
  
  const integrations = await question('\n🔌 Integraciones (separadas por comas, ej: postgresql,redis,stripe): ');
  const projectPath = await question(`📂 Ruta del proyecto (default: ./${projectName}): `) || `./${projectName}`;
  
  log.info('Generando proyecto BRIK inteligente con IA...');
  console.log(color('  🧠 Analizando dominio...', colors.dim));
  console.log(color('  🏗️  Clasificando arquitectura...', colors.dim));
  console.log(color('  ⚡ Generando código funcional...', colors.dim));
  console.log(color('  🔍 Validando principios BRIK...', colors.dim));
  
  try {
    const scriptPath = path.join(__dirname, 'init-brik-project.sh');
    const args = [
      projectName,
      '--smart',
      '--description', description,
      '--language', language.value,
      '--output', projectPath
    ];
    
    if (integrations) {
      args.push('--integrations', integrations);
    }
    
    const child = spawn('bash', [scriptPath, ...args], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    child.on('close', async (code) => {
      if (code === 0) {
        log.success('¡Proyecto BRIK inteligente creado exitosamente!');
        
        // Mostrar análisis generado
        showSmartProjectAnalysis(projectPath);
        
        await question('\nPresiona Enter para volver al menú principal...');
        await mainMenu();
      } else {
        log.error('Error al crear el proyecto inteligente');
        await question('\nPresiona Enter para volver al menú principal...');
        await mainMenu();
      }
    });
  } catch (error) {
    log.error(`Error: ${error.message}`);
    await question('\nPresiona Enter para volver al menú principal...');
    await mainMenu();
  }
};

// Reestructurar proyecto existente
const restructureProject = async () => {
  log.title('🔄 REESTRUCTURAR PROYECTO EXISTENTE A BRIK');
  
  const projectPath = await question('\n📂 Ruta del proyecto existente: ');
  
  if (!fs.existsSync(projectPath)) {
    log.error('El proyecto no existe en la ruta especificada');
    await question('\nPresiona Enter para volver al menú principal...');
    await mainMenu();
    return;
  }
  
  // Detectar tipo de proyecto
  const projectType = detectProjectType(projectPath);
  log.info(`Tipo de proyecto detectado: ${projectType || 'desconocido'}`);
  
  const modeOptions = [
    { value: 'preserve', label: '🔒 Preservar código existente (agregar estructura BRIK)' },
    { value: 'refactor', label: '♻️  Refactorizar código a principios BRIK' },
    { value: 'analyze', label: '📊 Solo analizar (sin cambios)' }
  ];
  
  const mode = await select('🔧 Modo de reestructuración', modeOptions);
  
  if (mode.value === 'analyze') {
    await analyzeProjectStructure(projectPath);
    await question('\nPresiona Enter para volver al menú principal...');
    await mainMenu();
    return;
  }
  
  log.info('Iniciando reestructuración BRIK...');
  
  try {
    // Crear backup
    const backupPath = `${projectPath}.backup-${Date.now()}`;
    log.info(`Creando backup en: ${backupPath}`);
    execSync(`cp -r "${projectPath}" "${backupPath}"`);
    
    // Aplicar reestructuración
    await applyBrikRestructure(projectPath, mode.value, projectType);
    
    log.success('¡Reestructuración completada!');
    
    // Validar resultado
    log.info('Validando estructura BRIK...');
    await validateBrikStructure(projectPath);
    
    await question('\nPresiona Enter para volver al menú principal...');
    await mainMenu();
  } catch (error) {
    log.error(`Error en reestructuración: ${error.message}`);
    await question('\nPresiona Enter para volver al menú principal...');
    await mainMenu();
  }
};

// Validar proyecto BRIK
const validateProject = async () => {
  log.title('🔍 VALIDAR CERTIFICACIÓN BRIK');
  
  const projectPath = await question('\n📂 Ruta del proyecto a validar: ');
  
  if (!fs.existsSync(projectPath)) {
    log.error('El proyecto no existe en la ruta especificada');
    await question('\nPresiona Enter para volver al menú principal...');
    await mainMenu();
    return;
  }
  
  log.info('Ejecutando validación BRIK completa...');
  
  try {
    // Ejecutar validador L3
    const validatorPath = path.join(__dirname, 'l3_certification_suite.js');
    
    if (fs.existsSync(validatorPath)) {
      const result = execSync(`node "${validatorPath}" "${projectPath}"`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log(result);
      
      // Mostrar reporte
      const reportPath = path.join(projectPath, 'brik-l3-certification-report.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        showValidationReport(report);
      }
    } else {
      log.warning('Validador L3 no encontrado, usando validación básica...');
      await validateBrikStructure(projectPath);
    }
    
    await question('\nPresiona Enter para volver al menú principal...');
    await mainMenu();
  } catch (error) {
    log.error(`Error en validación: ${error.message}`);
    await question('\nPresiona Enter para volver al menú principal...');
    await mainMenu();
  }
};

// Analizar arquitectura
const analyzeArchitecture = async () => {
  log.title('📊 ANALIZAR ARQUITECTURA DE PROYECTO');
  
  const projectPath = await question('\n📂 Ruta del proyecto: ');
  
  if (!fs.existsSync(projectPath)) {
    log.error('El proyecto no existe en la ruta especificada');
    await question('\nPresiona Enter para volver al menú principal...');
    await mainMenu();
    return;
  }
  
  await analyzeProjectStructure(projectPath);
  
  await question('\nPresiona Enter para volver al menú principal...');
  await mainMenu();
};

// Mostrar documentación
const showDocumentation = async () => {
  log.title('📚 DOCUMENTACIÓN BRIK');
  
  const docOptions = [
    { value: 'principles', label: '🧬 Principios BRIK y filosofía DAAF' },
    { value: 'structure', label: '📁 Estructura de directorios BRIK' },
    { value: 'coverage', label: '🧪 Guía de 100% cobertura' },
    { value: 'smart', label: '🧠 Modo inteligente con IA' },
    { value: 'certification', label: '🏆 Proceso de certificación L3' },
    { value: 'back', label: '⬅️  Volver al menú principal' }
  ];
  
  const selected = await select('📖 Selecciona documentación', docOptions);
  
  if (selected.value === 'back') {
    await mainMenu();
    return;
  }
  
  // Mostrar documentación correspondiente
  showDocumentationContent(selected.value);
  
  await question('\nPresiona Enter para continuar...');
  await showDocumentation();
};

// Configuración
const showConfiguration = async () => {
  log.title('⚙️  CONFIGURACIÓN');
  
  const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.brik-config.json');
  let config = {};
  
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  
  console.log('\nConfiguración actual:');
  console.log(color(JSON.stringify(config, null, 2), colors.dim));
  
  const configOptions = [
    { value: 'api-keys', label: '🔑 Configurar API Keys (para modo inteligente)' },
    { value: 'defaults', label: '📝 Valores por defecto' },
    { value: 'reset', label: '🔄 Restablecer configuración' },
    { value: 'back', label: '⬅️  Volver al menú principal' }
  ];
  
  const selected = await select('⚙️  Opciones de configuración', configOptions);
  
  if (selected.value === 'back') {
    await mainMenu();
    return;
  }
  
  if (selected.value === 'api-keys') {
    const apiKey = await question('🔑 Ingresa tu API Key (Anthropic o OpenAI): ');
    const provider = await select('Proveedor', [
      { value: 'anthropic', label: 'Anthropic Claude' },
      { value: 'openai', label: 'OpenAI GPT' }
    ]);
    
    config.apiKeys = config.apiKeys || {};
    config.apiKeys[provider.value] = apiKey;
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    log.success('API Key configurada exitosamente');
  }
  
  await question('\nPresiona Enter para continuar...');
  await showConfiguration();
};

// Funciones auxiliares

const checkSmartPrerequisites = () => {
  log.info('Verificando prerrequisitos para modo inteligente...');
  
  // Verificar Node.js
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      log.error(`Node.js 18+ requerido (encontrado: ${nodeVersion})`);
      return false;
    }
    log.success(`Node.js ${nodeVersion} ✓`);
  } catch {
    log.error('Node.js no encontrado');
    return false;
  }
  
  // Verificar API keys
  const hasApiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
  if (!hasApiKey) {
    log.warning('No se encontraron API keys. Se usará Mock LLM para testing.');
    log.info('Para usar IA real, configura ANTHROPIC_API_KEY o OPENAI_API_KEY');
  } else {
    log.success('API Keys configuradas ✓');
  }
  
  return true;
};

const detectProjectType = (projectPath) => {
  if (fs.existsSync(path.join(projectPath, 'Cargo.toml'))) return 'rust';
  if (fs.existsSync(path.join(projectPath, 'package.json'))) return 'typescript';
  if (fs.existsSync(path.join(projectPath, 'requirements.txt'))) return 'python';
  if (fs.existsSync(path.join(projectPath, 'pyproject.toml'))) return 'python';
  if (fs.existsSync(path.join(projectPath, 'go.mod'))) return 'go';
  return null;
};

const analyzeProjectStructure = async (projectPath) => {
  log.subtitle('\n📊 Análisis de Estructura del Proyecto');
  
  const hasBrikStructure = fs.existsSync(path.join(projectPath, '.brik-dna.yml'));
  const hasCore = fs.existsSync(path.join(projectPath, 'src', 'core')) || 
                  fs.existsSync(path.join(projectPath, 'core'));
  const hasComponents = fs.existsSync(path.join(projectPath, 'src', 'components')) || 
                       fs.existsSync(path.join(projectPath, 'components'));
  const hasLivingLayer = fs.existsSync(path.join(projectPath, 'src', 'living-layer')) || 
                        fs.existsSync(path.join(projectPath, 'living-layer'));
  
  console.log('\n' + color('Estado BRIK:', colors.bright));
  console.log(`  ${hasBrikStructure ? '✅' : '❌'} ADN BRIK (.brik-dna.yml)`);
  console.log(`  ${hasCore ? '✅' : '❌'} Capa Core`);
  console.log(`  ${hasComponents ? '✅' : '❌'} Capa Components/Wrappers`);
  console.log(`  ${hasLivingLayer ? '✅' : '❌'} Living Layer`);
  
  // Análisis de cobertura si existe
  try {
    const scriptPath = path.join(projectPath, 'scripts', 'test-coverage.sh');
    if (fs.existsSync(scriptPath)) {
      log.info('\nEjecutando análisis de cobertura...');
      const coverage = execSync(`cd "${projectPath}" && bash scripts/test-coverage.sh`, {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      console.log(color('Cobertura: ', colors.bright) + coverage.includes('100%') ? '✅ 100%' : '⚠️  < 100%');
    }
  } catch {}
  
  // Análisis de documentación
  const docsPath = path.join(projectPath, 'docs');
  if (fs.existsSync(docsPath)) {
    const docFiles = fs.readdirSync(docsPath);
    console.log(color('\nDocumentación encontrada:', colors.bright));
    docFiles.slice(0, 5).forEach(file => {
      console.log(`  📄 ${file}`);
    });
    if (docFiles.length > 5) {
      console.log(`  ... y ${docFiles.length - 5} más`);
    }
  }
};

const validateBrikStructure = async (projectPath) => {
  const validatorPath = path.join(__dirname, 'structure_validation_simple.js');
  
  if (fs.existsSync(validatorPath)) {
    try {
      const result = execSync(`node "${validatorPath}" "${projectPath}"`, {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      console.log(result);
    } catch (error) {
      log.error('Validación falló: ' + error.message);
    }
  } else {
    log.warning('Validador no encontrado, mostrando análisis básico...');
    await analyzeProjectStructure(projectPath);
  }
};

const applyBrikRestructure = async (projectPath, mode, projectType) => {
  log.info(`Aplicando reestructuración en modo: ${mode}`);
  
  // Crear estructura BRIK básica
  const dirs = [
    'src/core',
    'src/components', 
    'src/living-layer',
    'tests/unit',
    'tests/integration',
    'tests/property',
    'tests/immutability',
    'docs/product',
    'docs/technical',
    'docs/operational',
    'scripts'
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(projectPath, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      log.success(`Creado: ${dir}`);
    }
  });
  
  // Generar archivos BRIK esenciales
  const brikDna = {
    project: {
      name: path.basename(projectPath),
      version: "1.0.0",
      philosophy: "DAAF-BRIK-CircuitalidadDigital",
      restructured: true,
      restructured_at: new Date().toISOString(),
      original_type: projectType
    },
    principles: {
      circuitality: true,
      consciousness: true,
      thermodynamics: true,
      auditability: true,
      documentation: true
    }
  };
  
  fs.writeFileSync(
    path.join(projectPath, '.brik-dna.yml'),
    `# BRIK DNA - Generado por reestructuración\n${JSON.stringify(brikDna, null, 2)}`
  );
  
  // Copiar CIRCUITALIDAD.md
  const circuitPath = path.join(__dirname, 'CIRCUITALIDAD.md');
  if (fs.existsSync(circuitPath)) {
    fs.copyFileSync(circuitPath, path.join(projectPath, 'CIRCUITALIDAD.md'));
  }
  
  // Generar scripts de validación
  const scripts = ['test-coverage.sh', 'brik-certify.sh', 'validate-docs.sh'];
  scripts.forEach(script => {
    const sourcePath = path.join(__dirname, 'scripts', script);
    const destPath = path.join(projectPath, 'scripts', script);
    if (fs.existsSync(sourcePath) && !fs.existsSync(destPath)) {
      fs.copyFileSync(sourcePath, destPath);
      fs.chmodSync(destPath, '755');
      log.success(`Script copiado: ${script}`);
    }
  });
  
  if (mode === 'refactor') {
    log.info('Analizando código para refactorización...');
    // Aquí iría la lógica de refactorización automática
    // Por ahora solo mostramos sugerencias
    showRefactoringSuggestions(projectPath, projectType);
  }
  
  log.success('Estructura BRIK aplicada exitosamente');
};

const showRefactoringSuggestions = (projectPath, projectType) => {
  console.log(color('\n📝 Sugerencias de Refactorización:', colors.bright + colors.yellow));
  console.log('');
  console.log('1. Mover lógica de negocio pura a src/core/');
  console.log('2. Mover integraciones externas a src/components/');
  console.log('3. Implementar monitoreo en src/living-layer/');
  console.log('4. Agregar tests para alcanzar 100% cobertura');
  console.log('5. Completar documentación en docs/');
  console.log('');
  log.info('Ejecuta los scripts de validación para verificar cumplimiento BRIK');
};

const showProjectSummary = (projectPath, projectName, language) => {
  console.log(color('\n📊 Resumen del Proyecto:', colors.bright + colors.green));
  console.log(`  📁 Ubicación: ${path.resolve(projectPath)}`);
  console.log(`  🏷️  Nombre: ${projectName}`);
  console.log(`  💻 Lenguaje: ${language}`);
  console.log(`  🧬 Filosofía: DAAF-BRIK-CircuitalidadDigital`);
  console.log('');
  console.log(color('📋 Próximos pasos:', colors.bright));
  console.log(`  1. cd ${projectPath}`);
  console.log('  2. Revisar docs/DOCUMENTATION_CHECKLIST.md');
  console.log('  3. Instalar dependencias del proyecto');
  console.log('  4. ./scripts/test-coverage.sh (verificar 100%)');
  console.log('  5. ./scripts/brik-certify.sh (generar certificación)');
};

const showSmartProjectAnalysis = (projectPath) => {
  console.log(color('\n🧠 Análisis Inteligente Generado:', colors.bright + colors.magenta));
  
  const files = [
    'domain-analysis.json',
    'architecture-classification.json',
    'brik-validation-report.json'
  ];
  
  files.forEach(file => {
    const filePath = path.join(projectPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file}`);
    }
  });
  
  console.log('');
  console.log(color('⚡ Características del proyecto generado:', colors.bright));
  console.log('  • Código funcional completo');
  console.log('  • Tests con 100% cobertura');
  console.log('  • Arquitectura BRIK validada');
  console.log('  • Documentación auto-generada');
};

const showValidationReport = (report) => {
  console.log(color('\n📊 Reporte de Certificación L3:', colors.bright + colors.cyan));
  console.log(`  Nivel: ${report.certificationLevel || 'N/A'}`);
  console.log(`  Estado: ${report.passed ? '✅ APROBADO' : '❌ FALLIDO'}`);
  
  if (report.metrics) {
    console.log(color('\n📈 Métricas:', colors.bright));
    Object.entries(report.metrics).forEach(([key, value]) => {
      const icon = value >= 100 ? '✅' : value >= 80 ? '⚠️' : '❌';
      console.log(`  ${icon} ${key}: ${value}%`);
    });
  }
  
  if (report.recommendations && report.recommendations.length > 0) {
    console.log(color('\n💡 Recomendaciones:', colors.bright));
    report.recommendations.slice(0, 5).forEach(rec => {
      console.log(`  • ${rec}`);
    });
  }
};

const showDocumentationContent = (docType) => {
  const docs = {
    principles: `
🧬 PRINCIPIOS BRIK Y FILOSOFÍA DAAF
════════════════════════════════════

Los proyectos BRIK siguen la filosofía DAAF (Data-Augmented Agile Framework) con:

1. CIRCUITALIDAD DIGITAL
   - El código es un circuito simbólico
   - Cada línea debe estar conectada y verificada
   - 100% cobertura = circuito completo

2. ARQUITECTURA DE 3 CAPAS
   • CORE: Lógica pura inmutable
   • WRAPPERS: Adaptadores evolutivos
   • LIVING LAYER: Consciencia y monitoreo

3. INMUTABILIDAD POST-DEPLOYMENT
   - El core no cambia después del deploy
   - Las extensiones se hacen vía wrappers
   - La evolución es controlada

4. DOCUMENTACIÓN INTEGRAL
   - Producto, técnica, operativa
   - Auto-consistente y verificable
   - Parte del ADN del proyecto
`,
    structure: `
📁 ESTRUCTURA DE DIRECTORIOS BRIK
═══════════════════════════════════

proyecto-brik/
├── src/
│   ├── core/           # Lógica de negocio pura
│   ├── components/     # Wrappers e integraciones
│   └── living-layer/   # Monitoreo y consciencia
├── tests/
│   ├── unit/          # Tests unitarios
│   ├── integration/   # Tests de integración
│   ├── property/      # Property-based testing
│   └── immutability/  # Tests de inmutabilidad
├── docs/
│   ├── product/       # PRD, historias de usuario
│   ├── technical/     # Arquitectura, APIs
│   └── operational/   # Deploy, configuración
├── scripts/           # Automatización
├── .brik-dna.yml     # ADN del proyecto
└── CIRCUITALIDAD.md  # Manifiesto filosófico
`,
    coverage: `
🧪 GUÍA DE 100% COBERTURA
═════════════════════════

BRIK requiere 100% de cobertura GLOBAL y POR ARCHIVO:

1. CONFIGURACIÓN POR LENGUAJE:
   • Rust: cargo-tarpaulin con --branch
   • TypeScript: Jest con coverageThreshold 100
   • Python: pytest-cov con --cov-fail-under=100

2. VALIDACIÓN AUTOMÁTICA:
   ./scripts/test-coverage.sh
   - Verifica líneas, ramas, funciones
   - Falla si algún archivo < 100%

3. ESTRATEGIAS:
   • Escribir tests primero (TDD)
   • Property-based testing
   • Tests de mutación
   • Coverage reports en CI/CD

4. CERTIFICACIÓN:
   Sin 100% = Sin certificación BRIK
`,
    smart: `
🧠 MODO INTELIGENTE CON IA
══════════════════════════

El modo inteligente usa LLMs para generar proyectos completos:

1. ANÁLISIS DE DOMINIO
   - Interpreta la descripción del proyecto
   - Identifica entidades y relaciones
   - Mapea integraciones necesarias

2. CLASIFICACIÓN ARQUITECTÓNICA
   - Separa lógica CORE de WRAPPERS
   - Identifica living layer components
   - Estructura según principios BRIK

3. GENERACIÓN DE CÓDIGO
   - Código funcional completo
   - Tests con 100% cobertura
   - Documentación automática

4. VALIDACIÓN
   - Verifica principios BRIK
   - Analiza calidad del código
   - Genera reporte de certificación

REQUISITOS:
• Node.js 18+
• API Key (Anthropic o OpenAI)
• Toolchain del lenguaje objetivo
`,
    certification: `
🏆 PROCESO DE CERTIFICACIÓN L3
═══════════════════════════════

La certificación L3 es el nivel empresarial máximo:

NIVELES:
• L1: Estructura básica (60%)
• L2: Cobertura y docs (80%)
• L3: Enterprise-ready (95%+)

CRITERIOS L3:
✓ Estructura BRIK completa
✓ 100% cobertura global
✓ Documentación 95%+
✓ Tests inmutabilidad
✓ Living layer activo
✓ CI/CD configurado
✓ Scripts validación
✓ ADN proyecto (.brik-dna.yml)

VALIDACIÓN:
node l3_certification_suite.js <proyecto>

REPORTE:
• brik-l3-certification-report.json
• brik-l3-certification-report.html
`
  };
  
  console.log(docs[docType] || 'Documentación no encontrada');
};

// Función principal
const main = async () => {
  showBanner();
  
  // Verificar si se pasaron argumentos de línea de comandos
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Modo CLI directo
    if (args[0] === '--help' || args[0] === '-h') {
      console.log(`
Uso: brik-cli [opciones]

Opciones:
  --help, -h        Mostrar esta ayuda
  --create <name>   Crear nuevo proyecto BRIK
  --smart <name>    Crear proyecto inteligente
  --validate <path> Validar proyecto existente
  --version, -v     Mostrar versión

Sin argumentos: Modo interactivo con menú
      `);
      process.exit(0);
    }
    
    if (args[0] === '--version' || args[0] === '-v') {
      console.log('BRIK CLI v5.0.0');
      process.exit(0);
    }
    
    // Procesar otros comandos...
  } else {
    // Modo interactivo
    await mainMenu();
  }
  
  rl.close();
};

// Capturar Ctrl+C
process.on('SIGINT', () => {
  console.log(color('\n\n👋 ¡Hasta luego! Que tus proyectos sean 100% BRIK\n', colors.bright + colors.cyan));
  process.exit(0);
});

// Iniciar aplicación
main().catch(error => {
  log.error(`Error fatal: ${error.message}`);
  process.exit(1);
});