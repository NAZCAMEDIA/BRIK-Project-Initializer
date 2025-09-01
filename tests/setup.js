/**
 * Jest Setup File - BRIK L4 Certification
 * Configuración global para todos los tests
 */

// Suprimir logs durante tests a menos que sea necesario
if (!process.env.DEBUG_TESTS) {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}

// Configuración de timeout global
jest.setTimeout(10000);

// Mock de variables de entorno
process.env.NODE_ENV = 'test';
process.env.BRIK_TEST_MODE = 'true';

// Helpers globales para tests
global.testHelpers = {
  // Helper para crear configuración mock
  createMockConfig: (overrides = {}) => ({
    project_name: 'test-project',
    language: 'typescript',
    database: 'postgres',
    cache: 'redis',
    event_system: 'kafka',
    port: '3000',
    enable_openapi: true,
    enable_idempotency: true,
    enable_rate_limit: true,
    enable_tracing: true,
    http_timeout_ms: 2000,
    default_resource: 'users',
    ...overrides
  }),

  // Helper para simular input de usuario
  mockUserInput: (inputs = []) => {
    let inputIndex = 0;
    return jest.fn((query, callback) => {
      if (inputIndex < inputs.length) {
        callback(inputs[inputIndex++]);
      } else {
        callback('');
      }
    });
  },

  // Helper para verificar estructura de directorio
  verifyDirectoryStructure: (calls, expectedPaths) => {
    const createdPaths = calls.map(call => call[0]);
    return expectedPaths.every(path => 
      createdPaths.some(created => created.includes(path))
    );
  }
};

// Limpiar todos los timers después de cada test
afterEach(() => {
  jest.clearAllTimers();
});

// Asegurar que todos los mocks se limpien
afterAll(() => {
  jest.restoreAllMocks();
});