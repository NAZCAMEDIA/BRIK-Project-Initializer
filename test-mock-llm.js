#!/usr/bin/env node
/**
 * 🧪 BRIK Mock LLM Testing Suite
 * 
 * Suite de testing completa para validar la refactorización del Mock LLM
 * ECO-Sigma: Verificación de funcionalidad crítica
 */

const { MockLLM, DomainParser, ProjectTemplates } = require('./generators/intelligent/mock-llm.js');

class MockLLMTester {
    static runAllTests() {
        console.log('🧪 BRIK Mock LLM - Testing Suite');
        console.log('=====================================\n');
        
        let passedTests = 0;
        let totalTests = 0;
        
        // TEST SUITE 1: Domain Parser
        console.log('🧠 TESTING: Domain Parser');
        totalTests += this.testDomainParser();
        passedTests += this.getPassedCount();
        
        console.log('\n📝 TESTING: Project Templates');
        totalTests += this.testProjectTemplates();
        passedTests += this.getPassedCount();
        
        console.log('\n🤖 TESTING: Dynamic Mock LLM Response');
        totalTests += this.testDynamicResponse();
        passedTests += this.getPassedCount();
        
        console.log('\n📊 TESTING: Success Criteria Validation');
        totalTests += this.testSuccessCriteria();
        passedTests += this.getPassedCount();
        
        // Resultados finales
        console.log('\n🎯 RESULTADOS FINALES:');
        console.log(`✅ Tests Pasados: ${this.passedCount}/${totalTests}`);
        console.log(`📊 Success Rate: ${((this.passedCount/totalTests) * 100).toFixed(1)}%`);
        
        if (this.passedCount === totalTests) {
            console.log('🚀 SISTEMA REFACTORIZADO: COMPLETAMENTE FUNCIONAL');
        } else {
            console.log('❌ REQUIERE ATENCIÓN: Algunos tests fallaron');
        }
        
        return this.passedCount === totalTests;
    }
    
    static testDomainParser() {
        console.log('  🔍 Test 1: TODO Detection');
        const todoResult = DomainParser.parseDescription("API simple de to-do list con tareas que se pueden crear, marcar como completadas y eliminar");
        this.assert(todoResult.domain === 'todo', `Expected 'todo', got '${todoResult.domain}'`);
        this.assert(todoResult.entities.includes('Tareas'), `Expected 'Tareas' in entities: ${JSON.stringify(todoResult.entities)}`);
        this.assert(todoResult.operations.includes('create'), `Expected 'create' in operations: ${JSON.stringify(todoResult.operations)}`);
        this.assert(todoResult.operations.includes('update'), `Expected 'update' in operations: ${JSON.stringify(todoResult.operations)}`);
        this.assert(todoResult.operations.includes('delete'), `Expected 'delete' in operations: ${JSON.stringify(todoResult.operations)}`);
        
        console.log('  📝 Test 2: Blog Detection');
        const blogResult = DomainParser.parseDescription("blog con posts y comentarios para usuarios");
        this.assert(blogResult.domain === 'blog', `Expected 'blog', got '${blogResult.domain}'`);
        this.assert(blogResult.entities.some(e => e.toLowerCase().includes('post')), `Expected post entity in: ${JSON.stringify(blogResult.entities)}`);
        
        console.log('  🛒 Test 3: E-commerce Detection');
        const ecommerceResult = DomainParser.parseDescription("tienda online con productos, órdenes y pagos");
        this.assert(ecommerceResult.domain === 'ecommerce', `Expected 'ecommerce', got '${ecommerceResult.domain}'`);
        
        console.log('  🔧 Test 4: Generic API Detection');
        const genericResult = DomainParser.parseDescription("API para gestionar clientes y proyectos");
        this.assert(genericResult.entities.length > 0, `Expected entities detected, got: ${JSON.stringify(genericResult.entities)}`);
        
        return 4;
    }
    
