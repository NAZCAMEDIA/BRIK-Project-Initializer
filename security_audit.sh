#!/bin/bash

##############################################################################
# BRIK L3 Certification - Security Audit Script
# 
# Performs comprehensive security auditing for BRIK projects:
# - Secret detection and removal
# - Dependency vulnerability scanning
# - Code security analysis
# - Configuration security validation
# - Infrastructure security checks
# 
# DEPLOYMENT: Move to tests/contract/security_audit.sh
##############################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${PROJECT_ROOT:-$(pwd)}"
AUDIT_REPORT_FILE="${PROJECT_ROOT}/security-audit-report.json"
TEMP_DIR="/tmp/brik-security-audit-$$"

# Security audit results
declare -A AUDIT_RESULTS=(
    ["secrets_scan"]="pending"
    ["dependency_scan"]="pending"  
    ["code_analysis"]="pending"
    ["config_validation"]="pending"
    ["infrastructure_check"]="pending"
)

declare -a SECURITY_ISSUES=()
declare -a RECOMMENDATIONS=()
CRITICAL_ISSUES=0
HIGH_ISSUES=0
MEDIUM_ISSUES=0
LOW_ISSUES=0

##############################################################################
# Utility Functions
##############################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_header() {
    echo -e "\n${BLUE}===================================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}===================================================${NC}\n"
}

add_security_issue() {
    local severity="$1"
    local category="$2" 
    local description="$3"
    local file="${4:-N/A}"
    local line="${5:-N/A}"
    
    SECURITY_ISSUES+=("{\"severity\":\"$severity\",\"category\":\"$category\",\"description\":\"$description\",\"file\":\"$file\",\"line\":\"$line\"}")
    
    case "$severity" in
        "CRITICAL") ((CRITICAL_ISSUES++)) ;;
        "HIGH") ((HIGH_ISSUES++)) ;;
        "MEDIUM") ((MEDIUM_ISSUES++)) ;;
        "LOW") ((LOW_ISSUES++)) ;;
    esac
}

add_recommendation() {
    local priority="$1"
    local action="$2"
    RECOMMENDATIONS+=("{\"priority\":\"$priority\",\"action\":\"$action\"}")
}

##############################################################################
# Secret Detection and Scanning
##############################################################################

