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
