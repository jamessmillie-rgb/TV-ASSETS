(function(){
var HOST=document.getElementById('tvhs-host');if(!HOST)return;
var ROOT=HOST.shadowRoot;
if(!ROOT){var T=HOST.querySelector('template');if(!T||!HOST.attachShadow)return;ROOT=HOST.attachShadow({mode:'open'});ROOT.appendChild(T.content.cloneNode(true));T.remove();}
var TVROOT=ROOT.querySelector('.tvroot'),LINK=ROOT.querySelector('link[rel=stylesheet]');
function hideBar(){var r=HOST.getBoundingClientRect(),on=r.top<innerHeight&&r.bottom>80;if(on)document.documentElement.setAttribute('data-tvhs','1');else document.documentElement.removeAttribute('data-tvhs');}
addEventListener('scroll',hideBar,{passive:true});addEventListener('resize',hideBar);hideBar();
ROOT.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[data-skip]');if(!a)return;e.preventDefault();scrollTo({top:HOST.getBoundingClientRect().bottom+scrollY-70,behavior:'smooth'});});
var started=false;
function start(){if(started)return;started=true;try{

var NS='http://www.w3.org/2000/svg';
function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e;}
function $(i){return ROOT.getElementById(i);}
function qa(s){return [].slice.call(ROOT.querySelectorAll(s));}
var story=$('story'),sv=$('sv'),scene=sv.parentNode,fx=$('fx'),ctx=fx.getContext('2d'),bodyG=$('body'),vial=$('vial'),vialr=$('vialr'),vblood=$('vblood'),vcap=$('vcap'),vhalo=$('vhalo'),
    count=$('count'),countB=count.querySelector('b'),countS=count.querySelector('span'),legend=$('legend'),quiz=$('quiz'),qsteps=qa('#quiz [data-q]'),meter=$('qzm'),
    find=$('find'),chipEls={},verdict=$('verdict'),st1=$('st1'),st2=$('st2'),phone=$('phone'),phRows=qa('#phone [data-r]'),
    caps=qa('.cap'),railF=$('railf'),railN=$('railn'),railL=$('raill'),railH=$('railh'),ticks=qa('#rail li'),cue=$('scue'),cueT=$('scuet'),
    vessels=qa('#vessels path'),organs=qa('#sv .organ'),ringC=$('ringc'),ringN=$('ringn'),good=$('good'),fa=$('fa'),fb=$('fb'),pha=$('pha'),phc=$('phc'),stg=story.querySelector('.stage');
qa('#find [data-n]').forEach(function(e){chipEls[e.getAttribute('data-n')]=e;});
var RATE={nutrients:[255,154,77],vitamins:[255,154,77],thyroid:[232,193,90],brain:[232,193,90],hormones:[182,227,106],gut:[182,227,106],bone:[182,227,106],metabolic:[44,228,173],liver:[44,228,173],heart:[44,228,173],kidneys:[44,228,173],immune:[44,228,173],screening:[44,228,173],lungs:[44,228,173],urinary:[44,228,173],prostate:[44,228,173]};
function hex(c){return '#'+c.map(function(v){return ('0'+v.toString(16)).slice(-2);}).join('');}
qa('.organ').forEach(function(o){o.style.setProperty('--rate',hex(RATE[o.getAttribute('data-sys')]||[44,228,173]));});
var STEPS=['About you','Blood','Read together','Body map','Links','What it means','Your report','Next time'];
var seed=11;function rnd(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646;}
function c01(v){return v<0?0:v>1?1:v;}
function seg(p,a,b){return c01((p-a)/(b-a));}
function ease(t){return t*t*(3-2*t);}
function fmt(n){return n>=1000?Math.floor(n/1000)+','+('00'+(n%1000)).slice(-3):''+n;}
function lerp3(a,b,t){return [Math.round(a[0]+(b[0]-a[0])*t),Math.round(a[1]+(b[1]-a[1])*t),Math.round(a[2]+(b[2]-a[2])*t)];}
/* crisp labels for the body map */
var LAB=[['Blood and iron','nutrients',0,150,172,143,'Needs attention'],['Heart','heart',0,200,170,192,'Optimal'],['Liver','liver',0,268,132,268,'Optimal'],['Kidneys','kidneys',0,326,130,322,'Optimal'],['Thyroid','thyroid',1,112,198,110,'Room to improve'],['Immune','immune',1,160,228,146,'Optimal'],['Metabolic','metabolic',1,276,234,276,'Optimal'],['Hormones','hormones',1,410,198,408,'Mostly good']];
var lg=$('labels'),labs=LAB.map(function(l){var g=el('g',{class:'lab'},lg),x=l[2]?314:46,c=hex(RATE[l[1]]);
  el('line',{x1:l[2]?x-6:x+6,y1:l[3]-5,x2:l[4],y2:l[5]},g);var d=el('circle',{cx:l[4],cy:l[5],r:3},g);d.style.fill=c;
  var t=el('text',{x:x,y:l[3],'text-anchor':l[2]?'start':'end'},g);t.textContent=l[0];var t2=el('text',{x:x,y:l[3]+14,'text-anchor':l[2]?'start':'end',class:'rt'},g);t2.textContent=l[6];t2.style.fill=c;return g;});
/* ---------- 3D body sampled from the flat figure ---------- */
var BX=64,BY=6,BW=232,BH=456,SC=2,oc=document.createElement('canvas');oc.width=BW*SC;oc.height=BH*SC;var ox=oc.getContext('2d');
function shape(e){var t=e.tagName.toLowerCase(),p;if(t==='path')p=new Path2D(e.getAttribute('d'));else{p=new Path2D();var g=function(n){return parseFloat(e.getAttribute(n));};
  if(t==='circle')p.arc(g('cx'),g('cy'),g('r'),0,6.2832);else if(t==='ellipse')p.ellipse(g('cx'),g('cy'),g('rx'),g('ry'),0,0,6.2832);}return p;}
function raster(draw){ox.setTransform(1,0,0,1,0,0);ox.clearRect(0,0,oc.width,oc.height);ox.setTransform(SC,0,0,SC,-BX*SC,-BY*SC);draw();return ox.getImageData(0,0,oc.width,oc.height).data;}
var outline=qa('#body > g > g:first-child > *'),ROW=[];
var od=raster(function(){ox.strokeStyle='#fff';ox.lineWidth=2;outline.forEach(function(e){ox.stroke(shape(e));});});
for(var r=0;r<BH;r++){var mn=1e9,mx=-1;for(var x=0;x<BW*SC;x++){if(od[((r*SC)*oc.width+x)*4+3]>60){if(x<mn)mn=x;if(x>mx)mx=x;}}ROW[r]=mx>mn?[BX+(mn+mx)/2/SC,(mx-mn)/2/SC]:null;}
for(var r=1;r<BH;r++)if(!ROW[r]&&ROW[r-1])ROW[r]=ROW[r-1];
function row(y){var r=Math.max(0,Math.min(BH-1,Math.round(y-BY)));return ROW[r]||[180,40];}
var SK=[];for(var i=0;i<2600;i++){var y=BY+2+rnd()*(BH-4),rw=row(y),th0=rnd()*6.2832,dep=y<90?.9:.5;if(rw[1]<4)continue;SK.push({x:rw[0]+rw[1]*Math.cos(th0),y:y,z:rw[1]*dep*Math.sin(th0),o:rnd()});}
var ORG=[],O={};
organs.forEach(function(g,oi){var s=g.getAttribute('data-sys'),els=[].slice.call(g.children).filter(function(e){return !/detail|thin/.test(e.getAttribute('class')||'');});
  var dd=raster(function(){ox.fillStyle='#fff';ox.strokeStyle='#fff';els.forEach(function(e){var sh=shape(e);if(/thick/.test(e.getAttribute('class')||'')){ox.lineWidth=9;ox.lineCap='round';ox.stroke(sh);}else ox.fill(sh);});});
  var px=[];for(var i=3;i<dd.length;i+=4)if(dd[i]>128)px.push((i-3)/4);
  var n=Math.max(26,Math.min(420,Math.round(px.length/SC/SC/7))),pts=[],sx=0,sy=0;
  for(var k=0;k<n;k++){var q=px[Math.floor(rnd()*px.length)],x=BX+(q%oc.width)/SC,y=BY+Math.floor(q/oc.width)/SC,rw=row(y),u=(x-rw[0])/Math.max(rw[1],1),zr=.34*rw[1]*Math.sqrt(Math.max(0,1-u*u));
    pts.push({x:x,y:y,z:(rnd()*2-1)*zr,o:rnd()});sx+=x;sy+=y;}
  var o={sys:s,pts:pts,cx:sx/n,cy:sy/n,i:oi,el:g};ORG.push(o);O[s]=o;});
var VP=vessels.map(function(p){var L=p.getTotalLength(),a=[];for(var i=0;i<=80;i++){var q=p.getPointAtLength(L*i/80);a.push(q.x,q.y);}return a;});
var P=[];function add(i,n,sp,sz){for(var k=0;k<n;k++)P.push({i:i,t:rnd(),v:sp*(.6+rnd()*.8),j:(rnd()-.5)*sz,r:.7+rnd()*1.3});}
add(0,14,.55,5);add(1,90,.085,7);add(2,22,.2,4);add(3,22,.2,4);add(4,10,.3,3);add(5,10,.3,3);add(6,10,.3,3);add(7,10,.3,3);
/* the 140 results on the ring (illustrative: nothing outside the lab range, a handful in range but not optimal, the rest optimal) */
var SYS=[['nutrients',20,0,4,0],['heart',16,0,1,0],['liver',10,0,0,0],['vitamins',6,0,3,0],['kidneys',9,0,0,0],['urinary',9,0,0,8],['thyroid',6,0,2,0],['hormones',18,0,3,0],['prostate',2,0,0,0],['immune',12,0,1,0],['metabolic',10,0,0,0],['gut',4,0,1,0],['bone',8,0,1,0],['screening',6,0,0,2],['brain',2,0,0,0],['lungs',2,0,0,0]];
var NAMES={nutrients:'Blood and iron',heart:'Heart',immune:'Immune',liver:'Liver',metabolic:'Metabolic',kidneys:'Kidneys',urinary:'Urinary',hormones:'Hormones',bone:'Bone',thyroid:'Thyroid',vitamins:'Vitamins',screening:'Screening'};
var COL=[[44,228,173],[232,193,90],[255,90,95],[150,150,162]],M=[],GAP=.03,QG=4.2,NQ=18,AFT={heart:1,kidneys:1,hormones:1,immune:1,gut:1,screening:1},arcU=(Math.PI*2-GAP*(SYS.length+6))/(140+6*QG),ang=-Math.PI/2,ARC=[],QZ=[],QARC=[];
SYS.forEach(function(s,si){var o=O[s[0]],a0=ang;
  for(var k=0;k<s[1];k++){var st=k<s[2]?2:k<s[2]+s[3]?1:k<s[2]+s[3]+s[4]?3:0,q=o.pts[Math.floor(rnd()*o.pts.length)];M.push({sys:s[0],si:si,st:st,a:ang+arcU/2,x:q.x,y:q.y,o:rnd(),ph:rnd()*6.28});ang+=arcU;}
  ARC.push([a0,ang,s[0]]);ang+=GAP;
  if(AFT[s[0]]){QARC.push([ang,ang+arcU*QG]);for(var k=0;k<3;k++){var n=QZ.length;QZ.push({a:ang+arcU*QG*(k+.5)/3,o:rnd(),orb:n/NQ*6.2832});}ang+=arcU*QG+GAP;}});
SYS.forEach(function(s){var a=M.filter(function(m){return m.sys===s[0];}),st=a.map(function(m){return m.st;});for(var i=st.length-1;i>0;i--){var j=Math.floor(rnd()*(i+1)),t=st[i];st[i]=st[j];st[j]=t;}a.forEach(function(m,i){m.st=st[i];});});
function pick(sys,st){for(var i=0;i<M.length;i++)if(M[i].sys===sys&&M[i].st===st&&!M[i].key)return i;return 0;}
/* place each key result at a set point of its arc so the labels on the ring never crowd */
function at(sys,fr,key){var a=[];M.forEach(function(m,i){if(m.sys===sys)a.push(i);});var i=a[Math.round(fr*(a.length-1))];
  if(M[i].st!==1){for(var k=0;k<a.length;k++){var j=a[k];if(j!==i&&M[j].st===1&&!M[j].key){M[j].st=M[i].st;break;}}M[i].st=1;}M[i].key=key;return i;}
var nI=at('nutrients',.33,'r0'),nV=at('nutrients',1,'r1'),nG=at('vitamins',.5,'r2'),nT=at('thyroid',.5,'r3');
var ORBN=['Sleep','Goals','Diet','Symptoms','Cycle','Caffeine','Medication','Family history','Training'];
var KEY={q0:140+1,q1:140+4,r0:nI,r1:nV,r2:nG,r3:nT,s0:140+13,s1:140+7,s2:140+10,s3:140+15},KN={q0:'Heavy periods',q1:'Plant-based',r0:'Ferritin',r1:'Active B12',r2:'Vitamin D',r3:'TSH',s0:'Brain fog',s1:'Tired by 3pm',s2:'Always cold',s3:'Feeling flat'};
/* eleven links: periods + plant-based -> iron; plant-based -> B12; iron -> thyroid -> cold, tired; iron + B12 -> fog, flat; vitamin D -> flat */
var EDGE=[['q0','r0'],['q1','r0'],['q1','r1'],['r0','r3',1],['r3','s2'],['r3','s1'],['r0','s0'],['r1','s0'],['r0','s3'],['r1','s3'],['r2','s3']];
var LO={};Object.keys(KEY).map(function(k){var ix=KEY[k];return [k,ix>=140?QZ[ix-140].a:M[ix].a];}).sort(function(a,b){return a[1]-b[1];}).forEach(function(q,i){LO[q[0]]=i%2?31:13;});
var CH=[];for(var i=0;i<420;i++){var a=Math.floor(rnd()*140),b=Math.floor(rnd()*140);if(M[a].si===M[b].si){i--;continue;}CH.push([a,b,rnd()*6.28,.6+rnd()*1.6]);}

/* step 8: the second test, six months on (illustrative). The radar copies the real progress report:
   one axis per body system, scored by the share of its markers in the ideal range. */
var AX=[['Blood and iron',40,90],['Vitamins',45,92],['Thyroid',60,88],['Hormones',78,84],['Energy and metabolism',70,85],['Kidneys',95,97],['Liver',96,96],['Heart',92,80]],
    RCX=310,RCY=232,RR=150,RN=AX.length;
function rpt(i,v){var a=-Math.PI/2+i*2*Math.PI/RN,r=RR*v/100;return [RCX+r*Math.cos(a),RCY+r*Math.sin(a)];}
function rpts(vals){return vals.map(function(v,i){return rpt(i,v).map(function(n){return n.toFixed(1);}).join(',');}).join(' ');}
function rBuild(){
  var g='rgba(255,255,255,.1)',h='<svg class="rdr" id="rdr" viewBox="40 0 540 470" role="img" aria-label="Radar chart of eight body systems: previous test dashed grey, this test teal. Blood and iron 40 to 90, Vitamins 45 to 92, Thyroid 60 to 88, Hormones 78 to 84, Energy and metabolism 70 to 85, Kidneys 95 to 97, Liver 96 to 96, Heart 92 to 80.">';
  [25,50,75,100].forEach(function(f){h+='<polygon points="'+rpts(AX.map(function(){return f;}))+'" fill="none" stroke="'+g+'" stroke-width="1"/>';});
  AX.forEach(function(a,i){var p=rpt(i,100);h+='<line x1="'+RCX+'" y1="'+RCY+'" x2="'+p[0].toFixed(1)+'" y2="'+p[1].toFixed(1)+'" stroke="'+g+'"/>';});
  h+='<g class="rl">';
  AX.forEach(function(a,i){var p=rpt(i,113),ang=-Math.PI/2+i*2*Math.PI/RN,cx=Math.cos(ang),sy=Math.sin(ang),an=cx>.3?'start':cx<-.3?'end':'middle',
      d=a[2]-a[1],dt=d>0?'+'+d:d<0?''+d:'no change',cl=d<0?'a':d>0?'g':'z',x=p[0].toFixed(1),y=p[1],lines=a[0]==='Energy and metabolism'?['Energy and','metabolism']:[a[0]],lh=21,
      top=sy<-.7?y-(lines.length*lh+lh)+16:sy>.7?y+14:y-((lines.length+1)*lh)/2+16;
    h+='<text class="rx-lab'+(d<0?' a':'')+'" x="'+x+'" text-anchor="'+an+'">';
    lines.forEach(function(t,k){h+='<tspan x="'+x+'" y="'+(top+k*lh).toFixed(1)+'">'+t+'</tspan>';});
    h+='<tspan class="rx-d '+cl+'" x="'+x+'" y="'+(top+lines.length*lh).toFixed(1)+'">'+dt+'</tspan></text>';});
  h+='</g><polygon id="rprev" points="'+rpts(AX.map(function(a){return a[1];}))+'" fill="rgba(160,160,175,.16)" stroke="rgba(190,190,205,.9)" stroke-width="2" stroke-dasharray="5,4"/>';
  AX.forEach(function(a,i){var p=rpt(i,a[1]);h+='<circle class="rpd" cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="3" fill="rgba(190,190,205,.9)"/>';});
  h+='<polygon id="rcur" points="'+rpts(AX.map(function(a){return a[1];}))+'" fill="rgba(44,228,173,.18)" stroke="#2ce4ad" stroke-width="2.4" stroke-linejoin="round"/>';
  AX.forEach(function(a,i){h+='<circle class="rcd" r="4.5" fill="#2ce4ad" stroke="#0e0f12" stroke-width="1.5"/>';});
  return h+'</svg>';}
var RXR=[['Ferritin','µg/L',18,64,0,'g'],['Active B12','pmol/L',41,96,0,'g'],['TSH','mIU/L',3.9,2.1,1,'g'],['LDL cholesterol','mmol/L',2.9,3.4,1,'a']],
    RXT=[['TrueScore',71,86,0],['Biological age',37.2,35.9,1]];
function f(v,d){return d?v.toFixed(d):''+Math.round(v);}
var rx=$('rx'),rxa=$('rxa'),rxb=$('rxb'),rxth=$('rxth');
rxa.insertAdjacentHTML('beforeend',rBuild()+'<p class="rx-lg"><span><i class="pv"></i>Previous test</span><span><i></i>This test</span></p>');
(function(){var h='<div class="nx-t">';RXT.forEach(function(t){h+='<div><span>'+t[0]+'</span><b><s>'+f(t[1],t[3])+'</s><i>→</i><em data-v>'+f(t[1],t[3])+'</em></b></div>';});
  h+='</div><p class="nx-l"><span>What moved</span><span>Then → now</span></p><ul>';
  RXR.forEach(function(r){h+='<li class="'+r[5]+'"><span class="nx-n">'+r[0]+'</span><b class="nx-v"><s>'+f(r[2],r[4])+'</s> → <em data-v>'+f(r[2],r[4])+'</em> '+r[1]+'</b>'+(r[5]==='a'?'<small><i>Up since last time: worth watching</i></small>':'')+'</li>';});
  var k=h.indexOf('<p class="nx-l">');rxb.querySelector('.rx-sum').insertAdjacentHTML('beforeend',h.slice(0,k));rxb.insertAdjacentHTML('beforeend',h.slice(k)+'</ul><p class="nx-eg">Illustrative example</p>');})();
var rdr=$('rdr'),rprev=$('rprev'),rcur=$('rcur'),rcd=qa('#rdr .rcd'),rpd=qa('#rdr .rpd'),rds=qa('#rdr .rx-d'),rxv=qa('#rxb [data-v]'),rxli=qa('#rxb li'),RB={};
function rxSet(t){
  /* previous outline first, then this test grows out of it */
  var t0=ease(seg(t,0,.22)),t1=ease(seg(t,.26,.7));
  rprev.style.opacity=t0;rpd.forEach(function(c){c.style.opacity=t0;});rprev.style.strokeDashoffset=0;
  var v=AX.map(function(a){return a[1]+(a[2]-a[1])*t1;});rcur.setAttribute('points',rpts(v));rcur.style.opacity=seg(t,.24,.3);
  rcd.forEach(function(c,i){var p=rpt(i,v[i]);c.setAttribute('cx',p[0].toFixed(1));c.setAttribute('cy',p[1].toFixed(1));c.style.opacity=seg(t,.24,.3);});
  rds.forEach(function(d,i){d.style.opacity=seg(t,.66+i*.02,.72+i*.02);});
  RXT.forEach(function(r,i){var k=ease(seg(t,.4,.8));rxv[i].textContent=f(r[1]+(r[2]-r[1])*k,r[3]);});
  RXR.forEach(function(r,i){var k=ease(seg(t,.45+i*.06,.85+i*.04));rxv[2+i].textContent=f(r[2]+(r[3]-r[2])*k,r[4]);rxli[i].classList.toggle('done',k>.97);rxli[i].classList.add('on');});}
var CUTS=[.13,.28,.38,.50,.64,.80],K8=.88,C8=.885,S={id:0,p:0,P:0,fn:1,vk:[0,0,0,0,0,0,0,0],tip:0,left:1,fq:1,ff:1,fp:1},lastMove=0;
function render(P){
  var p=Math.min(1,P/K8);
  S.p=p;S.P=P;
  var qin=ease(seg(p,-.02,.012))*(1-ease(seg(p,.098,.125)));
  quiz.style.opacity=qin;quiz.style.transform='translate(-50%,-50%) scale('+(.9+.1*qin-.25*ease(seg(p,.098,.125)))*S.fq+')';
  var nq=0;qsteps.forEach(function(e){var on=p>=parseFloat(e.getAttribute('data-q'));e.classList.toggle('on',on);if(on)nq++;});
  meter.textContent=Math.min(12,Math.round(nq*12/qsteps.length));
  var vin=ease(seg(p,.125,.15));
  vial.setAttribute('transform','translate(150 '+(-84-40*(1-vin))+')');vial.style.opacity=vin*(1-seg(p,.27,.30));vhalo.setAttribute('opacity',0);
  S.tip=ease(seg(p,.15,.18));S.left=1-seg(p,.17,.27);vcap.setAttribute('opacity',1-seg(p,.14,.155));
  var k=S.vk;k[0]=ease(seg(p,.172,.19));k[1]=seg(p,.188,.28);k[2]=k[3]=ease(seg(p,.21,.25));k[4]=k[5]=ease(seg(p,.235,.26));k[6]=k[7]=ease(seg(p,.255,.275));
  /* the crisp body map takes over from the point cloud */
  var crisp=ease(seg(p,.355,.385))*(1-ease(seg(p,.50,.56)));
  bodyG.setAttribute('opacity',crisp);organs.forEach(function(o){o.classList.add('lit');});sv.classList.add('read');
  labs.forEach(function(g,i){g.classList.toggle('on',p>.385+i*.004&&p<.495);});
  legend.classList.toggle('on',p>.385&&p<.495);
  var on=false;
  if(p>.175&&p<.36){on=true;countB.textContent=Math.round(140*ease(seg(p,.18,.28)));countS.innerHTML='biomarkers<i>or 230 on Signature</i>';}
  else if(p>.555&&p<.605){on=true;countB.textContent=fmt(Math.round(9730*ease(seg(p,.555,.60))));countS.textContent='possible pairings';}
  else if(p>=.605&&p<.645){on=true;countB.textContent='11';countS.textContent='links that matter here';}
  $('lk1').hidden=p>=.605;$('lk2').hidden=p<.605;
  count.classList.toggle('on',on);count.classList.toggle('mint',p>.28);
  /* what it means */
  var fin=ease(seg(p,.668,.705))*(1-ease(seg(p,.81,.85)));
  find.style.opacity=fin;find.style.transform='translate(-50%,-50%) scale('+(1-.12*ease(seg(p,.81,.86)))*S.ff+')';
  var nar=W<520||window.innerWidth<900,ph2=nar?ease(seg(p,.748,.768)):0;S.fa=1-ph2;fa.style.opacity=1-ph2;fa.style.transform='translateY('+(-24*ph2)+'px)';fb.style.opacity=nar?ph2:1;fb.style.transform=nar?'translateY('+(24*(1-ph2))+'px)':'none';
  verdict.classList.toggle('on',p>.71);good.classList.toggle('on',nar?p>.752:p>.735);st1.classList.toggle('on',nar?p>.768:p>.755);st2.classList.toggle('on',nar?p>.778:p>.77);
  /* the report, on a phone */
  var pin=ease(seg(p,.82,.90));
  var n8=ease(seg(P,.872,.9)),nr=window.innerWidth<900;
  phone.style.opacity=seg(p,.82,.86)*(1-n8);
  phone.style.transform='translate(-50%,calc(-50% + '+(7*(1-pin)-6*n8)+'%)) rotateX('+(18*(1-pin))+'deg) scale('+S.fp*(1-.08*n8)+')';
  phone.classList.toggle('live',pin>.6&&n8<.5);
  /* step 8: radar. On phones it first fills the stage, then folds into a thumbnail above the summary and the buttons */
  var ra=ease(seg(P,.888,.91)),sm=nr?ease(seg(P,.962,.982)):0;rx.style.opacity=ra;rx.classList.toggle('live',ra>.5);
  rxSet(seg(P,.9,.958));
  rxa.querySelectorAll('.rx-t,.rx-lg').forEach(function(e){e.style.opacity=1-sm;});rdr.querySelector('.rl').style.opacity=1-sm;
  if(nr&&RB.a){var k=RB.a.width/540,s2=RB.t.width/(300*k),tx=RB.t.left-RB.a.left-120*k*s2,ty=RB.t.top-RB.a.top-82*k*s2;rdr.style.transform='translate('+(tx*sm)+'px,'+(ty*sm)+'px) scale('+(1-(1-s2)*sm)+')';}else rdr.style.transform='none';
  rxb.style.opacity=nr?sm:ra;rxb.style.transform=nr?'translateY('+(16*(1-sm))+'px)':'none';
  var cta=nr?(seg(p,.84,.88)*(1-n8)+sm*n8):seg(p,.84,.88);phc.style.opacity=cta;phc.style.transform='translate(-50%,'+(10*(1-pin))+'px)';phc.classList.toggle('live',cta>.5);
  var r=ease(seg(p,.86,.95));ringC.style.strokeDashoffset=169.6*(1-.71*r);ringN.textContent=Math.round(71*r);
  phRows.forEach(function(e,i){e.classList.toggle('on',p>.845+i*.012);});
  var id=0;CUTS.forEach(function(c){if(p>=c)id++;});if(P>=C8)id=7;stg.classList.toggle('at-end',id>=6);S.id=id;
  caps.forEach(function(c,i){c.classList.toggle('on',i===id);});
  railF.style.transform='scaleX('+P+')';ticks.forEach(function(t,i){t.classList.toggle('on',i<=id);t.classList.toggle('now',i===id);});
  railN.textContent=(id+1)+' of 8';railL.textContent=STEPS[id];railH.textContent=id===7?'The full picture':'Keep scrolling';
}
var W=0,H=0,D=1;
function size(){var r=scene.getBoundingClientRect();D=Math.min(2,window.devicePixelRatio||1);W=r.width;H=r.height;fx.width=Math.round(W*D);fx.height=Math.round(H*D);S.fq=Math.min(1,(H-10)/(quiz.offsetHeight||1));S.ff=Math.min(1,(H-10)/(find.offsetHeight||1));var nr=window.innerWidth<900,ch=phc.offsetHeight+(nr?12:18),room=H+(nr?34:0)-ch-(nr?10:26);S.fp=Math.min(1,room/(phone.offsetHeight||1),(W-(nr?20:40))/(phone.offsetWidth||1));phone.style.top=(room/2+(nr?4:12))+'px';var tf=rdr.style.transform;rdr.style.transform='none';var A=rdr.getBoundingClientRect(),B=rxth.getBoundingClientRect();RB={a:A,t:B};rdr.style.transform=tf;}
var last=0,run=false,T=0;
function frame(now){
  if(!run)return;requestAnimationFrame(frame);
  var dt=Math.min(.05,(now-last)/1000||0);last=now;T+=dt;var p=S.p;
  var an=116*S.tip,wob=Math.sin(T*2.1)*2.2+Math.sin(T*3.7)*1.1,tt=Math.max(0,Math.min(1,(an-55)/45)),lvl=(1-tt)*(18+70*(1-S.left))+tt*(100*S.left-6);
  vialr.setAttribute('transform','rotate('+an+' 0 46)');vblood.setAttribute('transform','rotate('+(-an+wob*(1+S.tip))+' 0 '+lvl+')');vblood.setAttribute('y',lvl);
  var m=sv.getScreenCTM(),c=fx.getBoundingClientRect();if(!m)return;if(Math.abs(c.width-W)>1||Math.abs(c.height-H)>1)size();
  var a=m.a*D,d=m.d*D,e=(m.e-c.left)*D,f=(m.f-c.top)*D;
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,fx.width,fx.height);ctx.globalCompositeOperation='lighter';
  if(p<.085)return;
  var wide=W>=520,CX=180,CY=234,F=900;
  /* camera: turns while the body forms, then settles square-on so the map reads clearly */
  var settle=ease(seg(p,.335,.37)),th=(Math.sin(T*.33)*.4+(p-.34)*2.2)*(1-settle)+Math.sin(T*.5)*.035*settle,cs=Math.cos(th),sn=Math.sin(th);
  var cloud=1-ease(seg(p,.50,.56));
  function pr(x,y,z){var X=x-CX,xr=X*cs+z*sn,zr=-X*sn+z*cs,pf=F/(F+zr);return [(CX+xr*pf)*a+e,(CY+(y-CY)*pf)*d+f,pf,zr];}
  if(cloud>0){
    var gA=ease(seg(p,.10,.16))*cloud;
    ctx.lineWidth=1*D;ctx.strokeStyle='rgba(44,228,173,'+(.11*gA)+')';ctx.beginPath();
    for(var g=-200;g<=200;g+=40){var q1=pr(CX+g,474,-200),q2=pr(CX+g,474,200);ctx.moveTo(q1[0],q1[1]);ctx.lineTo(q2[0],q2[1]);q1=pr(CX-200,474,g);q2=pr(CX+200,474,g);ctx.moveTo(q1[0],q1[1]);ctx.lineTo(q2[0],q2[1]);}ctx.stroke();
    var built=p>.37,skinA=cloud*(1-.45*settle);ctx.fillStyle='rgb(150,176,196)';
    for(var i=0;i<SK.length;i++){var q=SK[i],tb=.186+.092*(q.y-6)/456,b=built?1:ease(seg(p,tb+.012*q.o,tb+.04+.012*q.o));if(b<=0)continue;
      var x=q.x,z=q.z;if(b<1){var sp=(1-b)*2.6,X=x-CX,c2=Math.cos(sp),s2=Math.sin(sp),ex=1+1.5*(1-b);x=CX+(X*c2+z*s2)*ex;z=(-X*s2+z*c2)*ex;}
      var w=pr(x,q.y,z);ctx.globalAlpha=b*(.16+.26*c01(.5-w[3]/160))*skinA;var sz=(1.1+.5*w[2])*D;ctx.fillRect(w[0],w[1],sz,sz);}
    var orgA=cloud*(1-.9*ease(seg(p,.36,.39)));
    for(var oi=0;oi<ORG.length;oi++){var o=ORG[oi],tf=.292+.0052*oi,rt=ease(seg(p,tf,tf+.022)),cl=lerp3([240,60,72],RATE[o.sys],rt),fl=Math.max(0,1-Math.abs(p-tf-.008)/.014);
      ctx.fillStyle='rgb('+cl[0]+','+cl[1]+','+cl[2]+')';
      if(orgA>.01)for(var i=0;i<o.pts.length;i++){var q=o.pts[i],tb=.19+.088*(q.y-6)/456,b=built?1:ease(seg(p,tb+.012*q.o,tb+.04+.012*q.o));if(b<=0)continue;
        var x=q.x,z=q.z;if(b<1){var sp=(1-b)*2.6,X=x-CX,c2=Math.cos(sp),s2=Math.sin(sp),ex=1+1.5*(1-b);x=CX+(X*c2+z*s2)*ex;z=(-X*s2+z*c2)*ex;}
        var w=pr(x,q.y,z);ctx.globalAlpha=b*(.34+.4*c01(.5-w[3]/120)+.3*fl)*orgA*(.8+.2*Math.sin(T*1.6+q.o*9));var sz=(1.3+.7*w[2])*D;ctx.fillRect(w[0],w[1],sz,sz);}
      o.pp=pr(o.cx,o.cy,0);o.fl=fl;o.cl=cl;}
    ctx.globalAlpha=1;
    var flow=lerp3([229,52,63],[44,228,173],ease(seg(p,.30,.38))),vA=ease(seg(p,.17,.19))*cloud;
    if(vA>0){ctx.lineWidth=1.4*D;ctx.strokeStyle='rgba('+flow.join(',')+','+(.5*vA)+')';
      for(var v=1;v<VP.length;v++){var kk=S.vk[v];if(kk<=0)continue;var pts=VP[v],n=Math.floor(kk*80);ctx.beginPath();for(var i=0;i<=n;i++){var w=pr(pts[i*2],pts[i*2+1],0);if(i)ctx.lineTo(w[0],w[1]);else ctx.moveTo(w[0],w[1]);}ctx.stroke();}
      var cc=Math.min(255,flow[0]+40)+','+Math.min(255,flow[1]+60)+','+Math.min(255,flow[2]+60);
      for(var i=0;i<P.length;i++){var q=P[i];q.t+=q.v*dt;if(q.t>1)q.t-=1;var kk=S.vk[q.i];if(q.t>kk)continue;if(q.i===0&&p>.285)continue;
        var pts=VP[q.i],u=q.t*80,i0=Math.floor(u),fr=u-i0,i1=Math.min(80,i0+1),x=pts[i0*2]+(pts[i1*2]-pts[i0*2])*fr,y=pts[i0*2+1]+(pts[i1*2+1]-pts[i0*2+1])*fr;
        var w=q.i===0?[x*a+e,y*d+f,1]:pr(x+q.j*.6,y,q.j*.8),al=Math.min(1,(kk-q.t)*12)*vA,rr=q.r*a*w[2];
        ctx.fillStyle='rgba('+cc+','+(.16*al)+')';ctx.beginPath();ctx.arc(w[0],w[1],rr*3.4,0,6.283);ctx.fill();
        ctx.fillStyle='rgba('+cc+','+(.9*al)+')';ctx.beginPath();ctx.arc(w[0],w[1],rr,0,6.283);ctx.fill();}
      var k1=S.vk[1];if(k1>0&&k1<1){var j=Math.round(k1*80)*2,w=pr(VP[1][j],VP[1][j+1],0),g=ctx.createRadialGradient(w[0],w[1],0,w[0],w[1],26*a);
        g.addColorStop(0,'rgba(255,190,195,.95)');g.addColorStop(.25,'rgba(240,68,80,.5)');g.addColorStop(1,'rgba(229,52,63,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(w[0],w[1],26*a,0,6.283);ctx.fill();}}
  }
  else for(var oi=0;oi<ORG.length;oi++)ORG[oi].fl=0;
  /* ring geometry: the answers' orbit tilts up to become the big ring */
  var cx=fx.width/2,cy=fx.height*(wide?.52:.575),R=Math.min(fx.width*(wide?.38:.36),fx.height*(wide?.39:.33)),X=[],Y=[];
  var up=ease(seg(p,.50,.57)),gam=(1-up)*1.23,cg=Math.cos(gam),sg=Math.sin(gam);
  function rp(ang,rad){var u=rad*Math.sin(ang),z=u*sg,pf=3*R/(3*R+z);return [cx+rad*Math.cos(ang)*pf,cy+u*cg*pf,pf];}
  /* lifestyle answers */
  var qA=ease(seg(p,.10,.135))*(1-seg(p,.66,.70)),burst=ease(seg(p,.10,.14)),RQ=150*burst,ct=Math.cos(.34),st=Math.sin(.34),QP=[];
  {
    if(up<1){ctx.lineWidth=1*D;ctx.strokeStyle='rgba(255,255,255,'+(.16*qA*(1-up))+')';ctx.beginPath();
      for(var i=0;i<=72;i++){var ph=i/72*6.2832,zz=RQ*Math.sin(ph),w=pr(CX+RQ*Math.cos(ph),212+zz*st,zz*ct);if(i)ctx.lineTo(w[0],w[1]);else ctx.moveTo(w[0],w[1]);}ctx.stroke();}
    ctx.font='500 '+(11*D)+'px Outfit,system-ui,sans-serif';ctx.textBaseline='middle';
    for(var i=0;i<NQ;i++){var z0=QZ[i],ph=z0.orb+T*.28,zz=RQ*Math.sin(ph),w=pr(CX+RQ*Math.cos(ph),212+zz*st,zz*ct),front=c01(.5-w[3]/260),tq=ease(seg(p,.50+.03*z0.o,.565+.03*z0.o)),t=rp(z0.a,R);
      var x=w[0]+(t[0]-w[0])*tq,y=w[1]+(t[1]-w[1])*tq,s2=((2.2+1.6*front)*(1-tq)+3.2*tq)*D,al=(.35+.6*front)*(1-tq)+.95*tq;QP[i]=[x,y];X[140+i]=x;Y[140+i]=y;
      ctx.fillStyle='rgba(255,255,255,'+al*qA+')';ctx.fillRect(x-s2,y-s2,s2*2,s2*2);
      if(i%2===0&&front>.55&&p<.345&&W>=360){var rgt=x>fx.width/2,tw2=ctx.measureText(ORBN[i/2]).width,l0=rgt?x+9*D:x-9*D-tw2,sx=CX*a+e,clr=l0>sx+36*D||l0+tw2<sx-36*D;if(clr){ctx.fillStyle='rgba(235,240,245,'+((front-.55)/.45*.85*qA)+')';ctx.textAlign=rgt?'left':'right';ctx.fillText(ORBN[i/2],x+(rgt?9:-9)*D,y);}}}
    var bm=ease(seg(p,.33,.345))*(1-seg(p,.365,.385)),hp=O.nutrients.pp;
    var BQ=[];if(bm>0&&hp)[[0,'Heavy periods'],[6,'Mostly plant-based'],[12,'4 coffees a day']].forEach(function(bq,bi){var w=QP[bq[0]];ctx.strokeStyle='rgba(255,255,255,'+(.75*bm)+')';ctx.lineWidth=1.3*D;ctx.beginPath();ctx.moveTo(w[0],w[1]);ctx.lineTo(hp[0],hp[1]);ctx.stroke();
      var u=(T*.9+bi*.3)%1;ctx.fillStyle='rgba(255,255,255,'+bm+')';ctx.beginPath();ctx.arc(w[0]+(hp[0]-w[0])*u,w[1]+(hp[1]-w[1])*u,2.6*D,0,6.283);ctx.fill();
      ctx.font='500 '+(12*D)+'px Outfit,system-ui,sans-serif';ctx.textBaseline='middle';var tw=ctx.measureText(bq[1]).width,rt=w[0]>fx.width/2,tx=rt?Math.min(w[0]+10*D,fx.width-tw-6*D):Math.max(w[0]-10*D-tw,6*D);ctx.textAlign='left';BQ.push([bq[1],tx,w[1],tw]);});
    if(BQ.length){ctx.globalCompositeOperation='source-over';BQ.forEach(function(q){ctx.globalAlpha=bm;ctx.fillStyle='rgba(7,8,10,.92)';ctx.beginPath();if(ctx.roundRect)ctx.roundRect(q[1]-4*D,q[2]-9*D,q[3]+8*D,18*D,4*D);else ctx.rect(q[1]-4*D,q[2]-9*D,q[3]+8*D,18*D);ctx.fill();ctx.fillStyle='#fff';ctx.fillText(q[0],q[1],q[2]+.5*D);});ctx.globalAlpha=1;ctx.globalCompositeOperation='lighter';}
    for(var oi=0;oi<ORG.length;oi++){var o=ORG[oi];if(!(o.fl>0)||!o.pp)continue;var w=QP[(oi*5)%NQ];ctx.strokeStyle='rgba(255,255,255,'+(.8*o.fl)+')';ctx.lineWidth=1.2*D;ctx.beginPath();ctx.moveTo(w[0],w[1]);ctx.lineTo(o.pp[0],o.pp[1]);ctx.stroke();
      var g=ctx.createRadialGradient(o.pp[0],o.pp[1],0,o.pp[0],o.pp[1],30*a);g.addColorStop(0,'rgba('+o.cl.join(',')+','+(.6*o.fl)+')');g.addColorStop(1,'rgba('+o.cl.join(',')+',0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(o.pp[0],o.pp[1],30*a,0,6.283);ctx.fill();}}
  if(p<.495)return;
  /* the 140 results leave the body for the ring */
  var ringOut=seg(p,.645,.668);
  for(var i=0;i<140;i++){var q=M[i],t1=ease(seg(p,.50+.05*(q.si/16)+.008*q.o,.545+.05*(q.si/16)+.008*q.o)),ox2=q.x*a+e,oy2=q.y*d+f,t=rp(q.a,R*(1+.012*Math.sin(T*1.3+q.ph)));
    X[i]=ox2+(t[0]-ox2)*t1;Y[i]=oy2+(t[1]-oy2)*t1;q.t1=t1;}
  var ringA=ease(seg(p,.55,.59))*(1-ringOut);
  if(ringA>0){ctx.lineWidth=1.2*D;for(var i=0;i<ARC.length;i++){ctx.strokeStyle=hex(RATE[ARC[i][2]]);ctx.globalAlpha=.55*ringA;ctx.beginPath();ctx.arc(cx,cy,R+9*D,ARC[i][0],ARC[i][1]-.006);ctx.stroke();}
    ctx.globalAlpha=1;ctx.strokeStyle='rgba(255,255,255,'+(.7*ringA)+')';for(var i=0;i<QARC.length;i++){ctx.beginPath();ctx.arc(cx,cy,R+9*D,QARC[i][0],QARC[i][1]);ctx.stroke();}
    var qm=(QARC[2][0]+QARC[2][1])/2;ctx.font='500 '+(12.5*D)+'px Outfit,system-ui,sans-serif';ctx.textBaseline='middle';ctx.textAlign=Math.cos(qm)>.3?'left':Math.cos(qm)<-.3?'right':'center';ctx.fillStyle='rgba(255,255,255,'+(.95*ringA)+')';ctx.fillText('Your answers',cx+(R+26*D)*Math.cos(qm),cy+(R+26*D)*Math.sin(qm));
    if(wide){ctx.font=(12*D)+'px Outfit,system-ui,sans-serif';for(var i=0;i<ARC.length;i++){var nm=NAMES[ARC[i][2]];if(!nm)continue;var am=(ARC[i][0]+ARC[i][1])/2;ctx.textAlign=Math.cos(am)>.2?'left':Math.cos(am)<-.2?'right':'center';ctx.fillStyle='rgba(200,200,210,'+(.8*ringA)+')';ctx.fillText(nm,cx+(R+22*D)*Math.cos(am),cy+(R+22*D)*Math.sin(am));}}}
  /* every result against every other, and against every answer */
  var chA=seg(p,.555,.585)*(1-seg(p,.635,.66));
  if(chA>0){ctx.lineWidth=.6*D;var nv=Math.floor(CH.length*seg(p,.555,.60)),dimc=1-.85*seg(p,.60,.615);
    for(var i=0;i<nv;i++){var h=CH[i],al=chA*dimc*(.04+.18*Math.max(0,Math.sin(T*h[3]+h[2])));if(al<.012)continue;var cl=COL[M[h[0]].st];ctx.strokeStyle='rgba('+cl[0]+','+cl[1]+','+cl[2]+','+al+')';
      ctx.beginPath();ctx.moveTo(X[h[0]],Y[h[0]]);ctx.quadraticCurveTo(cx+(X[h[0]]+X[h[1]]-2*cx)*.06,cy+(Y[h[0]]+Y[h[1]]-2*cy)*.06,X[h[1]],Y[h[1]]);ctx.stroke();}
    for(var i=0;i<NQ;i++){var j=(i*37)%140,al=chA*dimc*(.05+.2*Math.max(0,Math.sin(T*1.1+i)));ctx.strokeStyle='rgba(255,255,255,'+al+')';ctx.beginPath();ctx.moveTo(X[140+i],Y[140+i]);ctx.quadraticCurveTo(cx,cy,X[j],Y[j]);ctx.stroke();}}
  /* the links that matter, then the same links laid out as the finding */
  var lay=ease(seg(p,.655,.71)),CP={},fr2=null;
  if(p>.64&&p<.87){fr2={};for(var kx in chipEls){var q=chipEls[kx].getBoundingClientRect();fr2[kx]=[(q.left-c.left)*D,(q.top+q.height/2-c.top)*D,(q.right-c.left)*D];}}
  for(var kx in KEY){var ix=KEY[kx],x=X[ix],y=Y[ix];if(fr2){var isL=kx.charAt(0)==='s',tx=fr2[kx][0]+7*D,ty=fr2[kx][1];x+=(tx-x)*lay;y+=(ty-y)*lay;CP[kx]=[x,y,fr2[kx][0],fr2[kx][2]];}else CP[kx]=[x,y,x,x];}
  var linkA=(1-seg(p,.81,.84))*(S.fa==null?1:S.fa);
  for(var i=0;i<EDGE.length;i++){var ed=EDGE[i],ha=ease(seg(p,.603+i*.004,.625+i*.004))*linkA;if(ha<=0)continue;var A=CP[ed[0]],B=CP[ed[1]];
    if(ed[2]){ha*=1-lay;if(ha<=0)continue;}
    var x0=A[0]+(A[3]-A[0])*lay,y0=A[1],x2=B[0]+(B[2]-B[0])*lay-(lay>0?2*D*lay:0),y2=B[1];
    var c1x=(cx+(x0-cx)*.3)*(1-lay)+(x0+(x2-x0)*.5)*lay,c1y=(cy+(y0-cy)*.3)*(1-lay)+y0*lay,c2x=(cx+(x2-cx)*.3)*(1-lay)+(x0+(x2-x0)*.5)*lay,c2y=(cy+(y2-cy)*.3)*(1-lay)+y2*lay;
    var col=ed[0].charAt(0)==='q'?'255,255,255':'255,120,125';
    for(var w2=0;w2<2;w2++){ctx.lineWidth=(w2?1.5+lay:6+3*lay)*D;ctx.strokeStyle='rgba('+col+','+(w2?.9:.13)*ha+')';ctx.beginPath();ctx.moveTo(x0,y0);ctx.bezierCurveTo(c1x,c1y,c2x,c2y,x2,y2);ctx.stroke();}
    var u=(T*.45+i*.21)%1,v=1-u,bx=v*v*v*x0+3*v*v*u*c1x+3*v*u*u*c2x+u*u*u*x2,by=v*v*v*y0+3*v*v*u*c1y+3*v*u*u*c2y+u*u*u*y2;ctx.fillStyle='rgba(255,255,255,'+ha+')';ctx.beginPath();ctx.arc(bx,by,2.4*D,0,6.283);ctx.fill();}
  var nA=ease(seg(p,.50,.52));
  for(var i=0;i<140;i++){var q=M[i];if(q.key)continue;var al=nA*(1-ringOut),cl=COL[q.st];if(al<=0)continue;var rad=(1.5+1.5*q.t1)*D*(1+.18*Math.sin(T*2.2+q.ph));
    ctx.fillStyle='rgba('+cl[0]+','+cl[1]+','+cl[2]+','+(.2*al)+')';ctx.beginPath();ctx.arc(X[i],Y[i],rad*3,0,6.283);ctx.fill();
    ctx.fillStyle='rgba('+cl[0]+','+cl[1]+','+cl[2]+','+al+')';ctx.beginPath();ctx.arc(X[i],Y[i],rad,0,6.283);ctx.fill();}
  var LBL=[];
  for(var kx in KEY){var ix=KEY[kx],w=CP[kx],isQ=ix>=140,cl=isQ?[255,255,255]:COL[M[ix].st],al=nA*linkA,hl=ease(seg(p,.60,.62)),rad=(3+1.6*hl)*D;
    ctx.fillStyle='rgba('+cl.join(',')+','+(.22*al)+')';ctx.beginPath();ctx.arc(w[0],w[1],rad*3,0,6.283);ctx.fill();ctx.fillStyle='rgba('+cl.join(',')+','+al+')';
    if(isQ)ctx.fillRect(w[0]-rad*.8,w[1]-rad*.8,rad*1.6,rad*1.6);else{ctx.beginPath();ctx.arc(w[0],w[1],rad,0,6.283);ctx.fill();}
    if(hl>0&&lay<.5){var nm=KN[kx],dx=cx-w[0],dy=cy-w[1],dl=Math.sqrt(dx*dx+dy*dy)||1;ctx.font='500 '+(12*D)+'px Outfit,system-ui,sans-serif';ctx.textBaseline='middle';var mid=Math.abs(dx/dl)<.42;ctx.textAlign=mid?'center':dx>0?'left':'right';ctx.fillStyle='rgba(255,255,255,'+(hl*(1-lay*2)*al)+')';var lo=LO[kx];LBL.push(mid?{t:nm,x:w[0]+dx/dl*6*D,y:w[1]+(dy>0?1:-1)*(lo+6)*D,al:ctx.textAlign,a:hl*(1-lay*2)*al}:{t:nm,x:w[0]+dx/dl*lo*D,y:w[1]+dy/dl*lo*D,al:ctx.textAlign,a:hl*(1-lay*2)*al});}
    if(hl>0&&lay<1){ctx.strokeStyle='rgba(255,255,255,'+(.9*hl*(1-lay)*al)+')';ctx.lineWidth=1.2*D;ctx.beginPath();ctx.arc(w[0],w[1],rad+4*D,0,6.283);ctx.stroke();}}
  /* ring labels: measured, nudged apart if they touch, each on a dark plate so no line runs through the text */
  if(LBL.length){ctx.font='500 '+(12*D)+'px Outfit,system-ui,sans-serif';ctx.textBaseline='middle';var lh=17*D,pd=5*D;
    LBL.forEach(function(L){L.w=ctx.measureText(L.t).width;L.l=L.al==='center'?L.x-L.w/2:L.al==='left'?L.x:L.x-L.w;});
    for(var it=0;it<4;it++)for(var i=0;i<LBL.length;i++)for(var j=i+1;j<LBL.length;j++){var A=LBL[i],B=LBL[j];
      if(A.l<B.l+B.w+pd&&B.l<A.l+A.w+pd&&Math.abs(A.y-B.y)<lh){var m=(lh-Math.abs(A.y-B.y))/2+1;if(B.y>=A.y){B.y+=m;A.y-=m;}else{B.y-=m;A.y+=m;}}}
    ctx.globalCompositeOperation='source-over';LBL.forEach(function(L){if(L.a<=0)return;ctx.globalAlpha=L.a;ctx.fillStyle='rgba(7,8,10,.95)';ctx.beginPath();if(ctx.roundRect)ctx.roundRect(L.l-4*D,L.y-8*D,L.w+8*D,16*D,4*D);else ctx.rect(L.l-4*D,L.y-8*D,L.w+8*D,16*D);ctx.fill();
      ctx.fillStyle='#fff';ctx.textAlign='left';ctx.fillText(L.t,L.l,L.y+.5*D);});ctx.globalAlpha=1;ctx.globalCompositeOperation='lighter';}
}
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
window.__render=render;
if(reduce||/[?&#]static/.test(location.href)){TVROOT.classList.add('static');organs.forEach(function(o){o.classList.add('lit');});sv.classList.add('read');bodyG.setAttribute('opacity',1);labs.forEach(function(g){g.classList.add('on');});caps.forEach(function(c){c.classList.add('on');});qsteps.forEach(function(e){e.classList.add('on');});meter.textContent=12;verdict.classList.add('on');st1.classList.add('on');st2.classList.add('on');good.classList.add('on');phRows.forEach(function(e){e.classList.add('on');});ringC.style.strokeDashoffset=169.6*.29;ringN.textContent=71;rxSet(1);return;}
scene.classList.add('gl');
var tick=false;
function upd(){tick=false;var r=story.getBoundingClientRect(),h=r.height-window.innerHeight,pp=c01(-r.top/h);render(pp);lastMove=performance.now();cue.classList.remove('on');
  cueT.textContent=r.top>0?'Scroll to see how it works':'Keep scrolling';cue.dataset.end=(pp>=.985||r.bottom<window.innerHeight*.6)?'1':'';}
function req(){if(!tick){tick=true;requestAnimationFrame(upd);}}
window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',function(){size();req();});
size();upd();lastMove=performance.now()-600;
setInterval(function(){if(!cue.dataset.end&&S.id<6&&performance.now()-lastMove>900)cue.classList.add('on');},300);
function go(on){if(on&&!run){run=true;last=performance.now();requestAnimationFrame(frame);}else if(!on)run=false;}
if('IntersectionObserver' in window)new IntersectionObserver(function(en){go(en[0].isIntersecting);}).observe(story);else go(true);

}catch(err){TVROOT.classList.add('static');if(window.console)console.error('tv-home-story',err);}}
if(LINK&&!LINK.sheet){LINK.addEventListener('load',start);LINK.addEventListener('error',start);setTimeout(start,4000);}else start();
})();
