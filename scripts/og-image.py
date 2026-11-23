"""Gera app/opengraph-image.jpg, o card que aparece ao compartilhar o site (WhatsApp, Instagram...).

Uso: python scripts/og-image.py <foto-original.jpg> <saida.jpg>

A foto original é a do aro (2048x1365), guardada no histórico:
  git show 972f178^:public/images/home/home_about_denise_5776.jpg > source.jpg

O WhatsApp quase sempre mostra só a miniatura: o quadrado central (x 285 a 915), reduzido
para uns 100 px e recomprimido. Por isso o card é:
- fundo vinho liso, que não perde nada na compressão;
- no quadrado central, um recorte fechado no rosto da Denise com o fundo de folhas desfocado;
- embaixo, uma faixa vinho com o nome grande;
- JPEG qualidade 82, abaixo de 100 KB.
"""

import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

W, H = 1200, 630
SQUARE_X = (W - H) // 2  # 285: left edge of the center square the thumbnail keeps
BAND_TOP = 440  # photo above, wine band with the name below
NAME = "DENISE GARCIA"
SUBTITLE = "POLE DANCE"
SERIF = "C:/Windows/Fonts/georgia.ttf"
SANS = "C:/Windows/Fonts/arial.ttf"

VINHO = (90, 26, 42)  # --color-vinho
MARFIM = (243, 236, 226)  # --color-marfim
SHADOW = (28, 14, 20)
HIGHLIGHT = (246, 236, 232)

# Window of the original photo (2048x1365) around the face, same ratio as the photo area.
PHOTO_BOX = (300, 330, 1240, 987)


def portrait(source: str) -> Image.Image:
    photo = ImageOps.grayscale(Image.open(source))
    size = (H, BAND_TOP)
    base = photo.crop(PHOTO_BOX).resize(size, Image.LANCZOS)

    # Sharp on Denise, blurred hedge around her so it does not turn to grain.
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).ellipse((110, 110, 720, 620), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(35))
    # Softer and a little darker, so the hedge stays behind her.
    backdrop = base.filter(ImageFilter.GaussianBlur(10)).point(lambda v: round(v * 0.8))
    img = Image.composite(base, backdrop, mask)

    img = ImageOps.autocontrast(img, cutoff=0.5)
    return ImageOps.colorize(img, SHADOW, HIGHLIGHT)


def spaced(draw, center_x, y, text, font, spacing, fill):
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + spacing * (len(text) - 1)
    x = center_x - total / 2
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=fill)
        x += w + spacing


def build(source: str, out: str) -> None:
    img = Image.new("RGB", (W, H), VINHO)
    img.paste(portrait(source), (SQUARE_X, 0))

    draw = ImageDraw.Draw(img)
    spaced(draw, W // 2, 468, NAME, ImageFont.truetype(SERIF, 64), 5, MARFIM)
    spaced(draw, W // 2, 562, SUBTITLE, ImageFont.truetype(SANS, 30), 9, MARFIM)

    # 82 keeps it under 100 KB with no visible loss (about 40 dB PSNR against the lossless render).
    img.save(out, "JPEG", quality=82, optimize=True, progressive=True, subsampling="4:2:0")


if __name__ == "__main__":
    build(sys.argv[1], sys.argv[2])
