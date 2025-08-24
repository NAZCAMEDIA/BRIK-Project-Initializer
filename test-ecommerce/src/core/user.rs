// 🎯 BRIK CORE Entity: User (Immutable)
// Generated from domain analysis - DO NOT modify manually

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct User {
    pub id: Uuid,
        // Email validation
    pub email_validation: String,
    // Password hashing
    pub password_hashing: String,
    // User creation
    pub user_creation: String,
    created_at: chrono::DateTime<chrono::Utc>,
}

impl User {
    pub fn new(email_validation: String, password_hashing: String, user_creation: String) -> Self {
        Self {
            id: Uuid::new_v4(),
                        email_validation,
            password_hashing,
            user_creation,
            created_at: chrono::Utc::now(),
        }
    }
    
    // BRIK Core Business Rules
    pub fn validate_userentity(&self) -> Result<(), String> {
        // Entidad usuario con validaciones de negocio
        // TODO: Implement validation logic
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_user_creation() {
        let entity = User::new("test_value".to_string(), "test_value".to_string(), "test_value".to_string());
        assert!(!entity.id.is_nil());
        assert!(entity.created_at <= chrono::Utc::now());
    }

    #[test]
    fn test_user_validation() {
        let entity = User::new("test_value".to_string(), "test_value".to_string(), "test_value".to_string());
        assert!(entity.validate_userentity().is_ok());
    }
}