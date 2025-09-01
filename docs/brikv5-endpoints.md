# BRIK v5 - ARQUITECTURA DE ENDPOINTS CON CIRCUITALIDAD DIGITAL

## 🚀 Visión General

BRIK v5 introduce un sistema de **circuitalidad digital** para endpoints web con arquitectura hexagonal pura, idempotencia nativa, observabilidad integral y seguridad por capas. Cada endpoint funciona como un circuito autónomo con gates, núcleo inmutable y puertos especializados.

## Principios BRIK v5

- Modularidad y extensibilidad.
- Simplicidad en la integración.
- Documentación clara y reproducible.
- Enfoque en developer experience.

## 1. PRINCIPIOS BRIK v5 Y CIRCUITALIDAD

### Filosofía Core
- **Inmutabilidad Radical**: Dominio puro, sin efectos secundarios
- **Circuitalidad Digital**: Cada request fluye por gates → núcleo → puertos → presenter
- **Idempotencia Nativa**: SHA-256(payload) + Idempotency-Key obligatorio
- **Observabilidad Total**: Cada operación traceable con correlación
- **Fallos Rápidos**: Validation gates rechazan requests inválidos inmediatamente

### Arquitectura Hexagonal Estricta
```
┌─────────────────────────────────────────────────────────────┐
│                      GATES LAYER                           │
│  Auth → Schema → Policy → Idempotency → Rate → Timeout     │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                   DOMAIN CORE                               │
│            Entities + VOs + Use Cases                      │
│                   (100% Pure)                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    PORTS LAYER                             │
│  RepoPort │ EventPort │ CachePort │ ClockPort │ UuidPort   │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                  ADAPTERS LAYER                            │
│    PostgreSQL │ Kafka │ Redis │ System │ UUID4             │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                 PRESENTER LAYER                            │
│           HTTP DTOs + Status Codes + Error Mapping        │
└─────────────────────────────────────────────────────────────┘
```

## 2. CAPAS Y CONTRATOS

### Gates Layer (Circuitos de Entrada)
Cada gate es un circuito especializado que puede fallar rápido:

- **AuthGate**: JWT validation, scopes verification
- **SchemaGate**: JSON Schema validation, sanitización
- **PolicyGate**: Business rules, authorization matrix
- **IdempotencyGate**: Duplicate detection, cache de resultados
- **RateGate**: Rate limiting por usuario/IP
- **TimeoutGate**: Request timeout enforcement

### Domain Core (Núcleo Inmutable)
```typescript
// Entities: Identidad + invariantes
class User {
  private constructor(
    public readonly id: UserId,
    public readonly email: Email,
    public readonly profile: UserProfile
  ) {}

  static create(data: UserCreationData): Result<User, DomainError> {
    // Validación + construcción inmutable
  }
}

// Use Cases: Operaciones puras
async function createUser(
  command: CreateUserCommand,
  ports: UserPorts
): Promise<Result<User, UseCaseError>> {
  // Lógica pura, sin I/O directo
}
```

### Ports Layer (Contratos)
```typescript
interface UserRepository {
  findById(id: UserId): Promise<Result<User, RepositoryError>>;
  save(user: User): Promise<Result<void, RepositoryError>>;
}

interface EventPublisher {
  publish(event: DomainEvent): Promise<Result<void, EventError>>;
}

interface IdempotencyCache {
  get(key: string): Promise<Result<CachedResult, CacheError>>;
  set(key: string, result: any, ttl: number): Promise<Result<void, CacheError>>;
}
```

## 3. FLUJO DEL ENDPOINT Y ESTADOS

### Circuito Completo de Request
```
1. HTTP Request
   ↓
2. AuthGate (JWT + Scopes)
   ↓ [Auth Success]
3. SchemaGate (Validation)
   ↓ [Schema Valid]
4. PolicyGate (Business Rules)
   ↓ [Policy Allowed]
5. IdempotencyGate (Duplicate Check)
   ↓ [Not Duplicate / Cached Result]
6. RateGate (Rate Limit)
   ↓ [Within Limits]
7. TimeoutGate (Start Timer)
   ↓ [Timer Started]
8. Domain Use Case (Pure Logic)
   ↓ [Use Case Success]
9. Ports (External I/O)
   ↓ [I/O Success]
10. Presenter (HTTP Response)
    ↓
11. HTTP Response + Observability
```

### Estados de Circuito
- **SUCCESS**: Flujo completado exitosamente
- **GATE_FAILURE**: Fallo en validation gate
- **DOMAIN_FAILURE**: Error en lógica de negocio
- **PORT_FAILURE**: Fallo en I/O externo
- **TIMEOUT**: Request timeout alcanzado

## 4. IDEMPOTENCIA PRÁCTICA

