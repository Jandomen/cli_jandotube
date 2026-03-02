@echo off
setlocal enabledelayedexpansion

echo.
echo  ╔═══════════════════════════════════════════════════════════╗
echo  ║                                                           ║
echo  ║                 🎬  JANDOTUBE                             ║
echo  ║                 INSTALADOR                                ║
echo  ║                                                           ║
echo  ╠═══════════════════════════════════════════════════════════╣
echo  ║                       by Jandosoft                        ║
echo  ╚═══════════════════════════════════════════════════════════╝
echo.

echo  📌 Detectando sistema: Windows
echo.

:: Buscar Python
echo  🔍 Buscando Python...
set PYTHON=

where python >nul 2>nul
if %errorlevel% equ 0 (
    set PYTHON=python
    goto :python_found
)

where python3 >nul 2>nul
if %errorlevel% equ 0 (
    set PYTHON=python3
    goto :python_found
)

:: Buscar en rutas comunes
if exist "C:\Python312\python.exe" set PYTHON=C:\Python312\python.exe
if exist "C:\Python311\python.exe" set PYTHON=C:\Python311\python.exe
if exist "C:\Python310\python.exe" set PYTHON=C:\Python310\python.exe
if defined PYTHON goto :python_found

echo  ❌ Python no encontrado.
echo.
echo  💡 Instala Python desde: https://www.python.org/downloads/
echo     Asegurate de marcar "Add Python to PATH"
echo.
pause
exit /b 1

:python_found
%PYTHON% --version >nul 2>nul
echo  ✅ Python encontrado: %PYTHON%

:: Buscar Node.js
echo.
echo  🔍 Buscando Node.js...
where node >nul 2>nul
if %errorlevel% equ 0 (
    node --version >nul 2>nul
    echo  ✅ Node.js encontrado
) else (
    echo  ⚠️  Node.js no encontrado. La descarga podria fallar.
    echo     Instala Node.js desde: https://nodejs.org/
)

:: Buscar FFmpeg
echo.
echo  🔍 Buscando FFmpeg...
where ffmpeg >nul 2>nul
if %errorlevel% equ 0 (
    echo  ✅ FFmpeg encontrado
) else (
    echo  ⚠️  FFmpeg no encontrado. La conversion a MP3 no funcionara.
    echo     Instala FFmpeg desde: https://ffmpeg.org/download.html
)

:: Instalar dependencias
echo.
echo  📦 Instalando dependencias de Python...
%PYTHON% -m pip install yt-dlp inquirer --user >nul 2>nul
echo  ✅ Dependencias instaladas

:: Obtener ruta del script
set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"
set "JANDOTUBE_PATH=%SCRIPT_DIR%\jandotube"

:: Crear enlace simbólico o copiar
echo.
echo  🔧 Instalando jandotube...

:: Agregar al PATH del usuario
setx PATH "%PATH%;%SCRIPT_DIR%" >nul 2>nul

:: Verificar instalacion
where jandotube >nul 2>nul
if %errorlevel% equ 0 (
    echo  ✅ ¡JANDOTUBE instalado correctamente!
) else (
    echo  ✅ Para usar jandotube, ejecuta desde la carpeta:
    echo     python jandotube
)

echo.
echo  ╔═══════════════════════════════════════════════════════════╗
echo  ║                     ¡INSTALACION COMPLETA!               ║
echo  ╠═══════════════════════════════════════════════════════════╣
echo  ║  Uso: jandotube                                          ║
echo  ║  Actualizar: jandotube --update                          ║
echo  ║  Ayuda: jandotube --help                                 ║
echo  ╚═══════════════════════════════════════════════════════════╝
echo.
echo  ⚠️  CIERRA Y ABRE UNA NUEVA TERMINAL para que funcione jandotube
echo.
pause
