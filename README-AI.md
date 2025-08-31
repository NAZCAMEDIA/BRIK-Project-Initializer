# 🧬 BRIK Project Initializer v5.0 - AI Powered Edition

Sistema completo de gestión de proyectos BRIK con **Agentes IA integrados** para generación inteligente de código.

## 🤖 Características Principales

### Agentes IA Integrados
- **Claude 3** (Anthropic) - Mejor para código complejo y arquitecturas sofisticadas
- **Gemini 1.5** (Google) - Contexto extendido, ideal para proyectos grandes
- **GPT-4** (OpenAI) - Versátil y potente para casos generales
- **Codex** (OpenAI) - Especializado en generación de código
- **Claude Code Local** - Integración con instalación local si está disponible

### Modos de Operación
1. **CLI con IA** - Generación inteligente usando agentes externos
2. **CLI Tradicional** - Templates predefinidos sin IA
3. **Smart Legacy** - Generadores locales con mock LLM

### Funcionalidades
- ✅ **Crear proyectos BRIK** desde cero con IA
- ✅ **Reestructurar proyectos** existentes a arquitectura BRIK
- ✅ **Validación L3** automática con certificación empresarial
- ✅ **100% cobertura** de código garantizada
- ✅ **Documentación completa** auto-generada
- ✅ **Tests inmutabilidad** incluidos

## 🚀 Inicio Rápido

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/nazcamedia/brik-project-initializer.git
cd brik-project-initializer

# Instalar dependencias
npm install

# Configurar permisos
chmod +x start.sh
chmod +x brik-cli-ai.js
```

### Ejecución

```bash
# Opción 1: Launcher interactivo (RECOMENDADO)
./start.sh

# Opción 2: CLI con IA directamente
node brik-cli-ai.js

# Opción 3: CLI tradicional sin IA
node brik-cli.js

# Opción 4: NPM scripts
npm start          # CLI con IA
npm run start:traditional  # CLI sin IA
```

## ⚙️ Configuración de Agentes IA

### Obtener API Keys

1. **Claude (Anthropic)**
   - Registrarse en: https://console.anthropic.com
   - Obtener API Key desde la consola
   - Modelos disponibles: Claude 3 Opus, Sonnet, Haiku

2. **Gemini (Google)**
   - Acceder a: https://makersuite.google.com/app/apikey
   - Generar API Key
   - Modelos: Gemini 1.5 Pro, Flash

3. **OpenAI (GPT-4/Codex)**
   - Registrarse en: https://platform.openai.com
   - Crear API Key en settings
   - Modelos: GPT-4 Turbo, GPT-3.5, Codex

### Configurar API Keys

#### Método 1: Desde el CLI
```bash
./start.sh
# Seleccionar opción 4: Configurar Agentes IA
```

#### Método 2: Variables de entorno
```bash
export ANTHROPIC_API_KEY="tu-api-key-claude"
export GOOGLE_API_KEY="tu-api-key-gemini"
export OPENAI_API_KEY="tu-api-key-openai"
```

#### Método 3: Archivo de configuración
Crear/editar `~/.brik-ai-config.json`:

```json
{
  "defaultProvider": "claude",
  "providers": {
    "claude": {
      "apiKey": "sk-ant-...",
      "model": "claude-3-opus-20240229",
      "maxTokens": 4000
    },
    "gemini": {
      "apiKey": "AI...",
      "model": "gemini-1.5-pro",
      "maxTokens": 8000
    },
    "openai": {
      "apiKey": "sk-...",
      "model": "gpt-4-turbo-preview",
      "maxTokens": 4000
    }
  }
}
```

## 📚 Uso del Sistema

### Crear Proyecto con IA

```bash
# Iniciar CLI
./start.sh

# Seleccionar: 1. CLI con Agentes IA
# Seguir el asistente interactivo:
# 1. Elegir agente IA (Claude, Gemini, GPT-4)
# 2. Nombre del proyecto
# 3. Descripción detallada
# 4. Lenguaje (Rust, TypeScript, Python)
# 5. Integraciones (postgresql, redis, stripe, etc.)
```

El sistema generará automáticamente:
- Código funcional completo
- Tests con 100% cobertura
- Documentación técnica y de producto
- Scripts de validación
- Configuración CI/CD

### Reestructurar Proyecto Existente

```bash
# Desde el menú principal
# Seleccionar: Reestructurar con Agente IA

