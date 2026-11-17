"""Pre-render every page from assets/js/data.js so the site is complete without JavaScript.

Usage (from the repo root, needs Chromium):  python3 tools/prerender.py

How it works: each page is loaded in headless Chromium, app.js fills every slot from data.js,
and the resulting HTML is written back to the same file. Things that depend on the moment
(the "Hoy en el estudio" board and the call status) are cleared, because a static snapshot
of them would be wrong later. With JavaScript on, app.js re-renders everything from data.js
on load, so a page is never stale for visitors even if this script was not re-run.

Run it after editing data.js (and commit the regenerated pages).
"""
import http.server
import os
import re
import shutil
import socketserver
import subprocess
import threading

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.basename(ROOT)
PAGES = ["index.html", "clases/index.html", "horario/index.html", "quien-soy/index.html",
         "contacto/index.html", "aviso-legal/index.html", "privacidad/index.html", "404.html"]
CHROME = shutil.which("chromium") or shutil.which("chromium-browser") or shutil.which("google-chrome")


def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass
    handler = lambda *a, **k: Quiet(*a, directory=os.path.dirname(ROOT), **k)
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def clean(html):
    html = re.sub(r"^\s*(<!doctype html>\s*)+", "", html, flags=re.I)
    html = "<!doctype html>\n" + html
    html = re.sub(r'<html lang="es"[^>]*>', '<html lang="es">', html, count=1)          # no "js" class / theme
    # Moment-dependent parts: leave empty slots (app.js fills them when JS runs)
    html = re.sub(r'(<aside class="today" data-render="today")[^>]*>.*?</aside>',
                  r'\1></aside>', html, flags=re.S)
    html = re.sub(r'<p class="call-status[^"]*" data-render="call-status">.*?</p>',
                  '<p data-render="call-status"></p>', html, flags=re.S)
    # Interactive state from the snapshot
    html = re.sub(r' class="([^"]*?)\s*is-(?:filtering|on|active|open)\b([^"]*)"', r' class="\1\2"', html)
    html = re.sub(r"\n[ \t]*(?=\n)", "", html)   # no blank lines: re-running gives identical output
    return html.rstrip() + "\n"


def main():
    if not CHROME:
        raise SystemExit("Chromium not found: install it or run with JavaScript only (the site still works).")
    httpd = serve()
    port = httpd.server_address[1]
    for page in PAGES:
        url = f"http://127.0.0.1:{port}/{SITE}/{page.replace('index.html', '')}"
        out = subprocess.run([CHROME, "--headless", "--disable-gpu", "--virtual-time-budget=4000", "--dump-dom", url],
                             capture_output=True, text=True, timeout=60).stdout
        if 'class="wrap foot-grid"' not in out:          # app.js ran: the real footer is there
            raise SystemExit(f"Rendering failed for {page}")
        html = clean(out)
        if page == "404.html":
            # GitHub Pages serves 404.html at any missing URL: links must be absolute site paths
            html = re.sub(r'(href|src)="\./', rf'\1="/{SITE}/', html)
        with open(os.path.join(ROOT, page), "w", encoding="utf-8") as f:
            f.write(html)
        print("pre-rendered", page)
    httpd.shutdown()


if __name__ == "__main__":
    main()
