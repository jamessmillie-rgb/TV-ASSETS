/* TrueVitals site facts guard. Corrects known stale panel claims in rendered text until the source pages are
   fixed. Source of truth: truevitals.crm/pipeline/panel-facts.json. Keep the list short and exact. */
(function(){
  var RULES=[
    [/\b114(\s|-|\u2011)?(biomarkers?|markers?)\b/gi,'140 $2'],
    [/\b114-marker\b/gi,'140-marker'],
    [/\b(up to|over|all)\s+114\b/gi,'$1 140'],
    [/\(\u00a3349, 114 biomarkers\)/g,'(\u00a3349, 140 biomarkers)'],
    [/\b48hr Results\b/g,'4 working days'],
    [/\b48 ?hr\b(?=[^.]{0,20}results)/gi,'4 working days'],
    [/Health plans 2, 3 or 4 tests \u00b7 from \u00a3506/g,'Health plans 2, 3 or 4 tests \u00b7 from \u00a3706'],
    [/\bfrom \u00a3506\b/g,'from \u00a3706']
  ];
  var SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,INPUT:1,NOSCRIPT:1,CODE:1,PRE:1};
  function fixText(node){var t=node.nodeValue,o=t;for(var i=0;i<RULES.length;i++)t=t.replace(RULES[i][0],RULES[i][1]);if(t!==o)node.nodeValue=t}
  function walk(root){var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentNode;return p&&!SKIP[p.nodeName]&&/\d/.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});var n;while((n=w.nextNode()))fixText(n)}
  function heroPrice(){ /* old city hero: "Ultimate Panel ... £288 All-In" is the Advanced all-in price; Ultimate with a clinic draw is £368 */
    var els=document.querySelectorAll('*');for(var i=0;i<els.length;i++){var e=els[i];if(e.children.length===0&&/^\s*\u00a3288\s*$/.test(e.textContent||'')){var sec=e.closest('section,div');if(sec&&/Ultimate/.test(sec.textContent||''))e.textContent='\u00a3368'}}}
  function run(){try{walk(document.body);heroPrice();var t=document.title;for(var i=0;i<RULES.length;i++)t=t.replace(RULES[i][0],RULES[i][1]);if(t!==document.title)document.title=t}catch(e){}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
