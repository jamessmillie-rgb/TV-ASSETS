/* TrueVitals price facts v1 (2 Nov 2026). Ultimate £399 including the clinic draw, home visit £29, Advanced £319.
   Corrects TrueVitals' own old prices (£349/£269 + £19 clinic / £39 home) in rendered text and JSON-LD on pages
   whose source has not been rewritten yet. Rules are phrase-specific so competitor prices are left alone. */
(function(){
  var R=[
    // full phrases first
    [/[Cc]linic collection adds £19 and at-home collection £39; the Signature price includes the draw\./g,'The clinic draw is included on Advanced and Ultimate, at-home collection is £29 extra, and the Signature price includes the draw.'],
    [/£349 ?\+ ?£19 clinic draw or £39 home visit/g,'£399 including the clinic draw, or £29 extra for a home visit'],
    [/£349 plus (?:a )?£19 clinic draw or £39 home visit/g,'£399 including the clinic draw, or £29 extra for a home visit'],
    [/£349 plus (?:a )?£19 clinic draw/g,'£399 including the clinic draw'],
    [/£349 plus draw/g,'£399 including the clinic draw'],
    [/£349 \(all-in with £19 venous phlebotomy\)/g,'£399 (all-in, including venous phlebotomy)'],
    [/£349 for 140 markers plus £39 for an at-home draw/g,'£399 for 140 markers plus £29 for an at-home draw'],
    [/£349 ?\+ ?£19 ?= ?£368/g,'£399'],
    [/£269 ?\+ ?£19 ?= ?£288/g,'£319'],
    [/£349 ?\+ ?£19\b/g,'£399 incl. draw'],
    [/£269 ?\+ ?£19\b/g,'£319 incl. draw'],
    [/plus (?:a )?£19 clinic draw or £39 home visit/g,'including the clinic draw, or £29 for a home visit'],
    [/partner clinics \(£19\) or a home visit \(£39\)/g,'partner clinics (draw included) or a home visit (£29)'],
    [/TrueVitals adds £19 for a clinic draw \(£39 at home\)/g,'TrueVitals includes the clinic draw (£29 at home)'],
    [/venous phlebotomy at £19 \(103 UK partner clinics\)/g,'venous phlebotomy included (103 UK partner clinics)'],
    [/TrueVitals charges £19 for clinic phlebotomy/g,'TrueVitals includes clinic phlebotomy in the price'],
    [/the draw at £19 in clinic or £39 at home/g,'the draw included in clinic or £29 at home'],
    [/Clinic phlebotomy \+£19, at-home \+£39/g,'Clinic phlebotomy included, at-home +£29'],
    [/At-home draw £39, clinic £19/g,'At-home draw £29, clinic draw included'],
    [/[Cc]linic draw £19 at /g,'Clinic draw included at '],
    [/\b[Cc]linic draw £19\b/g,'Clinic draw included'],
    [/\b£19 clinic draw\b/g,'included clinic draw'],
    [/partner clinic locations, £19 draw/g,'partner clinic locations, blood draw included'],
    [/partner clinics at £19/g,'partner clinics, draw included'],
    [/\bIn clinic, £19\b/g,'In clinic, included'],
    [/\bAt-home £39\b/g,'At-home £29'],
    [/\bAt home, £39\b/g,'At home, £29'],
    [/\bat-home and at-office visits, £39\b/g,'at-home and at-office visits, £29'],
    [/\bAt-home testing, £39\b/g,'At-home testing, £29'],
    [/(home or office|your house|to you in [A-Z][a-z]+(?: or [A-Z][a-z]+)?|anywhere in the UK|anywhere in London|in London|visits|at home) for £39\b/g,'$1 for £29'],
    [/£39 for a phlebotomist/g,'£29 for a phlebotomist'],
    // our all-in totals and per-marker figures
    [/£368 all-in/g,'£399 all-in'],
    [/cost £368 \(TrueVitals Ultimate/g,'cost £399 (TrueVitals Ultimate'],
    [/£2\.63 per biomarker/g,'£2.85 per biomarker'],
    [/£116\.33\b/g,'£133']
    // No bare-number rules (£349, £269, £288, £368, £388): every page's raw code now carries the new prices, and
    // bare rules would rewrite competitor prices (e.g. Bupa £349) on comparison pages. Removed 1 Nov 2026.
  ];
  var SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,INPUT:1,NOSCRIPT:1,CODE:1,PRE:1};
  var HIT=/£(?:349|269|19|39|116|2\.63)/;
  function fix(s){for(var i=0;i<R.length;i++)s=s.replace(R[i][0],R[i][1]);return s}
  function walk(root){var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentNode;return p&&!SKIP[p.nodeName]&&HIT.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});var n;while((n=w.nextNode())){var v=n.nodeValue,o=fix(v);if(o!==v)n.nodeValue=o}}
  function ld(){document.querySelectorAll('script[type="application/ld+json"]').forEach(function(sc){var v=sc.textContent,o=fix(v).replace(/("price"\s*:\s*")349(")/g,'$1399$2').replace(/("price"\s*:\s*")269(")/g,'$1319$2').replace(/("price"\s*:\s*)349\b/g,'$1399').replace(/("price"\s*:\s*)269\b/g,'$1319');if(o!==v)sc.textContent=o})}
  function run(){try{walk(document.body);ld();if(window.MutationObserver){var t;new MutationObserver(function(m){clearTimeout(t);t=setTimeout(function(){for(var i=0;i<m.length;i++){m[i].addedNodes.forEach(function(a){if(a.nodeType===1)walk(a)})}},50)}).observe(document.body,{childList:true,subtree:true})}}catch(e){}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
