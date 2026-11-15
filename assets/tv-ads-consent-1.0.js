/* TrueVitals ad measurement consent + Google click id capture v1.0.0 (12 Nov 2026)
   Why: the cookie box in the site footer always told Google "ad measurement denied", even for visitors who accepted,
   so Google Ads could not see sales. This script (registered site script tvadsconsent):
   1. Rewords the cookie box so it says cookies are also used to measure whether adverts lead to orders.
   2. Only for visitors who make their choice AFTER seeing that wording and accept: tells Google ad measurement is
      allowed (ad_storage + ad_user_data). Ad personalisation stays denied: no targeting, no remarketing.
      People who accepted under the old wording are not switched over.
   3. For those visitors, stores Google's click id (gclid / gbraid / wbraid) from the landing address as an
      'ad_click' site event against the session, so a later paid order can be reported back to Google.
   Never edit this file in place (SRI): put changes in a new file name and register a new version. */
(function () {
  var CK = 'tv_cookie_consent_v1', ADS = 'tv_ads_consent_v1', GC = 'tv_gclid';
  var SB = 'https://vhhwyzcnytenejtgrgzb.supabase.co/rest/v1/rpc/track_events';
  var KEY = 'sb_publishable_OV2u3jH90Ncpsg3rwT18Ww_nyEOGlRi';
  var worded = false, choosing = false, sent = false, tries = 0;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function analytics() {
    try { var v = localStorage.getItem(CK); if (v) return !!JSON.parse(v).analytics; } catch (e) {}
    var m = document.cookie.match(/(?:^|; )tv_cookie_consent_v1=([^;]*)/); return m ? m[1] === '1' : false;
  }
  function adsOk() { try { return localStorage.getItem(ADS) === '1'; } catch (e) { return false; } }

  function word() {
    if (worded) return;
    try {
      var bar = document.getElementById('tv-cookie'); if (!bar) return;
      var box = document.getElementById('tvCkAnalytics'); if (!box) return;
      var opt = box.closest ? box.closest('.tv-ck-opt') : null; if (!opt) return;
      var main = null, kids = bar.children;
      for (var i = 0; i < kids.length; i++) { if (kids[i].tagName === 'P') { main = kids[i]; break; } }
      var h = opt.querySelector('h5'), p = opt.querySelector('p');
      if (!main || !h || !p) return;
      main.innerHTML = 'We use cookies to improve the site and to measure whether our adverts lead to orders. <a href="/privacy-policy">Learn more</a>';
      h.textContent = 'Analytics and ad measurement';
      p.textContent = 'Help us see which pages are useful, where people come from, and whether our Google adverts lead to orders. No ad targeting, nothing sold.';
      worded = true;
    } catch (e) {}
  }

  function param(n) { try { return new URL(location.href).searchParams.get(n) || null; } catch (e) { return null; } }
  function clickIds() {
    var o = { gclid: param('gclid'), gbraid: param('gbraid'), wbraid: param('wbraid') };
    return (o.gclid || o.gbraid || o.wbraid) ? o : null;
  }
  function ids() {
    var sid = window.TV_SESSION, vid = window.TV_VISITOR;
    try { sid = sid || localStorage.getItem('tv_sid'); vid = vid || localStorage.getItem('tv_vid'); } catch (e) {}
    return { sid: sid, vid: vid };
  }
  function device() { var w = window.innerWidth || 0; return w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'; }
  function capture() {
    if (sent) return;
    var c = clickIds(); if (!c) return;
    var clean = {}; for (var k in c) { if (c[k] && /^[A-Za-z0-9_-]{10,200}$/.test(c[k])) clean[k] = c[k]; }
    if (!clean.gclid && !clean.gbraid && !clean.wbraid) return;
    try { localStorage.setItem(GC, JSON.stringify({ ids: clean, ts: Date.now() })); } catch (e) {}
    var i = ids();
    if (!i.sid) { if (tries++ < 12) setTimeout(capture, 700); return; }
    sent = true;
    try {
      fetch(SB, { method: 'POST', mode: 'cors', credentials: 'omit', keepalive: true,
        headers: { 'Content-Type': 'application/json', apikey: KEY },
        body: JSON.stringify({ p: { sid: i.sid, vid: i.vid, path: location.pathname || '/', device: device(), events: [{ name: 'ad_click', props: clean }] } })
      }).catch(function () {});
    } catch (e) {}
  }

  function apply() {
    if (!analytics() || !adsOk()) return;
    try { gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted' }); } catch (e) {}
    capture();
  }

  // A choice only counts for ad measurement if it was made after the new wording was on screen.
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('#tvCkAccept,#tvCkSave') : null;
    if (t && worded) { choosing = true; setTimeout(function () { choosing = false; }, 0); }
  }, true);
  window.addEventListener('tv:consent', function (e) {
    var granted = !!(e && e.detail && e.detail.granted);
    try {
      if (!granted) localStorage.removeItem(ADS);
      else if (choosing) localStorage.setItem(ADS, '1');
    } catch (x) {}
    apply();
  });

  word(); apply();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { word(); apply(); });
  window.addEventListener('load', function () { word(); apply(); });
})();
