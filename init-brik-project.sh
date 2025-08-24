#!/bin/bash
# 🧬 init-brik-project.sh - Inicializador Universal BRIK
# Implementa filosofía DAAF-BRIK-Circuitalidad Digital

set -euo pipefail

# Directorio donde vive este script (independiente del cwd)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PROJECT_NAME=${1:-"nuevo-proyecto-brik"}
PROJECT_TYPE=${2:-"typescript"} # rust, python, go, etc.

echo "🧬 Inicializando proyecto BRIK: $PROJECT_NAME"
echo "📋 Tipo: $PROJECT_TYPE"

# Crear estructura de directorios BRIK
create_brik_structure() {
    echo "📁 Creando estructura de directorios BRIK..."
    mkdir -p "$PROJECT_NAME"/{core,components,living-layer,audit,tests/{unit,integration,property,immutability},benchmarks,scripts,config,docs/{product,technical,operational,optional}}
    cd "$PROJECT_NAME"
}

# Generar ADN del proyecto
generate_dna() {
    echo "🧬 Generando ADN del proyecto..."
    cat > .brik-dna.yml << EOF
project:
  name: "$PROJECT_NAME"
  version: "1.0.0"
  philosophy: "DAAF-BRIK-CircuitalidadDigital"
  genesis_hash: "$(date +%s | sha256sum | cut -d' ' -f1)"
  created_at: "$(date -Iseconds)"
  
principles:
  circuitality: true
  consciousness: true
  thermodynamics: true
  auditability: true
  documentation: true
  
compliance:
  coverage_requirement: 100
  immutability_check: true
  entropy_monitoring: true
  ethical_validation: true
  documentation_completeness: true
EOF
}

# Generar manifiesto de circuitalidad
generate_manifesto() {
    echo "⚡ Generando manifiesto de circuitalidad..."
    cat > CIRCUITALIDAD.md << 'EOF'
# 🧬 Manifiesto de Circuitalidad Digital

## Principio Fundamental
> "El software es el nuevo silicio, y cada línea de código es una puerta lógica en un circuito simbólico infinitamente expansible."

## Compromiso de Implementación
- ✅ **100% Cobertura de Código**: Cada línea es un circuito verificado
- ✅ **Inmutabilidad del Core**: Núcleo fijo post-deployment
- ✅ **Living Code Layer**: Consciencia integrada
- ✅ **Termodinámica Digital**: Gestión de entropía
- ✅ **Auditoría Cuántica**: Trazabilidad total
- ✅ **Documentación Integral**: Conocimiento completo y actualizado

## Estados Termodinámicos
- 🟢 **ACTIVE** (Entropía < 0.3): Máximo rendimiento
- 🟡 **DORMANT** (Entropía < 0.5): Eficiencia optimizada  
- 🔴 **HIBERNATING** (Entropía < 0.7): Conservación crítica

## Filosofía de Documentación Auto-Consistente
Todo proyecto BRIK debe ser **completamente auto-documentado** siguiendo el **protocolo de auto-consistencia**:

> **Principio Fundamental**: La documentación no es opcional, es el ADN del proyecto. Sin documentación completa, no hay certificación BRIK.

### 🎯 Protocolo de Completitud
- ✅ **100% Obligatorio**: Sin excepción para certificación BRIK
- ✅ **Documentación Viviente**: Actualización automática con código
- ✅ **Multi-Audiencia**: Técnica, producto, operativa, investigativa
- ✅ **Trazabilidad Completa**: Decisiones arquitectónicas registradas
- ✅ **Validación Automática**: CI/CD falla si documentación incompleta

### 📚 Checklist de Documentación BRIK
**Archivo detallado**: `docs/DOCUMENTATION_CHECKLIST.md`

**Categorías obligatorias**:
1. **📋 Producto** (PRD, historias usuario, criterios aceptación, flujos, mockups)
2. **🏗️ Técnica** (arquitectura, APIs, datos, decisiones, seguridad, estándares)  
3. **🔧 Operativa** (testing, deploy, configuración, operación, contribución)
4. **📚 Complementaria** (riesgos, benchmarking, investigación, buenas prácticas)

### 🔍 Validación Automática
```bash
# Validar completitud de documentación
./scripts/validate-docs.sh

# Métricas:
# - Mínimo desarrollo: 85%
# - Target producción: 95% 
# - Perfección BRIK: 100%
```
EOF
}

