# 🎬 JANDOTUBE CLI

> Descarga videos, audio e información de YouTube desde la terminal.

**By Jandosoft** | *Digital Innovation Hub*

---

## 🚀 Instalación Rápida

### En macOS / Linux:
```bash
git clone https://github.com/Jandomen/cli_jandotube.git
cd cli_jandotube
chmod +x install.sh && ./install.sh
```

### En Windows:
```cmd
git clone https://github.com/Jandomen/cli_jandotube.git
cd cli_jandotube
install.bat
```

O si prefieres (Git Bash / WSL):
```bash
curl -fsSL https://raw.githubusercontent.com/Jandomen/cli_jandotube/main/install.sh | bash
```

---

## 📋 Requisitos

- **Python 3.10+** (Python 3.12 recomendado)
- **Node.js** (para extraer videos de YouTube)
- **FFmpeg** (opcional, para convertir audio a MP3)

### Instalar requisitos en macOS:

```bash
brew install python3.12 node ffmpeg
```

### Instalar requisitos en Linux (Ubuntu/Debian):

```bash
sudo apt install python3.12 python3-pip nodejs ffmpeg
```

### Instalar requisitos en Windows:

1. Descarga Python desde: https://www.python.org/downloads/
2. Descarga Node.js desde: https://nodejs.org/
3. Descarga FFmpeg desde: https://ffmpeg.org/download.html

**Importante:** Al instalar Python, marca "Add Python to PATH"

---

## 🎯 Uso

### Menú interactivo:
```bash
jandotube
```

### Descargar video directamente:
```bash
jandotube "URL_DEL_VIDEO" -v
```

### Descargar audio (MP3):
```bash
jandotube "URL_DEL_VIDEO" -a
```

### Ver información del video:
```bash
jandotube "URL_DEL_VIDEO" -i
```

### Actualizar jandotube/yt-dlp:
```bash
jandotube --update
```

### Ver ayuda:
```bash
jandotube --help
```

---

## 📖 Ejemplos

```bash
# Menú interactivo (te pregunta qué hacer)
jandotube

# Descargar video
jandotube "https://www.youtube.com/watch?v=dQw4w9WgXcQ" -v

# Descargar audio
jandotube "https://www.youtube.com/watch?v=dQw4w9WgXcQ" -a

# Ver información
jandotube "https://www.youtube.com/watch?v=dQw4w9WgXcQ" -i

# Descargar playlist (selecciona qué video)
jandotube "https://www.youtube.com/playlist?list=PL..."
```

---

## 🔧 Solución de Problemas

### Error 403 - YouTube bloqueó la descarga
- Ejecuta: `jandotube --update`
- Espera unos minutos e intenta de nuevo
- Usa una VPN si el problema persiste

### Error "No supported JavaScript runtime"
- Instala Node.js: `brew install node` (macOS) o `apt install nodejs` (Linux)

### Error de formato de video
- Asegúrate de tener Python 3.10+ instalado
- Actualiza: `jandotube --update`

---

## 📂 Estructura

```
jandotube/
├── jandotube          # Script principal
├── install.sh         # Script de instalación
├── README.md          # Este archivo
└── Descarga/          # Carpeta de descargas
```

---

## 📄 Licencia

© 2026 **Jandosoft** • *Digital Innovation Hub*
