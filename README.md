# 🎬 JANDOTUBE CLI

> Descarga videos, audio e información de YouTube desde la terminal.

**By Jandosoft** | *Digital Innovation Hub*

---

## 🚀 Instalación Rápida

```bash
git clone https://github.com/Jandomen/cli_jandotube.git
cd cli_jandotube
npm run setup
```

¡Listo! 🎉

---

## 📋 Requisitos

- **Node.js 18+** (se detecta automáticamente)
- **yt-dlp** (se instala automáticamente según tu SO)

### Instalación manual de requisitos:

**macOS:**
```bash
brew install node
```

**Windows:**
```bash
choco install nodejs
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install nodejs npm
```

---

## 🎯 Uso

```bash
jandotube              # Menú interactivo
jandotube <url>        # Descargar video
jandotube <url> -a    # Descargar audio (MP3)
jandotube <url> -i    # Ver información del video
jandotube --update    # Actualizar yt-dlp
jandotube --version   # Ver versión
```

---

## 📁 Estructura

```
jandotube/
├── bin/
│   └── jandotube       # Entry point
├── index.js            # Código principal
├── setup.js           # Instalador automático
├── package.json       # Configuración npm
└── README.md
```

---

## 🐛 Solución de Problemas

### Error: "yt-dlp not found"
```bash
npm run setup
```

### Necesitas actualizar yt-dlp:
```bash
jandotube --update
```

---

© 2026 **Jandosoft** • *Digital Innovation Hub*