### Implementación de Idempotency-Key
```typescript
class IdempotencyManager {
  async checkIdempotency(
    key: string, 
    payload: any, 
    ttlSeconds: number = 3600
  ): Promise<IdempotencyResult> {
    
    // 1. Generar fingerprint del payload
    const payloadHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(payload))
      .digest('hex');
    
    const cacheKey = `idem:${key}:${payloadHash}`;
    
    // 2. Check cache
    const cached = await this.cache.get(cacheKey);
    if (cached.isOk()) {
      return { 
        isDuplicate: true, 
        cachedResult: cached.value 
      };
    }
    
    // 3. Return lock para evitar race conditions
    return { 
      isDuplicate: false, 
      lockKey: cacheKey,
      releaseLock: () => this.cache.delete(cacheKey)
    };
  }
}
```

### Headers Obligatorios
```http
POST /api/v1/users
Content-Type: application/json
Idempotency-Key: user-creation-2024-01-15-abc123
X-Correlation-Id: req_789xyz456

{
  "email": "user@example.com",
  "name": "John Doe"
}
```

## 5. OBSERVABILIDAD Y AUDITORÍA

### Tracing de Correlación
```typescript
interface RequestContext {
  correlationId: string;    // X-Correlation-Id header
  traceId: string;         // Distributed tracing ID
  userId?: string;         // Authenticated user
  requestStart: Date;
  endpoint: string;
}

class ObservabilityManager {
  logGateResult(context: RequestContext, gate: string, result: GateResult) {
    this.logger.info({
      correlationId: context.correlationId,
      gate,
      success: result.isSuccess,
      duration: result.durationMs,
      error: result.error?.code,
      ...context
    });
  }
  
  recordMetric(name: string, value: number, tags: Record<string, string>) {
    this.metrics.histogram(name, value, tags);
  }
}
```

### Métricas Obligatorias
- `endpoint_duration_ms` (p50, p95, p99)
- `gate_success_rate` por gate
- `domain_error_count` por tipo
- `port_timeout_count` por puerto
- `idempotency_hit_rate`

## 6. SEGURIDAD Y POLÍTICAS

### Matriz de Autorización
```typescript
interface SecurityScope {
  resource: string;  // 'users', 'orders', etc.
  action: string;    // 'create', 'read', 'update', 'delete'
  constraints?: {
    ownedOnly?: boolean;
    departmentOnly?: boolean;
    adminOnly?: boolean;
  };
}

// Ejemplo de política
const CREATE_USER_POLICY: SecurityScope = {
  resource: 'users',
  action: 'create',
  constraints: {
    adminOnly: true
  }
};
```

### AuthGate Implementation
```typescript
class AuthGate implements RequestGate {
  async validate(request: HttpRequest): Promise<GateResult> {
    // 1. Extract JWT
    const token = this.extractBearerToken(request);
    if (!token) {
      return GateResult.failure('AUTH_TOKEN_MISSING');
    }
    
    // 2. Verify signature
    const payload = await this.verifyJWT(token);
    if (!payload) {
      return GateResult.failure('AUTH_TOKEN_INVALID');
    }
    
    // 3. Check scopes
    const requiredScopes = this.getRequiredScopes(request.path);
    if (!this.hasScopes(payload.scopes, requiredScopes)) {
      return GateResult.failure('AUTH_INSUFFICIENT_SCOPES');
    }
    
    return GateResult.success({
      userId: payload.sub,
      scopes: payload.scopes
    });
  }
}
```

## 7. PATRÓN DE ERRORES Y MAPEO HTTP

### Taxonomía de Errores BRIK v5
```typescript
// Domain Errors (4xx)
abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly httpStatus: number;
}

class ValidationError extends DomainError {
  code = 'VALIDATION_FAILED';
  httpStatus = 400;
}

class BusinessRuleViolation extends DomainError {
  code = 'BUSINESS_RULE_VIOLATED';
  httpStatus = 422;
}

// Gate Errors (4xx)
class GateError extends Error {
  constructor(
    public readonly gate: string,
    public readonly code: string,
    public readonly httpStatus: number,
    message: string
  ) {
    super(message);
  }
}

// Port Errors (5xx)
class PortError extends Error {
  constructor(
    public readonly port: string,
    public readonly code: string,
    public readonly httpStatus: number = 503,
    message: string
  ) {
    super(message);
  }
}
```

### Mapeo HTTP Consistente
```typescript
class ErrorMapper {
  static toHttpResponse(error: Error): HttpResponse {
    if (error instanceof GateError) {
      return {
        status: error.httpStatus,
        body: {
          error: {
            type: 'GATE_ERROR',
            gate: error.gate,
            code: error.code,
            message: error.message
          }
        }
      };
    }
    
    if (error instanceof DomainError) {
      return {
        status: error.httpStatus,
        body: {
          error: {
            type: 'DOMAIN_ERROR',
            code: error.code,
            message: error.message
          }
        }
      };
    }
    
    if (error instanceof PortError) {
      return {
        status: error.httpStatus,
        body: {
          error: {
            type: 'PORT_ERROR',
            port: error.port,
            code: error.code,
            message: 'External service unavailable'
          }
        }
      };
    }
    
    // Fallback para errores inesperados
    return {
      status: 500,
      body: {
        error: {
          type: 'INTERNAL_ERROR',
          code: 'UNEXPECTED_ERROR',
          message: 'Internal server error'
        }
      }
    };
  }
}
```

