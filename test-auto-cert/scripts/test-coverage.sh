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
