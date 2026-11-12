/* TrueVitals friend links v1.1.0 (12 Nov 2026, James). 1.1 adds reward links: a customer whose friend has bought gets
   ?reward=REWARD-XXXXXX, worth £50 off their own next test, handled the same way (note, claim buttons, no code).
   Every customer has a personal link: https://www.truevitals.co.uk/ultimate-panel?friend=SHARE-XXXX (works on any page).
   A friend who arrives through it gets £50 off Ultimate or £100 off Signature with nothing to type:
   1. The link is checked with the checkout Worker (GET /friend) and remembered on this device for 30 days.
   2. A small note says whose gift it is, with buttons that start checkout through the checkout Worker, which applies
      the discount itself (no code box).
   3. The booking page's add-on route already uses the Worker, so the friend code is added to that call. An ordinary Pay
      press on Ultimate or Signature is also sent through the Worker where the browser supports it.
   If anything fails, the normal Pay link is used, at the normal price, so a sale is never blocked.
   Advanced has no friend discount and is left alone. A firm link (?firm=) takes priority; the two never stack.
   Never edit this file in place (SRI): put changes in a new file name and register a new version. */
(function () {
  var W = 'https://truevitals-checkout.james-smillie-8c6.workers.dev';
  var KEY = 'tv_friend', DAYS = 30;
  var LINKS = {
    '9B600dgu13cv1Z52pvbbG1v': { panel: 'ultimate', method: 'clinic' },
    '4gM7sFa5DbJ1avB7JPbbG1w': { panel: 'ultimate', method: 'home' },
    '28EbIVdhP7sL0V1d49bbG0c': { panel: 'signature', method: 'clinic' }
  };
  function get() {
    try { var v = JSON.parse(localStorage.getItem(KEY) || 'null'); if (v && v.code && Date.now() - v.ts < DAYS * 864e5) return v; } catch (e) {}
    return null;
  }
  function param(n) { try { return new URL(location.href).searchParams.get(n) || ''; } catch (e) { return ''; } }
  function hasFirm() { try { return !!param('firm') || !!sessionStorage.getItem('tv_firm') || !!localStorage.getItem('tv_firm'); } catch (e) { return !!param('firm'); } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function note(f) {
    if (document.getElementById('tvfr') || hasFirm()) return;
    try { if (sessionStorage.getItem('tv_friend_x') === '1') return; } catch (e) {}
    var st = document.createElement('style');
    st.textContent = '#tvfr{position:fixed;left:16px;bottom:16px;z-index:9980;max-width:340px;background:#0b1512;color:#fff;border:1px solid rgba(44,228,173,.45);border-radius:14px;padding:12px 38px 12px 14px;font-family:Montserrat,Arial,sans-serif;font-size:13px;line-height:1.45;box-shadow:0 10px 30px rgba(0,0,0,.28)}' +
      '#tvfr b{color:#2ce4ad;font-weight:700}#tvfr button.x{position:absolute;right:8px;top:6px;background:none;border:0;color:rgba(255,255,255,.6);font-size:18px;line-height:1;cursor:pointer;padding:6px}' +
      '#tvfr .r{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px}#tvfr .r span{font-size:12px;color:rgba(255,255,255,.7);width:100%}' +
      '#tvfr .r a{background:#2ce4ad;color:#04211a;font-weight:700;text-decoration:none;border-radius:100px;padding:8px 14px;font-size:12.5px}' +
      '#tvfr #tvfrE{margin-top:8px;color:#fecaca;font-size:12px}' +
      '@media(max-width:640px){#tvfr{left:10px;right:10px;max-width:none;bottom:92px}}';
    document.head.appendChild(st);
    var d = document.createElement('div'); d.id = 'tvfr'; d.setAttribute('role', 'status');
    var rw = f.kind === 'reward', offU = rw ? 50 : 50, offS = rw ? 50 : 100;
    d.innerHTML = '<b>' + (rw ? (f.name ? esc(f.name) + ', your' : 'Your') + ' £50 thank-you for referring a friend is ready.' : (f.name ? esc(f.name) + ' sent you' : 'You have') + ' £50 off Ultimate or £100 off Signature.') + '</b> No code needed: book with these buttons and it comes off at checkout.' +
      '<div class="r" id="tvfrA"><a href="#" data-p="ultimate">Ultimate £' + (399 - offU) + '</a><a href="#" data-p="signature">Signature £' + (799 - offS) + '</a></div>' +
      '<div class="r" id="tvfrB" style="display:none"><span>Blood draw for Ultimate:</span><a href="#" data-m="clinic">At a clinic, included</a><a href="#" data-m="home">At home, +£29</a></div>' +
      '<div id="tvfrE" style="display:none">Checkout could not start just now. Please try again, or email support@truevitals.co.uk and we will apply it for you.</div>' +
      '<button class="x" aria-label="Hide">×</button>';
    d.querySelector('button.x').addEventListener('click', function () { d.remove(); try { sessionStorage.setItem('tv_friend_x', '1'); } catch (e) {} });
    var bad = function () { var e = d.querySelector('#tvfrE'); if (e) e.style.display = 'block'; };
    d.addEventListener('click', function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest('a[data-p],a[data-m]') : null; if (!a) return;
      ev.preventDefault();
      if (a.getAttribute('data-p') === 'signature') { a.textContent = 'Starting checkout…'; window.TVFriend.start('signature', 'clinic', '', bad); }
      else if (a.getAttribute('data-p') === 'ultimate') { d.querySelector('#tvfrA').style.display = 'none'; d.querySelector('#tvfrB').style.display = 'flex'; }
      else { a.textContent = 'Starting checkout…'; window.TVFriend.start('ultimate', a.getAttribute('data-m'), '', bad); }
    });
    (document.body || document.documentElement).appendChild(d);
  }
  function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

  // 1. arrive with a link
  var raw = (param('reward') || param('friend')).toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 24);
  if (/^(SHARE-[A-Z0-9]{4,8}|REWARD-[A-Z0-9]{6,10})$/.test(raw)) {
    var cur = get();
    if (cur && cur.code === raw) ready(function () { note(cur); });
    else {
      try {
        fetch(W + '/friend?code=' + encodeURIComponent(raw)).then(function (r) { return r.json(); }).then(function (j) {
          if (!j || !j.ok) return;
          var f = { code: j.code, name: j.name || '', kind: j.kind === 'reward' ? 'reward' : 'friend', ts: Date.now() };
          try { sessionStorage.removeItem('tv_friend_x'); } catch (e) {}
          try { localStorage.setItem(KEY, JSON.stringify(f)); } catch (e) {}
          ready(function () { note(f); });
        }).catch(function () {});
      } catch (e) {}
    }
  } else { var f0 = get(); if (f0) ready(function () { note(f0); }); }

  // 2. the add-on route already calls the Worker: add the friend code to that call
  var realFetch = window.fetch;
  if (typeof realFetch === 'function') {
    window.fetch = function (input, init) {
      try {
        var u = typeof input === 'string' ? input : (input && input.url) || '';
        var f = get();
        if (f && u.indexOf(W + '/session') === 0 && init && typeof init.body === 'string') {
          var b = JSON.parse(init.body);
          if (b && !b.firm && !b.friend) { b.friend = f.code; init = Object.assign({}, init, { body: JSON.stringify(b) }); }
        }
      } catch (e) {}
      return realFetch.call(this, input, init);
    };
  }

  // 3. claim buttons in the note: the sure route. They start checkout through the Worker with the discount applied.
  function refFor(href) {
    try { var c = href && new URL(href).searchParams.get('client_reference_id'); if (c) return c; } catch (e) {}
    var parts = [];
    if (typeof window.TV_REF === 'function') { try { var r = window.TV_REF(); if (r) parts.push(r); } catch (x) {} }
    var sid = window.TV_SESSION; try { sid = sid || localStorage.getItem('tv_sid'); } catch (e) {}
    if (sid) parts.push('s-' + sid);
    return parts.join('_').substring(0, 190);
  }
  var busy = false;
  function start(panel, method, ref, onFail) {
    var f = get(); if (!f || busy) return; busy = true;
    var fail = function () { busy = false; if (onFail) onFail(); };
    var timer = setTimeout(fail, 9000);
    try {
      realFetch.call(window, W + '/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ panel: panel, method: method, addons: [], ref: ref || refFor(''), friend: f.code }) })
        .then(function (r) { return r.json(); })
        .then(function (j) { clearTimeout(timer); if (j && j.url && /^https:\/\/checkout\.stripe\.com\//.test(j.url)) window.location.href = j.url; else fail(); })
        .catch(function () { clearTimeout(timer); fail(); });
    } catch (x) { clearTimeout(timer); fail(); }
  }
  window.TVFriend = { get: get, start: start };

  // 4. safety net: an ordinary Pay press on Ultimate or Signature is also sent through the Worker, where the browser
  //    lets a page stop its own outgoing navigation (Navigation API). Elsewhere the claim buttons are the route.
  function linkOf(u) { var m = String(u || '').match(/^https:\/\/buy\.stripe\.com\/([A-Za-z0-9]+)/); return m ? LINKS[m[1]] : null; }
  try {
    if (window.navigation && typeof window.navigation.addEventListener === 'function') {
      window.navigation.addEventListener('navigate', function (e) {
        try {
          if (busy || !e.cancelable || hasFirm()) return;
          var f = get(); if (!f) return;
          var dest = e.destination && e.destination.url; var t = linkOf(dest); if (!t) return;
          e.preventDefault();
          start(t.panel, t.method, refFor(dest), function () { busy = true; window.location.href = dest; });
        } catch (x) {}
      });
    }
  } catch (e) {}
})();
