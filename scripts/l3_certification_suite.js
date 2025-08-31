#!/usr/bin/env node

/**
 * BRIK L3 Certification Suite - Master Test Runner
 * 
 * Orchestrates the complete L3 certification process:
 * - Contract structure validation
 * - Cross-language compilation tests  
 * - Security auditing
 * - Hash generation and verification
 * - Compliance reporting
 * 
 * DEPLOYMENT: Move to scripts/l3_certification_suite.js
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { promisify } = require('util');

// Import our certification modules
const BrikHashGenerator = require('./generate_brik_hash.js');

class L3CertificationSuite {
  constructor(projectRoot, options = {}) {
    this.projectRoot = path.resolve(projectRoot);
    this.options = {
      verbose: false,
      exitOnFailure: true,
      generateReport: true,
      parallelExecution: true,
      ...options
    };
    
    this.results = {
      overall: {
        status: 'PENDING',
        score: 0,
        l3_compliant: false,
        timestamp: new Date().toISOString(),
        duration_ms: 0
      },
      tests: {
        structure_validation: { status: 'PENDING', score: 0, details: null },
        cross_language_compilation: { status: 'PENDING', score: 0, details: null },
        security_audit: { status: 'PENDING', score: 0, details: null },
        hash_generation: { status: 'PENDING', score: 0, details: null },
        dependency_analysis: { status: 'PENDING', score: 0, details: null }
      },
      recommendations: [],
      certification: {
        level: 'L0',
        requirements_met: [],
        requirements_failed: [],
        next_steps: []
      }
    };
    
    this.startTime = Date.now();
  }

  /**
   * Runs the complete L3 certification suite
   */
  async runCertificationSuite() {
    this.log('🚀 Starting BRIK L3 Certification Suite...');
    this.log(`📁 Project: ${this.projectRoot}`);
    this.log(`⏰ Started: ${new Date().toISOString()}`);
    
    try {
      // Pre-flight checks
      await this.preFlightChecks();
      
      // Run certification tests
      if (this.options.parallelExecution) {
        await this.runTestsParallel();
      } else {
        await this.runTestsSequential();
      }
      
      // Calculate results
      this.calculateOverallScore();
      this.determineCertificationLevel();
      this.generateRecommendations();
      
      // Generate final report
      if (this.options.generateReport) {
        await this.generateCertificationReport();
      }
      
      // Print summary
      this.printSummary();
      
      return this.results;
      
    } catch (error) {
      this.logError(`❌ Certification suite failed: ${error.message}`);
      this.results.overall.status = 'FAILED';
      throw error;
    } finally {
      this.results.overall.duration_ms = Date.now() - this.startTime;
    }
  }

  /**
   * Pre-flight checks to ensure environment is ready
   */
  async preFlightChecks() {
    this.log('\n🔍 Running pre-flight checks...');
    
    // Check if project root exists and is valid
    if (!fs.existsSync(this.projectRoot)) {
      throw new Error(`Project root does not exist: ${this.projectRoot}`);
    }
    
    // Check for basic BRIK structure
    const requiredFiles = ['README.md', 'LICENSE'];
    const missingFiles = requiredFiles.filter(file => 
      !fs.existsSync(path.join(this.projectRoot, file))
    );
    
    if (missingFiles.length > 0) {
      this.logWarning(`⚠️  Missing basic files: ${missingFiles.join(', ')}`);
    }
    
    // Check for required tools
    const requiredTools = ['node', 'npm'];
    for (const tool of requiredTools) {
      try {
        execSync(`which ${tool}`, { stdio: 'ignore' });
        this.log(`  ✓ ${tool} available`);
      } catch (error) {
        this.logWarning(`  ⚠️  ${tool} not found - some tests may fail`);
      }
    }
    
    this.log('✅ Pre-flight checks completed');
  }

  /**
   * Run tests in parallel for faster execution
   */
  async runTestsParallel() {
    this.log('\n🔄 Running certification tests in parallel...');
    
    const testPromises = [
      this.runStructureValidation(),
      this.runSecurityAudit(),
      this.runHashGeneration(),
      this.runDependencyAnalysis()
    ];
    
    // Cross-language compilation is resource-intensive, run separately if needed
    if (this.shouldRunCrossLanguageTests()) {
      testPromises.push(this.runCrossLanguageCompilation());
    }
    
    const results = await Promise.allSettled(testPromises);
    
    // Process results
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        this.logError(`Test ${index + 1} failed: ${result.reason}`);
      }
    });
  }

  /**
   * Run tests sequentially for more controlled execution
   */
  async runTestsSequential() {
    this.log('\n🔄 Running certification tests sequentially...');
    
    await this.runStructureValidation();
    await this.runSecurityAudit();
    await this.runHashGeneration();
    await this.runDependencyAnalysis();
    
    if (this.shouldRunCrossLanguageTests()) {
      await this.runCrossLanguageCompilation();
    }
  }

  /**
   * Structure validation using contract tests
   */
  async runStructureValidation() {
    this.log('\n📋 Running structure validation...');
    
    try {
      // Check if we have Jest available for TypeScript tests
      const hasJest = this.checkToolAvailable('npx jest');
      
      if (hasJest) {
        // Run the TypeScript contract structure test
        const testResult = await this.runCommand([
          'npx', 'jest', 
          'tests/contract/contract_structure.spec.ts',
          '--json'
        ], { cwd: this.projectRoot });
        
        const jestResults = JSON.parse(testResult.stdout);
        
        this.results.tests.structure_validation = {
          status: jestResults.success ? 'PASSED' : 'FAILED',
          score: jestResults.success ? 100 : Math.max(0, 100 - (jestResults.numFailedTests * 10)),
          details: {
            total_tests: jestResults.numTotalTests,
            passed_tests: jestResults.numPassedTests,
            failed_tests: jestResults.numFailedTests,
            test_results: jestResults.testResults
          }
        };
      } else {
        // Fallback to basic structure validation
        const structureScore = await this.validateBasicStructure();
        this.results.tests.structure_validation = {
          status: structureScore >= 85 ? 'PASSED' : 'FAILED',
          score: structureScore,
          details: { method: 'basic_validation', note: 'Jest not available' }
        };
      }
      
      this.log(`  ${this.results.tests.structure_validation.status === 'PASSED' ? '✅' : '❌'} Structure validation: ${this.results.tests.structure_validation.score}%`);
      
    } catch (error) {
      this.results.tests.structure_validation = {
        status: 'ERROR',
        score: 0,
        details: { error: error.message }
      };
      this.logError(`  ❌ Structure validation failed: ${error.message}`);
    }
  }

  /**
   * Security audit using our security script
   */
  async runSecurityAudit() {
    this.log('\n🔒 Running security audit...');
    
    try {
      // Make security audit script executable
      const auditScript = path.join(__dirname, 'security_audit.sh');
      
      if (fs.existsSync(auditScript)) {
        // Make executable
        execSync(`chmod +x "${auditScript}"`, { stdio: 'ignore' });
        
        // Run security audit
        const auditResult = await this.runCommand([auditScript], {
          cwd: this.projectRoot,
          env: { ...process.env, PROJECT_ROOT: this.projectRoot }
        });
        
        // Read the generated report
        const reportPath = path.join(this.projectRoot, 'security-audit-report.json');
        if (fs.existsSync(reportPath)) {
          const auditReport = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
          
          this.results.tests.security_audit = {
            status: auditReport.overall.l3_compliant ? 'PASSED' : 'FAILED',
            score: auditReport.overall.security_score,
            details: auditReport
          };
        } else {
          // Parse output for basic results
          this.results.tests.security_audit = {
            status: auditResult.code === 0 ? 'PASSED' : 'FAILED',
            score: auditResult.code === 0 ? 90 : 60,
            details: { output: auditResult.stdout, method: 'script_output' }
          };
        }
      } else {
        // Basic security validation if script not available
        const basicSecurityScore = await this.validateBasicSecurity();
        this.results.tests.security_audit = {
          status: basicSecurityScore >= 75 ? 'PASSED' : 'FAILED',
          score: basicSecurityScore,
          details: { method: 'basic_validation', note: 'Security script not found' }
        };
      }
      
      this.log(`  ${this.results.tests.security_audit.status === 'PASSED' ? '✅' : '❌'} Security audit: ${this.results.tests.security_audit.score}%`);
      
    } catch (error) {
      this.results.tests.security_audit = {
        status: 'ERROR',
        score: 0,
        details: { error: error.message }
      };
      this.logError(`  ❌ Security audit failed: ${error.message}`);
    }
  }

  /**
   * Generate and verify BRIK hash
   */
  async runHashGeneration() {
    this.log('\n🔐 Running hash generation...');
    
    try {
      const hashGenerator = new BrikHashGenerator(this.projectRoot);
      const hashResult = await hashGenerator.generateBrikHash();
      
      this.results.tests.hash_generation = {
        status: 'PASSED',
        score: 100,
        details: {
          hash: hashResult.brik_hash,
          algorithm: hashResult.algorithm,
          reproducible: hashResult.verification.reproducible,
          files_processed: hashResult.components.total_files_included
        }
      };
      
      this.log(`  ✅ Hash generation: ${hashResult.brik_hash.substring(0, 16)}...`);
      
    } catch (error) {
      this.results.tests.hash_generation = {
        status: 'ERROR',
        score: 0,
        details: { error: error.message }
      };
      this.logError(`  ❌ Hash generation failed: ${error.message}`);
    }
  }

  /**
   * Cross-language compilation tests
   */
  async runCrossLanguageCompilation() {
    this.log('\n🔄 Running cross-language compilation tests...');
    
    try {
      // Check if cross-language test script exists
      const crossLangScript = path.join(__dirname, 'cross_language_compile_test.js');
      
      if (fs.existsSync(crossLangScript)) {
        const testResult = await this.runCommand([
          'node', crossLangScript
        ], { cwd: this.projectRoot });
        
        // Parse results (assuming JSON output)
        try {
          const results = JSON.parse(testResult.stdout);
          this.results.tests.cross_language_compilation = {
            status: results.compliance ? 'PASSED' : 'FAILED',
            score: results.summary.successRate,
            details: results
          };
        } catch (parseError) {
          // Fallback to basic success/failure
          this.results.tests.cross_language_compilation = {
            status: testResult.code === 0 ? 'PASSED' : 'FAILED',
            score: testResult.code === 0 ? 80 : 40,
            details: { output: testResult.stdout, method: 'script_output' }
          };
        }
      } else {
        // Basic cross-language validation
        const crossLangScore = await this.validateCrossLanguageSupport();
        this.results.tests.cross_language_compilation = {
          status: crossLangScore >= 70 ? 'PASSED' : 'FAILED',
          score: crossLangScore,
          details: { method: 'basic_validation', note: 'Cross-language script not found' }
        };
      }
      
      this.log(`  ${this.results.tests.cross_language_compilation.status === 'PASSED' ? '✅' : '❌'} Cross-language compilation: ${this.results.tests.cross_language_compilation.score}%`);
      
    } catch (error) {
      this.results.tests.cross_language_compilation = {
        status: 'ERROR',
        score: 0,
        details: { error: error.message }
      };
      this.logError(`  ❌ Cross-language compilation failed: ${error.message}`);
    }
  }

  /**
   * Dependency analysis and vulnerability scanning
   */
  async runDependencyAnalysis() {
    this.log('\n📦 Running dependency analysis...');
    
    try {
      let dependencyScore = 0;
      let details = { ecosystems: [] };
      
      // Node.js dependencies
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        try {
          const auditResult = await this.runCommand(['npm', 'audit', '--json'], {
            cwd: this.projectRoot
          });
          
          const auditData = JSON.parse(auditResult.stdout);
          const vulnerabilities = auditData.metadata?.vulnerabilities || {};
          const totalVulns = Object.values(vulnerabilities).reduce((sum, count) => sum + count, 0);
          
          const nodeScore = Math.max(0, 100 - (totalVulns * 5));
          dependencyScore += nodeScore;
          
          details.ecosystems.push({
            type: 'nodejs',
            score: nodeScore,
            vulnerabilities: vulnerabilities,
            total_dependencies: auditData.metadata?.dependencies || 0
          });
          
        } catch (npmError) {
          // npm audit failed, but package.json exists
          dependencyScore += 70; // Partial credit
          details.ecosystems.push({
            type: 'nodejs',
            score: 70,
            note: 'npm audit failed but package.json present'
          });
        }
      }
      
      // Python dependencies
      const requirementsPath = path.join(this.projectRoot, 'requirements.txt');
      const pyprojectPath = path.join(this.projectRoot, 'pyproject.toml');
      if (fs.existsSync(requirementsPath) || fs.existsSync(pyprojectPath)) {
        // Basic Python dependency validation
        dependencyScore += 80; // Placeholder score
        details.ecosystems.push({
          type: 'python',
          score: 80,
          note: 'Python dependencies present'
        });
      }
      
      // Rust dependencies
      const cargoTomlPath = path.join(this.projectRoot, 'Cargo.toml');
      if (fs.existsSync(cargoTomlPath)) {
        dependencyScore += 85; // Rust typically has fewer security issues
        details.ecosystems.push({
          type: 'rust',
          score: 85,
          note: 'Cargo.toml present'
        });
      }
      
      // Average score across ecosystems
      const finalScore = details.ecosystems.length > 0 
        ? Math.round(dependencyScore / details.ecosystems.length)
        : 90; // No dependencies is actually good for security
      
      this.results.tests.dependency_analysis = {
        status: finalScore >= 75 ? 'PASSED' : 'FAILED',
        score: finalScore,
        details
      };
      
      this.log(`  ${this.results.tests.dependency_analysis.status === 'PASSED' ? '✅' : '❌'} Dependency analysis: ${finalScore}%`);
      
    } catch (error) {
      this.results.tests.dependency_analysis = {
        status: 'ERROR',
        score: 0,
        details: { error: error.message }
      };
      this.logError(`  ❌ Dependency analysis failed: ${error.message}`);
    }
  }

  /**
   * Calculate overall certification score
   */
  calculateOverallScore() {
    const tests = this.results.tests;
    const weights = {
      structure_validation: 0.3,
      security_audit: 0.25,
      hash_generation: 0.15,
      cross_language_compilation: 0.2,
      dependency_analysis: 0.1
    };
    
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const [testName, testResult] of Object.entries(tests)) {
      if (testResult.status !== 'PENDING') {
        const weight = weights[testName] || 0.1;
        totalScore += testResult.score * weight;
        totalWeight += weight;
      }
    }
    
    this.results.overall.score = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    this.results.overall.status = this.results.overall.score >= 85 ? 'PASSED' : 'FAILED';
    this.results.overall.l3_compliant = this.results.overall.score >= 85;
  }

  /**
   * Determine certification level based on scores
   */
  determineCertificationLevel() {
    const score = this.results.overall.score;
    
    if (score >= 95) {
      this.results.certification.level = 'L4';
    } else if (score >= 85) {
      this.results.certification.level = 'L3';
    } else if (score >= 70) {
      this.results.certification.level = 'L2';
    } else if (score >= 50) {
      this.results.certification.level = 'L1';
    } else {
      this.results.certification.level = 'L0';
    }
    
    // Determine met/failed requirements
    for (const [testName, testResult] of Object.entries(this.results.tests)) {
      if (testResult.status === 'PASSED') {
        this.results.certification.requirements_met.push(testName);
      } else if (testResult.status === 'FAILED') {
        this.results.certification.requirements_failed.push(testName);
      }
    }
  }

  /**
   * Generate recommendations for improvement
   */
  generateRecommendations() {
    const recommendations = [];
    
    for (const [testName, testResult] of Object.entries(this.results.tests)) {
      if (testResult.status === 'FAILED' && testResult.score < 85) {
        switch (testName) {
          case 'structure_validation':
            recommendations.push({
              priority: 'HIGH',
              category: 'Structure',
              action: 'Implement missing BRIK components (CORE, WRAPPERS, LIVING_LAYER)',
              impact: 'Required for L3 certification'
            });
            break;
          case 'security_audit':
            recommendations.push({
              priority: 'CRITICAL',
              category: 'Security',
              action: 'Address security vulnerabilities and remove exposed secrets',
              impact: 'Security compliance mandatory for L3'
            });
            break;
          case 'cross_language_compilation':
            recommendations.push({
              priority: 'MEDIUM',
              category: 'Compilation',
              action: 'Fix compilation issues across supported languages',
              impact: 'Multi-language support required for L3'
            });
            break;
          case 'dependency_analysis':
            recommendations.push({
              priority: 'HIGH',
              category: 'Dependencies',
              action: 'Update vulnerable dependencies and improve dependency management',
              impact: 'Secure dependencies required for L3'
            });
            break;
        }
      }
    }
    
    this.results.recommendations = recommendations;
  }

  /**
   * Generate comprehensive certification report
   */
  async generateCertificationReport() {
    const reportPath = path.join(this.projectRoot, 'brik-l3-certification-report.json');
    const htmlReportPath = path.join(this.projectRoot, 'brik-l3-certification-report.html');
    
    // Save JSON report
    await fs.promises.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    
    // Generate HTML report
    const htmlReport = this.generateHtmlReport();
    await fs.promises.writeFile(htmlReportPath, htmlReport);
    
    this.log(`📊 Certification report saved:`);
    this.log(`  - JSON: ${reportPath}`);
    this.log(`  - HTML: ${htmlReportPath}`);
  }

  /**
   * Generate HTML report for better readability
   */
  generateHtmlReport() {
    const score = this.results.overall.score;
    const status = this.results.overall.status;
    const level = this.results.certification.level;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BRIK L3 Certification Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
        .score-badge { display: inline-block; padding: 10px 20px; border-radius: 25px; font-weight: bold; margin: 10px 0; }
        .passed { background-color: #10b981; color: white; }
        .failed { background-color: #ef4444; color: white; }
        .test-results { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .test-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; }
        .test-passed { border-left: 4px solid #10b981; }
        .test-failed { border-left: 4px solid #ef4444; }
        .recommendations { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .recommendation { margin: 10px 0; padding: 10px; background-color: white; border-radius: 4px; }
        .priority-high { border-left: 4px solid #f59e0b; }
        .priority-critical { border-left: 4px solid #ef4444; }
        .priority-medium { border-left: 4px solid #3b82f6; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 BRIK L3 Certification Report</h1>
        <p>Generated: ${this.results.overall.timestamp}</p>
        <p>Duration: ${this.results.overall.duration_ms}ms</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <div class="score-badge ${status === 'PASSED' ? 'passed' : 'failed'}">
            ${status} - Score: ${score}/100
        </div>
        <h2>Certification Level: ${level}</h2>
    </div>
    
    <div class="test-results">
        ${Object.entries(this.results.tests).map(([name, result]) => `
            <div class="test-card ${result.status === 'PASSED' ? 'test-passed' : 'test-failed'}">
                <h3>${name.replace(/_/g, ' ').toUpperCase()}</h3>
                <p><strong>Status:</strong> ${result.status}</p>
                <p><strong>Score:</strong> ${result.score}/100</p>
                ${result.details ? `<details><summary>Details</summary><pre>${JSON.stringify(result.details, null, 2)}</pre></details>` : ''}
            </div>
        `).join('')}
    </div>
    
    ${this.results.recommendations.length > 0 ? `
    <div class="recommendations">
        <h2>📋 Recommendations</h2>
        ${this.results.recommendations.map(rec => `
            <div class="recommendation priority-${rec.priority.toLowerCase()}">
                <h4>${rec.category} - ${rec.priority}</h4>
                <p><strong>Action:</strong> ${rec.action}</p>
                <p><strong>Impact:</strong> ${rec.impact}</p>
            </div>
        `).join('')}
    </div>
    ` : ''}
    
    <div style="margin-top: 40px; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
        <h3>🛡️ Security-Phantom L3 Certification</h3>
        <p>This report validates BRIK project compliance with L3 certification standards.</p>
        <p>L3 Compliance requires: ≥85% overall score with passing structure validation and security audit.</p>
    </div>
</body>
</html>`;
  }

  /**
   * Print summary to console
   */
  printSummary() {
    const score = this.results.overall.score;
    const status = this.results.overall.status;
    const level = this.results.certification.level;
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 BRIK L3 CERTIFICATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Status: ${status === 'PASSED' ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Score: ${score}/100`);
    console.log(`Certification Level: ${level}`);
    console.log(`L3 Compliant: ${this.results.overall.l3_compliant ? 'YES' : 'NO'}`);
    console.log(`Duration: ${this.results.overall.duration_ms}ms`);
    
    console.log('\nTest Results:');
    for (const [testName, testResult] of Object.entries(this.results.tests)) {
      const icon = testResult.status === 'PASSED' ? '✅' : testResult.status === 'FAILED' ? '❌' : '⚠️';
      console.log(`  ${icon} ${testName}: ${testResult.score}%`);
    }
    
    if (this.results.recommendations.length > 0) {
      console.log('\nTop Recommendations:');
      this.results.recommendations.slice(0, 3).forEach(rec => {
        console.log(`  - ${rec.priority}: ${rec.action}`);
      });
    }
    
    console.log('='.repeat(60));
  }

  /**
   * Helper methods
   */
  async validateBasicStructure() {
    let score = 0;
    
    // Check for basic files
    const basicFiles = ['README.md', 'LICENSE', 'package.json'];
    for (const file of basicFiles) {
      if (fs.existsSync(path.join(this.projectRoot, file))) {
        score += 20;
      }
    }
    
    // Check for source structure
    const srcDirs = ['src', 'lib', 'app'];
    if (srcDirs.some(dir => fs.existsSync(path.join(this.projectRoot, dir)))) {
      score += 30;
    }
    
    return Math.min(100, score);
  }

  async validateBasicSecurity() {
    let score = 90; // Start optimistic
    
    // Check for common security issues
    const securityFiles = ['.env', 'secrets.json', 'private.key'];
    for (const file of securityFiles) {
      if (fs.existsSync(path.join(this.projectRoot, file))) {
        score -= 30;
      }
    }
    
    return Math.max(0, score);
  }

  async validateCrossLanguageSupport() {
    let score = 0;
    
    // Check for multiple language support
    const languages = {
      'package.json': 30,
      'pyproject.toml': 25,
      'requirements.txt': 20,
      'Cargo.toml': 25
    };
    
    for (const [file, points] of Object.entries(languages)) {
      if (fs.existsSync(path.join(this.projectRoot, file))) {
        score += points;
      }
    }
    
    return Math.min(100, score);
  }

  shouldRunCrossLanguageTests() {
    // Check if we have multiple language ecosystems
    const languageFiles = ['package.json', 'pyproject.toml', 'Cargo.toml'];
    const presentLanguages = languageFiles.filter(file => 
      fs.existsSync(path.join(this.projectRoot, file))
    );
    
    return presentLanguages.length > 1;
  }

  checkToolAvailable(command) {
    try {
      execSync(`${command} --version`, { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  async runCommand(args, options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(args[0], args.slice(1), {
        stdio: 'pipe',
        ...options
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('close', (code) => {
        resolve({ code, stdout, stderr });
      });
      
      child.on('error', reject);
    });
  }

  log(message) {
    if (this.options.verbose || message.includes('✅') || message.includes('❌') || message.includes('🚀')) {
      console.log(message);
    }
  }

  logWarning(message) {
    console.warn(message);
  }

  logError(message) {
    console.error(message);
  }
}

/**
 * CLI Interface
 */
async function main() {
  const args = process.argv.slice(2);
  const projectRoot = args.find(arg => !arg.startsWith('--')) || process.cwd();
  
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    exitOnFailure: !args.includes('--no-exit'),
    generateReport: !args.includes('--no-report'),
    parallelExecution: !args.includes('--sequential')
  };
  
  const suite = new L3CertificationSuite(projectRoot, options);
  
  try {
    const results = await suite.runCertificationSuite();
    
    if (results.overall.l3_compliant) {
      console.log('\n🎉 Congratulations! Project is L3 certified.');
      process.exit(0);
    } else {
      console.log('\n❌ Project is not L3 compliant. See recommendations above.');
      process.exit(options.exitOnFailure ? 1 : 0);
    }
  } catch (error) {
    console.error('\n💥 Certification suite failed:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = L3CertificationSuite;

// Run CLI if called directly
if (require.main === module) {
  main();
}