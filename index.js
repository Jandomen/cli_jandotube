#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

const BANNER = `
 JJJJJJJJ  AAAAAAAA  NNNNNNNN  DDDDDDDD  OOOOOO  TTTTTTTT  UUUUUUUU  BBBBBBBBB  EEEE
    JJ     AA        NN        DD       OO       TT       UU        BB       EE
   JJ      AAAA     NNNN     DDDD     OOOO     TTTT     UUUU      BBBB     EEEE
J  JJ    AA  AA   NN  NN   DD  DD   OO  OO   TT  TT   UU  UU    BB  BB   EE  EE
 JJJJ    AAAAAAAA  NNNNNN  DDDDDD  OOOOOO  TTTTT   UUUU    BBBB    EEEE
`;

const OUTPUT_DIR = 'Descarga';

function clearScreen() {
  console.clear();
}

function showBanner() {
  clearScreen();
  console.log(chalk.cyan(BANNER));
}

function isPlaylist(url) {
  return url.includes('list=');
}

async function getPlaylistVideos(url) {
  return new Promise((resolve) => {
    const args = ['--flat-playlist', '--print', '%(title)s|%(duration)s|%(id)s', url];
    const process = spawn('yt-dlp', args);

    let output = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        resolve({ title: 'Playlist', videos: [] });
        return;
      }

      const lines = output.trim().split('\n').filter(l => l);
      const videos = lines.map((line, i) => {
        const parts = line.split('|');
        return {
          index: i + 1,
          title: parts[0] || 'Sin título',
          duration: parts[1] || '0:00',
          id: parts[2] || ''
        };
      });

      resolve({ title: 'Playlist', videos });
    });
  });
}

async function selectFromPlaylist(videos) {
  showBanner();
  console.log(chalk.yellow('\n 📋 LISTA DE VIDEOS'));
  console.log(' '.repeat(50) + chalk.gray('─'.repeat(30)));

  videos.forEach(v => {
    console.log(chalk.white(`   [${String(v.index).padStart(2, '0')}] 🎬 ${v.title.substring(0, 45).padEnd(45)} ⏱️ ${v.duration}`));
  });

  console.log(' '.repeat(50) + chalk.gray('─'.repeat(30)));
  console.log(chalk.green('   [A] 📥 Descargar TODOS'));
  console.log(chalk.red('   [0] ❌ Cancelar'));
  console.log('');

  const { selection } = await inquirer.prompt([
    {
      type: 'input',
      name: 'selection',
      message: ' Selecciona el número del video:',
      default: '0'
    }
  ]);

  return selection;
}

async function getVideoInfo(url) {
  return new Promise((resolve) => {
    const args = ['--dump-json', '--no-playlist', url];
    const process = spawn('yt-dlp', args);

    let output = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        resolve(null);
        return;
      }

      try {
        const info = JSON.parse(output);
        resolve(info);
      } catch (e) {
        resolve(null);
      }
    });
  });
}

