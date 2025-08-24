#!/bin/bash

# ================================================================
# BRIK INITIALIZER - UNIT TESTS
# Tests unitarios para el script principal init-brik-project.sh
# ================================================================

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
INIT_SCRIPT="$PROJECT_ROOT/init-brik-project.sh"
TEST_OUTPUT_DIR="/tmp/brik-tests-$(date +%s)"

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# ================================================================
# TEST UTILITIES
# ================================================================

test_start() {
    echo "🧪 TEST: $1"
    ((TOTAL_TESTS++))
}

test_pass() {
    echo "✅ PASS: $1"
    ((PASSED_TESTS++))
}

test_fail() {
    echo "❌ FAIL: $1"
    ((FAILED_TESTS++))
}

cleanup() {
    rm -rf "$TEST_OUTPUT_DIR"
}

# Cleanup on exit
trap cleanup EXIT

mkdir -p "$TEST_OUTPUT_DIR"

echo "🧬 BRIK INITIALIZER - UNIT TESTS"
echo "═══════════════════════════════════════════════════════════"
echo "📂 Test Output: $TEST_OUTPUT_DIR"
echo "⚡ Init Script: $INIT_SCRIPT"
echo "═══════════════════════════════════════════════════════════"

# ================================================================
# TEST 1: Script Existence and Permissions
# ================================================================

test_start "Script exists and is executable"

if [[ -x "$INIT_SCRIPT" ]]; then
    test_pass "init-brik-project.sh is executable"
else
    test_fail "init-brik-project.sh not found or not executable"
fi

# ================================================================
# TEST 2: Help Function
# ================================================================

test_start "Help function works"

if bash "$INIT_SCRIPT" --help | grep -q "BRIK Project Initializer"; then
    test_pass "Help function displays correctly"
else
    test_fail "Help function broken or missing"
fi

# ================================================================
# TEST 3: Traditional Mode - Rust
# ================================================================

test_start "Traditional mode - Rust project creation"

cd "$TEST_OUTPUT_DIR"
if bash "$INIT_SCRIPT" test-rust-project rust >/dev/null 2>&1; then
    if [[ -d "test-rust-project" ]] && [[ -f "test-rust-project/Cargo.toml" ]]; then
        test_pass "Rust project created successfully"
    else
        test_fail "Rust project structure incomplete"
    fi
else
    test_fail "Rust project creation failed"
fi

# ================================================================
# TEST 4: Traditional Mode - TypeScript
# ================================================================

test_start "Traditional mode - TypeScript project creation"

cd "$TEST_OUTPUT_DIR"
if bash "$INIT_SCRIPT" test-ts-project typescript >/dev/null 2>&1; then
    if [[ -d "test-ts-project" ]] && [[ -f "test-ts-project/package.json" ]]; then
        test_pass "TypeScript project created successfully"
    else
        test_fail "TypeScript project structure incomplete"
    fi
else
    test_fail "TypeScript project creation failed"
fi

# ================================================================
# TEST 5: BRIK Structure Validation
# ================================================================

test_start "BRIK structure validation"

PROJECT_TO_CHECK="$TEST_OUTPUT_DIR/test-rust-project"
BRIK_STRUCTURE_VALID=true

# Check core structure
REQUIRED_DIRS=(
    "src/core"
    "tests/unit"
    "tests/integration"
    "scripts"
    "docs"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [[ ! -d "$PROJECT_TO_CHECK/$dir" ]]; then
        BRIK_STRUCTURE_VALID=false
        break
    fi
done

# Check required files
REQUIRED_FILES=(
    "CIRCUITALIDAD.md"
    "scripts/brik-certify.sh"
    "scripts/test-coverage.sh"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [[ ! -f "$PROJECT_TO_CHECK/$file" ]]; then
        BRIK_STRUCTURE_VALID=false
        break
    fi
done

if $BRIK_STRUCTURE_VALID; then
    test_pass "BRIK structure is valid"
else
    test_fail "BRIK structure is incomplete"
fi

# ================================================================
# TEST 6: Smart Mode Error Handling
# ================================================================

test_start "Smart mode error handling (without API keys)"

cd "$TEST_OUTPUT_DIR"
# This should fail gracefully without API keys
if bash "$INIT_SCRIPT" test-smart-fail --smart --description "test project" --language rust 2>/dev/null; then
    test_fail "Smart mode should fail gracefully without API keys"
else
    test_pass "Smart mode fails gracefully without API keys"
fi

# ================================================================
# TEST 7: Documentation Generation
# ================================================================

test_start "Documentation generation"

PROJECT_TO_CHECK="$TEST_OUTPUT_DIR/test-rust-project"
DOCS_COMPLETE=true

REQUIRED_DOCS=(
    "docs/product/PRD.md"
    "docs/technical"
    "docs/operational"
    "docs/DOCUMENTATION_CHECKLIST.md"
)

for doc in "${REQUIRED_DOCS[@]}"; do
    if [[ ! -e "$PROJECT_TO_CHECK/$doc" ]]; then
        DOCS_COMPLETE=false
        break
    fi
done

if $DOCS_COMPLETE; then
    test_pass "Documentation generation complete"
else
    test_fail "Documentation generation incomplete"
fi

# ================================================================
# TEST 8: Script Permissions
# ================================================================

test_start "Generated script permissions"

PROJECT_TO_CHECK="$TEST_OUTPUT_DIR/test-rust-project"
SCRIPTS_EXECUTABLE=true

SCRIPT_FILES=(
    "scripts/brik-certify.sh"
    "scripts/test-coverage.sh"
)

for script in "${SCRIPT_FILES[@]}"; do
    if [[ ! -x "$PROJECT_TO_CHECK/$script" ]]; then
        SCRIPTS_EXECUTABLE=false
        break
    fi
done

if $SCRIPTS_EXECUTABLE; then
    test_pass "Generated scripts are executable"
else
    test_fail "Generated scripts not executable"
fi

# ================================================================
# TEST RESULTS
# ================================================================

echo ""
echo "📊 TEST RESULTS"
echo "═══════════════════════════════════════════════════════════"
echo "🧪 Total Tests: $TOTAL_TESTS"
echo "✅ Passed: $PASSED_TESTS"
echo "❌ Failed: $FAILED_TESTS"
echo "📈 Success Rate: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"

if [[ $FAILED_TESTS -eq 0 ]]; then
    echo "🏆 ALL TESTS PASSED ✅"
    exit 0
else
    echo "🚨 SOME TESTS FAILED ❌"
    exit 1
fi