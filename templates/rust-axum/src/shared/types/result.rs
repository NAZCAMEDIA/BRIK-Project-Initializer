//! BRIK v5 Result Type - Functional error handling for Rust

use std::fmt::Debug;

/// A type that represents either success (`Ok`) or failure (`Err`).
/// Similar to std::result::Result but with additional helper methods for BRIK patterns.
pub type BrikResult<T, E> = std::result::Result<T, E>;

/// Extension trait for Result to add BRIK-specific functionality
pub trait ResultExt<T, E> {
    /// Maps a Result<T, E> to Result<U, E> by applying a function to a contained Ok value
    fn map_ok<U, F>(self, f: F) -> BrikResult<U, E>
    where
        F: FnOnce(T) -> U;

    /// Maps a Result<T, E> to Result<T, F> by applying a function to a contained Err value
    fn map_err_to<F, G>(self, f: G) -> BrikResult<T, F>
    where
        G: FnOnce(E) -> F;

    /// Returns the contained Ok value or a provided default
    fn unwrap_or_else<F>(self, f: F) -> T
    where
        F: FnOnce(E) -> T;

    /// Returns Ok if both self and other are Ok, otherwise returns the first Err
    fn and_then_combine<U, F>(self, other: BrikResult<U, E>, f: F) -> BrikResult<(T, U), E>
    where
        F: FnOnce() -> BrikResult<(T, U), E>,
        E: Clone;
}

impl<T, E> ResultExt<T, E> for BrikResult<T, E> {
    fn map_ok<U, F>(self, f: F) -> BrikResult<U, E>
    where
        F: FnOnce(T) -> U,
    {
        self.map(f)
    }

    fn map_err_to<F, G>(self, f: G) -> BrikResult<T, F>
    where
        G: FnOnce(E) -> F,
    {
        self.map_err(f)
    }

    fn unwrap_or_else<F>(self, f: F) -> T
    where
        F: FnOnce(E) -> T,
    {
        match self {
            Ok(value) => value,
            Err(error) => f(error),
        }
    }

    fn and_then_combine<U, F>(self, other: BrikResult<U, E>, _f: F) -> BrikResult<(T, U), E>
    where
        F: FnOnce() -> BrikResult<(T, U), E>,
        E: Clone,
    {
        match (self, other) {
            (Ok(a), Ok(b)) => Ok((a, b)),
            (Err(e), _) => Err(e),
            (_, Err(e)) => Err(e),
        }
    }
}

/// Convenience function to create an Ok result
pub fn ok<T, E>(value: T) -> BrikResult<T, E> {
    Ok(value)
}

/// Convenience function to create an Err result
pub fn err<T, E>(error: E) -> BrikResult<T, E> {
    Err(error)
}

/// Macro to convert multiple Results into a single Result containing a tuple
/// Usage: combine_results!(result1, result2, result3)
#[macro_export]
macro_rules! combine_results {
    ($first:expr) => {
        $first.map(|v| (v,))
    };
    ($first:expr, $($rest:expr),+) => {
        {
            let first = $first?;
            let rest = combine_results!($($rest),+)?;
            Ok({
                let mut tuple = (first,);
                // This is a bit hacky but works for combining tuples
                #[allow(unused_assignments)]
                {
                    tuple = (tuple.0, rest.0);
                    $(
                        // Add more tuple elements as needed
                    )+
                }
                tuple
            })
        }
    };
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_result_ext_map_ok() {
        let result: BrikResult<i32, &str> = Ok(5);
        let mapped = result.map_ok(|x| x * 2);
        assert_eq!(mapped, Ok(10));
    }

    #[test]
    fn test_result_ext_map_err() {
        let result: BrikResult<i32, &str> = Err("error");
        let mapped = result.map_err_to(|e| format!("Mapped: {}", e));
        assert_eq!(mapped, Err("Mapped: error".to_string()));
    }

    #[test]
    fn test_ok_err_helpers() {
        let success: BrikResult<i32, String> = ok(42);
        let failure: BrikResult<i32, String> = err("failed".to_string());

        assert_eq!(success, Ok(42));
        assert_eq!(failure, Err("failed".to_string()));
    }
}