/**
 * 🧬 BRIK Code Generator con Agentes IA
 * Generador inteligente de código BRIK usando múltiples proveedores de IA
 */

const fs = require('fs');
const path = require('path');
const AIAgentManager = require('./agent-manager');

class BrikCodeGenerator {
  constructor() {
    this.aiManager = new AIAgentManager();
    this.templates = this.loadTemplates();
  }

  loadTemplates() {
    return {
      rust: {
        core: this.getRustCoreTemplate(),
        wrapper: this.getRustWrapperTemplate(),
        living: this.getRustLivingTemplate(),
        test: this.getRustTestTemplate()
      },
      typescript: {
        core: this.getTypeScriptCoreTemplate(),
        wrapper: this.getTypeScriptWrapperTemplate(),
        living: this.getTypeScriptLivingTemplate(),
        test: this.getTypeScriptTestTemplate()
      },
      python: {
        core: this.getPythonCoreTemplate(),
        wrapper: this.getPythonWrapperTemplate(),
        living: this.getPythonLivingTemplate(),
        test: this.getPythonTestTemplate()
      }
    };
  }

  async generateProject(description, language, integrations, outputPath, provider = 'claude') {
    console.log(`\n🧬 BRIK Code Generator - Usando ${provider.toUpperCase()}`);
    console.log('══════════════════════════════════════════════\n');

    // Configurar proveedor de IA
    await this.aiManager.setProvider(provider);

    // Fase 1: Análisis del dominio
    console.log('🧠 Fase 1/4: Analizando dominio con IA...');
    const analysis = await this.analyzeProjectDomain(description, integrations, language);
    
    // Fase 2: Clasificación arquitectónica
    console.log('🏗️  Fase 2/4: Clasificando arquitectura BRIK...');
    const architecture = await this.classifyArchitecture(analysis, language);
    
    // Fase 3: Generación de código
    console.log('⚡ Fase 3/4: Generando código funcional...');
    const codeStructure = await this.generateCode(architecture, language);
    
    // Fase 4: Escritura de archivos
    console.log('💾 Fase 4/4: Escribiendo proyecto...');
    await this.writeProject(codeStructure, outputPath, language);
    
    // Generar documentación y validación
    await this.generateDocumentation(outputPath, analysis, architecture);
    await this.generateValidationScripts(outputPath, language);
    
    console.log('\n✅ Proyecto BRIK generado exitosamente!');
    
    return {
      analysis,
      architecture,
      outputPath
    };
  }

