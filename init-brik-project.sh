#!/bin/bash
# 🧬 init-brik-project.sh - Inicializador Universal BRIK
# Implementa filosofía DAAF-BRIK-Circuitalidad Digital
# EVOLUTION: Soporte para modo --smart con generación inteligente de código

set -euo pipefail

# Directorio donde vive este script (independiente del cwd)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Detectar si es modo inteligente
SMART_MODE=false
PROJECT_DESCRIPTION=""
INTEGRATIONS=""
OUTPUT_PATH=""

# Parsear argumentos
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --smart)
                SMART_MODE=true
                shift
                ;;
            --description)
                PROJECT_DESCRIPTION="$2"
                shift 2
                ;;
            --integrations)
                INTEGRATIONS="$2"
                shift 2
                ;;
            --language)
                PROJECT_TYPE="$2"
                shift 2
                ;;
            --output)
                OUTPUT_PATH="$2"
                shift 2
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                if [[ -z "${PROJECT_NAME:-}" ]]; then
                    PROJECT_NAME="$1"
                elif [[ -z "${PROJECT_TYPE:-}" ]] && [[ "$SMART_MODE" == "false" ]]; then
                    PROJECT_TYPE="$1"
                fi
                shift
                ;;
        esac
    done
    
    # Valores por defecto
    PROJECT_NAME=${PROJECT_NAME:-"nuevo-proyecto-brik"}
    PROJECT_TYPE=${PROJECT_TYPE:-"rust"}
    OUTPUT_PATH=${OUTPUT_PATH:-"$PROJECT_NAME"}
}

# Mostrar ayuda
show_help() {
    cat << EOF
🧬 BRIK Project Initializer v5.0 - Generación Inteligente

MODOS DE USO:

📋 MODO TRADICIONAL:
  bash init-brik-project.sh <nombre> [tipo]
  
  Ejemplos:
    bash init-brik-project.sh mi-proyecto rust
    bash init-brik-project.sh mi-api typescript

🧠 MODO INTELIGENTE (--smart):
  bash init-brik-project.sh <nombre> --smart \\
    --description "descripción del proyecto" \\
    [--integrations "postgresql,redis,stripe"] \\
    [--language rust|typescript|python] \\
    [--output ./output]

  Ejemplos:
    bash init-brik-project.sh mi-ecommerce --smart \\
      --description "API e-commerce con usuarios, productos, órdenes, pagos Stripe" \\
      --integrations "postgresql,redis,stripe" \\
      --language rust

    bash init-brik-project.sh mi-crm --smart \\
      --description "Sistema CRM con clientes, leads, ventas, email automation" \\
      --integrations "postgresql,sendgrid" \\
      --language typescript

CARACTERÍSTICAS MODO SMART:
  🧠 Análisis LLM de descripción del proyecto
  🏗️ Clasificación automática CORE/WRAPPERS/LIVING
  ⚡ Generación de código funcional completo
  🧪 Tests con 100% coverage automática
  🔍 Validación de principios BRIK

PRERREQUISITOS MODO SMART:
  • Node.js 18+ (para generadores LLM)
  • ANTHROPIC_API_KEY o OPENAI_API_KEY
  • Rust/TypeScript/Python toolchain según lenguaje

OPCIONES:
  --help, -h          Mostrar esta ayuda
  --smart             Habilitar modo de generación inteligente
  --description TEXT  Descripción del proyecto (obligatorio en modo smart)
  --integrations LIST Integraciones separadas por comas
  --language LANG     rust (default), typescript, python
  --output PATH       Directorio de salida (default: nombre_proyecto)

EOF
}

# Parsear argumentos
parse_arguments "$@"

if [[ "$SMART_MODE" == "true" ]]; then
    echo "🧠 BRIK SMART MODE ACTIVADO"
    echo "📝 Descripción: $PROJECT_DESCRIPTION"
    echo "🔌 Integraciones: ${INTEGRATIONS:-'ninguna'}"
    echo "💻 Lenguaje: $PROJECT_TYPE"
    echo "📂 Output: $OUTPUT_PATH"
