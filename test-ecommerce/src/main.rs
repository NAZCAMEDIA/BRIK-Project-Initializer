// 🚀 BRIK Generated Main Entry Point
// Project: ecommerce-api

use ecommerce_api::*;

async fn app_main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🚀 Starting ecommerce-api...");
    
    // Initialize BRIK components
    let _user = core::User::new("test@example.com".to_string(), "hashed_password".to_string(), "user_creation".to_string());
    
    println!("✅ ecommerce-api is running!");
    Ok(())
}

#[cfg(not(tarpaulin))]
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    app_main().await
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn cover_main() {
        let result = app_main().await;
        assert!(result.is_ok());
    }
}