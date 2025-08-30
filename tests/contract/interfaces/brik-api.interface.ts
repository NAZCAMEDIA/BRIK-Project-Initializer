/**
 * BRIK API Interface Definitions V1.0.0
 * Cross-language compatibility interfaces para Rust ↔ TypeScript ↔ Python
 * Garantiza consistencia absoluta en APIs y data structures
 */

// ========================================================================================
// CORE PROJECT CONFIGURATION
// ========================================================================================

export type BRIKLanguage = 'rust' | 'typescript' | 'python';
export type BRIKArchitecture = 'traditional' | 'intelligent';  
export type BRIKCertLevel = 'L0' | 'L1' | 'L2' | 'L3';
export type BRIKIntegrationType = 'database' | 'api' | 'storage' | 'monitoring' | 'authentication';

/**
 * Core BRIK Project Configuration
 * Must be serializable across all target languages
 */
export interface BRIKProjectConfig {
  // Project Metadata (Required)
  name: string;
  description: string;
  version: string;
  
  // Language & Architecture (Required)
  language: BRIKLanguage;
  architecture: BRIKArchitecture;
  
  // Certification Requirements (Required)
  certification_level: BRIKCertLevel;
  coverage_target: number; // 0-100
  
  // Features & Integrations (Optional)
  features: BRIKFeature[];
  integrations: BRIKIntegration[];
  
  // Generation Metadata (Required)
  generated_at: string; // ISO 8601 timestamp
  generator_version: string;
  llm_enhanced: boolean;
  
  // Optional Metadata
  author?: string;
  repository?: string;
  license?: string;
  tags?: string[];
}

/**
 * BRIK Feature Configuration
 * Represents optional features that can be enabled
 */
export interface BRIKFeature {
  name: string;
  enabled: boolean;
  configuration: Record<string, any>;
  dependencies?: string[]; // Other features this depends on
  compatibility?: {
    min_version?: string;
    languages?: BRIKLanguage[];
  };
}

/**
 * BRIK Integration Configuration  
 * Represents external service integrations
 */
export interface BRIKIntegration {
  type: BRIKIntegrationType;
  provider: string;
  configuration: Record<string, any>;
  required: boolean;
  health_check?: {
    endpoint?: string;
    timeout_ms?: number;
  };
}

// ========================================================================================
// VALIDATION RESULTS & REPORTING
// ========================================================================================

/**
 * BRIK Validation Result Structure
 * Standard format para validation results across languages
 */
export interface BRIKValidationResult {
  // Validation Metadata
  project_name: string;
  validated_at: string; // ISO 8601
  validator_version: string;
  
  // Core Validation Status
  valid: boolean;
  certification_level: BRIKCertLevel;
  
  // Hash & Security
  brik_hash: string; // SHA-256 hash
  hash_algorithm: 'SHA-256';
  
  // Quality Metrics
  coverage: BRIKCoverageMetrics;
  performance: BRIKPerformanceMetrics;
  security: BRIKSecurityMetrics;
  
  // Issues & Recommendations
  issues: BRIKValidationIssue[];
  recommendations: BRIKRecommendation[];
  
  // Execution Metadata
  execution_time_ms: number;
  environment: BRIKEnvironmentInfo;
}

/**
 * Coverage Metrics Structure
 * Consistent across all languages y testing frameworks
 */
export interface BRIKCoverageMetrics {
  line_coverage: number; // 0-100
  branch_coverage: number; // 0-100  
  function_coverage: number; // 0-100
  overall_coverage: number; // 0-100
  
  // Additional metrics
  uncovered_lines?: number;
  total_lines?: number;
  test_files_count?: number;
}

/**
 * Performance Metrics Structure
 * Benchmarking data para performance validation
 */
export interface BRIKPerformanceMetrics {
  generation_time_ms: number;
  validation_time_ms: number;
  build_time_ms: number;
  
  // Resource Usage
  memory_usage_mb?: number;
  cpu_usage_percent?: number;
  
  // Benchmarking Results
  benchmarks?: BRIKBenchmarkResult[];
}

/**
 * Security Metrics Structure
 * Security validation y audit results
 */
export interface BRIKSecurityMetrics {
  security_score: number; // 0-100
  vulnerabilities_found: number;
  secrets_detected: number;
  
  // Security Categories
  critical_issues: number;
  high_issues: number;
  medium_issues: number;
  low_issues: number;
  
  // Compliance
  compliance_checks: BRIKComplianceCheck[];
}

