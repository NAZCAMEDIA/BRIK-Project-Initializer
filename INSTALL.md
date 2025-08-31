# 🧬 BRIK Project Initializer - Instalación

## 🚀 Instalación Rápida (One-liner)

### Opción 1: Instalación Global (Recomendado)

```bash
curl -fsSL https://raw.githubusercontent.com/nazcamedia/brik-project-initializer/main/install.sh | bash
```

### Opción 2: Instalación con wget

```bash
wget -qO- https://raw.githubusercontent.com/nazcamedia/brik-project-initializer/main/install.sh | bash
```

### Opción 3: Instalación Manual

```bash
# Clonar repositorio
git clone https://github.com/nazcamedia/brik-project-initializer.git
cd brik-project-initializer

# Ejecutar instalador
chmod +x install.sh
./install.sh
```

### Opción 4: Instalación con npm (Global)

```bash
npm install -g brik-project-initializer
```

### Opción 5: Instalación Local (Sin sudo)

```bash
# Instalar en directorio de usuario
curl -fsSL https://raw.githubusercontent.com/nazcamedia/brik-project-initializer/main/install.sh | bash -s -- --user
```

## 📋 Después de la Instalación

Una vez instalado, tendrás disponibles los siguientes comandos:

```bash
# Comando principal - Usa tu suscripción Claude Pro/Max
brik

# Comando con SDK - Requiere API Key
brik-sdk

# Comando tradicional - Sin IA
brik-traditional
```

## 🎯 Uso Básico

### Crear un nuevo proyecto BRIK

```bash
brik new my-project
```

### Reestructurar proyecto existente

```bash
brik restructure ./existing-project
```

### Analizar proyecto

```bash
brik analyze ./my-project
```

### Ver ayuda

```bash
brik --help
```

## ⚙️ Configuración

### Primera vez - Configurar Claude Pro/Max

```bash
brik configure
```

Se abrirá un navegador para que inicies sesión con tu cuenta Claude Pro/Max.

### Configurar API Keys (opcional)

```bash
brik-sdk configure
```

## 🔧 Requisitos

- Node.js 18+
- npm o yarn
- Chrome/Chromium (para automatización web)

## 🗑️ Desinstalación

### Si instalaste globalmente

```bash
# Remover comando global
sudo rm /usr/local/bin/brik
sudo rm /usr/local/bin/brik-sdk
sudo rm /usr/local/bin/brik-traditional

# Remover archivos
sudo rm -rf /usr/local/lib/brik-initializer
```

### Si instalaste localmente

```bash
# Remover comandos
rm ~/.local/bin/brik
rm ~/.local/bin/brik-sdk
rm ~/.local/bin/brik-traditional

# Remover archivos
rm -rf ~/.brik
```

### Si instalaste con npm

```bash
npm uninstall -g brik-project-initializer
```

## 📚 Documentación Completa

Ver [README.md](README.md) para documentación detallada.

## 🆘 Soporte

- Issues: https://github.com/nazcamedia/brik-project-initializer/issues
- Email: support@nazcamedia.com

## 📄 Licencia

MIT - Ver [LICENSE](LICENSE)

---

**🧬 ¡Disfruta creando proyectos 100% BRIK!**