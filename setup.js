#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

const BANNER = `
 JJJJJJJJ  AAAAAAAA  NNNNNNNN  DDDDDDDD  OOOOOO  TTTTTTTT  UUUUUUUU  BBBBBBBBB  EEEE
    JJ     AA        NN        DD       OO       TT       UU        BB       EE
   JJ      AAAA     NNNN     DDDD     OOOO     TTTT     UUUU      BBBB     EEEE
J  JJ    AA  AA   NN  NN   DD  DD   OO  OO   TT  TT   UU  UU    BB  BB   EE  EE
 JJJJ    AAAAAAAA  NNNNNN  DDDDDD  OOOOOO  TTTTT   UUUU    BBBB    EEEE
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

function checkNpmDeps() {
  try {
    require('inquirer');
    require('chalk');
    return true;
  } catch (e) {
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
  
  if (!checkNpmDeps()) {
    console.log(' ⚠️  Dependencias faltantes, eliminando node_modules...');
    try {
      if (fs.existsSync('node_modules')) {
        execSync('rmdir /s /q node_modules', { stdio: 'inherit', shell: true });
      }
    } catch (e) {
      try {
        execSync('rm -rf node_modules', { stdio: 'inherit' });
      } catch (e2) {}
    }
  }
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log(' ✅ Dependencias npm instaladas');
  } catch (e) {
    console.log(' ❌ Error al instalar dependencias npm');
    console.log(' 💡 Intenta: npm install --force');
    process.exit(1);
  }
  
  console.log('\n 🔍 Verificando yt-dlp...');
  if (checkCommand('yt-dlp --version')) {
    console.log(' ✅ yt-dlp ya está instalado');
  } else {
    console.log(' ❌ yt-dlp no encontrado');
    console.log('\n 📥 Instalando yt-dlp...');
    
    if (os === 'windows') {
      const installers = [
        { cmd: 'pip install yt-dlp', desc: 'Instalando yt-dlp (pip)' },
        { cmd: 'pip3 install yt-dlp', desc: 'Instalando yt-dlp (pip3)' },
        { cmd: 'python -m pip install yt-dlp', desc: 'Instalando yt-dlp (python -m pip)' },
        { cmd: 'choco install yt-dlp -y', desc: 'Instalando yt-dlp (Chocolatey)' },
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
        console.log('    Instala manualmente: pip install yt-dlp');
      }
    }
    else if (os === 'macos') {
      if (checkCommand('brew --version')) {
        runCommand('brew install yt-dlp', 'Instalando yt-dlp (Homebrew)');
      } else {
        runCommand('pip3 install yt-dlp', 'Instalando yt-dlp (pip3)');
        runCommand('pip install yt-dlp', 'Instalando yt-dlp (pip)');
      }
    } 
    else if (os === 'linux') {
      const installers = [
        { cmd: 'pip3 install yt-dlp', desc: 'Instalando yt-dlp (pip3)' },
        { cmd: 'pip install yt-dlp', desc: 'Instalando yt-dlp (pip)' },
        { cmd: 'sudo apt-get install -y yt-dlp', desc: 'Instalando yt-dlp (apt-get)' },
        { cmd: 'sudo apt install -y yt-dlp', desc: 'Instalando yt-dlp (apt)' },
      ];
      
      let installed = false;
      for (const inst of installers) {
        if (runCommand(inst.cmd, inst.desc)) {
          installed = true;
          break;
        }
      }
    }
  }
  
  console.log('\n 🔗 Configurando comando global...');
  try {
    execSync('npm link', { stdio: 'inherit' });
    console.log(' ✅ Comando "jandotube" configurado');
  } catch (e) {
    console.log(' ⚠️  Necesitas permisos. Ejecuta: sudo npm link');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(' 🎉 ¡INSTALACIÓN COMPLETA!');
  console.log('='.repeat(60));
  console.log('\n 📋 Comandos:');
  console.log('   jandotube           # Menú interactivo');
  console.log('   jandotube <url>    # Descargar video');
  console.log('   jandotube -a       # Descargar audio');
  console.log('   jandotube -i       # Ver información');
  console.log('');
}

setup();
