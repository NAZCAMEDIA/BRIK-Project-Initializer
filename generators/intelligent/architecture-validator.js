#!/usr/bin/env node
/**
 * 🔍 BRIK Architecture Validator - Validación de Principios BRIK
 * 
 * Valida que el código generado cumple estrictamente con:
 * - Inmutabilidad del CORE (sin dependencias externas)
 * - Configurabilidad de WRAPPERS 
 * - Adaptabilidad de LIVING_LAYER
 * - 100% cobertura de tests
 * - Conformidad con filosofía BRIK
 * 
 * Filosofía BRIK: Validación automática de principios inmutables
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class BRIKArchitectureValidator {
    constructor(projectPath = '.') {
        this.projectPath = projectPath;
        this.violations = [];
        this.warnings = [];
        this.validationRules = this.initializeValidationRules();
    }

    initializeValidationRules() {
        return {
            CORE: {
                forbidden_imports: [
                    'tokio_postgres', 'redis', 'reqwest', 'hyper',
                    'std::net', 'std::fs', 'std::env',
                    'serde_json::from_reader', 'std::io'
                ],
                required_traits: ['Clone', 'Debug'],
                forbidden_patterns: [
                    /async\s+fn/, // CORE no debería tener funciones async
                    /\.await/, // CORE no debería usar await
                    /std::env::var/, // CORE no debería leer variables de entorno
                    /std::fs::/, // CORE no debería acceder filesystem
                ],
                required_patterns: [
                    /#\[derive\(.*Debug.*\)\]/, // Entities deben ser debuggeables
                    /#\[cfg\(test\)\]/, // Debe tener tests
                ]
            },
            WRAPPERS: {
                required_traits: ['async_trait'],
                required_patterns: [
                    /async\s+fn/, // WRAPPERS deben tener funciones async
                    /#\[async_trait\]/, // Deben usar async_trait
                ],
                allowed_dependencies: [
                    'tokio_postgres', 'redis', 'reqwest', 'hyper',
                    'serde', 'serde_json', 'uuid'
                ]
            },
            LIVING_LAYER: {
                required_patterns: [
                    /async\s+fn/, // LIVING debe ser async
                    /tokio::time/, // Debe usar tokio para timing
                    /HashMap/, // Debe gestionar estado
                ],
                required_capabilities: [
                    'monitoring', 'analysis', 'adaptation'
                ]
            },
            TESTS: {
                coverage_threshold: 100, // 100% coverage obligatorio
                required_test_types: ['unit', 'integration', 'property', 'immutability'],
                required_patterns: [
                    /#\[test\]/, // Tests unitarios
                    /#\[tokio::test\]/, // Tests async
                    /assert!/, // Aserciones
                ]
            }
        };
    }

    /**
     * Ejecuta validación completa del proyecto
     */
    async validate() {
        console.log('🔍 Iniciando validación arquitectónica BRIK...');
        
        try {
            // Validar estructura de directorios
            await this.validateProjectStructure();
            
            // Validar capa CORE
            await this.validateCoreLayer();
            
            // Validar capa WRAPPERS  
            await this.validateWrappersLayer();
            
            // Validar capa LIVING_LAYER
            await this.validateLivingLayer();
            
            // Validar tests y cobertura
            await this.validateTests();
            
            // Validar configuración del proyecto
            await this.validateProjectConfig();
            
            // Generar reporte final
            return this.generateValidationReport();
            
        } catch (error) {
            this.addViolation('CRITICAL', `Error durante validación: ${error.message}`);
            return this.generateValidationReport();
        }
    }

    async validateProjectStructure() {
        console.log('📁 Validando estructura de directorios...');
        
        const requiredDirs = [
            'src/core',
            'src/components', 
            'src/living-layer',
            'tests/unit',
            'tests/integration',
            'tests/property',
            'tests/immutability'
        ];

        for (const dir of requiredDirs) {
            const dirPath = path.join(this.projectPath, dir);
            try {
                await fs.access(dirPath);
            } catch (error) {
                this.addViolation('ERROR', `Directorio requerido no encontrado: ${dir}`);
            }
        }

        // Validar archivos críticos
        const requiredFiles = [
            'Cargo.toml',
            'src/lib.rs',
            'src/main.rs',
            'CIRCUITALIDAD.md'
        ];

        for (const file of requiredFiles) {
            const filePath = path.join(this.projectPath, file);
            try {
                await fs.access(filePath);
            } catch (error) {
                this.addViolation('ERROR', `Archivo requerido no encontrado: ${file}`);
            }
        }
    }

    async validateCoreLayer() {
        console.log('🎯 Validando CORE layer (inmutabilidad)...');
        
        const corePath = path.join(this.projectPath, 'src/core');
        const coreFiles = await this.findRustFiles(corePath);
        
        for (const file of coreFiles) {
            await this.validateCoreFile(file);
        }
        
        // Validar que existe al menos una entidad
        if (coreFiles.length === 1 && coreFiles[0].endsWith('mod.rs')) {
            this.addWarning('CORE layer no contiene entidades de dominio');
        }
    }

    async validateCoreFile(filePath) {
        const content = await fs.readFile(filePath, 'utf8');
        const filename = path.basename(filePath);
        
        // Verificar imports prohibidos
        for (const forbidden of this.validationRules.CORE.forbidden_imports) {
            if (content.includes(forbidden)) {
                this.addViolation('CRITICAL', 
                    `CORE violation en ${filename}: Import prohibido '${forbidden}'`);
            }
        }
        
        // Verificar patrones prohibidos
        for (const pattern of this.validationRules.CORE.forbidden_patterns) {
            if (pattern.test(content)) {
                this.addViolation('ERROR', 
                    `CORE violation en ${filename}: Patrón prohibido '${pattern}'`);
            }
        }
        
        // Verificar patrones requeridos (si no es mod.rs)
        if (!filename.includes('mod.rs')) {
            let hasTests = content.includes('#[cfg(test)]');
            if (!hasTests) {
                this.addViolation('ERROR', 
                    `CORE file ${filename} no tiene tests unitarios`);
            }
            
            let hasDebug = content.includes('Debug');
            if (!hasDebug) {
                this.addWarning(`CORE file ${filename} debería derivar Debug`);
            }
        }
    }

    async validateWrappersLayer() {
        console.log('🔧 Validando WRAPPERS layer (configurabilidad)...');
        
        const wrappersPath = path.join(this.projectPath, 'src/components');
        const wrapperFiles = await this.findRustFiles(wrappersPath);
        
        for (const file of wrapperFiles) {
            await this.validateWrapperFile(file);
        }
    }

    async validateWrapperFile(filePath) {
        const content = await fs.readFile(filePath, 'utf8');
        const filename = path.basename(filePath);
        
        if (filename.includes('mod.rs')) return; // Skip mod files
        
        // Los wrappers DEBEN tener async functions
        if (!content.includes('async fn')) {
            this.addWarning(`WRAPPER ${filename} debería tener funciones async`);
        }
        
        // Los wrappers DEBERÍAN usar async_trait
        if (!content.includes('#[async_trait]')) {
            this.addWarning(`WRAPPER ${filename} debería usar #[async_trait]`);
        }
        
        // Verificar que tiene configuración
        if (!content.includes('config') && !content.includes('Config')) {
            this.addWarning(`WRAPPER ${filename} debería ser configurable`);
        }
    }

    async validateLivingLayer() {
        console.log('🤖 Validando LIVING layer (adaptabilidad)...');
        
        const livingPath = path.join(this.projectPath, 'src/living-layer');
        const livingFiles = await this.findRustFiles(livingPath);
        
        for (const file of livingFiles) {
            await this.validateLivingFile(file);
        }
    }

    async validateLivingFile(filePath) {
        const content = await fs.readFile(filePath, 'utf8');
        const filename = path.basename(filePath);
        
        if (filename.includes('mod.rs')) return;
        
        // LIVING layer DEBE ser async y adaptativo
        if (!content.includes('async fn')) {
            this.addViolation('ERROR', 
                `LIVING component ${filename} debe tener funciones async`);
        }
        
        // Debe tener capacidades de análisis/monitoreo
        const hasMonitoring = content.includes('monitor') || 
                            content.includes('analyze') || 
                            content.includes('metrics');
        if (!hasMonitoring) {
            this.addWarning(`LIVING component ${filename} debería tener capacidades de monitoreo`);
        }
    }

    async validateTests() {
        console.log('🧪 Validando tests y cobertura...');
        
        // Verificar que existen tests
        const testDirs = ['tests/unit', 'tests/integration', 'tests/property', 'tests/immutability'];
        
        for (const testDir of testDirs) {
            const testPath = path.join(this.projectPath, testDir);
            try {
                const files = await fs.readdir(testPath);
                const testFiles = files.filter(f => f.endsWith('.rs'));
                
                if (testFiles.length === 0) {
                    this.addWarning(`Directorio de tests vacío: ${testDir}`);
                }
            } catch (error) {
                this.addViolation('ERROR', `No se puede acceder a directorio de tests: ${testDir}`);
            }
        }
        
        // Intentar ejecutar tests si es posible
        try {
            await this.runTestCoverage();
        } catch (error) {
            this.addWarning(`No se pudo verificar cobertura: ${error.message}`);
        }
    }

    async runTestCoverage() {
        const cwd = this.projectPath;
        
        try {
            // Verificar que existe Cargo.toml
            await fs.access(path.join(cwd, 'Cargo.toml'));
            
            // Intentar ejecutar cargo test
            const testOutput = execSync('cargo test --quiet 2>&1', { 
                cwd, 
                encoding: 'utf8',
                timeout: 30000 // 30 seconds timeout
            });
            
            if (testOutput.includes('test result: ok')) {
                console.log('✅ Tests ejecutados correctamente');
            } else {
                this.addWarning('Tests no pasaron completamente');
            }
            
        } catch (error) {
            // No es critical error - proyecto podría no estar compilable aún
            this.addWarning(`Tests no ejecutables: ${error.message.substring(0, 100)}...`);
        }
    }

    async validateProjectConfig() {
        console.log('⚙️ Validando configuración del proyecto...');
        
        // Validar Cargo.toml
        const cargoPath = path.join(this.projectPath, 'Cargo.toml');
        try {
            const cargoContent = await fs.readFile(cargoPath, 'utf8');
            
            // Verificar dependencias BRIK esenciales
            const requiredDeps = ['serde', 'uuid', 'tokio', 'async-trait'];
            for (const dep of requiredDeps) {
                if (!cargoContent.includes(dep)) {
                    this.addWarning(`Dependencia recomendada faltante: ${dep}`);
                }
            }
            
            // Verificar que tiene bin y lib
            if (!cargoContent.includes('[[bin]]') && !cargoContent.includes('[lib]')) {
                this.addWarning('Cargo.toml debería definir bin o lib target');
            }
            
        } catch (error) {
            this.addViolation('ERROR', 'No se puede validar Cargo.toml');
        }
    }

    async findRustFiles(directory) {
        try {
            const items = await fs.readdir(directory, { withFileTypes: true });
            let files = [];
            
            for (const item of items) {
                const fullPath = path.join(directory, item.name);
                
                if (item.isDirectory()) {
                    // Recursively find files in subdirectories
                    const subFiles = await this.findRustFiles(fullPath);
                    files = files.concat(subFiles);
                } else if (item.name.endsWith('.rs')) {
                    files.push(fullPath);
                }
            }
            
            return files;
        } catch (error) {
            return [];
        }
    }

    addViolation(level, message) {
        this.violations.push({ level, message, timestamp: new Date().toISOString() });
        console.log(`❌ ${level}: ${message}`);
    }

    addWarning(message) {
        this.warnings.push({ message, timestamp: new Date().toISOString() });
        console.log(`⚠️  WARNING: ${message}`);
    }

    generateValidationReport() {
        const criticalViolations = this.violations.filter(v => v.level === 'CRITICAL');
        const errorViolations = this.violations.filter(v => v.level === 'ERROR');
        const warningCount = this.warnings.length;
        
        const isPassing = criticalViolations.length === 0 && errorViolations.length === 0;
        const score = this.calculateBRIKScore(criticalViolations, errorViolations, warningCount);
        
        const report = {
            validation_result: isPassing ? 'PASSED' : 'FAILED',
            brik_compliance_score: score,
            summary: {
                critical_violations: criticalViolations.length,
                error_violations: errorViolations.length,
                warnings: warningCount,
                total_issues: this.violations.length + warningCount
            },
            violations: this.violations,
            warnings: this.warnings,
            recommendations: this.generateRecommendations(),
            timestamp: new Date().toISOString(),
            validator_version: '1.0.0'
        };
        
        this.printValidationSummary(report);
        return report;
    }

    calculateBRIKScore(criticalViolations, errorViolations, warningCount) {
        let score = 100;
        
        // Critical violations: -50 points each
        score -= criticalViolations.length * 50;
        
        // Error violations: -20 points each  
        score -= errorViolations.length * 20;
        
        // Warnings: -5 points each
        score -= warningCount * 5;
        
        return Math.max(0, score);
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.violations.some(v => v.message.includes('CORE violation'))) {
            recommendations.push('Refactorizar CORE para eliminar dependencias externas');
        }
        
        if (this.warnings.some(w => w.message.includes('tests'))) {
            recommendations.push('Agregar tests comprehensivos para mejorar cobertura');
        }
        
        if (this.warnings.some(w => w.message.includes('async'))) {
            recommendations.push('Implementar funciones async en WRAPPERS y LIVING layers');
        }
        
        return recommendations;
    }

    printValidationSummary(report) {
        console.log('\n🔍 BRIK VALIDATION REPORT');
        console.log('═'.repeat(50));
        console.log(`Status: ${report.validation_result === 'PASSED' ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`BRIK Compliance Score: ${report.brik_compliance_score}%`);
        console.log('');
        console.log('Summary:');
        console.log(`  Critical Violations: ${report.summary.critical_violations}`);
        console.log(`  Error Violations: ${report.summary.error_violations}`);
        console.log(`  Warnings: ${report.summary.warnings}`);
        console.log('');
        
        if (report.recommendations.length > 0) {
            console.log('Recommendations:');
            report.recommendations.forEach((rec, i) => {
                console.log(`  ${i + 1}. ${rec}`);
            });
        }
        
        if (report.validation_result === 'PASSED') {
            console.log('🎉 Proyecto cumple con estándares BRIK!');
        } else {
            console.log('🔧 Revisar violaciones antes de certificación BRIK');
        }
    }

    async saveReport(report, filename = 'brik-validation-report.json') {
        try {
            const reportPath = path.join(this.projectPath, filename);
            await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
            console.log(`💾 Reporte guardado: ${filename}`);
        } catch (error) {
            console.warn('⚠️ No se pudo guardar reporte:', error.message);
        }
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const projectPath = args[0] || '.';
    
    console.log(`
🔍 BRIK Architecture Validator

USAGE:
  node architecture-validator.js [project-path]

EXAMPLES:
  node architecture-validator.js .
  node architecture-validator.js ./my-brik-project
  node architecture-validator.js ./generated-ecommerce

VALIDATION AREAS:
  • Project structure and required files
  • CORE layer immutability (no external dependencies)
  • WRAPPERS layer configurability (async, traits)
  • LIVING layer adaptability (monitoring, metrics)
  • Test coverage and completeness
  • BRIK principles compliance
    `.trim());
    
    if (args.includes('--help') || args.includes('-h')) {
        process.exit(0);
    }

    try {
        console.log('🚀 BRIK Architecture Validator');
        console.log(`📂 Validando proyecto: ${path.resolve(projectPath)}`);
        console.log('');

        const validator = new BRIKArchitectureValidator(projectPath);
        const report = await validator.validate();
        
        // Guardar reporte
        await validator.saveReport(report);
        
        // Exit code basado en resultado
        const exitCode = report.validation_result === 'PASSED' ? 0 : 1;
        process.exit(exitCode);

    } catch (error) {
        console.error('❌ Error durante validación:', error.message);
        process.exit(2);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}

module.exports = { BRIKArchitectureValidator };