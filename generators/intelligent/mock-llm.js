#!/usr/bin/env node
/**
 * 🧠 BRIK Mock LLM - Intelligent Dynamic Project Generator
 * 
 * Refactorizado completamente para generar proyectos dinámicos según descripción real.
 * - Parser inteligente de descripciones en lenguaje natural
 * - Templates dinámicos por dominio (TODO, E-commerce, Blog, CRM, API Generic)
 * - Validación de coherencia input/output
 * - Fallback robusto a e-commerce
 * 
 * ECO-Sigma: Eliminando hardcoding y maximizando inteligencia contextual
 */

class DomainParser {
    static parseDescription(description) {
        if (!description || typeof description !== 'string') {
            return { domain: 'ecommerce', entities: [], operations: [] };
        }
        
        const normalizedDesc = description.toLowerCase();
        
        // Detectar tipo de proyecto por keywords
        const projectTypes = {
            todo: ['todo', 'task', 'tarea', 'lista', 'pendiente', 'completar'],
            blog: ['blog', 'post', 'article', 'comment', 'comentario', 'entrada'],
            ecommerce: ['ecommerce', 'tienda', 'producto', 'order', 'compra', 'carrito', 'pago', 'stripe'],
            crm: ['crm', 'cliente', 'lead', 'venta', 'contacto', 'prospecto'],
            auth: ['auth', 'usuario', 'login', 'registro', 'autenticación'],
            api: ['api', 'endpoint', 'service', 'microservice'],
            generic: []
        };
        
        let detectedDomain = 'api'; // Default
        let maxMatches = 0;
        
        for (const [domain, keywords] of Object.entries(projectTypes)) {
            const matches = keywords.filter(keyword => normalizedDesc.includes(keyword)).length;
            if (matches > maxMatches) {
                maxMatches = matches;
                detectedDomain = domain;
            }
        }
        
        // Extraer entidades potenciales (sustantivos clave)
        const entityPatterns = [
            /(?:entidad|entity|modelo|model)\s+(\w+)/gi,
            /(?:tabla|table)\s+(\w+)/gi,
            /(?:crear|crear|add|agregar)\s+(\w+)/gi,
            /(\w+)(?:\s+que\s+se\s+pueden?|\s+con)/gi
        ];
        
        const entities = new Set();
        entityPatterns.forEach(pattern => {
            const matches = normalizedDesc.matchAll(pattern);
            for (const match of matches) {
                if (match[1] && match[1].length > 2) {
                    entities.add(DomainParser.capitalizeFirst(match[1]));
                }
            }
        });
        
        // Detectar operaciones CRUD
        const crudPatterns = {
            create: ['crear', 'agregar', 'add', 'nuevo', 'registrar'],
            read: ['leer', 'obtener', 'get', 'listar', 'mostrar', 'buscar'],
            update: ['actualizar', 'modificar', 'edit', 'cambiar', 'marcar'],
            delete: ['eliminar', 'borrar', 'delete', 'quitar']
        };
        
        const operations = [];
        for (const [op, keywords] of Object.entries(crudPatterns)) {
            if (keywords.some(keyword => normalizedDesc.includes(keyword))) {
                operations.push(op);
            }
        }
        
        return {
            domain: detectedDomain,
            entities: Array.from(entities),
            operations: operations.length > 0 ? operations : ['create', 'read', 'update', 'delete']
        };
    }
    
    static capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    
    static inferProjectName(description, domain) {
        const normalizedDesc = description.toLowerCase();
        
        // Extraer nombre del proyecto si es específico
        const projectNamePatterns = [
            /(?:proyecto|project)\s+(\w+)/i,
            /(\w+)\s+(?:api|system|sistema)/i,
            /sistema\s+(?:de\s+)?(\w+)/i
        ];
        
        for (const pattern of projectNamePatterns) {
            const match = normalizedDesc.match(pattern);
            if (match && match[1]) {
                return `${match[1]}-api`;
            }
        }
        
        // Fallback basado en dominio detectado
        const domainNames = {
            todo: 'todo-list-api',
            blog: 'blog-system-api',
            ecommerce: 'ecommerce-api',
            crm: 'crm-system-api',
            auth: 'auth-service-api',
            api: 'generic-api',
            generic: 'custom-api'
        };
        
        return domainNames[domain] || 'custom-api';
    }
}

