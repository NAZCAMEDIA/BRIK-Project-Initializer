#!/bin/bash

# BRIK Project Initializer v1.0.0 - GitHub CLI Setup Script
# This script configures the GitHub repository with labels, milestone, project, and issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_OWNER="C-BIAS"
REPO_NAME="BRIK-Project-Initializer"
MILESTONE_TITLE="v1.0.0"
PROJECT_TITLE="V1 Roadmap"

echo -e "${BLUE}🚀 BRIK Project Initializer v1.0.0 GitHub Setup${NC}"
echo -e "${BLUE}================================================${NC}"

# Check if gh CLI is installed and authenticated
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) is not installed${NC}"
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI not authenticated${NC}"
    echo "Please run: gh auth login"
    exit 1
fi

echo -e "${GREEN}✅ GitHub CLI is installed and authenticated${NC}"

# Function to create labels
create_labels() {
    echo -e "\n${YELLOW}🏷️  Creating repository labels...${NC}"
    
    # Priority Labels
    gh label create "P1-critical" --color "d73a4a" --description "Blocking issues requiring immediate attention" --force
    gh label create "P2-high" --color "ff6b35" --description "Important issues for next sprint" --force
    gh label create "P3-medium" --color "fbca04" --description "Standard priority issues" --force
    gh label create "P4-low" --color "0e8a16" --description "Nice-to-have, backlog items" --force
    
    # Type Labels
    gh label create "type:bug" --color "d73a4a" --description "Something isn't working" --force
    gh label create "type:feature" --color "a2eeef" --description "New feature request" --force
    gh label create "type:enhancement" --color "7057ff" --description "Enhancement to existing feature" --force
    gh label create "type:documentation" --color "0075ca" --description "Documentation improvements" --force
    gh label create "type:refactor" --color "6f42c1" --description "Code refactoring" --force
    gh label create "type:test" --color "1a7f37" --description "Test improvements" --force
    gh label create "type:ci" --color "2ea043" --description "CI/CD pipeline improvements" --force
    
    # Gate Labels
    gh label create "L0-foundation" --color "8b5a2b" --description "Foundation infrastructure and setup" --force
    gh label create "L1-core" --color "2ea043" --description "Core functionality development" --force
    gh label create "L2-intelligent" --color "0969da" --description "AI/LLM intelligent features" --force
    gh label create "L3-production" --color "8250df" --description "Production readiness" --force
    
    # Status Labels
    gh label create "blocked" --color "d73a4a" --description "Cannot proceed, dependency missing" --force
    gh label create "ready" --color "0e8a16" --description "Ready for development" --force
    gh label create "in-progress" --color "fbca04" --description "Currently being worked on" --force
    gh label create "needs-review" --color "ff6b35" --description "Ready for code review" --force
    gh label create "needs-testing" --color "7057ff" --description "Requires additional testing" --force
    
    echo -e "${GREEN}✅ Labels created successfully${NC}"
}

# Function to create milestone
create_milestone() {
    echo -e "\n${YELLOW}📋 Creating milestone...${NC}"
    
    # Calculate due date (7 weeks from now)
    DUE_DATE=$(date -d "7 weeks" +"%Y-%m-%d" 2>/dev/null || date -v+7w +"%Y-%m-%d" 2>/dev/null || date --date="7 weeks" +"%Y-%m-%d")
    
    MILESTONE_DESCRIPTION="Transform BRIK Project Initializer into an enterprise-ready intelligent project generator with AI. This milestone includes foundation setup, core functionality, intelligent enhancement, and production readiness across 4 gates (L0-L3)."
    
    gh api repos/${REPO_OWNER}/${REPO_NAME}/milestones \
        --method POST \
        --field title="${MILESTONE_TITLE}" \
        --field description="${MILESTONE_DESCRIPTION}" \
        --field due_on="${DUE_DATE}T23:59:59Z" \
        --field state="open" || echo -e "${YELLOW}⚠️  Milestone might already exist${NC}"
    
    echo -e "${GREEN}✅ Milestone '${MILESTONE_TITLE}' created (due: ${DUE_DATE})${NC}"
}

