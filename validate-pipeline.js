#!/usr/bin/env node
/**
 * 🔍 PIPELINE VALIDATION: Test End-to-End del BRIK System
 * 
 * Valida que el flujo completo funcione correctamente:
 * 1. Domain Analysis → entidad "List"
 * 2. Architecture Classification → usa "List" (NO User/Product/Order)
 * 3. Code Generation → genera list.rs (NO user.rs/product.rs)
 */

const { DomainAnalyzer } = require('./generators/intelligent/domain-analyzer.js');
const { ArchitectureClassifier } = require('./generators/intelligent/architecture-classifier.js');
const fs = require('fs');
const path = require('path');

async function validateEndToEndPipeline() {
    console.log('🔍 VALIDACIÓN PIPELINE COMPLETO BRIK');
    console.log('='.repeat(50));
    
    const results = {
        domainAnalysis: null,
        architectureClassification: null,
        coherencyCheck: false,
        errors: []
    };
    
    try {
        // FASE 1: Domain Analysis
        console.log('\n📊 FASE 1: Domain Analysis');
        const analyzer = new DomainAnalyzer();
        process.env.OUTPUT_JSON = '1'; // Modo silencioso
        
        const domainAnalysis = await analyzer.analyze(
            "API simple de to-do list con tareas", 
            [], 
            "rust"
        );
        
        results.domainAnalysis = domainAnalysis;
        const domainEntities = domainAnalysis.domain.entities.map(e => e.name);
        console.log(`   ✓ Entidades generadas: ${domainEntities.join(', ')}`);
        
        // FASE 2: Architecture Classification 
        console.log('\n🏗️ FASE 2: Architecture Classification');
        const classifier = new ArchitectureClassifier();
        const architectureClassification = await classifier.classify(domainAnalysis);
        
        results.architectureClassification = architectureClassification;
        const coreEntities = architectureClassification.architecture.CORE.entities.map(e => e.name);
        console.log(`   ✓ Entidades CORE clasificadas: ${coreEntities.join(', ')}`);
        
        // FASE 3: Coherency Check
        console.log('\n🔍 FASE 3: Coherency Check');
        
        // Verificar que las mismas entidades fluyen a través del pipeline
        const domainEntityNames = new Set(domainEntities);
        const coreEntityNames = new Set(coreEntities);
        
        const entitiesMatch = [...domainEntityNames].every(entity => coreEntityNames.has(entity));
        const noHardcodeEntities = !coreEntities.some(entity => ['User', 'Product', 'Order'].includes(entity));
        
        console.log(`   ✓ Entidades coherentes Domain→Architecture: ${entitiesMatch ? '✅' : '❌'}`);
        console.log(`   ✓ NO contiene hardcode (User/Product/Order): ${noHardcodeEntities ? '✅' : '❌'}`);
        
        // Verificar archivos que se generarían
        const coreFiles = architectureClassification.implementation_plan.CORE.files;
        const coreFileNames = coreFiles.map(f => f.name);
        console.log(`   ✓ Archivos CORE a generar: ${coreFileNames.join(', ')}`);
        
        const hasCorrectFiles = domainEntities.every(entity => 
            coreFileNames.some(fileName => fileName.includes(entity.toLowerCase()))
        );
        console.log(`   ✓ Archivos coherentes con entidades: ${hasCorrectFiles ? '✅' : '❌'}`);
        
        results.coherencyCheck = entitiesMatch && noHardcodeEntities && hasCorrectFiles;
        
        // RESULTADO FINAL
        console.log('\n' + '='.repeat(50));
        if (results.coherencyCheck) {
            console.log('🎉 SUCCESS: Pipeline BRIK funcionando correctamente!');
            console.log('✅ Domain Analysis genera entidades dinámicamente');
            console.log('✅ Architecture Classifier lee entidades reales');
            console.log('✅ NO más hardcode (User/Product/Order)');
            console.log('✅ Coherencia end-to-end mantenida');
            
            // Mostrar flujo esperado
            console.log('\\n📋 FLUJO VALIDADO:');
            console.log(`   Input: "TODO API" → Domain: [${domainEntities.join(', ')}] → Architecture: [${coreEntities.join(', ')}] → Files: [${coreFileNames.join(', ')}]`);
            
        } else {
            console.log('❌ FAILED: Pipeline con errores de coherencia');
            console.log('   - Revisar generateDynamicClassification() en architecture-classifier.js');
            console.log('   - Verificar que lee domain-analysis correctamente');
        }
        
    } catch (error) {
        console.error('❌ ERROR en pipeline:', error.message);
        results.errors.push(error.message);
        results.coherencyCheck = false;
    }
    
    return results;
}

// Ejecutar validación
if (require.main === module) {
    validateEndToEndPipeline()
        .then(results => {
            process.exit(results.coherencyCheck ? 0 : 1);
        });
}

module.exports = { validateEndToEndPipeline };