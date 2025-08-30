#!/bin/bash

##############################################################################
# BRIK L3 Certification Deployment Script
# 
# Deploys the complete L3 certification system to the BRIK project:
# - Contract tests
# - Security audit tools
# - Hash generation system
# - Cross-language compilation tests
# - Dependabot configuration
# - Master certification suite
##############################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DEPLOYMENT_LOG="$PROJECT_ROOT/.conductor/deployment.log"

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$DEPLOYMENT_LOG"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$DEPLOYMENT_LOG"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$DEPLOYMENT_LOG"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$DEPLOYMENT_LOG"
}

log_header() {
    echo -e "\n${PURPLE}===================================================${NC}"
    echo -e "${PURPLE} $1${NC}"
    echo -e "${PURPLE}===================================================${NC}\n"
}

##############################################################################
# Deployment Functions
##############################################################################

create_directory_structure() {
    log_header "📁 CREATING DIRECTORY STRUCTURE"
    
    # Create required directories
    local directories=(
        "tests/contract"
        "scripts"
        ".github"
    )
    
    for dir in "${directories[@]}"; do
        local target_dir="$PROJECT_ROOT/$dir"
        if [ ! -d "$target_dir" ]; then
            mkdir -p "$target_dir"
            log_info "Created directory: $dir"
        else
            log_info "Directory exists: $dir"
        fi
    done
    
    log_success "Directory structure ready"
}

deploy_contract_tests() {
    log_header "📋 DEPLOYING CONTRACT TESTS"
    
    # Deploy TypeScript contract structure test
    local src_file="$SCRIPT_DIR/contract_structure_spec.ts"
    local target_file="$PROJECT_ROOT/tests/contract/contract_structure.spec.ts"
    
    if [ -f "$src_file" ]; then
        cp "$src_file" "$target_file"
        log_success "Deployed: contract_structure.spec.ts"
    else
        log_error "Source file not found: contract_structure_spec.ts"
        return 1
    fi
    
    # Deploy cross-language compilation test
    local src_file2="$SCRIPT_DIR/cross_language_compile_test.js"
    local target_file2="$PROJECT_ROOT/tests/contract/cross_language_compile.test.js"
    
    if [ -f "$src_file2" ]; then
        cp "$src_file2" "$target_file2"
        log_success "Deployed: cross_language_compile.test.js"
    else
        log_error "Source file not found: cross_language_compile_test.js"
        return 1
    fi
    
    log_success "Contract tests deployed successfully"
}

deploy_security_tools() {
    log_header "🔒 DEPLOYING SECURITY TOOLS"
    
    # Deploy security audit script
    local src_file="$SCRIPT_DIR/security_audit.sh"
    local target_file="$PROJECT_ROOT/tests/contract/security_audit.sh"
    
    if [ -f "$src_file" ]; then
        cp "$src_file" "$target_file"
        chmod +x "$target_file"
        log_success "Deployed: security_audit.sh (executable)"
    else
        log_error "Source file not found: security_audit.sh"
        return 1
    fi
    
    log_success "Security tools deployed successfully"
}

deploy_hash_generator() {
    log_header "🔐 DEPLOYING HASH GENERATOR"
    
    # Deploy BRIK hash generator
    local src_file="$SCRIPT_DIR/generate_brik_hash.js"
    local target_file="$PROJECT_ROOT/scripts/generate_brik_hash.js"
    
    if [ -f "$src_file" ]; then
        cp "$src_file" "$target_file"
        chmod +x "$target_file"
        log_success "Deployed: generate_brik_hash.js (executable)"
    else
        log_error "Source file not found: generate_brik_hash.js"
        return 1
    fi
    
    log_success "Hash generator deployed successfully"
}

deploy_dependabot_config() {
    log_header "🤖 DEPLOYING DEPENDABOT CONFIGURATION"
    
    # Deploy Dependabot configuration
    local src_file="$SCRIPT_DIR/dependabot.yml"
    local target_file="$PROJECT_ROOT/.github/dependabot.yml"
    
    if [ -f "$src_file" ]; then
        cp "$src_file" "$target_file"
        log_success "Deployed: .github/dependabot.yml"
    else
        log_error "Source file not found: dependabot.yml"
        return 1
    fi
    
    log_success "Dependabot configuration deployed successfully"
}

