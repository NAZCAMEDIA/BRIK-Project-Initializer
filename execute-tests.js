#!/usr/bin/env node
/**
 * 🧪 BRIK Test Executor - Validación Crítica del Sistema Refactorizado
 */

const { exec } = require('child_process');
const path = require('path');

console.log('🧪 BRIK MOCK LLM - TESTING SUITE EXECUTION');
console.log('==========================================\n');

const basePath = '/Users/nazcamedia/Documents/GitHub/BRIK-Project-Initializer';

function runTest(description, command) {
    return new Promise((resolve) => {
        console.log(`📋 ${description}`);
        console.log('----'.repeat(description.length / 4));
        
        exec(command, { cwd: basePath }, (error, stdout, stderr) => {
            if (error) {
                console.log(`❌ Error: ${error.message}`);
                resolve(false);
                return;
            }
            if (stderr) {
                console.log(`⚠️  Warning: ${stderr}`);
            }
            console.log(stdout);
            console.log('');
            resolve(true);
        });
    });
}

async function runAllTests() {
    console.log('🎯 VALIDANDO REFACTORIZACIÓN CRÍTICA DEL MOCK LLM\n');
    
    let results = [];
    
    // Test 1: Parser directo
    results.push(await runTest(
        'Test 1: Domain Parser Direct Test',
        'node generators/intelligent/mock-llm.js test-parser "API simple de to-do list con tareas que se pueden crear, marcar como completadas y eliminar"'
    ));
    
    // Test 2: Response TODO
    results.push(await runTest(
        'Test 2: Mock LLM TODO Response',
        'node generators/intelligent/mock-llm.js domain-analysis "API simple de to-do list con tareas" "postgresql"'
    ));
    
    // Test 3: Response Blog
    results.push(await runTest(
        'Test 3: Mock LLM Blog Response', 
        'node generators/intelligent/mock-llm.js domain-analysis "blog con posts y comentarios" "postgresql,redis"'
    ));
    
    // Test 4: Response E-commerce
    results.push(await runTest(
        'Test 4: Mock LLM E-commerce Response',
        'node generators/intelligent/mock-llm.js domain-analysis "tienda online con productos y órdenes" "postgresql,stripe"'
    ));
    
    // Test 5: Suite completa
    results.push(await runTest(
        'Test 5: Full Test Suite',
        'node test-mock-llm.js'
    ));
    
    // Análisis de resultados
    const passedTests = results.filter(r => r).length;
    const totalTests = results.length;
    
    console.log('🎯 RESULTADOS FINALES:');
    console.log('====================');
    console.log(`✅ Tests Pasados: ${passedTests}/${totalTests}`);
    console.log(`📊 Success Rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);
    
    if (passedTests === totalTests) {
        console.log('🚀 REFACTORIZACIÓN CRÍTICA: COMPLETAMENTE EXITOSA');
        console.log('💡 Mock LLM ahora genera proyectos dinámicamente según descripción real');
    } else {
        console.log('❌ REQUIERE ATENCIÓN: Algunos tests fallaron');
    }
    
    return passedTests === totalTests;
}

// Ejecutar tests
if (require.main === module) {
    runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    });
}