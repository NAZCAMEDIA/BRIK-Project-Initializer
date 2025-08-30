/**
 * Cross-Language Compilation Validator - Simplified Version
 * Tests compilation of TypeScript, Python, and Rust demos
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class CrossLanguageValidator {
  constructor() {
    this.results = {
      typescript: { status: 'pending', score: 0, details: '' },
      python: { status: 'pending', score: 0, details: '' },
      rust: { status: 'pending', score: 0, details: '' }
    };
    this.totalScore = 0;
  }

  async validate() {
    console.log('🔄 Starting Cross-Language Compilation Tests...');
    
    try {
      await this.testTypeScriptCompilation();
      await this.testPythonCompilation();
      await this.testRustCompilation();
      
      this.calculateTotalScore();
      this.generateReport();
      
      return {
        success: true,
        score: this.totalScore,
        results: this.results
      };
    } catch (error) {
      console.error('❌ Cross-language validation failed:', error.message);
      return {
        success: false,
        error: error.message,
        score: this.totalScore
      };
    }
  }

  async testTypeScriptCompilation() {
    console.log('📘 Testing TypeScript compilation...');
    
    try {
      const tsDemos = ['demo-ts', 'test-ecommerce'];
      let passedTests = 0;
      let totalTests = 0;

      for (const demo of tsDemos) {
        const demoPath = path.join(process.cwd(), demo);
        if (!fs.existsSync(demoPath)) continue;

        totalTests++;
        console.log(`  - Compiling ${demo}...`);

        try {
          // Check if package.json exists
          const packagePath = path.join(demoPath, 'package.json');
          if (fs.existsSync(packagePath)) {
            // Try to compile TypeScript
            const tsConfigPath = path.join(demoPath, 'tsconfig.json');
            if (fs.existsSync(tsConfigPath)) {
              execSync('npx tsc --noEmit', { 
                cwd: demoPath, 
                timeout: 30000,
                stdio: 'pipe' 
              });
              console.log(`    ✅ ${demo} compiled successfully`);
              passedTests++;
            } else {
              console.log(`    ⚠️ ${demo} - no tsconfig.json found`);
            }
          } else {
            console.log(`    ⚠️ ${demo} - no package.json found`);
          }
        } catch (error) {
          console.log(`    ❌ ${demo} compilation failed: ${error.message.slice(0, 100)}`);
        }
      }

      const score = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
      this.results.typescript = {
        status: score >= 75 ? 'passed' : score >= 50 ? 'partial' : 'failed',
        score,
        details: `${passedTests}/${totalTests} demos compiled successfully`
      };

    } catch (error) {
      this.results.typescript = {
        status: 'failed',
        score: 0,
        details: `TypeScript compilation failed: ${error.message}`
      };
    }
  }

  async testPythonCompilation() {
    console.log('🐍 Testing Python compilation...');
    
    try {
      const pyDemos = ['demo-py'];
      let passedTests = 0;
      let totalTests = 0;

      for (const demo of pyDemos) {
        const demoPath = path.join(process.cwd(), demo);
        if (!fs.existsSync(demoPath)) continue;

        totalTests++;
        console.log(`  - Validating ${demo}...`);

        try {
          // Check for Python files and basic syntax
          const srcPath = path.join(demoPath, 'src');
          if (fs.existsSync(srcPath)) {
            const pyFiles = this.findFilesWithExtension(srcPath, '.py');
            if (pyFiles.length > 0) {
              // Try to compile Python files
              execSync('python -m py_compile src/**/*.py || python3 -m py_compile src/**/*.py', { 
                cwd: demoPath, 
                timeout: 15000,
                stdio: 'pipe'
              });
              console.log(`    ✅ ${demo} syntax validated successfully`);
              passedTests++;
            } else {
              console.log(`    ⚠️ ${demo} - no Python files found`);
            }
          } else {
            console.log(`    ⚠️ ${demo} - no src directory found`);
          }
        } catch (error) {
          console.log(`    ❌ ${demo} validation failed: ${error.message.slice(0, 100)}`);
        }
      }

      const score = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
      this.results.python = {
        status: score >= 75 ? 'passed' : score >= 50 ? 'partial' : 'failed',
        score,
        details: `${passedTests}/${totalTests} demos validated successfully`
      };

    } catch (error) {
      this.results.python = {
        status: 'failed',
        score: 0,
        details: `Python validation failed: ${error.message}`
      };
    }
  }

  async testRustCompilation() {
    console.log('🦀 Testing Rust compilation...');
    
    try {
      const rustDemos = ['demo-brik', 'brik-factory-rust', 'test-ecommerce', 'test-auto-cert'];
      let passedTests = 0;
      let totalTests = 0;

      for (const demo of rustDemos) {
        const demoPath = path.join(process.cwd(), demo);
        const cargoPath = path.join(demoPath, 'Cargo.toml');
        
        if (!fs.existsSync(cargoPath)) continue;

        totalTests++;
        console.log(`  - Compiling ${demo}...`);

        try {
          // Try to check Rust syntax
          execSync('cargo check', { 
            cwd: demoPath, 
            timeout: 45000,
            stdio: 'pipe' 
          });
          console.log(`    ✅ ${demo} compiled successfully`);
          passedTests++;
        } catch (error) {
          console.log(`    ❌ ${demo} compilation failed: ${error.message.slice(0, 100)}`);
        }
      }

      const score = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
      this.results.rust = {
        status: score >= 75 ? 'passed' : score >= 50 ? 'partial' : 'failed',
        score,
        details: `${passedTests}/${totalTests} demos compiled successfully`
      };

    } catch (error) {
      this.results.rust = {
        status: 'failed',
        score: 0,
        details: `Rust compilation failed: ${error.message}`
      };
    }
  }

  findFilesWithExtension(dir, extension) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.findFilesWithExtension(fullPath, extension));
      } else if (item.endsWith(extension)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  calculateTotalScore() {
    const scores = [
      this.results.typescript.score,
      this.results.python.score,
      this.results.rust.score
    ];
    
    this.totalScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  generateReport() {
    console.log('\\n📋 Cross-Language Compilation Report');
    console.log('=====================================');
    console.log(`📊 Overall Score: ${this.totalScore}/100`);
    console.log(`📘 TypeScript: ${this.results.typescript.status.toUpperCase()} (${this.results.typescript.score}%)`);
    console.log(`   ${this.results.typescript.details}`);
    console.log(`🐍 Python: ${this.results.python.status.toUpperCase()} (${this.results.python.score}%)`);
    console.log(`   ${this.results.python.details}`);
    console.log(`🦀 Rust: ${this.results.rust.status.toUpperCase()} (${this.results.rust.score}%)`);
    console.log(`   ${this.results.rust.details}`);
    
    if (this.totalScore >= 75) {
      console.log('✅ Cross-Language Compilation: PASSED');
    } else if (this.totalScore >= 50) {
      console.log('⚠️ Cross-Language Compilation: PARTIAL');
    } else {
      console.log('❌ Cross-Language Compilation: FAILED');
    }

    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      totalScore: this.totalScore,
      status: this.totalScore >= 75 ? 'PASSED' : this.totalScore >= 50 ? 'PARTIAL' : 'FAILED',
      results: this.results
    };

    fs.writeFileSync('cross-language-report.json', JSON.stringify(report, null, 2));
    console.log('📄 Report saved to: cross-language-report.json');
  }
}

// Run validation if called directly
if (require.main === module) {
  (async () => {
    const validator = new CrossLanguageValidator();
    const result = await validator.validate();
    process.exit(result.success && result.score >= 50 ? 0 : 1);
  })();
}

module.exports = CrossLanguageValidator;