scan_secrets() {
    log_header "🔍 SCANNING FOR SECRETS AND SENSITIVE DATA"
    
    local secrets_found=0
    
    # Common secret patterns
    declare -a SECRET_PATTERNS=(
        "(?i)(api[_-]?key|apikey)[\s]*[=:][\s]*['\"]?[a-zA-Z0-9_\-]{16,}['\"]?"
        "(?i)(secret[_-]?key|secretkey)[\s]*[=:][\s]*['\"]?[a-zA-Z0-9_\-]{16,}['\"]?"
        "(?i)(access[_-]?token|accesstoken)[\s]*[=:][\s]*['\"]?[a-zA-Z0-9_\-\.]{16,}['\"]?"
        "(?i)(auth[_-]?token|authtoken)[\s]*[=:][\s]*['\"]?[a-zA-Z0-9_\-\.]{16,}['\"]?"
        "(?i)(jwt[_-]?token|jwttoken)[\s]*[=:][\s]*['\"]?[a-zA-Z0-9_\-\.]{20,}['\"]?"
        "(?i)(bearer[\s]+)[a-zA-Z0-9_\-\.]{16,}"
        "(?i)(password|pwd)[\s]*[=:][\s]*['\"]?[a-zA-Z0-9_\-@#$%^&*()!]{8,}['\"]?"
        "(?i)(database[_-]?url|db[_-]?url)[\s]*[=:][\s]*['\"]?[a-zA-Z0-9_\-:./@]+['\"]?"
        "(?i)(private[_-]?key|privatekey)[\s]*[=:][\s]*['\"]?-----BEGIN"
        "(?i)(aws[_-]?access[_-]?key[_-]?id|awsaccesskeyid)[\s]*[=:][\s]*['\"]?AKIA[0-9A-Z]{16}['\"]?"
        "(?i)(aws[_-]?secret[_-]?access[_-]?key|awssecretaccesskey)[\s]*[=:][\s]*['\"]?[a-zA-Z0-9/+=]{40}['\"]?"
        "(?i)(github[_-]?token|githubtoken)[\s]*[=:][\s]*['\"]?ghp_[a-zA-Z0-9]{36}['\"]?"
        "(?i)(slack[_-]?token|slacktoken)[\s]*[=:][\s]*['\"]?xoxb-[0-9]+-[0-9]+-[a-zA-Z0-9]{24}['\"]?"
    )
    
    # Files to exclude from scanning
    declare -a EXCLUDE_PATTERNS=(
        "*.git/*"
        "node_modules/*"
        "target/*"
        "dist/*"
        "build/*"
        "*.log"
        "*.lock"
        "*.min.js"
        "*.min.css"
        "*/tests/*"
        "*/test/*"
        "*/.conductor/*"
    )
    
    log_info "Scanning for secrets in source files..."
    
    # Build find command with exclusions
    local find_cmd="find \"$PROJECT_ROOT\" -type f"
    for pattern in "${EXCLUDE_PATTERNS[@]}"; do
        find_cmd+=" -not -path \"*/$pattern\""
    done
    
    # Scan for secrets
    while IFS= read -r -d '' file; do
        local file_relative=$(realpath --relative-to="$PROJECT_ROOT" "$file" 2>/dev/null || echo "$file")
        
        for pattern in "${SECRET_PATTERNS[@]}"; do
            if grep -P -n "$pattern" "$file" >/dev/null 2>&1; then
                local matches=$(grep -P -n "$pattern" "$file")
                while IFS= read -r match; do
                    local line_num=$(echo "$match" | cut -d: -f1)
                    local content=$(echo "$match" | cut -d: -f2-)
                    
                    add_security_issue "CRITICAL" "SECRET_EXPOSURE" \
                        "Potential secret found: ${content:0:50}..." \
                        "$file_relative" "$line_num"
                    
                    ((secrets_found++))
                    log_error "Secret found in $file_relative:$line_num"
                done <<< "$matches"
            fi
        done
    done < <(eval "$find_cmd" -print0 2>/dev/null || true)
    
    # Check for common secret files
    declare -a SECRET_FILES=(
        ".env"
        ".env.local"
        ".env.production" 
        ".env.development"
        "secrets.json"
        "credentials.json"
        "config/secrets.yaml"
        "private.key"
        "id_rsa"
        "id_dsa"
        "id_ecdsa"
        "id_ed25519"
    )
    
    log_info "Checking for sensitive files..."
    
    for secret_file in "${SECRET_FILES[@]}"; do
        if find "$PROJECT_ROOT" -name "$secret_file" -type f 2>/dev/null | grep -q .; then
            add_security_issue "HIGH" "SENSITIVE_FILE" \
                "Sensitive file found: $secret_file" \
                "$secret_file" "1"
            
            ((secrets_found++))
            log_warning "Sensitive file found: $secret_file"
        fi
    done
    
    # Update audit results
    if [ $secrets_found -eq 0 ]; then
        AUDIT_RESULTS["secrets_scan"]="passed"
        log_success "No secrets detected"
    else
        AUDIT_RESULTS["secrets_scan"]="failed"
        log_error "$secrets_found potential secrets/sensitive files found"
        add_recommendation "HIGH" "Remove or properly secure all detected secrets and sensitive files"
    fi
}

##############################################################################
# Dependency Vulnerability Scanning
##############################################################################

