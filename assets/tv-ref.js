/* TrueVitals affiliate link capture v1 (6 Oct 2026).
   When a visitor arrives with ?ref=<partner-slug> (optionally &by=<staff-slug>), records the click against their
   session and visitor ids so a purchase within the partner's attribution window is credited.
   Runs only after analytics consent, in line with the site's cookie policy. Sends nothing else. */
(function () {
  var WORKER = 'https://truevitals-stripe-webhook.james-smillie-8c6.workers.dev/ref';
  var CONSENT_KEY = 'tv_cookie_consent_v1';
  function param(n) { try { return new URL(location.href).searchParams.get(n) || ''; } catch (e) { return ''; } }
  var ref = param('ref').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 60);
  if (!ref) return;
  var by = param('by').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 60);
  var done = false;
  function consented() {
    try { var v = localStorage.getItem(CONSENT_KEY); if (v) return !!JSON.parse(v).analytics; } catch (e) {}
    var m = document.cookie.match(/(?:^|; )tv_cookie_consent_v1=([^;]*)/);
    return m ? m[1] === '1' : false;
  }
  function ids() {
    var sid = window.TV_SESSION, vid = window.TV_VISITOR;
    try { if (!sid) sid = localStorage.getItem('tv_sid'); if (!vid) vid = localStorage.getItem('tv_vid'); } catch (e) {}
    return { sid: sid, vid: vid };
  }
  function send(tries) {
    if (done) return;
    var x = ids();
    if (!x.sid) { if (tries < 25) setTimeout(function () { send(tries + 1); }, 200); return; }
    done = true;
    try {
      fetch(WORKER, { method: 'POST', mode: 'cors', credentials: 'omit', keepalive: true, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: ref, by: by || null, session_id: x.sid, vid: x.vid || null, path: location.pathname }) }).catch(function () {});
    } catch (e) {}
  }
  if (consented()) send(0);
  else window.addEventListener('tv:consent', function (e) { if (e && e.detail && e.detail.granted) send(0); });
})();