# Modos disponibles:
# - Full: Reestructuración completa
# - Incremental: Agregar componentes BRIK
# - Refactor: Refactorizar código existente
# - Docs: Solo generar documentación
```

### Validar Certificación BRIK

```bash
# Validación L3 (Nivel Empresarial)
node l3_certification_suite.js /ruta/al/proyecto

# Desde el CLI
# Seleccionar: Validar certificación BRIK
```

## 🧬 Arquitectura BRIK Generada

### Estructura de 3 Capas

```
proyecto-brik/
├── src/
│   ├── core/           # Lógica pura inmutable
│   ├── components/     # Wrappers y adaptadores
│   └── living-layer/   # Monitoreo y consciencia
├── tests/
│   ├── unit/          # Tests unitarios (100%)
│   ├── integration/   # Tests integración
│   ├── property/      # Property-based testing
│   └── immutability/  # Tests inmutabilidad
├── docs/
│   ├── product/       # PRD, user stories
│   ├── technical/     # Arquitectura, APIs
│   └── operational/   # Deploy, configuración
├── scripts/           # Automatización
├── .brik-dna.yml     # ADN del proyecto
└── CIRCUITALIDAD.md  # Manifiesto filosófico
```

### Principios BRIK

1. **CORE Inmutable**: Lógica de negocio pura sin dependencias
2. **WRAPPERS Evolutivos**: Adaptadores para servicios externos
3. **LIVING LAYER**: Consciencia y auto-monitoreo del sistema
4. **100% Cobertura**: Tests completos obligatorios
5. **Documentación Integral**: Auto-consistente y verificable

## 💰 Costos Estimados por Proveedor

| Proveedor | Modelo | Costo/1M tokens | Proyecto típico |
|-----------|--------|-----------------|-----------------|
| Claude 3 Opus | Más potente | $15-75 | ~$0.50-2.00 |
| Gemini 1.5 Pro | Contexto largo | $7-35 | ~$0.25-1.00 |
| GPT-4 Turbo | Versátil | $30-120 | ~$1.00-3.00 |
| Codex | Código puro | $20 | ~$0.50-1.50 |

*Nota: Un proyecto típico usa 20K-50K tokens*

## 🛠️ Comandos Útiles

### NPM Scripts
```bash
npm start              # CLI con IA
npm run test          # Tests de integración
npm run validate      # Validación L3
npm run setup         # Configuración inicial
npm run configure     # Configurar agentes IA
```

### Bash Scripts
```bash
./start.sh                    # Launcher principal
./init-brik-project.sh        # Inicializador tradicional
./scripts/test-coverage.sh    # Verificar 100% cobertura
./scripts/brik-certify.sh     # Generar certificación
```

## 🔧 Troubleshooting

### Error: API Key no configurada
```bash
# Configurar desde el menú
./start.sh
# Opción 4: Configurar Agentes IA
```

### Error: Node.js versión incorrecta
```bash
# Requiere Node.js 18+
nvm install 18
nvm use 18
```

### Error: Límite de tokens excedido
- Reducir descripción del proyecto
- Usar modelo más económico (Haiku, Flash)
- Dividir en componentes más pequeños

## 📖 Ejemplos de Uso

### Proyecto E-commerce con Stripe
```bash
Nombre: mi-tienda
Descripción: API e-commerce con catálogo de productos, carrito de compras, 
             gestión de usuarios, procesamiento de pagos con Stripe, 
             notificaciones por email, analytics de ventas
Lenguaje: TypeScript
Integraciones: postgresql, redis, stripe, sendgrid
```

### Sistema CRM Empresarial
```bash
Nombre: crm-enterprise
Descripción: Sistema CRM con gestión de clientes, pipeline de ventas,
             automatización de marketing, reportes, integraciones con
             email y calendario, API REST completa
Lenguaje: Rust
Integraciones: postgresql, redis, oauth2, smtp
```

### API de Análisis de Datos
```bash
Nombre: data-analytics-api
Descripción: API para procesamiento de datos en tiempo real, 
             agregaciones, machine learning, visualizaciones,
             webhooks para eventos, rate limiting
Lenguaje: Python
Integraciones: postgresql, redis, rabbitmq, s3
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para detalles

## 🌟 Créditos

Desarrollado por **NAZCAMEDIA** siguiendo la filosofía **DAAF-BRIK-Circuitalidad Digital**

---

**🚀 ¡Comienza a crear proyectos BRIK con IA ahora!**

```bash
./start.sh
```