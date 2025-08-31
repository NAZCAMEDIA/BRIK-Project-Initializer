//! BRIK v5 Authentication Gate for Rust

use crate::shared::types::result::BrikResult;
use super::gate_result::{GateResult, GateTimer, RequestGate, GateError};
use axum::{
    extract::Request,
    http::HeaderMap,
};
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthContext {
    pub user_id: String,
    pub scopes: Vec<String>,
    pub email: Option<String>,
    pub roles: Option<Vec<String>>,
}

#[derive(Debug, Clone)]
pub struct SecurityScope {
    pub resource: String,
    pub action: String,
    pub constraints: Option<ScopeConstraints>,
}

#[derive(Debug, Clone)]
pub struct ScopeConstraints {
    pub owned_only: bool,
    pub department_only: bool,
    pub admin_only: bool,
}

#[derive(Debug, Deserialize)]
struct JwtClaims {
    sub: Option<String>,
    user_id: Option<String>,
    email: Option<String>,
    scopes: Option<Vec<String>>,
    roles: Option<Vec<String>>,
    exp: usize,
}

pub struct AuthGate {
    jwt_secret: String,
    required_scopes: Vec<SecurityScope>,
}

impl AuthGate {
    pub fn new(jwt_secret: String, required_scopes: Vec<SecurityScope>) -> Self {
        Self {
            jwt_secret,
            required_scopes,
        }
    }

    fn extract_bearer_token(&self, headers: &HeaderMap) -> Option<String> {
        headers
            .get("authorization")?
            .to_str()
            .ok()?
            .strip_prefix("Bearer ")?
            .to_string()
            .into()
    }

    fn validate_scopes(
        &self,
        user_scopes: &[String],
        user_roles: &[String],
        required_scopes: &[SecurityScope],
    ) -> BrikResult<(), String> {
        for required in required_scopes {
            let scope_string = format!("{}:{}", required.resource, required.action);
            
            // Check direct scope
            if user_scopes.contains(&scope_string) {
                continue;
            }
            
            // Check wildcard scopes
            let resource_wildcard = format!("{}:*", required.resource);
            if user_scopes.contains(&resource_wildcard) || user_scopes.contains(&"*:*".to_string()) {
                continue;
            }
            
            // Check admin override
            if let Some(constraints) = &required.constraints {
                if constraints.admin_only && user_roles.contains(&"admin".to_string()) {
                    continue;
                }
            }
            
            // Scope not found
            return Err(scope_string);
        }
        
        Ok(())
    }
}

#[async_trait::async_trait]
impl RequestGate<&HeaderMap, AuthContext> for AuthGate {
    fn name(&self) -> &'static str {
        "AuthGate"
    }

    async fn validate(&self, headers: &HeaderMap) -> GateResult<AuthContext> {
        let timer = GateTimer::start();

        // 1. Extract JWT token
        let token = match self.extract_bearer_token(headers) {
            Some(token) => token,
            None => {
                return GateResult::failure(
                    "AuthGate",
                    "AUTH_TOKEN_MISSING",
                    "Authorization header with Bearer token is required",
                    401,
                    Some(timer.elapsed()),
                );
            }
        };

        // 2. Verify JWT signature and decode
        let decoding_key = DecodingKey::from_secret(self.jwt_secret.as_ref());
        let validation = Validation::new(Algorithm::HS256);

        let token_data = match decode::<JwtClaims>(&token, &decoding_key, &validation) {
            Ok(data) => data,
            Err(_) => {
                return GateResult::failure(
                    "AuthGate",
                    "AUTH_TOKEN_INVALID",
                    "Invalid or expired JWT token",
                    401,
                    Some(timer.elapsed()),
                );
            }
        };

        let claims = token_data.claims;

        // 3. Extract auth context
        let user_id = claims.sub
            .or(claims.user_id)
            .unwrap_or_else(|| "unknown".to_string());

        let scopes = claims.scopes.unwrap_or_default();
        let roles = claims.roles.unwrap_or_default();

        let auth_context = AuthContext {
            user_id,
            scopes: scopes.clone(),
            email: claims.email,
            roles: Some(roles.clone()),
        };

        // 4. Validate required scopes
        if let Err(missing_scope) = self.validate_scopes(&scopes, &roles, &self.required_scopes) {
            return GateResult::failure(
                "AuthGate",
                "AUTH_INSUFFICIENT_SCOPES",
                &format!("Missing required scope: {}", missing_scope),
                403,
                Some(timer.elapsed()),
            );
        }

        GateResult::success(auth_context, Some(timer.elapsed()))
    }
}