deploy_certification_suite() {
    log_header "🎯 DEPLOYING L3 CERTIFICATION SUITE"
    
    # Deploy master certification suite
    local src_file="$SCRIPT_DIR/l3_certification_suite.js"
    local target_file="$PROJECT_ROOT/scripts/l3_certification_suite.js"
    
    if [ -f "$src_file" ]; then
        cp "$src_file" "$target_file"
        chmod +x "$target_file"
        log_success "Deployed: l3_certification_suite.js (executable)"
    else
        log_error "Source file not found: l3_certification_suite.js"
        return 1
    fi
    
    log_success "Certification suite deployed successfully"
}

update_package_json() {
    log_header "📦 UPDATING PACKAGE.JSON SCRIPTS"
    
    local package_json="$PROJECT_ROOT/package.json"
    
    if [ ! -f "$package_json" ]; then
        log_warning "package.json not found, creating basic one..."
        cat > "$package_json" << 'EOF'
{
  "name": "brik-project-initializer",
  "version": "5.0.0",
  "description": "BRIK Project Initializer with L3 Certification",
  "main": "init-brik-project.sh",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["brik", "project", "initializer", "certification"],
  "license": "MIT"
}
EOF
    fi
    
    # Add L3 certification scripts using Node.js to modify JSON
    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('$package_json', 'utf8'));
        
        // Add L3 certification scripts
        pkg.scripts = pkg.scripts || {};
        pkg.scripts['l3:certify'] = 'node scripts/l3_certification_suite.js';
        pkg.scripts['l3:hash'] = 'node scripts/generate_brik_hash.js';
        pkg.scripts['l3:hash:verify'] = 'node scripts/generate_brik_hash.js --verify';
        pkg.scripts['l3:security'] = 'bash tests/contract/security_audit.sh';
        pkg.scripts['l3:structure'] = 'npx jest tests/contract/contract_structure.spec.ts';
        pkg.scripts['l3:cross-lang'] = 'node tests/contract/cross_language_compile.test.js';
        
        // Add development dependencies for testing
        pkg.devDependencies = pkg.devDependencies || {};
        pkg.devDependencies['@jest/globals'] = '^29.0.0';
        pkg.devDependencies['jest'] = '^29.0.0';
        pkg.devDependencies['ts-jest'] = '^29.0.0';
        pkg.devDependencies['typescript'] = '^5.0.0';
        pkg.devDependencies['@types/node'] = '^20.0.0';
        
        fs.writeFileSync('$package_json', JSON.stringify(pkg, null, 2));
        console.log('✅ Updated package.json with L3 certification scripts');
    " 2>/dev/null || log_warning "Could not update package.json (Node.js required)"
    
    log_success "Package.json updated"
}

create_jest_config() {
    log_header "🧪 CREATING JEST CONFIGURATION"
    
    local jest_config="$PROJECT_ROOT/jest.config.js"
    
    cat > "$jest_config" << 'EOF'
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '**/tests/**/*.test.(ts|js)',
    '**/tests/**/*.spec.(ts|js)'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest'
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testTimeout: 30000,
  verbose: true
};
EOF
    
    log_success "Created jest.config.js"
}

create_tsconfig() {
    log_header "📘 CREATING TYPESCRIPT CONFIGURATION"
    
    local tsconfig="$PROJECT_ROOT/tsconfig.json"
    
    if [ ! -f "$tsconfig" ]; then
        cat > "$tsconfig" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "types": ["node", "@jest/globals"]
  },
  "include": [
    "tests/**/*",
    "scripts/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "build"
  ]
}
EOF
        log_success "Created tsconfig.json"
    else
        log_info "tsconfig.json already exists"
    fi
}

