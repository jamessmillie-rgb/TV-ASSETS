/* TrueVitals film block v1 (15 Oct 2026) */
(function(){var v=document.getElementById('tvFilmV'),b=document.getElementById('tvFilmPlay'),s=document.getElementById('tv-film');if(!v||!b)return;
b.addEventListener('click',function(){s.classList.add('playing');var p=v.play();if(p&&p.catch)p.catch(function(){});});
v.addEventListener('play',function(){s.classList.add('playing');});})();
