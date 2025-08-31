# 🧬 BRIK Project Initializer v5.1 - Digital Circuitalidad Edition

[![BRIK v5 Certified](https://img.shields.io/badge/BRIK-v5%20Certified-00d4aa?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjMDBENEFBIi8+Cjwvc3ZnPg==)](https://github.com/nazcamedia/brik-project-initializer)
[![Hexagonal Architecture](https://img.shields.io/badge/Architecture-Hexagonal-blue?style=for-the-badge)](docs/brikv5-endpoints.md)
[![Digital Circuitalidad](https://img.shields.io/badge/Circuitalidad-Digital-purple?style=for-the-badge)](docs/brikv5-endpoints.md)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Claude AI](https://img.shields.io/badge/Claude-Pro%2FMax%20Compatible-FF6B35?style=for-the-badge&logo=anthropic)](https://claude.ai)

## 🎯 Sistema Completo de Generación BRIK con **Circuitalidad Digital**

### ✨ La plataforma más avanzada para crear APIs enterprise-ready con arquitectura hexagonal

---

## 🚀 ¿Qué es BRIK v5.1 Digital Circuitalidad Edition?

**BRIK v5.1** revoluciona la creación de APIs combinando:

- 🧬 **Circuitalidad Digital**: Flujo Gates → Núcleo → Puertos → Presenter
- 🏗️ **Arquitectura Hexagonal Pura**: Separación estricta de responsabilidades
- 🛡️ **Idempotencia Nativa**: SHA-256 + cache + conflict detection
- 📊 **Observabilidad Total**: Correlation ID + structured logging + metrics
- 🤖 **IA Multi-Engine**: Claude Pro/Max + Agentes especializados
- ⚡ **Templates Multi-Stack**: TypeScript/Fastify + Rust/Axum + OpenAPI 3.0

### ⚡ De Idea a API Producción en < 3 Minutos

```bash
# De esto...
brik-v5
# Wizard interactivo: TypeScript, PostgreSQL, Redis, users

# A esto... API completa con circuitalidad digital
├── src/api/users/
│   ├── gates/                    # Sistema de gates completo
│   │   ├── auth-gate.ts         # JWT + RBAC + scopes
│   │   ├── schema-gate.ts       # Zod validation + sanitización  
│   │   ├── idempotency-gate.ts  # SHA-256 + cache + conflicts
│   │   └── rate-gate.ts         # Rate limiting inteligente
│   ├── domain/                   # Núcleo inmutable puro
│   │   ├── entities/user.ts     # Entidades + invariantes
│   │   └── use-cases/           # Casos de uso puros
│   ├── ports/                    # Interfaces de contratos
│   ├── adapters/                 # Implementaciones externas
│   └── presenter/                # HTTP DTOs + error mapping
├── openapi.yaml                  # Documentación auto-generada
├── jest.config.js               # Tests 80%+ coverage
└── .github/workflows/           # CI/CD con validación BRIK
```

---

## 🧠 Modos de Operación

### 🆕 **BRIK v5 Generator** (Circuitalidad Digital)
Sistema de **arquitectura hexagonal** con circuito de gates inteligente:

```bash
brik-v5  # Nuevo comando CLI integrado
```

**Circuito Digital Completo**:
```
HTTP Request → AuthGate → SchemaGate → PolicyGate → IdempotencyGate → RateGate → TimeoutGate
                ↓
            Domain Core (Pure) → Ports → Adapters → Presenter → HTTP Response
```

### 🤖 **Modo IA Inteligente** (Agentes Claude)
Pipeline LLM con **agentes especializados**:

```bash
brik  # Claude Pro/Max con automatización web
```

### 🎯 **Modo Tradicional** (Scaffolding Clásico)
```bash
brik-traditional  # Generación clásica BRIK
```

---

## 🚀 Inicio Rápido

### 🔥 **BRIK v5 - Circuitalidad Digital** (Recomendado)

```bash
# Instalar globalmente
npm install -g .

# Generar API con arquitectura hexagonal
brik-v5

# El wizard te guiará:
# 📝 Nombre del proyecto
# 💻 Lenguaje (TypeScript/Rust)  
# 🗄️ Base de datos (PostgreSQL/MySQL/etc)
# ⚡ Cache (Redis/Memory)
# 📢 Eventos (Kafka/RabbitMQ)
# 🎯 Recurso principal (users/products/etc)

# Resultado: API completa con:
# ✅ Gates system (Auth, Schema, Idempotency, Rate)
# ✅ Hexagonal architecture
# ✅ OpenAPI 3.0 spec
# ✅ Test suites completas
# ✅ CI/CD pipeline
```

### 🤖 **IA Mode - Claude Pro/Max**

```bash
# Con Claude Pro/Max subscription
brik

# Modo conversacional inteligente:
# "Crear API e-commerce con usuarios, productos y pagos Stripe"
# → Análisis automático + generación completa
```

---

## 🧬 **Arquitectura BRIK v5: Circuitalidad Digital**

### 🛡️ **Sistema de Gates** (Circuit Pattern)

Cada request fluye por un circuito de validación antes de llegar al core:

```typescript
// AuthGate - JWT + RBAC + Scopes
const authResult = await authGate.validate(request);
if (!authResult.isSuccess) return authResult.error;

// SchemaGate - Zod Validation + Sanitization  
const schemaResult = await schemaGate.validate(request.body);
if (!schemaResult.isSuccess) return schemaResult.error;

// IdempotencyGate - SHA-256 + Cache + Conflict Detection
const idempotencyResult = await idempotencyGate.validate({
  idempotencyKey: request.headers['idempotency-key'],
  payload: request.body
});
if (idempotencyResult.isDuplicate) return idempotencyResult.cachedResult;

// RateGate - Rate Limiting + Sliding Windows
const rateResult = await rateGate.validate(request.userContext);
if (!rateResult.allowed) return rateResult.error;
```

### 🎯 **Domain Core** (Hexagonal Center)

```typescript
// Pure domain logic - no I/O, no side effects
class User {
  private constructor(
    public readonly id: UserId,
    public readonly email: Email,
    public readonly name: string,
    // ... immutable properties
  ) {}

  static create(data: UserCreationData): Result<User, DomainError> {
    // Validation + invariants enforcement
    // Returns Result<T, E> for functional error handling
  }
}
```

### 🔌 **Ports & Adapters** (External I/O)

```typescript
// Port (Contract)
interface UserRepository {
  save(user: User): Promise<Result<void, RepositoryError>>;
  findById(id: UserId): Promise<Result<User, RepositoryError>>;
}

// Adapter (Implementation)
class PostgreSQLUserRepository implements UserRepository {
  // Real database integration with circuit breakers
}
```

---

## 🏆 **Features BRIK v5**

### ✨ **Nuevas Características v5.1**

| Feature | Descripción | Status |
|---------|-------------|---------|
| 🛡️ **Gates System** | Auth, Schema, Policy, Idempotency, Rate, Timeout | ✅ |
| 🧬 **Circuitalidad Digital** | Request flow con circuit pattern | ✅ |
| 🏗️ **Hexagonal Architecture** | Pure domain + ports & adapters | ✅ |
| 🔁 **Idempotency Native** | SHA-256 fingerprinting + cache | ✅ |
| 📊 **Total Observability** | Correlation ID + structured logs + metrics | ✅ |
| 📋 **OpenAPI Auto-Gen** | Specs 3.0 con headers + examples | ✅ |
| 🧪 **Test Suites** | Unit + Contract + Integration | ✅ |
| 💻 **Multi-Stack** | TypeScript/Fastify + Rust/Axum | ✅ |

### 🔥 **Idempotencia Avanzada**

```http
POST /api/v1/users
Content-Type: application/json
Idempotency-Key: user-creation-2024-01-31-abc123
X-Correlation-Id: req_789xyz456
Authorization: Bearer <jwt>

{
  "email": "user@example.com",
  "name": "John Doe",
  "age": 30
}
```

**Sistema:**
1. Genera SHA-256 del payload normalizado
2. Cache key = `idem:${key}:${hash}`
3. Si existe → retorna resultado cacheado
4. Si key existe con diferente payload → 409 Conflict
5. Almacena resultado con TTL configurable

### 📈 **Observabilidad Total**

```json
{
  "level": "info",
  "correlationId": "req_789xyz456",
  "gate": "AuthGate",
  "duration": 45,
  "success": true,
  "userId": "user-123",
  "endpoint": "/api/v1/users",
  "message": "Authentication successful"
}
```

---

## 🔧 **Templates Disponibles**

### 📘 **TypeScript + Fastify**

```bash
brik-v5
# Seleccionar: TypeScript, PostgreSQL, Redis

# Genera:
├── package.json          # Deps optimizadas para production
├── tsconfig.json         # Strict mode + paths mapping  
├── jest.config.js        # Tests config con coverage 80%+
├── src/
│   ├── api/users/
│   │   ├── gates/        # Auth, Schema, Idempotency, Rate
│   │   ├── domain/       # Entities, VOs, Use Cases (pure)
│   │   ├── ports/        # Repository, Event, Cache contracts
│   │   ├── adapters/     # PostgreSQL, Redis implementations
│   │   ├── presenter/    # HTTP DTOs + error mapping
│   │   └── tests/        # Unit + Integration tests
│   └── shared/
│       └── observability/ # Logger, Metrics, Correlation
├── openapi.yaml          # OpenAPI 3.0 specification
└── scripts/validate.sh   # Validation pipeline
```

### 🦀 **Rust + Axum**

```bash  
brik-v5
# Seleccionar: Rust, PostgreSQL, Redis

# Genera:
├── Cargo.toml           # Production-ready dependencies
├── src/
│   ├── api/users/
│   │   ├── gates/       # Auth, Schema gates con traits
│   │   ├── domain/      # Structs, enums, invariantes
│   │   ├── ports/       # Trait interfaces
│   │   └── adapters/    # Implementaciones async
│   └── shared/
│       ├── types/       # Result type + extensions
│       └── observability/ # Tracing + structured logging
├── openapi.yaml         # OpenAPI 3.0 specification  
└── tests/               # Unit + Integration tests
```

---

## 💡 **Casos de Uso**

### 🛒 **E-commerce API**
```bash
brik-v5
# TypeScript, PostgreSQL, Redis, Stripe
# Recurso: products
# → API completa con productos, inventario, pagos
```

### 🏦 **Fintech API**
```bash
brik-v5  
# Rust, PostgreSQL, Redis, Kafka
# Recurso: transactions
# → Sistema bancario con transacciones seguras
```

### 📊 **Analytics API**
```bash
brik-v5
# TypeScript, ClickHouse, Redis
# Recurso: events  
# → Sistema de métricas con agregaciones
```

### 🏥 **Healthcare API**
```bash
brik-v5
# Rust, PostgreSQL, Redis
# Recurso: patients
# → Sistema médico con compliance HIPAA
```

---

## 🧪 **Testing & Calidad**

### 📊 **Test Suites Automáticas**

**Unit Tests** (Domain Layer):
```typescript
describe('User Entity', () => {
  it('should create user with valid data', () => {
    const result = User.create(validUserData);
    expect(result.isOk()).toBe(true);
    expect(result.unwrap().email.toString()).toBe('john@example.com');
  });
  
  it('should fail with invalid email', () => {
    const result = User.create({ ...validUserData, email: 'invalid' });
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr().code).toBe('INVALID_EMAIL');
  });
});
```

**Integration Tests** (Endpoints):
```typescript
describe('POST /api/v1/users', () => {
  it('should create user with idempotency', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      headers: {
        'authorization': `Bearer ${authToken}`,
        'idempotency-key': 'user-creation-unique-123'
      },
      payload: validUserPayload
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toBeBrikCompliant();
    expect(response.body).toBeIdempotent();
  });
});
```

**Custom Matchers**:
```typescript
expect(response.body).toBeBrikCompliant();        // Tiene correlationId + timestamp
expect(response.body).toBeIdempotent();           // Metadatos de idempotencia
expect(response.body).toHaveGateError('AuthGate', 'AUTH_TOKEN_MISSING');
expect(response.body).toHaveDomainError('INVALID_USER_AGE');
```

### 🔍 **Validation Pipeline**

```bash
# Generado automáticamente en cada proyecto
./scripts/validate.sh

# Ejecuta:
# ✅ Linting (eslint/clippy)  
# ✅ Type checking (tsc/cargo check)
# ✅ Tests (jest/cargo test)
# ✅ Coverage verification (>80%)
# ✅ OpenAPI validation
# ✅ Security audit
```

---

## 📚 **Documentación Completa**

### 📖 **Guías Técnicas**
- 🧬 [**BRIK v5 Endpoints Guide**](docs/brikv5-endpoints.md) - Arquitectura completa
- 🎯 [**Certificación BRIK v5**](BRIK_V5_CERTIFICATION.md) - Status y compliance
- 🏗️ [**Hexagonal Architecture**](docs/brikv5-endpoints.md#arquitectura-hexagonal-estricta) - Patterns y principios
- 🛡️ [**Gates System**](docs/brikv5-endpoints.md#sistema-de-gates) - Auth, Schema, Idempotency
- 📊 [**Observabilidad**](docs/brikv5-endpoints.md#observabilidad-y-auditoría) - Logging y métricas

### 🚀 **Guías de Uso**
- ⚡ [**Quick Start**](#inicio-rápido) - Empezar en 3 minutos
- 🎯 [**Casos de Uso**](#casos-de-uso) - Ejemplos prácticos
- 🧪 [**Testing Guide**](#testing--calidad) - Estrategias de testing
- 🔧 [**Templates**](#templates-disponibles) - TypeScript y Rust

### 📋 **Legacy Documentation**
- 🏆 [**V1 Master Plan**](V1_MASTER_PLAN_EXECUTION_SUMMARY.md) - Historial BRIK v1
- 🛡️ [**L3 Certification**](L3_CERTIFICATION_DEPLOYMENT_SUMMARY.md) - Sistema anterior
- 🔍 [**Contract Testing**](docs/CONTRACT_TESTING_SPEC.md) - Cross-language validation

---

## 🛠️ **Configuración Enterprise**

### 🔑 **Variables de Entorno**

```bash
# .env configuration
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb

# Redis Cache  
REDIS_URL=redis://localhost:6379

# JWT Authentication
JWT_SECRET=your-super-secret-key-change-in-production

# API Configuration
API_TIMEOUT_MS=2000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60

# OpenAPI
OPENAPI_ENABLED=true
SWAGGER_UI_ENABLED=true
```

### ⚙️ **Comandos NPM**

```bash
# BRIK v5 Commands
npm run start:v5              # Ejecutar generador BRIK v5
npm run test:v5               # Test generador

# Development  
npm run dev                   # Desarrollo con hot reload
npm run build                 # Build production
npm run test                  # Test suites
npm run lint                  # Code linting
npm run typecheck             # Type validation

# Legacy BRIK Commands
npm run start                 # Claude Pro/Max mode
npm run start:traditional     # Classic scaffolding  
npm run start:ai              # IA agents mode
npm run validate              # L3 certification
```

---

## 🔗 **Integraciones Soportadas**

### 💾 **Databases**
- **PostgreSQL**: Full ORM + migrations + connection pooling
- **MySQL**: Complete integration + query optimization
- **SQLite**: Embedded database + file-based
- **MongoDB**: Document store + aggregations
- **Redis**: Cache + sessions + pub/sub

### 📢 **Message Brokers**
- **Kafka**: Event streaming + consumer groups
- **RabbitMQ**: Message queuing + routing
- **Redis Pub/Sub**: Real-time messaging

### 💳 **Payment Processors**
- **Stripe**: Payments + subscriptions + webhooks
- **PayPal**: Checkout + express payments

### 📊 **Observability**
- **Prometheus**: Metrics collection
- **Grafana**: Dashboards + alerting
- **Jaeger**: Distributed tracing

---

## 🚀 **Roadmap BRIK v5**

### ✅ **v5.1 - Current** 
- Circuitalidad Digital completa
- TypeScript + Rust templates
- Gates system implementado
- Idempotencia nativa
- OpenAPI auto-generation
- Test suites completas

### 🔄 **v5.2 - Q2 2025**
- **Go + Gin** templates
- **Python + FastAPI** templates  
- **GraphQL** support
- **WebSocket** endpoints
- **Event Sourcing** patterns

### 🚀 **v5.3 - Q3 2025**
- **Cloud Native** deployment
- **Kubernetes** manifests
- **Docker** optimization
- **CI/CD** improvements
- **Monitoring** dashboards

### 🌟 **v5.4 - Q4 2025**
- **Java + Spring** templates
- **C# + .NET** templates
- **Microservices** orchestration
- **Event-Driven** architecture
- **CQRS** patterns

---

## 🙌 **Contribución**

### 🚀 **Áreas de Contribución**
- ✨ **Nuevos Templates**: Go, Python, Java, C#
- 🛡️ **Security Gates**: Nuevos tipos de validación
- 📊 **Observability**: Métricas avanzadas, dashboards
- 🧪 **Testing**: Nuevos tipos de tests, property-based testing
- 📋 **OpenAPI**: Generación mejorada, validaciones
- 🔧 **DevOps**: CI/CD optimizations, deployment strategies

### 📋 **Proceso de Contribución**
1. Fork del repositorio
2. Crear branch: `git checkout -b feature/nueva-funcionalidad`
3. Implementar con **BRIK v5 compliance**
4. Tests: Ejecutar `npm run test:v5`
5. Documentación: Actualizar guías relevantes
6. Commit: `git commit -m "feat: descripción"` (Conventional Commits)
7. Push: `git push origin feature/nueva-funcionalidad`  
8. Crear Pull Request con descripción detallada

---

## 📄 **Licencia**

Este proyecto está bajo la licencia **MIT**. Ver [LICENSE](LICENSE) para más detalles.

---

## 🏢 **Créditos**

### 🧬 **Sistema ECO v3.0**
Desarrollado con **ECO** (Enhanced Cognitive Operations), el neocórtex digital que amplifica la intención estratégica mediante:

- **ECO-Lambda (Λ)**: Análisis estratégico y coordinación general
- **ECO-Sigma (Σ)**: Desarrollo técnico, APIs y arquitecturas  
- **ECO-Delta (Δ)**: DevOps, infraestructura y automatización
- **ECO-Theta (Θ)**: Diseño, UX/UI y documentación
- **ECO-Psi (Ψ)**: Seguridad, auditoría y protección

### 🎯 **Agentes Colaboradores**
- **Claude Code**: Desarrollo y arquitectura técnica
- **Anthropic Claude**: Análisis de dominio y generación
- **BRIK Philosophy**: Fundamentos arquitectónicos

---

## 🚀 **Quick Start Enterprise**

```bash
# 1. Instalar BRIK v5 globalmente
git clone https://github.com/nazcamedia/brik-project-initializer.git
cd brik-project-initializer  
npm install -g .

# 2. Generar API con circuitalidad digital
brik-v5

# 3. Seguir wizard interactivo:
#    📝 Nombre: mi-startup-api
#    💻 Lenguaje: TypeScript  
#    🗄️ BD: PostgreSQL
#    ⚡ Cache: Redis
#    🎯 Recurso: users

# 4. Navegar al proyecto generado
cd mi-startup-api

# 5. Instalar dependencias
npm install

# 6. Configurar entorno  
cp .env.example .env
# Editar .env con tu configuración

# 7. Ejecutar en desarrollo
npm run dev

# 8. Abrir documentación
# http://localhost:3000/docs (Swagger UI)

# 9. Test endpoint con idempotencia
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt>" \
  -H "Idempotency-Key: user-creation-unique-123" \
  -d '{"email":"user@example.com","name":"John Doe","age":30}'

# ¡API enterprise-ready funcionando en 3 minutos!
```

### 🎯 **De Idea a Producción**

1. **Generación** (30 segundos): Arquitectura hexagonal completa
2. **Configuración** (2 minutos): Variables de entorno + dependencias  
3. **Testing** (30 segundos): Tests unitarios + integración pasando
4. **Deploy** (1 minuto): Docker + CI/CD configurado

**Total: < 5 minutos de idea a API funcionando en producción** 🚀

---

*Creado con 🧬 Circuitalidad Digital y 🏗️ Arquitectura Hexagonal por ECO v3.0*