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
  function story(){
    /* the scroll story lives in a shadow root: put polish/story.css inside it, last, for ~6 s while the story builds */
    if(off) { [].slice.call(document.querySelectorAll('*')).forEach(function(e){ if(e.shadowRoot){ var o=e.shadowRoot.getElementById('tvpv-story'); if(o) o.remove(); } }); return 'story:off'; }
    var n=0, t=setInterval(function(){
      [].slice.call(document.querySelectorAll('*')).forEach(function(e){ var r=e.shadowRoot; if(!r) return;
        var l=r.getElementById('tvpv-story'); if(!l){ l=document.createElement('link'); l.rel='stylesheet'; l.id='tvpv-story'; l.href=B+'polish/story.css'+T; }
        if(r.lastChild!==l) r.appendChild(l); });
      if(++n>12) clearInterval(t);
    },500);
    return 'story:on';
  }
  function behave(){
    if(off||document.getElementById('tvpv-behave')) return 'behave:'+(off?'off':'already');
    var s=document.createElement('script'); s.id='tvpv-behave'; s.src=B+'polish/behave.js'+T; document.head.appendChild(s); return 'behave:on';
  }
  window.__tvpv=cmp().then(function(c){
    return Promise.all([link('tvpv-common',B+'polish/common.css'), slug?link('tvpv-page',B+'polish/'+slug+'.css'):Promise.resolve('page:none')]).then(function(r){
      document.documentElement.setAttribute('data-tvpv',off?'off':'on');
      var extra=[story(),behave()];
      try{ window.dispatchEvent(new Event('resize')); }catch(e){}
      return [c].concat(r,extra).join(' ');
    });
  });
})();
