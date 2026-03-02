#!/bin/bash

set -e

echo ""
echo " ╔═══════════════════════════════════════════════════════════╗"
echo " ║                                                           ║"
echo " ║                 🎬  JANDOTUBE                             ║"
echo " ║                 INSTALADOR                                ║"
echo " ║                                                           ║"
echo " ╠═══════════════════════════════════════════════════════════╣"
echo " ║                       by Jandosoft                        ║"
echo " ╚═══════════════════════════════════════════════════════════╝"
echo ""

# Detectar SO
OS=$(uname -s)

echo " 📌 Detectando sistema: $OS"
echo ""

# Buscar Python
echo " 🔍 Buscando Python..."
PYTHON_PATH=""

if command -v python3.12 &> /dev/null; then
    PYTHON_PATH=$(which python3.12)
elif command -v python3.11 &> /dev/null; then
    PYTHON_PATH=$(which python3.11)
elif command -v python3.10 &> /dev/null; then
    PYTHON_PATH=$(which python3.10)
elif command -v python3 &> /dev/null; then
    PYTHON_PATH=$(which python3)
fi

if [ -z "$PYTHON_PATH" ]; then
    echo " ❌ Python no encontrado. Instálalo primero:"
    if [ "$OS" = "Darwin" ]; then
        echo "    brew install python3.12"
    elif [ "$OS" = "Linux" ]; then
        echo "    sudo apt install python3.12 python3-pip"
    fi
    exit 1
fi

PYTHON_VERSION=$($PYTHON_PATH --version 2>&1)
echo " ✅ Python encontrado: $PYTHON_VERSION"

# Verificar que sea Python 3.10+
VERSION_NUM=$($PYTHON_PATH -c "import sys; print(sys.version_info.minor)")
if [ "$VERSION_NUM" -lt 10 ]; then
    echo " ⚠️  Advertencia: Se recomienda Python 3.10+"
fi

# Buscar Node.js
echo ""
echo " 🔍 Buscando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo " ✅ Node.js encontrado: $NODE_VERSION"
else
    echo " ⚠️  Node.js no encontrado. La descarga podría fallar."
    echo "    Instálalo con: brew install node (macOS) o apt install nodejs (Linux)"
fi

# Buscar FFmpeg
echo ""
echo " 🔍 Buscando FFmpeg..."
if command -v ffmpeg &> /dev/null; then
    echo " ✅ FFmpeg encontrado"
else
    echo " ⚠️  FFmpeg no encontrado. La conversión a MP3 no funcionará."
    echo "    Instálalo con: brew install ffmpeg (macOS) o apt install ffmpeg (Linux)"
fi

# Instalar dependencias de Python
echo ""
echo " 📦 Instalando dependencias de Python (yt-dlp, inquirer)..."
$PYTHON_PATH -m pip install --user --break-system-packages yt-dlp inquirer 2>/dev/null || \
$PYTHON_PATH -m pip install --user yt-dlp inquirer 2>/dev/null || \
$PYTHON_PATH -m pip install yt-dlp inquirer

echo " ✅ Dependencias instaladas"

# Obtener ruta del script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JANDOTUBE_PATH="$SCRIPT_DIR/jandotube"

# Verificar que jandotube existe
if [ ! -f "$JANDOTUBE_PATH" ]; then
    echo " ❌ No se encontró jandotube en $SCRIPT_DIR"
    echo "    Clona el repositorio primero:"
    echo "    git clone https://github.com/Jandomen/cli_jandotube.git"
    exit 1
fi

# Crear enlace simbólico
echo ""
echo " 🔗 Creando enlace simbólico..."
if [ "$OS" = "Darwin" ]; then
    # Intentar con /usr/local/bin
    if [ -w "/usr/local/bin" ]; then
        sudo ln -sf "$JANDOTUBE_PATH" /usr/local/bin/jandotube
        echo " ✅ Instalado en /usr/local/bin/jandotube"
    else
        # Agregar al PATH en .zshrc
        echo 'export PATH="'$SCRIPT_DIR':$PATH"' >> ~/.zshrc
        echo " ✅ Agregado al PATH en ~/.zshrc"
        echo "    Ejecuta: source ~/.zshrc"
    fi
elif [ "$OS" = "Linux" ]; then
    if [ -w "/usr/local/bin" ]; then
        sudo ln -sf "$JANDOTUBE_PATH" /usr/local/bin/jandotube
        echo " ✅ Instalado en /usr/local/bin/jandotube"
    else
        echo 'export PATH="'$SCRIPT_DIR':$PATH"' >> ~/.bashrc
        echo " ✅ Agregado al PATH en ~/.bashrc"
        echo "    Ejecuta: source ~/.bashrc"
    fi
fi

# Verificar instalación
echo ""
echo " 🧪 Verificando instalación..."
if command -v jandotube &> /dev/null; then
    echo " ✅ ¡JANDOTUBE instalado correctamente!"
else
    echo " ⚠️  Para usar jandotube, ejecuta desde la carpeta: python3 jandotube"
fi

echo ""
echo " ╔═══════════════════════════════════════════════════════════╗"
echo " ║                     ¡INSTALACIÓN COMPLETA!               ║"
echo " ╠═══════════════════════════════════════════════════════════╣"
echo " ║  Uso: jandotube                                          ║"
echo " ║  Actualizar: jandotube --update                          ║"
echo " ║  Ayuda: jandotube --help                                 ║"
echo " ╚═══════════════════════════════════════════════════════════╝"
echo ""