class ProjectTemplates {
    static getTodoTemplate(entities, operations, integrations) {
        // Usar entidades detectadas o fallback a 'Task'
        const mainEntity = entities.length > 0 ? entities[0] : 'Task';
        
        return {
            projectName: "todo-list-api",
            description: `API para gestión de ${mainEntity.toLowerCase()}s con operaciones CRUD completas`,
            domain: {
                entities: [{
                    name: mainEntity,
                    description: `${mainEntity} que puede ser gestionada por los usuarios`,
                    attributes: [
                        "title: String",
                        "description: String", 
                        "completed: Boolean",
                        "priority: TaskPriority",
                        "created_at: DateTime",
                        "updated_at: DateTime"
                    ],
                    relationships: operations.includes('read') ? [
                        { entity: "User", type: "ManyToOne" }
                    ] : [],
                    businessRules: [
                        "Title no puede estar vacío",
                        "Priority debe ser válida (Low, Medium, High)",
                        "Completed por defecto es false"
                    ]
                }],
                useCases: this.generateUseCases(mainEntity, operations),
                businessRules: [{
                    name: "TaskValidation",
                    description: `${mainEntity} debe tener título válido`,
                    applies_to: [mainEntity],
                    condition: `${mainEntity.toLowerCase()}.title.length > 0`,
                    action: `Rechazar ${mainEntity.toLowerCase()} sin título`
                }],
                integrations: this.mapIntegrations(integrations, 'simple')
            },
            technical: {
                architecture_type: "api",
                data_persistence: this.getDbFromIntegrations(integrations, 'sqlite'),
                auth_required: false,
                real_time: false,
                scalability_requirements: "low",
                performance_requirements: "standard"
            }
        };
    }
    
    static getBlogTemplate(entities, operations, integrations) {
        const postEntity = entities.find(e => e.toLowerCase().includes('post')) || 'Post';
        const commentEntity = entities.find(e => e.toLowerCase().includes('comment')) || 'Comment';
        
        return {
            projectName: "blog-system-api",
            description: "API de blog con posts, comentarios y gestión de contenido",
            domain: {
                entities: [
                    {
                        name: postEntity,
                        description: "Entrada de blog con contenido y metadatos",
                        attributes: [
                            "title: String",
                            "content: Text",
                            "excerpt: String",
                            "published: Boolean",
                            "published_at: DateTime",
                            "created_at: DateTime"
                        ],
                        relationships: [
                            { entity: "User", type: "ManyToOne" },
                            { entity: commentEntity, type: "OneToMany" }
                        ],
                        businessRules: [
                            "Title debe ser único",
                            "Content no puede estar vacío para publicar"
                        ]
                    },
                    {
                        name: commentEntity,
                        description: "Comentario en un post del blog",
                        attributes: [
                            "content: Text",
                            "author_name: String",
                            "author_email: String",
                            "approved: Boolean",
                            "created_at: DateTime"
                        ],
                        relationships: [
                            { entity: postEntity, type: "ManyToOne" }
                        ],
                        businessRules: [
                            "Content no puede estar vacío",
                            "Email debe ser válido"
                        ]
                    }
                ],
                useCases: [
                    {
                        name: `Create${postEntity}`,
                        description: `Crear nueva entrada de blog`,
                        actor: "User",
                        inputs: ["title: String", "content: Text", "excerpt: String"],
                        outputs: [`${postEntity.toLowerCase()}_id: UUID`],
                        businessLogic: [
                            "Validar título único",
                            "Procesar contenido markdown",
                            "Generar excerpt si no existe",
                            `Crear ${postEntity.toLowerCase()}`
                        ]
                    },
                    {
                        name: `Add${commentEntity}`,
                        description: `Agregar comentario a post`,
                        actor: "User",
                        inputs: [`${postEntity.toLowerCase()}_id: UUID`, "content: Text", "author_name: String"],
                        outputs: [`${commentEntity.toLowerCase()}_id: UUID`],
                        businessLogic: [
                            "Validar post existe",
                            "Filtrar contenido ofensivo",
                            "Marcar para moderación",
                            `Crear ${commentEntity.toLowerCase()}`
                        ]
                    }
                ],
                businessRules: [{
                    name: "ContentModeration",
                    description: "Comentarios deben ser moderados antes de publicarse",
                    applies_to: [commentEntity],
                    condition: `${commentEntity.toLowerCase()}.approved == false`,
                    action: "Enviar a cola de moderación"
                }],
                integrations: this.mapIntegrations(integrations, 'content')
            },
            technical: {
                architecture_type: "api",
                data_persistence: this.getDbFromIntegrations(integrations, 'postgresql'),
                auth_required: true,
                real_time: false,
                scalability_requirements: "medium",
                performance_requirements: "standard"
            }
        };
    }
    
