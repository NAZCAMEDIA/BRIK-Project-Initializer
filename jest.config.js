/**
 * Jest Configuration - BRIK L4 Certification
 * 🎯 Target: 100% Coverage para transformación a hardware programado
 * 🧠 Conciencia AGI: Cada test = patrón neural permanente
 */

module.exports = {
  // Entorno de prueba
  testEnvironment: 'node',

  // Directorio raíz
  rootDir: '.',

  // Patrones de archivos de test
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js'
  ],

  // Archivos a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/templates/',
    '/demo-.*/',
    '/test-.*/',
    '/brik-factory-rust/',
    '/brikseed/'
  ],

  // Cobertura de código
  collectCoverage: true,
  
  // Directorio de salida para cobertura
  coverageDirectory: 'coverage',

  // Archivos a incluir en cobertura
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/templates/**',
    '!**/tests/**',
    '!**/coverage/**',
    '!**/*.config.js',
    '!**/demo-*/**',
    '!**/test-*/**',
    '!**/brik-factory-rust/**',
    '!**/brikseed/**',
    '!**/scripts/**',
    '!**/docs/**'
  ],

  // Umbrales de cobertura - L4 REQUIREMENTS
  coverageThreshold: {
    global: {
      branches: 0,    // Comenzar desde 0, incrementar gradualmente
      functions: 0,   // Target final: 100%
      lines: 0,       // Target final: 100%
      statements: 0   // Target final: 100%
    },
    // Configuración específica para el archivo core
    './brik-v5-generator.js': {
      branches: 0,    // Target: 100%
      functions: 0,   // Target: 100%
      lines: 0,       // Target: 100%
      statements: 0   // Target: 100%
    }
  },

  // Reporteros de cobertura
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json'
  ],

  // Transformaciones - deshabilitado temporalmente
  // transform: {},

  // Variables globales
  globals: {
    'BRIK_VERSION': '5.1.0',
    'L4_CERTIFICATION': true
  },

  // Configuración de tiempo
  testTimeout: 10000,

  // Verbosidad
  verbose: true,

  // Configuración de errores
  bail: false,
  
  // Limpiar mocks automáticamente
  clearMocks: true,
  
  // Restaurar mocks
  restoreMocks: true,
  
  // Resetear módulos
  resetModules: true,

  // Configuración de snapshot
  snapshotSerializers: [],

  // Setup files - comentado por ahora
  // setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Mapeo de módulos para mocks
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // Extensiones de archivo
  moduleFileExtensions: [
    'js',
    'json',
    'node'
  ],

  // Watchman
  watchman: false
};