scan_dependencies() {
    log_header "📦 SCANNING DEPENDENCIES FOR VULNERABILITIES"
    
    local vulnerabilities_found=0
    
    # Scan Node.js dependencies
    if [ -f "$PROJECT_ROOT/package.json" ]; then
        log_info "Scanning Node.js dependencies..."
        
        if command -v npm >/dev/null 2>&1; then
            cd "$PROJECT_ROOT"
            
            # Run npm audit
            if npm audit --json > "$TEMP_DIR/npm-audit.json" 2>/dev/null; then
                local npm_vulns=$(jq -r '.metadata.vulnerabilities | to_entries[] | select(.value > 0) | "\(.key): \(.value)"' "$TEMP_DIR/npm-audit.json" 2>/dev/null || echo "")
                
                if [ -n "$npm_vulns" ]; then
                    while IFS= read -r vuln; do
                        local severity=$(echo "$vuln" | cut -d: -f1 | tr '[:lower:]' '[:upper:]')
                        local count=$(echo "$vuln" | cut -d: -f2 | tr -d ' ')
                        
                        add_security_issue "$severity" "DEPENDENCY_VULNERABILITY" \
                            "Node.js dependency vulnerability ($count issues)" \
                            "package.json" "1"
                        
                        vulnerabilities_found=$((vulnerabilities_found + count))
                    done <<< "$npm_vulns"
                fi
            else
                log_warning "Could not run npm audit (npm install may be needed)"
            fi
        else
            log_warning "npm not found, skipping Node.js dependency scan"
        fi
    fi
    
    # Scan Python dependencies
    if [ -f "$PROJECT_ROOT/requirements.txt" ] || [ -f "$PROJECT_ROOT/pyproject.toml" ]; then
        log_info "Scanning Python dependencies..."
        
        if command -v python3 >/dev/null 2>&1 && python3 -c "import pip" 2>/dev/null; then
            # Try to use safety if available
            if python3 -c "import safety" 2>/dev/null; then
                if python3 -m safety check --json > "$TEMP_DIR/safety-report.json" 2>/dev/null; then
                    local safety_issues=$(jq length "$TEMP_DIR/safety-report.json" 2>/dev/null || echo "0")
                    if [ "$safety_issues" -gt 0 ]; then
                        add_security_issue "HIGH" "DEPENDENCY_VULNERABILITY" \
                            "Python dependency vulnerabilities found ($safety_issues issues)" \
                            "requirements.txt" "1"
                        vulnerabilities_found=$((vulnerabilities_found + safety_issues))
                    fi
                fi
            else
                log_info "Safety package not available, install with: pip install safety"
            fi
        else
            log_warning "Python3 or pip not available, skipping Python dependency scan"
        fi
    fi
    
    # Scan Rust dependencies
    if [ -f "$PROJECT_ROOT/Cargo.toml" ]; then
        log_info "Scanning Rust dependencies..."
        
        if command -v cargo >/dev/null 2>&1; then
            # Try to use cargo-audit if available
            if command -v cargo-audit >/dev/null 2>&1; then
                cd "$PROJECT_ROOT"
                if cargo audit --json > "$TEMP_DIR/cargo-audit.json" 2>/dev/null; then
                    local cargo_vulns=$(jq '.vulnerabilities.found | length' "$TEMP_DIR/cargo-audit.json" 2>/dev/null || echo "0")
                    if [ "$cargo_vulns" -gt 0 ]; then
                        add_security_issue "HIGH" "DEPENDENCY_VULNERABILITY" \
                            "Rust dependency vulnerabilities found ($cargo_vulns issues)" \
                            "Cargo.toml" "1"
                        vulnerabilities_found=$((vulnerabilities_found + cargo_vulns))
                    fi
                fi
            else
                log_info "cargo-audit not available, install with: cargo install cargo-audit"
            fi
        else
            log_warning "Cargo not available, skipping Rust dependency scan"
        fi
    fi
    
    # Update audit results
    if [ $vulnerabilities_found -eq 0 ]; then
        AUDIT_RESULTS["dependency_scan"]="passed"
        log_success "No dependency vulnerabilities detected"
    else
        AUDIT_RESULTS["dependency_scan"]="failed"
        log_error "$vulnerabilities_found dependency vulnerabilities found"
        add_recommendation "HIGH" "Update vulnerable dependencies to patched versions"
    fi
}

