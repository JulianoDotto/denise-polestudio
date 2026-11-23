"""Gera as fotos da home em tamanhos para celular e desktop (srcset).

Uso: python scripts/home-images.py <foto-topo.webp> <foto-sobre.webp> <pasta-saida>

As fotos originais ficam no histórico:
  git show 01b290b:public/images/home/home-hero.webp > hero.webp
  git show 01b290b:public/images/home/home-sobre-denise.webp > sobre.webp

- Topo (853x1280): 480 e 853 px de largura. O cartão tem ~390 px no celular e ~714 px no desktop.
- Sobre (1600x1066): o CSS mostra em 4:5 com object-position 42% 50%; aqui já sai cortada
  no mesmo enquadramento, em 480 e 800 px de largura.
"""

import sys
from pathlib import Path

from PIL import Image

QUALITY = 72


def save(image: Image.Image, path: Path) -> None:
    image.save(path, "WEBP", quality=QUALITY, method=6)
    print(f"{path.name}: {image.width}x{image.height}, {path.stat().st_size // 1024} KB")


def resize_to_width(image: Image.Image, width: int) -> Image.Image:
    if width >= image.width:
        return image.copy()
    height = round(image.height * width / image.width)
    return image.resize((width, height), Image.LANCZOS)


def crop_4_5(image: Image.Image, x_position: float) -> Image.Image:
    """Same crop as CSS object-fit: cover in a 4:5 box with object-position x_position 50%."""
    width = round(image.height * 4 / 5)
    left = round((image.width - width) * x_position)
    return image.crop((left, 0, left + width, image.height))


def main() -> None:
    hero_path, about_path, out_dir = sys.argv[1], sys.argv[2], Path(sys.argv[3])
    hero = Image.open(hero_path).convert("RGB")
    for width in (480, 853):
        save(resize_to_width(hero, width), out_dir / f"home-hero-{width}.webp")

    about = crop_4_5(Image.open(about_path).convert("RGB"), 0.42)
    for width in (480, 800):
        save(resize_to_width(about, width), out_dir / f"home-sobre-denise-{width}.webp")


if __name__ == "__main__":
    main()
