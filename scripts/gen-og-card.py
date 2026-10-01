#!/usr/bin/env python3
"""Generate the MQT site-wide OG/Twitter share card (1200x630 PNG).

Replaces public/images/og-default.svg — Facebook, X/Twitter, WhatsApp and
LinkedIn do not render SVG og:images, so the SVG produced broken share cards.
Same brand composition as the SVG (navy gradient, orange accents, tagline)
but raster at the canonical 1200x630 share-card size.
"""
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
TOP = (6, 27, 48)      # #061b30
BOT = (26, 39, 68)     # #1a2744
ORANGE = (251, 77, 0)  # #fb4d00
WHITE = (255, 255, 255)
MUTED = (148, 163, 184)  # #94a3b8
FAINT = (100, 116, 139)  # #64748b

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

img = Image.new("RGB", (W, H), TOP)
px = img.load()
# vertical gradient
for y in range(H):
    t = y / (H - 1)
    px_color = tuple(int(TOP[i] + (BOT[i] - TOP[i]) * t) for i in range(3))
    for x in range(W):
        px[x, y] = px_color

draw = ImageDraw.Draw(img, "RGBA")

# subtle diagonal sheen
sheen = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sd = ImageDraw.Draw(sheen)
sd.polygon([(700, 0), (1200, 0), (1200, 630), (950, 630)], fill=(255, 255, 255, 14))
img = Image.alpha_composite(img.convert("RGBA"), sheen)
draw = ImageDraw.Draw(img)

# thin orange inset frame
draw.rounded_rectangle([40, 40, W - 40, H - 40], radius=20, outline=ORANGE + (90,), width=2)

# soft orange glow under logo
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
gd.ellipse([520, 40, 680, 200], fill=ORANGE + (48,))
from PIL import ImageFilter
img = Image.alpha_composite(img, glow.filter(ImageFilter.GaussianBlur(40)))
draw = ImageDraw.Draw(img)

# logo (official plane-in-Q mark, webp with alpha)
logo_path = os.path.join(HERE, "public/images/mqt-logo-256.webp")
logo = Image.open(logo_path).convert("RGBA")
logo = logo.resize((140, 140), Image.LANCZOS)
img.paste(logo, (W // 2 - 70, 78), logo)

def centered(y, text, font, fill):
    tw = draw.textlength(text, font=font)
    draw.text((W / 2 - tw / 2, y), text, font=font, fill=fill)

f_title = ImageFont.truetype(FONT_BOLD, 84)
f_tag = ImageFont.truetype(FONT_BOLD, 34)
f_sub = ImageFont.truetype(FONT_REG, 28)
f_dom = ImageFont.truetype(FONT_REG, 24)

centered(238, "My Quick Trippers", f_title, WHITE)
centered(352, "Your Journey, Our Expertise", f_tag, ORANGE)
centered(414, "Curated India & International Tour Packages", f_sub, MUTED)
centered(470, "www.myquicktrippers.com", f_dom, FAINT)

# small orange rule under title
draw.rounded_rectangle([W // 2 - 90, 342, W // 2 + 90, 346], radius=2, fill=ORANGE)

out = os.path.join(HERE, "public/images/og-default.png")
img.convert("RGB").save(out, optimize=True)
print("wrote", out, os.path.getsize(out), "bytes")
