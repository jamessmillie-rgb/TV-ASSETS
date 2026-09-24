(function(){
'use strict';
const API=(window.TV_PAYL8R_API||'https://truevitals-payl8r.james-smillie-8c6.workers.dev').replace(/\/$/,'');
const root=document.getElementById('tvhp'); if(!root) return;
const $=(id)=>document.getElementById(id);
// pricing mirrors the Worker; the Worker's answer wins where it differs
const L={ULT:{name:'Ultimate',markers:140,prices:[349,319,299],floor:299,phleb:{clinic:19,home:39}},SIG:{name:'Signature',markers:230,prices:[799,749,699],floor:699,phleb:{clinic:0}}};
// pay-in-full links exist for 12-month plans only
const STRIPE={'ULT-2-clinic-y1':'https://buy.stripe.com/7sY3cp2Db14n8nt6FLbbG0m','ULT-3-clinic-y1':'https://buy.stripe.com/28E6oBb9HfZhavB5BHbbG0n','ULT-2-home-y1':'https://buy.stripe.com/8x27sF4Lj00j7jpd49bbG0p','ULT-3-home-y1':'https://buy.stripe.com/dRm6oBelT8wP0V1e8dbbG0q','SIG-2-y1':'https://buy.stripe.com/8x23cp7XvdR96fl2pvbbG0j','SIG-3-y1':'https://buy.stripe.com/14A00da5DbJ1cDJ2pvbbG0k'};
const S={fam:'ULT',per:2,years:1,coll:'clinic'};
const q=new URLSearchParams(location.search); if(q.get('panel')==='signature')S.fam='SIG';
const gbp=(n)=>'\u00a3'+Math.round(n).toLocaleString('en-GB');
function key(){return S.fam==='SIG'?`SIG-${S.per}-y${S.years}`:`ULT-${S.per}-${S.coll}-y${S.years}`}
function calc(){const P=L[S.fam];const tests=S.per*S.years;const year1=P.prices.slice(0,S.per).reduce((a,b)=>a+b,0);const panel=year1+(S.years-1)*S.per*P.floor;const ph=(S.fam==='SIG'?0:P.phleb[S.coll])*tests;const total=panel+ph;const list=tests*P.prices[0]+ph;return{tests,total,list,saving:list-total,perTest:total/tests,ladder:P.prices.slice(0,S.per),floor:P.floor,ph:S.fam==='SIG'?0:P.phleb[S.coll]}}
function paintToggles(){
  root.querySelectorAll('[data-fam]').forEach(b=>b.classList.toggle('on',b.dataset.fam===S.fam));
  root.querySelectorAll('[data-per]').forEach(b=>b.classList.toggle('on',+b.dataset.per===S.per));
  root.querySelectorAll('[data-years]').forEach(b=>b.classList.toggle('on',+b.dataset.years===S.years));
  root.querySelectorAll('[data-coll]').forEach(b=>b.classList.toggle('on',b.dataset.coll===S.coll));
  $('hpColl').style.display=S.fam==='SIG'?'none':'';
  root.classList.toggle('sig',S.fam==='SIG');
}
function render(){
  paintToggles(); const c=calc(); const P=L[S.fam]; const k=key();
  $('hpName').textContent=`${P.name} \u00b7 ${c.tests} tests over ${S.years*12} months`;
  $('hpTotal').textContent=gbp(c.total);
  $('hpPerTest').textContent=gbp(c.perTest)+' per test, everything included';
  $('hpSave').innerHTML=c.saving>0?`Save <b>${gbp(c.saving)}</b> against ${c.tests} tests bought separately (${gbp(c.list)})`:'';
  // ladder
  const rows=[];for(let y=0;y<S.years;y++){for(let i=0;i<S.per;i++){const n=y*S.per+i+1;const price=y===0?c.ladder[i]:c.floor;const month=Math.round((n-1)*(12/S.per));rows.push(`<div class="hp-rung${y>0?' locked':''}"><span class="hp-rn">Test ${n}</span><span class="hp-rm">${month===0?'Month 1':'Month '+(month+1)}</span><span class="hp-rp">${gbp(price)}${c.ph?` <i>+${gbp(c.ph)} draw</i>`:''}</span></div>`)}}
  $('hpLadder').innerHTML=rows.join('');
  $('hpLadderNote').textContent=S.years>1?`Year 1 walks the ladder. Every test after that is ${gbp(c.floor)}, locked for the whole plan.`:`The price drops with every test in the year.`;
  // timeline
  const months=S.years*12;const dots=[];for(let n=0;n<c.tests;n++){const m=n*(12/S.per);dots.push(`<div class="hp-dot" style="left:${(m/months)*100}%"><i></i><span>T${n+1}</span></div>`)}
  $('hpTimeline').innerHTML=`<div class="hp-tl-bar"></div>${dots.join('')}<div class="hp-tl-end" style="left:100%"><span>${months} mo</span></div>`;
  // CTAs
  const stripe=STRIPE[k]; $('hpFull').style.display=stripe?'':'none'; if(stripe)$('hpFull').href=stripe+'?client_reference_id='+encodeURIComponent('plan-'+k+(window.TV_SESSION?'_s-'+window.TV_SESSION:''));
  $('hpMonthly').href=API+'/payl8r-init?plan='+encodeURIComponent(k)+(window.TV_SESSION?'&ref='+encodeURIComponent(window.TV_SESSION):'');
  $('hpMonthly').textContent='Apply to pay monthly'; $('hpQuote').textContent='Checking monthly figures\u2026'; $('hpQuote').className='hp-quote';
  fetch(API+'/payl8r-price?key='+encodeURIComponent(k)).then(r=>r.json()).then(d=>{
    if(d.total&&d.total!==c.total){$('hpTotal').textContent=gbp(d.total)}
    const qt=d.quote||{};
    if(qt.available){const f=qt.from;const def=qt.default||f;$('hpQuote').innerHTML=`<b>from ${gbp(f.monthly)} a month</b> over ${f.months} months${f.apr?` at ${f.apr}% APR`:', 0% APR'}${def&&def.months!==f.months?` \u00b7 or ${gbp(def.monthly)} over ${def.months} months`:''}`;$('hpMonthly').textContent=`Pay from ${gbp(f.monthly)}/month`;$('hpRep').textContent=qt.rep||'';}
    else{$('hpQuote').innerHTML='Spread the cost with Payl8r. Soft search, decision in about a minute.';$('hpRep').textContent='';}
    if(d.live===false){$('hpLiveNote').style.display='';}
  }).catch(()=>{$('hpQuote').innerHTML='Spread the cost with Payl8r. Soft search, decision in about a minute.'});
}
root.addEventListener('click',e=>{const b=e.target.closest('button[data-fam],button[data-per],button[data-years],button[data-coll]');if(!b)return;if(b.dataset.fam)S.fam=b.dataset.fam;if(b.dataset.per)S.per=+b.dataset.per;if(b.dataset.years)S.years=+b.dataset.years;if(b.dataset.coll)S.coll=b.dataset.coll;render()});
root.querySelectorAll('.hp-fq').forEach(b=>b.addEventListener('click',()=>b.parentElement.classList.toggle('open')));
render();
})();
