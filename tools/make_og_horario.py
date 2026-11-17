"""Share preview (Open Graph, 1200x630) for the timetable page, drawn from assets/js/data.js.

Usage (from the repo root): python3 tools/make_og_horario.py
Writes assets/img/og-horario.jpg. Re-run it whenever the timetable changes.
"""
import json
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(ROOT, "assets/js/data.js"), encoding="utf-8").read()
D = json.loads(src[src.index("{"):src.rindex("}") + 1])
W, H = 1200, 630
INK, PAPER, MUTED, PINK, RULE = (22, 18, 15), (243, 238, 230), (168, 158, 147), (255, 79, 163), (58, 50, 44)
ANTON = os.path.join(ROOT, "assets/fonts/anton-normal-latin.woff2")
SANS = os.path.join(ROOT, "assets/fonts/instrument-sans-normal-latin.woff2")


def sans(size, weight=500):
    f = ImageFont.truetype(SANS, size)
    try:
        f.set_variation_by_axes([weight] + [a["default"] for a in f.get_variation_axes()[1:]])
    except Exception:
        pass
    return f


def minutes(t):
    h, m = t.split(":")
    return int(h) * 60 + int(m)


names = {c["id"]: c["name"] for c in D["classes"]}
types = {c["id"]: c["type"] for c in D["classes"]}
im = Image.new("RGB", (W, H), INK)
d = ImageDraw.Draw(im)
logo = Image.open(os.path.join(ROOT, "assets/img/logo.png")).convert("RGBA")
logo = logo.resize((150, round(logo.height * 150 / logo.width)), Image.LANCZOS)
im.paste(logo, (W - 60 - 150, 40), logo)
d.text((60, 40), f'HORARIO CURSO {D["studio"]["season"]}', font=ImageFont.truetype(ANTON, 64), fill=PAPER)
d.text((60, 122), f'{D["studio"]["name"]} · {D["studio"]["locality"]} · Tel. {D["studio"]["phone"]}', font=sans(24, 500), fill=MUTED)
colw = (W - 120) / 5
top = 190
for i, day in enumerate(D["days"]):
    x = 60 + i * colw
    d.text((x, top), day.upper(), font=ImageFont.truetype(ANTON, 30), fill=PAPER)
    d.line((x, top + 46, x + colw - 16, top + 46), fill=PAPER, width=2)
    y = top + 60
    for s in sorted((s for s in D["sessions"] if s["day"] == i), key=lambda s: minutes(s["start"])):
        color = PINK if types[s["class"]] == "dance" else PAPER
        d.rectangle((x, y + 2, x + 3, y + 46), fill=color)
        d.text((x + 12, y), f'{s["start"]}–{s["end"]}', font=sans(17, 500), fill=MUTED)
        label = (s["label"] or names[s["class"]]).replace("Grupo ", "")  # short labels fit the column
        f = sans(19, 650)
        while d.textlength(label, font=f) > colw - 30 and len(label) > 4:
            label = label[:-2]
        full = (s["label"] or names[s["class"]]).replace("Grupo ", "")
        if label != full:
            label = label.rstrip() + "…"
        d.text((x + 12, y + 22), label, font=f, fill=PAPER)
        y += 64
im.save(os.path.join(ROOT, "assets/img/og-horario.jpg"), "JPEG", quality=86, optimize=True, progressive=True)
print("wrote assets/img/og-horario.jpg")