async function showVideoInfo(url) {
  showBanner();
  console.log(chalk.yellow('\n 📺 OBTENIENDO INFORMACIÓN...'));

  const info = await getVideoInfo(url);

  if (!info) {
    console.log(chalk.red('\n ❌ Error al obtener información'));
    return false;
  }

  showBanner();

  const dur = info.duration || 0;
  const mins = Math.floor(dur / 60);
  const secs = dur % 60;

  console.log(chalk.yellow('\n 📺 INFORMACIÓN DEL VIDEO'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white(` 🎬 Título: ${info.title || 'N/A'}`));
  console.log(chalk.white(` ⏱️  Duración: ${mins}:${secs.toString().padStart(2, '0')}`));
  console.log(chalk.white(` 👁️  Vistas: ${info.view_count ? info.view_count.toLocaleString() : 'N/A'}`));
  console.log(chalk.white(` 📺 Canal: ${info.channel || 'N/A'}`));
  console.log(chalk.white(` 📅 Fecha: ${info.upload_date || 'N/A'}`));
  const desc = (info.description || 'N/A').substring(0, 100);
  console.log(chalk.white(` 📝 Descripción: ${desc}...`));
  console.log(chalk.gray('─'.repeat(50)));

  return true;
}

async function downloadVideo(url, formatType, isPlaylist = false) {
  const outputDir = OUTPUT_DIR;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  showBanner();

  let args;

  if (formatType === 'video') {
    console.log(chalk.yellow('\n 📥 Descargando VIDEO...'));
    args = [
      '-f', 'best[ext=mp4]/best',
      '-o', path.join(outputDir, '%(title)s.%(ext)s'),
      '--no-playlist'
    ];
  } else if (formatType === 'audio') {
    console.log(chalk.yellow('\n 🎵 Descargando AUDIO (MP3)...'));
    args = [
      '-x', '--audio-format', 'mp3',
      '--audio-quality', '192K',
      '-o', path.join(outputDir, '%(title)s.%(ext)s'),
      '--no-playlist'
    ];
  }

  if (!isPlaylist) {
    args.push('--no-playlist');
  }

  args.push(url);

  return new Promise((resolve) => {
    const process = spawn('yt-dlp', args, {
      stdio: 'inherit'
    });

    process.on('close', (code) => {
      if (code === 0) {
        showBanner();
        console.log(chalk.green('\n ✅ ¡Descarga completada!'));
        console.log(chalk.white(` 📁 ${path.resolve(outputDir)}`));
        resolve(true);
      } else {
        console.log(chalk.red('\n ❌ Error en la descarga'));
        resolve(false);
      }
    });
  });
}

async function checkForUpdates() {
  showBanner();
  console.log(chalk.yellow('\n 🔄 Buscando actualizaciones...'));

  return new Promise((resolve) => {
    const process = spawn('npm', ['install', '-g', 'yt-dlp'], {
      stdio: 'inherit'
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green('\n ✅ yt-dlp actualizado'));
      } else {
        console.log(chalk.red('\n ❌ Error al actualizar'));
      }
      resolve();
    });
  });
}

async function mainMenu() {
  while (true) {
    showBanner();

    const { url } = await inquirer.prompt([
      {
        type: 'input',
        name: 'url',
        message: '📥 Ingresa la URL del video de YouTube:',
        validate: (input) => input.length > 0 || 'Ingresa una URL válida'
      }
    ]);

    if (!url) continue;

    let urlToDownload = url;
    let isPlaylistDownload = false;

    if (isPlaylist(url)) {
      const { videos } = await getPlaylistVideos(url);

      if (videos.length > 0) {
        const selection = await selectFromPlaylist(videos);

        if (selection === '0' || !selection) {
          continue;
        } else if (selection.toUpperCase() === 'A') {
          urlToDownload = url;
          isPlaylistDownload = true;
        } else {
          const idx = parseInt(selection) - 1;
          if (idx >= 0 && idx < videos.length) {
            urlToDownload = `https://youtube.com/watch?v=${videos[idx].id}`;
          } else {
            console.log(chalk.red(' ❌ Selección inválida'));
            continue;
          }
        }
      }
    }

    showBanner();

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '🎯 ¿Qué deseas hacer?',
        choices: [
          { name: '🎬 Descargar VIDEO', value: 'video' },
          { name: '🎵 Descargar AUDIO (MP3)', value: 'audio' },
          { name: 'ℹ️  Ver INFORMACIÓN', value: 'info' }
        ]
      }
    ]);

    if (action === 'info') {
      await showVideoInfo(urlToDownload);
      await inquirer.prompt([{ type: 'input', name: 'continue', message: chalk.gray('\n Presiona ENTER para continuar...') }]);
    } else {
      await downloadVideo(urlToDownload, action, isPlaylistDownload);
      await inquirer.prompt([{ type: 'input', name: 'continue', message: chalk.gray('\n Presiona ENTER para continuar...') }]);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--update') || args.includes('-u')) {
    await checkForUpdates();
    return;
  }

  if (args.includes('--version') || args.includes('-v')) {
    const pkg = require('./package.json');
    console.log(chalk.cyan(BANNER));
    console.log(chalk.white(`\n 📦 Versión de jandotube: ${pkg.version}`));
    console.log(chalk.white(` 📦 Node.js: ${process.version}`));
    return;
  }

  if (args.length > 0) {
    const url = args[0];
    const isVideo = args.includes('-v') || args.includes('--video');
    const isAudio = args.includes('-a') || args.includes('--audio');
    const isInfo = args.includes('-i') || args.includes('--info');

    if (isInfo) {
      await showVideoInfo(url);
    } else if (isAudio) {
      await downloadVideo(url, 'audio');
    } else {
      await downloadVideo(url, 'video');
    }
    return;
  }

  await mainMenu();
}

main().catch(console.error);