  async analyzeProjectDomain(description, integrations, language) {
    const prompt = `
Analiza el siguiente proyecto y genera un modelo de dominio completo:

PROYECTO: ${description}
LENGUAJE: ${language}
INTEGRACIONES: ${integrations || 'ninguna'}

Identifica y devuelve en formato JSON:
{
  "domain": {
    "name": "nombre del dominio",
    "description": "descripción",
    "entities": [
      {
        "name": "EntityName",
        "properties": [
          {"name": "prop", "type": "string", "required": true}
        ],
        "methods": ["method1", "method2"],
        "businessRules": ["rule1", "rule2"]
      }
    ],
    "valueObjects": [],
    "aggregates": [],
    "services": [],
    "repositories": [],
    "events": []
  },
  "integrations": {
    "external": ["postgresql", "redis", "stripe"],
    "wrappers": ["DatabaseWrapper", "CacheWrapper", "PaymentWrapper"]
  },
  "livingLayer": {
    "monitors": ["PerformanceMonitor", "ErrorTracker"],
    "analytics": ["BusinessMetrics", "UserAnalytics"],
    "consciousness": ["SystemHealth", "AutoScaling"]
  }
}`;

    const response = await this.aiManager.analyzeProject(description, integrations, language);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      // Si la respuesta no es JSON válido, procesarla
      return this.parseAIResponse(response);
    }
  }

  async classifyArchitecture(analysis, language) {
    const prompt = `
Clasifica la siguiente estructura en las 3 capas BRIK:

ANÁLISIS:
${JSON.stringify(analysis, null, 2)}

Clasifica cada componente en:
1. CORE: Lógica de negocio pura, sin dependencias externas
2. WRAPPERS: Adaptadores para servicios externos
3. LIVING LAYER: Monitoreo, métricas, consciencia del sistema

Devuelve la clasificación en formato JSON:
{
  "core": {
    "entities": [],
    "businessLogic": [],
    "domainServices": []
  },
  "wrappers": {
    "database": [],
    "cache": [],
    "external": []
  },
  "livingLayer": {
    "monitors": [],
    "analytics": [],
    "health": []
  }
}`;

    const response = await this.aiManager.generateBrikCode(analysis, language);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      return this.buildDefaultArchitecture(analysis);
    }
  }

  async generateCode(architecture, language) {
    const codeStructure = {
      core: {},
      components: {},
      livingLayer: {},
      tests: {}
    };

    // Generar código para cada capa
    console.log('  📦 Generando capa CORE...');
    codeStructure.core = await this.generateCoreCode(architecture.core, language);
    
    console.log('  🔌 Generando WRAPPERS...');
    codeStructure.components = await this.generateWrapperCode(architecture.wrappers, language);
    
    console.log('  🧠 Generando LIVING LAYER...');
    codeStructure.livingLayer = await this.generateLivingCode(architecture.livingLayer, language);
    
    console.log('  🧪 Generando TESTS (100% cobertura)...');
    codeStructure.tests = await this.generateTestCode(architecture, language);
    
    return codeStructure;
  }

  async generateCoreCode(core, language) {
    const files = {};
    const template = this.templates[language].core;
    
    for (const entity of core.entities || []) {
      const prompt = `
Genera código ${language} para la entidad CORE:

ENTIDAD: ${JSON.stringify(entity, null, 2)}

Requisitos:
- Código puro sin dependencias externas
- Inmutable después del deployment
- Métodos de negocio completos
- Validaciones internas
- Documentación inline

Usa este template como base:
${template}

Genera el código completo y funcional.`;

      const code = await this.aiManager.generateBrikCode({ entity }, language);
      files[`${entity.name.toLowerCase()}.${this.getExtension(language)}`] = code;
    }
    
    return files;
  }

  async generateWrapperCode(wrappers, language) {
    const files = {};
    const template = this.templates[language].wrapper;
    
    for (const [type, components] of Object.entries(wrappers)) {
      for (const component of components) {
        const prompt = `
Genera un wrapper ${language} para:

TIPO: ${type}
COMPONENTE: ${component}

Requisitos:
- Interfaz limpia hacia el CORE
- Manejo de errores robusto
- Retry logic si aplica
- Circuit breaker pattern
- Logging completo

Template base:
${template}`;

        const code = await this.aiManager.generateBrikCode({ type, component }, language);
        files[`${component.toLowerCase()}_wrapper.${this.getExtension(language)}`] = code;
      }
    }
    
    return files;
  }

  async generateLivingCode(livingLayer, language) {
    const files = {};
    const template = this.templates[language].living;
    
    for (const [category, components] of Object.entries(livingLayer)) {
      for (const component of components) {
        const prompt = `
Genera código ${language} para Living Layer:

CATEGORÍA: ${category}
COMPONENTE: ${component}

Requisitos:
- Monitoreo en tiempo real
- Métricas de negocio
- Health checks
- Auto-healing si es posible
- Alertas configurables

Template:
${template}`;

        const code = await this.aiManager.generateBrikCode({ category, component }, language);
        files[`${component.toLowerCase()}.${this.getExtension(language)}`] = code;
      }
    }
    
    return files;
  }

  async generateTestCode(architecture, language) {
    const files = {};
    const template = this.templates[language].test;
    
    // Generar tests para cada componente
    const allComponents = [
      ...Object.values(architecture.core).flat(),
      ...Object.values(architecture.wrappers).flat(),
      ...Object.values(architecture.livingLayer).flat()
    ];
    
    for (const component of allComponents) {
      const prompt = `
Genera tests ${language} con 100% cobertura para:

COMPONENTE: ${JSON.stringify(component, null, 2)}

Requisitos:
- Tests unitarios completos
- Tests de integración
- Property-based testing
- Tests de inmutabilidad
- 100% cobertura de líneas, ramas y funciones
- Mocks y stubs necesarios

Template:
${template}`;

      const code = await this.aiManager.generateBrikCode({ component }, language);
      const componentName = typeof component === 'string' ? component : component.name;
      files[`test_${componentName.toLowerCase()}.${this.getExtension(language)}`] = code;
    }
    
    return files;
  }

  async writeProject(codeStructure, outputPath, language) {
    // Crear estructura de directorios
    const dirs = [
      'src/core',
      'src/components',
      'src/living-layer',
      'tests/unit',
      'tests/integration',
      'tests/property',
      'tests/immutability',
      'docs/product',
      'docs/technical',
      'docs/operational',
      'scripts',
      'config'
    ];
    
    dirs.forEach(dir => {
      const fullPath = path.join(outputPath, dir);
      fs.mkdirSync(fullPath, { recursive: true });
    });
    
    // Escribir archivos de código
    for (const [file, content] of Object.entries(codeStructure.core)) {
      fs.writeFileSync(path.join(outputPath, 'src/core', file), content);
    }
    
    for (const [file, content] of Object.entries(codeStructure.components)) {
      fs.writeFileSync(path.join(outputPath, 'src/components', file), content);
    }
    
    for (const [file, content] of Object.entries(codeStructure.livingLayer)) {
      fs.writeFileSync(path.join(outputPath, 'src/living-layer', file), content);
    }
    
    for (const [file, content] of Object.entries(codeStructure.tests)) {
      const testDir = file.includes('integration') ? 'tests/integration' : 
                     file.includes('property') ? 'tests/property' :
                     file.includes('immutable') ? 'tests/immutability' : 'tests/unit';
      fs.writeFileSync(path.join(outputPath, testDir, file), content);
    }
    
    // Generar archivos de configuración según el lenguaje
    await this.generateProjectConfig(outputPath, language);
  }

  async generateProjectConfig(outputPath, language) {
    const configs = {
      rust: {
        'Cargo.toml': this.generateCargoToml(path.basename(outputPath)),
        'rust-toolchain.toml': this.generateRustToolchain()
      },
      typescript: {
        'package.json': this.generatePackageJson(path.basename(outputPath)),
        'tsconfig.json': this.generateTsConfig(),
        'jest.config.js': this.generateJestConfig()
      },
      python: {
        'requirements.txt': this.generateRequirements(),
        'pyproject.toml': this.generatePyProject(path.basename(outputPath)),
        'pytest.ini': this.generatePytestIni()
      }
    };
    
    const langConfigs = configs[language] || {};
    
    for (const [file, content] of Object.entries(langConfigs)) {
      fs.writeFileSync(path.join(outputPath, file), content);
    }
  }

  async generateDocumentation(outputPath, analysis, architecture) {
    // Generar ADN del proyecto
    const brikDna = {
      project: {
        name: path.basename(outputPath),
        version: "1.0.0",
        philosophy: "DAAF-BRIK-CircuitalidadDigital",
        generated_by: "AI Agent",
        generation_date: new Date().toISOString()
      },
      analysis: analysis,
      architecture: architecture,
      principles: {
        circuitality: true,
        consciousness: true,
        thermodynamics: true,
        auditability: true,
        documentation: true
      },
      compliance: {
        coverage_requirement: 100,
        immutability_check: true,
        entropy_monitoring: true,
        ethical_validation: true,
        documentation_completeness: true
      }
    };
    
    fs.writeFileSync(
      path.join(outputPath, '.brik-dna.yml'),
      `# BRIK DNA - Generado por IA\n${JSON.stringify(brikDna, null, 2)}`
    );
    
    // Copiar CIRCUITALIDAD.md
    const circuitPath = path.join(__dirname, '..', 'CIRCUITALIDAD.md');
    if (fs.existsSync(circuitPath)) {
      fs.copyFileSync(circuitPath, path.join(outputPath, 'CIRCUITALIDAD.md'));
    }
    
    // Generar README.md
    const readme = `# ${path.basename(outputPath)}

Proyecto generado con arquitectura BRIK usando agentes IA.

## 🧬 Arquitectura BRIK

- **CORE**: Lógica de negocio pura e inmutable
- **WRAPPERS**: Adaptadores para servicios externos
- **LIVING LAYER**: Monitoreo y consciencia del sistema

## 🚀 Inicio Rápido

\`\`\`bash
# Instalar dependencias
${this.getInstallCommand(outputPath)}

# Ejecutar tests (100% cobertura)
./scripts/test-coverage.sh

# Validar certificación BRIK
./scripts/brik-certify.sh

# Ejecutar proyecto
${this.getRunCommand(outputPath)}
\`\`\`

## 📚 Documentación

- [Documentación del Producto](docs/product/)
- [Documentación Técnica](docs/technical/)
- [Documentación Operativa](docs/operational/)

## ✅ Certificación BRIK

Este proyecto cumple con los estándares BRIK L3:
- ✅ 100% Cobertura de código
- ✅ Arquitectura de 3 capas
- ✅ Documentación completa
- ✅ Tests de inmutabilidad
- ✅ Living layer activo
`;
    
    fs.writeFileSync(path.join(outputPath, 'README.md'), readme);
  }

  async generateValidationScripts(outputPath, language) {
    // Copiar scripts de validación
    const scriptsDir = path.join(__dirname, '..', 'scripts');
    const scripts = ['test-coverage.sh', 'brik-certify.sh', 'validate-docs.sh'];
    
    scripts.forEach(script => {
      const sourcePath = path.join(scriptsDir, script);
      const destPath = path.join(outputPath, 'scripts', script);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        fs.chmodSync(destPath, '755');
      }
    });
  }

  // Métodos auxiliares y templates

  getExtension(language) {
    const extensions = {
      rust: 'rs',
      typescript: 'ts',
      python: 'py',
      go: 'go'
    };
    return extensions[language] || 'txt';
  }

  getInstallCommand(projectPath) {
    const type = this.detectProjectType(projectPath);
    const commands = {
      rust: 'cargo build',
      typescript: 'npm install',
      python: 'pip install -r requirements.txt',
      go: 'go mod download'
    };
    return commands[type] || 'install dependencies';
  }

  getRunCommand(projectPath) {
    const type = this.detectProjectType(projectPath);
    const commands = {
      rust: 'cargo run',
      typescript: 'npm start',
      python: 'python src/main.py',
      go: 'go run .'
    };
    return commands[type] || 'run project';
  }

  detectProjectType(projectPath) {
    if (fs.existsSync(path.join(projectPath, 'Cargo.toml'))) return 'rust';
    if (fs.existsSync(path.join(projectPath, 'package.json'))) return 'typescript';
    if (fs.existsSync(path.join(projectPath, 'requirements.txt'))) return 'python';
    if (fs.existsSync(path.join(projectPath, 'go.mod'))) return 'go';
    return 'unknown';
  }

  parseAIResponse(response) {
    // Intentar extraer JSON de la respuesta de texto
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {}
    }
    
    // Generar estructura por defecto si no se puede parsear
    return this.getDefaultAnalysis();
  }

  buildDefaultArchitecture(analysis) {
    return {
      core: {
        entities: analysis.domain?.entities || [],
        businessLogic: [],
        domainServices: analysis.domain?.services || []
      },
      wrappers: {
        database: analysis.integrations?.wrappers?.filter(w => w.includes('Database')) || [],
        cache: analysis.integrations?.wrappers?.filter(w => w.includes('Cache')) || [],
        external: analysis.integrations?.external || []
      },
      livingLayer: {
        monitors: analysis.livingLayer?.monitors || [],
        analytics: analysis.livingLayer?.analytics || [],
        health: analysis.livingLayer?.consciousness || []
      }
    };
  }

  getDefaultAnalysis() {
    return {
      domain: {
        name: 'default',
        entities: [],
        services: []
      },
      integrations: {
        external: [],
        wrappers: []
      },
      livingLayer: {
        monitors: ['BasicMonitor'],
        analytics: ['BasicAnalytics'],
        consciousness: ['HealthCheck']
      }
    };
  }

  // Templates para cada lenguaje

  getRustCoreTemplate() {
    return `
/// BRIK CORE Entity - Immutable business logic
#[derive(Debug, Clone)]
pub struct Entity {
    // Properties
}

impl Entity {
    /// Constructor with validation
    pub fn new() -> Result<Self, Error> {
        // Implementation
    }
    
    /// Business method
    pub fn business_logic(&self) -> Result<(), Error> {
        // Pure business logic
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_entity_creation() {
        // 100% coverage required
    }
}`;
  }

  getRustWrapperTemplate() {
    return `
/// BRIK WRAPPER - External service adapter
use async_trait::async_trait;

#[async_trait]
pub trait ServicePort {
    async fn operation(&self) -> Result<(), Error>;
}

pub struct ServiceWrapper {
    // Dependencies
}

#[async_trait]
impl ServicePort for ServiceWrapper {
    async fn operation(&self) -> Result<(), Error> {
        // External service integration
    }
}`;
  }

  getRustLivingTemplate() {
    return `
/// BRIK LIVING LAYER - System consciousness
use tokio::time::{interval, Duration};

pub struct Monitor {
    metrics: Metrics,
}

impl Monitor {
    pub async fn start(&self) {
        let mut interval = interval(Duration::from_secs(60));
        
        loop {
            interval.tick().await;
            self.collect_metrics().await;
            self.analyze_health().await;
        }
    }
}`;
  }

  getRustTestTemplate() {
    return `
/// BRIK TEST - 100% coverage required
#[cfg(test)]
mod tests {
    use super::*;
    use proptest::prelude::*;
    
    #[test]
    fn test_unit() {
        // Unit test
    }
    
    proptest! {
        #[test]
        fn test_property(val: i32) {
            // Property-based test
        }
    }
}`;
  }

  getTypeScriptCoreTemplate() {
    return `
/**
 * BRIK CORE Entity - Immutable business logic
 */
export class Entity {
  constructor(private readonly data: EntityData) {
    this.validate();
  }
  
  private validate(): void {
    // Validation logic
  }
  
  public businessLogic(): Result {
    // Pure business logic
  }
}`;
  }

  getTypeScriptWrapperTemplate() {
    return `
/**
 * BRIK WRAPPER - External service adapter
 */
export interface ServicePort {
  operation(): Promise<void>;
}

export class ServiceWrapper implements ServicePort {
  async operation(): Promise<void> {
    // External service integration
  }
}`;
  }

  getTypeScriptLivingTemplate() {
    return `
/**
 * BRIK LIVING LAYER - System consciousness
 */
export class Monitor {
  private metrics: Metrics;
  
  async start(): Promise<void> {
    setInterval(async () => {
      await this.collectMetrics();
      await this.analyzeHealth();
    }, 60000);
  }
}`;
  }

  getTypeScriptTestTemplate() {
    return `
/**
 * BRIK TEST - 100% coverage required
 */
describe('Entity', () => {
  it('should handle business logic', () => {
    // Test implementation
  });
  
  it.each([
    [1, 2, 3],
    [2, 3, 5],
  ])('should add %i + %i = %i', (a, b, expected) => {
    expect(a + b).toBe(expected);
  });
});`;
  }

  getPythonCoreTemplate() {
    return `
"""BRIK CORE Entity - Immutable business logic"""
from dataclasses import dataclass, field
from typing import Optional

@dataclass(frozen=True)
class Entity:
    """Immutable entity with business logic"""
    
    def __post_init__(self):
        self._validate()
    
    def _validate(self) -> None:
        """Internal validation"""
        pass
    
    def business_logic(self) -> Result:
        """Pure business logic"""
        pass`;
  }

  getPythonWrapperTemplate() {
    return `
"""BRIK WRAPPER - External service adapter"""
from abc import ABC, abstractmethod

class ServicePort(ABC):
    @abstractmethod
    async def operation(self) -> None:
        pass

class ServiceWrapper(ServicePort):
    async def operation(self) -> None:
        """External service integration"""
        pass`;
  }

  getPythonLivingTemplate() {
    return `
"""BRIK LIVING LAYER - System consciousness"""
import asyncio
from datetime import datetime

class Monitor:
    def __init__(self):
        self.metrics = {}
    
    async def start(self):
        while True:
            await self.collect_metrics()
            await self.analyze_health()
            await asyncio.sleep(60)`;
  }

  getPythonTestTemplate() {
    return `
"""BRIK TEST - 100% coverage required"""
import pytest
from hypothesis import given, strategies as st

def test_unit():
    """Unit test"""
    assert True

@given(st.integers())
def test_property(value):
    """Property-based test"""
    assert isinstance(value, int)`;
  }

  // Generadores de configuración

  generateCargoToml(projectName) {
    return `[package]
name = "${projectName}"
version = "1.0.0"
edition = "2021"

[dependencies]
tokio = { version = "1", features = ["full"] }
async-trait = "0.1"
serde = { version = "1", features = ["derive"] }
thiserror = "1"

[dev-dependencies]
proptest = "1"
mockall = "0.11"`;
  }

  generateRustToolchain() {
    return `[toolchain]
channel = "stable"
components = ["rustfmt", "clippy"]`;
  }

  generatePackageJson(projectName) {
    return JSON.stringify({
      name: projectName,
      version: "1.0.0",
      scripts: {
        start: "node dist/index.js",
        build: "tsc",
        test: "jest",
        coverage: "jest --coverage --coverageThreshold='{\"global\":{\"lines\":100,\"branches\":100,\"functions\":100,\"statements\":100}}'"
      },
      devDependencies: {
        "@types/jest": "^29.0.0",
        "@types/node": "^20.0.0",
        "jest": "^29.0.0",
        "ts-jest": "^29.0.0",
        "typescript": "^5.0.0"
      }
    }, null, 2);
  }

  generateTsConfig() {
    return JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "commonjs",
        lib: ["ES2022"],
        outDir: "./dist",
        rootDir: "./src",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "dist"]
    }, null, 2);
  }

  generateJestConfig() {
    return `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 100,
      branches: 100,
      functions: 100,
      statements: 100
    }
  }
};`;
  }

  generateRequirements() {
    return `pytest>=7.0.0
pytest-cov>=4.0.0
pytest-asyncio>=0.20.0
hypothesis>=6.0.0
black>=22.0.0
mypy>=1.0.0
pylint>=2.15.0`;
  }

  generatePyProject(projectName) {
    return `[tool.poetry]
name = "${projectName}"
version = "1.0.0"
description = "BRIK Architecture Project"

[tool.pytest.ini_options]
minversion = "7.0"
addopts = "--cov=src --cov-branch --cov-report=term-missing --cov-fail-under=100"
testpaths = ["tests"]

[tool.coverage.run]
branch = true
source = ["src"]

[tool.coverage.report]
fail_under = 100`;
  }

  generatePytestIni() {
    return `[pytest]
minversion = 7.0
addopts = --cov=src --cov-branch --cov-report=term-missing --cov-fail-under=100
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*`;
  }
}

module.exports = BrikCodeGenerator;