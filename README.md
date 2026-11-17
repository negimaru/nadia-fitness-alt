# Nadia Fitness Dance Studio — propuesta alternativa

Versión alternativa de la web de [Nadia Fitness Dance Studio](https://negimaru.github.io/nadia-fitness/), diseñada para no parecer una web genérica hecha con IA. Las reglas de diseño están en [`DESIGN.md`](DESIGN.md).

- **Dirección:** programa impreso de una escuela de baile. Papel cálido, tinta negra, líneas finas, un solo color de acento (rosa) y tipografía de cartel (Anton + Instrument Sans).
- **Elemento propio:** «Hoy en el estudio». La portada muestra las clases de hoy, con la que está en curso y la siguiente, a partir del horario real. En fin de semana, o cuando ya han terminado las clases del día, muestra el siguiente día lectivo.
- **Sin rasgos de plantilla:** sin degradados ni brillos, sin tarjetas, sin hero centrado con dos botones, sin animaciones al hacer scroll y sin datos inventados.

Es una sola página (`index.html`) con secciones numeradas: 01 Clases, 02 Horario, 03 Nadia y 04 Apúntate. Lleva `noindex` para que Google no la confunda con la web actual. Los enlaces legales apuntan a la web actual.

```
index.html              Página
DESIGN.md               Reglas de diseño (colores, tipografía, espaciado, componentes)
assets/css/site.css     Estilos
assets/css/fonts.css    Fuentes servidas desde la propia web (assets/fonts/)
assets/js/today.js      Panel «Hoy en el estudio» (lee el horario de #schedule-data)
assets/js/menu.js       Menú hamburguesa en el móvil
```

El horario está dos veces: en la tabla HTML y en el JSON `#schedule-data` que usa el panel «Hoy». Si cambia una clase, hay que actualizar los dos.

Para probarla en local: `python3 -m http.server` y abre `http://localhost:8000`.
