/* TrueVitals site-wide Ultimate bar v1 (13 Oct 2026). Content pages only. Phone: bottom bar. Desktop: corner pill.
   Appears after a short scroll; hides while an Ultimate button is on screen, near the footer, or where a page has its own bar. */
(function(){
  var path = (location.pathname.replace(/\/+$/, '') || '/').toLowerCase();
  var SKIP = /^\/$|^\/(ultimate-panel|advanced-panel|signature-panel|phlebotomy|signature-phlebotomy|best-blood-test-uk|thank-you|dashboard|quiz|quiz-results|login|log-in|sign-?up|signup-redirect|reset-password|account|checkout|partners?|partner-[a-z-]*|privacy-policy|terms-of-use|refund-cancellation-policy|data-protection|report|our-report|results)(\/|$)/;
  if (SKIP.test(path)) return;
  function addCss(){ if (document.getElementById('tvub-css')) return; var st = document.createElement('style'); st.id = 'tvub-css'; st.textContent = "#tvub{position:fixed;z-index:9990;font-family:'Montserrat',-apple-system,BlinkMacSystemFont,sans-serif;transition:transform .3s ease,opacity .3s ease}#tvub a{text-decoration:none}#tvub .tvub-t b{display:block;font-weight:800;line-height:1.2}#tvub .tvub-t span{display:block;line-height:1.35}#tvub .tvub-go{flex-shrink:0;background:#2ce4ad;color:#04211a;font-weight:800;letter-spacing:.06em;text-transform:uppercase;border-radius:100px;white-space:nowrap}@media(max-width:767px){#tvub{left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:rgba(8,8,8,.96);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-top:1px solid rgba(44,228,173,.28);transform:translateY(110%)}#tvub.on{transform:none}#tvub .tvub-t{min-width:0}#tvub .tvub-t b{color:#fff;font-size:.9rem}#tvub .tvub-t span{color:#9CA3AF;font-size:.72rem;margin-top:2px}#tvub .tvub-go{font-size:.74rem;padding:12px 16px}}@media(min-width:768px){#tvub{right:22px;bottom:22px;display:flex;align-items:center;gap:14px;padding:10px 10px 10px 20px;background:#0a0a0a;border:1px solid rgba(44,228,173,.3);border-radius:100px;box-shadow:0 14px 40px rgba(0,0,0,.28);opacity:0;transform:translateY(16px);pointer-events:none}#tvub.on{opacity:1;transform:none;pointer-events:auto}#tvub .tvub-t b{color:#fff;font-size:.86rem}#tvub .tvub-t span{color:#9CA3AF;font-size:.72rem;margin-top:1px}#tvub .tvub-go{font-size:.72rem;padding:11px 18px}#tvub .tvub-go:hover{background:#24d4a0}}@media(prefers-reduced-motion:reduce){#tvub{transition:none}}"; document.head.appendChild(st); }
  function start(){
    if (document.getElementById('tvub')) return;
    if (document.querySelector('.tvc-bar, .bk-bar')) return; /* page already has its own bar */
    var bar = document.createElement('div');
    bar.id = 'tvub'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Ultimate panel');
    bar.innerHTML = '<div class="tvub-t"><b>Ultimate \u00b7 140 biomarkers</b><span>\u00a3349 + \u00a319 clinic draw \u00b7 Klarna available</span></div><a class="tvub-go" href="/ultimate-panel">See Ultimate</a>';
    addCss();
    document.body.appendChild(bar);
    bar.querySelector('a').addEventListener('click', function(){ try { window.dataLayer = window.dataLayer || []; dataLayer.push({ event: 'tv_ultimate_bar_click', page: path }); } catch(e) {} });
    var feet = document.querySelectorAll('footer, .footer'); var foot = feet.length ? feet[feet.length - 1] : null;
    var ticking = false;
    function ultButtonOnScreen(){
      var as = document.querySelectorAll('a[href$="/ultimate-panel"], a[href*="/ultimate-panel?"], a[href*="/ultimate-panel#"]');
      for (var i = 0; i < as.length; i++) {
        var a = as[i]; if (bar.contains(a)) continue;
        var r = a.getBoundingClientRect();
        if (r.height >= 34 && r.width >= 90 && r.bottom > 0 && r.top < window.innerHeight) return true;
      }
      return false;
    }
    function update(){
      ticking = false;
      var scrolled = window.scrollY > Math.min(320, window.innerHeight * 0.4);
      var nearFoot = (foot && foot.getBoundingClientRect().top < window.innerHeight) || (document.documentElement.scrollHeight - window.innerHeight - window.scrollY) < 500;
      bar.classList.toggle('on', scrolled && !nearFoot && !ultButtonOnScreen());
    }
    function req(){ if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    update();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
