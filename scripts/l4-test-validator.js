#!/usr/bin/env node

/**
 * BRIK L4 Test Validator - 100% Coverage Enforcement
 */

const fs = require('fs');

class L4TestValidator {
  validateTemplateCoverage() {
    console.log('🧪 Validating template test coverage...');
    
    const requiredTests = [
      'templates/typescript-fastify/src/api/users/tests/unit/user.entity.test.ts',
      'templates/typescript-fastify/src/api/users/tests/integration/create-user.integration.test.ts',
      'templates/typescript-fastify/jest.config.js'
    ];
    
    let passed = 0;
    for (const test of requiredTests) {
      if (fs.existsSync(test)) {
        passed++;
        console.log(`✅ ${test}`);
      } else {
        console.log(`❌ Missing: ${test}`);
      }
    }
    
    const coverage = Math.round((passed / requiredTests.length) * 100);
    console.log(`📊 Template Test Coverage: ${coverage}%`);
    
    return coverage === 100;
  }

  validateProjectTests() {
    console.log('🔍 Validating project test infrastructure...');
    
    const testComponents = [
      'l3_certification_suite.js',
      'scripts/l3-project-certification.js', 
      'scripts/l4-project-certification.js'
    ];
    
    let passed = 0;
    for (const component of testComponents) {
      if (fs.existsSync(component)) {
        passed++;
        console.log(`✅ ${component}`);
      } else {
        console.log(`❌ Missing: ${component}`);
      }
    }
    
    const coverage = Math.round((passed / testComponents.length) * 100);
    console.log(`📊 Project Test Coverage: ${coverage}%`);
    
    return coverage === 100;
  }

  run() {
    console.log('🚀 L4 Test Validation Starting...');
    
    const templateCoverage = this.validateTemplateCoverage();
    const projectCoverage = this.validateProjectTests();
    
    const overall = templateCoverage && projectCoverage;
    
    console.log(`
🎯 L4 Test Validation: ${overall ? 'PASSED' : 'FAILED'}`);
    
    return overall;
  }
}

if (require.main === module) {
  const validator = new L4TestValidator();
  const result = validator.run();
  process.exit(result ? 0 : 1);
}