##############################################################################
# Code Security Analysis
##############################################################################

analyze_code_security() {
    log_header "🔒 ANALYZING CODE FOR SECURITY ISSUES"
    
    local security_issues_found=0
    
    # Security anti-patterns to check for
    declare -a SECURITY_ANTIPATTERNS=(
        # JavaScript/TypeScript patterns
        "eval\s*\("
        "innerHTML\s*="
        "document\.write\s*\("
        "setTimeout\s*\(\s*['\"][^'\"]*['\"]"
        "setInterval\s*\(\s*['\"][^'\"]*['\"]"
        # Python patterns  
        "exec\s*\("
        "eval\s*\("
        "subprocess\.call\s*\([^)]*shell\s*=\s*True"
        "os\.system\s*\("
        # SQL injection patterns
        "SELECT\s+.*\+.*"
        "INSERT\s+.*\+.*"
        "UPDATE\s+.*\+.*"
        "DELETE\s+.*\+.*"
        # General patterns
        "md5\s*\("
        "sha1\s*\("
        "\.decode\s*\(\s*['\"]base64['\"]"
        "pickle\.loads\s*\("
    )
    
    log_info "Scanning for security anti-patterns..."
    
    while IFS= read -r -d '' file; do
        local file_relative=$(realpath --relative-to="$PROJECT_ROOT" "$file" 2>/dev/null || echo "$file")
        
        # Skip non-source files
        case "$file" in
            *.min.js|*.min.css|*.lock|*.log) continue ;;
            */node_modules/*|*/target/*|*/dist/*|*/build/*) continue ;;
        esac
        
        for pattern in "${SECURITY_ANTIPATTERNS[@]}"; do
            if grep -P -n "$pattern" "$file" >/dev/null 2>&1; then
                local matches=$(grep -P -n "$pattern" "$file")
                while IFS= read -r match; do
                    local line_num=$(echo "$match" | cut -d: -f1)
                    local content=$(echo "$match" | cut -d: -f2-)
                    
                    add_security_issue "MEDIUM" "SECURITY_ANTIPATTERN" \
                        "Potential security issue: ${content:0:50}..." \
                        "$file_relative" "$line_num"
                    
                    ((security_issues_found++))
                done <<< "$matches"
            fi
        done
    done < <(find "$PROJECT_ROOT" -type f \( -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.rs" -o -name "*.go" -o -name "*.java" \) -print0 2>/dev/null)
    
    # Check for hardcoded security configurations
    log_info "Checking for insecure configurations..."
    
    declare -a INSECURE_CONFIGS=(
        "ssl\s*:\s*false"
        "verify\s*:\s*false"
        "strictSSL\s*:\s*false"
        "rejectUnauthorized\s*:\s*false"
        "debug\s*:\s*true"
        "NODE_ENV.*development"
        "FLASK_ENV.*development"
    )
    
    for pattern in "${INSECURE_CONFIGS[@]}"; do
        while IFS= read -r -d '' file; do
            local file_relative=$(realpath --relative-to="$PROJECT_ROOT" "$file" 2>/dev/null || echo "$file")
            
            if grep -P -n "$pattern" "$file" >/dev/null 2>&1; then
                local matches=$(grep -P -n "$pattern" "$file")
                while IFS= read -r match; do
                    local line_num=$(echo "$match" | cut -d: -f1)
                    local content=$(echo "$match" | cut -d: -f2-)
                    
                    add_security_issue "MEDIUM" "INSECURE_CONFIG" \
                        "Insecure configuration: ${content:0:50}..." \
                        "$file_relative" "$line_num"
                    
                    ((security_issues_found++))
                done <<< "$matches"
            fi
        done < <(find "$PROJECT_ROOT" -type f \( -name "*.json" -o -name "*.yaml" -o -name "*.yml" -o -name "*.toml" -o -name "*.env*" \) -print0 2>/dev/null)
    done
    
    # Update audit results
    if [ $security_issues_found -eq 0 ]; then
        AUDIT_RESULTS["code_analysis"]="passed"
        log_success "No code security issues detected"
    else
        AUDIT_RESULTS["code_analysis"]="warning"
        log_warning "$security_issues_found potential security issues found in code"
        add_recommendation "MEDIUM" "Review and fix identified security anti-patterns and insecure configurations"
    fi
}

##############################################################################
# Configuration Security Validation
##############################################################################

validate_configuration_security() {
    log_header "⚙️ VALIDATING CONFIGURATION SECURITY"
    
    local config_issues=0
    
    # Check Docker security if present
    if [ -f "$PROJECT_ROOT/Dockerfile" ]; then
        log_info "Checking Docker configuration security..."
        
        # Check for root user
        if grep -q "^USER root" "$PROJECT_ROOT/Dockerfile"; then
            add_security_issue "MEDIUM" "DOCKER_SECURITY" \
                "Docker container runs as root user" \
                "Dockerfile" "$(grep -n '^USER root' "$PROJECT_ROOT/Dockerfile" | cut -d: -f1)"
            ((config_issues++))
        fi
        
        # Check for COPY/ADD with broad patterns
        if grep -E "^(COPY|ADD) \. " "$PROJECT_ROOT/Dockerfile" >/dev/null; then
            add_security_issue "LOW" "DOCKER_SECURITY" \
                "Docker COPY/ADD uses broad source pattern (.)" \
                "Dockerfile" "$(grep -n -E '^(COPY|ADD) \. ' "$PROJECT_ROOT/Dockerfile" | cut -d: -f1 | head -1)"
            ((config_issues++))
        fi
    fi
    
    # Check CI/CD configuration security
    declare -a CI_CONFIG_FILES=(
        ".github/workflows/*.yml"
        ".github/workflows/*.yaml"
        ".gitlab-ci.yml"
        ".travis.yml"
        "azure-pipelines.yml"
        "Jenkinsfile"
    )
    
    for ci_pattern in "${CI_CONFIG_FILES[@]}"; do
        while IFS= read -r -d '' ci_file; do
            local file_relative=$(realpath --relative-to="$PROJECT_ROOT" "$ci_file" 2>/dev/null || echo "$ci_file")
            
            # Check for secrets in CI files
            if grep -i -E "(password|secret|token|key)" "$ci_file" >/dev/null 2>&1; then
                local secret_lines=$(grep -i -n -E "(password|secret|token|key)" "$ci_file")
                while IFS= read -r line; do
                    local line_num=$(echo "$line" | cut -d: -f1)
                    # Skip if it's clearly a reference to secrets manager
                    if ! echo "$line" | grep -i -E "(secrets\.|env\.|vault|parameter)" >/dev/null; then
                        add_security_issue "HIGH" "CI_SECURITY" \
                            "Potential secret in CI configuration" \
                            "$file_relative" "$line_num"
                        ((config_issues++))
                    fi
                done <<< "$secret_lines"
            fi
        done < <(find "$PROJECT_ROOT" -path "*/$ci_pattern" -type f -print0 2>/dev/null)
    done
    
    # Check for insecure permissions in scripts
    log_info "Checking file permissions..."
    
    while IFS= read -r -d '' script_file; do
        local file_relative=$(realpath --relative-to="$PROJECT_ROOT" "$script_file" 2>/dev/null || echo "$script_file")
        local perms=$(stat -c "%a" "$script_file" 2>/dev/null || stat -f "%A" "$script_file" 2>/dev/null || echo "000")
        
        # Check for world-writable files
        if [[ "$perms" == *"7"* ]] || [[ "$perms" == *"6"* ]] && [[ "$perms" == "*6" ]]; then
            add_security_issue "MEDIUM" "FILE_PERMISSIONS" \
                "Script file has insecure permissions: $perms" \
                "$file_relative" "1"
            ((config_issues++))
        fi
    done < <(find "$PROJECT_ROOT" -type f \( -name "*.sh" -o -name "*.bash" -o -name "*.zsh" -o -perm -111 \) -print0 2>/dev/null)
    
    # Update audit results
    if [ $config_issues -eq 0 ]; then
        AUDIT_RESULTS["config_validation"]="passed"
        log_success "Configuration security validation passed"
    else
        AUDIT_RESULTS["config_validation"]="warning"
        log_warning "$config_issues configuration security issues found"
        add_recommendation "MEDIUM" "Fix configuration security issues including Docker, CI/CD, and file permissions"
    fi
}

