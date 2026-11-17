"""Placeholder images for classes without a photo, read from assets/js/data.js.

Usage (from the repo root): python3 tools/make_placeholders.py
Real photo: overwrite assets/img/clases/<id>.webp (landscape ~1200x750) and set
"placeholder": false for that class in data.js.
Style (DESIGN.md): printed programme — paper, ink, one flat pink rule, Anton.
"""
import json
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(ROOT, "assets/js/data.js"), encoding="utf-8").read()
DATA = json.loads(src[src.index("{"):src.rindex("}") + 1])
W, H = 1200, 750
PAPER, INK, MUTED, PINK, RULE = (235, 228, 218), (22, 18, 15), (94, 85, 77), (209, 0, 111), (200, 191, 179)
ANTON = os.path.join(ROOT, "assets/fonts/anton-normal-latin.woff2")
SANS = os.path.join(ROOT, "assets/fonts/instrument-sans-normal-latin.woff2")


def sans(size, weight=600):
    f = ImageFont.truetype(SANS, size)
    try:
        f.set_variation_by_axes([weight] + [a["default"] for a in f.get_variation_axes()[1:]])
    except Exception:
        pass
    return f


for i, c in enumerate(DATA["classes"], 1):
    if not c.get("placeholder"):
        continue
    im = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(im)
    d.line((60, 90, W - 60, 90), fill=INK, width=4)
    d.text((60, 112), f"{i:02d}", font=sans(30, 600), fill=MUTED)
    label = f'{c["kind"]} · {c["audience"]}'.upper()
    lf = sans(28, 600)
    d.text((W - 60 - d.textlength(label, font=lf), 112), label, font=lf, fill=MUTED)
    title = ImageFont.truetype(ANTON, 128 if len(c["name"]) < 16 else 104)
    words, lines, cur = c["name"].upper().split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=title) > W - 120 and cur:
            lines.append(cur); cur = w
        else:
            cur = t
    lines.append(cur)
    y = H - 150 - len(lines) * title.size * 1.08
    for line in lines:
        d.text((60, y), line, font=title, fill=INK)
        y += title.size * 1.08
    d.rectangle((60, H - 110, 220, H - 104), fill=PINK)
    d.line((60, H - 60, W - 60, H - 60), fill=RULE, width=2)
    out = os.path.join(ROOT, "assets/img", c["photo"])
    im.save(out, "WEBP", quality=86, method=6)
    print("wrote", os.path.relpath(out, ROOT))
