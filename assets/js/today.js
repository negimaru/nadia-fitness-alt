// "Hoy en el estudio": renders today's real classes from the schedule data
// and marks which one is on now and which is next. Without JS the static
// fallback (link to the weekly timetable) stays in place.
(function () {
  var source = document.getElementById('schedule-data');
  var list = document.getElementById('today-list');
  var title = document.getElementById('today-title');
  if (!source || !list || !title) return;

  var sessions = JSON.parse(source.textContent);
  var DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  var MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  function minutes(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  function forDay(d) {
    return sessions.filter(function (s) { return s.day === d; })
      .sort(function (a, b) { return minutes(a.start) - minutes(b.start); });
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function render() {
    var now = new Date();
    var weekday = now.getDay();          // 0 Sunday … 6 Saturday
    var nowMin = now.getHours() * 60 + now.getMinutes();
    var day = weekday - 1;               // 0 Monday … 4 Friday
    var isToday = day >= 0 && day <= 4;
    var items = isToday ? forDay(day) : [];
    var finished = isToday && items.length && items.every(function (s) { return minutes(s.end) <= nowMin; });
    var heading;

    if (!isToday || finished) {
      // Show the next weekday instead (Monday after Friday/weekend)
      day = isToday && day < 4 ? day + 1 : 0;
      items = forDay(day);
      heading = (isToday && day !== 0 ? 'Mañana, ' : 'El ') + DAYS[day].toLowerCase();
      heading = heading.charAt(0).toUpperCase() + heading.slice(1);
      nowMin = -1;                        // nothing is "now" on another day
    } else {
      heading = DAYS[day] + ' ' + now.getDate() + ' de ' + MONTHS[now.getMonth()];
    }

    title.textContent = heading;
    list.innerHTML = '';
    var nextMarked = false;
    items.forEach(function (s) {
      var li = el('li');
      var start = minutes(s.start), end = minutes(s.end);
      var state;
      if (nowMin >= start && nowMin < end) { li.className = 'is-now'; state = 'Ahora'; }
      else if (nowMin >= end) { li.className = 'is-past'; state = ''; }
      else if (!nextMarked) { state = nowMin < 0 ? '' : 'Siguiente'; nextMarked = true; }
      li.appendChild(el('time', null, s.start + '–' + s.end));
      var name = el('span', 't-name', s.name);
      if (s.note) name.appendChild(el('span', 't-note', s.note));
      li.appendChild(name);
      li.appendChild(state ? el('span', 't-state', state) : el('span'));
      list.appendChild(li);
    });
  }

  render();
  setInterval(render, 60 * 1000);
})();
