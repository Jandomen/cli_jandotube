#!/usr/bin/env node

const { execSync } = require('child_process');

const BANNER = `
 ╔═══════════════════════════════════════════════════════════╗
 ║   ██████╗ ███████╗████████╗██████╗  ██████╗                ║
 ║   ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗               ║
 ║   ██████╔╝█████╗     ██║   ██████╔╝██║   ██║               ║
 ║   ██╔══██╗██╔══╝     ██║   ██╔══██╗██║   ██║               ║
 ║   ██║  ██║███████╗   ██║   ██║  ██║╚██████╔╝               ║
 ║   ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝                ║
 ║                      ███████╗ ██████╗ ██████╗               ║
 ║                      ██╔════╝██╔═══██╗██╔══██╗              ║
 ║                      █████╗  ██║   ██║██████╔╝              ║
 ║                      ██╔══╝  ██║   ██║██╔══██╗              ║
 ║                      ███████╗╚██████╔╝██║  ██║              ║
 ║                      ╚══════╝ ╚═════╝ ╚═╝  ╚═╝              ║
 ╠═══════════════════════════════════════════════════════════╣
 ║  🎬 JANDOTUBE CLI - by Jandosoft                            ║
 ╚═══════════════════════════════════════════════════════════╝
`;

function getOS() {
  const platform = process.platform;
  if (platform === 'darwin') return 'macos';
  if (platform === 'linux') return 'linux';
  if (platform === 'win32') return 'windows';
  return 'unknown';
}

function checkCommand(commands) {
  const cmdList = Array.isArray(commands) ? commands : [commands];
  for (const cmd of cmdList) {
    try {
      execSync(cmd, { stdio: 'ignore' });
      return true;
    } catch (e) {
      continue;
    }
  }
  return false;
}

function runCommand(command, description) {
  console.log(`\n 📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(` ✅ ${description} completado`);
    return true;
  } catch (e) {
    console.log(` ⚠️  Error en ${description}`);
    return false;
  }
}

async function setup() {
  console.clear();
  console.log(BANNER);
  
  const os = getOS();
  console.log(` 📌 Sistema detectado: ${os.toUpperCase()}\n`);
  
  console.log(' 🔍 Verificando Node.js...');
  try {
    const version = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(` ✅ Node.js ${version} instalado`);
  } catch (e) {
    console.log(' ❌ Node.js no encontrado');
    console.log('\n 💡 Instala Node.js desde: https://nodejs.org/');
    process.exit(1);
  }
  
  console.log('\n 📦 Instalando dependencias npm...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log(' ✅ Dependencias npm instaladas');
  } catch (e) {
    console.log(' ❌ Error al instalar dependencias npm');
    process.exit(1);
  }
  
  console.log('\n 🔍 Verificando yt-dlp...');
  if (checkCommand('yt-dlp --version')) {
    console.log(' ✅ yt-dlp ya está instalado');
  } else {
    console.log(' ❌ yt-dlp no encontrado');
    console.log('\n 📥 Instalando yt-dlp...');
    
    if (os === 'macos') {
      if (checkCommand('brew --version')) {
        runCommand('brew install yt-dlp', 'Instalando yt-dlp (Homebrew)');
      } else {
        console.log(' ⚠️  Homebrew no encontrado, intentando con pip...');
        runCommand('pip3 install yt-dlp', 'Instalando yt-dlp (pip3)');
        runCommand('pip install yt-dlp', 'Instalando yt-dlp (pip)');
      }
    } 
    else if (os === 'linux') {
      const installers = [
        { cmd: 'sudo apt-get install -y yt-dlp', desc: 'Instalando yt-dlp (apt-get)' },
        { cmd: 'sudo apt install -y yt-dlp', desc: 'Instalando yt-dlp (apt)' },
        { cmd: 'sudo dnf install -y yt-dlp', desc: 'Instalando yt-dlp (dnf)' },
        { cmd: 'sudo yum install -y yt-dlp', desc: 'Instalando yt-dlp (yum)' },
        { cmd: 'pip3 install yt-dlp', desc: 'Instalando yt-dlp (pip3)' },
        { cmd: 'pip install yt-dlp', desc: 'Instalando yt-dlp (pip)' },
      ];
      
      let installed = false;
      for (const inst of installers) {
        if (runCommand(inst.cmd, inst.desc)) {
          installed = true;
          break;
        }
      }
      
      if (!installed) {
        console.log(' ⚠️  No se pudo instalar yt-dlp automáticamente');
        console.log('    Instala manualmente: https://github.com/yt-dlp/yt-dlp#installation');
      }
    } 
    else if (os === 'windows') {
      const installers = [
        { cmd: 'choco install yt-dlp -y', desc: 'Instalando yt-dlp (Chocolatey)' },
        { cmd: 'winget install yt-dlp', desc: 'Instalando yt-dlp (winget)' },
        { cmd: 'pip install yt-dlp', desc: 'Instalando yt-dlp (pip)' },
        { cmd: 'pip3 install yt-dlp', desc: 'Instalando yt-dlp (pip3)' },
      ];
      
      let installed = false;
      for (const inst of installers) {
        if (runCommand(inst.cmd, inst.desc)) {
          installed = true;
          break;
        }
      }
      
      if (!installed) {
        console.log(' ⚠️  No se pudo instalar yt-dlp automáticamente');
        console.log('    Descarga desde: https://github.com/yt-dlp/yt-dlp/releases');
      }
    }
  }
  
  console.log('\n 🔗 Configurando comando global...');
  try {
    execSync('npm link', { stdio: 'inherit' });
    console.log(' ✅ Comando "jandotube" configurado');
  } catch (e) {
    console.log(' ⚠️  Necesitas permisos de admin. Ejecuta: sudo npm link');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(' 🎉 ¡INSTALACIÓN COMPLETA!');
  console.log('='.repeat(60));
  console.log('\n 📋 Comandos disponibles:');
  console.log('   jandotube           # Menú interactivo');
  console.log('   jandotube <url>    # Descargar video');
  console.log('   jandotube -a       # Descargar audio');
  console.log('   jandotube -i       # Ver información');
  console.log('   jandotube --update # Actualizar');
  console.log('');
}

setup();
