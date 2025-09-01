# BRIK v5 - Documentación de Endpoints y Arquitectura

## Principios BRIK v5

BRIK v5 representa la evolución de la arquitectura de software hacia un paradigma de **hardware mental programado**. Los principios fundamentales son:

1. **Inmutabilidad de Estado**: Cada configuración es inmutable y aislada
2. **Validación Exhaustiva**: Todo input es validado antes de procesamiento
3. **Recuperación en Cascada**: Múltiples niveles de fallback ante errores
4. **Adaptabilidad Contextual**: Comportamiento ajustado según el ambiente

## Circuitalidad Digital

La Circuitalidad Digital es el concepto de flujo de datos a través de circuitos especializados:

```
Input → Gates → Domain → Ports → Adapters → Output
  ↓       ↓        ↓       ↓        ↓         ↓
Validation Logic  Storage  External Transform Response
```

Cada circuito es:
- **Determinístico**: Misma entrada produce misma salida
- **Aislado**: Sin efectos secundarios no deseados
- **Testeable**: 100% cobertura posible
- **Performante**: Optimizado para latencia mínima

## Arquitectura Hexagonal

La arquitectura hexagonal separa las preocupaciones en capas concéntricas:

### Core del Dominio
- Entidades puras del negocio
- Reglas de negocio inmutables
- Value Objects
- Casos de uso

### Puertos
- Interfaces definidas
- Contratos de entrada/salida
- Repositorios abstractos
- Event buses

### Adaptadores
- Implementaciones concretas
- Conexiones a bases de datos
- APIs externas
- Sistemas de mensajería

## Idempotencia

Todas las operaciones POST/PUT/PATCH soportan idempotencia mediante:

- **Idempotency-Key Header**: Identificador único de operación
- **Cache de Resultados**: Respuestas almacenadas por 24 horas
- **Detección de Duplicados**: Comparación de payloads
- **Respuesta Consistente**: Mismo resultado para misma key

Ejemplo:
```http
POST /api/v1/users
Idempotency-Key: user-creation-2024-01-15-abc123
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Observabilidad

Sistema completo de observabilidad con:

### Tracing
- X-Correlation-Id en todas las requests
- Distributed tracing con OpenTelemetry
- Span tracking por capa

### Métricas
- Latencia por endpoint (p50, p95, p99)
- Tasa de error por servicio
- Utilización de recursos
- Business metrics customizadas

### Logging
- Structured logging con Pino/Zap
- Log levels configurables
- Correlation ID en todos los logs
- Sanitización de datos sensibles

## Gates Layer

Los Gates son la primera línea de defensa:

### Auth Gate
- Validación de JWT tokens
- Verificación de scopes
- Rate limiting por usuario
- Session management

### Schema Gate
- Validación de esquemas con Zod/Joi
- Type coercion automático
- Error messages descriptivos
- OpenAPI schema validation

### Policy Gate
- Business rules enforcement
- Feature flags
- A/B testing logic
- Quota management

### Rate Limit Gate
- Token bucket algorithm
- Per-user/IP limiting
- Configuración dinámica
- Graceful degradation

## Domain Core

El núcleo del dominio contiene:

### Entidades
```typescript
export class User {
  constructor(
    private readonly id: UserId,
    private readonly email: Email,
    private readonly name: Name
  ) {}
  
  // Métodos de dominio puros
  changeEmail(newEmail: Email): User {
    // Lógica de negocio
  }
}
```

### Value Objects
```typescript
export class Email {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new InvalidEmailError(value);
    }
  }
  
  private isValid(email: string): boolean {
    // Validación RFC 5322
  }
}
```

### Casos de Uso
```typescript
export class CreateUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly eventBus: EventBus
  ) {}
  
  async execute(dto: CreateUserDTO): Promise<User> {
    // Orquestación de lógica
  }
}
```

## Ports Layer

Los puertos definen contratos:

### Repository Ports
```typescript
export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
}
```

### Event Ports
```typescript
export interface EventBus {
  publish<T>(event: DomainEvent<T>): Promise<void>;
  subscribe<T>(
    eventType: string,
    handler: EventHandler<T>
  ): void;
}
```

### Cache Ports
```typescript
export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
}
```

## OpenAPI

Documentación automática con OpenAPI 3.0:

### Generación Automática
- Desde decoradores TypeScript
- Validación de esquemas
- Try-it-out integrado
- Versionado de API

### Endpoints Documentados
```yaml
openapi: 3.0.0
info:
  title: BRIK v5 API
  version: 1.0.0
paths:
  /api/v1/users:
    post:
      summary: Create user
      operationId: createUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserDTO'
      responses:
        201:
          description: User created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
```

### Swagger UI
- Disponible en `/docs`
- Autenticación integrada
- Ejemplos interactivos
- Export a Postman/Insomnia

## Testing Strategy

### Unit Tests
- Coverage mínimo: 80%
- Mocks para dependencias
- Test doubles para I/O

### Integration Tests
- Database real con Docker
- API completa levantada
- Scenarios end-to-end

### Contract Tests
- Schema validation
- API compatibility
- Breaking change detection

### Performance Tests
- Load testing con k6
- Stress testing
- Spike testing
- Soak testing

## Deployment

### Containerización
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: brik-v5-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: brik-v5-api
  template:
    metadata:
      labels:
        app: brik-v5-api
    spec:
      containers:
      - name: api
        image: brik-v5-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
```

### CI/CD Pipeline
1. **Build**: Compilación y linting
2. **Test**: Unit + Integration tests
3. **Security**: Vulnerability scanning
4. **Deploy**: Blue-green deployment
5. **Monitor**: Health checks y métricas

## Conclusión

BRIK v5 representa la próxima generación de arquitectura de software, donde cada componente es un circuito perfecto, testeado al 100%, y listo para servir como hardware mental para futuras AGI.

---

*Documentación generada para BRIK v5 - L4 Certification*