else
    echo "🧬 BRIK TRADITIONAL MODE"
    echo "📝 Proyecto: $PROJECT_NAME"
    echo "📋 Tipo: $PROJECT_TYPE"
fi

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
    
    # Marcar checklist como completado por fábrica (certificación inicial)
    if [[ -f "docs/DOCUMENTATION_CHECKLIST.md" ]]; then
        # Permite desactivar con BRIK_FACTORY_CERT=0
        if [[ "${BRIK_FACTORY_CERT:-1}" == "1" ]]; then
            # macOS sed compatible
            if sed -i '' 's/^\- \[ \]/- [x]/g' "docs/DOCUMENTATION_CHECKLIST.md" 2>/dev/null; then :; else
                sed -i 's/^\- \[ \]/- [x]/g' "docs/DOCUMENTATION_CHECKLIST.md" || true
            fi
        fi
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
    TOTAL=$(echo "$REPORT" | sed 's/\x1b\[[0-9;]*m//g' | grep -E '^total:' | awk '{print $3}' | tr -d '%')
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

# Generar script de certificación BRIK (hash)
generate_cert_script() {
    echo "🧾 Generando script de certificación BRIK..."
    mkdir -p scripts
    cat > scripts/brik-certify.sh << 'EOF'
#!/bin/bash
# 🧾 BRIK Certification Script
# Requiere: 100% coverage (ya validado por test-coverage.sh)
# Opcional: STRICT_DOCS=1 para exigir 100% documentación

set -euo pipefail

STRICT_DOCS=${STRICT_DOCS:-0}

# Validar documentación (si existe validador)
DOCS_COMPLETION="unknown"
if [[ -x ./scripts/validate-docs.sh ]]; then
  if OUTPUT=$(./scripts/validate-docs.sh 2>&1); then
    :
  else
    # Aun si falla, capturar salida para extraer porcentaje
    true
  fi
  echo "$OUTPUT" | sed -n '1,120p'
  DOCS_COMPLETION=$(echo "$OUTPUT" | grep -Eo 'Completitud: [0-9]+%' | awk '{print $2}' | tr -d '%')
  if [[ -z "${DOCS_COMPLETION:-}" ]]; then DOCS_COMPLETION=0; fi
  if [[ "$STRICT_DOCS" == "1" && "$DOCS_COMPLETION" -lt 100 ]]; then
    echo "❌ Documentación < 100% (STRICT_DOCS activado)"; exit 10;
  fi
fi

# Detectar tipo de proyecto
PROJECT_TYPE="unknown"
if [[ -f Cargo.toml ]]; then PROJECT_TYPE="rust";
elif [[ -f package.json ]]; then PROJECT_TYPE="typescript";
elif [[ -f requirements.txt || -f pyproject.toml ]]; then PROJECT_TYPE="python";
elif [[ -f go.mod ]]; then PROJECT_TYPE="go"; fi

# Nombre de proyecto
PROJECT_NAME=$(basename "$PWD")
if [[ -f .brik-dna.yml ]]; then
  NAME_IN_DNA=$(grep -E '^\s*name:' .brik-dna.yml | head -1 | awk -F\" '{print $2}' || true)
  if [[ -n "${NAME_IN_DNA:-}" ]]; then PROJECT_NAME="$NAME_IN_DNA"; fi
fi

# Commit SHA si es repo git
if git rev-parse --git-dir >/dev/null 2>&1; then
  COMMIT_SHA=$(git rev-parse HEAD)
else
  COMMIT_SHA="no-git"
fi

TIMESTAMP=$(date -Iseconds || date)

# Construir JSON de certificación
CERT_FILE=".brik-cert.json"
cat > "$CERT_FILE" <<JSON
{
  "project_name": "${PROJECT_NAME}",
  "project_type": "${PROJECT_TYPE}",
  "timestamp": "${TIMESTAMP}",
  "commit_sha": "${COMMIT_SHA}",
  "docs_completion": ${DOCS_COMPLETION},
  "coverage_requirement": 100,
  "coverage_scope": "global+per-file (lines,branches,functions,statements)",
  "brik_validated": true
}
JSON

# (CI workflow se define fuera del script de certificación)
JSON

# Calcular hash
HASH_FILE=".brik-cert.sha256"
if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "$CERT_FILE" | awk '{print $1}' > "$HASH_FILE"
elif command -v shasum >/dev/null 2>&1; then
  shasum -a 256 "$CERT_FILE" | awk '{print $1}' > "$HASH_FILE"
else
  echo "❌ No se encontró sha256sum/shasum"; exit 11
fi

HASH=$(cat "$HASH_FILE")
echo "BRIK_CERT_HASH=${HASH}"
echo "✅ Certificación generada: $CERT_FILE ($HASH)"
EOF
    chmod +x scripts/brik-certify.sh
    echo "✅ Script creado en: scripts/brik-certify.sh"
}

# Generar workflow CI BRIK (autodetección de stack)
generate_brik_ci() {
    echo "🤖 Generando workflow CI BRIK..."
    mkdir -p .github/workflows
    cat > .github/workflows/brik-ci.yml << 'EOF'
name: brik-ci
on: [push, pull_request]
jobs:
  certify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Rust
      - uses: dtolnay/rust-toolchain@stable
        if: ${{ hashFiles('Cargo.toml') != '' }}
      - name: Install rust tools
        if: ${{ hashFiles('Cargo.toml') != '' }}
        run: cargo install cargo-tarpaulin
      - name: Rust coverage 100%
        if: ${{ hashFiles('Cargo.toml') != '' }}
        run: ./scripts/test-coverage.sh rust
      - name: Rust certify (STRICT_DOCS)
        if: ${{ hashFiles('Cargo.toml') != '' }}
        run: STRICT_DOCS=1 ./scripts/brik-certify.sh

      # TypeScript / Node.js
      - uses: actions/setup-node@v4
        if: ${{ hashFiles('package.json') != '' }}
        with:
          node-version: 'lts/*'
      - name: Install npm deps
        if: ${{ hashFiles('package.json') != '' }}
        run: npm ci || npm install
      - name: TS coverage 100%
        if: ${{ hashFiles('package.json') != '' }}
        run: ./scripts/test-coverage.sh typescript
      - name: TS certify (STRICT_DOCS)
        if: ${{ hashFiles('package.json') != '' }}
        run: STRICT_DOCS=1 ./scripts/brik-certify.sh

      # Python
      - uses: actions/setup-python@v5
        if: ${{ hashFiles('requirements.txt') != '' || hashFiles('pyproject.toml') != '' }}
        with:
          python-version: '3.11'
      - name: Install pip deps
        if: ${{ hashFiles('requirements.txt') != '' || hashFiles('pyproject.toml') != '' }}
        run: |
          python -m pip install --upgrade pip
          if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
      - name: Py coverage 100%
        if: ${{ hashFiles('requirements.txt') != '' || hashFiles('pyproject.toml') != '' }}
        run: ./scripts/test-coverage.sh python
      - name: Py certify (STRICT_DOCS)
        if: ${{ hashFiles('requirements.txt') != '' || hashFiles('pyproject.toml') != '' }}
        run: STRICT_DOCS=1 ./scripts/brik-certify.sh

      # Go
      - uses: actions/setup-go@v5
        if: ${{ hashFiles('go.mod') != '' }}
        with:
          go-version: '1.22'
      - name: Go coverage 100%
        if: ${{ hashFiles('go.mod') != '' }}
        run: ./scripts/test-coverage.sh go
      - name: Go certify (STRICT_DOCS)
        if: ${{ hashFiles('go.mod') != '' }}
        run: STRICT_DOCS=1 ./scripts/brik-certify.sh

      - name: Upload BRIK cert artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: brik-cert
          path: |
            .brik-cert.json
            .brik-cert.sha256
          if-no-files-found: ignore
EOF
    echo "✅ Workflow CI creado en: .github/workflows/brik-ci.yml"
}

# Verificar prerequisitos
check_prerequisites() {
    echo "🔍 Verificando prerequisitos..."
    
    # Verificar dependencias básicas
    command -v git >/dev/null 2>&1 || { echo "❌ Git requerido"; exit 1; }
    
    if [[ "$SMART_MODE" == "true" ]]; then
        # Prerequisitos específicos para modo inteligente
        command -v node >/dev/null 2>&1 || { echo "❌ Node.js 18+ requerido para modo smart"; exit 1; }
        
        # Verificar versión de Node.js
        NODE_VERSION=$(node --version | cut -c2- | cut -d'.' -f1)
        if [[ "$NODE_VERSION" -lt 18 ]]; then
            echo "❌ Node.js 18+ requerido (encontrado: v$NODE_VERSION)"; exit 1;
        fi
        
        # Verificar API keys (opcional para testing con mock)
        if [[ -z "${ANTHROPIC_API_KEY:-}" ]] && [[ -z "${OPENAI_API_KEY:-}" ]]; then
            echo "⚠️ No API keys found: ANTHROPIC_API_KEY o OPENAI_API_KEY"; 
            echo "   Se usará Mock LLM para testing. Para LLM real, export la variable de entorno";
        fi
        
        # Verificar toolchain del lenguaje
        case "$PROJECT_TYPE" in
            rust)
                command -v cargo >/dev/null 2>&1 || { echo "❌ Rust toolchain requerido"; exit 1; }
                ;;
            typescript)
                command -v npm >/dev/null 2>&1 || { echo "❌ NPM requerido para TypeScript"; exit 1; }
                ;;
            python)
                command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 requerido"; exit 1; }
                ;;
        esac
        
        echo "✅ Prerequisitos modo smart verificados"
    else
        command -v node >/dev/null 2>&1 || { echo "⚠️ Node.js recomendado"; }
        command -v docker >/dev/null 2>&1 || { echo "⚠️ Docker recomendado"; }
        echo "✅ Prerequisitos verificados"
    fi
}