##############################################################################
# Infrastructure Security Checks
##############################################################################

check_infrastructure_security() {
    log_header "🏗️ CHECKING INFRASTRUCTURE SECURITY"
    
    local infra_issues=0
    
    # Check for exposed services configuration
    declare -a SERVICE_CONFIG_FILES=(
        "docker-compose.yml"
        "docker-compose.yaml"
        "kubernetes/*.yml"
        "kubernetes/*.yaml"
        "k8s/*.yml"
        "k8s/*.yaml"
        "terraform/*.tf"
        "terraform/*.tfvars"
    )
    
    log_info "Checking service configurations..."
    
    for config_pattern in "${SERVICE_CONFIG_FILES[@]}"; do
        while IFS= read -r -d '' config_file; do
            local file_relative=$(realpath --relative-to="$PROJECT_ROOT" "$config_file" 2>/dev/null || echo "$config_file")
            
            # Check for exposed ports
            if grep -E "ports?:\s*-\s*['\"]?[0-9]+:[0-9]+['\"]?" "$config_file" >/dev/null 2>&1; then
                local exposed_ports=$(grep -n -E "ports?:\s*-\s*['\"]?[0-9]+:[0-9]+['\"]?" "$config_file")
                while IFS= read -r port_line; do
                    local line_num=$(echo "$port_line" | cut -d: -f1)
                    local port_config=$(echo "$port_line" | cut -d: -f2-)
                    
                    # Check for dangerous ports (0.0.0.0 binding)
                    if echo "$port_config" | grep -E "0\.0\.0\.0" >/dev/null; then
                        add_security_issue "HIGH" "EXPOSED_SERVICE" \
                            "Service exposed on all interfaces (0.0.0.0): ${port_config:0:50}" \
                            "$file_relative" "$line_num"
                        ((infra_issues++))
                    fi
                done <<< "$exposed_ports"
            fi
            
            # Check for privileged containers
            if grep -i "privileged.*true" "$config_file" >/dev/null 2>&1; then
                local priv_lines=$(grep -i -n "privileged.*true" "$config_file")
                while IFS= read -r line; do
                    local line_num=$(echo "$line" | cut -d: -f1)
                    add_security_issue "HIGH" "PRIVILEGED_CONTAINER" \
                        "Container running in privileged mode" \
                        "$file_relative" "$line_num"
                    ((infra_issues++))
                done <<< "$priv_lines"
            fi
            
            # Check for host network mode
            if grep -i "network.*host" "$config_file" >/dev/null 2>&1; then
                local host_net_lines=$(grep -i -n "network.*host" "$config_file")
                while IFS= read -r line; do
                    local line_num=$(echo "$line" | cut -d: -f1)
                    add_security_issue "MEDIUM" "HOST_NETWORK" \
                        "Container using host network mode" \
                        "$file_relative" "$line_num"
                    ((infra_issues++))
                done <<< "$host_net_lines"
            fi
        done < <(find "$PROJECT_ROOT" -path "*/$config_pattern" -type f -print0 2>/dev/null)
    done
    
    # Check for hardcoded infrastructure credentials
    log_info "Checking for hardcoded infrastructure credentials..."
    
    declare -a INFRA_SECRET_PATTERNS=(
        "(?i)(database[_-]?host)[\s]*[=:][\s]*['\"]?[a-zA-Z0-9.-]+['\"]?"
        "(?i)(redis[_-]?host)[\s]*[=:][\s]*['\"]?[a-zA-Z0-9.-]+['\"]?"
        "(?i)(smtp[_-]?host)[\s]*[=:][\s]*['\"]?[a-zA-Z0-9.-]+['\"]?"
        "(?i)(server[_-]?host)[\s]*[=:][\s]*['\"]?[a-zA-Z0-9.-]+['\"]?"
        "(?i)(admin[_-]?user|admin[_-]?username)[\s]*[=:][\s]*['\"]?[a-zA-Z0-9_-]+['\"]?"
    )
    
    while IFS= read -r -d '' file; do
        local file_relative=$(realpath --relative-to="$PROJECT_ROOT" "$file" 2>/dev/null || echo "$file")
        
        for pattern in "${INFRA_SECRET_PATTERNS[@]}"; do
            if grep -P -n "$pattern" "$file" >/dev/null 2>&1; then
                local matches=$(grep -P -n "$pattern" "$file")
                while IFS= read -r match; do
                    local line_num=$(echo "$match" | cut -d: -f1)
                    local content=$(echo "$match" | cut -d: -f2-)
                    
                    add_security_issue "MEDIUM" "HARDCODED_INFRA_CONFIG" \
                        "Hardcoded infrastructure config: ${content:0:50}..." \
                        "$file_relative" "$line_num"
                    
                    ((infra_issues++))
                done <<< "$matches"
            fi
        done
    done < <(find "$PROJECT_ROOT" -type f \( -name "*.yml" -o -name "*.yaml" -o -name "*.json" -o -name "*.toml" -o -name "*.tf" \) -print0 2>/dev/null)
    
    # Update audit results
    if [ $infra_issues -eq 0 ]; then
        AUDIT_RESULTS["infrastructure_check"]="passed"
        log_success "Infrastructure security checks passed"
    else
        AUDIT_RESULTS["infrastructure_check"]="warning"
        log_warning "$infra_issues infrastructure security issues found"
        add_recommendation "MEDIUM" "Address infrastructure security issues including exposed services and hardcoded configurations"
    fi
}

