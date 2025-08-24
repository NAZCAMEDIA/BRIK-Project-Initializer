#!/bin/bash
# ⚙️ Configurador de Proyecto Python BRIK
set -euo pipefail

PROJECT_NAME=${1:-"nuevo-proyecto-brik"}

echo "⚙️ Configurando proyecto Python: $PROJECT_NAME"

mkdir -p src/brik_demo tests
touch src/brik_demo/__init__.py

# Código mínimo 100% testeable
cat > src/brik_demo/core.py << 'EOF'
def add(a: int, b: int) -> int:
    return a + b


def is_even(n: int) -> bool:
    return n % 2 == 0


def clamp01(x: float) -> float:
    if x < 0.0:
        return 0.0
    if x > 1.0:
        return 1.0
    return x
EOF

# Tests 100% cobertura
cat > tests/test_core.py << 'EOF'
from brik_demo.core import add, is_even, clamp01


def test_add():
    assert add(2, 3) == 5


def test_is_even_true():
    assert is_even(4) is True


def test_is_even_false():
    assert is_even(5) is False


def test_clamp01_low():
    assert clamp01(-1.0) == 0.0


def test_clamp01_high():
    assert clamp01(2.0) == 1.0


def test_clamp01_mid():
    assert clamp01(0.5) == 0.5
EOF

# Configuración de pytest/coverage (opcional, el script pasará flags)
cat > pytest.ini << 'EOF'
[pytest]
testpaths = tests
addopts = -q
EOF

# Requisitos (instalar manualmente)
cat > requirements.txt << 'EOF'
pytest
pytest-cov
coverage
EOF

echo "✅ Proyecto Python configurado (requiere instalar requirements.txt)"