# Function to create GitHub Project
create_project() {
    echo -e "\n${YELLOW}📊 Creating GitHub Project...${NC}"
    
    # Note: GitHub CLI doesn't support creating Projects v2 yet
    # This creates a legacy project (Projects Classic)
    
    PROJECT_DESCRIPTION="BRIK Project Initializer v1.0.0 development roadmap with L0-L3 gates tracking foundation, core functionality, intelligent enhancement, and production readiness."
    
    gh api repos/${REPO_OWNER}/${REPO_NAME}/projects \
        --method POST \
        --field name="${PROJECT_TITLE}" \
        --field body="${PROJECT_DESCRIPTION}" || echo -e "${YELLOW}⚠️  Project might already exist${NC}"
    
    echo -e "${GREEN}✅ Project '${PROJECT_TITLE}' created${NC}"
    echo -e "${BLUE}💡 Note: Please manually convert to Projects v2 in GitHub UI for better features${NC}"
}

# Function to create issues
create_issues() {
    echo -e "\n${YELLOW}🎫 Creating issues...${NC}"
    
    # Issue #1: L0 Foundation - Professional GitHub Configuration
    gh issue create \
        --title "L0: Setup professional GitHub repository configuration and workflows" \
        --body-file - \
        --label "L0-foundation,type:ci,P1-critical" \
        --milestone "${MILESTONE_TITLE}" << 'EOF'
## Description
Establish enterprise-grade GitHub repository configuration with professional workflows, issue templates, and project management setup.

## Acceptance Criteria
- [ ] GitHub repository labels configured (P1-P4, type:*, L0-L3, status)
- [ ] Issue templates for bug reports and feature requests
- [ ] Pull request template with comprehensive checklist
- [ ] GitHub Actions workflows for multi-language testing
- [ ] Branch protection rules for main/develop branches
- [ ] GitHub Project board "V1 Roadmap" created and linked
- [ ] Milestone v1.0.0 created with proper description

## Technical Requirements
**CI/CD Workflows:**
- Rust: cargo test, cargo clippy, cargo fmt
- TypeScript: npm test, eslint, prettier
- Python: pytest, black, mypy, bandit
- Multi-platform testing (Ubuntu, macOS, Windows)
- Coverage reporting with codecov integration
- Security scanning with CodeQL

**Repository Settings:**
- Branch protection: require PR reviews, status checks
- Merge strategy: squash and merge preferred
- Auto-delete head branches after merge
- Vulnerability alerts enabled

## Definition of Done
- [ ] All CI/CD workflows pass successfully
- [ ] Issue and PR templates tested with example submissions
- [ ] GitHub Project board populated with all v1.0.0 issues
- [ ] Documentation updated with contribution workflow
- [ ] Team members have appropriate repository permissions

**Effort Estimate:** 8 hours
**Dependencies:** None
**Gate:** L0 - Foundation
EOF

    # Issue #2: L0 Foundation - Documentation Ecosystem
    gh issue create \
        --title "L0: Create comprehensive documentation structure and content" \
        --body-file - \
        --label "L0-foundation,type:documentation,P1-critical" \
        --milestone "${MILESTONE_TITLE}" << 'EOF'
## Description
Establish a professional documentation ecosystem that serves both developers and users, ensuring easy onboarding and clear architectural guidance.

## Acceptance Criteria
- [ ] `/docs/ARCHITECTURE.md` - Technical architecture overview
- [ ] `/docs/DEVELOPMENT.md` - Development setup and guidelines  
- [ ] `/docs/TESTING.md` - Testing strategy and guidelines
- [ ] `/docs/API.md` - API documentation for extensibility
- [ ] `/CONTRIBUTING.md` - Comprehensive contribution guidelines
- [ ] `/SECURITY.md` - Security policy and vulnerability reporting
- [ ] Update `/README.md` with v1.0.0 roadmap reference
- [ ] Create `/docs/EXAMPLES.md` with real-world use cases

## Technical Requirements
**Documentation Standards:**
- Markdown format with consistent styling
- Code examples tested and validated
- Architecture diagrams (using Mermaid)
- API documentation auto-generated where possible
- Multi-language examples (Rust/TS/Python)

**Content Requirements:**
- Architecture: BRIK philosophy, layer separation, design decisions
- Development: Local setup, coding standards, debugging
- Testing: Unit/integration/e2e testing strategies
- API: Extension points for new languages and integrations
- Examples: E-commerce, analytics, fintech real-world scenarios

## Definition of Done
- [ ] All documentation files created and reviewed
- [ ] Code examples tested and working
- [ ] Documentation builds and renders correctly
- [ ] Internal links validated and working
- [ ] Documentation reviewed by technical and non-technical team members

**Effort Estimate:** 16 hours
**Dependencies:** Issue #1 (GitHub configuration)
**Gate:** L0 - Foundation
EOF

    # Issue #3: L0 Foundation - Enhanced CI/CD Pipeline
    gh issue create \
        --title "L0: Implement robust CI/CD pipeline with security and quality gates" \
        --body-file - \
        --label "L0-foundation,type:ci,P2-high" \
        --milestone "${MILESTONE_TITLE}" << 'EOF'
## Description
Create a production-ready CI/CD pipeline that ensures code quality, security, and reliability across all supported languages.

## Acceptance Criteria
- [ ] Multi-language testing workflow (Rust, TypeScript, Python)
- [ ] Automated security scanning (SAST/dependency scanning)
- [ ] Code coverage reporting with 80% minimum threshold
- [ ] Performance benchmarking for critical paths
- [ ] Automated artifact generation and storage
- [ ] Release workflow with semantic versioning
- [ ] Integration testing for LLM pipeline (with/without API keys)

## Technical Requirements
**Testing Matrix:**
- OS: Ubuntu 22.04, macOS-latest, Windows-latest
- Node.js: 18.x, 20.x
- Python: 3.9, 3.10, 3.11
- Rust: stable, beta

**Quality Gates:**
- Code coverage: minimum 80% (target 100%)
- Security scan: no high/critical vulnerabilities
- Linting: zero warnings/errors
- Performance: baseline performance maintained

**Workflows:**
- `test.yml` - Comprehensive testing matrix
- `security.yml` - Security scanning and SBOM generation
- `release.yml` - Automated releases with changelog
- `docs.yml` - Documentation building and deployment

## Definition of Done
- [ ] All workflows implemented and tested
- [ ] Security scanning integrated with GitHub Security tab
- [ ] Coverage reporting integrated with pull requests
- [ ] Performance benchmarks baseline established
- [ ] Release workflow tested with pre-release version

**Effort Estimate:** 12 hours
**Dependencies:** Issue #1 (GitHub configuration)
**Gate:** L0 - Foundation
EOF

    # Issue #4: L1 Core - Traditional Generator Refactoring
    gh issue create \
        --title "L1: Refactor and enhance traditional generator for modularity and reliability" \
        --body-file - \
        --label "L1-core,type:refactor,P2-high" \
        --milestone "${MILESTONE_TITLE}" << 'EOF'
## Description
Refactor the existing traditional generator to improve modularity, error handling, and maintainability while ensuring 100% reliability.

## Acceptance Criteria
- [ ] Modular generator architecture with pluggable language support
- [ ] Robust error handling with clear user feedback
- [ ] Template validation and sanitization
- [ ] Configuration file support (`.brik-config.json`)
- [ ] Improved CLI interface with better help and validation
- [ ] Template hot-reloading for development
- [ ] Comprehensive logging and debugging support

## Technical Requirements
**Architecture:**
- Separate language generators as plugins
- Common template engine with language-specific extensions
- Configuration management system
- Error handling with user-friendly messages

**Supported Languages (Enhanced):**
- Rust: Updated dependencies, improved async patterns
- TypeScript: Modern React/Node.js templates, ESM support
- Python: FastAPI/Django templates, modern packaging

**Quality Requirements:**
- 100% test coverage for generator logic
- End-to-end tests for all language generators
- Performance: < 30 seconds for full project generation
- Error recovery: graceful failure with cleanup

## Definition of Done
- [ ] All language generators refactored and tested
- [ ] Configuration system implemented and documented
- [ ] Error handling comprehensive with helpful messages
- [ ] Performance benchmarks meet targets
- [ ] Backward compatibility maintained for existing projects

**Effort Estimate:** 20 hours
**Dependencies:** Issue #2 (Documentation), Issue #3 (CI/CD)
**Gate:** L1 - Core Functionality
EOF

    # Issue #5: L1 Core - LLM Pipeline Foundation
    gh issue create \
        --title "L1: Implement stable LLM pipeline with domain analysis and architecture classification" \
        --body-file - \
        --label "L1-core,type:feature,P1-critical" \
        --milestone "${MILESTONE_TITLE}" << 'EOF'
## Description
Build the foundational LLM pipeline that powers intelligent project generation, including domain analysis and architecture classification.

## Acceptance Criteria
- [ ] Domain analyzer with 95%+ accuracy for common project types
- [ ] Architecture classifier mapping requirements to BRIK layers
- [ ] LLM provider abstraction (Anthropic Claude, OpenAI GPT)
- [ ] Robust mock system for development without API keys
- [ ] Fallback chain for high availability
- [ ] Prompt engineering framework for optimization
- [ ] Request/response caching for efficiency

## Technical Requirements
**Domain Analysis:**
- Extract entities, relationships, and business rules
- Identify integration requirements
- Classify project complexity and type
- Generate structured requirements document

**Architecture Classification:**
- Map entities to CORE layer (immutable business logic)
- Identify WRAPPER layer needs (external integrations)
- Design LIVING layer components (adaptive features)
- Generate architectural blueprint

**LLM Integration:**
- Provider-agnostic interface
- Rate limiting and error handling
- Token usage optimization
- Response validation and sanitization

## Definition of Done
- [ ] Domain analysis tested with 20+ project descriptions
- [ ] Architecture classification validated against BRIK principles
- [ ] Mock system provides realistic responses
- [ ] LLM provider failover tested and working
- [ ] Performance meets < 10 seconds per analysis target

**Effort Estimate:** 24 hours
**Dependencies:** Issue #4 (Traditional generator)
**Gate:** L1 - Core Functionality
EOF

    # Issue #6: L2 Intelligence - Advanced Code Generation
    gh issue create \
        --title "L2: Implement intelligent multi-file code generation with integration support" \
        --body-file - \
        --label "L2-intelligent,type:feature,P2-high" \
        --milestone "${MILESTONE_TITLE}" << 'EOF'
## Description
Create advanced code generation capabilities that produce complete, production-ready projects with proper integrations and full test coverage.

## Acceptance Criteria
- [ ] Multi-file code generation for complex projects
- [ ] Integration code generation (PostgreSQL, Redis, Stripe, etc.)
- [ ] Test generation with 100% coverage target
- [ ] Configuration file generation (Docker, CI/CD, etc.)
- [ ] Code quality validation and optimization
- [ ] Template customization and extension system
- [ ] Generated code follows language best practices

## Technical Requirements
**Code Generation Engine:**
- Template-driven generation with smart interpolation
- Dependency injection for integrations
- Configuration-based customization
- Code formatting and optimization

**Integration Support:**
- Database: PostgreSQL, MySQL, MongoDB, Redis
- Payment: Stripe, PayPal, Square
- Messaging: Kafka, RabbitMQ, Redis Pub/Sub
- Cloud: AWS, GCP, Azure basic services
- Monitoring: Prometheus, Grafana, Jaeger

**Quality Assurance:**
- Generated code compiles and runs successfully
- Tests achieve target coverage levels
- Security best practices implemented
- Performance considerations included

## Definition of Done
- [ ] Code generation tested with complex project scenarios
- [ ] All supported integrations generate working code
- [ ] Generated tests pass and provide adequate coverage
- [ ] Generated projects build and run successfully
- [ ] Code quality meets established standards

**Effort Estimate:** 32 hours
**Dependencies:** Issue #5 (LLM pipeline)
**Gate:** L2 - Intelligent Enhancement
EOF

    # Issue #7: L2 Intelligence - Validation and Certification System
    gh issue create \
        --title "L2: Implement BRIK architecture validation and SHA-256 certification system" \
        --body-file - \
        --label "L2-intelligent,type:feature,P2-high" \
        --milestone "${MILESTONE_TITLE}" << 'EOF'
## Description
Create a comprehensive validation and certification system that ensures generated projects comply with BRIK architecture and provides verifiable quality certification.

## Acceptance Criteria
- [ ] BRIK architecture compliance validator
- [ ] Code quality metrics analyzer
- [ ] Test coverage verification system
- [ ] SHA-256 certification generation
- [ ] Quality report generation
- [ ] Certification verification tools
- [ ] Integration with CI/CD for continuous validation

## Technical Requirements
**Architecture Validation:**
- CORE layer immutability verification
- WRAPPER layer integration compliance
- LIVING layer adaptivity validation
- Cross-layer dependency analysis

**Quality Metrics:**
- Code coverage analysis
- Cyclomatic complexity measurement
- Security vulnerability scanning
- Performance benchmarking

**Certification System:**
- Unique SHA-256 hash for each project
- Timestamp and metadata inclusion
- Verification endpoint/tooling
- Certificate storage and retrieval

## Definition of Done
- [ ] Architecture validator correctly identifies BRIK compliance
- [ ] Quality metrics accurately reflect project health
- [ ] Certification system generates unique, verifiable hashes
- [ ] Integration with generator pipeline completed
- [ ] Certification verification tools working

**Effort Estimate:** 16 hours
**Dependencies:** Issue #6 (Code generation)
**Gate:** L2 - Intelligent Enhancement
EOF

    # Issue #8: L3 Production - Final Integration and Polish
    gh issue create \
        --title "L3: Complete end-to-end integration, performance optimization, and user experience polish" \
        --body-file - \
        --label "L3-production,type:enhancement,P1-critical" \
        --milestone "${MILESTONE_TITLE}" << 'EOF'
## Description
Complete the final integration of all components, optimize performance, and polish the user experience to enterprise standards.

## Acceptance Criteria
- [ ] End-to-end integration testing completed
- [ ] Performance optimization achieving all targets
- [ ] User experience refined with clear feedback and progress
- [ ] Error handling and recovery comprehensive
- [ ] Security audit completed and issues resolved
- [ ] Final documentation review and updates
- [ ] Production deployment testing

## Technical Requirements
**Performance Targets:**
- Traditional generation: < 30 seconds
- Intelligent generation: < 60 seconds  
- LLM analysis: < 10 seconds
- Test execution: < 5 seconds per test suite

**User Experience:**
- Clear progress indicators for long operations
- Helpful error messages with recovery suggestions
- Interactive prompts for ambiguous inputs
- Success confirmation with next steps

**Production Readiness:**
- All security vulnerabilities addressed
- Performance under load tested
- Error scenarios handled gracefully
- Documentation complete and accurate

## Definition of Done
- [ ] All performance targets met consistently
- [ ] User experience tested with external users
- [ ] Security audit findings addressed
- [ ] Production deployment successful
- [ ] Monitoring and alerting configured

**Effort Estimate:** 20 hours
**Dependencies:** Issue #7 (Validation system), All previous issues
**Gate:** L3 - Production Readiness
EOF

    echo -e "${GREEN}✅ All 8 issues created successfully${NC}"
}

