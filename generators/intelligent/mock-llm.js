#!/usr/bin/env node
/**
 * 🧠 Mock LLM for BRIK Testing - Respuestas predefinidas para e-commerce
 * 
 * Este mock permite probar el sistema sin necesidad de API keys reales
 */

class MockLLM {
    static getDomainAnalysisResponse(description, integrations) {
        // Response específica para e-commerce
        return JSON.stringify({
            "projectName": "ecommerce-api",
            "description": "API de e-commerce completa con gestión de usuarios, productos, órdenes y pagos",
            "domain": {
                "entities": [
                    {
                        "name": "User",
                        "description": "Usuario del sistema con autenticación",
                        "attributes": ["email: String", "password_hash: String", "name: String"],
                        "relationships": [{"entity": "Order", "type": "OneToMany"}],
                        "businessRules": ["Email debe ser único", "Password mínimo 8 caracteres"]
                    },
                    {
                        "name": "Product",
                        "description": "Producto en el catálogo con inventario",
                        "attributes": ["name: String", "price: Decimal", "stock: Integer", "category: String"],
                        "relationships": [{"entity": "OrderItem", "type": "OneToMany"}],
                        "businessRules": ["Precio debe ser positivo", "Stock no puede ser negativo"]
                    },
                    {
                        "name": "Order", 
                        "description": "Órden de compra con items y estado",
                        "attributes": ["total: Decimal", "status: OrderStatus", "created_at: DateTime"],
                        "relationships": [
                            {"entity": "User", "type": "ManyToOne"},
                            {"entity": "OrderItem", "type": "OneToMany"}
                        ],
                        "businessRules": ["Total debe coincidir con suma de items", "Estado debe ser válido"]
                    },
                    {
                        "name": "OrderItem",
                        "description": "Item individual dentro de una orden",
                        "attributes": ["quantity: Integer", "unit_price: Decimal", "subtotal: Decimal"],
                        "relationships": [
                            {"entity": "Order", "type": "ManyToOne"},
                            {"entity": "Product", "type": "ManyToOne"}
                        ],
                        "businessRules": ["Subtotal = quantity * unit_price", "Quantity > 0"]
                    }
                ],
                "useCases": [
                    {
                        "name": "CreateUser",
                        "description": "Registrar nuevo usuario en el sistema",
                        "actor": "User",
                        "inputs": ["email: String", "password: String", "name: String"],
                        "outputs": ["user_id: UUID"],
                        "businessLogic": [
                            "Validar formato email",
                            "Hash password con bcrypt",
                            "Verificar email único",
                            "Crear usuario en DB"
                        ]
                    },
                    {
                        "name": "AddProduct",
                        "description": "Agregar producto al catálogo",
                        "actor": "Admin", 
                        "inputs": ["name: String", "price: Decimal", "stock: Integer", "category: String"],
                        "outputs": ["product_id: UUID"],
                        "businessLogic": [
                            "Validar precio > 0",
                            "Validar stock >= 0", 
                            "Crear producto",
                            "Notificar disponibilidad"
                        ]
                    },
                    {
                        "name": "PlaceOrder",
                        "description": "Crear órden de compra con items",
                        "actor": "User",
                        "inputs": ["user_id: UUID", "items: Array<{product_id: UUID, quantity: Integer}>"],
                        "outputs": ["order_id: UUID", "total: Decimal"],
                        "businessLogic": [
                            "Validar stock disponible",
                            "Calcular precios actuales",
                            "Reservar stock",
                            "Calcular total",
                            "Procesar pago",
                            "Crear órden"
                        ]
                    },
                    {
                        "name": "ProcessPayment",
                        "description": "Procesar pago con Stripe",
                        "actor": "System",
                        "inputs": ["order_id: UUID", "payment_method: String"],
                        "outputs": ["payment_status: PaymentStatus"],
                        "businessLogic": [
                            "Validar datos pago",
                            "Llamar API Stripe",
                            "Actualizar estado orden",
                            "Enviar confirmación"
                        ]
                    }
                ],
                "businessRules": [
                    {
                        "name": "StockValidation", 
                        "description": "Stock no puede ser negativo después de venta",
                        "applies_to": ["Product", "OrderItem"],
                        "condition": "product.stock >= order_item.quantity",
                        "action": "Rechazar venta si stock insuficiente"
                    },
                    {
                        "name": "EmailUniqueness",
                        "description": "Email debe ser único por usuario",
                        "applies_to": ["User"],
                        "condition": "users.filter(u => u.email == new_email).length == 0",
                        "action": "Rechazar registro con email duplicado"
                    },
                    {
                        "name": "OrderTotalIntegrity",
                        "description": "Total orden debe coincidir con suma de items",
                        "applies_to": ["Order"],
                        "condition": "order.total == sum(order.items.map(i => i.subtotal))",
                        "action": "Recalcular total antes de procesar"
                    }
                ],
                "integrations": [
                    {
                        "name": "PostgreSQL",
                        "type": "database", 
                        "description": "Base de datos principal para persistencia",
                        "operations": ["CRUD", "transactions", "queries"]
                    },
                    {
                        "name": "Redis",
                        "type": "cache",
                        "description": "Cache para sesiones y datos temporales",
                        "operations": ["set", "get", "expire", "publish"]
                    },
                    {
                        "name": "Stripe",
                        "type": "payment",
                        "description": "Procesamiento de pagos y subscripciones",
                        "operations": ["charge", "refund", "webhook"]
                    }
                ]
            },
            "technical": {
                "architecture_type": "api",
                "data_persistence": "postgresql",
                "auth_required": true,
                "real_time": false,
                "scalability_requirements": "medium",
                "performance_requirements": "high"
            }
        }, null, 2);
    }

