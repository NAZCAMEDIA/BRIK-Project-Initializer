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
