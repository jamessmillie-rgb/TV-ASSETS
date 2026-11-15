/* TrueVitals report tour (/our-report) v1.0, 11 Nov 2026.
   One switch flips every figure on the page between the first test and the retest three months later.
   Without this script the page shows the first test, complete and readable. */
(function () {
  var root = document.querySelector('.rt');
  if (!root) return;
  var buttons = root.querySelectorAll('.rt-sw button');
  function set(t) {
    root.setAttribute('data-test', t);
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-t') === t ? 'true' : 'false'); });
    root.querySelectorAll('[data-v' + t + ']').forEach(function (el) { el.textContent = el.getAttribute('data-v' + t); });
    root.querySelectorAll('[data-c' + t + ']').forEach(function (el) { el.className = el.getAttribute('data-c' + t); });
    root.querySelectorAll('[data-s' + t + ']').forEach(function (el) { el.setAttribute('style', el.getAttribute('data-s' + t)); });
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () { set(b.getAttribute('data-t')); });
  });
  // remember the first-test values so switching back restores them
  root.querySelectorAll('[data-v2]').forEach(function (el) { if (!el.hasAttribute('data-v1')) el.setAttribute('data-v1', el.textContent); });
  root.querySelectorAll('[data-c2]').forEach(function (el) { if (!el.hasAttribute('data-c1')) el.setAttribute('data-c1', el.className); });
  root.querySelectorAll('[data-s2]').forEach(function (el) { if (!el.hasAttribute('data-s1')) el.setAttribute('data-s1', el.getAttribute('style') || ''); });
  // the one load moment: rings fill, and the change lines draw when the tracking step scrolls in
  requestAnimationFrame(function () { root.classList.add('is-ready'); });
  var track = root.querySelector('#rt-track');
  if (track && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es, o) {
      es.forEach(function (e) { if (e.isIntersecting) { root.classList.add('is-seen'); o.disconnect(); } });
    }, { threshold: 0.25 }).observe(track);
  } else { root.classList.add('is-seen'); }
})();