# Function to setup branch protection
setup_branch_protection() {
    echo -e "\n${YELLOW}🛡️  Setting up branch protection...${NC}"
    
    # Enable branch protection for main branch
    gh api repos/${REPO_OWNER}/${REPO_NAME}/branches/main/protection \
        --method PUT \
        --field required_status_checks='{"strict":true,"contexts":["build","test","security"]}' \
        --field enforce_admins=true \
        --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
        --field restrictions=null \
        --field required_linear_history=false \
        --field allow_force_pushes=false \
        --field allow_deletions=false || echo -e "${YELLOW}⚠️  Branch protection might already be set or require admin permissions${NC}"
    
    echo -e "${GREEN}✅ Branch protection configured${NC}"
}

# Main execution
main() {
    echo -e "\n${BLUE}Starting GitHub repository setup for ${REPO_OWNER}/${REPO_NAME}...${NC}"
    
    # Create labels
    create_labels
    
    # Create milestone
    create_milestone
    
    # Create project
    create_project
    
    # Create issues
    create_issues
    
    # Setup branch protection
    setup_branch_protection
    
    echo -e "\n${GREEN}🎉 GitHub repository setup completed successfully!${NC}"
    echo -e "\n${BLUE}Next steps:${NC}"
    echo -e "${YELLOW}1. Convert Project to Projects v2 in GitHub UI for better features${NC}"
    echo -e "${YELLOW}2. Assign team members to issues based on expertise${NC}"
    echo -e "${YELLOW}3. Start with Issue #1 (GitHub configuration) to establish foundation${NC}"
    echo -e "${YELLOW}4. Follow the dependency chain: #1→#2→#3→#4→#5→#6→#7→#8${NC}"
    echo -e "\n${BLUE}Repository ready for v1.0.0 development! 🚀${NC}"
}

# Execute main function
main