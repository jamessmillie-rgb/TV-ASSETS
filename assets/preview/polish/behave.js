/* polish preview behaviours (J1): panel-page sticky Book bar slides away while the page's own Book button is on screen */
(function(){
  var bars=[].slice.call(document.querySelectorAll('.tu-sticky,.ta-sticky,.s-bar')); if(!bars.length||!('IntersectionObserver' in window)) return;
  var tg=[].slice.call(document.querySelectorAll('.tu-hero .btn-p,.tu-final .btn-p,.ta-hero .btn-p,.ta-final .btn-p,.s-hero .btn,.s-final .btn'));
  var vis=new Set();
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting) vis.add(e.target); else vis.delete(e.target); });
    bars.forEach(function(b){ b.classList.toggle('tvp-off', vis.size>0); });
  },{threshold:0.01});
  tg.forEach(function(t){ io.observe(t); });
  window.__tvpvBehave={bars:bars.length,targets:tg.length};
})();
