#!/bin/bash
# ⚙️ Configurador de Proyecto TypeScript BRIK
set -euo pipefail

PROJECT_NAME=${1:-"nuevo-proyecto-brik"}

echo "⚙️ Configurando proyecto TypeScript: $PROJECT_NAME"

# Estructura básica
mkdir -p src/core tests

# package.json con umbrales 100%
cat > package.json << 'EOF'
{
  "name": "brik-ts-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "jest --coverage",
    "coverage": "jest --coverage --coverageThreshold='{\"global\":{\"branches\":100,\"functions\":100,\"lines\":100,\"statements\":100}}'"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.0.0"
  }
}
EOF

# tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "declaration": false,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"]
}
EOF

# jest.config.cjs (CommonJS para compatibilidad amplia)
cat > jest.config.cjs << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    // Aplica a cada archivo individualmente
    each: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
EOF

# Código mínimo 100% testeable
cat > src/core/index.ts << 'EOF'
export function add(a: number, b: number): number { return a + b; }
export function isEven(n: number): boolean { return n % 2 === 0; }
export function clamp01(x: number): number {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}
EOF

# Tests 100% cobertura
cat > tests/core.test.ts << 'EOF'
import { add, isEven, clamp01 } from '../src/core/index';

test('add works', () => { expect(add(2, 3)).toBe(5); });
test('isEven true', () => { expect(isEven(4)).toBe(true); });
test('isEven false', () => { expect(isEven(5)).toBe(false); });
test('clamp01 low', () => { expect(clamp01(-1)).toBe(0); });
test('clamp01 high', () => { expect(clamp01(2)).toBe(1); });
test('clamp01 mid', () => { expect(clamp01(0.5)).toBe(0.5); });
EOF

echo "✅ Proyecto TypeScript configurado correctamente (requiere npm install)"