    static testProjectTemplates() {
        console.log('  📋 Test 1: TODO Template Generation');
        const todoTemplate = ProjectTemplates.getTodoTemplate(['Task'], ['create', 'read', 'update', 'delete'], ['postgresql']);
        this.assert(todoTemplate.domain.entities[0].name === 'Task', 'Expected Task entity');
        this.assert(todoTemplate.domain.useCases.length >= 4, `Expected at least 4 use cases, got ${todoTemplate.domain.useCases.length}`);
        
        console.log('  📖 Test 2: Blog Template Generation');
        const blogTemplate = ProjectTemplates.getBlogTemplate(['Post', 'Comment'], ['create', 'read'], ['postgresql']);
        this.assert(blogTemplate.domain.entities.length >= 2, `Expected at least 2 entities, got ${blogTemplate.domain.entities.length}`);
        this.assert(blogTemplate.domain.entities.some(e => e.name === 'Post'), 'Expected Post entity');
        
        console.log('  🔧 Test 3: Generic Template Generation');
        const genericTemplate = ProjectTemplates.getGenericTemplate(['Customer', 'Project'], ['create', 'read'], ['sqlite'], 'cliente API');
        this.assert(genericTemplate.domain.entities.length === 2, `Expected 2 entities, got ${genericTemplate.domain.entities.length}`);
        this.assert(genericTemplate.domain.entities[0].name === 'Customer', 'Expected Customer entity');
        
        return 3;
    }
    
    static testDynamicResponse() {
        console.log('  🤖 Test 1: TODO Dynamic Response');
        const todoResponse = MockLLM.getDomainAnalysisResponse("API simple de to-do list con tareas", "postgresql");
        const todoData = JSON.parse(todoResponse);
        this.assert(todoData.description === "API simple de to-do list con tareas", 'Description should be preserved exactly');
        this.assert(todoData.domain.entities.some(e => e.name === 'Task'), 'Should generate Task entity for TODO');
        
        console.log('  📝 Test 2: Blog Dynamic Response');
        const blogResponse = MockLLM.getDomainAnalysisResponse("blog con posts y comentarios", "postgresql,redis");
        const blogData = JSON.parse(blogResponse);
        this.assert(blogData.description === "blog con posts y comentarios", 'Description should be preserved exactly');
        this.assert(blogData.domain.entities.some(e => e.name === 'Post'), 'Should generate Post entity for blog');
        
        console.log('  🛒 Test 3: E-commerce Fallback');
        const ecommerceResponse = MockLLM.getDomainAnalysisResponse("tienda online productos", "postgresql,stripe");
        const ecommerceData = JSON.parse(ecommerceResponse);
        this.assert(ecommerceData.domain.entities.some(e => e.name === 'Product'), 'Should generate Product entity for e-commerce');
        
        console.log('  ⚠️  Test 4: Error Handling');
        const errorResponse = MockLLM.getDomainAnalysisResponse(null, null);
        const errorData = JSON.parse(errorResponse);
        this.assert(errorData.domain.entities.length > 0, 'Should fallback gracefully with valid entities');
        
        return 4;
    }
    
    static testSuccessCriteria() {
        console.log('  ✅ Criterion 1: TODO API generates Task entity');
        const todoResponse = MockLLM.getDomainAnalysisResponse("to-do API", "postgresql");
        const todoData = JSON.parse(todoResponse);
        this.assert(todoData.domain.entities.some(e => e.name === 'Task'), 'CRITICAL: Todo API must generate Task entity');
        
        console.log('  ✅ Criterion 2: Blog API generates Post entity');
        const blogResponse = MockLLM.getDomainAnalysisResponse("blog posts API", "postgresql");
        const blogData = JSON.parse(blogResponse);
        this.assert(blogData.domain.entities.some(e => e.name === 'Post'), 'CRITICAL: Blog API must generate Post entity');
        
        console.log('  ✅ Criterion 3: Metadata consistency');
        const metadataResponse = MockLLM.getDomainAnalysisResponse("test description", "sqlite");
        const metadataData = JSON.parse(metadataResponse);
        this.assert(metadataData.description === "test description", 'CRITICAL: originalDescription must match input');
        
        console.log('  ✅ Criterion 4: Integration mapping');
        const integrationResponse = MockLLM.getDomainAnalysisResponse("simple API", "redis,stripe");
        const integrationData = JSON.parse(integrationResponse);
        this.assert(integrationData.domain.integrations.some(i => i.name === 'Redis'), 'Should map Redis integration');
        this.assert(integrationData.domain.integrations.some(i => i.name === 'Stripe'), 'Should map Stripe integration');
        
        return 4;
    }
    
    static assert(condition, message) {
        if (condition) {
            console.log(`    ✅ ${message}`);
            this.passedCount = (this.passedCount || 0) + 1;
        } else {
            console.log(`    ❌ FAILED: ${message}`);
        }
    }
    
    static getPassedCount() {
        const current = this.passedCount || 0;
        return current;
    }
}

// Ejecutar tests
if (require.main === module) {
    MockLLMTester.passedCount = 0;
    const success = MockLLMTester.runAllTests();
    process.exit(success ? 0 : 1);
}

module.exports = { MockLLMTester };