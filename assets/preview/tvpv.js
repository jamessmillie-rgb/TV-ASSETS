/* TrueVitals design preview injector, 21 Nov 2026. NOT loaded by the live site: run by hand in one browser tab. */
(function(){
  var B='https://results.truevitals.co.uk/assets/preview/', T='?t='+Date.now();
  var P=location.pathname.replace(/\/$/,'')||'/';
  var MAP={'/':'home','/compare-panels':'compare','/ultimate-panel':'ultimate','/advanced-panel':'advanced','/signature-panel':'signature','/phlebotomy':'booking','/panels':'panels'};
  var slug=MAP[P]||'';
  var off=/[?&]tvpv=off/.test(location.search)||window.__tvpvOff===true;
  function link(id,href){
    var l=document.getElementById(id);
    if(off){ if(l) l.remove(); return Promise.resolve(id+':off'); }
    if(!l){ l=document.createElement('link'); l.rel='stylesheet'; l.id=id; document.head.appendChild(l); }
    return new Promise(function(res){ l.onload=function(){res(id+':ok')}; l.onerror=function(){res(id+':missing')}; l.href=href+T; });
  }
  function cmp(){
    if(P!=='/compare-panels' || window.__tvpvCmp===false) return Promise.resolve('cmp:n/a');
    var host=[].slice.call(document.querySelectorAll('.w-embed')).filter(function(x){return x.querySelector('.cp')})[0];
    if(!host) return Promise.resolve('cmp:nohost');
    if(host.getAttribute('data-tvpv')==='1') return Promise.resolve('cmp:already');
    return fetch(B+'cmp-embed.html'+T).then(function(r){return r.text()}).then(function(h){
      host.innerHTML=h; host.setAttribute('data-tvpv','1');
      [].slice.call(host.querySelectorAll('script')).forEach(function(o){ var s=document.createElement('script'); [].slice.call(o.attributes).forEach(function(a){s.setAttribute(a.name,a.value)}); s.text=o.text; o.parentNode.replaceChild(s,o); });
      return 'cmp:swapped';
    });
  }
  window.__tvpv=cmp().then(function(c){
    return Promise.all([link('tvpv-common',B+'polish/common.css'), slug?link('tvpv-page',B+'polish/'+slug+'.css'):Promise.resolve('page:none')]).then(function(r){ document.documentElement.setAttribute('data-tvpv',off?'off':'on'); return [c].concat(r).join(' '); });
  });
})();
