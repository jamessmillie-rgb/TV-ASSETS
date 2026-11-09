/* TrueVitals panel card v1.1 (9 Nov 2026). v1.1: adds a third route under the buttons, "Not sure which panel fits you? Take the free 3-minute quiz".
   Adds a small, clearly labelled "From TrueVitals" card inside content pages (guides, symptoms, comparisons,
   reviews, locations) so a reader who has finished the answer has an obvious next step:
   compare the panels, book Ultimate (always through /phlebotomy, never straight to Stripe), or take the free quiz if undecided.
   Injected by script on purpose: the page's own text stays neutral for crawlers that read raw HTML.
   Card 1 goes before the page's 2nd <h2>; card 2 goes before an FAQ heading further down, if there is one.
   Never runs on product, booking, account, legal or partner pages, or on pages that already sell directly. */
(function(){
  var path = (location.pathname.replace(/\/+$/, '') || '/').toLowerCase();
  var SKIP = /^\/$|^\/(ultimate-panel|advanced-panel|signature-panel|panels|compare-panels|phlebotomy|signature-phlebotomy|thank-you|dashboard|quiz|quiz-results|login|log-in|join|sign-?up|signup-redirect|reset-password|forgot-password|password-success|verification|account|account-settings|checkout|partners?|partner-[a-z-]*|privacy-policy|terms-of-use|refund-cancellation-policy|data-protection|report|our-report|results|faq|about|about-truevitals|why-trust-truevitals|our-specialists|dr-[a-z-]+|apex-longevity|online-menopause-centre|extra-revenue-for-personal-trainers|blood-testing-for-[a-z-]+|health-affiliate-programme-uk|find-a-clinic|how-it-works|biomarkers|401|404)(\/|$)/;
  if (SKIP.test(path)) return;

  var COMPARING = /(review|alternative|-vs-|compared|^\/best-|^\/most-|price-index|comprehensive)/.test(path);
  var TITLE = COMPARING ? 'Weighing up providers? Compare our panels side by side' : 'Want all of this checked in one draw?';

  var CSS = "aside.tvpc{box-sizing:border-box;display:block;max-width:760px;margin:34px auto;padding:22px 22px 20px;background:#0a0a0a;border:1px solid rgba(44,228,173,.28);border-radius:18px;font-family:'Montserrat',-apple-system,BlinkMacSystemFont,sans-serif;color:#fff;text-align:left;clear:both;opacity:1;transform:none}" +
    "aside.tvpc *{box-sizing:border-box}" +
    "aside.tvpc .tvpc-l{display:inline-block;margin:0;font-size:10px!important;line-height:1.4!important;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#2ce4ad!important;background:rgba(44,228,173,.1);border:1px solid rgba(44,228,173,.24);padding:4px 10px;border-radius:100px}" +
    "aside.tvpc .tvpc-h{display:block;font-family:'Inter Tight','Montserrat',sans-serif;font-size:19px!important;font-weight:800;letter-spacing:-.02em;line-height:1.25!important;color:#fff!important;margin:12px 0 0!important;padding:0}" +
    "aside.tvpc ul.tvpc-u{list-style:none!important;margin:12px 0 0!important;padding:0!important;display:flex;flex-direction:column;gap:7px}" +
    "aside.tvpc ul.tvpc-u li{position:relative;list-style:none!important;margin:0!important;padding:0 0 0 16px!important;font-size:14px!important;line-height:1.5!important;color:#c9ced6!important;background:none!important;border:0!important}" +
    "aside.tvpc ul.tvpc-u li::before{content:'';position:absolute;left:0;top:.55em;width:6px;height:6px;border-radius:50%;background:#2ce4ad}" +
    "aside.tvpc ul.tvpc-u li::marker{content:''}" +
    "aside.tvpc .tvpc-b{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0 0;padding:0}" +
    "aside.tvpc .tvpc-b a{display:inline-flex;align-items:center;justify-content:center;margin:0;padding:12px 20px;border-radius:100px;font-size:12.5px!important;line-height:1.2!important;font-weight:800;letter-spacing:.06em;text-transform:uppercase;text-decoration:none!important;white-space:nowrap;border-bottom-width:1px}" +
    "aside.tvpc a.tvpc-p{background:#2ce4ad!important;color:#04211a!important;border:1px solid #2ce4ad!important}aside.tvpc a.tvpc-p:hover{background:#24d4a0!important}" +
    "aside.tvpc a.tvpc-s{background:transparent!important;border:1px solid rgba(255,255,255,.24)!important;color:#fff!important}aside.tvpc a.tvpc-s:hover{border-color:#2ce4ad!important;color:#2ce4ad!important}" +
    "aside.tvpc a.tvpc-q{display:inline-block;margin:14px 0 0!important;padding:0!important;font-size:13.5px!important;line-height:1.45!important;font-weight:700;color:#2ce4ad!important;text-decoration:none!important;border:0!important;background:none!important}aside.tvpc a.tvpc-q:hover{text-decoration:underline!important}" +
    "aside.tvpc p.tvpc-n{font-size:12px!important;color:#8a8f98!important;margin:12px 0 0!important;padding:0!important;line-height:1.5!important;max-width:none}" +
    "@media(max-width:520px){aside.tvpc{margin:26px 0;padding:18px 16px}aside.tvpc .tvpc-b a{flex:1 1 100%}}";

  function card(n){
    var d = document.createElement('aside');
    d.className = 'tvpc'; d.id = 'tvpc-' + n;
    d.setAttribute('aria-label', 'TrueVitals panels');
    d.innerHTML =
      '<span class="tvpc-l">From TrueVitals</span>' +
      '<b class="tvpc-h">' + TITLE + '</b>' +
      '<ul class="tvpc-u">' +
        '<li>Ultimate: 140 biomarkers, including full hormones, thyroid antibodies, ApoB, Lp(a) and fasting insulin</li>' +
        '<li>£399 including the clinic blood draw at 103 partner clinics, or £29 extra at home</li>' +
        '<li>Clinician-reviewed report within 4 working days. One-off price, no subscription</li>' +
      '</ul>' +
      '<div class="tvpc-b">' +
        '<a class="tvpc-p" href="/compare-panels" data-tvpc="compare">Compare panels</a>' +
        '<a class="tvpc-s" href="/phlebotomy?panel=ultimate" data-tvpc="book">Book Ultimate</a>' +
      '</div>' +
      '<a class="tvpc-q" href="/quiz" data-tvpc="quiz">Not sure which panel fits you? Take the free <span style="white-space:nowrap">3-minute quiz <span aria-hidden="true">&rarr;</span></span></a>' +
      '<p class="tvpc-n">Advanced (74, £319) and Signature (230, £799) are on the comparison page too.</p>';
    d.addEventListener('click', function(e){
      var a = e.target && e.target.closest ? e.target.closest('a[data-tvpc]') : null; if (!a) return;
      try { window.dataLayer = window.dataLayer || []; dataLayer.push({ event: 'tv_panel_card_click', card: n, target: a.getAttribute('data-tvpc'), page: path }); } catch(x) {}
    });
    return d;
  }

  function visibleH2s(){
    var out = [], hs = document.querySelectorAll('h2');
    for (var i = 0; i < hs.length; i++) {
      var h = hs[i];
      if (h.closest('nav, header, footer, .footer, .tvpc, #tv-cookie, [role="dialog"], details, summary, table, button')) continue;
      if (!h.offsetParent && window.getComputedStyle(h).position !== 'fixed') continue;
      if (!(h.textContent || '').trim()) continue;
      out.push(h);
    }
    return out;
  }

  /* Never drop the card into a grid or a side-by-side flex row: climb to the block that sits in normal flow. */
  function anchor(h){
    var t = h;
    while (t.parentNode && t.parentNode !== document.body) {
      var cs = window.getComputedStyle(t.parentNode);
      var rowFlex = /flex/.test(cs.display) && !/column/.test(cs.flexDirection);
      if (/grid/.test(cs.display) || rowFlex) { t = t.parentNode; continue; }
      break;
    }
    /* Keep a small eyebrow label (e.g. "Prices") attached to its heading. */
    var prev = t.previousElementSibling;
    if (prev && !/^(H1|H2|H3|SECTION|ARTICLE|TABLE|UL|OL|IMG|FIGURE)$/.test(prev.tagName) && !prev.querySelector('h1,h2,h3,img,table,a') && (prev.textContent || '').trim().length > 0 && (prev.textContent || '').trim().length <= 40) t = prev;
    return t;
  }

  function start(){
    if (document.getElementById('tvpc-1')) return;
    if (document.querySelector('a[href*="buy.stripe.com"], [data-tvpc-off]')) return; /* page already sells directly, or opted out */
    var hs = visibleH2s();
    if (hs.length < 2) return; /* too short to need it */
    if (!document.getElementById('tvpc-css')) { var st = document.createElement('style'); st.id = 'tvpc-css'; st.textContent = CSS; document.head.appendChild(st); }
    var a1 = anchor(hs[1]);
    a1.parentNode.insertBefore(card(1), a1);
    for (var i = 3; i < hs.length; i++) {
      if (/\b(faq|faqs|questions)\b/i.test(hs[i].textContent || '')) { var a2 = anchor(hs[i]); if (a2 !== a1) a2.parentNode.insertBefore(card(2), a2); break; }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