/**
 * Validation Issue Structure
 * Consistent issue reporting format
 */
export interface BRIKValidationIssue {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'architecture' | 'security' | 'performance' | 'testing' | 'documentation' | 'compatibility';
  message: string;
  
  // Location Information (Optional)
  file_path?: string;
  line_number?: number;
  column_number?: number;
  
  // Resolution Information
  suggestion?: string;
  fix_effort?: 'trivial' | 'easy' | 'moderate' | 'hard' | 'expert';
  
  // Metadata
  rule_id?: string;
  external_url?: string;
}

/**
 * Recommendation Structure
 * Improvement suggestions para project quality
 */
export interface BRIKRecommendation {
  type: 'performance' | 'security' | 'maintainability' | 'testing' | 'documentation';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  
  // Implementation Details
  effort_estimate?: string;
  implementation_steps?: string[];
  benefits?: string[];
  
  // Context
  applies_to?: BRIKLanguage[];
  certification_impact?: BRIKCertLevel[];
}

// ========================================================================================
// SUPPORTING STRUCTURES
// ========================================================================================

/**
 * Benchmark Result Structure
 * Performance benchmarking data
 */
export interface BRIKBenchmarkResult {
  name: string;
  duration_ms: number;
  memory_mb: number;
  iterations: number;
  
  // Statistical Data
  avg_ms: number;
  min_ms: number;
  max_ms: number;
  std_dev_ms: number;
  
  // Comparison
  baseline_ms?: number;
  regression_percent?: number;
}

/**
 * Compliance Check Result
 * Security y quality compliance validation
 */
export interface BRIKComplianceCheck {
  standard: string; // OWASP, CIS, etc.
  check_id: string;
  passed: boolean;
  description: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Environment Information
 * Execution environment metadata
 */
export interface BRIKEnvironmentInfo {
  os: string;
  architecture: string;
  
  // Language Runtimes
  rust_version?: string;
  node_version?: string;
  python_version?: string;
  
  // CI/CD Context
  ci_provider?: string;
  build_id?: string;
  commit_sha?: string;
  branch?: string;
}

// ========================================================================================
// CONTRACT VALIDATION INTERFACES
// ========================================================================================

/**
 * Contract Test Suite Configuration
 * Para executing cross-language contract tests
 */
export interface BRIKContractTestSuite {
  name: string;
  version: string;
  description: string;
  
  // Test Configuration
  languages: BRIKLanguage[];
  test_cases: BRIKContractTestCase[];
  
  // Execution Settings
  timeout_ms: number;
  parallel_execution: boolean;
  
  // Expected Results
  expected_compatibility_score: number; // 0-100
  max_acceptable_variance_percent: number;
}

/**
 * Contract Test Case Definition
 * Individual test case para cross-language validation
 */
export interface BRIKContractTestCase {
  id: string;
  name: string;
  description: string;
  
  // Test Data
  input_data: Record<string, any>;
  expected_output: Record<string, any>;
  
  // Test Configuration
  test_type: 'serialization' | 'api' | 'hash' | 'performance';
  languages: BRIKLanguage[];
  
  // Validation Rules
  tolerance?: {
    performance_variance_percent?: number;
    hash_exact_match?: boolean;
    serialization_exact_match?: boolean;
  };
}

/**
 * Contract Test Result
 * Results from contract test execution
 */
export interface BRIKContractTestResult {
  suite_name: string;
  executed_at: string; // ISO 8601
  
  // Overall Results
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  skipped_tests: number;
  
  // Language Results
  language_results: Record<BRIKLanguage, BRIKLanguageTestResult>;
  
  // Cross-Language Compatibility
  compatibility_matrix: BRIKCompatibilityMatrix;
  overall_compatibility_score: number; // 0-100
  
  // Execution Metadata
  execution_time_ms: number;
  environment: BRIKEnvironmentInfo;
}

/**
 * Language-Specific Test Result
 * Results para a specific language
 */
export interface BRIKLanguageTestResult {
  language: BRIKLanguage;
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  
  // Performance Data
  avg_execution_time_ms: number;
  memory_usage_mb: number;
  
  // Issues Found
  issues: BRIKValidationIssue[];
}

/**
 * Compatibility Matrix
 * Cross-language compatibility results
 */
export interface BRIKCompatibilityMatrix {
  rust_typescript: BRIKCompatibilityScore;
  rust_python: BRIKCompatibilityScore;
  typescript_python: BRIKCompatibilityScore;
}

/**
 * Compatibility Score
 * Compatibility score between two languages
 */
export interface BRIKCompatibilityScore {
  overall_score: number; // 0-100
  
