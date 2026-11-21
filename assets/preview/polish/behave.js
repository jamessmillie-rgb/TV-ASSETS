/* polish preview behaviours r2 */
(function(){
  /* J4: keep --tvNavH equal to the real fixed header after load, resize and rotation */
  function nav(){ var w=document.querySelector('.tv-nav-wrap'); if(!w) return; var h=Math.round(w.getBoundingClientRect().height);
    if(h>30&&h<200){ document.documentElement.style.setProperty('--tvNavH',h+'px'); document.body.style.setProperty('--tvNavH',h+'px'); } }
  nav(); window.addEventListener('resize',function(){ setTimeout(nav,60); }); window.addEventListener('orientationchange',function(){ setTimeout(nav,300); });

  /* J1: the panel sticky Book bar slides away only while the page's own Book button is FULLY visible above it */
  var bars=[].slice.call(document.querySelectorAll('.tu-sticky,.ta-sticky,.s-bar')); if(!bars.length||!('IntersectionObserver' in window)) return;
  var tg=[].slice.call(document.querySelectorAll('.tu-hero .btn-p,.tu-final .btn-p,.ta-hero .btn-p,.ta-final .btn-p,.ta-up-cta a[href*="phlebotomy"],.tv-sig a.btn[href*="signature-phlebotomy"]'));
  var vis=new Set(), io=null;
  function arm(){
    if(io) io.disconnect(); vis.clear();
    var bh=Math.round(bars[0].getBoundingClientRect().height)||72;
    io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.intersectionRatio>=0.99) vis.add(e.target); else vis.delete(e.target); });
      bars.forEach(function(b){ b.classList.toggle('tvp-off', vis.size>0); });
    },{threshold:[0,0.99,1],rootMargin:'0px 0px -'+bh+'px 0px'});
    tg.forEach(function(t){ io.observe(t); });
  }
  arm(); window.addEventListener('resize',function(){ setTimeout(arm,120); });
  window.__tvpvBehave={bars:bars.length,targets:tg.length,r:2};
})();
