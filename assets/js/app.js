// Nadia Fitness Dance Studio — renders every shared or data-driven part of the site from window.NF (data.js).
// Pages only contain their own prose and empty slots:
//   <header data-layout="header">, <footer data-layout="footer">
//   [data-bind="key"]       text from the data (phone, address, counts…)
//   [data-href="key"]       link from the data (tel, whatsapp, maps…)
//   [data-render="name"]    a component (class-list, class-detail, timetable, today, calls, …)
(function () {
  var NF = window.NF;
  if (!NF) return;
  var S = NF.studio;
  var script = document.currentScript;
  // Site root as a path RELATIVE to the current page ('./', '../', …), so links stay valid on any host
  // and in pre-rendered HTML (tools/prerender.py)
  var basePath = script ? new URL(script.src).pathname.replace(/assets\/js\/app\.js.*$/, '') : '/';
  var rest = location.pathname.indexOf(basePath) === 0 ? location.pathname.slice(basePath.length) : null;
  var BASE = rest === null ? basePath : (rest.split('/').length > 1 ? new Array(rest.split('/').length).join('../') : './');
  var PAGE = document.body.getAttribute('data-page') || '';
  var params = new URLSearchParams(location.search);

  // ---------- helpers ----------
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (attrs[k] != null && attrs[k] !== false) n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function minutes(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  function byTime(a, b) { return minutes(a.start) - minutes(b.start); }
  function classById(id) { return NF.classes.filter(function (c) { return c.id === id; })[0]; }
  function sessionName(s) { return s.label || classById(s.class).name; }
  function sessionsOf(id) { return NF.sessions.filter(function (s) { return s.class === id; }); }
  function slotOf(s) { var m = minutes(s.start); return m < 12 * 60 ? 'Mañana' : m < 15 * 60 ? 'Mediodía' : m < 19 * 60 ? 'Tarde' : 'Noche'; }
  var SLOTS = ['Mañana', 'Mediodía', 'Tarde', 'Noche'];
  var SHORT = NF.days.map(function (d) { return d.slice(0, 3); });
  function joinDays(days) {
    var names = days.map(function (d) { return SHORT[d]; });
    return names.length < 2 ? names[0] : names.slice(0, -1).join(', ') + ' y ' + names[names.length - 1];
  }
  // "Mar y Jue 16:30–17:30" lines for one class, grouping days that share a time
  function whenLines(id) {
    var groups = {};
    var order = [];
    sessionsOf(id).slice().sort(function (a, b) { return a.day - b.day || byTime(a, b); }).forEach(function (s) {
      var key = s.start + '–' + s.end + (s.label ? ' · ' + s.label.replace(/^.* (\d)$/, 'Int. $1') : '');
      if (!groups[key]) { groups[key] = []; order.push(key); }
      if (groups[key].indexOf(s.day) < 0) groups[key].push(s.day);
    });
    order.sort(function (a, b) { return groups[a][0] - groups[b][0] || minutes(a.split('–')[0]) - minutes(b.split('–')[0]); });
    return order.map(function (k) { return joinDays(groups[k]) + ' ' + k; });
  }
  var LINKS = {
    tel: 'tel:' + S.phoneIntl,
    whatsapp: 'https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(S.whatsappText),
    maps: S.mapsUrl, reviews: S.reviewsUrl, instagram: S.instagram, facebook: S.facebook
  };
  var BINDS = {
    phone: S.phone, name: S.name, street: S.street,
    city: S.postalCode + ' ' + S.locality + ', ' + S.region,
    address: S.street + ', ' + S.postalCode + ' ' + S.locality + ' (' + S.region + ')',
    season: S.season, rating: S.rating.value, ratingCount: String(S.rating.count),
    classCount: String(NF.classes.length), sessionCount: String(NF.sessions.length),
    firstStart: NF.sessions.slice().sort(byTime)[0].start,
    lastEnd: NF.sessions.slice().sort(function (a, b) { return minutes(b.end) - minutes(a.end); })[0].end,
    instagramHandle: S.instagramHandle, legalUpdated: NF.legalUpdated
  };
  var OWNER_LABELS = { name: 'Nombre completo de la titular o razón social', nif: 'NIF / DNI', email: 'Email de contacto' };

  // ---------- icons (inline, 20px) ----------
  function icon(paths) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>'; }
  var I_PHONE = icon('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>');
  var I_SUN = '<span class="i-sun">' + icon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>') + '</span>';
  var I_MOON = '<span class="i-moon">' + icon('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>') + '</span>';

  // ---------- layout: header, footer, mobile call bar ----------
  var NAV = [['clases/', 'Clases'], ['horario/', 'Horario'], ['quien-soy/', 'Quién soy'], ['contacto/', 'Contacto']];
  function renderHeader(slot) {
    // "Inicio" first (unnumbered), then the numbered programme sections 01–04
    var items = '<li><a href="' + BASE + '"' + (PAGE === '' ? ' aria-current="page"' : '') + '><span class="n n-blank" aria-hidden="true">00</span>Inicio</a></li>' + NAV.map(function (n, i) {
      var current = PAGE === n[0].replace('/', '');
      return '<li><a href="' + BASE + n[0] + '"' + (current ? ' aria-current="page"' : '') + '><span class="n" aria-hidden="true">0' + (i + 1) + '</span>' + n[1] + '</a></li>';
    }).join('');
    slot.innerHTML =
      '<div class="wrap band-in">' +
      '<a class="brand" href="' + BASE + '"><img src="' + BASE + 'assets/img/logo.png" alt="' + S.name + ', inicio" width="110" height="60"></a>' +
      '<nav class="nav" aria-label="Principal">' +
      '<button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Abrir menú"><span></span><span></span><span></span></button>' +
      '<ul id="menu">' + items + '<li class="menu-phone"><a href="' + LINKS.tel + '">' + S.phone + '</a></li></ul></nav>' +
      '<a class="band-phone" href="' + LINKS.tel + '">' + S.phone + '</a>' +
      '<button class="theme" type="button" aria-label="Cambiar a modo oscuro">' + I_MOON + I_SUN + '</button>' +
      '</div>';
  }
  function renderFooter(slot) {
    var calls = NF.callHours.map(function (c) { return '<li><span>' + NF.days[c.day] + '</span><span>' + c.from + '–' + c.to + '</span></li>'; }).join('');
    var pages = [['', 'Inicio']].concat(NAV).map(function (n) { return '<li><a href="' + BASE + n[0] + '">' + n[1] + '</a></li>'; }).join('');
    slot.innerHTML =
      '<div class="wrap foot-grid">' +
      '<div><img class="foot-logo" src="' + BASE + 'assets/img/logo.png" alt="" width="110" height="60" loading="lazy"><p>' + S.tagline + '.</p>' +
      '<p><a href="' + S.instagram + '" rel="noopener">' + S.instagramHandle + '</a> · <a href="' + S.facebook + '" rel="noopener">Facebook</a></p></div>' +
      '<div><h2 class="label">Contacto</h2><p><a href="' + LINKS.tel + '">' + S.phone + '</a><br><a href="' + LINKS.whatsapp + '" target="_blank" rel="noopener">WhatsApp</a></p>' +
      '<p>' + S.street + '<br>' + BINDS.city + '</p></div>' +
      '<div><h2 class="label">Horario de llamadas</h2><ul class="foot-calls">' + calls + '</ul></div>' +
      '<div><h2 class="label">Páginas</h2><ul class="foot-pages">' + pages + '</ul></div>' +
      '</div>' +
      '<div class="wrap foot-legal"><p>© <span>' + new Date().getFullYear() + '</span> ' + S.name + ' · ' + S.locality + '</p>' +
      '<p><a href="' + BASE + 'aviso-legal/">Aviso legal</a> · <a href="' + BASE + 'privacidad/">Privacidad</a> · Propuesta de diseño v2</p></div>';
    Array.prototype.forEach.call(document.querySelectorAll('.callbar'), function (old) { old.remove(); });
    var bar = el('nav', { 'class': 'callbar', 'aria-label': 'Contacto rápido' });
    bar.innerHTML = '<a class="callbar-call" href="' + LINKS.tel + '">' + I_PHONE + 'Llamar</a><a class="callbar-wa" href="' + LINKS.whatsapp + '" target="_blank" rel="noopener">WhatsApp</a>';
    slot.parentNode.insertBefore(bar, slot.nextSibling);
  }

  // ---------- components ----------
  var R = {};
  var ttCount = 0;

  // Home: compact ruled list linking to the class page
  R['class-list'] = function (slot) {
    var ol = el('ol', { 'class': 'cl-list' });
    NF.classes.forEach(function (c, i) {
      ol.appendChild(el('li', { 'class': 'cl-row' }, [
        el('span', { 'class': 'cl-num', text: (i + 1 < 10 ? '0' : '') + (i + 1) }),
        el('div', { 'class': 'cl-main' }, [
          el('h3', { 'class': 'cl-name' }, [el('span', { 'class': 'dot dot-' + c.type, 'aria-hidden': 'true' }), el('a', { href: BASE + 'clases/#' + c.id, text: c.name })]),
          el('p', { 'class': 'cl-desc', text: c.summary })
        ]),
        el('div', { 'class': 'cl-meta' }, [
          el('span', { 'class': 'cl-aud', text: c.kind + ' · ' + c.audience }),
          el('p', { 'class': 'cl-when' }, whenLines(c.id).map(function (w) { return el('span', { text: w }); }))
        ])
      ]));
    });
    slot.appendChild(ol);
  };

  // Classes page: one numbered section per class
  R['class-detail'] = function (slot) {
    NF.classes.forEach(function (c, i) {
      var media = el('img', { 'class': 'cd-photo' + (c.placeholder ? ' is-placeholder' : ''), src: BASE + 'assets/img/' + c.photo + (c.placeholder ? '?v=1' : ''), alt: c.placeholder ? '' : c.photoAlt,
        srcset: c.placeholder ? null : BASE + 'assets/img/' + c.photo.replace('.webp', '-480.webp') + ' 480w, ' + BASE + 'assets/img/' + c.photo + ' 840w', sizes: c.placeholder ? null : '(max-width: 860px) 100vw, 420px', width: c.placeholder ? 1200 : 840, height: c.placeholder ? 750 : 840, loading: i > 1 ? 'lazy' : null });
      slot.appendChild(el('article', { 'class': 'cd', id: c.id }, [
        el('span', { 'class': 'cd-num', text: (i + 1 < 10 ? '0' : '') + (i + 1) }),
        el('div', { 'class': 'cd-main' }, [
          el('p', { 'class': 'cl-aud', text: c.kind + ' · ' + c.audience }),
          el('h2', { 'class': 'cd-name' }, [el('span', { 'class': 'dot dot-' + c.type, 'aria-hidden': 'true' }), c.name]),
          el('p', { 'class': 'cd-desc', text: c.description }),
          el('ul', { 'class': 'cd-when', 'aria-label': 'Horario de ' + c.name }, whenLines(c.id).map(function (w) { return el('li', { text: w }); })),
          el('p', { 'class': 'cd-actions' }, [
            el('a', { 'class': 'link-cta', href: BASE + 'contacto/?clase=' + c.id, html: 'Reservar plaza <span aria-hidden="true">→</span>' }),
            el('a', { 'class': 'link-cta link-quiet', href: BASE + 'horario/?clase=' + c.id, html: 'Ver en el horario <span aria-hidden="true">→</span>' })
          ])
        ]),
        media
      ]));
    });
  };

  // About page: plain list of the classes she teaches
  R['class-index'] = function (slot) {
    var ul = el('ul', { 'class': 'plain-list' });
    NF.classes.forEach(function (c) {
      ul.appendChild(el('li', null, [el('a', { href: BASE + 'clases/#' + c.id, text: c.name }), el('span', { text: c.kind + ' · ' + c.audience })]));
    });
    slot.appendChild(ul);
  };

  // Weekly timetable: table on desktop, one list per day on mobile, optional class filter
  R.timetable = function (slot) {
    var withFilters = slot.hasAttribute('data-filters');
    var items = [];
    function item(s) {
      var c = classById(s.class);
      var li = el('li', { 'class': 'tt-item tt-' + c.type, 'data-class': c.id }, [
        el('time', { text: s.start + '–' + s.end }), sessionName(s),
        s.note ? el('small', { text: s.note }) : null
      ]);
      items.push(li);
      return li;
    }
    var table = el('table', { 'class': 'tt' }, [
      el('caption', { 'class': 'sr-only', text: 'Horario semanal de clases, de lunes a viernes' }),
      el('thead', null, [el('tr', null, [el('td')].concat(NF.days.map(function (d) { return el('th', { scope: 'col', text: d }); })))])
    ]);
    var tbody = el('tbody');
    SLOTS.forEach(function (slotName) {
      var cells = NF.days.map(function (_, d) {
        var list = NF.sessions.filter(function (s) { return s.day === d && slotOf(s) === slotName; }).sort(byTime);
        return el('td', null, list.length ? [el('ul', null, list.map(item))] : []);
      });
      tbody.appendChild(el('tr', null, [el('th', { scope: 'row', text: slotName })].concat(cells)));
    });
    table.appendChild(tbody);
    // Mobile: one tab per day (opens on today; Monday at weekends), arrow keys move between days
    var uid = 'tt' + (++ttCount);
    var weekday = new Date().getDay();
    var todayIdx = weekday >= 1 && weekday <= 5 ? weekday - 1 : -1;
    var tabs = el('div', { 'class': 'tt-tabs', role: 'tablist', 'aria-label': 'Día de la semana' });
    var tabButtons = [], dayEls = [];
    var days = el('div', { 'class': 'tt-days' }, NF.days.map(function (d, i) {
      var list = NF.sessions.filter(function (s) { return s.day === i; }).sort(byTime);
      var t = el('button', { type: 'button', role: 'tab', id: uid + '-t' + i, 'aria-controls': uid + '-p' + i, 'class': 'tt-tab' },
        [el('b', { text: d.slice(0, 3) }), el('span', { text: i === todayIdx ? 'Hoy' : list.length + ' clases' })]);
      t.addEventListener('click', function () { showDay(i); });
      t.addEventListener('keydown', function (e) {
        var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        var n = (i + step + NF.days.length) % NF.days.length;
        showDay(n); tabButtons[n].focus();
      });
      tabButtons.push(t); tabs.appendChild(t);
      var panel = el('div', { 'class': 'tt-day', id: uid + '-p' + i, role: 'tabpanel', 'aria-labelledby': uid + '-t' + i }, [el('h3', { text: d }), el('ul', null, list.map(item))]);
      dayEls.push(panel);
      return panel;
    }));
    function showDay(i) {
      tabButtons.forEach(function (t, k) { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
      dayEls.forEach(function (p, k) { p.classList.toggle('is-active', k === i); });
    }
    showDay(todayIdx >= 0 ? todayIdx : 0);

    if (withFilters) {
      var status = el('p', { 'class': 'sr-only', 'aria-live': 'polite' });
      var bar = el('div', { 'class': 'filters', role: 'group', 'aria-label': 'Filtrar el horario por clase' });
      var buttons = [];
      function select(id) {
        var n = 0;
        items.forEach(function (li) { var on = !!id && li.getAttribute('data-class') === id; li.classList.toggle('is-on', on); if (on) n++; });
        slot.classList.toggle('is-filtering', !!id);
        dayEls.forEach(function (p) { p.classList.toggle('has-on', !!p.querySelector('.is-on')); });
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-class') === id)); });
        status.textContent = id ? classById(id).name + ': ' + (n / 2) + ' sesiones a la semana' : '';
      }
      [{ id: '', name: 'Todas' }].concat(NF.classes).forEach(function (c) {
        var b = el('button', { type: 'button', 'class': 'filter' + (c.type ? ' f-' + c.type : ''), 'data-class': c.id, text: c.name });
        b.addEventListener('click', function () { select(b.getAttribute('aria-pressed') === 'true' || !c.id ? '' : c.id); });
        buttons.push(b);
        bar.appendChild(b);
      });
      slot.appendChild(bar);
      slot.appendChild(status);
      var pre = params.get('clase');
      setTimeout(function () { select(pre && classById(pre) ? pre : ''); }, 0);
    }
    slot.appendChild(table);
    slot.appendChild(tabs);
    slot.appendChild(days);
  };

  // "Hoy en el estudio": today's classes with now / next (next weekday at weekends or after the last class)
  R.today = function (slot) {
    var MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    var title = el('h2', { 'class': 'today-date', id: 'today-title' });
    var list = el('ol', { 'class': 'today-list' });
    slot.setAttribute('aria-labelledby', 'today-title');
    slot.appendChild(el('p', { 'class': 'label', html: '<span class="live" aria-hidden="true"></span>Hoy en el estudio' }));
    slot.appendChild(title);
    slot.appendChild(list);
    slot.appendChild(el('p', { 'class': 'today-foot' }, [el('a', { href: BASE + 'horario/', text: 'Semana completa →' })]));
    function forDay(d) { return NF.sessions.filter(function (s) { return s.day === d; }).sort(byTime); }
    function render() {
      var now = new Date(), day = now.getDay() - 1, nowMin = now.getHours() * 60 + now.getMinutes();
      var isToday = day >= 0 && day <= 4, items = isToday ? forDay(day) : [];
      var finished = isToday && items.length && items.every(function (s) { return minutes(s.end) <= nowMin; });
      var heading;
      if (!isToday || finished) {
        day = isToday && day < 4 ? day + 1 : 0;
        items = forDay(day);
        heading = (isToday && day !== 0 ? 'Mañana, ' + NF.days[day].toLowerCase() : 'El ' + NF.days[day].toLowerCase());
        heading = heading.charAt(0).toUpperCase() + heading.slice(1);
        nowMin = -1;
      } else {
        heading = NF.days[day] + ' ' + now.getDate() + ' de ' + MONTHS[now.getMonth()];
      }
      title.textContent = heading;
      list.innerHTML = '';
      var nextMarked = false;
      items.forEach(function (s) {
        var start = minutes(s.start), end = minutes(s.end), state = '', cls = '';
        if (nowMin >= start && nowMin < end) { cls = 'is-now'; state = 'Ahora'; }
        else if (nowMin >= end) { cls = 'is-past'; }
        else if (!nextMarked) { state = nowMin < 0 ? '' : 'Siguiente'; nextMarked = true; }
        list.appendChild(el('li', { 'class': cls || null }, [
          el('time', { text: s.start + '–' + s.end }),
          el('span', { 'class': 't-name' }, [sessionName(s), s.note ? el('span', { 'class': 't-note', text: s.note }) : null]),
          state ? el('span', { 'class': 't-state', text: state }) : el('span')
        ]));
      });
    }
    function tick() { if (!document.hidden) render(); }   // no updates while the tab is not visible
    tick();
    setInterval(tick, 60000);
    document.addEventListener('visibilitychange', tick);
  };

  // "¿Atendemos llamadas ahora?" from NF.callHours; suggests WhatsApp when the phone is not attended
  R['call-status'] = function (slot) {
    function render() {
      var now = new Date(), d = now.getDay() - 1, m = now.getHours() * 60 + now.getMinutes();
      var today = NF.callHours.filter(function (c) { return c.day === d; })[0];
      var open = today && m >= minutes(today.from) && m < minutes(today.to);
      var text;
      if (open) text = 'Ahora atendemos llamadas, hasta las ' + today.to + '.';
      else if (today && m < minutes(today.from)) text = 'Hoy atendemos llamadas de ' + today.from + ' a ' + today.to + '.';
      else {
        var next = null;
        for (var k = 1; k <= 7 && !next; k++) { var dd = (now.getDay() - 1 + k + 7) % 7; next = NF.callHours.filter(function (c) { return c.day === dd; })[0]; }
        text = 'Ahora no atendemos llamadas. Llámanos ' + (next.day === now.getDay() ? 'mañana' + (now.getDay() === 0 ? ' lunes' : '') : 'el ' + NF.days[next.day].toLowerCase())   /* tomorrow's index is today's getDay() */ + ' de ' + next.from + ' a ' + next.to + ', o escríbenos por WhatsApp.';
      }
      slot.className = 'call-status' + (open ? ' is-open' : '');
      slot.innerHTML = '';
      slot.appendChild(el('span', { 'class': 'call-dot', 'aria-hidden': 'true' }));
      slot.appendChild(document.createTextNode(text));
      if (!open) { slot.appendChild(document.createTextNode(' ')); slot.appendChild(el('a', { href: LINKS.whatsapp, target: '_blank', rel: 'noopener' }, ['Abrir WhatsApp', el('span', { 'class': 'sr-only', text: ' (se abre en otra pestaña)' })])); }
    }
    render();
    setInterval(function () { if (!document.hidden) render(); }, 60000);
  };

  R.calls = function (slot) {
    var t = el('table', { 'class': 'calls' }, [el('tbody', null, NF.callHours.map(function (c) {
      return el('tr', null, [el('th', { scope: 'row', text: NF.days[c.day] }), el('td', { text: c.from + '–' + c.to })]);
    }))]);
    slot.appendChild(t);
  };

  R.rating = function (slot) {
    slot.appendChild(el('a', { href: S.reviewsUrl, target: '_blank', rel: 'noopener', html: '<b>' + S.rating.value + '</b> <span aria-hidden="true">★★★★★</span> ' + S.rating.count + ' reseñas en Google <span aria-hidden="true">→</span>' }));
  };

  R['class-options'] = function (select) {
    NF.classes.forEach(function (c) { select.appendChild(el('option', { value: c.id, text: c.name })); });
    select.appendChild(el('option', { value: '', text: 'Aún no lo sé' }));
    var pre = params.get('clase');
    if (pre && classById(pre)) select.value = pre;
  };

  // ---------- data binding ----------
  function bindAll(root) {
    Array.prototype.forEach.call(root.querySelectorAll('[data-bind]'), function (n) {
      var key = n.getAttribute('data-bind');
      if (key.indexOf('owner.') === 0) {
        var k = key.slice(6), v = NF.owner[k];
        if (v) { n.textContent = v; n.classList.remove('ph-mark'); }
        else { n.textContent = '[' + OWNER_LABELS[k] + ']'; n.classList.add('ph-mark'); }
      } else if (BINDS[key] != null) n.textContent = BINDS[key];
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-href]'), function (n) {
      var v = LINKS[n.getAttribute('data-href')];
      if (v) n.setAttribute('href', v);
    });
  }

  // ---------- structured data (Google renders JS-injected JSON-LD) ----------
  function jsonLd() {
    var times = NF.sessions.slice().sort(byTime);
    var data = {
      '@context': 'https://schema.org', '@type': 'SportsActivityLocation', name: S.name,
      description: S.tagline + ': grupos de dance por niveles, Fitdance, PowerHIIT y Aquafitness.',
      url: S.siteUrl, telephone: S.phoneIntl, image: S.siteUrl + 'assets/img/og-nadia-fitness.jpg',
      address: { '@type': 'PostalAddress', streetAddress: S.street, postalCode: S.postalCode, addressLocality: S.locality, addressRegion: S.region, addressCountry: S.country },
      geo: { '@type': 'GeoCoordinates', latitude: S.geo.lat, longitude: S.geo.lng },
      hasMap: S.mapsUrl, areaServed: S.areaServed, sameAs: [S.instagram, S.facebook],
      openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: times[0].start.padStart(5, '0'), closes: BINDS.lastEnd.padStart(5, '0') }],
      makesOffer: NF.classes.map(function (c) { return { '@type': 'Offer', itemOffered: { '@type': 'Service', name: c.name, description: c.summary } }; })
    };
    Array.prototype.forEach.call(document.querySelectorAll('script[type="application/ld+json"]'), function (old) { old.remove(); });
    document.head.appendChild(el('script', { type: 'application/ld+json', text: JSON.stringify(data) }));
  }

  // ---------- behaviour: theme, burger, form ----------
  function setupTheme() {
    var KEY = 'nf2-theme', root = document.documentElement;
    var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    var btn = document.querySelector('.theme');
    function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
    function apply(t) { root.setAttribute('data-theme', t); if (btn) btn.setAttribute('aria-label', t === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'); }
    apply(stored() || (media && media.matches ? 'dark' : 'light'));
    if (media && media.addEventListener) media.addEventListener('change', function (e) { if (!stored()) apply(e.matches ? 'dark' : 'light'); });
    if (btn) btn.addEventListener('click', function () {
      var t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, t); } catch (e) {}
      apply(t);
    });
  }
  function setupBurger() {
    var button = document.querySelector('.burger'), menu = document.getElementById('menu');
    if (!button || !menu) return;
    function set(open) { button.setAttribute('aria-expanded', String(open)); button.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); menu.classList.toggle('is-open', open); }
    button.addEventListener('click', function () { set(button.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) { set(false); button.focus(); } });
    document.addEventListener('click', function (e) { if (menu.classList.contains('is-open') && !e.target.closest('.band')) set(false); });
  }
  function setupForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.setAttribute('novalidate', '');
    var nameInput = form.elements['contact-name'], nameError = document.getElementById('contact-name-error');
    function clearNameError() { nameInput.removeAttribute('aria-invalid'); nameError.hidden = true; }
    nameInput.addEventListener('input', function () { if (nameInput.value.trim()) clearNameError(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!nameInput.value.trim()) {
        // Our own message next to the field, announced and focused
        nameInput.setAttribute('aria-invalid', 'true');
        nameError.hidden = false;
        nameInput.focus();
        return;
      }
      clearNameError();
      var f = form.elements, c = classById(f['contact-class'].value);
      var text = '¡Hola! Soy ' + f['contact-name'].value.trim() + '. ' + (c ? 'Me interesa ' + c.name + '.' : 'Quiero información sobre las clases.');
      if (f['contact-message'].value.trim()) text += ' ' + f['contact-message'].value.trim();
      if (f['contact-phone'].value.trim()) text += ' Mi teléfono: ' + f['contact-phone'].value.trim() + '.';
      window.open('https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }

  // ---------- go ----------
  var header = document.querySelector('[data-layout="header"]');
  var footer = document.querySelector('[data-layout="footer"]');
  if (header) renderHeader(header);
  if (footer) renderFooter(footer);
  Array.prototype.forEach.call(document.querySelectorAll('[data-render]'), function (slot) {
    var fn = R[slot.getAttribute('data-render')];
    if (fn) { slot.innerHTML = ''; fn(slot); }   // pages may arrive pre-rendered (tools/prerender.py): always render fresh from data.js
  });
  bindAll(document);
  Array.prototype.forEach.call(document.querySelectorAll('[data-print]'), function (b) { b.addEventListener('click', function () { window.print(); }); });
  // Links that open a new tab say so to screen readers
  Array.prototype.forEach.call(document.querySelectorAll('a[target="_blank"]'), function (a) {
    if (!a.querySelector('.sr-only')) a.appendChild(el('span', { 'class': 'sr-only', text: ' (se abre en otra pestaña)' }));
  });
  jsonLd();
  setupTheme();
  setupBurger();
  setupForm();

  // "Volver" on legal pages: go back if we came from this site, otherwise the link's href (home)
  Array.prototype.forEach.call(document.querySelectorAll('[data-back]'), function (a) {
    a.addEventListener('click', function (e) {
      var ref = document.referrer;
      if (ref && ref.indexOf(location.origin) === 0 && ref !== location.href && history.length > 1) {
        e.preventDefault();
        history.back();
      }
    });
  });
  // Re-apply a #hash scroll once the rendered content exists (e.g. /clases/#powerhiit)
  if (location.hash) { var target = document.getElementById(location.hash.slice(1)); if (target) target.scrollIntoView(); }
})();
