import yt_dlp
import os

url = input("Por favor, pega el enlace del video de YouTube: ")

output_dir = 'Descarga'
os.makedirs(output_dir, exist_ok=True)

ydl_opts = {
    'format': 'bestvideo+bestaudio/best',
    'outtmpl': os.path.join(output_dir, '%(title)s.%(ext)s'),
    'merge_output_format': 'mp4',
    'noplaylist': True,
    'quiet': False,
    'user_agent': 'Mozilla/5.0',
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    print("Descarga completa.")
except Exception as e:
    print(f"Error: {e}")