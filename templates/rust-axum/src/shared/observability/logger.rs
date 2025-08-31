//! BRIK v5 Structured Logger with Correlation ID support

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tracing::{debug, error, info, warn};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogContext {
    pub correlation_id: Option<String>,
    pub user_id: Option<String>,
    pub endpoint: Option<String>,
    pub gate: Option<String>,
    pub port: Option<String>,
    pub duration_ms: Option<u64>,
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

impl LogContext {
    pub fn new() -> Self {
        Self {
            correlation_id: None,
            user_id: None,
            endpoint: None,
            gate: None,
            port: None,
            duration_ms: None,
            extra: HashMap::new(),
        }
    }

    pub fn with_correlation_id(mut self, id: String) -> Self {
        self.correlation_id = Some(id);
        self
    }

    pub fn with_user_id(mut self, id: String) -> Self {
        self.user_id = Some(id);
        self
    }

    pub fn with_endpoint(mut self, endpoint: String) -> Self {
        self.endpoint = Some(endpoint);
        self
    }

    pub fn with_gate(mut self, gate: String) -> Self {
        self.gate = Some(gate);
        self
    }

    pub fn with_port(mut self, port: String) -> Self {
        self.port = Some(port);
        self
    }

    pub fn with_duration(mut self, duration_ms: u64) -> Self {
        self.duration_ms = Some(duration_ms);
        self
    }

    pub fn with_extra<V>(mut self, key: &str, value: V) -> Self
    where
        V: Serialize,
    {
        if let Ok(json_value) = serde_json::to_value(value) {
            self.extra.insert(key.to_string(), json_value);
        }
        self
    }
}

impl Default for LogContext {
    fn default() -> Self {
        Self::new()
    }
}

/// BRIK structured logger
pub struct BrikLogger;

impl BrikLogger {
    pub fn info(message: &str, context: Option<LogContext>) {
        if let Some(ctx) = context {
            info!(
                correlation_id = ?ctx.correlation_id,
                user_id = ?ctx.user_id,
                endpoint = ?ctx.endpoint,
                gate = ?ctx.gate,
                port = ?ctx.port,
                duration_ms = ?ctx.duration_ms,
                extra = ?ctx.extra,
                message
            );
        } else {
            info!(message);
        }
    }

    pub fn warn(message: &str, context: Option<LogContext>) {
        if let Some(ctx) = context {
            warn!(
                correlation_id = ?ctx.correlation_id,
                user_id = ?ctx.user_id,
                endpoint = ?ctx.endpoint,
                gate = ?ctx.gate,
                port = ?ctx.port,
                duration_ms = ?ctx.duration_ms,
                extra = ?ctx.extra,
                message
            );
        } else {
            warn!(message);
        }
    }

    pub fn error(message: &str, error: Option<&dyn std::error::Error>, context: Option<LogContext>) {
        if let Some(ctx) = context {
            if let Some(err) = error {
                error!(
                    correlation_id = ?ctx.correlation_id,
                    user_id = ?ctx.user_id,
                    endpoint = ?ctx.endpoint,
                    gate = ?ctx.gate,
                    port = ?ctx.port,
                    duration_ms = ?ctx.duration_ms,
                    extra = ?ctx.extra,
                    error = %err,
                    message
                );
            } else {
                error!(
                    correlation_id = ?ctx.correlation_id,
                    user_id = ?ctx.user_id,
                    endpoint = ?ctx.endpoint,
                    gate = ?ctx.gate,
                    port = ?ctx.port,
                    duration_ms = ?ctx.duration_ms,
                    extra = ?ctx.extra,
                    message
                );
            }
        } else if let Some(err) = error {
            error!(error = %err, message);
        } else {
            error!(message);
        }
    }

    pub fn debug(message: &str, context: Option<LogContext>) {
        if let Some(ctx) = context {
            debug!(
                correlation_id = ?ctx.correlation_id,
                user_id = ?ctx.user_id,
                endpoint = ?ctx.endpoint,
                gate = ?ctx.gate,
                port = ?ctx.port,
                duration_ms = ?ctx.duration_ms,
                extra = ?ctx.extra,
                message
            );
        } else {
            debug!(message);
        }
    }
}

/// Initialize the tracing subscriber for structured logging
pub fn init_logger() -> Result<(), Box<dyn std::error::Error>> {
    let env_filter = tracing_subscriber::EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("info"));

    let subscriber = tracing_subscriber::fmt()
        .with_env_filter(env_filter)
        .with_target(false)
        .with_thread_ids(false)
        .with_thread_names(false)
        .with_file(false)
        .with_line_number(false)
        .json()
        .finish();

    tracing::subscriber::set_global_default(subscriber)?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_log_context_builder() {
        let context = LogContext::new()
            .with_correlation_id("test-123".to_string())
            .with_user_id("user-456".to_string())
            .with_endpoint("/api/v1/users".to_string())
            .with_duration(150);

        assert_eq!(context.correlation_id, Some("test-123".to_string()));
        assert_eq!(context.user_id, Some("user-456".to_string()));
        assert_eq!(context.endpoint, Some("/api/v1/users".to_string()));
        assert_eq!(context.duration_ms, Some(150));
    }

    #[test]
    fn test_log_context_with_extra() {
        let context = LogContext::new()
            .with_extra("custom_field", "custom_value")
            .with_extra("number_field", 42);

        assert_eq!(
            context.extra.get("custom_field"),
            Some(&serde_json::Value::String("custom_value".to_string()))
        );
        assert_eq!(
            context.extra.get("number_field"),
            Some(&serde_json::Value::Number(serde_json::Number::from(42)))
        );
    }
}