# Generar documentación completa
generate_documentation() {
    echo "📚 Generando documentación integral del proyecto..."
    
    # Copiar checklist de documentación obligatorio
    echo "📋 Copiando checklist de documentación BRIK..."
    if [[ -f "$SCRIPT_DIR/templates/DOCUMENTATION_CHECKLIST.md" ]]; then
        cp "$SCRIPT_DIR/templates/DOCUMENTATION_CHECKLIST.md" "docs/DOCUMENTATION_CHECKLIST.md"
    else
        echo "⚠️ Template no encontrado, generando checklist básico..."
        echo "# 📚 Checklist de Documentación BRIK - Pendiente de completar" > "docs/DOCUMENTATION_CHECKLIST.md"
    fi
    
    # Generar estructura de documentación
    echo "📁 Creando estructura de documentación..."
    mkdir -p docs/{product,technical,operational,optional}
    
    # Llamar a los scripts de documentación específicos
    if [[ -f "$SCRIPT_DIR/generators/generate-product-docs.sh" ]]; then
        bash "$SCRIPT_DIR/generators/generate-product-docs.sh" "$PROJECT_NAME"
    else
        echo "⚠️ generate-product-docs.sh no encontrado, saltando..."
    fi
    
    if [[ -f "$SCRIPT_DIR/generators/generate-technical-docs.sh" ]]; then
        bash "$SCRIPT_DIR/generators/generate-technical-docs.sh" "$PROJECT_NAME" "$PROJECT_TYPE"
    else
        echo "⚠️ generate-technical-docs.sh no encontrado, saltando..."
    fi
    
    if [[ -f "$SCRIPT_DIR/generators/generate-operational-docs.sh" ]]; then
        bash "$SCRIPT_DIR/generators/generate-operational-docs.sh" "$PROJECT_NAME" "$PROJECT_TYPE"
    else
        echo "⚠️ generate-operational-docs.sh no encontrado, saltando..."
    fi
    
    if [[ -f "$SCRIPT_DIR/generators/generate-optional-docs.sh" ]]; then
        bash "$SCRIPT_DIR/generators/generate-optional-docs.sh" "$PROJECT_NAME"
    else
        echo "⚠️ generate-optional-docs.sh no encontrado, saltando..."
    fi
    
    # Generar validador de documentación
    generate_doc_validator
}

# Configurar según el tipo de proyecto
setup_project_type() {
    echo "⚙️ Configurando proyecto tipo: $PROJECT_TYPE"
    if [[ -f "$SCRIPT_DIR/generators/setup-${PROJECT_TYPE}.sh" ]]; then
        bash "$SCRIPT_DIR/generators/setup-${PROJECT_TYPE}.sh" "$PROJECT_NAME"
    else
        echo "⚠️ setup-${PROJECT_TYPE}.sh no encontrado, configuración básica..."
        echo "# $PROJECT_NAME - BRIK Project" > README.md
    fi
}

# Generar templates de código base
generate_core_templates() {
    echo "🔧 Generando templates del core..."
    if [[ -f "$SCRIPT_DIR/generators/generate-core-templates.sh" ]]; then
        bash "$SCRIPT_DIR/generators/generate-core-templates.sh" "$PROJECT_NAME" "$PROJECT_TYPE"
    else
        echo "⚠️ generate-core-templates.sh no encontrado, saltando..."
    fi
}

# Generar scripts de automatización
generate_scripts() {
    echo "🛠️ Generando scripts de automatización..."
    if [[ -f "$SCRIPT_DIR/generators/generate-scripts.sh" ]]; then
        bash "$SCRIPT_DIR/generators/generate-scripts.sh" "$PROJECT_NAME" "$PROJECT_TYPE"
    else
        echo "⚠️ generate-scripts.sh no encontrado, saltando..."
    fi
}

# Generar configuración de desarrollo
generate_dev_config() {
    echo "🔧 Generando configuración de desarrollo..."
    if [[ -f "$SCRIPT_DIR/generators/generate-dev-config.sh" ]]; then
        bash "$SCRIPT_DIR/generators/generate-dev-config.sh" "$PROJECT_NAME" "$PROJECT_TYPE"
    else
        echo "⚠️ generate-dev-config.sh no encontrado, saltando..."
    fi
}

