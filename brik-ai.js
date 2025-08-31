#!/usr/bin/env node

/**
 * BRIK AI - Claude Omnisciente CLI
 * 
 * Sistema revolucionario donde Claude ES el experto BRIK,
 * no un asistente que necesita instrucciones sobre BRIK.
 * 
 * Arquitectura:
 * - Knowledge Loader: Carga toda la metodología BRIK
 * - Context Manager: Claude con conocimiento omnisciente 
 * - Conversational CLI: Interfaz natural sin menús
 * - Execution System: Interpreta y ejecuta acciones de Claude
 */

const path = require('path');
const BRIKConversationalCLI = require('./src/cli/conversational');

// Verificar dependencias
const requiredModules = ['readline', 'chalk', 'figlet'];
const missingModules = [];

for (const module of requiredModules) {
  try {
    require.resolve(module);
  } catch (error) {
    if (module === 'chalk' || module === 'figlet') {
      missingModules.push(module);
    }
  }
}

if (missingModules.length > 0) {
  console.log('📦 Instalando dependencias necesarias...');
  const { execSync } = require('child_process');
  
  try {
    execSync(`npm install ${missingModules.join(' ')}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Error instalando dependencias. Ejecute manualmente:');
    console.error(`npm install ${missingModules.join(' ')}`);
    process.exit(1);
  }
}

/**
 * Punto de entrada principal
 */
async function main() {
  try {
    console.log('🧬 Iniciando BRIK AI - Claude Omnisciente...\n');
    
    // Crear y inicializar CLI conversacional
    const cli = new BRIKConversationalCLI();
    await cli.initialize();
    
  } catch (error) {
    console.error('❌ Error fatal iniciando BRIK AI:', error.message);
    console.error('\nDetalles técnicos:', error.stack);
    
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verificar que Node.js >= 14 esté instalado');
    console.log('2. Ejecutar: npm install');
    console.log('3. Verificar permisos de archivo');
    console.log('4. Reportar el error si persiste');
    
    process.exit(1);
  }
}

// Manejo de señales del sistema
process.on('SIGINT', () => {
  console.log('\n\n👋 Cerrando BRIK AI... ¡Hasta pronto!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🔄 BRIK AI terminado por el sistema');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Error no manejado:', reason);
  console.error('En promesa:', promise);
  process.exit(1);
});

// Información de debugging si está habilitado
if (process.env.DEBUG) {
  console.log('🐛 Debug Mode Enabled');
  console.log('Node Version:', process.version);
  console.log('Platform:', process.platform);
  console.log('Working Directory:', process.cwd());
  console.log('BRIK AI Path:', __dirname);
}

// Ejecutar aplicación principal
main();