  // Category Scores
  serialization_score: number; // 0-100
  api_score: number; // 0-100
  hash_score: number; // 0-100
  performance_score: number; // 0-100
  
  // Issues
  compatibility_issues: BRIKValidationIssue[];
}

// ========================================================================================
// EXPORT ALL INTERFACES
// ========================================================================================

export {
  // Main Configuration
  type BRIKProjectConfig as ProjectConfig,
  type BRIKFeature as Feature,
  type BRIKIntegration as Integration,
  
  // Validation
  type BRIKValidationResult as ValidationResult,
  type BRIKValidationIssue as ValidationIssue,
  type BRIKRecommendation as Recommendation,
  
  // Metrics
  type BRIKCoverageMetrics as CoverageMetrics,
  type BRIKPerformanceMetrics as PerformanceMetrics,
  type BRIKSecurityMetrics as SecurityMetrics,
  
  // Contract Testing
  type BRIKContractTestSuite as ContractTestSuite,
  type BRIKContractTestCase as ContractTestCase,
  type BRIKContractTestResult as ContractTestResult,
  
  // Enums
  type BRIKLanguage as Language,
  type BRIKArchitecture as Architecture,
  type BRIKCertLevel as CertLevel,
  type BRIKIntegrationType as IntegrationType,
};

/**
 * Type Guards para Runtime Validation
 */
export const BRIKTypeGuards = {
  isValidLanguage(value: string): value is BRIKLanguage {
    return ['rust', 'typescript', 'python'].includes(value);
  },
  
  isValidArchitecture(value: string): value is BRIKArchitecture {
    return ['traditional', 'intelligent'].includes(value);
  },
  
  isValidCertLevel(value: string): value is BRIKCertLevel {
    return ['L0', 'L1', 'L2', 'L3'].includes(value);
  },
  
  isValidProjectConfig(obj: any): obj is BRIKProjectConfig {
    return obj &&
      typeof obj.name === 'string' &&
      typeof obj.description === 'string' &&
      typeof obj.version === 'string' &&
      this.isValidLanguage(obj.language) &&
      this.isValidArchitecture(obj.architecture) &&
      this.isValidCertLevel(obj.certification_level) &&
      typeof obj.coverage_target === 'number' &&
      Array.isArray(obj.features) &&
      Array.isArray(obj.integrations) &&
      typeof obj.generated_at === 'string' &&
      typeof obj.generator_version === 'string' &&
      typeof obj.llm_enhanced === 'boolean';
  }
};

/**
 * JSON Schema Definitions para External Validation
 */
export const BRIKJSONSchemas = {
  projectConfig: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    required: ["name", "description", "version", "language", "architecture", "certification_level", "coverage_target", "features", "integrations", "generated_at", "generator_version", "llm_enhanced"],
    properties: {
      name: { type: "string", minLength: 1, maxLength: 100 },
      description: { type: "string", minLength: 1, maxLength: 500 },
      version: { type: "string", pattern: "^\\d+\\.\\d+\\.\\d+(-[a-zA-Z0-9.-]+)?$" },
      language: { type: "string", enum: ["rust", "typescript", "python"] },
      architecture: { type: "string", enum: ["traditional", "intelligent"] },
      certification_level: { type: "string", enum: ["L0", "L1", "L2", "L3"] },
      coverage_target: { type: "number", minimum: 0, maximum: 100 },
      features: {
        type: "array",
        items: {
          type: "object",
          required: ["name", "enabled", "configuration"],
          properties: {
            name: { type: "string" },
            enabled: { type: "boolean" },
            configuration: { type: "object" }
          }
        }
      },
      integrations: {
        type: "array",
        items: {
          type: "object", 
          required: ["type", "provider", "configuration", "required"],
          properties: {
            type: { type: "string", enum: ["database", "api", "storage", "monitoring", "authentication"] },
            provider: { type: "string" },
            configuration: { type: "object" },
            required: { type: "boolean" }
          }
        }
      },
      generated_at: { type: "string", format: "date-time" },
      generator_version: { type: "string" },
      llm_enhanced: { type: "boolean" }
    }
  }
};

// Version export para compatibility tracking
export const BRIK_API_VERSION = "1.0.0";
export const BRIK_API_SCHEMA_VERSION = "2024-08-30";