// Common scope definitions
pub struct UserScopes;

impl UserScopes {
    pub const CREATE: SecurityScope = SecurityScope {
        resource: "users".to_string(),
        action: "create".to_string(),
        constraints: None,
    };

    pub const READ: SecurityScope = SecurityScope {
        resource: "users".to_string(),
        action: "read".to_string(),
        constraints: None,
    };

    pub const UPDATE: SecurityScope = SecurityScope {
        resource: "users".to_string(),
        action: "update".to_string(),
        constraints: None,
    };

    pub const DELETE: SecurityScope = SecurityScope {
        resource: "users".to_string(),
        action: "delete".to_string(),
        constraints: Some(ScopeConstraints {
            owned_only: false,
            department_only: false,
            admin_only: true,
        }),
    };

    pub fn create() -> SecurityScope {
        SecurityScope {
            resource: "users".to_string(),
            action: "create".to_string(),
            constraints: None,
        }
    }

    pub fn read() -> SecurityScope {
        SecurityScope {
            resource: "users".to_string(),
            action: "read".to_string(),
            constraints: None,
        }
    }

    pub fn update() -> SecurityScope {
        SecurityScope {
            resource: "users".to_string(),
            action: "update".to_string(),
            constraints: None,
        }
    }

    pub fn delete() -> SecurityScope {
        SecurityScope {
            resource: "users".to_string(),
            action: "delete".to_string(),
            constraints: Some(ScopeConstraints {
                owned_only: false,
                department_only: false,
                admin_only: true,
            }),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::http::{HeaderValue, HeaderMap};

    fn create_test_headers(token: &str) -> HeaderMap {
        let mut headers = HeaderMap::new();
        headers.insert(
            "authorization",
            HeaderValue::from_str(&format!("Bearer {}", token)).unwrap(),
        );
        headers
    }

    #[tokio::test]
    async fn test_auth_gate_missing_token() {
        let gate = AuthGate::new("secret".to_string(), vec![]);
        let headers = HeaderMap::new();
        
        let result = gate.validate(&headers).await;
        
        assert!(!result.is_ok());
        assert_eq!(result.error.as_ref().unwrap().code, "AUTH_TOKEN_MISSING");
    }

    #[test]
    fn test_extract_bearer_token() {
        let gate = AuthGate::new("secret".to_string(), vec![]);
        let headers = create_test_headers("test_token");
        
        let token = gate.extract_bearer_token(&headers);
        assert_eq!(token, Some("test_token".to_string()));
    }

    #[test]
    fn test_validate_scopes() {
        let gate = AuthGate::new("secret".to_string(), vec![UserScopes::create()]);
        let user_scopes = vec!["users:create".to_string()];
        let user_roles = vec![];
        let required = vec![UserScopes::create()];
        
        let result = gate.validate_scopes(&user_scopes, &user_roles, &required);
        assert!(result.is_ok());
    }

    #[test]
    fn test_validate_scopes_missing() {
        let gate = AuthGate::new("secret".to_string(), vec![UserScopes::create()]);
        let user_scopes = vec!["users:read".to_string()];
        let user_roles = vec![];
        let required = vec![UserScopes::create()];
        
        let result = gate.validate_scopes(&user_scopes, &user_roles, &required);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "users:create");
    }
}