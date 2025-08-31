#!/usr/bin/env node

/**
 * BRIK v5 Generator - Circuitalidad Digital y Arquitectura Hexagonal
 * Generador integrado con el sistema BRIK Project Initializer
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const readline = require('readline');

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
      
      console.log(chalk.green.bold('\\n✅ PROYECTO BRIK v5 GENERADO EXITOSAMENTE\\n'));
      this.showNextSteps();
      
    } catch (error) {
      console.error(chalk.red(`\\n❌ Error: ${error.message}`));
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
    console.log(chalk.yellow.bold('\\n📋 CONFIGURACIÓN DEL PROYECTO\\n'));

    // Proyecto básico
    this.config.project_name = await question('📝 Nombre del proyecto: ');
    if (!this.config.project_name) {
      throw new Error('El nombre del proyecto es obligatorio');
    }

    // Lenguaje
    console.log('\\n💻 Lenguajes disponibles:');
    Object.entries(AVAILABLE_LANGUAGES).forEach(([key, lang], index) => {
      console.log(`  ${index + 1}. ${lang.name} (${lang.stack})`);
    });

    const langChoice = await question('\\nSelecciona lenguaje (1-2): ');
    const langKeys = Object.keys(AVAILABLE_LANGUAGES);
    const selectedLang = langKeys[parseInt(langChoice) - 1];
    
    if (!selectedLang) {
      throw new Error('Selección de lenguaje inválida');
    }
    
    this.config.language = selectedLang;
    this.config.http_stack = AVAILABLE_LANGUAGES[selectedLang].stack;

    // Base de datos
    console.log('\\n🗄️  Bases de datos disponibles:');
    Object.entries(DATABASE_OPTIONS).forEach(([key, name], index) => {
      console.log(`  ${index + 1}. ${name}`);
    });

    const dbChoice = await question('\\nSelecciona base de datos (1-4): ');
    const dbKeys = Object.keys(DATABASE_OPTIONS);
    this.config.db = dbKeys[parseInt(dbChoice) - 1] || 'null';

    // Cache
    console.log('\\n⚡ Sistemas de cache disponibles:');
    Object.entries(CACHE_OPTIONS).forEach(([key, name], index) => {
      console.log(`  ${index + 1}. ${name}`);
    });

    const cacheChoice = await question('\\nSelecciona sistema de cache (1-3): ');
    const cacheKeys = Object.keys(CACHE_OPTIONS);
    this.config.cache = cacheKeys[parseInt(cacheChoice) - 1] || 'null';

    // Eventos
    console.log('\\n📢 Sistemas de eventos disponibles:');
    Object.entries(EVENT_OPTIONS).forEach(([key, name], index) => {
      console.log(`  ${index + 1}. ${name}`);
    });

    const eventChoice = await question('\\nSelecciona sistema de eventos (1-3): ');
    const eventKeys = Object.keys(EVENT_OPTIONS);
    this.config.events = eventKeys[parseInt(eventChoice) - 1] || 'null';

    // Recurso por defecto
    this.config.default_resource = await question(`\\n🎯 Recurso por defecto [${DEFAULT_CONFIG.default_resource}]: `) 
      || DEFAULT_CONFIG.default_resource;

    // Timeout
    const timeout = await question(`\\n⏱️  HTTP timeout en ms [${DEFAULT_CONFIG.http_timeout_ms}]: `);
    this.config.http_timeout_ms = parseInt(timeout) || DEFAULT_CONFIG.http_timeout_ms;
  }

  async validateConfig() {
    console.log(chalk.cyan.bold('\\n📊 RESUMEN DE CONFIGURACIÓN:\\n'));
    
    console.log(`  📝 Proyecto: ${this.config.project_name}`);
    console.log(`  💻 Lenguaje: ${AVAILABLE_LANGUAGES[this.config.language].name}`);
    console.log(`  🌐 Stack HTTP: ${this.config.http_stack}`);
    console.log(`  🗄️  Base de datos: ${DATABASE_OPTIONS[this.config.db]}`);
    console.log(`  ⚡ Cache: ${CACHE_OPTIONS[this.config.cache]}`);
    console.log(`  📢 Eventos: ${EVENT_OPTIONS[this.config.events]}`);
    console.log(`  🎯 Recurso: ${this.config.default_resource}`);
    console.log(`  ⏱️  Timeout: ${this.config.http_timeout_ms}ms`);

    const confirm = await question('\\n¿Proceder con la generación? (s/n): ');
    if (confirm.toLowerCase() !== 's') {
      throw new Error('Generación cancelada por el usuario');
    }
  }

  async generateProject() {
    const projectPath = path.resolve(this.config.project_name);
    const templatePath = path.join(this.templateDir, AVAILABLE_LANGUAGES[this.config.language].template_dir);

    console.log(chalk.yellow('\\n🔄 Generando proyecto...\\n'));

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
      throw new Error(`Template directory no encontrado: ${srcDir}`);
    }

    const items = fs.readdirSync(srcDir);

    for (const item of items) {
      const srcPath = path.join(srcDir, item);
      const destPath = path.join(destDir, item);

      const stat = fs.statSync(srcPath);

      if (stat.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        await this.copyTemplateDirectory(srcPath, destPath);
      } else {
        let content = fs.readFileSync(srcPath, 'utf8');
        
        // Procesar placeholders
        content = this.processTemplate(content);
        
        fs.writeFileSync(destPath, content);
        console.log(chalk.dim(`  ✅ ${path.relative(destDir, destPath)}`));
      }
    }
  }

  processTemplate(content) {
    return content
      .replace(/\\{\\{PROJECT_NAME\\}\\}/g, this.config.project_name)
      .replace(/\\{\\{LANGUAGE\\}\\}/g, this.config.language)
      .replace(/\\{\\{HTTP_STACK\\}\\}/g, this.config.http_stack)
      .replace(/\\{\\{DATABASE\\}\\}/g, this.config.db)
      .replace(/\\{\\{CACHE\\}\\}/g, this.config.cache)
      .replace(/\\{\\{EVENTS\\}\\}/g, this.config.events)
      .replace(/\\{\\{RESOURCE\\}\\}/g, this.config.default_resource)
      .replace(/\\{\\{TIMEOUT\\}\\}/g, this.config.http_timeout_ms.toString());
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
PORT=3000
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
- **Idempotency**: Safe retry operations with Idempotency-Key
- **Observability**: Complete tracing and metrics
- **Rate Limiting**: Configurable request limits
- **OpenAPI**: Auto-generated documentation

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
- \`POST /api/v1/${this.config.default_resource}\` - Create ${this.config.default_resource.slice(0, -1)}
- \`GET /api/v1/${this.config.default_resource}/{id}\` - Get ${this.config.default_resource.slice(0, -1)} by ID

## 🔐 Authentication

All endpoints require JWT bearer token except health check.

Required scopes:
- \`${this.config.default_resource}:create\` - Create operations  
- \`${this.config.default_resource}:read\` - Read operations

## 🔁 Idempotency

POST operations support idempotency via \`Idempotency-Key\` header:

\`\`\`http
POST /api/v1/${this.config.default_resource}
Content-Type: application/json
Idempotency-Key: ${this.config.default_resource}-creation-2024-01-15-abc123
Authorization: Bearer <jwt-token>

{
  "name": "Example",
  "email": "user@example.com"
}
\`\`\`

## 📊 Observability

All requests include:
- \`X-Correlation-Id\` - Request tracing
- Structured logs with correlation
- Metrics for gates, domain, and ports
- Performance timing (p50, p95, p99)

## 🛡️ Security

- JWT token validation
- Scope-based authorization
- Rate limiting per user/IP
- Input validation and sanitization
- CORS protection

## 📚 Documentation

- OpenAPI spec: \`/docs\` endpoint
- Swagger UI: \`/swagger\` endpoint  
- Architecture guide: \`docs/brikv5-endpoints.md\`

## 🧪 Testing

\`\`\`bash
# Unit tests
${this.getTestCommand()}

# Integration tests  
${this.getIntegrationTestCommand()}

# Coverage report
${this.getCoverageCommand()}
\`\`\`

## 🚀 Deployment

\`\`\`bash
# Build production
${this.getBuildCommand()}

# Start production server
${this.getStartCommand()}
\`\`\`

## 📖 BRIK v5 Compliance

This project follows BRIK v5 standards:

- ✅ Hexagonal architecture
- ✅ Circuitalidad digital  
- ✅ Idempotency support
- ✅ Complete observability
- ✅ Security by design
- ✅ OpenAPI documentation
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
    fs.chmodSync(path.join(scriptsDir, 'validate.sh'), '755');
  }

  showNextSteps() {
    console.log(chalk.cyan.bold('🚀 PRÓXIMOS PASOS:\\n'));
    console.log(`  1. cd ${this.config.project_name}`);
    console.log(`  2. cp .env.example .env`);
    console.log(`  3. ${this.getInstallCommand()}`);
    console.log(`  4. ${this.getDevCommand()}`);
    
    console.log(chalk.yellow.bold('\\n📋 COMANDOS ÚTILES:\\n'));
    console.log(`  • Tests: ${this.getTestCommand()}`);
    console.log(`  • Build: ${this.getBuildCommand()}`);
    console.log(`  • Validar: ./scripts/validate.sh`);
    
    if (this.config.enable_openapi) {
      console.log(`  • Docs: http://localhost:3000/docs`);
    }

    console.log(chalk.green.bold('\\n🎯 ENDPOINTS DISPONIBLES:\\n'));
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
      rust: 'cargo run'
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

// Main execution
if (require.main === module) {
  const generator = new BrikV5Generator();
  generator.run().catch(error => {
    console.error(chalk.red(`Fatal error: ${error.message}`));
    process.exit(1);
  });
}

module.exports = BrikV5Generator;