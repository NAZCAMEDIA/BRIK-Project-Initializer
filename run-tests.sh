#!/bin/bash

echo "🧪 BRIK MOCK LLM - TESTING SUITE EXECUTION"
echo "=========================================="

cd /Users/nazcamedia/Documents/GitHub/BRIK-Project-Initializer

echo ""
echo "📋 Test 1: Domain Parser Direct Test"
echo "------------------------------------"
node generators/intelligent/mock-llm.js test-parser "API simple de to-do list con tareas que se pueden crear, marcar como completadas y eliminar"

echo ""
echo "🤖 Test 2: Mock LLM TODO Response"
echo "--------------------------------"
node generators/intelligent/mock-llm.js domain-analysis "API simple de to-do list con tareas" "postgresql"

echo ""
echo "📝 Test 3: Mock LLM Blog Response"
echo "--------------------------------"
node generators/intelligent/mock-llm.js domain-analysis "blog con posts y comentarios" "postgresql,redis"

echo ""
echo "🛒 Test 4: Mock LLM E-commerce Response"
echo "--------------------------------------"
node generators/intelligent/mock-llm.js domain-analysis "tienda online con productos y órdenes" "postgresql,stripe"

echo ""
echo "🧪 Test 5: Full Test Suite"
echo "-------------------------"
node test-mock-llm.js

echo ""
echo "✅ TESTING COMPLETED"
echo "===================="