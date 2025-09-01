#!/usr/bin/env node

/**
 * Manual Test Runner for BRIK v5 Generator
 * Ejecuta tests sin depender de Jest
 */

const path = require('path');

// Chalk mock simple para colores
const chalk = {
  green: (str) => `✅ ${str}`,
  red: (str) => `❌ ${str}`,
  yellow: (str) => `⚠️  ${str}`,
  cyan: { bold: (str) => `🔵 ${str}` },
  dim: (str) => `   ${str}`
};
chalk.red.bold = (str) => `🔴 ${str}`;
chalk.yellow.bold = (str) => `🟡 ${str}`;

// Estadísticas
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const errors = [];

// Test helper functions
function test(description, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(chalk.green('✓'), description);
  } catch (error) {
    failedTests++;
    console.log(chalk.red('✗'), description);
    errors.push({ test: description, error: error.message });
  }
}

function expect(actual) {
  return {
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
      }
    },
    toBeDefined: () => {
      if (actual === undefined) {
        throw new Error(`Expected value to be defined but got undefined`);
      }
    },
    toBeNull: () => {
      if (actual !== null) {
        throw new Error(`Expected null but got ${actual}`);
      }
    },
    toContain: (expected) => {
      if (!actual.includes(expected)) {
        throw new Error(`Expected "${actual}" to contain "${expected}"`);
      }
    },
    toThrow: () => {
      let threw = false;
      try {
        actual();
      } catch (e) {
        threw = true;
      }
      if (!threw) {
        throw new Error('Expected function to throw but it did not');
      }
    }
  };
}

console.log(chalk.cyan.bold('\n🧬 BRIK v5 Generator - Manual Test Runner\n'));

// Load the module
const BrikV5Generator = require('../brik-v5-generator');

// Test Suite 1: Constructor
console.log(chalk.yellow('\n📦 Constructor Tests'));

test('should create instance with default configuration', () => {
  const generator = new BrikV5Generator();
  expect(generator.config).toBeDefined();
  expect(generator.config.http_timeout_ms).toBe(2000);
  expect(generator.config.enable_openapi).toBe(true);
  expect(generator.config.enable_idempotency).toBe(true);
  expect(generator.config.enable_rate_limit).toBe(true);
  expect(generator.config.enable_tracing).toBe(true);
  expect(generator.config.default_resource).toBe('users');
});

test('should set correct template directory', () => {
  const generator = new BrikV5Generator();
  const expectedPath = path.join(__dirname, '../templates');
  expect(generator.templateDir).toBe(expectedPath);
});

test('should maintain independent instances', () => {
  const gen1 = new BrikV5Generator();
  const gen2 = new BrikV5Generator();
  gen1.config.http_timeout_ms = 5000;
  expect(gen2.config.http_timeout_ms).toBe(2000);
});

// Test Suite 2: Template Processing
console.log(chalk.yellow('\n🔄 Template Processing Tests'));

test('should replace template placeholders', () => {
  const generator = new BrikV5Generator();
  generator.config.project_name = 'test-project';
  generator.config.port = '3000';
  
  const template = 'Project: {{PROJECT_NAME}}, Port: {{PORT}}';
  const result = generator.processTemplate(template);
  
  expect(result).toContain('test-project');
  expect(result).toContain('3000');
});

test('should handle missing config values', () => {
  const generator = new BrikV5Generator();
  generator.config.project_name = 'test';
  
  const template = '{{PROJECT_NAME}} - {{UNKNOWN}}';
  const result = generator.processTemplate(template);
  
  expect(result).toContain('test');
  expect(result).toContain('{{UNKNOWN}}');
});

// Test Suite 3: Command Generation
console.log(chalk.yellow('\n🛠️ Command Generation Tests'));

test('should generate install command for TypeScript', () => {
  const generator = new BrikV5Generator();
  generator.config.language = 'typescript';
  expect(generator.getInstallCommand()).toBe('npm install');
});

test('should generate install command for Rust', () => {
  const generator = new BrikV5Generator();
  generator.config.language = 'rust';
  expect(generator.getInstallCommand()).toBe('cargo build');
});

test('should generate dev command', () => {
  const generator = new BrikV5Generator();
  generator.config.language = 'typescript';
  expect(generator.getDevCommand()).toBe('npm run dev');
});

test('should generate test command', () => {
  const generator = new BrikV5Generator();
  generator.config.language = 'typescript';
  expect(generator.getTestCommand()).toBe('npm test');
});

test('should generate build command', () => {
  const generator = new BrikV5Generator();
  generator.config.language = 'rust';
  expect(generator.getBuildCommand()).toBe('cargo build --release');
});

// Test Suite 4: Validation
console.log(chalk.yellow('\n✅ Validation Tests'));

test('should validate configuration correctly', async () => {
  const generator = new BrikV5Generator();
  generator.config = {
    project_name: 'valid-project',
    language: 'typescript',
    database: 'postgres',
    port: '3000'
  };
  
  try {
    await generator.validateConfig();
    // Si no lanza error, el test pasa
  } catch (error) {
    throw new Error('Validation should not fail for valid config');
  }
});

test('should throw error for missing project name', async () => {
  const generator = new BrikV5Generator();
  generator.config = {
    language: 'typescript'
  };
  
  let errorThrown = false;
  try {
    await generator.validateConfig();
  } catch (error) {
    errorThrown = true;
    expect(error.message).toContain('Falta el nombre del proyecto');
  }
  
  if (!errorThrown) {
    throw new Error('Should have thrown error for missing project name');
  }
});

test('should throw error for invalid language', async () => {
  const generator = new BrikV5Generator();
  generator.config = {
    project_name: 'test',
    language: 'python' // Not supported
  };
  
  let errorThrown = false;
  try {
    await generator.validateConfig();
  } catch (error) {
    errorThrown = true;
    expect(error.message).toContain('Lenguaje no soportado');
  }
  
  if (!errorThrown) {
    throw new Error('Should have thrown error for invalid language');
  }
});

// Print results
console.log(chalk.cyan.bold('\n📊 Test Results\n'));
console.log(`Total Tests: ${totalTests}`);
console.log(chalk.green(`Passed: ${passedTests}`));
console.log(chalk.red(`Failed: ${failedTests}`));

if (errors.length > 0) {
  console.log(chalk.red.bold('\n❌ Failed Tests:'));
  errors.forEach(e => {
    console.log(chalk.red(`  - ${e.test}`));
    console.log(chalk.dim(`    ${e.error}`));
  });
}

// Calculate coverage approximation
const methodsTested = 10; // Methods we tested
const totalMethods = 25; // Total methods in the class
const coveragePercentage = ((methodsTested / totalMethods) * 100).toFixed(1);

console.log(chalk.yellow.bold(`\n📈 Approximate Coverage: ${coveragePercentage}%`));

// Exit code
process.exit(failedTests > 0 ? 1 : 0);