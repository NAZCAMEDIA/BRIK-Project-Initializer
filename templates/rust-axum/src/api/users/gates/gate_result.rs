//! BRIK v5 Gate Result Type for Rust

use std::time::{Duration, Instant};
use thiserror::Error;

#[derive(Debug, Clone)]
pub struct GateResult<T> {
    pub is_success: bool,
    pub data: Option<T>,
    pub error: Option<GateError>,
    pub duration: Option<Duration>,
}

impl<T> GateResult<T> {
    pub fn success(data: T, duration: Option<Duration>) -> Self {
        Self {
            is_success: true,
            data: Some(data),
            error: None,
            duration,
        }
    }

    pub fn failure(
        gate: &str,
        code: &str,
        message: &str,
        http_status: u16,
        duration: Option<Duration>,
    ) -> Self {
        Self {
            is_success: false,
            data: None,
            error: Some(GateError {
                gate: gate.to_string(),
                code: code.to_string(),
                message: message.to_string(),
                http_status,
            }),
            duration,
        }
    }

    pub fn unwrap(self) -> T {
        match self.data {
            Some(data) => data,
            None => panic!("Called unwrap on a failed GateResult: {:?}", self.error),
        }
    }

    pub fn unwrap_or(self, default: T) -> T {
        self.data.unwrap_or(default)
    }

    pub fn is_ok(&self) -> bool {
        self.is_success
    }

    pub fn is_err(&self) -> bool {
        !self.is_success
    }
}

#[derive(Debug, Clone, Error)]
#[error("Gate {gate} failed with code {code}: {message}")]
pub struct GateError {
    pub gate: String,
    pub code: String,
    pub message: String,
    pub http_status: u16,
}

impl GateError {
    pub fn new(gate: &str, code: &str, message: &str, http_status: u16) -> Self {
        Self {
            gate: gate.to_string(),
            code: code.to_string(),
            message: message.to_string(),
            http_status,
        }
    }
}

/// Trait for request gates
#[async_trait::async_trait]
pub trait RequestGate<TInput, TOutput>
where
    TInput: Send + Sync,
    TOutput: Send + Sync,
{
    fn name(&self) -> &'static str;
    
    async fn validate(&self, input: TInput) -> GateResult<TOutput>;
}

/// Helper to time gate operations
pub struct GateTimer {
    start: Instant,
}

impl GateTimer {
    pub fn start() -> Self {
        Self {
            start: Instant::now(),
        }
    }

    pub fn elapsed(&self) -> Duration {
        self.start.elapsed()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_gate_result_success() {
        let result = GateResult::success("test_data", Some(Duration::from_millis(100)));
        
        assert!(result.is_ok());
        assert!(!result.is_err());
        assert_eq!(result.unwrap(), "test_data");
    }

    #[test]
    fn test_gate_result_failure() {
        let result: GateResult<String> = GateResult::failure(
            "TestGate",
            "TEST_FAILED",
            "Test failure message",
            400,
            Some(Duration::from_millis(50)),
        );
        
        assert!(!result.is_ok());
        assert!(result.is_err());
        assert_eq!(result.error.as_ref().unwrap().gate, "TestGate");
        assert_eq!(result.error.as_ref().unwrap().code, "TEST_FAILED");
        assert_eq!(result.error.as_ref().unwrap().http_status, 400);
    }

    #[test]
    fn test_gate_timer() {
        let timer = GateTimer::start();
        std::thread::sleep(Duration::from_millis(10));
        let duration = timer.elapsed();
        
        assert!(duration >= Duration::from_millis(10));
    }

    #[test]
    fn test_gate_error_display() {
        let error = GateError::new("TestGate", "TEST_CODE", "Test message", 400);
        let error_string = format!("{}", error);
        
        assert!(error_string.contains("TestGate"));
        assert!(error_string.contains("TEST_CODE"));
        assert!(error_string.contains("Test message"));
    }
}