##############################################################################
# Report Generation
##############################################################################

generate_audit_report() {
    log_header "📊 GENERATING SECURITY AUDIT REPORT"
    
    mkdir -p "$TEMP_DIR"
    
    # Calculate overall security score
    local total_checks=5
    local passed_checks=0
    
    for result in "${AUDIT_RESULTS[@]}"; do
        if [ "$result" = "passed" ]; then
            ((passed_checks++))
        fi
    done
    
    local security_score=$(( (passed_checks * 100) / total_checks ))
    local overall_status="FAILED"
    
    if [ $security_score -ge 90 ]; then
        overall_status="PASSED"
    elif [ $security_score -ge 75 ]; then
        overall_status="WARNING"
    fi
    
    # Generate JSON report
    cat > "$AUDIT_REPORT_FILE" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "project_root": "$PROJECT_ROOT",
  "audit_version": "1.0.0",
  "overall": {
    "status": "$overall_status",
    "security_score": $security_score,
    "l3_compliant": $([ $security_score -ge 85 ] && echo "true" || echo "false")
  },
  "summary": {
    "total_issues": $((CRITICAL_ISSUES + HIGH_ISSUES + MEDIUM_ISSUES + LOW_ISSUES)),
    "critical_issues": $CRITICAL_ISSUES,
    "high_issues": $HIGH_ISSUES,
    "medium_issues": $MEDIUM_ISSUES,
    "low_issues": $LOW_ISSUES
  },
  "audit_results": {
EOF

    # Add audit results
    local first=true
    for check in "${!AUDIT_RESULTS[@]}"; do
        if [ "$first" = "true" ]; then
            first=false
        else
            echo "," >> "$AUDIT_REPORT_FILE"
        fi
        echo "    \"$check\": \"${AUDIT_RESULTS[$check]}\"" >> "$AUDIT_REPORT_FILE"
    done

    cat >> "$AUDIT_REPORT_FILE" << EOF
  },
  "security_issues": [
EOF

    # Add security issues
    local first=true
    for issue in "${SECURITY_ISSUES[@]}"; do
        if [ "$first" = "true" ]; then
            first=false
        else
            echo "," >> "$AUDIT_REPORT_FILE"
        fi
        echo "    $issue" >> "$AUDIT_REPORT_FILE"
    done

    cat >> "$AUDIT_REPORT_FILE" << EOF
  ],
  "recommendations": [
EOF

    # Add recommendations
    local first=true
    for recommendation in "${RECOMMENDATIONS[@]}"; do
        if [ "$first" = "true" ]; then
            first=false
        else
            echo "," >> "$AUDIT_REPORT_FILE"
        fi
        echo "    $recommendation" >> "$AUDIT_REPORT_FILE"
    done

    cat >> "$AUDIT_REPORT_FILE" << EOF
  ]
}
EOF

    log_success "Security audit report generated: $AUDIT_REPORT_FILE"
    
    # Print summary to console
    echo
    log_info "SECURITY AUDIT SUMMARY"
    echo "=============================="
    echo "Overall Status: $overall_status"
    echo "Security Score: $security_score/100"
    echo "L3 Compliant: $([ $security_score -ge 85 ] && echo "YES" || echo "NO")"
    echo
    echo "Issues Found:"
    echo "  Critical: $CRITICAL_ISSUES"
    echo "  High: $HIGH_ISSUES"  
    echo "  Medium: $MEDIUM_ISSUES"
    echo "  Low: $LOW_ISSUES"
    echo
    
    if [ ${#RECOMMENDATIONS[@]} -gt 0 ]; then
        echo "Top Recommendations:"
        for i in "${!RECOMMENDATIONS[@]}"; do
            if [ $i -lt 3 ]; then  # Show only top 3
                local rec=$(echo "${RECOMMENDATIONS[$i]}" | jq -r '.action' 2>/dev/null)
                echo "  - $rec"
            fi
        done
    fi
    
    echo
    echo "Full report: $AUDIT_REPORT_FILE"
}

##############################################################################
# Cleanup
##############################################################################

cleanup() {
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi
}

##############################################################################
# Main Execution
##############################################################################

main() {
    log_header "🛡️ BRIK L3 SECURITY AUDIT"
    
    # Setup
    mkdir -p "$TEMP_DIR"
    trap cleanup EXIT
    
    # Check required tools
    log_info "Checking required tools..."
    
    local missing_tools=()
    for tool in grep find stat jq; do
        if ! command -v "$tool" >/dev/null 2>&1; then
            missing_tools+=("$tool")
        fi
    done
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        exit 1
    fi
    
    # Run security audits
    scan_secrets
    scan_dependencies  
    analyze_code_security
    validate_configuration_security
    check_infrastructure_security
    
    # Generate report
    generate_audit_report
    
    # Exit with appropriate code
    local total_critical_high=$((CRITICAL_ISSUES + HIGH_ISSUES))
    if [ $total_critical_high -gt 0 ]; then
        log_error "Security audit failed with $total_critical_high critical/high issues"
        exit 1
    elif [ $((CRITICAL_ISSUES + HIGH_ISSUES + MEDIUM_ISSUES + LOW_ISSUES)) -gt 0 ]; then
        log_warning "Security audit completed with warnings"
        exit 0
    else
        log_success "Security audit passed!"
        exit 0
    fi
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi