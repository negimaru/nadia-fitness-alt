# DESIGN.md — Nadia Fitness Dance Studio (alternative proposal)

The single source of truth for how this site looks. Every page and component follows it.

## Direction

**A printed dance-school programme.** Think of the timetable sheet pinned to the studio door, or a festival programme: warm paper, black ink, ruled lines, one flat spot colour, big condensed type. It is local, practical and a bit theatrical — not a tech landing page.

Audience: families in Torrox Costa looking for a group for their kids, and adults looking for a dance or fitness class near home. What they want first: *what is on, when, and how do I sign up.*

## The memorable element

**"Hoy en el estudio"** — the hero is today's real timetable, not a slogan. It shows today's date, every class running today with its time, and marks which one is on *now* and which is *next*. On weekends it shows Monday. It is built from the same schedule data as the weekly table, so it is never invented.

Second signature: the **phone number set as display type** (Anton, very large) in the sign-up section. Calling is how people book here, so the number is the hero of that section.

## Generic AI patterns we avoid (and what we do instead)

| Avoid | Instead |
|---|---|
| Inter / system sans everywhere | Anton (display) + Instrument Sans (text). Times use tabular figures. |
| Purple/blue gradients, glows, neon shadows | Flat colour only. No gradients, no `box-shadow` glows. |
| Grey text on coloured backgrounds | Muted text only on paper/ink; on pink, text is white. All pairs ≥ 4.5:1. |
| Hero = centred headline + two buttons | Asymmetric hero: headline left, live "Hoy" board right, one text link. |
| Hero → 3 feature cards → CTA → footer | Numbered sections like a programme (01 Clases, 02 Horario, 03 Nadia, 04 Apúntate), each with a sticky label column. |
| Cards in cards, icon tiles over headings | Ruled lists and tables. No icon tiles. Rounded corners only on photos (small radius). |
| Fade/slide-up on scroll | No scroll animations. Only hover/focus underlines and the live "now" marker. |
| Invented stats or testimonials | Only real data: classes, times, address, the real Google rating (5,0 · 29). |

## Colour

| Token | Light (paper) | Dark (ink) | Use |
|---|---|---|---|
| `--paper` | `#F3EEE6` | `#16120F` | Page background |
| `--ink` | `#16120F` | `#F3EEE6` | Text, rules, header band |
| `--muted` | `#5E554D` | `#A89E93` | Secondary text (6.3:1 / 7.1:1) |
| `--pink` | `#D1006F` | `#FF4FA3` | Spot colour: fills, large type, the "now" marker |
| `--pink-text` | `#B5005F` | `#FF4FA3` | Pink small text (5.8:1 / 6.1:1) |
| `--on-pink` | `#FFFFFF` | `#16120F` | Text on pink fills |
| `--rule` | `#D9D1C5` | `#3A322C` | Hairlines (decorative) |

Dance = pink dot, Fitness = ink ring. Dark mode follows the OS (`prefers-color-scheme`).

## Type

- Display: **Anton**, uppercase, never italic, never letter-spaced wider than 0.01em.
- Leading: **never below 1.05 on any display text that can wrap.** Spanish capitals carry accents (JÓVENES, MIÉRCOLES, APÚNTATE) and Anton's accents rise well above cap height; at 0.9 they collide with the line above. Single-line numerals (the phone) may go to 0.9.
- Text: **Instrument Sans** 400/500/600/700. Body 17px/1.6. Labels 12px, 600, uppercase, 0.14em tracking.
- Scale (desktop / mobile): h1 112/60, h2 72/44, h3 32/26, lead 20/18.

## Space & grid

- 12-column grid, max 1240px, 24px gutters (16px on mobile).
- Section rhythm: 112px desktop / 64px mobile. Sections are separated by a 1px ink rule, not by background bands.
- Every section: label column (3 cols, sticky on desktop) + content (9 cols).

## Components

- **Rule list** (classes): one row per class — index number, name in Anton, audience tag, days/times right-aligned, short description. Hover: name turns pink.
- **Timetable**: a plain table with hairlines; each session is text, not a card. Mobile: one list per day.
- **Text link CTA**: underlined, with an arrow (→). One primary pink fill button per page at most (the sticky mobile call bar).
- **Photos**: grayscale by default to sit on paper; never more than one per section.

## Copy

Spanish, direct, second person (tú). No superlatives, no "the best studio". Say what, when, where and how to book.

## Pages

| Page | Content |
|---|---|
| `/` | Hero + live "Hoy" board, then the programme: 01 Clases (ruled list), 02 Horario (filterable), 03 Nadia, 04 Apúntate (phone as display type) |
| `/clases/` | One numbered section per class: who it is for, description, times, "Reservar plaza" (→ contact with the class preselected), "Ver en el horario" (→ timetable filtered) |
| `/horario/` | "Hoy" board + full timetable with class filters; `?clase=<id>` preselects a class |
| `/quien-soy/` | Nadia, Google rating, the classes she teaches |
| `/contacto/` | Phone, call hours, WhatsApp form (`?clase=<id>` preselects), address and map, three steps |
| `/aviso-legal/`, `/privacidad/` | Legal prose; owner name, NIF and email come from data and show a dashed placeholder while empty |

## One source of truth

Everything that repeats across pages or is likely to change lives in **`assets/js/data.js`** (`window.NF`): classes, sessions, phone, WhatsApp, address, geo, call hours, rating, social links, season, legal owner data. `assets/js/app.js` renders from it the header, footer, mobile call bar, class lists, timetable, "Hoy" board, call hours, form options, every `[data-bind]` text, every `[data-href]` link and the JSON-LD. Pages hold only their own prose and empty slots.

Exceptions, because crawlers and link previews do not run JavaScript: each page's `<title>`, meta description and Open Graph tags are static. Review them when the season or the hours change.
