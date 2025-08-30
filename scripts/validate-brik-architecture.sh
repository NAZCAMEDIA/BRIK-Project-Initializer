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