# Generar validador de documentación
generate_doc_validator() {
    echo "🔍 Generando validador de documentación..."
    
    cat > scripts/validate-docs.sh << 'EOF'
#!/bin/bash
# 🔍 Validador de Documentación BRIK
# Verifica completitud del checklist de documentación

set -euo pipefail

CHECKLIST_FILE="docs/DOCUMENTATION_CHECKLIST.md"
EXIT_CODE=0

echo "📚 BRIK Documentation Validator"
echo "═══════════════════════════════════════"

if [[ ! -f "$CHECKLIST_FILE" ]]; then
    echo "❌ ERROR: Checklist de documentación no encontrado"
    echo "   Ubicación esperada: $CHECKLIST_FILE"
    exit 1
fi

# Contar items completados vs pendientes
TOTAL_ITEMS=$(grep -c "^- \[" "$CHECKLIST_FILE" || true)
COMPLETED_ITEMS=$(grep -c "^- \[x\]" "$CHECKLIST_FILE" || true)
PENDING_ITEMS=$((TOTAL_ITEMS - COMPLETED_ITEMS))

if [[ "$TOTAL_ITEMS" -eq 0 ]]; then
    echo "❌ ERROR: No se encontraron items en el checklist"
    exit 1
fi

COMPLETION_PERCENTAGE=$(( COMPLETED_ITEMS * 100 / TOTAL_ITEMS ))

echo "📊 Estado de Documentación:"
echo "   Total items: $TOTAL_ITEMS"
echo "   Completados: $COMPLETED_ITEMS"
echo "   Pendientes: $PENDING_ITEMS"
echo "   Completitud: $COMPLETION_PERCENTAGE%"
echo ""

# Validar completitud mínima
if [[ $COMPLETION_PERCENTAGE -lt 85 ]]; then
    echo "❌ FALLO: Completitud insuficiente ($COMPLETION_PERCENTAGE%)"
    echo "   Mínimo requerido: 85% para desarrollo"
    echo "   Target recomendado: 95% para producción"
    EXIT_CODE=1
elif [[ $COMPLETION_PERCENTAGE -lt 95 ]]; then
    echo "⚠️  ADVERTENCIA: Completitud por debajo del target ($COMPLETION_PERCENTAGE%)"
    echo "   Recomendado: 95% para producción"
elif [[ $COMPLETION_PERCENTAGE -eq 100 ]]; then
    echo "🎉 PERFECTO: Documentación 100% completa"
    echo "   ✅ Certificación BRIK: APROBADA"
else
    echo "✅ BUENO: Completitud satisfactoria ($COMPLETION_PERCENTAGE%)"
fi

echo ""
echo "📋 Items Pendientes:"
grep -n "^- \[ \]" "$CHECKLIST_FILE" | head -10 || echo "   ✅ No hay items pendientes"

exit $EXIT_CODE
EOF

    chmod +x scripts/validate-docs.sh
    
    echo "✅ Validador creado en: scripts/validate-docs.sh"
}

# Generar script de cobertura (global 100%)
generate_coverage_script() {
    echo "🧪 Generando script de cobertura (100% global)..."
    mkdir -p scripts
    cat > scripts/test-coverage.sh << 'EOF'
#!/bin/bash
# 🧪 BRIK Coverage Enforcer (100% global)
set -euo pipefail

PROJECT_TYPE=${1:-"auto"}

# Autodetección por archivos
if [[ "$PROJECT_TYPE" == "auto" ]]; then
  if [[ -f Cargo.toml ]]; then PROJECT_TYPE="rust";
  elif [[ -f package.json ]]; then PROJECT_TYPE="typescript";
  elif [[ -f requirements.txt || -f pyproject.toml ]]; then PROJECT_TYPE="python";
  elif [[ -f go.mod ]]; then PROJECT_TYPE="go";
  else PROJECT_TYPE="unknown"; fi
fi

case "$PROJECT_TYPE" in
  rust)
    if ! command -v cargo >/dev/null 2>&1; then
      echo "❌ cargo no encontrado"; exit 1; fi
    if ! command -v cargo-tarpaulin >/dev/null 2>&1 && ! cargo tarpaulin -V >/dev/null 2>&1; then
      echo "❌ cargo-tarpaulin no está instalado. Instala con: cargo install cargo-tarpaulin"; exit 2; fi
    echo "▶️  Ejecutando cobertura con cargo-tarpaulin (líneas+ramas, 100%)..."
    cargo tarpaulin --workspace --force-clean --ignore-tests --branch --fail-under 100 | tee /tmp/_brik_cov.txt
    # Verificación adicional: cada archivo al 100% de líneas
    if grep -E '^\|\| Tested/Total Lines:' -A 10 /tmp/_brik_cov.txt | grep -E 'src/.+:' | grep -vE ': \s*([0-9]+)/\1' >/dev/null; then
      echo "❌ Algún archivo no tiene 100% de líneas"; exit 5; fi
    echo "✅ Cobertura OK: líneas y ramas al 100% (por archivo y global)";;

  typescript)
    # Requiere dependencias instaladas y jest configurado
    PKG_MGR=""
    if command -v pnpm >/dev/null 2>&1; then PKG_MGR="pnpm";
    elif command -v npm >/dev/null 2>&1; then PKG_MGR="npm"; fi
    if [[ -z "$PKG_MGR" ]]; then echo "❌ npm/pnpm no encontrado"; exit 1; fi
    echo "▶️  Ejecutando cobertura con Jest (100% requerido)..."
    if [[ "$PKG_MGR" == "pnpm" ]]; then pnpm run coverage; else npm run coverage; fi
    echo "✅ Cobertura OK (Jest aplica 100% global y por archivo)";;

  python)
    if ! command -v pytest >/dev/null 2>&1; then echo "❌ pytest no encontrado"; exit 1; fi
    if ! command -v coverage >/dev/null 2>&1; then echo "❌ coverage no encontrado"; exit 1; fi
    echo "▶️  Ejecutando cobertura con pytest-cov (100% global y por archivo)..."
    # Fuente: intenta src/ primero, luego paquete local
    if [[ -d src ]]; then COV_TARGET="src"; else COV_TARGET="."; fi
    pytest --cov="$COV_TARGET" --cov-branch --cov-report=term-missing --cov-fail-under=100 | tee /tmp/_brik_py_cov.txt
    # Verifica cada archivo con 100% (busca filas con menos de 100%)
    if grep -E "\s[0-9]+%$" /tmp/_brik_py_cov.txt | grep -v '100%$' >/dev/null; then
      echo "❌ Algún archivo Python no tiene 100%"; exit 4; fi
    echo "✅ Cobertura OK: líneas y ramas al 100% (global y por archivo)";;

  go)
    if ! command -v go >/dev/null 2>&1; then echo "❌ go no encontrado"; exit 1; fi
    echo "▶️  Ejecutando cobertura con go test (100% requerido)..."
    go test ./... -coverprofile=coverage.out -covermode=count
    if ! command -v go >/dev/null 2>&1; then echo "❌ go no encontrado"; exit 1; fi
    REPORT=$(go tool cover -func=coverage.out)
    echo "$REPORT" | sed -n '1,10p'
    # Verifica por función 100%
    if echo "$REPORT" | grep -E '\s[0-9]+\.[0-9]+%$' | grep -v '100.0%$' >/dev/null; then
      echo "❌ Alguna función Go no tiene 100%"; exit 4; fi
    TOTAL=$(echo "$REPORT" | grep -E '^total:' | awk '{print $3}' | tr -d '%')
    INT=${TOTAL%.*}
    if [[ -z "${INT:-}" || "$INT" -lt 100 ]]; then echo "❌ Cobertura total insuficiente: ${TOTAL}%"; exit 4; fi
    echo "✅ Cobertura OK: 100% por función y total";;

  *)
    echo "⚠️ Tipo $PROJECT_TYPE no soportado aún. Añade tu verificador de cobertura."
    exit 0;;