create_github_workflows() {
    log_header "🔄 CREATING GITHUB WORKFLOWS"
    
    local workflows_dir="$PROJECT_ROOT/.github/workflows"
    mkdir -p "$workflows_dir"
    
    # L3 Certification workflow
    cat > "$workflows_dir/l3-certification.yml" << 'EOF'
name: BRIK L3 Certification

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    # Run daily at 6 AM UTC
    - cron: '0 6 * * *'

jobs:
  l3-certification:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
        
    - name: Setup Rust
      uses: actions-rs/toolchain@v1
      with:
        toolchain: stable
        
    - name: Install dependencies
      run: |
        npm install
        pip install safety
        cargo install cargo-audit
        
    - name: Run L3 Certification Suite
      run: npm run l3:certify
      
    - name: Upload certification report
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: l3-certification-report-${{ matrix.node-version }}
        path: |
          brik-l3-certification-report.json
          brik-l3-certification-report.html
          security-audit-report.json
          .brik-cert.sha256
          .brik-hash-report.json
        
    - name: Comment PR with results
      uses: actions/github-script@v6
      if: github.event_name == 'pull_request'
      with:
        script: |
          const fs = require('fs');
          if (fs.existsSync('brik-l3-certification-report.json')) {
            const report = JSON.parse(fs.readFileSync('brik-l3-certification-report.json', 'utf8'));
            const status = report.overall.l3_compliant ? '✅ PASSED' : '❌ FAILED';
            const score = report.overall.score;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## 🎯 BRIK L3 Certification Results
              
**Status:** ${status}
**Score:** ${score}/100
**Level:** ${report.certification.level}

### Test Results:
${Object.entries(report.tests).map(([name, result]) => 
  `- ${result.status === 'PASSED' ? '✅' : '❌'} ${name}: ${result.score}%`
).join('\n')}

${report.recommendations.length > 0 ? 
`### Recommendations:
${report.recommendations.slice(0, 3).map(rec => `- **${rec.priority}:** ${rec.action}`).join('\n')}` : ''}`
            });
          }
EOF
    
    log_success "Created .github/workflows/l3-certification.yml"
}

update_gitignore() {
    log_header "📝 UPDATING .GITIGNORE"
    
    local gitignore="$PROJECT_ROOT/.gitignore"
    
    # Add L3 certification artifacts to .gitignore if not already present
    local additions=(
        "# L3 Certification artifacts"
        "brik-l3-certification-report.*"
        "security-audit-report.json"
        ".brik-hash-report.json"
        "coverage/"
        "*.log"
    )
    
    for addition in "${additions[@]}"; do
        if ! grep -qF "$addition" "$gitignore" 2>/dev/null; then
            echo "$addition" >> "$gitignore"
        fi
    done
    
    log_success "Updated .gitignore"
}

create_documentation() {
    log_header "📚 CREATING L3 CERTIFICATION DOCUMENTATION"
    
    local docs_dir="$PROJECT_ROOT/docs"
    mkdir -p "$docs_dir"
    
    cat > "$docs_dir/L3-CERTIFICATION.md" << 'EOF'
# BRIK L3 Certification Guide

## Overview

BRIK L3 Certification ensures your project meets enterprise-grade standards for:
- **Structure Compliance**: Proper BRIK architecture (CORE, WRAPPERS, LIVING_LAYER)
- **Security Excellence**: No vulnerabilities, secrets, or security anti-patterns
- **Cross-Language Support**: Multi-language compilation and compatibility
- **Dependency Management**: Secure and up-to-date dependencies
- **Project Integrity**: Cryptographic hash verification

## Quick Start

```bash
# Run complete L3 certification
npm run l3:certify

# Run individual components
npm run l3:structure        # Structure validation
npm run l3:security         # Security audit
npm run l3:cross-lang       # Cross-language tests
npm run l3:hash             # Generate project hash
npm run l3:hash:verify      # Verify existing hash
```

## Certification Levels

| Level | Score | Requirements |
|-------|-------|-------------|
| **L4** | 95-100% | Perfect compliance + advanced features |
| **L3** | 85-94% | Enterprise-ready with minor improvements |
| **L2** | 70-84% | Good foundation, needs refinement |
| **L1** | 50-69% | Basic compliance, significant work needed |
| **L0** | 0-49% | Does not meet minimum standards |

## L3 Requirements (≥85% score)

### Structure Validation (30% weight)
- ✅ All CORE components present (BrikCore, BrikControlHub, etc.)
- ✅ Essential WRAPPER components (≥50% of recommended)
- ✅ LIVING_LAYER components with LLM integration
- ✅ Required documentation files

### Security Audit (25% weight)
- ✅ No exposed secrets or credentials
- ✅ No critical/high security vulnerabilities
- ✅ Secure configuration patterns
- ✅ Safe file permissions

### Cross-Language Compilation (20% weight)
- ✅ TypeScript/JavaScript compilation success
- ✅ Multi-language project support
- ✅ Configuration file compatibility
- ✅ Cross-platform reproducibility

### Hash Generation (15% weight)
- ✅ Reproducible cryptographic hash
- ✅ Project integrity verification
- ✅ Secure hash algorithm (SHA-256+)

### Dependency Analysis (10% weight)
- ✅ No high/critical vulnerabilities
- ✅ Up-to-date dependencies
- ✅ Clean dependency tree

## Automated Certification

The project includes GitHub Actions workflow that automatically:
- Runs L3 certification on every PR
- Generates detailed reports
- Comments results on pull requests
- Uploads certification artifacts

## Troubleshooting

### Common Issues

**Structure validation failing:**
- Implement missing BRIK components
- Follow BRIK Core Framework architecture
- Add required documentation files

**Security audit failing:**
- Remove `.env` files and secrets from repository
- Update vulnerable dependencies
- Fix security anti-patterns in code

**Cross-language tests failing:**
- Ensure TypeScript compilation works
- Fix package.json/tsconfig.json issues
- Test with `npm run build` or `tsc --noEmit`

**Hash generation failing:**
- Check file permissions
- Ensure Node.js is available
- Verify project structure integrity

## Manual Verification

```bash
# Verify project structure
find . -name "*.ts" -o -name "*.js" | head -10

# Check for secrets (should return nothing)
grep -r "api_key\|secret\|password" --include="*.ts" --include="*.js" . || echo "✅ No secrets found"

# Verify dependencies
npm audit --audit-level high

# Test compilation
npx tsc --noEmit
```

## Support

For L3 certification support:
1. Review generated reports in detail
2. Follow recommendations in priority order
3. Check GitHub Actions logs for detailed errors
4. Ensure all required tools are available

---

**Security-Phantom L3 Certification System**  
*Ensuring BRIK project excellence with complete operational invisibility*
EOF
    
    log_success "Created docs/L3-CERTIFICATION.md"
}

validate_deployment() {
    log_header "✅ VALIDATING DEPLOYMENT"
    
    local validation_errors=0
    
    # Check critical files
    local critical_files=(
        "tests/contract/contract_structure.spec.ts"
        "tests/contract/cross_language_compile.test.js"
        "tests/contract/security_audit.sh"
        "scripts/generate_brik_hash.js"
        "scripts/l3_certification_suite.js"
        ".github/dependabot.yml"
        ".github/workflows/l3-certification.yml"
        "jest.config.js"
        "docs/L3-CERTIFICATION.md"
    )
    
    for file in "${critical_files[@]}"; do
        if [ -f "$PROJECT_ROOT/$file" ]; then
            log_success "✓ $file"
        else
            log_error "✗ Missing: $file"
            ((validation_errors++))
        fi
    done
    
    # Check executable permissions
    local executable_files=(
        "tests/contract/security_audit.sh"
        "scripts/generate_brik_hash.js"
        "scripts/l3_certification_suite.js"
    )
    
    for file in "${executable_files[@]}"; do
        if [ -x "$PROJECT_ROOT/$file" ]; then
            log_success "✓ $file (executable)"
        else
            log_warning "⚠ $file (not executable - will be fixed)"
            chmod +x "$PROJECT_ROOT/$file" 2>/dev/null || true
        fi
    done
    
    if [ $validation_errors -eq 0 ]; then
        log_success "All files deployed successfully!"
        return 0
    else
        log_error "$validation_errors file(s) missing - deployment incomplete"
        return 1
    fi
}

##############################################################################
# Main Deployment
##############################################################################

main() {
    log_header "🚀 DEPLOYING BRIK L3 CERTIFICATION SYSTEM"
    
    echo "Deployment started: $(date)" > "$DEPLOYMENT_LOG"
    
    # Run deployment steps
    create_directory_structure
    deploy_contract_tests
    deploy_security_tools
    deploy_hash_generator
    deploy_dependabot_config
    deploy_certification_suite
    update_package_json
    create_jest_config
    create_tsconfig
    create_github_workflows
    update_gitignore
    create_documentation
    
    # Validate deployment
    if validate_deployment; then
        log_header "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY"
        
        echo
        log_info "🎯 BRIK L3 Certification System deployed!"
        log_info ""
        log_info "Next steps:"
        log_info "1. Run 'npm install' to install dependencies"
        log_info "2. Run 'npm run l3:certify' to start certification"
        log_info "3. Review generated reports"
        log_info "4. Address any recommendations"
        log_info ""
        log_info "Quick commands:"
        log_info "  npm run l3:certify     # Full L3 certification"
        log_info "  npm run l3:security    # Security audit only"
        log_info "  npm run l3:hash        # Generate project hash"
        log_info ""
        log_info "Documentation: docs/L3-CERTIFICATION.md"
        
        echo
        log_success "🛡️ Security-Phantom L3 Certification System is now active!"
        
        return 0
    else
        log_error "❌ Deployment failed - see errors above"
        return 1
    fi
}

# Run deployment
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi