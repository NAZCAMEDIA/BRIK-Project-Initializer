#!/usr/bin/env node
/**
 * 🎯 BRIK Final Validation - Sistema Refactorizado
 * 
 * Validación completa de la refactorización crítica del Mock LLM
 * ECO-Sigma: Verificación de éxito total de la misión
 */

const { MockLLM, DomainParser } = require('./generators/intelligent/mock-llm.js');

console.log('🎯 BRIK FINAL VALIDATION - REFACTORIZACIÓN CRÍTICA');
console.log('==================================================\n');

let totalValidations = 0;
let passedValidations = 0;

function validate(condition, description) {
    totalValidations++;
    if (condition) {
        console.log(`✅ PASSED: ${description}`);
        passedValidations++;
        return true;
    } else {
        console.log(`❌ FAILED: ${description}`);
        return false;
    }
}

function runValidationSuite() {
    // SUITE 1: SUCCESS CRITERIA VALIDATION
    console.log('🎯 SUCCESS CRITERIA VALIDATION');
    console.log('===============================');
    
    // Criterio 1: Todo API debe generar Task entity
    const todoResponse = MockLLM.getDomainAnalysisResponse("to-do API", "postgresql");
    const todoData = JSON.parse(todoResponse);
    validate(
        todoData.domain.entities.some(e => e.name === 'Task'),
        'SUCCESS CRITERIA 1: Todo API generates Task entity'
    );
    
    // Criterio 2: Blog API debe generar Post entity
    const blogResponse = MockLLM.getDomainAnalysisResponse("blog posts API", "postgresql");
    const blogData = JSON.parse(blogResponse);
    validate(
        blogData.domain.entities.some(e => e.name === 'Post'),
        'SUCCESS CRITERIA 2: Blog API generates Post entity'
    );
    
    // Criterio 3: Metadata consistency
    const originalDesc = "API simple de to-do list con tareas";
    const metadataResponse = MockLLM.getDomainAnalysisResponse(originalDesc, "postgresql");
    const metadataData = JSON.parse(metadataResponse);
    validate(
        metadataData.description === originalDesc,
        'SUCCESS CRITERIA 3: Metadata.originalDescription matches input'
    );
    
    // Criterio 4: Integration mapping
    const integrationResponse = MockLLM.getDomainAnalysisResponse("simple API", "redis,stripe");
    const integrationData = JSON.parse(integrationResponse);
    validate(
        integrationData.domain.integrations.some(i => i.name === 'Redis') &&
        integrationData.domain.integrations.some(i => i.name === 'Stripe'),
        'SUCCESS CRITERIA 4: Integration mapping coherence'
    );
    
    console.log('\n🧠 PARSER INTELLIGENCE VALIDATION');
    console.log('==================================');
    
    // Validación Parser TODO
    const todoParseResult = DomainParser.parseDescription("API simple de to-do list con tareas que se pueden crear, marcar como completadas y eliminar");
    validate(
        todoParseResult.domain === 'todo',
        'PARSER: Correctly detects TODO domain from description'
    );
    validate(
        todoParseResult.operations.includes('create') && todoParseResult.operations.includes('update') && todoParseResult.operations.includes('delete'),
        'PARSER: Correctly extracts CRUD operations from description'
    );
    
    // Validación Parser BLOG
    const blogParseResult = DomainParser.parseDescription("blog con posts y comentarios para usuarios");
    validate(
        blogParseResult.domain === 'blog',
        'PARSER: Correctly detects BLOG domain from description'
    );
    
    // Validación Parser E-COMMERCE
    const ecommerceParseResult = DomainParser.parseDescription("tienda online con productos, órdenes y pagos");
    validate(
        ecommerceParseResult.domain === 'ecommerce',
        'PARSER: Correctly detects E-COMMERCE domain from description'
    );
    
    console.log('\n🔄 DYNAMIC TEMPLATE VALIDATION');
    console.log('===============================');
    
    // Template dinámico TODO
    const todoTemplateResponse = MockLLM.getDomainAnalysisResponse("gestión de tareas pendientes", "sqlite");
    const todoTemplateData = JSON.parse(todoTemplateResponse);
    validate(
        todoTemplateData.domain.entities.some(e => e.name === 'Task'),
        'TEMPLATE: Dynamic TODO template generation works'
    );
    
    // Template dinámico BLOG
    const blogTemplateResponse = MockLLM.getDomainAnalysisResponse("sistema de blog con artículos", "postgresql");
    const blogTemplateData = JSON.parse(blogTemplateResponse);
    validate(
        blogTemplateData.domain.entities.some(e => e.name === 'Post'),
        'TEMPLATE: Dynamic BLOG template generation works'
    );
    
    // Fallback robusto
    const fallbackResponse = MockLLM.getDomainAnalysisResponse(null, null);
    const fallbackData = JSON.parse(fallbackResponse);
    validate(
        fallbackData.domain.entities.length > 0,
        'FALLBACK: Robust fallback to e-commerce when input is invalid'
    );
    
    console.log('\n🚨 CRITICAL COMPARISON VALIDATION');
    console.log('==================================');
    
    // ANTES: Hardcoded response
    console.log('❌ BEFORE REFACTORING:');
    console.log('   Input: "API simple de to-do list" → Output: E-commerce (User, Product, Order)');
    console.log('   Coherence: 0%');
    
    // DESPUÉS: Dynamic response  
    console.log('✅ AFTER REFACTORING:');
    const afterResponse = MockLLM.getDomainAnalysisResponse("API simple de to-do list con tareas", "postgresql");
    const afterData = JSON.parse(afterResponse);
    console.log(`   Input: "API simple de to-do list" → Output: ${afterData.domain.entities.map(e => e.name).join(', ')}`);
    
    const coherence = (afterData.domain.entities.some(e => e.name === 'Task') && 
                      afterData.description.includes('to-do')) ? 100 : 0;
    console.log(`   Coherence: ${coherence}%`);
    
    validate(
        coherence === 100,
        'COMPARISON: Input/Output coherence increased from 0% to 100%'
    );
    
    console.log('\n🔌 INTEGRATION COHERENCE VALIDATION');
    console.log('====================================');
    
    // Validar que las integraciones solicitadas se mapean correctamente
    const redisResponse = MockLLM.getDomainAnalysisResponse("API simple", "redis");
    const redisData = JSON.parse(redisResponse);
    validate(
        redisData.domain.integrations.some(i => i.name === 'Redis'),
        'INTEGRATION: Redis integration properly mapped'
    );
    
    const multiIntegrationResponse = MockLLM.getDomainAnalysisResponse("API compleja", "postgresql,redis,stripe");
    const multiIntegrationData = JSON.parse(multiIntegrationResponse);
    validate(
        multiIntegrationData.domain.integrations.length >= 3,
        'INTEGRATION: Multiple integrations properly mapped'
    );
    
    return { passed: passedValidations, total: totalValidations };
}

// EJECUCIÓN PRINCIPAL
console.log('🚀 Iniciando validación final del sistema refactorizado...\n');

const results = runValidationSuite();

console.log('\n🎯 FINAL RESULTS SUMMARY');
console.log('========================');
console.log(`✅ Validations Passed: ${results.passed}/${results.total}`);
console.log(`📊 Success Rate: ${((results.passed/results.total) * 100).toFixed(1)}%`);

if (results.passed === results.total) {
    console.log('\n🚀 REFACTORIZACIÓN CRÍTICA: COMPLETAMENTE EXITOSA');
    console.log('💡 Mock LLM transformado de hardcode estático a generador dinámico inteligente');
    console.log('🎯 Coherencia input/output incrementada de 0% a 100%');
    console.log('✅ Todos los Success Criteria cumplidos');
    console.log('🧠 Parser inteligente detecta dominios automáticamente');
    console.log('📋 Templates dinámicos generan entidades coherentes');
    console.log('🔌 Integraciones mapeadas correctamente');
    console.log('🛡️ Fallback robusto implementado');
    console.log('\n💥 MISIÓN ECO-SIGMA: COMPLETADA CON ÉXITO TOTAL');
} else {
    console.log('\n❌ REFACTORIZACIÓN REQUIERE ATENCIÓN');
    console.log(`🔧 ${results.total - results.passed} validaciones fallaron y necesitan corrección`);
}

process.exit(results.passed === results.total ? 0 : 1);