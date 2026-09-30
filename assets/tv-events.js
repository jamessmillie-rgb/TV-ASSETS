/* TrueVitals event tracker v1 (30 Sept 2026)
   Runs ONLY after analytics consent, alongside session tracker v2 (same tv_sid / tv_vid).
   Records what people do, never what they type: clicks, scroll depth, time on page,
   rage clicks, which fields get focused (by label, never value), form submits, JS errors.
   Health-data pages (quiz, results, dashboard, account) record navigation only:
   no answer text, no field names. Optional Microsoft Clarity loads the same way,
   never on those pages, only if CLARITY_ID is set. */
(function () {
  var SB = 'https://vhhwyzcnytenejtgrgzb.supabase.co/rest/v1/rpc/track_events';
  var KEY = 'sb_publishable_OV2u3jH90Ncpsg3rwT18Ww_nyEOGlRi';
  var CLARITY_ID = ''; // set once James creates the Clarity project
  var CONSENT_KEY = 'tv_cookie_consent_v1';
  var SENSITIVE = /^\/(quiz|quiz-results|dashboard|account-settings|login|join|signup|signup-redirect|verification|reset-password|forgot-password|update-password|thank-you|plan-confirmed|plan-declined|my-journey)(\/|$)/;
  var NAV = /^(next|continue|back|previous|skip|start|begin|build my body map|see my results|see results|submit|finish|done|let'?s go|get started|view panels|book|pay)/i;
  var path = location.pathname.replace(/\/+$/, '') || '/';
  var sensitive = SENSITIVE.test(path);
  var q = [], sentCount = 0, MAX = 150, started = false, t0 = Date.now(), visibleMs = 0, visSince = document.visibilityState === 'visible' ? Date.now() : 0;
  var maxDepth = 0, marks = { 25: 0, 50: 0, 75: 0, 90: 0, 100: 0 }, focused = {}, clicks = [], navClicks = 0;

  function consented() {
    try { var v = localStorage.getItem(CONSENT_KEY); if (v) return !!JSON.parse(v).analytics; } catch (e) {}
    var m = document.cookie.match(/(?:^|; )tv_cookie_consent_v1=([^;]*)/); return m ? m[1] === '1' : false;
  }
  function ids() {
    var sid = window.TV_SESSION, vid = window.TV_VISITOR;
    try { sid = sid || localStorage.getItem('tv_sid'); vid = vid || localStorage.getItem('tv_vid'); } catch (e) {}
    return { sid: sid, vid: vid };
  }
  function device() { var w = window.innerWidth || 0; return w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'; }
  function clip(s, n) { s = (s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n) : s; }
  function push(name, props) { if (!started || sentCount + q.length >= MAX) return; q.push({ name: name, props: props }); if (q.length >= 20) flush(); }
  function flush(final) {
    if (!q.length) return; var i = ids(); if (!i.sid) return;
    var batch = q.splice(0, 40); sentCount += batch.length;
    var body = JSON.stringify({ p: { sid: i.sid, vid: i.vid, path: path, device: device(), events: batch } });
    try { fetch(SB, { method: 'POST', mode: 'cors', credentials: 'omit', keepalive: true, headers: { 'Content-Type': 'application/json', apikey: KEY }, body: body }).catch(function () {}); } catch (e) {}
    if (q.length && !final) setTimeout(flush, 300);
  }
  function hrefInfo(a) {
    try { var u = new URL(a.href, location.href);
      if (u.host !== location.host) return u.host;
      var keep = []; ['panel', 'method'].forEach(function (k) { var v = u.searchParams.get(k); if (v) keep.push(k + '=' + v); });
      return u.pathname + (keep.length ? '?' + keep.join('&') : '') + (u.hash && u.hash.length < 30 ? u.hash : '');
    } catch (e) { return null; }
  }
  function sectionOf(el) {
    var s = el.closest && el.closest('section,[class*="section"],header,footer,nav');
    if (!s) return null; if (s.tagName === 'FOOTER') return 'footer'; if (s.tagName === 'NAV' || /nav/i.test(s.className || '')) return 'nav';
    var h = s.querySelector('h1,h2,h3'); return h ? clip(h.textContent, 50) : null;
  }
  function scrollPct() { var d = document.documentElement, h = (d.scrollHeight || 1) - (window.innerHeight || 0); return h <= 0 ? 100 : Math.min(100, Math.round(((window.scrollY || d.scrollTop) / h) * 100)); }

  function onClick(e) {
    var el = e.target && e.target.closest ? e.target.closest('a,button,[role="button"],summary,input[type="submit"],input[type="button"],label,[onclick]') : null;
    var now = Date.now(); clicks.push({ t: now, x: e.clientX, y: e.clientY }); clicks = clicks.filter(function (c) { return now - c.t < 800; });
    if (clicks.length >= 3) { var c0 = clicks[0], near = clicks.every(function (c) { return Math.abs(c.x - c0.x) < 30 && Math.abs(c.y - c0.y) < 30; });
      if (near) { push('rage_click', { text: sensitive ? null : clip((e.target && e.target.textContent) || '', 40), tag: e.target && e.target.tagName, y: scrollPct() }); clicks = []; } }
    if (!el) return;
    var text = clip(el.getAttribute('aria-label') || el.textContent || el.value || '', 60);
    var props = { el: el.tagName.toLowerCase(), y: scrollPct() };
    if (el.tagName === 'A') props.href = hrefInfo(el);
    if (sensitive) {
      if (NAV.test(text)) { props.text = text; navClicks++; if (/^\/quiz(\/|$)/.test(path)) push('quiz_step', { n: navClicks, label: clip(text, 30) }); }
      else props.text = 'option';
      props.id = null;
    } else {
      props.text = text; if (el.id) props.id = clip(el.id, 40); props.sec = sectionOf(el);
    }
    push('click', props);
    if (props.href && /buy\.stripe\.com|payl8r/.test(props.href)) flush(true);
  }
  function onFocus(e) {
    var f = e.target; if (!f || !/^(INPUT|SELECT|TEXTAREA)$/.test(f.tagName)) return;
    if (f.type === 'hidden' || f.type === 'password') return;
    var key = sensitive ? 'field' : clip(f.name || f.id || f.getAttribute('aria-label') || f.placeholder || f.type, 40);
    if (focused[key]) return; focused[key] = 1; push('field_focus', { field: key, type: f.type || f.tagName.toLowerCase() });
  }
  function onSubmit(e) { var f = e.target; push('form_submit', { form: sensitive ? 'form' : clip(f.id || f.name || f.getAttribute('data-name') || 'form', 40) }); }
  function onScroll() {
    var p = scrollPct(); if (p > maxDepth) maxDepth = p;
    [25, 50, 75, 90, 100].forEach(function (m) { if (!marks[m] && maxDepth >= m) { marks[m] = 1; push('scroll', { depth: m, secs: Math.round((Date.now() - t0) / 1000) }); } });
  }
  function onVis() {
    if (document.visibilityState === 'hidden') { if (visSince) { visibleMs += Date.now() - visSince; visSince = 0; } pageTime(); }
    else visSince = Date.now();
  }
  var timeSent = false;
  function pageTime() {
    if (timeSent) { flush(true); return; } timeSent = true;
    var vis = visibleMs + (visSince ? Date.now() - visSince : 0);
    push('page_time', { secs: Math.round(vis / 1000), total: Math.round((Date.now() - t0) / 1000), depth: maxDepth });
    flush(true);
  }
  function onError(e) { if (!e || !e.message) return; push('js_error', { msg: clip(e.message, 120), src: clip(String(e.filename || '').split('/').pop(), 40), line: e.lineno || null }); }

  function loadClarity() {
    if (!CLARITY_ID || sensitive) return;
    (function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); }; t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i; y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y); })(window, document, 'clarity', 'script', CLARITY_ID);
    try { window.clarity('consent'); } catch (e) {}
  }
  function start() {
    if (started) return; started = true;
    document.addEventListener('click', onClick, true);
    document.addEventListener('focusin', onFocus, true);
    document.addEventListener('submit', onSubmit, true);
    window.addEventListener('scroll', function () { clearTimeout(window.__tvs); window.__tvs = setTimeout(onScroll, 150); }, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', pageTime);
    window.addEventListener('error', onError);
    setInterval(function () { flush(); }, 8000);
    setTimeout(onScroll, 1500);
    loadClarity();
  }
  if (consented()) start();
  else window.addEventListener('tv:consent', function (e) { if (e && e.detail && e.detail.granted) start(); });
})();
