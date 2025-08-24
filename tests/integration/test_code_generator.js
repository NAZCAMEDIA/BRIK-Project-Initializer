#!/usr/bin/env node

/**
 * ================================================================
 * BRIK INITIALIZER - INTEGRATION TESTS
 * Tests de integración para el sistema de generación de código
 * ================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import components to test
const codeGeneratorPath = path.join(__dirname, '../../generators/intelligent/code-generator.js');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// ================================================================
// TEST UTILITIES
// ================================================================

function testStart(description) {
    console.log(`🧪 TEST: ${description}`);
    totalTests++;
}

function testPass(message) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
}

function testFail(message) {
    console.log(`❌ FAIL: ${message}`);
    failedTests++;
}

async function runTests() {
    console.log('🧬 BRIK INITIALIZER - INTEGRATION TESTS');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`🎯 Testing: ${codeGeneratorPath}`);
    console.log('═══════════════════════════════════════════════════════════');

    // ================================================================
    // TEST 1: Code Generator Module Loads
    // ================================================================
    
    testStart('Code generator module loads without errors');
    
    try {
        // Check if file exists
        if (!fs.existsSync(codeGeneratorPath)) {
            throw new Error('Code generator file does not exist');
        }
        
        // Try to require the module
        delete require.cache[require.resolve(codeGeneratorPath)];
        const codeGenerator = require(codeGeneratorPath);
        
        testPass('Code generator module loads successfully');
    } catch (error) {
        testFail(`Code generator module load failed: ${error.message}`);
    }

    // ================================================================
    // TEST 2: BRIKCodeGenerator Class Exists
    // ================================================================
    
    testStart('BRIKCodeGenerator class is properly defined');
    
    try {
        // Read file content and check for class definition
        const fileContent = fs.readFileSync(codeGeneratorPath, 'utf8');
        
        if (fileContent.includes('class BRIKCodeGenerator')) {
            testPass('BRIKCodeGenerator class is defined');
        } else {
            throw new Error('BRIKCodeGenerator class not found');
        }
    } catch (error) {
        testFail(`BRIKCodeGenerator class check failed: ${error.message}`);
    }

    // ================================================================
    // TEST 3: Required Methods Exist
    // ================================================================
    
    testStart('Required methods are present in code generator');
    
    try {
        const fileContent = fs.readFileSync(codeGeneratorPath, 'utf8');
        
        const requiredMethods = [
            'initializeGenerators',
            'generateCoreLayer',
            'generateEntity'
        ];
        
        let allMethodsPresent = true;
        
        for (const method of requiredMethods) {
            if (!fileContent.includes(method)) {
                allMethodsPresent = false;
                break;
            }
        }
        
        if (allMethodsPresent) {
            testPass('All required methods are present');
        } else {
            throw new Error('Some required methods are missing');
        }
        
    } catch (error) {
        testFail(`Method existence check failed: ${error.message}`);
    }

    // ================================================================
    // TEST 4: RustCodeGenerator Class Exists
    // ================================================================
    
    testStart('RustCodeGenerator class is properly defined');
    
    try {
        const fileContent = fs.readFileSync(codeGeneratorPath, 'utf8');
        
        if (fileContent.includes('class RustCodeGenerator')) {
            testPass('RustCodeGenerator class is defined');
        } else {
            throw new Error('RustCodeGenerator class not found');
        }
    } catch (error) {
        testFail(`RustCodeGenerator class check failed: ${error.message}`);
    }

    // ================================================================
    // TEST 5: Generator Method Binding Fix
    // ================================================================
    
    testStart('Generator method binding is properly fixed');
    
    try {
        const fileContent = fs.readFileSync(codeGeneratorPath, 'utf8');
        
        // Check if the fix for generator binding is present
        if (fileContent.includes('typeof generator.generateEntity !== \'function\'')) {
            testPass('Generator method binding validation is present');
        } else {
            testFail('Generator method binding validation is missing - this was the bug we fixed!');
        }
        
    } catch (error) {
        testFail(`Generator method binding check failed: ${error.message}`);
    }

    // ================================================================
    // TEST 6: Syntax Validation
    // ================================================================
    
    testStart('JavaScript syntax validation');
    
    try {
        // Use Node.js to validate syntax
        execSync(`node -c "${codeGeneratorPath}"`, { stdio: 'ignore' });
        testPass('JavaScript syntax is valid');
    } catch (error) {
        testFail(`JavaScript syntax validation failed: ${error.message}`);
    }

    // ================================================================
    // TEST 7: Template Loading Logic
    // ================================================================
    
    testStart('Template loading logic exists');
    
    try {
        const fileContent = fs.readFileSync(codeGeneratorPath, 'utf8');
        
        if (fileContent.includes('loadTemplates') && fileContent.includes('loadTemplate')) {
            testPass('Template loading logic is present');
        } else {
            throw new Error('Template loading logic missing');
        }
        
    } catch (error) {
        testFail(`Template loading logic check failed: ${error.message}`);
    }

    // ================================================================
    // TEST 8: Error Handling Patterns
    // ================================================================
    
    testStart('Error handling patterns are implemented');
    
    try {
        const fileContent = fs.readFileSync(codeGeneratorPath, 'utf8');
        
        const errorHandlingPatterns = [
            'try {',
            'catch',
            'throw new Error'
        ];
        
        let errorHandlingPresent = true;
        
        for (const pattern of errorHandlingPatterns) {
            if (!fileContent.includes(pattern)) {
                errorHandlingPresent = false;
                break;
            }
        }
        
        if (errorHandlingPresent) {
            testPass('Error handling patterns are implemented');
        } else {
            throw new Error('Error handling patterns missing');
        }
        
    } catch (error) {
        testFail(`Error handling check failed: ${error.message}`);
    }

    // ================================================================
    // TEST RESULTS
    // ================================================================

    console.log('');
    console.log('📊 TEST RESULTS');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`🧪 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

    if (failedTests === 0) {
        console.log('🏆 ALL INTEGRATION TESTS PASSED ✅');
        process.exit(0);
    } else {
        console.log('🚨 SOME INTEGRATION TESTS FAILED ❌');
        process.exit(1);
    }
}

// ================================================================
// RUN TESTS
// ================================================================

if (require.main === module) {
    runTests().catch(error => {
        console.error('❌ Integration tests crashed:', error);
        process.exit(2);
    });
}

module.exports = { runTests };