#!/bin/bash
# 📋 Generador de Documentación de Producto BRIK
# Crea templates de documentación de producto siguiendo filosofía DAAF-BRIK

set -euo pipefail

PROJECT_NAME=${1:-"nuevo-proyecto-brik"}
DOCS_DIR="docs/product"

echo "📋 Generando documentación de producto para: $PROJECT_NAME"

# Crear directorio si no existe
mkdir -p "$DOCS_DIR"

# 1. Documento de Requisitos de Producto (PRD)
cat > "$DOCS_DIR/PRD.md" << EOF
# 📋 Documento de Requisitos de Producto (PRD)
**Proyecto:** $PROJECT_NAME  
**Versión:** 1.0.0  
**Fecha:** $(date +%Y-%m-%d)  
**Estado:** Draft  

---

## 🎯 Visión y Objetivos

### Visión del Producto
> [Descripción clara de qué es el producto y su propósito principal]

### Objetivos Estratégicos
- [ ] **Objetivo 1**: [Describir objetivo específico]
- [ ] **Objetivo 2**: [Describir objetivo específico]
- [ ] **Objetivo 3**: [Describir objetivo específico]

### Problemática que Resuelve
- **Problema Principal**: [Descripción del problema core]
- **Problemas Secundarios**:
  - [Problema secundario 1]
  - [Problema secundario 2]

### Propuesta de Valor Única
- **Para**: [Target audience]
- **Que**: [Need/opportunity]
- **El**: [Product name]
- **Es**: [Product category]
- **Que**: [Key benefit/differentiator]
- **A diferencia de**: [Competition]
- **Nuestro producto**: [Primary differentiation]

---

## 📊 Métricas de Éxito Clave

### KPIs Primarios
- **Métrica 1**: [Definición] - Target: [Valor objetivo]
- **Métrica 2**: [Definición] - Target: [Valor objetivo]
- **Métrica 3**: [Definición] - Target: [Valor objetivo]

### KPIs Secundarios
- **Métrica 4**: [Definición] - Target: [Valor objetivo]
- **Métrica 5**: [Definición] - Target: [Valor objetivo]

---

## 🎭 Personas y Audiencia

### Persona Primaria: [Nombre]
- **Demografía**: [Edad, ubicación, industria]
- **Psicografía**: [Motivaciones, frustraciones, comportamientos]
- **Necesidades**: [¿Qué necesita del producto?]
- **Pain Points**: [¿Qué problemas enfrenta actualmente?]

### Persona Secundaria: [Nombre]
- **Demografía**: [Edad, ubicación, industria]
- **Psicografía**: [Motivaciones, frustraciones, comportamientos]
- **Necesidades**: [¿Qué necesita del producto?]
- **Pain Points**: [¿Qué problemas enfrenta actualmente?]

---

## 🏗️ Arquitectura de Producto

### Componentes Core (Inmutables)
- **Componente 1**: [Descripción y función]
- **Componente 2**: [Descripción y función]
- **Componente 3**: [Descripción y función]

### Wrappers Evolutivos
- **Wrapper 1**: [Descripción y configurabilidad]
- **Wrapper 2**: [Descripción y configurabilidad]

### Living Code Layer
- **IA Integration**: [Descripción de capacidades inteligentes]
- **Self-Diagnostic**: [Capacidades de auto-diagnóstico]

---

## 📈 Roadmap y Fases

### Fase 1: MVP (Inmutable Core)
- **Timeline**: [Duración estimada]
- **Features**:
  - [ ] Feature 1
  - [ ] Feature 2
  - [ ] Feature 3

### Fase 2: Essential Wrappers
- **Timeline**: [Duración estimada]
- **Features**:
  - [ ] Feature 4
  - [ ] Feature 5
  - [ ] Feature 6

### Fase 3: Living Code Integration
- **Timeline**: [Duración estimada]
- **Features**:
  - [ ] Feature 7
  - [ ] Feature 8
  - [ ] Feature 9

---

## 🎯 Criterios de Aceptación Global

### Funcionales
- [ ] [Criterio funcional 1]
- [ ] [Criterio funcional 2]
- [ ] [Criterio funcional 3]

### No Funcionales
- [ ] **Performance**: [Criterios de rendimiento]
- [ ] **Usabilidad**: [Criterios de UX]
- [ ] **Confiabilidad**: [Criterios de confiabilidad]
- [ ] **Escalabilidad**: [Criterios de escalabilidad]

