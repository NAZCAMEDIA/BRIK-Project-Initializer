#!/bin/bash
# ⚙️ Configurador de Proyecto Rust BRIK
# Configuración específica para proyectos Rust

PROJECT_NAME=${1:-"nuevo-proyecto-brik"}

echo "⚙️ Configurando proyecto Rust: $PROJECT_NAME"

# Generar Cargo.toml básico
cat > Cargo.toml << EOF
[package]
name = "$PROJECT_NAME"
version = "1.0.0"
edition = "2021"
description = "BRIK project with DAAF-Circuitalidad Digital philosophy"

[dependencies]

[features]
default = []
EOF

# Crear estructura src básica
mkdir -p src/{core,components,living-layer}

# Biblioteca con lógica mínima y 100% testeable
cat > src/lib.rs << 'EOF'
pub mod core {
    /// Suma segura (no hace overflow en tests típicos)
    pub fn add(a: i32, b: i32) -> i32 { a + b }

    /// Devuelve true si el número es par
    pub fn is_even(n: i32) -> bool { n % 2 == 0 }

    /// Clampa un valor a [0.0, 1.0]
    pub fn clamp01(x: f32) -> f32 { if x < 0.0 { 0.0 } else if x > 1.0 { 1.0 } else { x } }
}

#[cfg(test)]
mod tests {
    use super::core::*;

    #[test]
    fn add_works() { assert_eq!(add(2, 3), 5); }

    #[test]
    fn is_even_true() { assert!(is_even(4)); }

    #[test]
    fn is_even_false() { assert!(!is_even(5)); }

    #[test]
    fn clamp01_low() { assert_eq!(clamp01(-1.0), 0.0); }

    #[test]
    fn clamp01_high() { assert_eq!(clamp01(2.0), 1.0); }

    #[test]
    fn clamp01_mid() { assert_eq!(clamp01(0.42), 0.42); }
}
EOF

# Binario que usa la librería (para integración)
cat > src/main.rs << 'EOF'
fn main() {
    println!("BRIK System Initialized");
    let s = crate::core::add(1, 1);
    println!("1+1={}", s);
}
EOF

# Prueba de integración (usa el nombre del crate)
CRATE_NAME="${PROJECT_NAME//-/_}"
mkdir -p tests/unit
cat > tests/unit/basic.rs << EOF
use ${CRATE_NAME}::core;

#[test]
fn add_integration() { assert_eq!(core::add(10, 5), 15); }
EOF

echo "✅ Proyecto Rust configurado correctamente"