esac
EOF
    chmod +x scripts/test-coverage.sh
    echo "✅ Script creado en: scripts/test-coverage.sh"
}

# Verificar prerequisitos
check_prerequisites() {
    echo "🔍 Verificando prerequisitos..."
    
    # Verificar dependencias básicas
    command -v git >/dev/null 2>&1 || { echo "❌ Git requerido"; exit 1; }
    command -v node >/dev/null 2>&1 || { echo "⚠️ Node.js recomendado"; }
    command -v docker >/dev/null 2>&1 || { echo "⚠️ Docker recomendado"; }
    
    echo "✅ Prerequisitos verificados"
}

# Función principal
main() {
    echo ""
    echo "🚀 INICIALIZADOR BRIK v5.0"
    echo "═══════════════════════════════════════════════════════════════"
    echo "🧬 Proyecto: $PROJECT_NAME"
    echo "📋 Tipo: $PROJECT_TYPE" 
    echo "⚡ Filosofía: DAAF-BRIK-Circuitalidad Digital"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    
    check_prerequisites
    create_brik_structure
    generate_dna
    generate_manifesto
    generate_documentation
    setup_project_type
    generate_core_templates
    generate_scripts
    generate_dev_config
    generate_coverage_script
    
    echo ""
    echo "🎉 ¡Proyecto BRIK inicializado exitosamente!"
    echo "📂 Ubicación: $(pwd)"
    echo ""
    echo "🚀 Próximos pasos:"
    echo "1. cd $PROJECT_NAME"
    echo "2. Revisar docs/DOCUMENTATION_CHECKLIST.md (OBLIGATORIO)"
    echo "3. Completar documentación mínima (85%): ./scripts/validate-docs.sh"
    echo "4. Instalar dependencias según el tipo de proyecto"
    echo "5. Ejecutar: ./scripts/test-coverage.sh (100% GLOBAL requerido)"
    echo "6. Ejecutar: ./scripts/entropy-monitor.sh"
    echo "7. Ejecutar: ./scripts/audit-check.sh"
    echo ""
    echo "🧬 Tu proyecto ahora sigue los principios de Circuitalidad Digital"
    echo "📚 Documentación completa generada en /docs"
    echo "⚡ Core inmutable, wrappers evolutivos, consciencia integrada"
    echo ""
}

# Verificar que estamos en el directorio correcto
if [[ ! -f "$SCRIPT_DIR/generators/generate-product-docs.sh" ]]; then
    echo "❌ Error: Generadores no encontrados"
    echo "   Asegúrate de ejecutar desde el directorio BRIK-Project-Initializer"
    exit 1
fi

main "$@"
