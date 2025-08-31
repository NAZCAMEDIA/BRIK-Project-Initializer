#!/bin/bash

# 🚀 BRIK Project Initializer - Script de Inicio Automático
# Detecta el entorno y lanza el CLI apropiado

set -euo pipefail

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Banner
show_banner() {
    clear
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                      ║"
    echo "║       🧬 BRIK PROJECT INITIALIZER - LAUNCHER v5.0 🚀                ║"
    echo "║                                                                      ║"
    echo "║          Sistema Inteligente de Gestión de Proyectos BRIK           ║"
    echo "║                                                                      ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

# Verificar Node.js
check_nodejs() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js no está instalado${NC}"
        echo -e "${YELLOW}📦 Por favor instala Node.js 18+ desde: https://nodejs.org${NC}"
        exit 1
    fi
    
    # Verificar versión
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js 18+ requerido (actual: v$NODE_VERSION)${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js v$NODE_VERSION detectado${NC}"
}

# Verificar dependencias
check_dependencies() {
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
        npm install --silent
        echo -e "${GREEN}✅ Dependencias instaladas${NC}"
    fi
}

# Detectar configuración de IA
check_ai_config() {
    CONFIG_FILE="$HOME/.brik-ai-config.json"
    
    if [ -f "$CONFIG_FILE" ]; then
        echo -e "${GREEN}✅ Configuración de IA detectada${NC}"
        
        # Verificar qué APIs están configuradas
        if grep -q "claude" "$CONFIG_FILE" 2>/dev/null; then
            echo -e "  ${CYAN}🤖 Claude configurado${NC}"
        fi
        if grep -q "gemini" "$CONFIG_FILE" 2>/dev/null; then
            echo -e "  ${CYAN}🌟 Gemini configurado${NC}"
        fi
        if grep -q "openai" "$CONFIG_FILE" 2>/dev/null; then
            echo -e "  ${CYAN}🧠 OpenAI configurado${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  No hay agentes IA configurados${NC}"
        echo -e "  ${WHITE}Puedes configurarlos desde el menú principal${NC}"
    fi
}

# Menú de selección
show_menu() {
    echo ""
    echo -e "${MAGENTA}📋 SELECCIONA EL MODO DE INICIO:${NC}"
    echo ""
    echo -e "  ${CYAN}1.${NC} 🤖 ${WHITE}CLI con Agentes IA${NC} (Claude, Gemini, GPT-4, Codex)"
    echo -e "  ${CYAN}2.${NC} 🚀 ${WHITE}CLI Tradicional${NC} (Sin IA, generación por templates)"
    echo -e "  ${CYAN}3.${NC} 🧠 ${WHITE}Modo Smart Legacy${NC} (Generadores inteligentes locales)"
    echo -e "  ${CYAN}4.${NC} ⚙️  ${WHITE}Configurar Agentes IA${NC}"
    echo -e "  ${CYAN}5.${NC} 📚 ${WHITE}Ver Documentación${NC}"
    echo -e "  ${CYAN}6.${NC} 🚪 ${WHITE}Salir${NC}"
    echo ""
}

# Lanzar CLI con IA
launch_ai_cli() {
    echo -e "${CYAN}🤖 Iniciando CLI con Agentes IA...${NC}"
    node brik-cli-ai.js
}

# Lanzar CLI tradicional
launch_traditional_cli() {
    echo -e "${CYAN}🚀 Iniciando CLI Tradicional...${NC}"
    node brik-cli.js
}

# Lanzar modo Smart Legacy
launch_smart_legacy() {
    echo -e "${CYAN}🧠 Modo Smart Legacy${NC}"
    echo ""
    echo "Uso: bash init-brik-project.sh <nombre> --smart \\"
    echo "       --description \"descripción\" \\"
    echo "       --integrations \"postgresql,redis\" \\"
    echo "       --language rust"
    echo ""
    read -p "Presiona Enter para volver al menú..."
}

# Configurar IA
configure_ai() {
    echo -e "${CYAN}⚙️  Configuración de Agentes IA${NC}"
    node -e "
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const configPath = path.join(process.env.HOME, '.brik-ai-config.json');
let config = {};

if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

console.log('\\n🔑 Configuración Rápida de API Keys\\n');

rl.question('API Key de Claude (Anthropic) [Enter para saltar]: ', (claude) => {
    if (claude) {
        config.providers = config.providers || {};
        config.providers.claude = { apiKey: claude, model: 'claude-3-opus-20240229' };
    }
    
    rl.question('API Key de Gemini (Google) [Enter para saltar]: ', (gemini) => {
        if (gemini) {
            config.providers = config.providers || {};
            config.providers.gemini = { apiKey: gemini, model: 'gemini-1.5-pro' };
        }
        
        rl.question('API Key de OpenAI (GPT-4/Codex) [Enter para saltar]: ', (openai) => {
            if (openai) {
                config.providers = config.providers || {};
                config.providers.openai = { apiKey: openai, model: 'gpt-4-turbo-preview' };
                config.providers.codex = { apiKey: openai, model: 'code-davinci-002' };
            }
            
            if (Object.keys(config.providers || {}).length > 0) {
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                console.log('\\n✅ Configuración guardada exitosamente');
            } else {
                console.log('\\n⚠️  No se configuró ninguna API');
            }
            
            rl.close();
            process.exit(0);
        });
    });
});
"
}

# Ver documentación
show_docs() {
    echo -e "${CYAN}📚 DOCUMENTACIÓN RÁPIDA${NC}"
    echo ""
    echo -e "${MAGENTA}MODOS DISPONIBLES:${NC}"
    echo ""
    echo "1. ${WHITE}CLI con IA:${NC} Usa Claude, Gemini o GPT-4 para generar proyectos completos"
    echo "   - Genera código funcional automáticamente"
    echo "   - Tests con 100% cobertura incluidos"
    echo "   - Requiere API Keys de los proveedores"
    echo ""
    echo "2. ${WHITE}CLI Tradicional:${NC} Generación basada en templates predefinidos"
    echo "   - No requiere conexión a internet"
    echo "   - Templates para Rust, TypeScript, Python, Go"
    echo "   - Estructura BRIK garantizada"
    echo ""
    echo "3. ${WHITE}Smart Legacy:${NC} Usa generadores locales con mock LLM"
    echo "   - Para testing sin API Keys"
    echo "   - Funcionalidad limitada"
    echo ""
    echo -e "${MAGENTA}FILOSOFÍA BRIK:${NC}"
    echo "• CORE: Lógica inmutable"
    echo "• WRAPPERS: Adaptadores evolutivos"
    echo "• LIVING LAYER: Consciencia del sistema"
    echo "• 100% Cobertura obligatoria"
    echo ""
    read -p "Presiona Enter para volver al menú..."
}

# Main
main() {
    show_banner
    
    # Verificaciones iniciales
    echo -e "${CYAN}🔍 Verificando entorno...${NC}"
    echo ""
    
    check_nodejs
    check_dependencies
    check_ai_config
    
    # Loop del menú
    while true; do
        show_menu
        
        read -p "👉 Selecciona una opción (1-6): " choice
        
        case $choice in
            1)
                launch_ai_cli
                break
                ;;
            2)
                launch_traditional_cli
                break
                ;;
            3)
                launch_smart_legacy
                ;;
            4)
                configure_ai
                ;;
            5)
                show_docs
                ;;
            6)
                echo -e "${GREEN}👋 ¡Hasta luego! Que tus proyectos sean 100% BRIK${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Opción inválida${NC}"
                sleep 1
                ;;
        esac
    done
}

# Capturar Ctrl+C
trap 'echo -e "\n${GREEN}👋 ¡Hasta luego!${NC}"; exit 0' INT

# Ejecutar
main