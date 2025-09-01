/**
 * Integration Tests for BRIK v5 Generator
 * 🎯 Target: Complete 100% coverage including I/O operations
 * 🧬 L4 Certification: Perfect Circuit Achievement
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Mock all external dependencies
jest.mock('fs');
jest.mock('readline');
jest.mock('chalk', () => ({
  cyan: jest.fn(str => str),
  green: jest.fn(str => str),
  yellow: jest.fn(str => str),
  red: jest.fn(str => str),
  bold: jest.fn(str => str),
  dim: jest.fn(str => str),
  cyan: { bold: jest.fn(str => str) },
  green: { bold: jest.fn(str => str) },
  yellow: { bold: jest.fn(str => str) },
  red: { bold: jest.fn(str => str) }
}));

// Import after mocks
const BrikV5Generator = require('../../brik-v5-generator');

describe('🧬 BrikV5Generator Integration Tests - L4 Perfect Circuit', () => {
  let generator;
  let mockReadline;
  let consoleLogSpy;
  let consoleErrorSpy;
  let consoleClearSpy;
  let processExitSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup console mocks
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleClearSpy = jest.spyOn(console, 'clear').mockImplementation();
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation();
    
    // Setup readline mock
    mockReadline = {
      question: jest.fn(),
      close: jest.fn()
    };
    readline.createInterface.mockReturnValue(mockReadline);
    
    // Create generator instance
    generator = new BrikV5Generator();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleClearSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  describe('🚀 Full Run Method Tests', () => {
    test('should complete full generation flow successfully', async () => {
      // Mock user inputs
      const mockInputs = [
        'test-project',      // project name
        '1',                 // TypeScript
        '1',                 // PostgreSQL
        '1',                 // Redis
        '1',                 // Kafka
        '3000',              // port
        's',                 // enable OpenAPI
        's',                 // enable Idempotency
        's',                 // enable Rate Limiting
        's',                 // enable Tracing
        'users',             // default resource
        '2000',              // timeout
        's'                  // confirm generation
      ];

      let inputIndex = 0;
      mockReadline.question.mockImplementation((query, callback) => {
        callback(mockInputs[inputIndex++]);
      });

      // Mock file system
      fs.existsSync.mockReturnValue(false);
      fs.mkdirSync.mockImplementation();
      fs.readdirSync.mockReturnValue([]);
      fs.writeFileSync.mockImplementation();
      fs.chmodSync.mockImplementation();

      await generator.run();

      expect(consoleClearSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('PROYECTO BRIK v5 GENERADO EXITOSAMENTE')
      );
      expect(mockReadline.close).toHaveBeenCalled();
    });

    test('should handle generation error gracefully', async () => {
      mockReadline.question.mockImplementation(() => {
        throw new Error('Test error');
      });

      await generator.run();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test error')
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(mockReadline.close).toHaveBeenCalled();
    });

    test('should handle user cancellation', async () => {
      const mockInputs = [
        'test-project',
        '1', '1', '1', '1', '3000',
        's', 's', 's', 's',
        'users', '2000',
        'n'  // Cancel generation
      ];

      let inputIndex = 0;
      mockReadline.question.mockImplementation((query, callback) => {
        callback(mockInputs[inputIndex++]);
      });

      await generator.run();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('cancelada por el usuario')
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('📋 CollectConfig Method Tests', () => {
    test('should collect all configuration options', async () => {
      const mockInputs = [
        'my-project',
        '2',    // Rust
        '2',    // MySQL
        '2',    // In-Memory cache
        '2',    // RabbitMQ
        '8080', // port
        'n',    // disable OpenAPI
        'n',    // disable Idempotency
        'n',    // disable Rate Limiting
        'n',    // disable Tracing
        'api',  // resource
        '5000'  // timeout
      ];

      let inputIndex = 0;
      mockReadline.question.mockImplementation((query, callback) => {
        callback(mockInputs[inputIndex++]);
      });

      await generator.collectConfig();

      expect(generator.config.project_name).toBe('my-project');
      expect(generator.config.language).toBe('rust');
      expect(generator.config.database).toBe('mysql');
      expect(generator.config.cache).toBe('memory');
      expect(generator.config.event_system).toBe('rabbitmq');
      expect(generator.config.port).toBe('8080');
      expect(generator.config.enable_openapi).toBe(false);
      expect(generator.config.enable_idempotency).toBe(false);
      expect(generator.config.enable_rate_limit).toBe(false);
      expect(generator.config.enable_tracing).toBe(false);
      expect(generator.config.default_resource).toBe('api');
      expect(generator.config.http_timeout_ms).toBe(5000);
    });

    test('should use defaults for empty inputs', async () => {
      const mockInputs = [
        '',     // empty project name
        '99',   // invalid language choice
        '99',   // invalid database choice
        '99',   // invalid cache choice
        '99',   // invalid event choice
        '',     // empty port
        '',     // default OpenAPI
        '',     // default Idempotency
        '',     // default Rate Limiting
        '',     // default Tracing
        '',     // default resource
        ''      // default timeout
      ];

      let inputIndex = 0;
      mockReadline.question.mockImplementation((query, callback) => {
        callback(mockInputs[inputIndex++]);
      });

      await generator.collectConfig();

      expect(generator.config.project_name).toBe('brik-project');
      expect(generator.config.language).toBe('typescript');
      expect(generator.config.database).toBe('postgres');
      expect(generator.config.cache).toBe('redis');
      expect(generator.config.event_system).toBe('null');
      expect(generator.config.port).toBe('3000');
      expect(generator.config.enable_openapi).toBe(true);
      expect(generator.config.enable_idempotency).toBe(true);
      expect(generator.config.enable_rate_limit).toBe(true);
      expect(generator.config.enable_tracing).toBe(true);
      expect(generator.config.default_resource).toBe('users');
      expect(generator.config.http_timeout_ms).toBe(2000);
    });
  });

  describe('🎨 ShowBanner Method Test', () => {
    test('should display banner correctly', () => {
      generator.showBanner();
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('BRIK v5 GENERATOR')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('CIRCUITALIDAD DIGITAL')
      );
    });
  });

  describe('📁 GenerateProject Method Tests', () => {
    beforeEach(() => {
      generator.config = {
        project_name: 'test-project',
        language: 'typescript',
        database: 'postgres',
        cache: 'redis',
        event_system: 'kafka',
        port: '3000',
        http_timeout_ms: 2000,
        enable_openapi: true,
        enable_idempotency: true,
        enable_rate_limit: true,
        enable_tracing: true,
        default_resource: 'users'
      };
    });

    test('should generate project structure successfully', async () => {
      fs.existsSync.mockReturnValue(false);
      fs.mkdirSync.mockImplementation();
      fs.readdirSync.mockReturnValue(['file1.ts', 'file2.ts']);
      fs.statSync.mockReturnValue({ isDirectory: () => false });
      fs.readFileSync.mockReturnValue('template {{PROJECT_NAME}}');
      fs.writeFileSync.mockImplementation();
      fs.chmodSync.mockImplementation();

      await generator.generateProject();

      expect(fs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining('test-project'),
        { recursive: true }
      );
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    test('should handle existing project directory', async () => {
      fs.existsSync.mockReturnValue(true);

      await expect(generator.generateProject()).rejects.toThrow(
        'El directorio \'test-project\' ya existe'
      );
    });

    test('should handle missing template directory', async () => {
      fs.existsSync.mockReturnValueOnce(false)  // project doesn't exist
                    .mockReturnValueOnce(false); // template doesn't exist
      fs.mkdirSync.mockImplementation();
      fs.readdirSync.mockImplementation(() => {
        throw new Error('ENOENT');
      });

      await generator.generateProject();

      // Should create basic structure
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Creando estructura básica')
      );
    });
  });

  describe('📄 CopyTemplateDirectory Method Tests', () => {
    test('should copy template files recursively', async () => {
      const srcDir = '/templates/typescript';
      const destDir = '/projects/test';

      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue(['file.ts', 'subdir']);
      fs.statSync
        .mockReturnValueOnce({ isDirectory: () => false })
        .mockReturnValueOnce({ isDirectory: () => true })
        .mockReturnValue({ isDirectory: () => false });
      fs.readFileSync.mockReturnValue('content {{PROJECT_NAME}}');
      fs.writeFileSync.mockImplementation();
      fs.mkdirSync.mockImplementation();

      generator.config.project_name = 'test';
      await generator.copyTemplateDirectory(srcDir, destDir);

      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    test('should handle binary files', async () => {
      const srcDir = '/templates';
      const destDir = '/project';

      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue(['image.png', 'script.js']);
      fs.statSync.mockReturnValue({ isDirectory: () => false });
      fs.copyFileSync.mockImplementation();
      fs.readFileSync.mockReturnValue('console.log("{{PROJECT_NAME}}");');
      fs.writeFileSync.mockImplementation();

      generator.config.project_name = 'test';
      await generator.copyTemplateDirectory(srcDir, destDir);

      // Binary file should be copied directly
      expect(fs.copyFileSync).toHaveBeenCalledWith(
        expect.stringContaining('image.png'),
        expect.any(String)
      );
      
      // Text file should be processed
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('script.js'),
        expect.stringContaining('test')
      );
    });

    test('should handle read errors gracefully', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue(['corrupt.txt']);
      fs.statSync.mockReturnValue({ isDirectory: () => false });
      fs.readFileSync.mockImplementation(() => {
        throw new Error('Read error');
      });
      fs.copyFileSync.mockImplementation();

      await generator.copyTemplateDirectory('/src', '/dest');

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('No se pudo procesar')
      );
    });
  });

  describe('📋 GenerateConfigFiles Method Tests', () => {
    test('should generate brik.config.json', async () => {
      generator.config = {
        project_name: 'test-project',
        language: 'typescript',
        enable_openapi: true,
        enable_idempotency: true,
        enable_rate_limit: true,
        enable_tracing: true
      };

      const projectPath = '/test-project';
      fs.writeFileSync.mockImplementation();

      await generator.generateConfigFiles(projectPath);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('brik.config.json'),
        expect.stringContaining('"brik_version": "5.0.0"')
      );
    });

    test('should generate .env.example', async () => {
      generator.config = {
        project_name: 'test-project',
        port: '8080',
        http_timeout_ms: 3000,
        enable_rate_limit: true,
        enable_openapi: true
      };

      const projectPath = '/test-project';
      fs.writeFileSync.mockImplementation();

      await generator.generateConfigFiles(projectPath);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('.env.example'),
        expect.stringContaining('PORT=8080')
      );
    });

    test('should generate package.json for TypeScript', async () => {
      generator.config = {
        project_name: 'ts-project',
        language: 'typescript'
      };

      fs.writeFileSync.mockImplementation();

      await generator.generateConfigFiles('/ts-project');

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('package.json'),
        expect.stringContaining('"name": "ts-project"')
      );
    });

    test('should generate Cargo.toml for Rust', async () => {
      generator.config = {
        project_name: 'rust-project',
        language: 'rust'
      };

      fs.writeFileSync.mockImplementation();

      await generator.generateConfigFiles('/rust-project');

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('Cargo.toml'),
        expect.stringContaining('name = "rust-project"')
      );
    });
  });

  describe('📚 GenerateDocumentation Method Tests', () => {
    test('should generate README.md with correct content', async () => {
      generator.config = {
        project_name: 'doc-project',
        default_resource: 'items',
        enable_openapi: true,
        enable_idempotency: true,
        enable_rate_limit: false,
        enable_tracing: true,
        language: 'typescript'
      };

      fs.mkdirSync.mockImplementation();
      fs.writeFileSync.mockImplementation();

      await generator.generateDocumentation('/doc-project');

      expect(fs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining('docs'),
        { recursive: true }
      );

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('README.md'),
        expect.stringContaining('doc-project')
      );
    });
  });

  describe('📜 GenerateScripts Method Tests', () => {
    test('should generate validation script', async () => {
      generator.config = {
        language: 'typescript'
      };

      fs.mkdirSync.mockImplementation();
      fs.writeFileSync.mockImplementation();
      fs.chmodSync.mockImplementation();

      await generator.generateScripts('/project');

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('validate.sh'),
        expect.stringContaining('BRIK v5 Validation Script')
      );
    });

    test('should handle chmod errors on Windows', async () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', {
        value: 'win32'
      });

      fs.mkdirSync.mockImplementation();
      fs.writeFileSync.mockImplementation();
      fs.chmodSync.mockImplementation(() => {
        throw new Error('Not supported');
      });

      await generator.generateScripts('/project');

      expect(consoleLogSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('Error')
      );

      Object.defineProperty(process, 'platform', {
        value: originalPlatform
      });
    });
  });

  describe('🚀 ShowNextSteps Method Tests', () => {
    test('should show next steps with OpenAPI enabled', () => {
      generator.config = {
        project_name: 'next-project',
        language: 'typescript',
        enable_openapi: true,
        port: '3000',
        default_resource: 'users'
      };

      generator.showNextSteps();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('cd next-project')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Docs: http://localhost:3000/docs')
      );
    });

    test('should adjust for Windows platform', () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', {
        value: 'win32'
      });

      generator.config = {
        project_name: 'win-project',
        language: 'typescript',
        default_resource: 'users'
      };

      generator.showNextSteps();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('bash scripts/validate.sh')
      );

      Object.defineProperty(process, 'platform', {
        value: originalPlatform
      });
    });
  });

  describe('🛠️ CreateBasicStructure Method Tests', () => {
    test('should create basic TypeScript structure', () => {
      generator.config = {
        project_name: 'basic-ts',
        language: 'typescript'
      };

      fs.mkdirSync.mockImplementation();
      fs.writeFileSync.mockImplementation();

      generator.createBasicStructure('/basic-ts');

      expect(fs.mkdirSync).toHaveBeenCalledTimes(5); // 5 directories
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('src/index.ts'),
        expect.stringContaining('console.log')
      );
    });

    test('should create basic Rust structure', () => {
      generator.config = {
        project_name: 'basic-rust',
        language: 'rust'
      };

      fs.mkdirSync.mockImplementation();
      fs.writeFileSync.mockImplementation();

      generator.createBasicStructure('/basic-rust');

      expect(fs.mkdirSync).toHaveBeenCalledTimes(5);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('src/main.rs'),
        expect.stringContaining('fn main()')
      );
    });
  });
});

module.exports = { BrikV5Generator };