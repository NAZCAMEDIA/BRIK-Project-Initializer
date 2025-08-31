#!/bin/bash

# 🧬 BRIK Project Initializer - Installation Script
# Instala el sistema BRIK como comando global en el terminal

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Banner
show_banner() {
    clear
    echo -e "${CYAN}${BOLD}"
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                      ║"
    echo "║          🧬 BRIK PROJECT INITIALIZER - INSTALLER 🚀                 ║"
    echo "║                                                                      ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

# Función de logging
log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar requisitos
check_requirements() {
    log_info "Verificando requisitos del sistema..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js no está instalado"
        echo -e "${YELLOW}Instala Node.js 18+ desde: https://nodejs.org${NC}"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js 18+ requerido (actual: v$NODE_VERSION)"
        exit 1
    fi
    log_success "Node.js v$NODE_VERSION detectado"
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        log_error "npm no está instalado"
        exit 1
    fi
    log_success "npm detectado"
    
    # Verificar git
    if ! command -v git &> /dev/null; then
        log_warning "Git no está instalado (recomendado)"
    else
        log_success "Git detectado"
    fi
}

# Seleccionar directorio de instalación
select_install_dir() {
    echo ""
    echo -e "${MAGENTA}${BOLD}📂 Selecciona el directorio de instalación:${NC}"
    echo ""
    echo "  1. /usr/local/lib (Recomendado - requiere sudo)"
    echo "  2. $HOME/.brik (Usuario actual)"
    echo "  3. $HOME/.local/lib (Usuario local)"
    echo "  4. Directorio personalizado"
    echo ""
    
    read -p "Selecciona (1-4): " choice
    
    case $choice in
        1)
            INSTALL_DIR="/usr/local/lib/brik-initializer"
            NEEDS_SUDO=true
            ;;
        2)
            INSTALL_DIR="$HOME/.brik"
            NEEDS_SUDO=false
            ;;
        3)
            INSTALL_DIR="$HOME/.local/lib/brik-initializer"
            NEEDS_SUDO=false
            ;;
        4)
            read -p "Ingresa el directorio: " INSTALL_DIR
            NEEDS_SUDO=false
            ;;
        *)
            INSTALL_DIR="$HOME/.brik"
            NEEDS_SUDO=false
            ;;
    esac
    
    log_info "Directorio seleccionado: $INSTALL_DIR"
}

# Clonar o copiar archivos
install_files() {
    log_info "Instalando archivos BRIK..."
    
    # Si estamos en el directorio del proyecto, copiar
    if [ -f "package.json" ] && [ -f "brik-cli-subscription.js" ]; then
        log_info "Copiando desde directorio actual..."
        
        if [ "$NEEDS_SUDO" = true ]; then
            sudo mkdir -p "$INSTALL_DIR"
            sudo cp -r . "$INSTALL_DIR/"
        else
            mkdir -p "$INSTALL_DIR"
            cp -r . "$INSTALL_DIR/"
        fi
    else
        # Clonar desde GitHub
        log_info "Clonando desde GitHub..."
        
        if [ "$NEEDS_SUDO" = true ]; then
            sudo git clone https://github.com/nazcamedia/brik-project-initializer.git "$INSTALL_DIR"
        else
            git clone https://github.com/nazcamedia/brik-project-initializer.git "$INSTALL_DIR"
        fi
    fi
    
    log_success "Archivos instalados"
}

# Instalar dependencias
install_dependencies() {
    log_info "Instalando dependencias npm..."
    
    cd "$INSTALL_DIR"
    
    if [ "$NEEDS_SUDO" = true ]; then
        sudo npm install --production
    else
        npm install --production
    fi
    
    log_success "Dependencias instaladas"
    
    # Instalar Playwright browsers
    log_info "Instalando navegadores para Playwright..."
    
    if [ "$NEEDS_SUDO" = true ]; then
        sudo npx playwright install chromium
    else
        npx playwright install chromium
    fi
    
    log_success "Navegadores instalados"
}

