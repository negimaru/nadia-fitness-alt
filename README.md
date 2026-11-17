# Nadia Fitness Dance Studio — propuesta v2 (web completa)

Web de [Nadia Fitness Dance Studio](https://negimaru.github.io/nadia-fitness/) con dirección «programa impreso»: papel, tinta, un solo rosa plano y tipografía de cartel. Las reglas están en [`DESIGN.md`](DESIGN.md) y [`CLAUDE.md`](CLAUDE.md).

**Páginas:** Inicio · Clases · Horario · Quién soy · Contacto · Aviso legal · Privacidad · 404.

## Cómo se edita

**Todo lo que se repite o cambia está en un solo archivo: `assets/js/data.js`.** Ahí van las clases, el horario, el teléfono, el WhatsApp, la dirección, el horario de llamadas, la valoración de Google, las redes, el curso y los datos de la titular para los textos legales. Al cambiar algo ahí se actualizan a la vez:

- la tabla del horario y su versión para el móvil, con los filtros;
- el panel «Hoy en el estudio»;
- las fichas de clase y la lista de la portada;
- el pie, la cabecera y la barra de Llamar/WhatsApp;
- el formulario de contacto;
- los textos legales;
- los datos para Google (JSON-LD).

Lo único que no se actualiza solo es el `<title>` y la descripción de cada página, que tienen que ser fijos para buscadores y vistas previas. Hay que revisarlos al cambiar de curso.

Clases sin foto: `python3 tools/make_placeholders.py` genera la imagen de muestra a partir de `data.js`. Para poner la foto real, sustituye `assets/img/clases/<id>.webp` y pon `"placeholder": false` en esa clase.

```
assets/js/data.js       Datos (única fuente)
assets/js/app.js        Pinta todo a partir de los datos + tema, menú y formulario
assets/css/site.css     Estilos
tools/make_placeholders.py
sitemap.xml, robots.txt, site.webmanifest
```

## SEO

Cada página tiene su título, descripción, canonical, Open Graph y Twitter card. El JSON-LD (dirección, coordenadas, horario y clases) se genera desde `data.js`, y además hay sitemap, robots, manifest e iconos. Mientras sea una propuesta, todas las páginas llevan `noindex`: basta con quitar esa línea cuando sustituya a la web actual.

Para probarla en local: `python3 -m http.server` y abre `http://localhost:8000`.