### Criterios BRIK
- [ ] **100% Test Coverage**: Core components
- [ ] **Immutable Core**: Post-deployment stability
- [ ] **Living Documentation**: Auto-updated docs
- [ ] **Entropy < 0.3**: Thermodynamic efficiency

---

**Estado del Documento**: ⚠️ PENDIENTE DE COMPLETAR  
**Próximos Pasos**: Completar secciones marcadas y validar con stakeholders
EOF

# 2. Historias de Usuario y Casos de Uso
cat > "$DOCS_DIR/user-stories.md" << EOF
# 📖 Historias de Usuario y Casos de Uso
**Proyecto:** $PROJECT_NAME  
**Versión:** 1.0.0  
**Fecha:** $(date +%Y-%m-%d)  

---

## 🎭 Historias de Usuario

### Epic 1: [Nombre del Epic]

#### Historia 1.1
**Como** [tipo de usuario]  
**Quiero** [acción/funcionalidad]  
**Para** [beneficio/valor]  

**Criterios de Aceptación:**
- [ ] Given [contexto], When [acción], Then [resultado]
- [ ] Given [contexto], When [acción], Then [resultado]
- [ ] Given [contexto], When [acción], Then [resultado]

**Definición de Terminado (DoD):**
- [ ] Código implementado y revisado
- [ ] Tests unitarios >= 95% cobertura
- [ ] Tests de integración pasando
- [ ] Documentación actualizada
- [ ] UX/UI validado con usuarios

---

#### Historia 1.2
**Como** [tipo de usuario]  
**Quiero** [acción/funcionalidad]  
**Para** [beneficio/valor]  

**Criterios de Aceptación:**
- [ ] Given [contexto], When [acción], Then [resultado]
- [ ] Given [contexto], When [acción], Then [resultado]

---

### Epic 2: [Nombre del Epic]

#### Historia 2.1
**Como** [tipo de usuario]  
**Quiero** [acción/funcionalidad]  
**Para** [beneficio/valor]  

**Criterios de Aceptación:**
- [ ] Given [contexto], When [acción], Then [resultado]
- [ ] Given [contexto], When [acción], Then [resultado]

---

## 🎯 Casos de Uso Detallados

### Caso de Uso 1: [Nombre]
- **Actor Primario**: [Usuario tipo]
- **Stakeholders**: [Otros interesados]
- **Precondiciones**: [Estado inicial requerido]
- **Trigger**: [Evento que inicia el caso de uso]

#### Flujo Principal
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]
4. [Resultado]

#### Flujos Alternativos
- **A1**: Si [condición], entonces [pasos alternativos]
- **A2**: Si [condición], entonces [pasos alternativos]

#### Flujos de Excepción
- **E1**: Si [error], entonces [manejo del error]
- **E2**: Si [error], entonces [manejo del error]

---

### Caso de Uso 2: [Nombre]
- **Actor Primario**: [Usuario tipo]
- **Stakeholders**: [Otros interesados]
- **Precondiciones**: [Estado inicial requerido]
- **Trigger**: [Evento que inicia el caso de uso]

#### Flujo Principal
1. [Paso 1]
2. [Paso 2]
3. [Resultado]

---

## 🌐 User Journeys

### Journey 1: [Nombre del Journey]
**Persona**: [Persona objetivo]  
**Escenario**: [Contexto del journey]  
**Objetivo**: [Meta del usuario]  

#### Touchpoints
1. **Descubrimiento**: [Cómo conoce el producto]
2. **Evaluación**: [Cómo evalúa el producto]
3. **Onboarding**: [Primeros pasos]
4. **Uso Regular**: [Interacciones típicas]
5. **Advocacy**: [Cómo se convierte en promotor]

#### Pain Points y Oportunidades
- **Pain Point 1**: [Descripción] → **Oportunidad**: [Mejora]
- **Pain Point 2**: [Descripción] → **Oportunidad**: [Mejora]

---

## 🔍 Edge Cases y Escenarios Especiales

### Edge Case 1: [Nombre]
- **Descripción**: [Situación límite]
- **Frecuencia**: [Rara/Ocasional/Común]
- **Impacto**: [Alto/Medio/Bajo]
- **Solución**: [Cómo se maneja]

### Edge Case 2: [Nombre]
- **Descripción**: [Situación límite]
- **Frecuencia**: [Rara/Ocasional/Común]
- **Impacto**: [Alto/Medio/Bajo]
- **Solución**: [Cómo se maneja]

---

**Estado del Documento**: ⚠️ PENDIENTE DE COMPLETAR  
**Próximos Pasos**: Definir historias específicas del dominio
EOF