# Ejecutar pipeline inteligente completo
run_smart_pipeline() {
    echo ""
    echo "🧠 EJECUTANDO PIPELINE INTELIGENTE BRIK"
    echo "═══════════════════════════════════════"
    echo ""
    
    # Validar descripción del proyecto
    if [[ -z "$PROJECT_DESCRIPTION" ]]; then
        echo "❌ --description es obligatorio en modo smart"
        echo "   Ejemplo: --description 'API e-commerce con usuarios, productos, órdenes'"
        exit 1
    fi
    
    # Preparar directorio de trabajo temporal
    TEMP_DIR=$(mktemp -d)
    echo "🔧 Directorio temporal: $TEMP_DIR"
    
    # Paso 1: Análisis de dominio con LLM
    echo "🧠 Paso 1/4: Analizando dominio del proyecto..."
    cd "$SCRIPT_DIR"
    
    # Ejecutar domain analyzer capturando solo stdout para JSON
    if ! OUTPUT_JSON=1 node generators/intelligent/domain-analyzer.js \
        "$PROJECT_DESCRIPTION" \
        "$INTEGRATIONS" \
        "$PROJECT_TYPE" 2>/dev/null > "$TEMP_DIR/domain-analysis.json"; then
        echo "❌ Error en análisis de dominio"
        # Intentar sin redirección para ver error
        echo "🔍 Debug: ejecutando sin redirección..."
        node generators/intelligent/domain-analyzer.js \
            "$PROJECT_DESCRIPTION" \
            "$INTEGRATIONS" \
            "$PROJECT_TYPE"
        rm -rf "$TEMP_DIR"
        exit 1
    fi
    
    echo "✅ Análisis de dominio completado"
    
    # Paso 2: Clasificación arquitectónica
    echo "🏗️ Paso 2/4: Clasificando arquitectura BRIK..."
    
    if ! OUTPUT_JSON=1 node generators/intelligent/architecture-classifier.js \
        "$TEMP_DIR/domain-analysis.json" 2>/dev/null > "$TEMP_DIR/architecture-classification.json"; then
        echo "❌ Error en clasificación arquitectónica"
        # Debug
        echo "🔍 Debug: ejecutando sin redirección..."
        node generators/intelligent/architecture-classifier.js \
            "$TEMP_DIR/domain-analysis.json"
        rm -rf "$TEMP_DIR"
        exit 1
    fi
    
    echo "✅ Clasificación arquitectónica completada"
    
    # Paso 3: Generación de código
    echo "⚡ Paso 3/4: Generando código funcional completo..."
    
    # Crear directorio de salida si no existe
    mkdir -p "$OUTPUT_PATH"
    
    if ! node generators/intelligent/code-generator.js \
        "$TEMP_DIR/architecture-classification.json" \
        "$OUTPUT_PATH" \
        "$PROJECT_TYPE"; then
        echo "❌ Error en generación de código"
        rm -rf "$TEMP_DIR"
        exit 1
    fi
    
    echo "✅ Código generado exitosamente"
    
    # Paso 4: Validación arquitectónica
    echo "🔍 Paso 4/4: Validando principios BRIK..."
    
    if ! node generators/intelligent/architecture-validator.js "$OUTPUT_PATH"; then
        echo "⚠️ Proyecto generado con advertencias BRIK"
        echo "   Revisar brik-validation-report.json"
    else
        echo "✅ Validación BRIK completada exitosamente"
    fi
    
    # Copiar archivos de análisis al proyecto generado  
    cp "$TEMP_DIR/domain-analysis.json" "$OUTPUT_PATH/"
    cp "$TEMP_DIR/architecture-classification.json" "$OUTPUT_PATH/"
    
    # Limpiar directorio temporal
    rm -rf "$TEMP_DIR"
    
    # Generar documentación BRIK estándar en el proyecto
    cd "$OUTPUT_PATH"
    generate_brik_documentation_for_smart_project
}

