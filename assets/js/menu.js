// Mobile burger menu: toggles the section list; closes on link click, Escape or outside tap.
(function () {
  var button = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  if (!button || !menu) return;
  function set(open) {
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('is-open', open);
  }
  button.addEventListener('click', function () { set(button.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { set(false); button.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('is-open') && !e.target.closest('.band')) set(false);
  });
})();