# 3. Flujos de Usuario
cat > "$DOCS_DIR/user-flows.md" << EOF
# 🔄 Flujos de Usuario
**Proyecto:** $PROJECT_NAME  
**Versión:** 1.0.0  
**Fecha:** $(date +%Y-%m-%d)  

---

## 🎯 Flujos Principales

### Flujo 1: [Nombre del Flujo Principal]
**Objetivo**: [Meta del usuario]  
**Trigger**: [Evento iniciador]  
**Resultado esperado**: [Outcome deseado]  

#### Estados y Transiciones
```
[Estado Inicial] 
    ↓ [Acción/Evento]
[Estado Intermedio 1]
    ↓ [Acción/Evento]
[Estado Intermedio 2]
    ↓ [Acción/Evento]
[Estado Final]
```

#### Puntos de Decisión
1. **Decisión 1**: ¿[Pregunta]?
   - **Sí** → [Camino A]
   - **No** → [Camino B]

2. **Decisión 2**: ¿[Pregunta]?
   - **Opción 1** → [Resultado]
   - **Opción 2** → [Resultado]
   - **Opción 3** → [Resultado]

#### Validaciones y Checkpoints
- [ ] **Validación 1**: [Qué se verifica]
- [ ] **Validación 2**: [Qué se verifica]
- [ ] **Checkpoint**: [Estado verificable]

---

### Flujo 2: [Nombre del Flujo Secundario]
**Objetivo**: [Meta del usuario]  
**Trigger**: [Evento iniciador]  
**Resultado esperado**: [Outcome deseado]  

#### Estados y Transiciones
```
[Estado A] → [Estado B] → [Estado C]
```

---

## 🚨 Flujos de Error y Recuperación

### Error Flow 1: [Tipo de Error]
**Trigger**: [Qué causa el error]  
**Impact**: [Efecto en el usuario/sistema]  

#### Estrategia de Recuperación
1. [Paso de recuperación 1]
2. [Paso de recuperación 2]
3. [Estado seguro alcanzado]

#### Fallbacks
- **Fallback Principal**: [Acción alternativa]
- **Fallback Secundario**: [Última opción]

---

### Error Flow 2: [Tipo de Error]
**Trigger**: [Qué causa el error]  
**Impact**: [Efecto en el usuario/sistema]  

#### Estrategia de Recuperación
1. [Paso de recuperación 1]
2. [Estado seguro alcanzado]

---

## 🔄 Flujos de Estados del Sistema

### Estados BRIK Thermodinámicos
```
ACTIVE (Entropy < 0.3)
    ↕ [Thresholds]
DORMANT (Entropy < 0.5)
    ↕ [Thresholds]
HIBERNATING (Entropy < 0.7)
```

#### Transiciones Automáticas
- **ACTIVE → DORMANT**: Cuando [condición]
- **DORMANT → HIBERNATING**: Cuando [condición]
- **HIBERNATING → ACTIVE**: Cuando [condición]

---

## 📱 Flujos Multi-Device

### Continuidad Cross-Device
1. **Device A**: [Acción inicial]
2. **Sync**: [Sincronización]
3. **Device B**: [Continuación]
4. **State Preservation**: [Mantenimiento de estado]

### Responsive Breakpoints
- **Desktop**: [Flujo específico]
- **Tablet**: [Adaptaciones]
- **Mobile**: [Simplificaciones]

---

## 🔍 Diagramas de Flujo

### Notación
```
[Acción] = Acción del usuario
{Decisión} = Punto de decisión
(Proceso) = Proceso del sistema
((Estado)) = Estado del sistema
```

### Flujo Principal Detallado
```
START
    ↓
[User Input]
    ↓
{Valid Input?}
    ↓ No → [Error Message] → [Retry]
    ↓ Yes
(Process Data)
    ↓
{Success?}
    ↓ No → (Error Handling) → ((Error State))
    ↓ Yes
((Success State))
    ↓
END
```

---

**Estado del Documento**: ⚠️ PENDIENTE DE COMPLETAR  
**Próximos Pasos**: Crear diagramas específicos del dominio y validar flujos
EOF

echo "✅ Documentación de producto generada en: $DOCS_DIR"
echo "📋 Archivos creados:"
echo "   - PRD.md"
echo "   - user-stories.md"
echo "   - user-flows.md"
echo ""
echo "🎯 Siguientes pasos:"
echo "   1. Completar PRD con información específica del proyecto"
echo "   2. Definir historias de usuario detalladas"
echo "   3. Crear diagramas de flujo específicos"
echo "   4. Validar con stakeholders"