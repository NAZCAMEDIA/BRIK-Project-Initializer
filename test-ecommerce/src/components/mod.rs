// 🔧 BRIK WRAPPERS Module (Configurable)
pub mod postgresqlintegration_wrapper;
pub mod redisintegration_wrapper;
pub mod stripeintegration_wrapper;
pub mod userrepository;
pub mod productrepository;
pub mod orderrepository;

// Re-exports
pub use postgresqlintegration_wrapper::*;
pub use redisintegration_wrapper::*;
pub use stripeintegration_wrapper::*;
pub use userrepository::*;
pub use productrepository::*;
pub use orderrepository::*;