# Crear enlaces simbólicos
create_symlinks() {
    log_info "Creando comandos globales..."
    
    # Determinar directorio de binarios
    if [ "$NEEDS_SUDO" = true ]; then
        BIN_DIR="/usr/local/bin"
    else
        BIN_DIR="$HOME/.local/bin"
        mkdir -p "$BIN_DIR"
        
        # Agregar al PATH si no está
        if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
            echo "" >> "$HOME/.bashrc"
            echo "# BRIK CLI" >> "$HOME/.bashrc"
            echo "export PATH=\"\$PATH:$BIN_DIR\"" >> "$HOME/.bashrc"
            
            if [ -f "$HOME/.zshrc" ]; then
                echo "" >> "$HOME/.zshrc"
                echo "# BRIK CLI" >> "$HOME/.zshrc"
                echo "export PATH=\"\$PATH:$BIN_DIR\"" >> "$HOME/.zshrc"
            fi
            
            log_warning "PATH actualizado. Ejecuta 'source ~/.bashrc' o reinicia el terminal"
        fi
    fi
    
    # Crear enlaces simbólicos
    if [ "$NEEDS_SUDO" = true ]; then
        # Comando principal: brik
        sudo ln -sf "$INSTALL_DIR/brik-cli-subscription.js" "$BIN_DIR/brik"
        sudo chmod +x "$BIN_DIR/brik"
        
        # Comandos adicionales
        sudo ln -sf "$INSTALL_DIR/brik-cli-sdk.js" "$BIN_DIR/brik-sdk"
        sudo chmod +x "$BIN_DIR/brik-sdk"
        
        sudo ln -sf "$INSTALL_DIR/brik-cli.js" "$BIN_DIR/brik-traditional"
        sudo chmod +x "$BIN_DIR/brik-traditional"
    else
        # Comando principal: brik
        ln -sf "$INSTALL_DIR/brik-cli-subscription.js" "$BIN_DIR/brik"
        chmod +x "$BIN_DIR/brik"
        
        # Comandos adicionales
        ln -sf "$INSTALL_DIR/brik-cli-sdk.js" "$BIN_DIR/brik-sdk"
        chmod +x "$BIN_DIR/brik-sdk"
        
        ln -sf "$INSTALL_DIR/brik-cli.js" "$BIN_DIR/brik-traditional"
        chmod +x "$BIN_DIR/brik-traditional"
    fi
    
    log_success "Comandos globales creados"
}

# Configuración inicial
initial_setup() {
    echo ""
    echo -e "${MAGENTA}${BOLD}⚙️  Configuración inicial (opcional)${NC}"
    echo ""
    
    read -p "¿Deseas configurar tu cuenta Claude ahora? (s/n): " configure
    
    if [[ "$configure" == "s" || "$configure" == "S" ]]; then
        echo ""
        echo -e "${CYAN}Se abrirá el navegador para que inicies sesión con tu cuenta Claude Pro/Max${NC}"
        echo -e "${YELLOW}Presiona Enter cuando estés listo...${NC}"
        read
        
        # Ejecutar brik para configuración inicial
        "$BIN_DIR/brik"
    fi
}

# Mostrar información de finalización
show_completion() {
    echo ""
    echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}${BOLD}║                                                                      ║${NC}"
    echo -e "${GREEN}${BOLD}║               🎉 INSTALACIÓN COMPLETADA EXITOSAMENTE 🎉              ║${NC}"
    echo -e "${GREEN}${BOLD}║                                                                      ║${NC}"
    echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo -e "${CYAN}${BOLD}📋 Comandos disponibles:${NC}"
    echo ""
    echo -e "  ${GREEN}brik${NC}              - CLI principal (usa tu suscripción Claude Pro/Max)"
    echo -e "  ${GREEN}brik-sdk${NC}          - CLI con SDK oficial (requiere API Key)"
    echo -e "  ${GREEN}brik-traditional${NC}  - CLI tradicional sin IA"
    echo ""
    
    echo -e "${CYAN}${BOLD}🚀 Para comenzar:${NC}"
    echo ""
    echo -e "  ${YELLOW}brik${NC}              # Inicia el CLI principal"
    echo -e "  ${YELLOW}brik --help${NC}       # Ver ayuda"
    echo -e "  ${YELLOW}brik new project${NC}  # Crear nuevo proyecto"
    echo ""
    
    if [ "$NEEDS_SUDO" = false ]; then
        echo -e "${YELLOW}${BOLD}⚠️  Importante:${NC}"
        echo -e "  Ejecuta ${GREEN}source ~/.bashrc${NC} o reinicia el terminal"
        echo -e "  para que los comandos estén disponibles"
        echo ""
    fi
    
    echo -e "${MAGENTA}${BOLD}🧬 ¡Que tus proyectos sean 100% BRIK!${NC}"
    echo ""
}

# Main
main() {
    show_banner
    check_requirements
    select_install_dir
    install_files
    install_dependencies
    create_symlinks
    initial_setup
    show_completion
}

# Ejecutar
main