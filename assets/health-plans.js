(function(){
'use strict';
const API=(window.TV_PAYL8R_API||'https://truevitals-payl8r.james-smillie-8c6.workers.dev').replace(/\/$/,'');
const root=document.getElementById('tvhp'); if(!root) return;
const $=(id)=>document.getElementById(id);
const L={ULT:{name:'Ultimate',markers:140,prices:[349,319,299,299],floor:299,phleb:{clinic:19,home:39}},SIG:{name:'Signature',markers:230,prices:[799,749,699,699],floor:699,phleb:{clinic:0}}};
const STRIPE={'ULT-2-clinic-y1':'https://buy.stripe.com/7sY3cp2Db14n8nt6FLbbG0m','ULT-3-clinic-y1':'https://buy.stripe.com/28E6oBb9HfZhavB5BHbbG0n','ULT-4-clinic-y1':'https://buy.stripe.com/00weV7fpXaEX339d49bbG0o','ULT-2-home-y1':'https://buy.stripe.com/8x27sF4Lj00j7jpd49bbG0p','ULT-3-home-y1':'https://buy.stripe.com/dRm6oBelT8wP0V1e8dbbG0q','ULT-4-home-y1':'https://buy.stripe.com/4gM7sFa5DbJ19rx4xDbbG0r','SIG-2-y1':'https://buy.stripe.com/8x23cp7XvdR96fl2pvbbG0j','SIG-3-y1':'https://buy.stripe.com/14A00da5DbJ1cDJ2pvbbG0k','SIG-4-y1':'https://buy.stripe.com/14A00d5Pn3cvavB8NTbbG0l'};
const q=new URLSearchParams(location.search);
const S={fam:q.get('panel')==='signature'?'SIG':'ULT',per:2,years:1,coll:'clinic',upgrade:null,term:12};
const P8LOGO='<span class="hp-p8"><img src="https://cdn.prod.website-files.com/6825a8869d9afdbdbc4d8881/6a9d86fbfc68284afd4a71b3_Payl8r%20Logo%20_New%20Purple_-p-500.avif" alt="Payl8r"></span>';
let lastQuote=null;
const gbp=(n)=>'\u00a3'+Math.round(n).toLocaleString('en-GB');
const dateUK=(iso)=>{try{return new Date(iso+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long'})}catch(e){return iso}};
function key(){return S.fam==='SIG'?`SIG-${S.per}-y${S.years}`:`ULT-${S.per}-${S.coll}-y${S.years}`}
function calc(){const P=L[S.fam];const tests=S.per*S.years;const ph=S.fam==='SIG'?0:P.phleb[S.coll];const year1=P.prices.slice(0,S.per).reduce((a,b)=>a+b,0);const panel=year1+(S.years-1)*S.per*P.floor;const total=panel+ph*tests;const list=tests*P.prices[0]+ph*tests;return{tests,total,list,saving:list-total,perTest:total/tests,ladder:P.prices.slice(0,S.per),floor:P.floor,ph,top:P.prices[0]}}
function paint(){
  root.querySelectorAll('[data-fam]').forEach(b=>{b.classList.toggle('on',b.dataset.fam===S.fam);if(S.upgrade)b.disabled=b.dataset.fam!==S.fam});
  root.querySelectorAll('[data-per]').forEach(b=>b.classList.toggle('on',+b.dataset.per===S.per));
  root.querySelectorAll('[data-years]').forEach(b=>b.classList.toggle('on',+b.dataset.years===S.years));
  root.querySelectorAll('[data-coll]').forEach(b=>b.classList.toggle('on',b.dataset.coll===S.coll));
  $('hpColl').style.display=S.fam==='SIG'?'none':'';
  root.classList.toggle('sig',S.fam==='SIG');
}
function render(){
  paint(); const c=calc(); const P=L[S.fam]; const k=key(); const up=S.upgrade;
  $('hpName').innerHTML=`<b>${P.name} plan</b>${c.tests} tests over ${S.years*12} months${S.fam==='SIG'?', clinic draws included':(S.coll==='home'?', at home':', in clinic')}`;
  $('hpSave').innerHTML=`<span class="num">${gbp(c.saving)}</span><span>saved vs ${c.tests} tests at ${gbp(c.top)}</span>`;
  // ladder: year 1 walks down; later years are one locked bar each
  const rows=[];
  const wOf=(p)=>{const span=c.top-c.floor;if(span<=0)return 100;const r=Math.max(0,(p-c.floor)/span);return Math.round(44+56*Math.pow(r,.72))};
  c.ladder.forEach((p,i)=>{const w=wOf(p);const drop=c.top-p;rows.push(`<div class="hp-rung${i===0?' first':''}"><span class="hp-t">Test ${i+1}</span><div class="hp-bar" style="width:${w}%"><span>${gbp(p)}${c.ph?`<span class="hp-drop"> +${gbp(c.ph)}</span>`:''}</span>${drop?`<span class="hp-drop">\u2212${gbp(drop)}</span>`:''}</div></div>`)});
  for(let y=2;y<=S.years;y++){const w=wOf(c.floor);const a=(y-1)*S.per+1,b=y*S.per;rows.push(`<div class="hp-rung locked"><span class="hp-t">Year ${y}</span><div class="hp-bar" style="width:${w}%"><span>${gbp(c.floor)} each</span><span class="hp-drop">tests ${a}\u2013${b}, locked</span></div></div>`)}
  $('hpLadder').innerHTML=rows.join('');
  $('hpFloor').innerHTML=S.years>1?`Year 1 walks the ladder. Every test after that is <b>${gbp(c.floor)}</b>, locked for the whole plan, whatever our prices do.`:`Each test in the year is cheaper than the last. Add a second year and every test after this one is <b>${gbp(c.floor)}</b>, locked.`;
  if(up){$('hpTotal').innerHTML=`<s>${gbp(c.total)}</s>${gbp(Math.max(0,c.total-up.credit))}`;$('hpPer').innerHTML=`<b>${gbp(up.credit)} already paid</b><br>for your test on ${dateUK(up.purchased)}`}
  else{$('hpTotal').textContent=gbp(c.total);$('hpPer').innerHTML=`<b>${gbp(c.perTest)} per test</b><br>draws and reports included`}
  const maxTerm=S.years>=2?24:12; const terms=[12,18,24]; if(!terms.includes(S.term)||S.term>maxTerm)S.term=Math.min(12,maxTerm);
  $('hpTerm').innerHTML='<span>Pay over</span>'+terms.map(t=>`<button type="button" data-term="${t}" class="${t===S.term?'on':''}" ${t>maxTerm?'disabled':''}>${t} months</button>`).join('');
  const stripe=STRIPE[k];
  const monthly=API+'/payl8r-init?plan='+encodeURIComponent(k)+(up?'&upgrade='+encodeURIComponent(up.orderId):'')+(window.TV_SESSION?'&ref='+encodeURIComponent(window.TV_SESSION):'');
  $('hpMonthly').href=monthly; $('hpMonthly').innerHTML=P8LOGO+'Pay monthly<small>checking figures\u2026</small>';
  if(up){$('hpFull').href=API+'/upgrade-checkout?plan='+encodeURIComponent(k)+'&upgrade='+encodeURIComponent(up.orderId);$('hpFull').style.display='';$('hpFull').innerHTML=`Pay ${gbp(Math.max(0,c.total-up.credit))} now<small>card, Apple Pay or Google Pay</small>`}
  else if(stripe){$('hpFull').style.display='';$('hpFull').href=stripe+'?client_reference_id='+encodeURIComponent('plan-'+k+(window.TV_SESSION?'_s-'+window.TV_SESSION:''));$('hpFull').innerHTML=`Pay ${gbp(c.total)} now<small>card, Apple Pay or Google Pay</small>`}
  else{$('hpFull').style.display='none'}
  fetch(API+'/payl8r-price?key='+encodeURIComponent(k)+(up?'&upgrade='+encodeURIComponent(up.orderId):'')).then(r=>r.json()).then(d=>{
    if(d.upgrade_error){ leaveUpgrade(d.upgrade_error); return; }
    const total=d.total; if(total!=null&&!up)$('hpTotal').textContent=gbp(total);
    if(up&&d.balance!=null){$('hpTotal').innerHTML=`<s>${gbp(d.fullTotal||c.total)}</s>${gbp(d.balance)}`;$('hpFull').innerHTML=`Pay ${gbp(d.balance)} now<small>card, Apple Pay or Google Pay</small>`;if(d.stripe===false)$('hpFull').style.display='none'}
    lastQuote=d.quote||null; paintMonthly();
    if(d.live===false)$('hpLive').style.display='';
  }).catch(()=>{lastQuote=null;paintMonthly();/* Worker not live yet: route pay-monthly to the information page rather than an error */ $('hpMonthly').href='/pay-monthly'; $('hpMonthly').innerHTML=P8LOGO+'Pay monthly<small>how it works</small>'; $('hpLive').style.display='none';});
}
function paintMonthly(){
  const qt=lastQuote; const el=$('hpMonthly');
  if(qt&&qt.available&&qt.options&&qt.options.length){
    const o=qt.options.find(x=>x.months===S.term)||qt.options.reduce((a,b)=>Math.abs(b.months-S.term)<Math.abs(a.months-S.term)?b:a);
    el.innerHTML=P8LOGO+`${gbp(o.monthly)} a month<small>${o.months} months, ${o.apr?'representative '+o.apr+'% APR':'0% APR'}</small>`;
    $('hpFine').innerHTML=`Total payable ${gbp(o.totalPayable)} over ${o.months} months. ${qt.rep||''} Soft search first; a decision usually takes under a minute.`;
  } else { el.innerHTML=P8LOGO+'Pay monthly<small>soft search first</small>'; $('hpFine').innerHTML='Finance subject to status. 18+, UK residents.'; }
}
function leaveUpgrade(reason){S.upgrade=null;root.classList.remove('upgrade');root.querySelectorAll('[data-fam]').forEach(b=>b.disabled=false);const u=$('hpUp');u.style.display='block';u.innerHTML=reason==='window closed'?'The 30-day upgrade window on your last test has closed, so plan pricing below is the standard ladder. Your next test on a plan still starts at the lower price.':'That upgrade link isn\u2019t valid any more; plan pricing below is the standard ladder.';render()}
function boot(){
  const upId=q.get('upgrade');
  const resolveUp=(url)=>fetch(url).then(r=>r.json()).then(d=>{
      if(d.upgrade){S.upgrade={orderId:d.upgrade.orderId||upId,credit:d.upgrade.credit,until:d.upgrade.until,purchased:d.upgrade.purchased};S.fam=d.upgrade.panel==='signature'?'SIG':'ULT';if(d.upgrade.phleb)S.coll=d.upgrade.phleb;root.classList.add('upgrade');
        $('hpUp').innerHTML=`<b>${d.upgrade.firstName?d.upgrade.firstName+', your':'Your'} ${S.fam==='SIG'?'Signature':'Ultimate'} test on ${dateUK(d.upgrade.purchased)} counts as test one.</b> The ${gbp(d.upgrade.credit)} you paid comes off any plan below. <span class="hp-up-when">Upgrade by ${dateUK(d.upgrade.until)}</span>, then the window closes and the ladder starts from scratch.`;
        render();}
      else if(d.upgrade_error==='login required'){$('hpUp').style.display='block';$('hpUp').innerHTML='<b>Log in to see your upgrade offer.</b> If you bought a test in the last 30 days it counts as test one. <a href="/login?redirect=/health-plans%3Fupgrade%3Dlatest" style="text-decoration:underline;color:#fff">Log in</a>';render()}
      else leaveUpgrade(d.upgrade_error||'invalid');
    }).catch(()=>leaveUpgrade('invalid'));
  if(upId==='latest'){
    let done=false; const t=setInterval(()=>{ if(!window.$memberstackDom) return; clearInterval(t); done=true;
      window.$memberstackDom.getCurrentMember().then(r=>{const m=r&&r.data; if(m&&m.auth&&m.auth.email) resolveUp(API+'/payl8r-price?upgrade=latest&email='+encodeURIComponent(m.auth.email)); else resolveUp(API+'/payl8r-price?upgrade=latest');}).catch(()=>resolveUp(API+'/payl8r-price?upgrade=latest'));},100);
    setTimeout(()=>{ if(!done){ clearInterval(t); resolveUp(API+'/payl8r-price?upgrade=latest'); } },4000);
  } else if(upId&&/^[0-9a-f-]{36}$/i.test(upId)){
    resolveUp(API+'/payl8r-price?upgrade='+encodeURIComponent(upId));
  } else if(q.get('expired')){ $('hpUp').style.display='block'; $('hpUp').textContent='The upgrade window on that test has closed. Plan pricing below is the standard ladder.'; render(); }
  else render();
}
root.addEventListener('click',e=>{const t=e.target.closest('button[data-term]');if(t&&!t.disabled){S.term=+t.dataset.term;root.querySelectorAll('[data-term]').forEach(x=>x.classList.toggle('on',+x.dataset.term===S.term));paintMonthly();return}
  const b=e.target.closest('button[data-fam],button[data-per],button[data-years],button[data-coll]');if(!b||b.disabled)return;if(b.dataset.fam)S.fam=b.dataset.fam;if(b.dataset.per)S.per=+b.dataset.per;if(b.dataset.years)S.years=+b.dataset.years;if(b.dataset.coll)S.coll=b.dataset.coll;render()});
root.querySelectorAll('.hp-fq').forEach(b=>b.addEventListener('click',()=>b.parentElement.classList.toggle('open')));
boot();
})();
