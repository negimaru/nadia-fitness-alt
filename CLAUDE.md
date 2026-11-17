# Project rules

- Read `DESIGN.md` before any UI task.
- Content that repeats or changes (classes, timetable, phone, address, call hours, rating, legal owner) lives ONLY in `assets/js/data.js`. Never hard-code it in a page: add an empty `[data-bind]` / `[data-href]` / `[data-render]` slot and let `assets/js/app.js` fill it.
- Code (identifiers, CSS classes, comments) in English; visible content in Spanish.
- Never invent prices, ages, testimonials or stats.
- Static per-page SEO (`<title>`, description, Open Graph, canonical) stays in each page head; keep it free of data that changes.
