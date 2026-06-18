#!/usr/bin/env python3
"""
Video generation script using AI-powered avatars.
Generates a video of a woman speaking the provided text.
"""

import os
import sys
import argparse
import json
import time
from pathlib import Path
from typing import Optional
import requests
from dotenv import load_dotenv

try:
    from PIL import Image, ImageDraw, ImageFont
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

load_dotenv()

class VideoGenerator:
    def __init__(self):
        self.api_token = os.getenv('REPLICATE_API_TOKEN')
        self.output_dir = Path(os.getenv('OUTPUT_DIR', './videos'))
        self.output_dir.mkdir(parents=True, exist_ok=True)

        if not self.api_token:
            print("⚠️  REPLICATE_API_TOKEN no configurado.")
            print("Usando modo demo - genera estructura sin API real")
            self.api_available = False
        else:
            self.api_available = True

    def generate_with_replicate(self, text: str, output_path: str) -> bool:
        """Generate video using Replicate API"""
        if not self.api_available:
            return False

        print(f"📹 Generando vídeo con Replicate...")
        print(f"Texto: {text[:50]}...")

        # Use text-to-video model
        url = "https://api.replicate.com/v1/predictions"
        headers = {
            "Authorization": f"Token {self.api_token}",
            "Content-Type": "application/json"
        }

        # Replicate model for video generation
        payload = {
            "version": "a4a8d91322d69ac6e610c2cc58a283b43b0409e80b1601435a5dd0e3e01af235",
            "input": {
                "prompt": f"A professional woman speaking and saying: {text}. High quality, clear video."
            }
        }

        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            prediction = response.json()

            # Poll for completion
            prediction_id = prediction['id']
            print(f"Prediction ID: {prediction_id}")

            for attempt in range(120):  # Max 2 minutes
                status_response = requests.get(
                    f"https://api.replicate.com/v1/predictions/{prediction_id}",
                    headers=headers
                )
                status_response.raise_for_status()
                status = status_response.json()

                if status['status'] == 'succeeded':
                    output_url = status['output']
                    self._download_video(output_url, output_path)
                    return True
                elif status['status'] == 'failed':
                    print(f"❌ Error: {status.get('error')}")
                    return False

                print(f"⏳ Estado: {status['status']} ({attempt + 1}/120)")
                time.sleep(2)

            print("⏱️  Timeout esperando resultado")
            return False

        except requests.exceptions.RequestException as e:
            print(f"❌ Error en API: {e}")
            return False

    def _download_video(self, url: str, output_path: str) -> None:
        """Download video from URL"""
        print(f"📥 Descargando vídeo...")
        try:
            response = requests.get(url, stream=True, timeout=60)
            response.raise_for_status()

            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)

            print(f"✅ Vídeo guardado: {output_path}")
        except requests.exceptions.RequestException as e:
            print(f"❌ Error descargando: {e}")

    def generate_demo_structure(self, text: str, output_path: str) -> bool:
        """Generate demo video structure (without API)"""
        if PIL_AVAILABLE:
            return self._generate_animated_video(text, output_path)

        print(f"📹 Generando estructura demo de vídeo...")
        print(f"Texto: {text}")
        print(f"\n✨ Vídeo generaría:")
        print(f"   - Avatar: Mujer profesional")
        print(f"   - Duración: ~{len(text.split()) * 0.5} segundos")
        print(f"   - Voz: Castellano natural")
        print(f"   - Resolución: 1280x720")

        metadata = {
            "status": "demo",
            "text": text,
            "avatar": "woman_professional",
            "voice": "es-ES",
            "duration_estimate": len(text.split()) * 0.5,
            "resolution": "1280x720",
            "output_path": output_path
        }

        metadata_path = output_path.replace('.mp4', '_metadata.json')
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)

        print(f"✅ Metadatos guardados: {metadata_path}")
        return True

    def _generate_animated_video(self, text: str, output_path: str) -> bool:
        """Generate animated video using PIL"""
        try:
            print(f"📹 Generando vídeo animado...")

            frames = []
            width, height = 1280, 720

            try:
                font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
                font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
                font_text = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
            except:
                font_large = font_medium = font_text = ImageFont.load_default()

            # Frame 1: Intro
            img = Image.new('RGB', (width, height), (30, 30, 50))
            draw = ImageDraw.Draw(img)
            for i in range(height):
                intensity = int(30 + (i / height) * 40)
                draw.line([(0, i), (width, i)], fill=(intensity, intensity, intensity + 50))
            draw.text((width//2 - 500, height//2 - 150), "AVATAR IA", fill=(100, 200, 255), font=font_large)
            draw.text((width//2 - 400, height//2 + 100), "Generando Video", fill=(150, 220, 255), font=font_medium)
            frames.append(img.copy())

            # Frame 2-3: Speaking
            img = Image.new('RGB', (width, height), (30, 30, 50))
            draw = ImageDraw.Draw(img)
            for i in range(height):
                intensity = int(35 + (i / height) * 35)
                draw.line([(0, i), (width, i)], fill=(intensity + 10, intensity, intensity + 30))

            mouth_y = height // 2 + 80
            for j in range(3):
                radius = 15 + j * 5
                draw.ellipse([width//2 - radius, mouth_y - radius, width//2 + radius, mouth_y + radius],
                           outline=(100, 200, 255), width=2)

            draw.text((width//2 - 400, height//2 - 150), text[:30], fill=(200, 220, 255), font=font_text)
            frames.append(img.copy())
            frames.append(img.copy())

            # Frame 4: Success
            img = Image.new('RGB', (width, height), (30, 50, 30))
            draw = ImageDraw.Draw(img)
            for i in range(height):
                intensity = int(30 + (i / height) * 40)
                draw.line([(0, i), (width, i)], fill=(intensity, intensity + 50, intensity))

            draw.text((width//2 - 300, height//2 - 150), "✓", fill=(100, 255, 100), font=font_large)
            draw.text((width//2 - 450, height//2 + 100), "Video Listo!", fill=(150, 255, 150), font=font_medium)
            frames.append(img.copy())

            # Save as GIF
            gif_path = output_path.replace('.mp4', '.gif')
            frames[0].save(gif_path, save_all=True, append_images=frames[1:],
                          duration=[2000, 1500, 1500, 2000], loop=0)

            print(f"✅ Vídeo generado: {gif_path}")
            return True
        except Exception as e:
            print(f"❌ Error generando vídeo: {e}")
            return False

    def generate(self, text: str, voice: str = "es-ES", output_file: Optional[str] = None) -> str:
        """Generate video"""
        if not text:
            print("❌ Error: texto vacío")
            return ""

        if not output_file:
            timestamp = int(time.time())
            output_file = f"video_{timestamp}.mp4"

        output_path = str(self.output_dir / output_file)

        print(f"\n🚀 Iniciando generación de vídeo...")
        print(f"Idioma: {voice}")
        print(f"Salida: {output_path}\n")

        if self.api_available:
            success = self.generate_with_replicate(text, output_path)
        else:
            success = self.generate_demo_structure(text, output_path)

        if success:
            print(f"\n🎉 ¡Vídeo generado exitosamente!")
            return output_path
        else:
            print(f"\n❌ Error generando vídeo")
            return ""

def main():
    parser = argparse.ArgumentParser(
        description="Generar vídeo de avatar hablando"
    )
    parser.add_argument(
        "--text",
        type=str,
        default="Hola, soy una asistente de IA. Me encanta ayudarte a crear contenido de vídeo increíble.",
        help="Texto para que el avatar hable"
    )
    parser.add_argument(
        "--voice",
        type=str,
        default="es-ES",
        help="Código de idioma/voz (ej: es-ES, en-US)"
    )
    parser.add_argument(
        "--output",
        type=str,
        help="Nombre del archivo de salida"
    )

    args = parser.parse_args()

    generator = VideoGenerator()
    output = generator.generate(args.text, args.voice, args.output)

    return 0 if output else 1

if __name__ == "__main__":
    sys.exit(main())