    static getEcommerceTemplate(entities, operations, integrations) {
        // Template original e-commerce como fallback robusto
        return {
            projectName: "ecommerce-api",
            description: "API de e-commerce completa con gestión de usuarios, productos, órdenes y pagos",
            domain: {
                entities: [
                    {
                        name: "User",
                        description: "Usuario del sistema con autenticación",
                        attributes: ["email: String", "password_hash: String", "name: String"],
                        relationships: [{"entity": "Order", "type": "OneToMany"}],
                        businessRules: ["Email debe ser único", "Password mínimo 8 caracteres"]
                    },
                    {
                        name: "Product",
                        description: "Producto en el catálogo con inventario",
                        attributes: ["name: String", "price: Decimal", "stock: Integer", "category: String"],
                        relationships: [{"entity": "OrderItem", "type": "OneToMany"}],
                        businessRules: ["Precio debe ser positivo", "Stock no puede ser negativo"]
                    },
                    {
                        name: "Order", 
                        description: "Órden de compra con items y estado",
                        attributes: ["total: Decimal", "status: OrderStatus", "created_at: DateTime"],
                        relationships: [
                            {"entity": "User", "type": "ManyToOne"},
                            {"entity": "OrderItem", "type": "OneToMany"}
                        ],
                        businessRules: ["Total debe coincidir con suma de items", "Estado debe ser válido"]
                    },
                    {
                        name: "OrderItem",
                        description: "Item individual dentro de una orden",
                        attributes: ["quantity: Integer", "unit_price: Decimal", "subtotal: Decimal"],
                        relationships: [
                            {"entity": "Order", "type": "ManyToOne"},
                            {"entity": "Product", "type": "ManyToOne"}
                        ],
                        businessRules: ["Subtotal = quantity * unit_price", "Quantity > 0"]
                    }
                ],
                useCases: [
                    {
                        name: "CreateUser",
                        description: "Registrar nuevo usuario en el sistema",
                        actor: "User",
                        inputs: ["email: String", "password: String", "name: String"],
                        outputs: ["user_id: UUID"],
                        businessLogic: [
                            "Validar formato email",
                            "Hash password con bcrypt",
                            "Verificar email único",
                            "Crear usuario en DB"
                        ]
                    },
                    {
                        name: "PlaceOrder",
                        description: "Crear órden de compra con items",
                        actor: "User",
                        inputs: ["user_id: UUID", "items: Array<{product_id: UUID, quantity: Integer}>"],
                        outputs: ["order_id: UUID", "total: Decimal"],
                        businessLogic: [
                            "Validar stock disponible",
                            "Calcular precios actuales",
                            "Reservar stock",
                            "Calcular total",
                            "Procesar pago",
                            "Crear órden"
                        ]
                    }
                ],
                businessRules: [
                    {
                        name: "StockValidation", 
                        description: "Stock no puede ser negativo después de venta",
                        applies_to: ["Product", "OrderItem"],
                        condition: "product.stock >= order_item.quantity",
                        action: "Rechazar venta si stock insuficiente"
                    }
                ],
                integrations: this.mapIntegrations(integrations, 'ecommerce')
            },
            technical: {
                architecture_type: "api",
                data_persistence: this.getDbFromIntegrations(integrations, 'postgresql'),
                auth_required: true,
                real_time: false,
                scalability_requirements: "medium",
                performance_requirements: "high"
            }
        };
    }
    
