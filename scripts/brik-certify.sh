#!/bin/bash

# ================================================================
# BRIK INITIALIZER - AUTO-CERTIFICACIÓN
# Verifica que la herramienta cumple sus propios principios BRIK
# ================================================================

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
CERTIFICATION_FILE="$PROJECT_ROOT/.brik-cert.json"
HASH_FILE="$PROJECT_ROOT/.brik-cert.sha256"

echo "🧬 BRIK INITIALIZER - AUTO-CERTIFICACIÓN"
echo "═══════════════════════════════════════════════════════════"
echo "📂 Proyecto: BRIK Project Initializer"
echo "📍 Ubicación: $PROJECT_ROOT"
echo "⏰ Timestamp: $TIMESTAMP"
echo "═══════════════════════════════════════════════════════════"

# ================================================================
# VARIABLES DE CERTIFICACIÓN
# ================================================================

CERTIFICATION_DATA='{
  "project_name": "brik-project-initializer",
  "project_type": "toolchain",
  "version": "5.0",
  "timestamp": "'$TIMESTAMP'",
  "coverage_requirement": 100,
  "coverage_scope": "global+per-file (lines,branches)",
  "architecture": "brik-meta-system",
  "certification_level": "self-validating",
  "validator": "brik-initializer-core"
}'

ERRORS=0
WARNINGS=0

# ================================================================
# FUNCIONES DE VALIDACIÓN
# ================================================================

log_success() {
    echo "✅ $1"
}

log_warning() {
    echo "⚠️  $1"
    ((WARNINGS++))
}

log_error() {
    echo "❌ $1"
    ((ERRORS++))
}

log_info() {
    echo "🔍 $1"
}

# ================================================================
# 1. VERIFICACIÓN DE ESTRUCTURA BRIK
# ================================================================

echo ""
echo "🔍 1. VERIFICANDO ESTRUCTURA BRIK META-SISTEMA"
echo "─────────────────────────────────────────────────────"

# Core del initializer
if [[ -d "$PROJECT_ROOT/generators" ]]; then
    log_success "CORE: Directorio generators/ (núcleo immutable)"
else
    log_error "CORE: Directorio generators/ faltante"
fi

# Wrappers (setup scripts por lenguaje)
if [[ -f "$PROJECT_ROOT/generators/setup-rust.sh" ]] && [[ -f "$PROJECT_ROOT/generators/setup-typescript.sh" ]]; then
    log_success "WRAPPERS: Scripts de setup por lenguaje"
else
    log_error "WRAPPERS: Scripts de setup faltantes"
fi

# Living layer (inteligencia LLM)
if [[ -d "$PROJECT_ROOT/generators/intelligent" ]]; then
    log_success "LIVING-LAYER: Sistema inteligente LLM"
else
    log_error "LIVING-LAYER: Sistema inteligente faltante"
fi

# ================================================================
# 2. VERIFICACIÓN DE TESTS (CRÍTICO)
# ================================================================

echo ""
echo "🧪 2. VERIFICANDO COBERTURA DE TESTS"
echo "─────────────────────────────────────────────────────"

# Buscar tests reales
REAL_TESTS=$(find "$PROJECT_ROOT" -name "*.test.js" -o -name "*_test.py" -o -name "*test*.sh" | grep -v demo- | wc -l)

if [[ $REAL_TESTS -eq 0 ]]; then
    log_error "COVERAGE: 0% - No hay tests para el initializer (VIOLACIÓN CRÍTICA BRIK)"
    log_error "REQUERIDO: Tests para generators/, init-brik-project.sh, intelligent/"
else
    log_success "TESTS: $REAL_TESTS archivos de test encontrados"
fi

# ================================================================
# 3. VERIFICACIÓN DE INMUTABILIDAD CORE
# ================================================================

echo ""
echo "🔒 3. VERIFICANDO INMUTABILIDAD CORE"
echo "─────────────────────────────────────────────────────"

# Verificar que el core no tenga código mutable peligroso
MUTABLE_PATTERNS=(
    "eval\("
    "Function\("
    "delete\s"
    "\.prototype\."
)

CORE_FILES=$(find "$PROJECT_ROOT/generators" -name "*.js" -o -name "*.sh")
MUTABLE_VIOLATIONS=0

for pattern in "${MUTABLE_PATTERNS[@]}"; do
    if grep -r "$pattern" $CORE_FILES 2>/dev/null; then
        log_warning "INMUTABILIDAD: Patrón mutable detectado: $pattern"
        ((MUTABLE_VIOLATIONS++))
    fi
done

if [[ $MUTABLE_VIOLATIONS -eq 0 ]]; then
    log_success "INMUTABILIDAD: Core libre de patrones mutables peligrosos"
else
    log_error "INMUTABILIDAD: $MUTABLE_VIOLATIONS violaciones detectadas"
fi

# ================================================================
# 4. VERIFICACIÓN DE FUNCIONALIDAD CRÍTICA
# ================================================================

echo ""
echo "⚡ 4. VERIFICANDO FUNCIONALIDAD CRÍTICA"
echo "─────────────────────────────────────────────────────"