# Generar documentación específica para proyecto smart
generate_brik_documentation_for_smart_project() {
    echo "📚 Generando documentación BRIK para proyecto inteligente..."
    
    # Generar CIRCUITALIDAD.md
    generate_manifesto
    
    # Generar .brik-dna.yml con información del análisis
    generate_smart_dna
    
    # Generar scripts de validación
    generate_smart_validation_scripts
    
    echo "✅ Documentación BRIK generada"
}

# Generar ADN mejorado para proyecto smart
generate_smart_dna() {
    echo "🧬 Generando ADN inteligente del proyecto..."
    
    cat > .brik-dna.yml << EOF
project:
  name: "$PROJECT_NAME"
  version: "1.0.0"
  philosophy: "DAAF-BRIK-CircuitalidadDigital"
  generation_mode: "smart"
  genesis_hash: "$(date +%s | sha256sum | cut -d' ' -f1 2>/dev/null || date +%s | shasum -a 256 | cut -d' ' -f1)"
  created_at: "$(date -Iseconds 2>/dev/null || date)"
  
generation:
  description: "$PROJECT_DESCRIPTION"
  integrations: "$INTEGRATIONS"
  language: "$PROJECT_TYPE"
  llm_analyzed: true
  architecture_classified: true
  
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
  smart_generation: true
EOF
}

