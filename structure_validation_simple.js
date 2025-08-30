/**
 * Simple BRIK Structure Validation
 * Basic validation script that can run without Jest
 */

const fs = require('fs');
const path = require('path');

class BrikStructureValidator {
  constructor() {
    this.projectRoot = process.cwd();
    this.findings = {
      core: [],
      wrappers: [],
      living_layer: [],
      documentation: [],
      violations: []
    };
    this.score = 0;
  }

  async validate() {
    console.log('🔍 Starting BRIK Structure Validation...');
    
    try {
      await this.scanProjectStructure();
      this.calculateScore();
      this.generateReport();
      
      return {
        success: true,
        score: this.score,
        findings: this.findings
      };
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      return {
        success: false,
        error: error.message,
        score: 0
      };
    }
  }

  async scanProjectStructure() {
    const files = await this.getAllProjectFiles();
    console.log(`📁 Found ${files.length} project files`);

    for (const file of files) {
      try {
        const content = await this.readFileContent(file);
        const fileName = path.basename(file);
        const relativePath = path.relative(this.projectRoot, file);
        
        this.analyzeFile(relativePath, fileName, content);
      } catch (error) {
        console.warn(`⚠️ Could not read file: ${file}`);
      }
    }
  }

  analyzeFile(relativePath, fileName, content) {
    // Core layer detection
    if (this.isCore(fileName, content)) {
      this.findings.core.push(relativePath);
    }

    // Wrappers layer detection
    if (this.isWrapper(fileName, content)) {
      this.findings.wrappers.push(relativePath);
    }

    // Living layer detection
    if (this.isLivingLayer(fileName, content)) {
      this.findings.living_layer.push(relativePath);
    }

    // Documentation detection
    if (this.isDocumentation(fileName)) {
      this.findings.documentation.push(relativePath);
    }
  }

  isCore(fileName, content) {
    const corePatterns = [
      /.*[Cc]ore.*/,
      /.*[Cc]ontrol.*/,
      /.*[Oo]rchestrat.*/,
      /.*[Bb]ase[Cc]ontroller.*/
    ];

    return corePatterns.some(pattern => 
      pattern.test(fileName) || pattern.test(content)
    ) || content.includes('CORE') || fileName.includes('core');
  }

  isWrapper(fileName, content) {
    const wrapperPatterns = [
      /.*[Ll]ogger.*/,
      /.*[Cc]ircuit.*/,
      /.*[Mm]etrics.*/,
      /.*[Cc]onnect.*/,
      /.*[Cc]ache.*/,
      /.*[Gg]uard.*/,
      /.*[Ww]rapper.*/
    ];

    return wrapperPatterns.some(pattern => 
      pattern.test(fileName) || pattern.test(content)
    ) || content.includes('WRAPPER') || fileName.includes('wrapper');
  }

  isLivingLayer(fileName, content) {
    const livingPatterns = [
      /.*[Ll][Ll][Mm].*/,
      /.*[Dd]iagnostic.*/,
      /.*[Ee]volution.*/,
      /.*[Cc]onversation.*/,
      /.*[Ll]iving.*/
    ];

    return livingPatterns.some(pattern => 
      pattern.test(fileName) || pattern.test(content)
    ) || content.includes('LIVING_LAYER') || fileName.includes('living');
  }

  isDocumentation(fileName) {
    const docFiles = ['README.md', 'LICENSE', 'CONTRIBUTING.md', 'SECURITY.md'];
    return docFiles.some(doc => fileName === doc) || fileName.endsWith('.md');
  }

  calculateScore() {
    const weights = {
      core: 40,        // Core is essential
      wrappers: 30,    // Wrappers are important
      living_layer: 20, // Living layer is advanced
      documentation: 10 // Documentation is basic
    };

    let totalScore = 0;

    // Core scoring
    if (this.findings.core.length > 0) {
      totalScore += Math.min(weights.core, this.findings.core.length * 15);
    }

    // Wrappers scoring
    if (this.findings.wrappers.length > 0) {
      totalScore += Math.min(weights.wrappers, this.findings.wrappers.length * 10);
    }

    // Living layer scoring
    if (this.findings.living_layer.length > 0) {
      totalScore += Math.min(weights.living_layer, this.findings.living_layer.length * 10);
    }

    // Documentation scoring
    if (this.findings.documentation.length > 0) {
      totalScore += Math.min(weights.documentation, this.findings.documentation.length * 5);
    }

    this.score = Math.min(100, totalScore);
  }

  generateReport() {
    console.log('\n📋 BRIK Structure Validation Report');
    console.log('=====================================');
    console.log(`📊 Overall Score: ${this.score}/100`);
    console.log(`🏗️ Core Components: ${this.findings.core.length} found`);
    console.log(`🔧 Wrapper Components: ${this.findings.wrappers.length} found`);
    console.log(`🧠 Living Layer Components: ${this.findings.living_layer.length} found`);
    console.log(`📚 Documentation Files: ${this.findings.documentation.length} found`);
    
    if (this.score >= 85) {
      console.log('✅ BRIK Structure Validation: PASSED');
    } else if (this.score >= 70) {
      console.log('⚠️ BRIK Structure Validation: PARTIAL');
    } else {
      console.log('❌ BRIK Structure Validation: FAILED');
    }

    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      score: this.score,
      status: this.score >= 85 ? 'PASSED' : this.score >= 70 ? 'PARTIAL' : 'FAILED',
      findings: this.findings
    };

    fs.writeFileSync('brik-structure-report.json', JSON.stringify(report, null, 2));
    console.log('📄 Report saved to: brik-structure-report.json');
  }

  async getAllProjectFiles() {
    const files = [];
    const walkDir = async (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        if (item.startsWith('.') || item === 'node_modules' || item === 'target') continue;
        
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          await walkDir(fullPath);
        } else if (item.endsWith('.js') || item.endsWith('.ts') || 
                   item.endsWith('.py') || item.endsWith('.rs') || 
                   item.endsWith('.md') || item.endsWith('.toml') ||
                   item.endsWith('.json') || item.endsWith('.sh')) {
          files.push(fullPath);
        }
      }
    };

    await walkDir(this.projectRoot);
    return files;
  }

  async readFileContent(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      return '';
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  (async () => {
    const validator = new BrikStructureValidator();
    const result = await validator.validate();
    process.exit(result.success && result.score >= 70 ? 0 : 1);
  })();
}

module.exports = BrikStructureValidator;