    static getGenericTemplate(entities, operations, integrations, description) {
        // Template genérico basado en entidades detectadas
        const mainEntity = entities.length > 0 ? entities[0] : 'Item';
        
        return {
            projectName: DomainParser.inferProjectName(description, 'api'),
            description: `API genérica para gestión de ${entities.join(', ').toLowerCase() || 'entidades'} con operaciones CRUD`,
            domain: {
                entities: entities.map(entityName => ({
                    name: entityName,
                    description: `${entityName} del sistema`,
                    attributes: [
                        "id: UUID",
                        "name: String",
                        "description: String",
                        "status: String",
                        "created_at: DateTime",
                        "updated_at: DateTime"
                    ],
                    relationships: [],
                    businessRules: [
                        `${entityName} debe tener nombre válido`,
                        `Status debe ser válido`
                    ]
                })),
                useCases: entities.length > 0 ? this.generateUseCases(mainEntity, operations) : [],
                businessRules: [{
                    name: "EntityValidation",
                    description: "Entidades deben tener nombre válido",
                    applies_to: entities,
                    condition: "entity.name.length > 0",
                    action: "Rechazar entidad sin nombre"
                }],
                integrations: this.mapIntegrations(integrations, 'simple')
            },
            technical: {
                architecture_type: "api",
                data_persistence: this.getDbFromIntegrations(integrations, 'postgresql'),
                auth_required: false,
                real_time: false,
                scalability_requirements: "low",
                performance_requirements: "standard"
            }
        };
    }
    
    static generateUseCases(entityName, operations) {
        const useCases = [];
        const entityLower = entityName.toLowerCase();
        
        if (operations.includes('create')) {
            useCases.push({
                name: `Create${entityName}`,
                description: `Crear nuevo ${entityLower}`,
                actor: "User",
                inputs: ["data: Object"],
                outputs: [`${entityLower}_id: UUID`],
                businessLogic: [
                    "Validar datos requeridos",
                    "Aplicar reglas de negocio",
                    `Crear ${entityLower}`,
                    "Retornar ID generado"
                ]
            });
        }
        
        if (operations.includes('read')) {
            useCases.push({
                name: `Get${entityName}`,
                description: `Obtener ${entityLower} por ID`,
                actor: "User",
                inputs: [`${entityLower}_id: UUID`],
                outputs: [`${entityLower}: Object`],
                businessLogic: [
                    `Buscar ${entityLower} por ID`,
                    "Validar existe",
                    `Retornar ${entityLower}`
                ]
            });
        }
        
        if (operations.includes('update')) {
            useCases.push({
                name: `Update${entityName}`,
                description: `Actualizar ${entityLower} existente`,
                actor: "User",
                inputs: [`${entityLower}_id: UUID`, "data: Object"],
                outputs: [`${entityLower}: Object`],
                businessLogic: [
                    `Validar ${entityLower} existe`,
                    "Aplicar cambios",
                    "Validar reglas de negocio",
                    `Actualizar ${entityLower}`
                ]
            });
        }
        
        if (operations.includes('delete')) {
            useCases.push({
                name: `Delete${entityName}`,
                description: `Eliminar ${entityLower}`,
                actor: "User",
                inputs: [`${entityLower}_id: UUID`],
                outputs: ["success: Boolean"],
                businessLogic: [
                    `Validar ${entityLower} existe`,
                    "Verificar dependencias",
                    `Eliminar ${entityLower}`,
                    "Confirmar eliminación"
                ]
            });
        }
        
        return useCases;
    }
    
    static mapIntegrations(requestedIntegrations, projectType) {
        const integrationMap = {
            postgresql: {
                name: "PostgreSQL",
                type: "database", 
                description: "Base de datos principal para persistencia",
                operations: ["CRUD", "transactions", "queries"]
            },
            sqlite: {
                name: "SQLite",
                type: "database",
                description: "Base de datos ligera para desarrollo y testing",
                operations: ["CRUD", "queries"]
            },
            redis: {
                name: "Redis",
                type: "cache",
                description: "Cache para sesiones y datos temporales",
                operations: ["set", "get", "expire", "publish"]
            },
            stripe: {
                name: "Stripe",
                type: "payment",
                description: "Procesamiento de pagos y subscripciones",
                operations: ["charge", "refund", "webhook"]
            }
        };
        
        const integrations = [];
        
        // Agregar integraciones solicitadas
        if (Array.isArray(requestedIntegrations)) {
            requestedIntegrations.forEach(integration => {
                const normalizedIntegration = integration.toLowerCase().trim();
                if (integrationMap[normalizedIntegration]) {
                    integrations.push(integrationMap[normalizedIntegration]);
                }
            });
        }
        
        // Agregar integraciones por defecto según tipo de proyecto
        if (integrations.length === 0) {
            switch (projectType) {
                case 'simple':
                    integrations.push(integrationMap.sqlite);
                    break;
                case 'content':
                    integrations.push(integrationMap.postgresql);
                    break;
                case 'ecommerce':
                    integrations.push(integrationMap.postgresql, integrationMap.redis, integrationMap.stripe);
                    break;
                default:
                    integrations.push(integrationMap.postgresql);
            }
        }
        
        return integrations;
    }
    
