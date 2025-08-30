#!/usr/bin/env node
/**
 * 🧪 TEST: Validar Architecture Classifier Refactorizado
 * 
 * Verificar que lee domain-analysis.json dinámicamente y genera
 * entidades correctas ("List") en lugar del hardcode ("User, Product, Order")
 */

const { ArchitectureClassifier } = require('./generators/intelligent/architecture-classifier.js');
const fs = require('fs');
const path = require('path');

async function testArchitectureClassifier() {
    console.log('🧪 TEST: Architecture Classifier - Lectura Dinámica de Domain Analysis');
    console.log('='.repeat(70));
    
    try {
        // Cargar domain-analysis-test.json con entidad "List"
        const testAnalysisPath = path.join(__dirname, 'domain-analysis-test.json');
        const domainAnalysis = JSON.parse(fs.readFileSync(testAnalysisPath, 'utf8'));
        
        console.log('📋 INPUT - Domain Analysis:');
        console.log(`   Proyecto: ${domainAnalysis.projectName}`);
        console.log(`   Entidades: ${domainAnalysis.domain.entities.map(e => e.name).join(', ')}`);
        console.log('');
        
        // Ejecutar clasificación
        const classifier = new ArchitectureClassifier();
        process.env.OUTPUT_JSON = '1'; // Modo silencioso
        const result = await classifier.classify(domainAnalysis);
        
        console.log('📊 OUTPUT - Clasificación Generada:');
        console.log(`   Entidades CORE: ${result.architecture.CORE.entities.map(e => e.name).join(', ')}`);
        console.log(`   Repositorios WRAPPERS: ${result.architecture.WRAPPERS.repositories.map(r => r.name).join(', ')}`);
        console.log('');
        
        // Validar que usa entidad "List" correcta
        const coreEntityNames = result.architecture.CORE.entities.map(e => e.name);
        const hasListEntity = coreEntityNames.includes('List');
        const hasOldEntities = coreEntityNames.some(name => ['User', 'Product', 'Order'].includes(name));
        
        console.log('✅ VALIDATION RESULTS:');
        console.log(`   ✓ Contiene entidad "List": ${hasListEntity ? '✅ SÍ' : '❌ NO'}`);
        console.log(`   ✓ NO contiene hardcode (User/Product/Order): ${!hasOldEntities ? '✅ SÍ' : '❌ NO'}`);
        console.log(`   ✓ Architecture Map generado: ${result.implementation_plan ? '✅ SÍ' : '❌ NO'}`);
        
        if (hasListEntity && !hasOldEntities) {
            console.log('\n🎉 SUCCESS: Architecture Classifier refactorizado correctamente!');
            console.log('   - Lee domain-analysis.json dinámicamente ✅');
            console.log('   - Genera entidades correctas ("List") ✅');
            console.log('   - Elimina hardcode (User/Product/Order) ✅');
            
            // Mostrar archivos que se generarían
            const coreFiles = result.implementation_plan.CORE.files.map(f => f.name);
            console.log(`\n📁 Archivos CORE que se generarían: ${coreFiles.join(', ')}`);
            
            return true;
        } else {
            console.log('\n❌ FAILED: Architecture Classifier aún usa hardcode');
            console.log('   - Revisa el método generateDynamicClassification()');
            return false;
        }
        
    } catch (error) {
        console.error('❌ ERROR en test:', error.message);
        console.error('Stack:', error.stack);
        return false;
    }
}

// Ejecutar test
if (require.main === module) {
    testArchitectureClassifier()
        .then(success => {
            process.exit(success ? 0 : 1);
        });
}

module.exports = { testArchitectureClassifier };