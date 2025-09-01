## Fix: Limpieza de códigos ANSI en variable COVERAGE para comparaciones CI

### Resumen:
El pipeline de la workflow 💙 BRIK TypeScript Enhanced falla al evaluar la cobertura porque la variable COVERAGE contiene códigos de color ANSI (ej: \x1b[33m100\x1b[39m). Las comparaciones numéricas fallan (integer expression expected) y se declara FAIL pese a cobertura real = 100%.

### Contexto:
Job ref (commit) b7bf58e7c74227c3ddaf9112da706e2586694d1e  
Workflow: .github/workflows/brik-ts-enhanced.yml  
Salida relevante:  
/…sh: line 2: [: 100: integer expression expected  
❌ L1 FAILED: Coverage 100% < 80%

### Causa raíz:
La variable COVERAGE contiene secuencias ANSI y el símbolo %, rompiendo las pruebas numéricas de test/bash.

### Impacto:
- Falsos fallos de CI  
- Bloqueo de merges dependientes de cobertura  
- Ruido operacional

### Solución propuesta:
1. Limpieza de COVERAGE (eliminar ANSI y símbolos no numéricos).
2. Validación de que el resultado es entero 0–100.
3. Endurecer script (set -euo pipefail).

### Parche sugerido:
```bash
set -euo pipefail

echo "Coverage for demo-ts: ${COVERAGE}%"

# Normalización
COVERAGE=$(printf '%s' "$COVERAGE"  
  | sed -E 's/\x1B\[[0-9;]*m//g'  
  | sed -E 's/[^0-9]//g')

if [ -z "$COVERAGE" ] || ! echo "$COVERAGE" | grep -Eq '^[0-9]+$'; then
  echo "⚠️ Could not extract numeric coverage value. Raw output corrupt."
  npm test -- --coverage --watchAll=false --verbose
  exit 1
fi

if [ "$COVERAGE" -ge 80 ]; then
  echo "✅ L1 PASSED: Coverage ${COVERAGE}% ≥ 80%"
else
  echo "❌ L1 FAILED: Coverage ${COVERAGE}% < 80%"
  exit 1
fi
```

### Alternativa mínima:
COVERAGE=${COVERAGE//[^0-9]/}

### Definition of Done:
- Workflow pasa con cobertura real ≥ 80% (sin integer expression expected).
- Falla correctamente < 80%.
- Logs sin códigos ANSI incrustados en el valor evaluado.
- PR #25 incluye “Closes #<issue>” en su descripción antes de merge.
- (Opcional QA) Pruebas manuales forzando valores 79 y 81.

### Riesgos:
- Si la fuente de COVERAGE cambia formato, habrá que ajustar la regex.

### Acciones siguientes sugeridas:
1. Crear Issue con el contenido anterior (labels sugeridos: bug, ci, coverage).  
2. Actualizar descripción de PR #25 agregando: Closes #<número-del-issue>.  
3. Cerrar o reconciliar PR #26 si es redundante.  
4. Ejecutar workflow post-fix y adjuntar captura/log.