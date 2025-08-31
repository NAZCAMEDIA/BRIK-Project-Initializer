#!/usr/bin/env node

// Test básico absoluto
console.log('DEBUG: Script iniciado');

try {
  console.log('DEBUG: Probando console.log');
  console.log('DEBUG: Node version:', process.version);
  console.log('DEBUG: Platform:', process.platform);
  console.log('DEBUG: Working directory:', process.cwd());
  
  // Test de require
  console.log('DEBUG: Probando require fs');
  const fs = require('fs');
  console.log('DEBUG: fs cargado exitosamente');
  
  console.log('DEBUG: Probando fs.existsSync');
  const exists = fs.existsSync('./package.json');
  console.log('DEBUG: package.json exists:', exists);
  
  console.log('DEBUG: Script completado exitosamente');
} catch (error) {
  console.log('DEBUG: ERROR:', error.message);
  console.log('DEBUG: Stack:', error.stack);
}

console.log('DEBUG: Finalizando...');
process.exit(0);