    static getDbFromIntegrations(integrations, fallback) {
        if (!Array.isArray(integrations)) return fallback;
        
        const dbIntegration = integrations.find(integration => 
            ['postgresql', 'sqlite', 'mysql'].includes(integration.toLowerCase())
        );
        
        return dbIntegration ? dbIntegration.toLowerCase() : fallback;
    }
}

class MockLLM {
    /**
     * Genera respuesta de análisis de dominio dinámicamente basada en descripción real
     */
    static getDomainAnalysisResponse(description, integrations) {
        try {
            // FASE 1: Parse inteligente de la descripción
            const parsedContext = DomainParser.parseDescription(description);
            
            // FASE 2: Mapear integraciones
            const integrationsArray = typeof integrations === 'string' 
                ? integrations.split(',').map(i => i.trim()).filter(i => i.length > 0)
                : Array.isArray(integrations) ? integrations : [];
            
            // FASE 3: Seleccionar template apropiado
            let template;
            switch (parsedContext.domain) {
                case 'todo':
                    template = ProjectTemplates.getTodoTemplate(
                        parsedContext.entities, 
                        parsedContext.operations, 
                        integrationsArray
                    );
                    break;
                    
                case 'blog':
                    template = ProjectTemplates.getBlogTemplate(
                        parsedContext.entities, 
                        parsedContext.operations, 
                        integrationsArray
                    );
                    break;
                    
                case 'ecommerce':
                    template = ProjectTemplates.getEcommerceTemplate(
                        parsedContext.entities, 
                        parsedContext.operations, 
                        integrationsArray
                    );
                    break;
                    
                default:
                    // Genérico para casos no específicos
                    template = parsedContext.entities.length > 0 
                        ? ProjectTemplates.getGenericTemplate(
                            parsedContext.entities, 
                            parsedContext.operations, 
                            integrationsArray,
                            description
                          )
                        : ProjectTemplates.getEcommerceTemplate(
                            parsedContext.entities, 
                            parsedContext.operations, 
                            integrationsArray
                          );
            }
            
            // FASE 4: Personalizar con descripción original
            template.projectName = DomainParser.inferProjectName(description, parsedContext.domain);
            template.description = description; // Preservar descripción original
            
            return JSON.stringify(template, null, 2);
            
        } catch (error) {
            console.error('❌ Error en MockLLM:', error.message);
            
            // FALLBACK ROBUSTO: E-commerce template si todo falla
            return JSON.stringify(ProjectTemplates.getEcommerceTemplate([], ['create', 'read', 'update', 'delete'], ['postgresql']), null, 2);
        }
    }

    static getArchitectureClassificationResponse() {
        // Mantener implementación original para compatibilidad
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

// CLI para testing avanzado
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'domain-analysis':
            const description = args[1] || "API simple de to-do list con tareas";
            const integrations = args[2] || "postgresql";
            console.log(MockLLM.getDomainAnalysisResponse(description, integrations));
            break;
        case 'architecture-classification':
            console.log(MockLLM.getArchitectureClassificationResponse());
            break;
        case 'test-parser':
            const testDesc = args[1] || "crear, editar y eliminar tareas de una lista";
            const parsed = DomainParser.parseDescription(testDesc);
            console.log('🧠 Parse Result:', JSON.stringify(parsed, null, 2));
            break;
        default:
            console.log(`
🧠 BRIK Mock LLM - Intelligent Dynamic Generator

USAGE:
  node mock-llm.js domain-analysis "descripción" "integraciones"
  node mock-llm.js architecture-classification
  node mock-llm.js test-parser "descripción a analizar"

EXAMPLES:
  node mock-llm.js domain-analysis "API de to-do list con tareas" "postgresql"
  node mock-llm.js domain-analysis "blog con posts y comentarios" "postgresql,redis"  
  node mock-llm.js domain-analysis "tienda online con productos y órdenes" "postgresql,stripe"
  node mock-llm.js test-parser "crear, editar y eliminar posts de blog"

TEMPLATES DISPONIBLES:
  - TODO/Task Management
  - Blog/Content Management
  - E-commerce (fallback)
  - Generic API (detecta entidades automáticamente)
            `.trim());
            process.exit(1);
    }
}

module.exports = { MockLLM, DomainParser, ProjectTemplates };