## 8. RENDIMIENTO Y LÍMITES

### Circuit Breaker Pattern
```typescript
class CircuitBreaker {
  constructor(
    private readonly failureThreshold: number = 5,
    private readonly resetTimeoutMs: number = 60000
  ) {}
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}
```

### Performance Targets
- **Response Time**: P95 < 200ms para operaciones CRUD
- **Throughput**: > 1000 req/s por endpoint
- **Availability**: 99.9% uptime
- **Error Rate**: < 0.1% en condiciones normales

## 9. CHECKLIST POR ENDPOINT

### Pre-Implementación
- [ ] Definir resource y operación (users:create)
- [ ] Especificar scopes de seguridad requeridos
- [ ] Diseñar schema JSON de entrada
- [ ] Identificar ports necesarios
- [ ] Definir invariantes de dominio

### Implementación
- [ ] Gates configurados y funcionales
- [ ] Domain entities con invariantes
- [ ] Use cases puros (sin I/O directo)
- [ ] Ports con interfaces tipadas
- [ ] Adapters con circuit breakers
- [ ] Presenter con mapeo de errores

### Testing
- [ ] Tests unitarios del dominio (100% coverage)
- [ ] Tests de contrato de puertos
- [ ] Tests de integración HTTP
- [ ] Tests de idempotencia
- [ ] Tests de timeout y circuit breaking

### Observabilidad
- [ ] Logs estructurados con correlación
- [ ] Métricas de performance
- [ ] Health checks
- [ ] OpenAPI spec actualizada

### Seguridad
- [ ] Validación de scopes implementada
- [ ] Rate limiting configurado
- [ ] Input sanitization activa
- [ ] Audit trail para operaciones críticas

## 10. CÓMO GENERAR UN NUEVO ENDPOINT

### Comando CLI
```bash
# Generar endpoint completo
brik generate endpoint \
  --resource users \
  --action create \
  --language typescript \
  --http fastify \
  --auth-scopes "users:write,admin:users" \
  --ports "UserRepo,EventPublisher" \
  --validation-schema ./schemas/create-user.json

# Generar solo el esqueleto
brik scaffold endpoint users create --dry-run

# Generar con configuración específica
brik generate endpoint --config ./brik-endpoint.json
```

### Estructura Generada
```
src/api/users/
├── gates/
│   ├── auth-gate.ts
│   ├── schema-gate.ts
│   ├── policy-gate.ts
│   ├── idempotency-gate.ts
│   └── index.ts
├── domain/
│   ├── entities/
│   │   └── user.ts
│   ├── value-objects/
│   │   ├── user-id.ts
│   │   └── email.ts
│   └── use-cases/
│       └── create-user.ts
├── ports/
│   ├── user-repository.ts
│   ├── event-publisher.ts
│   └── index.ts
├── adapters/
│   ├── postgres-user-repository.ts
│   ├── kafka-event-publisher.ts
│   └── index.ts
├── presenter/
│   ├── dtos.ts
│   ├── http-presenter.ts
│   └── error-mapper.ts
├── errors/
│   ├── domain-errors.ts
│   ├── gate-errors.ts
│   └── port-errors.ts
├── tests/
│   ├── unit/
│   ├── contract/
│   └── integration/
├── handler.ts
└── openapi.yaml
```

### Configuración de Endpoint
```json
{
  "endpoint": {
    "resource": "users",
    "action": "create",
    "method": "POST",
    "path": "/api/v1/users"
  },
  "security": {
    "scopes": ["users:write"],
    "rate_limit": {
      "requests": 100,
      "window_seconds": 60
    }
  },
  "validation": {
    "schema_path": "./schemas/create-user.json",
    "sanitize_input": true
  },
  "idempotency": {
    "enabled": true,
    "ttl_seconds": 3600
  },
  "ports": [
    "UserRepository",
    "EventPublisher",
    "IdempotencyCache"
  ],
  "observability": {
    "trace_enabled": true,
    "metrics_enabled": true,
    "log_level": "info"
  }
}
```

---

## 🎯 RESUMEN EJECUTIVO

BRIK v5 transforma cada endpoint en un **circuito digital autónomo** con:

1. **Gates de Validación**: Fallos rápidos y seguridad por capas
2. **Núcleo Inmutable**: Lógica de negocio pura y testeable  
3. **Ports Especializados**: I/O con circuit breakers y timeouts
4. **Observabilidad Total**: Tracing, métricas y correlación
5. **Idempotencia Nativa**: SHA-256 + cache para operaciones seguras

**Resultado**: Endpoints robustos, escalables y mantenibles con arquitectura hexagonal estricta y circuitalidad digital completa.