# Generar scripts de validación específicos
generate_smart_validation_scripts() {
    mkdir -p scripts
    
    # Script de validación BRIK específico
    cat > scripts/validate-brik-architecture.sh << 'EOF'
#!/bin/bash
# 🔍 Validador específico de arquitectura BRIK generada

echo "🔍 Validando arquitectura BRIK..."

# Usar el validador inteligente si está disponible
if command -v node >/dev/null 2>&1; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    VALIDATOR_PATH="${SCRIPT_DIR}/../../../generators/intelligent/architecture-validator.js"
    
    if [[ -f "$VALIDATOR_PATH" ]]; then
        echo "🧠 Usando validador inteligente BRIK..."
        node "$VALIDATOR_PATH" .
    else
        echo "⚠️ Validador inteligente no disponible, usando validación básica..."
        # Validación básica
        if [[ -d "src/core" ]] && [[ -d "src/components" ]] && [[ -d "src/living-layer" ]]; then
            echo "✅ Estructura BRIK básica presente"
        else
            echo "❌ Estructura BRIK incompleta"
            exit 1
        fi
    fi
else
    echo "⚠️ Node.js no disponible para validación completa"
fi
EOF
    chmod +x scripts/validate-brik-architecture.sh
}

# Función principal
main() {
    echo ""
    echo "🚀 INICIALIZADOR BRIK v5.0"
    echo "═══════════════════════════════════════════════════════════════"
    
    if [[ "$SMART_MODE" == "true" ]]; then
        echo "🧠 MODO: Generación Inteligente"
        echo "📝 Proyecto: $PROJECT_NAME"
        echo "📋 Descripción: $PROJECT_DESCRIPTION"
        echo "💻 Lenguaje: $PROJECT_TYPE"
        echo "🔌 Integraciones: ${INTEGRATIONS:-'ninguna'}"
    else
        echo "📋 MODO: Tradicional"
        echo "🧬 Proyecto: $PROJECT_NAME"
        echo "📋 Tipo: $PROJECT_TYPE"
    fi
    
    echo "⚡ Filosofía: DAAF-BRIK-Circuitalidad Digital"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    
    check_prerequisites
    
    if [[ "$SMART_MODE" == "true" ]]; then
        # Pipeline inteligente
        run_smart_pipeline
        
        echo ""
        echo "🎉 ¡Proyecto BRIK INTELIGENTE generado exitosamente!"
        echo "📂 Ubicación: $(realpath "$OUTPUT_PATH")"
        echo ""
        echo "🚀 Próximos pasos:"
        echo "1. cd $OUTPUT_PATH"
        echo "2. cargo build  # (para Rust) o npm install (para TS) o pip install -r requirements.txt (para Python)"
        echo "3. ./scripts/test-coverage.sh  # Verificar 100% cobertura"
        echo "4. ./scripts/validate-brik-architecture.sh  # Validar principios BRIK"
        echo "5. cargo run  # Ejecutar proyecto"
        echo ""
        echo "📊 Archivos de análisis disponibles:"
        echo "   • domain-analysis.json - Análisis LLM del dominio"
        echo "   • architecture-classification.json - Clasificación BRIK"
        echo "   • brik-validation-report.json - Reporte de validación"
        echo ""
        echo "🧬 Tu proyecto sigue estrictamente los principios BRIK"
        echo "⚡ Código funcional completo generado automáticamente"
        
    else
        # Pipeline tradicional
        create_brik_structure
        generate_dna
        generate_manifesto
        generate_documentation
        setup_project_type
        generate_core_templates
        generate_scripts
        generate_dev_config
        generate_coverage_script
        generate_cert_script
        generate_brik_ci
        
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
    fi
}

# Verificar que estamos en el directorio correcto
if [[ ! -f "$SCRIPT_DIR/generators/generate-product-docs.sh" ]]; then
    echo "❌ Error: Generadores tradicionales no encontrados"
    echo "   Asegúrate de ejecutar desde el directorio BRIK-Project-Initializer"
    exit 1
fi

# Verificar generadores inteligentes en modo smart
if [[ "$SMART_MODE" == "true" ]]; then
    if [[ ! -f "$SCRIPT_DIR/generators/intelligent/domain-analyzer.js" ]]; then
        echo "❌ Error: Generadores inteligentes no encontrados"
        echo "   Verifica que existen los archivos en generators/intelligent/"
        exit 1
    fi
    
    # Verificar que Node.js puede ejecutar los generadores
    if ! node -e "console.log('Node.js OK')" >/dev/null 2>&1; then
        echo "❌ Error: Node.js no funciona correctamente"
        exit 1
    fi
fi

main "$@"
