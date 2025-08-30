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
