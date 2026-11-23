"""Gera app/opengraph-image.jpg, o card que aparece ao compartilhar o site (WhatsApp, Instagram...).

Uso: python scripts/og-image.py <foto-original.jpg> <saida.jpg>

A foto original é a do aro (2048x1365), guardada no histórico:
  git show 972f178^:public/images/home/home_about_denise_5776.jpg > source.jpg

Cuidados para o WhatsApp:
- o fundo de folhas é desfocado de leve, senão vira granulado na recompressão;
- rosto e nome ficam no quadrado central (x 285 a 915), que é o que sobra na miniatura;
- o arquivo fica abaixo de 300 KB.
"""

import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

W, H = 1200, 630
NAME = "DENISE GARCIA"
SUBTITLE = "POLE DANCE · CAÇAPAVA/SP"
SERIF = "C:/Windows/Fonts/georgia.ttf"
SANS = "C:/Windows/Fonts/arial.ttf"

# Wine tint of the site, applied as a soft duotone over the black and white photo.
SHADOW = (28, 14, 20)
HIGHLIGHT = (246, 236, 232)
TEXT = (250, 244, 240)
SUBTEXT = (238, 224, 220)


def crop(photo: Image.Image) -> Image.Image:
    # Full width; top cut so the face sits a little above the middle.
    top = 150
    height = round(photo.width * H / W)
    return photo.crop((0, top, photo.width, top + height)).resize((W, H), Image.LANCZOS)


def subject_mask() -> Image.Image:
    # Sharp area: Denise, the seat of the hoop and the boots. Everything else gets the blur.
    mask = Image.new("L", (W, H), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((320, 150, 1120, 640), fill=255)
    draw.ellipse((780, 60, 1130, 330), fill=255)
    return mask.filter(ImageFilter.GaussianBlur(40))


def spaced(draw, center_x, y, text, font, spacing, fill):
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + spacing * (len(text) - 1)
    x = center_x - total / 2
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=fill)
        x += w + spacing


def build(source: str, out: str) -> None:
    photo = ImageOps.grayscale(Image.open(source))
    base = crop(photo)

    blurred = base.filter(ImageFilter.GaussianBlur(5))
    img = Image.composite(base, blurred, subject_mask())
    img = ImageOps.autocontrast(img, cutoff=0.5)
    img = ImageOps.colorize(img, SHADOW, HIGHLIGHT).convert("RGB")

    # Dark band only at the top, where the text goes.
    shade = Image.new("L", (W, H), 0)
    sd = ImageDraw.Draw(shade)
    for y in range(230):
        sd.line((0, y, W, y), fill=round(200 * (1 - y / 230) ** 1.6))
    img = Image.composite(Image.new("RGB", (W, H), SHADOW), img, shade)

    draw = ImageDraw.Draw(img)
    cx = 600
    spaced(draw, cx, 38, NAME, ImageFont.truetype(SERIF, 58), 10, TEXT)
    spaced(draw, cx, 120, SUBTITLE, ImageFont.truetype(SANS, 24), 5, SUBTEXT)

    img.save(out, "JPEG", quality=88, optimize=True, progressive=True)


if __name__ == "__main__":
    build(sys.argv[1], sys.argv[2])
