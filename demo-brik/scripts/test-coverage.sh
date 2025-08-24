#!/bin/bash
# 🧪 BRIK Coverage Enforcer (100% global)
set -euo pipefail

if ! command -v cargo >/dev/null 2>&1; then
  echo "❌ cargo no encontrado"; exit 1; fi
if ! command -v cargo-tarpaulin >/dev/null 2>&1 && ! cargo tarpaulin -V >/dev/null 2>&1; then
  echo "❌ cargo-tarpaulin no está instalado. Instala con: cargo install cargo-tarpaulin"; exit 2; fi

echo "▶️  Ejecutando cobertura con cargo-tarpaulin (líneas+ramas, 100%)..."
cargo tarpaulin --workspace --force-clean --ignore-tests --branch --fail-under 100
echo "✅ Cobertura OK: líneas y ramas al 100%"