    static getArchitectureClassificationResponse() {
        return JSON.stringify({
            "classification": {
                "CORE": {
                    "entities": [
                        {
                            "name": "User",
                            "layer": "CORE",
                            "reason": "Entidad fundamental del dominio, lógica de negocio inmutable",
                            "components": [
                                {
                                    "type": "domain_entity", 
                                    "name": "UserEntity",
                                    "description": "Entidad usuario con validaciones de negocio",
                                    "responsibilities": ["Email validation", "Password hashing", "User creation"]
                                }
                            ]
                        },
                        {
                            "name": "Product",
                            "layer": "CORE",
                            "reason": "Entidad central del e-commerce, reglas de inventario inmutables",
                            "components": [
                                {
                                    "type": "domain_entity",
                                    "name": "ProductEntity", 
                                    "description": "Producto con validaciones de precio y stock",
                                    "responsibilities": ["Price validation", "Stock management", "Category classification"]
                                }
                            ]
                        },
                        {
                            "name": "Order",
                            "layer": "CORE", 
                            "reason": "Agregado principal del dominio con lógica de negocio crítica",
                            "components": [
                                {
                                    "type": "domain_entity",
                                    "name": "OrderEntity",
                                    "description": "Orden con cálculos de total y validaciones",
                                    "responsibilities": ["Total calculation", "Status management", "Item validation"]
                                }
                            ]
                        }
                    ],
                    "business_logic": [
                        {
                            "name": "StockValidation",
                            "layer": "CORE",
                            "reason": "Regla de negocio fundamental que nunca cambia",
                            "implementation": "Validación atómica de stock disponible"
                        },
                        {
                            "name": "OrderTotalCalculation", 
                            "layer": "CORE",
                            "reason": "Cálculo crítico que debe ser consistente",
                            "implementation": "Suma inmutable de subtotales de items"
                        }
                    ]
                },
                "WRAPPERS": {
                    "integrations": [
                        {
                            "name": "PostgreSQLIntegration",
                            "layer": "WRAPPERS",
                            "reason": "Adaptador externo configurable según entorno",
                            "technology": "postgresql",
                            "configuration_points": ["connection_string", "pool_size", "timeout"]
                        },
                        {
                            "name": "RedisIntegration", 
                            "layer": "WRAPPERS",
                            "reason": "Cache externo que puede cambiar de implementación",
                            "technology": "redis",
                            "configuration_points": ["redis_url", "expire_time", "max_connections"]
                        },
                        {
                            "name": "StripeIntegration",
                            "layer": "WRAPPERS", 
                            "reason": "Servicio de pago externo con configuración específica",
                            "technology": "stripe",
                            "configuration_points": ["api_key", "webhook_secret", "currency"]
                        }
                    ],
                    "repositories": [
                        {
                            "name": "UserRepository",
                            "layer": "WRAPPERS",
                            "reason": "Abstrae acceso a datos, implementación configurable",
                            "operations": ["create", "read", "update", "delete", "find_by_email"]
                        },
                        {
                            "name": "ProductRepository",
                            "layer": "WRAPPERS", 
                            "reason": "Manejo de persistencia de productos",
                            "operations": ["create", "read", "update", "delete", "find_by_category", "update_stock"]
                        },
                        {
                            "name": "OrderRepository",
                            "layer": "WRAPPERS",
                            "reason": "Gestión de órdenes con queries complejas", 
                            "operations": ["create", "read", "update", "find_by_user", "find_by_status"]
                        }
                    ]
                },
                "LIVING_LAYER": {
                    "monitoring": [
                        {
                            "name": "PerformanceMonitor",
                            "layer": "LIVING_LAYER",
                            "reason": "Monitoreo adaptativo de performance de API",
                            "capabilities": ["response_time_analysis", "throughput_monitoring", "error_rate_tracking"]
                        },
                        {
                            "name": "BusinessMetricsAnalyzer",
                            "layer": "LIVING_LAYER", 
                            "reason": "Análisis inteligente de métricas de negocio",
                            "capabilities": ["sales_trend_analysis", "inventory_optimization", "user_behavior_insights"]
                        }
                    ]
                }
            },
            "architecture_summary": {
                "total_components": 12,
                "core_percentage": 42,
                "wrappers_percentage": 50,
                "living_percentage": 8,
                "complexity_assessment": "medium",
                "brik_compliance_score": 0.95
            }
        }, null, 2);
    }
}

// CLI para testing
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'domain-analysis':
            console.log(MockLLM.getDomainAnalysisResponse(args[1], args[2]));
            break;
        case 'architecture-classification':
            console.log(MockLLM.getArchitectureClassificationResponse());
            break;
        default:
            console.log('Usage: node mock-llm.js [domain-analysis|architecture-classification]');
            process.exit(1);
    }
}

module.exports = { MockLLM };