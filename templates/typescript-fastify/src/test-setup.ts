/**
 * BRIK v5 Test Setup
 * Global test configuration and utilities
 */

import { jest } from '@jest/globals';

// Extend Jest matchers for BRIK-specific assertions
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeBrikCompliant(): R;
      toHaveGateError(gate: string, code: string): R;
      toHaveDomainError(code: string): R;
      toHavePortError(port: string, code: string): R;
      toBeIdempotent(): R;
    }
  }
}

// Custom matchers for BRIK v5 testing
expect.extend({
  toBeBrikCompliant(received: any) {
    const hasRequiredProps = 
      received &&
      typeof received === 'object' &&
      'correlationId' in received &&
      'timestamp' in received;

    if (hasRequiredProps) {
      return {
        message: () => `Expected object to NOT be BRIK compliant`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected object to be BRIK compliant (have correlationId and timestamp)`,
        pass: false,
      };
    }
  },

  toHaveGateError(received: any, gate: string, code: string) {
    const isGateError = 
      received &&
      received.error &&
      received.error.type === 'GATE_ERROR' &&
      received.error.gate === gate &&
      received.error.code === code;

    if (isGateError) {
      return {
        message: () => `Expected NOT to have gate error ${gate}:${code}`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected to have gate error ${gate}:${code}`,
        pass: false,
      };
    }
  },

  toHaveDomainError(received: any, code: string) {
    const isDomainError = 
      received &&
      received.error &&
      received.error.type === 'DOMAIN_ERROR' &&
      received.error.code === code;

    if (isDomainError) {
      return {
        message: () => `Expected NOT to have domain error ${code}`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected to have domain error ${code}`,
        pass: false,
      };
    }
  },

  toHavePortError(received: any, port: string, code: string) {
    const isPortError = 
      received &&
      received.error &&
      received.error.type === 'PORT_ERROR' &&
      received.error.port === port &&
      received.error.code === code;

    if (isPortError) {
      return {
        message: () => `Expected NOT to have port error ${port}:${code}`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected to have port error ${port}:${code}`,
        pass: false,
      };
    }
  },

  toBeIdempotent(received: any) {
    // Check if response has idempotency metadata
    const hasIdempotencyData = 
      received &&
      received.metadata &&
      'idempotencyKey' in received.metadata &&
      'cached' in received.metadata;

    if (hasIdempotencyData) {
      return {
        message: () => `Expected response to NOT be idempotent`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected response to be idempotent (have idempotencyKey and cached in metadata)`,
        pass: false,
      };
    }
  },
});

// Global test utilities
global.createMockLogger = () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  child: jest.fn().mockReturnThis(),
});

global.createMockMetrics = () => ({
  counter: jest.fn(),
  histogram: jest.fn(),
  gauge: jest.fn(),
  timing: jest.fn(),
});

global.createTestCorrelationId = () => `test_${Math.random().toString(36).substr(2, 9)}`;

global.createTestIdempotencyKey = () => `test-idem-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

// Test database helpers
global.cleanupTestDatabase = async () => {
  // Implementation depends on your test database strategy
  console.log('Database cleanup would happen here');
};

global.seedTestDatabase = async () => {
  // Implementation depends on your test database strategy
  console.log('Database seeding would happen here');
};

// Setup and teardown
beforeEach(() => {
  // Reset all mocks
  jest.clearAllMocks();
});

afterEach(async () => {
  // Cleanup after each test
  await global.cleanupTestDatabase();
});

// Increase timeout for integration tests
jest.setTimeout(30000);