# Verificar que el script principal existe y es ejecutable
if [[ -x "$PROJECT_ROOT/init-brik-project.sh" ]]; then
    log_success "EXECUTABLE: init-brik-project.sh ejecutable"
else
    log_error "EXECUTABLE: init-brik-project.sh no ejecutable o faltante"
fi

# Verificar componentes críticos del modo smart
CRITICAL_COMPONENTS=(
    "generators/intelligent/domain-analyzer.js"
    "generators/intelligent/architecture-classifier.js"
    "generators/intelligent/code-generator.js"
)

for component in "${CRITICAL_COMPONENTS[@]}"; do
    if [[ -f "$PROJECT_ROOT/$component" ]]; then
        log_success "COMPONENT: $component presente"
    else
        log_error "COMPONENT: $component faltante"
    fi
done

# ================================================================
# 5. VERIFICACIÓN DE DOCUMENTACIÓN
# ================================================================

echo ""
echo "📚 5. VERIFICANDO DOCUMENTACIÓN"
echo "─────────────────────────────────────────────────────"

# README debe existir y ser completo
if [[ -f "$PROJECT_ROOT/README.md" ]] && [[ $(wc -l < "$PROJECT_ROOT/README.md") -gt 100 ]]; then
    log_success "DOCS: README.md completo"
else
    log_error "DOCS: README.md faltante o incompleto"
fi

# Verificar documentación BRIK core
if [[ -d "$PROJECT_ROOT/brikseed/docs" ]]; then
    log_success "DOCS: Documentación BRIK fundacional"
else
    log_warning "DOCS: Documentación BRIK fundacional faltante"
fi

# ================================================================
# 6. TEST FUNCIONAL BASIC
# ================================================================

echo ""
echo "🚀 6. TEST FUNCIONAL BÁSICO"
echo "─────────────────────────────────────────────────────"

# Test del modo tradicional (debe funcionar)
cd "$PROJECT_ROOT"
TEMP_DIR=$(mktemp -d)

if bash init-brik-project.sh test-auto-cert rust --output "$TEMP_DIR" >/dev/null 2>&1; then
    log_success "FUNCTIONAL: Modo tradicional funcional"
    rm -rf "$TEMP_DIR/test-auto-cert"
else
    log_error "FUNCTIONAL: Modo tradicional falló"
fi

rm -rf "$TEMP_DIR"

# ================================================================
# 7. CÁLCULO DE CERTIFICACIÓN
# ================================================================

echo ""
echo "🔐 7. GENERANDO CERTIFICACIÓN BRIK"
echo "─────────────────────────────────────────────────────"

# Calcular score de cumplimiento
TOTAL_CHECKS=10
FAILED_CHECKS=$ERRORS
COMPLIANCE_SCORE=$(( (TOTAL_CHECKS - FAILED_CHECKS) * 100 / TOTAL_CHECKS ))

# Actualizar datos de certificación
CERTIFICATION_DATA=$(echo "$CERTIFICATION_DATA" | jq --argjson errors "$ERRORS" --argjson warnings "$WARNINGS" --argjson score "$COMPLIANCE_SCORE" '. + {
  "validation_errors": $errors,
  "validation_warnings": $warnings,
  "compliance_score": $score,
  "brik_validated": ($errors == 0),
  "certification_level": (if $errors == 0 then "CERTIFIED" elif $errors <= 2 then "CONDITIONAL" else "FAILED" end)
}')

# ================================================================
# 8. GUARDAR CERTIFICACIÓN
# ================================================================

echo "$CERTIFICATION_DATA" > "$CERTIFICATION_FILE"

# Generar hash SHA-256
CERT_HASH=$(echo "$CERTIFICATION_DATA" | sha256sum | cut -d' ' -f1)
echo "$CERT_HASH" > "$HASH_FILE"

echo ""
echo "💾 Certificación guardada en: $CERTIFICATION_FILE"
echo "🔐 Hash SHA-256: $CERT_HASH"

# ================================================================
# 9. RESULTADO FINAL
# ================================================================

echo ""
echo "📊 RESULTADO FINAL DE CERTIFICACIÓN"
echo "═══════════════════════════════════════════════════════════"
echo "⚠️  Errores: $ERRORS"
echo "⚠️  Warnings: $WARNINGS"
echo "📈 Score: $COMPLIANCE_SCORE%"

if [[ $ERRORS -eq 0 ]]; then
    echo "🏆 RESULTADO: ✅ CERTIFICADO BRIK"
    echo "🔐 Hash: $CERT_HASH"
    echo "✅ La herramienta cumple los principios BRIK"
    exit 0
elif [[ $ERRORS -le 2 ]]; then
    echo "🟡 RESULTADO: ⚠️  CERTIFICACIÓN CONDICIONAL"
    echo "🔧 Requiere correcciones menores"
    exit 1
else
    echo "🚨 RESULTADO: ❌ CERTIFICACIÓN FALLIDA"
    echo "💥 VIOLACIÓN CRÍTICA de principios BRIK detectada"
    echo "🔧 Requiere reparación completa antes de usar"
    exit 2
fi