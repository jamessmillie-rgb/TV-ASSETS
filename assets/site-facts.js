/* TrueVitals site facts guard v2 (3 Oct 2026). Complements the footer copy shim: covers withdrawn products and
   remaining stale claims in rendered text until each source page is rewritten. Text nodes only. */
(function(){
  var RULES=[
    [/\bPayl8r, Klarna,? and Clearpay available at checkout\.?/g,'Klarna and Clearpay available at checkout.'],
    [/\bPayl8r, Klarna,? and Clearpay are available to split the cost into 3 or 4 interest-free payments\.?/g,'Klarna and Clearpay are available to split the cost.'],
    [/\bPayl8r, Klarna,? and Clearpay (are )?available\.?/g,'Klarna and Clearpay $1available.'],
    [/\bPayl8r, Klarna, Clearpay available\.?/g,'Klarna and Clearpay available.'],
    [/\bPay-later options \(Payl8r, Klarna, Clearpay\)/g,'Pay-later options (Klarna, Clearpay)'],
    [/\bPay later with Payl8r, Klarna, or Clearpay\b/g,'Pay later with Klarna or Clearpay'],
    [/\bthrough Payl8r, Klarna, and Clearpay\b/g,'through Klarna and Clearpay'],
    [/\bKlarna \(3 interest-free payments\) and Payl8r \(pay monthly\) available\.?/g,'Klarna (3 interest-free payments) available.'],
    [/\bKlarna \(3 interest-free payments\) or Payl8r \(pay monthly, subject to status\)\.?/g,'Klarna (3 interest-free payments).'],
    [/\bKlarna, Clearpay and Payl8r available\.?/g,'Klarna and Clearpay available.'],
    [/\bKlarna and Payl8r\b/g,'Klarna'],
    [/\bKlarna, Payl8r\b/g,'Klarna'],
    [/, and Payl8r offers longer pay-monthly plans at checkout\./g,'.'],
    [/\bThree interest-free payments, or longer pay-monthly plans\./g,'Three interest-free payments.'],
    [/, and Payl8r is available at checkout if you would rather spread the cost personally\./g,', and Klarna is available at checkout if you would rather spread the cost personally.'],
    [/\bPayl8r is available at checkout to spread the cost, subject to status and affordability checks\./g,'Klarna is available at checkout to spread the cost.'],
    [/\bor Payl8r \(pay monthly, subject to status\)/g,''],
    [/\b(200|210)\+ biomarkers\b/g,'230 biomarkers'],
    [/\bover 200 biomarkers\b/gi,'230 biomarkers'],
    [/\(Signature, 200\+\)/g,'(Signature, 230)'],
    [/\bSignature \(200\+, £799\)/g,'Signature (230, £799)'],
    [/\bUltimate \(114, £349\)/g,'Ultimate (140, £349)'],
    [/\b(4\.7|5)★/g,'Excellent'],
    [/\bAI Powered Report\b/g,'Clinician Reviewed Report'],
    [/\bAI Powered\b/g,'Clinician Reviewed'],
    [/\bPersonalised AI report\b/g,'Clinician-reviewed personalised report']
  ];
  var SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,INPUT:1,NOSCRIPT:1,CODE:1,PRE:1};
  function fixText(node){var t=node.nodeValue,o=t;for(var i=0;i<RULES.length;i++)t=t.replace(RULES[i][0],RULES[i][1]);if(t!==o)node.nodeValue=t}
  function walk(root){var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentNode;return p&&!SKIP[p.nodeName]&&/Payl8r|200|210|★|AI Powered|AI report|114/.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});var n;while((n=w.nextNode()))fixText(n)}
  function run(){try{walk(document.body);if(window.MutationObserver){var t;new MutationObserver(function(m){clearTimeout(t);t=setTimeout(function(){for(var i=0;i<m.length;i++){m[i].addedNodes.forEach(function(a){if(a.nodeType===1)walk(a)})}},50)}).observe(document.body,{childList:true,subtree:true})}}catch(e){}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
