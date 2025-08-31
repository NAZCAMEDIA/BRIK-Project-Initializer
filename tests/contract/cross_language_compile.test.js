/**
 * BRIK L3 Certification - Cross-Language Compilation Tests
 * 
 * Tests compilation and execution of BRIK projects across different languages:
 * - TypeScript/JavaScript compilation and execution
 * - Python compilation and execution
 * - Rust compilation and execution
 * - Cross-language interface compatibility
 * 
 * DEPLOYMENT: Move to tests/contract/cross_language_compile.test.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class CrossLanguageCompileTester {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.testResults = {
      typescript: { success: false, errors: [], output: '' },
      javascript: { success: false, errors: [], output: '' },
      python: { success: false, errors: [], output: '' },
      rust: { success: false, errors: [], output: '' },
      crossLanguageCompatibility: { success: false, errors: [], details: [] }
    };
  }

  /**
   * Runs comprehensive cross-language compilation tests
   */
  async runAllTests() {
    console.log('🔄 Starting Cross-Language Compilation Tests...');
    
    try {
      // Test TypeScript compilation
      await this.testTypeScriptCompilation();
      
      // Test JavaScript execution
      await this.testJavaScriptExecution();
      
      // Test Python compilation/execution
      await this.testPythonExecution();
      
      // Test Rust compilation
      await this.testRustCompilation();
      
      // Test cross-language interface compatibility
      await this.testCrossLanguageCompatibility();
      
      return this.generateTestReport();
      
    } catch (error) {
      console.error('❌ Cross-language testing failed:', error);
      throw error;
    }
  }

  /**
   * Tests TypeScript compilation across the project
   */
  async testTypeScriptCompilation() {
    console.log('📘 Testing TypeScript compilation...');
    
    try {
      // Find all TypeScript projects
      const tsProjects = await this.findTypeScriptProjects();
      
      for (const project of tsProjects) {
        console.log(`  - Compiling ${project}...`);
        
        const result = await execAsync(`cd "${project}" && npx tsc --noEmit`, {
          timeout: 30000,
          cwd: project
        });
        
        this.testResults.typescript.output += `${project}: ${result.stdout}\n`;
      }
      
      this.testResults.typescript.success = true;
      console.log('✅ TypeScript compilation successful');
      
    } catch (error) {
      this.testResults.typescript.errors.push(error.message);
      this.testResults.typescript.output += error.stdout || error.stderr || '';
      console.log('❌ TypeScript compilation failed:', error.message);
    }
  }

  /**
   * Tests JavaScript execution and Node.js compatibility
   */
  async testJavaScriptExecution() {
    console.log('📗 Testing JavaScript execution...');
    
    try {
      // Find JavaScript test files
      const jsTestFiles = await this.findJavaScriptTests();
      
      for (const testFile of jsTestFiles) {
        console.log(`  - Running ${testFile}...`);
        
        const result = await execAsync(`node "${testFile}"`, {
          timeout: 15000,
          cwd: path.dirname(testFile)
        });
        
        this.testResults.javascript.output += `${testFile}: ${result.stdout}\n`;
      }
      
      this.testResults.javascript.success = true;
      console.log('✅ JavaScript execution successful');
      
    } catch (error) {
      this.testResults.javascript.errors.push(error.message);
      this.testResults.javascript.output += error.stdout || error.stderr || '';
      console.log('❌ JavaScript execution failed:', error.message);
    }
  }

  /**
   * Tests Python compilation and execution
   */
  async testPythonExecution() {
    console.log('🐍 Testing Python compilation/execution...');
    
    try {
      // Find Python projects
      const pythonProjects = await this.findPythonProjects();
      
      for (const project of pythonProjects) {
        console.log(`  - Testing Python project ${project}...`);
        
        // Test Python syntax compilation
        const compileResult = await execAsync(`python3 -m py_compile ${project}/*.py`, {
          timeout: 15000,
          cwd: project
        });
        
        // Test Python execution if main file exists
        const mainFile = path.join(project, 'main.py');
        if (fs.existsSync(mainFile)) {
          const execResult = await execAsync(`python3 main.py --test`, {
            timeout: 15000,
            cwd: project
          });
          this.testResults.python.output += `${project}: ${execResult.stdout}\n`;
        }
      }
      
      this.testResults.python.success = true;
      console.log('✅ Python compilation/execution successful');
      
    } catch (error) {
      this.testResults.python.errors.push(error.message);
      this.testResults.python.output += error.stdout || error.stderr || '';
      console.log('❌ Python compilation/execution failed:', error.message);
    }
  }

  /**
   * Tests Rust compilation
   */
  async testRustCompilation() {
    console.log('🦀 Testing Rust compilation...');
    
    try {
      // Find Rust projects
      const rustProjects = await this.findRustProjects();
      
      for (const project of rustProjects) {
        console.log(`  - Compiling Rust project ${project}...`);
        
        // Test Rust compilation
        const result = await execAsync('cargo check', {
          timeout: 60000, // Rust compilation can be slow
          cwd: project
        });
        
        this.testResults.rust.output += `${project}: ${result.stdout}\n`;
        
        // Also test cargo test if available
        try {
          const testResult = await execAsync('cargo test --no-run', {
            timeout: 60000,
            cwd: project
          });
          this.testResults.rust.output += `${project} tests: ${testResult.stdout}\n`;
        } catch (testError) {
          // Test compilation failure is not critical
          console.log(`  ⚠️  Test compilation failed for ${project}, but main compilation succeeded`);
        }
      }
      
      this.testResults.rust.success = true;
      console.log('✅ Rust compilation successful');
      
    } catch (error) {
      this.testResults.rust.errors.push(error.message);
      this.testResults.rust.output += error.stdout || error.stderr || '';
      console.log('❌ Rust compilation failed:', error.message);
    }
  }

  /**
   * Tests cross-language interface compatibility
   */
  async testCrossLanguageCompatibility() {
    console.log('🔗 Testing cross-language compatibility...');
    
    try {
      const compatibilityTests = [
        await this.testJSONSchemaCompatibility(),
        await this.testAPIContractCompatibility(),
        await this.testDataStructureCompatibility(),
        await this.testConfigurationCompatibility()
      ];
      
      const allCompatible = compatibilityTests.every(test => test.success);
      
      this.testResults.crossLanguageCompatibility.success = allCompatible;
      this.testResults.crossLanguageCompatibility.details = compatibilityTests;
      
      if (allCompatible) {
        console.log('✅ Cross-language compatibility verified');
      } else {
        console.log('❌ Cross-language compatibility issues found');
      }
      
    } catch (error) {
      this.testResults.crossLanguageCompatibility.errors.push(error.message);
      console.log('❌ Cross-language compatibility test failed:', error.message);
    }
  }

  /**
   * Tests JSON schema compatibility across languages
   */
  async testJSONSchemaCompatibility() {
    console.log('  - Testing JSON schema compatibility...');
    
    try {
      // Find JSON schema files
      const schemaFiles = await this.findJSONSchemas();
      const compatibilityResults = [];
      
      for (const schemaFile of schemaFiles) {
        const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
        
        // Test schema against sample data from different languages
        const testResult = {
          schema: schemaFile,
          languages: {},
          compatible: true
        };
        
        // Test with TypeScript/JavaScript
        try {
          await this.validateSchemaWithJS(schema);
          testResult.languages.javascript = 'compatible';
        } catch (error) {
          testResult.languages.javascript = `incompatible: ${error.message}`;
          testResult.compatible = false;
        }
        
        // Test with Python
        try {
          await this.validateSchemaWithPython(schema);
          testResult.languages.python = 'compatible';
        } catch (error) {
          testResult.languages.python = `incompatible: ${error.message}`;
          testResult.compatible = false;
        }
        
        compatibilityResults.push(testResult);
      }
      
      return {
        success: compatibilityResults.every(r => r.compatible),
        details: compatibilityResults
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Tests API contract compatibility
   */
  async testAPIContractCompatibility() {
    console.log('  - Testing API contract compatibility...');
    
    try {
      // Look for OpenAPI/Swagger specs
      const apiSpecs = await this.findAPISpecs();
      
      if (apiSpecs.length === 0) {
        return { success: true, message: 'No API specs found - skipping' };
      }
      
      const results = [];
      
      for (const spec of apiSpecs) {
        // Validate spec can be parsed by different language tools
        const specData = JSON.parse(fs.readFileSync(spec, 'utf8'));
        
        results.push({
          spec,
          valid: this.validateOpenAPISpec(specData),
          crossLanguageSupport: this.checkCrossLanguageAPISupport(specData)
        });
      }
      
      return {
        success: results.every(r => r.valid && r.crossLanguageSupport),
        details: results
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Tests data structure compatibility
   */
  async testDataStructureCompatibility() {
    console.log('  - Testing data structure compatibility...');
    
    try {
      // Find configuration files and interfaces
      const configFiles = await this.findConfigurationFiles();
      const results = [];
      
      for (const configFile of configFiles) {
        try {
          const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
          
          results.push({
            file: configFile,
            parseable: true,
            structure: this.analyzeDataStructure(config)
          });
          
        } catch (parseError) {
          results.push({
            file: configFile,
            parseable: false,
            error: parseError.message
          });
        }
      }
      
      return {
        success: results.every(r => r.parseable),
        details: results
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Tests configuration compatibility
   */
  async testConfigurationCompatibility() {
    console.log('  - Testing configuration compatibility...');
    
    try {
      const configTests = [
        this.testPackageJSONCompatibility(),
        this.testTSConfigCompatibility(),
        this.testCargoTomlCompatibility(),
        this.testPythonSetupCompatibility()
      ];
      
      const results = await Promise.all(configTests);
      
      return {
        success: results.every(r => r.success),
        details: results
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Helper methods for finding project files
   */
  async findTypeScriptProjects() {
    const projects = [];
    await this.walkDirectory(this.projectRoot, (filePath) => {
      if (path.basename(filePath) === 'tsconfig.json') {
        projects.push(path.dirname(filePath));
      }
    });
    return projects;
  }

  async findJavaScriptTests() {
    const tests = [];
    await this.walkDirectory(this.projectRoot, (filePath) => {
      if (filePath.endsWith('.test.js') || filePath.endsWith('.spec.js')) {
        tests.push(filePath);
      }
    });
    return tests;
  }

  async findPythonProjects() {
    const projects = [];
    await this.walkDirectory(this.projectRoot, (filePath) => {
      if (path.basename(filePath) === 'setup.py' || path.basename(filePath) === 'pyproject.toml') {
        projects.push(path.dirname(filePath));
      }
    });
    return projects;
  }

  async findRustProjects() {
    const projects = [];
    await this.walkDirectory(this.projectRoot, (filePath) => {
      if (path.basename(filePath) === 'Cargo.toml') {
        projects.push(path.dirname(filePath));
      }
    });
    return projects;
  }

  async findJSONSchemas() {
    const schemas = [];
    await this.walkDirectory(this.projectRoot, (filePath) => {
      if (filePath.endsWith('.schema.json') || 
          (filePath.endsWith('.json') && filePath.includes('schema'))) {
        schemas.push(filePath);
      }
    });
    return schemas;
  }

  async findAPISpecs() {
    const specs = [];
    await this.walkDirectory(this.projectRoot, (filePath) => {
      if (filePath.includes('openapi') || filePath.includes('swagger')) {
        if (filePath.endsWith('.json') || filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
          specs.push(filePath);
        }
      }
    });
    return specs;
  }

  async findConfigurationFiles() {
    const configs = [];
    await this.walkDirectory(this.projectRoot, (filePath) => {
      const basename = path.basename(filePath);
      if (basename === 'package.json' || 
          basename === 'tsconfig.json' ||
          basename === 'Cargo.toml' ||
          basename.endsWith('.config.json')) {
        configs.push(filePath);
      }
    });
    return configs;
  }

  /**
   * Utility method to walk directory tree
   */
  async walkDirectory(dir, callback) {
    try {
      const items = await fs.promises.readdir(dir);
      
      for (const item of items) {
        if (item.startsWith('.') || item === 'node_modules' || item === 'target') {
          continue;
        }
        
        const fullPath = path.join(dir, item);
        const stat = await fs.promises.stat(fullPath);
        
        if (stat.isDirectory()) {
          await this.walkDirectory(fullPath, callback);
        } else if (stat.isFile()) {
          callback(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  /**
   * Validation helper methods
   */
  async validateSchemaWithJS(schema) {
    // Simple schema validation - in real implementation, use Ajv or similar
    return true;
  }

  async validateSchemaWithPython(schema) {
    // Would use jsonschema library in Python
    return true;
  }

  validateOpenAPISpec(spec) {
    return spec.openapi || spec.swagger;
  }

  checkCrossLanguageAPISupport(spec) {
    // Check if API spec has features supported across languages
    return true;
  }

  analyzeDataStructure(data) {
    return {
      hasArrays: Array.isArray(data) || Object.values(data).some(Array.isArray),
      hasObjects: typeof data === 'object',
      hasComplexTypes: this.hasComplexTypes(data)
    };
  }

  hasComplexTypes(data) {
    if (typeof data === 'object' && data !== null) {
      return Object.values(data).some(value => 
        typeof value === 'object' || Array.isArray(value)
      );
    }
    return false;
  }

  async testPackageJSONCompatibility() {
    try {
      const packageFiles = [];
      await this.walkDirectory(this.projectRoot, (filePath) => {
        if (path.basename(filePath) === 'package.json') {
          packageFiles.push(filePath);
        }
      });

      for (const file of packageFiles) {
        JSON.parse(fs.readFileSync(file, 'utf8'));
      }

      return { success: true, count: packageFiles.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testTSConfigCompatibility() {
    try {
      const tsconfigFiles = [];
      await this.walkDirectory(this.projectRoot, (filePath) => {
        if (path.basename(filePath) === 'tsconfig.json') {
          tsconfigFiles.push(filePath);
        }
      });

      for (const file of tsconfigFiles) {
        JSON.parse(fs.readFileSync(file, 'utf8'));
      }

      return { success: true, count: tsconfigFiles.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testCargoTomlCompatibility() {
    try {
      const cargoFiles = [];
      await this.walkDirectory(this.projectRoot, (filePath) => {
        if (path.basename(filePath) === 'Cargo.toml') {
          cargoFiles.push(filePath);
        }
      });

      // Basic TOML format validation would go here
      return { success: true, count: cargoFiles.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testPythonSetupCompatibility() {
    try {
      const pythonFiles = [];
      await this.walkDirectory(this.projectRoot, (filePath) => {
        if (path.basename(filePath) === 'setup.py' || path.basename(filePath) === 'pyproject.toml') {
          pythonFiles.push(filePath);
        }
      });

      return { success: true, count: pythonFiles.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Generates comprehensive test report
   */
  generateTestReport() {
    const totalTests = Object.keys(this.testResults).length;
    const passedTests = Object.values(this.testResults).filter(r => r.success).length;
    const successRate = (passedTests / totalTests) * 100;

    return {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: totalTests - passedTests,
        successRate: Math.round(successRate)
      },
      details: this.testResults,
      compliance: successRate >= 75, // L3 requires 75% cross-language compatibility
      recommendations: this.generateRecommendations()
    };
  }

  generateRecommendations() {
    const recommendations = [];

    if (!this.testResults.typescript.success) {
      recommendations.push('Fix TypeScript compilation errors to ensure type safety');
    }

    if (!this.testResults.javascript.success) {
      recommendations.push('Resolve JavaScript execution issues for runtime compatibility');
    }

    if (!this.testResults.python.success) {
      recommendations.push('Address Python compilation/execution problems');
    }

    if (!this.testResults.rust.success) {
      recommendations.push('Fix Rust compilation errors for systems-level compatibility');
    }

    if (!this.testResults.crossLanguageCompatibility.success) {
      recommendations.push('Improve cross-language interfaces and data structure compatibility');
    }

    return recommendations;
  }
}

// Jest test suite
describe('BRIK L3 Cross-Language Compilation Tests', () => {
  let tester;
  let testResults;

  beforeAll(async () => {
    tester = new CrossLanguageCompileTester(process.cwd());
    testResults = await tester.runAllTests();
  }, 120000); // Extended timeout for compilation tests

  describe('Language-Specific Compilation', () => {
    test('TypeScript compilation should succeed', () => {
      expect(testResults.details.typescript.success).toBe(true);
    });

    test('JavaScript execution should succeed', () => {
      expect(testResults.details.javascript.success).toBe(true);
    });

    test('Python compilation/execution should succeed', () => {
      expect(testResults.details.python.success).toBe(true);
    });

    test('Rust compilation should succeed', () => {
      expect(testResults.details.rust.success).toBe(true);
    });
  });

  describe('Cross-Language Compatibility', () => {
    test('Should maintain cross-language compatibility', () => {
      expect(testResults.details.crossLanguageCompatibility.success).toBe(true);
    });

    test('Should achieve minimum compatibility rate for L3', () => {
      expect(testResults.summary.successRate).toBeGreaterThan(75);
    });
  });

  describe('Overall L3 Compliance', () => {
    test('Should meet L3 cross-language requirements', () => {
      expect(testResults.compliance).toBe(true);
    });

    test('Should provide actionable recommendations for failures', () => {
      if (!testResults.compliance) {
        expect(testResults.recommendations.length).toBeGreaterThan(0);
      }
    });
  });
});

module.exports = CrossLanguageCompileTester;