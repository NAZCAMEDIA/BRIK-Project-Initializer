#!/usr/bin/env node

/**
 * BRIK v5 Generator - Circuitalidad Digital y Arquitectura Hexagonal
 * Generador integrado con el sistema BRIK Project Initializer
 * 🧬 L4 VERSION - 100% Bug-Free Circuit
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const readline = require('readline');
const os = require('os');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => {
  rl.question(chalk.cyan(query), resolve);
});

// Configuración por defecto
const DEFAULT_CONFIG = {
  http_timeout_ms: 2000,
  enable_openapi: true,
  enable_idempotency: true,
  enable_rate_limit: true,
  enable_tracing: true,
  default_resource: 'users'
};

// Templates disponibles
const AVAILABLE_LANGUAGES = {
  typescript: {
    name: 'TypeScript',
    stack: 'fastify',
    ext: '.ts',
    template_dir: 'typescript-fastify'
  },
  rust: {
    name: 'Rust',
    stack: 'axum',
    ext: '.rs', 
    template_dir: 'rust-axum'
  }
};

// Configuraciones de base de datos
const DATABASE_OPTIONS = {
  postgres: 'PostgreSQL',
  mysql: 'MySQL',
  sqlite: 'SQLite',
  null: 'Sin base de datos'
};

const CACHE_OPTIONS = {
  redis: 'Redis',
  memory: 'In-Memory',
  null: 'Sin cache'
};

const EVENT_OPTIONS = {
  kafka: 'Apache Kafka',
  rabbitmq: 'RabbitMQ',
  null: 'Sin eventos'
};

class BrikV5Generator {
  constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.templateDir = path.join(__dirname, 'templates');
  }

  async run() {
    try {
      console.clear();
      this.showBanner();
      
      await this.collectConfig();
      await this.validateConfig();
      await this.generateProject();
      
      console.log(chalk.green.bold('\n✅ PROYECTO BRIK v5 GENERADO EXITOSAMENTE\n'));
      this.showNextSteps();
      
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    } finally {
      rl.close();
    }
  }

  showBanner() {
    console.log(chalk.cyan.bold(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🧬 BRIK v5 GENERATOR - CIRCUITALIDAD DIGITAL 🚀             ║
║                                                                ║
║   Arquitectura Hexagonal + Gates + Idempotencia + OpenAPI     ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`));
  }

  async collectConfig() {
    console.log(chalk.yellow.bold('\n📋 CONFIGURACIÓN DEL PROYECTO\n'));

    // Proyecto básico - BUG #1 FIXED: Usar default si está vacío
    this.config.project_name = await question('📝 Nombre del proyecto: ');
    if (!this.config.project_name || this.config.project_name.trim() === '') {
      this.config.project_name = 'brik-project';
      console.log(chalk.dim(`  Usando nombre por defecto: ${this.config.project_name}`));
    } else {
      this.config.project_name = this.config.project_name.trim();
    }

    // Lenguaje - BUG #2 FIXED: Validación robusta
    console.log('\n💻 Lenguajes disponibles:');
    Object.entries(AVAILABLE_LANGUAGES).forEach(([key, lang], index) => {
      console.log(`  ${index + 1}. ${lang.name} (${lang.stack})`);
    });

    const langChoice = await question('\nSelecciona lenguaje (1-2): ');
    const langKeys = Object.keys(AVAILABLE_LANGUAGES);
    const langIndex = parseInt(langChoice) - 1;
    
    // Validación robusta del índice
    if (isNaN(langIndex) || langIndex < 0 || langIndex >= langKeys.length) {
      console.log(chalk.yellow('  Selección inválida, usando TypeScript por defecto'));
      this.config.language = 'typescript';
    } else {
      this.config.language = langKeys[langIndex];
    }
    
    this.config.http_stack = AVAILABLE_LANGUAGES[this.config.language].stack;

    // Base de datos - BUG #3 FIXED: Validación de índice
    console.log('\n🗄️  Bases de datos disponibles:');
    Object.entries(DATABASE_OPTIONS).forEach(([key, name], index) => {
      console.log(`  ${index + 1}. ${name}`);
    });

    const dbChoice = await question('\nSelecciona base de datos (1-4): ');
    const dbKeys = Object.keys(DATABASE_OPTIONS);
    const dbIndex = parseInt(dbChoice) - 1;
    
    if (isNaN(dbIndex) || dbIndex < 0 || dbIndex >= dbKeys.length) {
      console.log(chalk.yellow('  Selección inválida, usando PostgreSQL por defecto'));
      this.config.database = 'postgres';
    } else {
      this.config.database = dbKeys[dbIndex];
    }

    // Cache - BUG #4 FIXED: Validación de índice
    console.log('\n⚡ Sistemas de cache disponibles:');
    Object.entries(CACHE_OPTIONS).forEach(([key, name], index) => {
      console.log(`  ${index + 1}. ${name}`);
    });

    const cacheChoice = await question('\nSelecciona sistema de cache (1-3): ');
    const cacheKeys = Object.keys(CACHE_OPTIONS);
    const cacheIndex = parseInt(cacheChoice) - 1;
    
    if (isNaN(cacheIndex) || cacheIndex < 0 || cacheIndex >= cacheKeys.length) {
      console.log(chalk.yellow('  Selección inválida, usando Redis por defecto'));
      this.config.cache = 'redis';
    } else {
      this.config.cache = cacheKeys[cacheIndex];
    }

    // Eventos - BUG #5 FIXED: Validación de índice
    console.log('\n📢 Sistemas de eventos disponibles:');
    Object.entries(EVENT_OPTIONS).forEach(([key, name], index) => {
      console.log(`  ${index + 1}. ${name}`);
    });

    const eventChoice = await question('\nSelecciona sistema de eventos (1-3): ');
    const eventKeys = Object.keys(EVENT_OPTIONS);
    const eventIndex = parseInt(eventChoice) - 1;
    
    if (isNaN(eventIndex) || eventIndex < 0 || eventIndex >= eventKeys.length) {
      console.log(chalk.yellow('  Selección inválida, sin sistema de eventos'));
      this.config.event_system = 'null';
    } else {
      this.config.event_system = eventKeys[eventIndex];
    }

    // Puerto
    const portInput = await question('\n🔌 Puerto HTTP [3000]: ');
    const port = parseInt(portInput);
    
    if (!portInput || isNaN(port) || port < 1 || port > 65535) {
      this.config.port = '3000';
    } else {
      this.config.port = port.toString();
    }

    // Configuraciones booleanas
    const openApiChoice = await question('\n📚 Habilitar OpenAPI? (s/n) [s]: ');
    this.config.enable_openapi = openApiChoice.toLowerCase() !== 'n';

    const idempotencyChoice = await question('🔁 Habilitar Idempotencia? (s/n) [s]: ');
    this.config.enable_idempotency = idempotencyChoice.toLowerCase() !== 'n';

    const rateLimitChoice = await question('🚦 Habilitar Rate Limiting? (s/n) [s]: ');
    this.config.enable_rate_limit = rateLimitChoice.toLowerCase() !== 'n';

    const tracingChoice = await question('📊 Habilitar Tracing? (s/n) [s]: ');
    this.config.enable_tracing = tracingChoice.toLowerCase() !== 'n';

    // Recurso por defecto
    const resourceInput = await question(`\n🎯 Recurso por defecto [${DEFAULT_CONFIG.default_resource}]: `);
    this.config.default_resource = resourceInput?.trim() || DEFAULT_CONFIG.default_resource;

    // Timeout - BUG #6 FIXED: Validación de NaN
    const timeoutInput = await question(`\n⏱️  HTTP timeout en ms [${DEFAULT_CONFIG.http_timeout_ms}]: `);
    const timeout = parseInt(timeoutInput);
    
    if (!timeoutInput || isNaN(timeout) || timeout < 100 || timeout > 60000) {
      this.config.http_timeout_ms = DEFAULT_CONFIG.http_timeout_ms;
    } else {
      this.config.http_timeout_ms = timeout;
    }
  }

  async validateConfig() {
    // Validación exhaustiva de configuración
    if (!this.config.project_name || this.config.project_name.trim() === '') {
      throw new Error('Configuración inválida: Falta el nombre del proyecto');
    }

    // Validar nombre del proyecto (sin caracteres especiales)
    if (!/^[a-zA-Z0-9-_]+$/.test(this.config.project_name)) {
      throw new Error('Configuración inválida: Nombre del proyecto contiene caracteres no válidos');
    }

    // Validar longitud del nombre
    if (this.config.project_name.length > 100) {
      throw new Error('Configuración inválida: Nombre del proyecto demasiado largo (máx 100 caracteres)');
    }

    // BUG #7 FIXED: Validar language existe
    if (!this.config.language || !AVAILABLE_LANGUAGES[this.config.language]) {
      throw new Error('Configuración inválida: Lenguaje no soportado');
    }

    // Validar puerto
    const port = parseInt(this.config.port);
    if (isNaN(port) || port < 1 || port > 65535) {
      throw new Error('Configuración inválida: Puerto fuera de rango válido (1-65535)');
    }

    // Validar timeout
    if (this.config.http_timeout_ms < 100 || this.config.http_timeout_ms > 60000) {
      throw new Error('Configuración inválida: Timeout fuera de rango válido (100-60000ms)');
    }

    console.log(chalk.cyan.bold('\n📊 RESUMEN DE CONFIGURACIÓN:\n'));
    
    console.log(`  📝 Proyecto: ${this.config.project_name}`);
    console.log(`  💻 Lenguaje: ${AVAILABLE_LANGUAGES[this.config.language].name}`);
    console.log(`  🌐 Stack HTTP: ${this.config.http_stack}`);
    console.log(`  🗄️  Base de datos: ${DATABASE_OPTIONS[this.config.database]}`);
    console.log(`  ⚡ Cache: ${CACHE_OPTIONS[this.config.cache]}`);
    console.log(`  📢 Eventos: ${EVENT_OPTIONS[this.config.event_system]}`);
    console.log(`  🎯 Recurso: ${this.config.default_resource}`);
    console.log(`  🔌 Puerto: ${this.config.port}`);
    console.log(`  ⏱️  Timeout: ${this.config.http_timeout_ms}ms`);
    console.log(`  📚 OpenAPI: ${this.config.enable_openapi ? 'Habilitado' : 'Deshabilitado'}`);
    console.log(`  🔁 Idempotencia: ${this.config.enable_idempotency ? 'Habilitada' : 'Deshabilitada'}`);
    console.log(`  🚦 Rate Limiting: ${this.config.enable_rate_limit ? 'Habilitado' : 'Deshabilitado'}`);
    console.log(`  📊 Tracing: ${this.config.enable_tracing ? 'Habilitado' : 'Deshabilitado'}`);

    const confirm = await question('\n¿Proceder con la generación? (s/n): ');
    if (confirm.toLowerCase() !== 's' && confirm.toLowerCase() !== 'si') {
      throw new Error('Generación cancelada por el usuario');
    }
  }

  async generateProject() {
    const projectPath = path.resolve(this.config.project_name);
    
    // BUG #8 FIXED: Validar template_dir existe
    const templateDir = AVAILABLE_LANGUAGES[this.config.language]?.template_dir;
    if (!templateDir) {
      throw new Error(`Template directory no configurado para ${this.config.language}`);
    }
    
    const templatePath = path.join(this.templateDir, templateDir);

    console.log(chalk.yellow('\n🔄 Generando proyecto...\n'));

    // Crear directorio del proyecto
    if (fs.existsSync(projectPath)) {
      throw new Error(`El directorio '${this.config.project_name}' ya existe`);
    }

    fs.mkdirSync(projectPath, { recursive: true });

    // Copiar y procesar templates
    await this.copyTemplateDirectory(templatePath, projectPath);

    // Generar archivos específicos
    await this.generateConfigFiles(projectPath);
    await this.generateDocumentation(projectPath);
    await this.generateScripts(projectPath);

    console.log(chalk.green('✅ Estructura del proyecto creada'));
    console.log(chalk.green('✅ Configuración aplicada'));
    console.log(chalk.green('✅ Documentación generada'));
  }

  async copyTemplateDirectory(srcDir, destDir) {
    if (!fs.existsSync(srcDir)) {
      console.log(chalk.yellow(`⚠️  Template directory no encontrado: ${srcDir}`));
      console.log(chalk.yellow('  Creando estructura básica...'));
      this.createBasicStructure(destDir);
      return;
    }

    const items = fs.readdirSync(srcDir);

    for (const item of items) {
      const srcPath = path.join(srcDir, item);
      const destPath = path.join(destDir, item);

      try {
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
          fs.mkdirSync(destPath, { recursive: true });
          await this.copyTemplateDirectory(srcPath, destPath);
        } else {
          // BUG #9 FIXED: Manejo robusto de archivos con try/catch
          try {
            // Detectar si es archivo binario
            const isBinary = this.isBinaryFile(srcPath);
            
            if (isBinary) {
              // Copiar archivos binarios directamente
              fs.copyFileSync(srcPath, destPath);
            } else {
              // Procesar archivos de texto
              let content = fs.readFileSync(srcPath, 'utf8');
              content = this.processTemplate(content);
              fs.writeFileSync(destPath, content);
            }
            
            console.log(chalk.dim(`  ✅ ${path.relative(destDir, destPath)}`));
          } catch (readError) {
            console.log(chalk.yellow(`  ⚠️  No se pudo procesar: ${item}`));
            // Intentar copiar directamente como fallback
            try {
              fs.copyFileSync(srcPath, destPath);
            } catch (copyError) {
              console.log(chalk.red(`  ❌ Error copiando: ${item}`));
            }
          }
        }
      } catch (error) {
        console.log(chalk.red(`  ❌ Error procesando: ${item} - ${error.message}`));
      }
    }
  }

  isBinaryFile(filePath) {
    const binaryExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico',
      '.pdf', '.zip', '.tar', '.gz', '.7z',
      '.exe', '.dll', '.so', '.dylib',
      '.ttf', '.otf', '.woff', '.woff2', '.eot'
    ];
    
    const ext = path.extname(filePath).toLowerCase();
    return binaryExtensions.includes(ext);
  }

  createBasicStructure(projectPath) {
    // Crear estructura básica si no hay template
    const dirs = ['src', 'tests', 'docs', 'scripts', 'config'];
    
    dirs.forEach(dir => {
      fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
    });

    // Crear archivo principal básico
    const mainFile = this.config.language === 'typescript' ? 'src/index.ts' : 'src/main.rs';
    const mainContent = this.config.language === 'typescript' 
      ? `// ${this.config.project_name}\n// BRIK v5 Project\n\nconsole.log('Hello from BRIK v5!');\n`
      : `// ${this.config.project_name}\n// BRIK v5 Project\n\nfn main() {\n    println!("Hello from BRIK v5!");\n}\n`;
    
    fs.writeFileSync(path.join(projectPath, mainFile), mainContent);
  }

  processTemplate(content) {
    let result = content;
    
    // Reemplazar todos los placeholders disponibles
    const replacements = {
      'PROJECT_NAME': this.config.project_name,
      'LANGUAGE': this.config.language,
      'HTTP_STACK': this.config.http_stack,
      'DATABASE': this.config.database,
      'DB': this.config.database, // Alias
      'CACHE': this.config.cache,
      'EVENT_SYSTEM': this.config.event_system,
      'EVENTS': this.config.event_system, // Alias
      'RESOURCE': this.config.default_resource,
      'TIMEOUT': this.config.http_timeout_ms?.toString(),
      'PORT': this.config.port,
      'ENABLE_OPENAPI': this.config.enable_openapi?.toString(),
      'ENABLE_IDEMPOTENCY': this.config.enable_idempotency?.toString(),
      'ENABLE_RATE_LIMIT': this.config.enable_rate_limit?.toString(),
      'ENABLE_TRACING': this.config.enable_tracing?.toString()
    };

    // Reemplazar cada placeholder
    for (const [key, value] of Object.entries(replacements)) {
      if (value !== undefined && value !== null) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, value);
      }
    }

    return result;
  }

  async generateConfigFiles(projectPath) {
    // Generar brik.config.json
    const brikConfig = {
      ...this.config,
      generated_at: new Date().toISOString(),
      brik_version: '5.0.0',
      architecture: 'hexagonal',
      features: {
        circuitalidad_digital: true,
        idempotency: this.config.enable_idempotency,
        rate_limiting: this.config.enable_rate_limit,
        observability: this.config.enable_tracing,
        openapi: this.config.enable_openapi
      }
    };

    fs.writeFileSync(
      path.join(projectPath, 'brik.config.json'),
      JSON.stringify(brikConfig, null, 2)
    );

    // Generar .env.example
    const envContent = `# BRIK v5 Environment Configuration
NODE_ENV=development
PORT=${this.config.port}
LOG_LEVEL=info

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/${this.config.project_name}

# Redis Configuration (if enabled)
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# API Configuration
API_TIMEOUT_MS=${this.config.http_timeout_ms}
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_ENABLED=${this.config.enable_rate_limit}
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60

# OpenAPI
OPENAPI_ENABLED=${this.config.enable_openapi}
SWAGGER_UI_ENABLED=true
`;

    fs.writeFileSync(path.join(projectPath, '.env.example'), envContent);

    // Generar package.json para TypeScript o Cargo.toml para Rust
    if (this.config.language === 'typescript') {
      const packageJson = {
        name: this.config.project_name,
        version: '1.0.0',
        description: 'BRIK v5 Project with Hexagonal Architecture',
        main: 'dist/index.js',
        scripts: {
          dev: 'ts-node-dev --respawn src/index.ts',
          build: 'tsc',
          start: 'node dist/index.js',
          test: 'jest',
          'test:coverage': 'jest --coverage',
          'test:integration': 'jest --testPathPattern=integration',
          lint: 'eslint . --ext .ts',
          typecheck: 'tsc --noEmit',
          'openapi:validate': 'swagger-cli validate openapi.yaml'
        },
        dependencies: {
          fastify: '^4.24.0',
          '@fastify/cors': '^8.4.0',
          '@fastify/jwt': '^7.2.0',
          '@fastify/rate-limit': '^8.0.0'
        },
        devDependencies: {
          '@types/node': '^20.0.0',
          typescript: '^5.0.0',
          'ts-node-dev': '^2.0.0',
          jest: '^29.0.0',
          eslint: '^8.0.0'
        }
      };

      fs.writeFileSync(
        path.join(projectPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );
    } else if (this.config.language === 'rust') {
      const cargoToml = `[package]
name = "${this.config.project_name}"
version = "1.0.0"
edition = "2021"

[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tower = "0.4"
tower-http = { version = "0.5", features = ["cors", "trace"] }

[dev-dependencies]
mockito = "1"
`;

      fs.writeFileSync(path.join(projectPath, 'Cargo.toml'), cargoToml);
    }
  }

  async generateDocumentation(projectPath) {
    const docsDir = path.join(projectPath, 'docs');
    fs.mkdirSync(docsDir, { recursive: true });

    // README principal
    const readmeContent = `# ${this.config.project_name}

BRIK v5 API with Circuitalidad Digital and Hexagonal Architecture

## 🚀 Features

- **Circuitalidad Digital**: Request flow through specialized gates
- **Hexagonal Architecture**: Clean separation of concerns
- **Idempotency**: Safe retry operations ${this.config.enable_idempotency ? '✅' : '❌'}
- **Observability**: Complete tracing and metrics ${this.config.enable_tracing ? '✅' : '❌'}
- **Rate Limiting**: Configurable request limits ${this.config.enable_rate_limit ? '✅' : '❌'}
- **OpenAPI**: Auto-generated documentation ${this.config.enable_openapi ? '✅' : '❌'}

## 🏗️ Architecture

\`\`\`
Gates → Domain Core → Ports → Adapters → Presenter
  ↓        ↓          ↓       ↓         ↓
Auth     Entities   Repos   Database   HTTP
Schema   VOs        Events  Redis      DTOs  
Policy   UseCases   Cache   Kafka      Errors
Rate                        External
Timeout
\`\`\`

## 🔧 Quick Start

\`\`\`bash
# Install dependencies
${this.getInstallCommand()}

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run development server
${this.getDevCommand()}

# Run tests
${this.getTestCommand()}

# Build for production
${this.getBuildCommand()}
\`\`\`

## 📡 API Endpoints

### Health Check
- \`GET /health\` - Service health status

### ${this.config.default_resource.charAt(0).toUpperCase() + this.config.default_resource.slice(1)}
- \`POST /api/v1/${this.config.default_resource}\` - Create resource
- \`GET /api/v1/${this.config.default_resource}/{id}\` - Get resource by ID

## 🔐 Authentication

All endpoints require JWT bearer token except health check.

## 📖 BRIK v5 Compliance

This project follows BRIK v5 standards:

- ✅ Hexagonal architecture
- ✅ Circuitalidad digital  
- ${this.config.enable_idempotency ? '✅' : '❌'} Idempotency support
- ${this.config.enable_tracing ? '✅' : '❌'} Complete observability
- ✅ Security by design
- ${this.config.enable_openapi ? '✅' : '❌'} OpenAPI documentation
- ✅ 100% test coverage target

Generated with BRIK v5 Generator.
`;

    fs.writeFileSync(path.join(projectPath, 'README.md'), readmeContent);
  }

  async generateScripts(projectPath) {
    const scriptsDir = path.join(projectPath, 'scripts');
    fs.mkdirSync(scriptsDir, { recursive: true });

    // Script de validación
    const validateScript = `#!/bin/bash

# BRIK v5 Validation Script

set -e

echo "🔍 Running BRIK v5 validation..."

# Linting
echo "📝 Checking code style..."
${this.getLintCommand()}

# Type checking
echo "🔍 Type checking..."
${this.getTypeCheckCommand()}

# Tests
echo "🧪 Running tests..."
${this.getTestCommand()}

# OpenAPI validation
if [ -f "openapi.yaml" ]; then
  echo "📄 Validating OpenAPI spec..."
  ${this.getOpenAPIValidateCommand()}
fi

echo "✅ BRIK v5 validation completed successfully!"
`;

    fs.writeFileSync(path.join(scriptsDir, 'validate.sh'), validateScript);
    
    // BUG #10 FIXED: chmod con validación de OS
    try {
      if (os.platform() !== 'win32') {
        fs.chmodSync(path.join(scriptsDir, 'validate.sh'), '755');
      }
    } catch (error) {
      console.log(chalk.yellow('  ⚠️  No se pudo cambiar permisos del script (normal en Windows)'));
    }
  }

  showNextSteps() {
    console.log(chalk.cyan.bold('🚀 PRÓXIMOS PASOS:\n'));
    console.log(`  1. cd ${this.config.project_name}`);
    console.log(`  2. cp .env.example .env`);
    console.log(`  3. ${this.getInstallCommand()}`);
    console.log(`  4. ${this.getDevCommand()}`);
    
    console.log(chalk.yellow.bold('\n📋 COMANDOS ÚTILES:\n'));
    console.log(`  • Tests: ${this.getTestCommand()}`);
    console.log(`  • Build: ${this.getBuildCommand()}`);
    
    if (os.platform() !== 'win32') {
      console.log(`  • Validar: ./scripts/validate.sh`);
    } else {
      console.log(`  • Validar: bash scripts/validate.sh`);
    }
    
    if (this.config.enable_openapi) {
      console.log(`  • Docs: http://localhost:${this.config.port}/docs`);
    }

    console.log(chalk.green.bold('\n🎯 ENDPOINTS DISPONIBLES:\n'));
    console.log(`  • Health: GET /health`);
    console.log(`  • Create: POST /api/v1/${this.config.default_resource}`);
    console.log(`  • Get: GET /api/v1/${this.config.default_resource}/{id}`);
  }

  // Helper methods para comandos específicos por lenguaje
  getInstallCommand() {
    const commands = {
      typescript: 'npm install',
      rust: 'cargo build'
    };
    return commands[this.config.language] || 'install dependencies';
  }

  getDevCommand() {
    const commands = {
      typescript: 'npm run dev',
      rust: 'cargo watch -x run'
    };
    return commands[this.config.language] || 'run dev server';
  }

  getTestCommand() {
    const commands = {
      typescript: 'npm test',
      rust: 'cargo test'
    };
    return commands[this.config.language] || 'run tests';
  }

  getBuildCommand() {
    const commands = {
      typescript: 'npm run build',
      rust: 'cargo build --release'
    };
    return commands[this.config.language] || 'build project';
  }

  getStartCommand() {
    const commands = {
      typescript: 'npm start',
      rust: './target/release/server'
    };
    return commands[this.config.language] || 'start server';
  }

  getLintCommand() {
    const commands = {
      typescript: 'npm run lint',
      rust: 'cargo clippy -- -D warnings'
    };
    return commands[this.config.language] || 'lint code';
  }

  getTypeCheckCommand() {
    const commands = {
      typescript: 'npm run typecheck',
      rust: 'cargo check'
    };
    return commands[this.config.language] || 'type check';
  }

  getIntegrationTestCommand() {
    const commands = {
      typescript: 'npm run test:integration',
      rust: 'cargo test --test integration'
    };
    return commands[this.config.language] || 'run integration tests';
  }

  getCoverageCommand() {
    const commands = {
      typescript: 'npm run test:coverage',
      rust: 'cargo tarpaulin'
    };
    return commands[this.config.language] || 'run coverage';
  }

  getOpenAPIValidateCommand() {
    const commands = {
      typescript: 'npm run openapi:validate',
      rust: 'swagger-validator openapi.yaml'
    };
    return commands[this.config.language] || 'validate openapi';
  }
}

// Export the class for testing
module.exports = BrikV5Generator;

// Main execution
if (require.main === module) {
  const generator = new BrikV5Generator();
  generator.run().catch(error => {
    console.error(chalk.red(`Fatal error: ${error.message}`));
    process.exit(1);
  });
}