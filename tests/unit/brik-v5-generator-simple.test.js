/**
 * Simple test to verify Jest setup works
 */

describe('BrikV5Generator Basic Test', () => {
  test('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });
  
  test('should load BrikV5Generator class', () => {
    const BrikV5Generator = require('../../brik-v5-generator');
    expect(BrikV5Generator).toBeDefined();
    expect(typeof BrikV5Generator).toBe('function');
  });
  
  test('should create instance with default config', () => {
    const BrikV5Generator = require('../../brik-v5-generator');
    const generator = new BrikV5Generator();
    expect(generator.config).toBeDefined();
    expect(generator.config.http_timeout_ms).toBe(2000);
    expect(generator.config.enable_openapi).toBe(true);
  });
});