(function(){
'use strict';
const API = (window.TV_BOOKING_API || 'https://truevitals-randox-booking.james-smillie-8c6.workers.dev').replace(/\/$/, '');
const $ = (id) => document.getElementById(id);
const root = $('tvb'); if (!root) return;
const S = { member: null, order: null, venues: [], venue: null, slots: [], day: null, slot: null, hold: null, booking: null, from: null };

function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function fmtDay(iso){return new Date(iso+'T00:00:00Z').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:'Europe/London'})}
function fmtTime(iso){return new Date(iso).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/London'})}
function fmtLong(iso){return new Date(iso).toLocaleString('en-GB',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit',timeZone:'Europe/London'})}
function localDay(iso){const d=new Date(iso);return d.toLocaleDateString('en-CA',{timeZone:'Europe/London'})}
function setStep(n){root.querySelectorAll('.tvb-step').forEach((el,i)=>{el.classList.toggle('on',i+1===n);el.classList.toggle('done',i+1<n)});root.querySelectorAll('.tvb-panel').forEach(p=>p.classList.toggle('on',p.dataset.step==String(n)));window.scrollTo({top:root.offsetTop-80,behavior:'smooth'})}
function msg(html,kind){const m=$('tvbMsg');m.className='tvb-msg '+(kind||'');m.innerHTML=html;m.style.display=''}
function busy(on){root.classList.toggle('busy',!!on)}

async function api(path,opts){const r=await fetch(API+path,Object.assign({headers:{'Content-Type':'application/json'}},opts||{}));const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||('request failed '+r.status));return j}
function ident(){return {member_id:S.member.id,email:S.member.email}}

// ---------- boot ----------
async function boot(){
  const t=setInterval(async()=>{ if(!window.$memberstackDom)return; clearInterval(t);
    try{ const r=await window.$memberstackDom.getCurrentMember(); const m=r&&r.data; if(!m||!m.id){ $('tvbGate').style.display=''; $('tvbApp').style.display='none'; return }
      S.member={id:m.id,email:m.auth.email,first:(m.customFields||{})['first-name']||''};
      await loadOrder();
    }catch(e){ msg('Something went wrong loading your account. Please refresh, or email info@truevitals.co.uk.','err') }
  },100);
}
async function loadOrder(){
  busy(true);
  try{
    const o=await api('/booking?'+new URLSearchParams(ident()));
    S.order=o;
    if(o.booking&&o.booking.confirmed){ S.booking=o.booking; renderConfirmed(); return }
    const v=await api('/venues'); S.venues=v.venues||[]; renderVenues(S.venues); setStep(1);
  }catch(e){
    if(/order not found/i.test(e.message)){ $('tvbNoOrder').style.display=''; $('tvbApp').style.display='none' }
    else msg('Could not load your booking: '+esc(e.message),'err');
  }finally{busy(false)}
}

// ---------- step 1: venue ----------
function dist(a,b){if(!a||!b||a.lat==null||b.lat==null)return null;const R=6371,dLat=(b.lat-a.lat)*Math.PI/180,dLng=(b.lng-a.lng)*Math.PI/180;const x=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(x))}
let here=null;
function renderVenues(list){
  const q=($('tvbSearch').value||'').toLowerCase().trim();
  let rows=list.filter(v=>!q||[v.name,v.address,v.postcode].join(' ').toLowerCase().includes(q));
  if(here) rows=rows.map(v=>({...v,_d:dist(here,v)})).sort((a,b)=>(a._d??1e9)-(b._d??1e9));
  $('tvbVenues').innerHTML=rows.length?rows.map(v=>`<button type="button" class="tvb-venue${S.venue&&S.venue.id===v.id?' on':''}" data-id="${esc(v.id)}"><span class="tvb-vn">${esc(v.name)}</span><span class="tvb-va">${esc([v.address,v.postcode].filter(Boolean).join(', '))}</span>${v._d!=null?`<span class="tvb-vd">${v._d<10?v._d.toFixed(1):Math.round(v._d)} miles</span>`:''}</button>`).join(''):'<div class="tvb-empty">No venues match that. Try a town or postcode.</div>';
  $('tvbVenues').querySelectorAll('.tvb-venue').forEach(b=>b.onclick=()=>{S.venue=S.venues.find(v=>String(v.id)===b.dataset.id);renderVenues(S.venues);$('tvbNext1').disabled=!S.venue});
}
$('tvbSearch').addEventListener('input',()=>renderVenues(S.venues));
$('tvbNear').onclick=()=>{ if(!navigator.geolocation)return; $('tvbNear').textContent='Finding you…'; navigator.geolocation.getCurrentPosition(p=>{here={lat:p.coords.latitude,lng:p.coords.longitude};$('tvbNear').textContent='Sorted by distance';renderVenues(S.venues)},()=>{$('tvbNear').textContent='Location unavailable'}) };
$('tvbNext1').onclick=async()=>{ if(!S.venue)return; setStep(2); await loadSlots() };

// ---------- step 2: slots ----------
async function loadSlots(){
  busy(true); $('tvbDays').innerHTML=''; $('tvbSlots').innerHTML='<div class="tvb-empty">Checking availability…</div>';
  try{
    const a=await api('/availability?'+new URLSearchParams({venue:S.venue.id,days:21}));
    S.slots=(a.slots||[]).filter(s=>new Date(s.start)>new Date());
    const byDay={}; S.slots.forEach(s=>{const d=localDay(s.start);(byDay[d]=byDay[d]||[]).push(s)});
    const days=Object.keys(byDay).sort();
    if(!days.length){$('tvbSlots').innerHTML='<div class="tvb-empty">No appointments in the next three weeks at this venue. Try another venue, or email us and we will find one.</div>';return}
    S.day=days[0];
    $('tvbDays').innerHTML=days.map(d=>`<button type="button" class="tvb-day${d===S.day?' on':''}" data-d="${d}"><b>${fmtDay(d).split(' ')[0]}</b><span>${fmtDay(d).split(' ').slice(1).join(' ')}</span><i>${byDay[d].length}</i></button>`).join('');
    $('tvbDays').querySelectorAll('.tvb-day').forEach(b=>b.onclick=()=>{S.day=b.dataset.d;S.slot=null;$('tvbDays').querySelectorAll('.tvb-day').forEach(x=>x.classList.toggle('on',x===b));renderSlots(byDay)});
    renderSlots(byDay);
    $('tvbVenueLine').textContent=S.venue.name+(S.venue.address?', '+S.venue.address:'');
  }catch(e){$('tvbSlots').innerHTML='<div class="tvb-empty">Could not load availability: '+esc(e.message)+'</div>'}finally{busy(false)}
}
function renderSlots(byDay){
  const list=byDay[S.day]||[];
  $('tvbSlots').innerHTML=list.map(s=>`<button type="button" class="tvb-slot${S.slot&&S.slot.start===s.start?' on':''}" data-s="${esc(s.start)}">${fmtTime(s.start)}</button>`).join('');
  $('tvbSlots').querySelectorAll('.tvb-slot').forEach(b=>b.onclick=()=>{S.slot=list.find(x=>x.start===b.dataset.s);$('tvbSlots').querySelectorAll('.tvb-slot').forEach(x=>x.classList.toggle('on',x===b));$('tvbNext2').disabled=!S.slot});
  $('tvbNext2').disabled=!S.slot;
}
$('tvbBack2').onclick=()=>setStep(1);
$('tvbNext2').onclick=async()=>{ if(!S.slot)return; busy(true);
  try{ const h=await api('/hold',{method:'POST',body:JSON.stringify(Object.assign(ident(),{venue:S.venue.id,venue_name:S.venue.name,slot:S.slot.start}))}); S.hold=h.hold;
    $('tvbSumVenue').textContent=S.venue.name; $('tvbSumAddr').textContent=[S.venue.address,S.venue.postcode].filter(Boolean).join(', '); $('tvbSumWhen').textContent=fmtLong(S.slot.start); $('tvbSumName').textContent=S.member.first?S.member.first+' ('+S.member.email+')':S.member.email;
    setStep(3);
  }catch(e){msg('That slot could not be held: '+esc(e.message)+'. Please choose another.','err')}finally{busy(false)} };

// ---------- step 3: confirm ----------
$('tvbBack3').onclick=()=>setStep(2);
$('tvbBook').onclick=async()=>{ busy(true); $('tvbBook').disabled=true;
  try{ const b=await api('/book',{method:'POST',body:JSON.stringify(Object.assign(ident(),{venue:S.venue.id,venue_name:S.venue.name,slot:S.slot.start,hold:S.hold}))}); S.booking=b.booking; renderConfirmed(); }
  catch(e){ msg('The booking did not go through: '+esc(e.message)+'. Nothing has been charged and nothing is booked; please try again or email info@truevitals.co.uk.','err'); $('tvbBook').disabled=false }
  finally{busy(false)} };

function ics(b){const dt=s=>new Date(s).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const end=new Date(new Date(b.start).getTime()+30*60000).toISOString();const v=S.venue||S.venues.find(x=>String(x.id)===String(b.venue))||{};return 'data:text/calendar;charset=utf-8,'+encodeURIComponent(['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//TrueVitals//Booking//EN','BEGIN:VEVENT','UID:'+(b.reference||b.order_number)+'@truevitals.co.uk','DTSTAMP:'+dt(new Date().toISOString()),'DTSTART:'+dt(b.start),'DTEND:'+dt(end),'SUMMARY:TrueVitals Signature blood draw at '+(b.venue_name||v.name||'Randox Health'),'LOCATION:'+[v.name,v.address,v.postcode].filter(Boolean).join(', '),'DESCRIPTION:Water only for 8 hours before. Bring photo ID. Reference '+(b.reference||b.order_number||''),'END:VEVENT','END:VCALENDAR'].join('\r\n'))}
function renderConfirmed(){
  const b=S.booking; const v=S.venue||S.venues.find(x=>String(x.id)===String(b.venue))||{name:b.venue_name||'Randox Health'};
  $('tvbApp').style.display='none'; const c=$('tvbDone'); c.style.display='';
  c.innerHTML=`<div class="tvb-kicker">You're booked</div><h2>${esc(fmtLong(b.start))}</h2><p class="tvb-lead">${esc(v.name)}${v.address?', '+esc(v.address):''}${v.postcode?', '+esc(v.postcode):''}</p>
    <div class="tvb-rows"><div><span>Reference</span><b>${esc(b.reference||b.order_number||'Pending')}</b></div><div><span>Randox order</span><b>${esc(b.order_number||'')}</b></div><div><span>Booked for</span><b>${esc(S.member.email)}</b></div></div>
    <div class="tvb-prep"><b>Before you go</b><ul><li>Water only for 8 hours before your appointment, unless we have told you otherwise. Morning slots make this easiest.</li><li>Bring photo ID. The clinic will check your name and date of birth.</li><li>Take your usual medication unless your GP has said otherwise, and tell the phlebotomist what you take.</li><li>Your results and report land in your dashboard within 12 working days of the appointment.</li></ul></div>
    <div class="tvb-actions"><a class="tvb-btn" download="truevitals-appointment.ics" href="${ics(b)}">Add to calendar</a><a class="tvb-btn ghost" href="/dashboard">Go to my dashboard</a></div>
    <p class="tvb-small">Need to change it? Reply to your confirmation email or write to info@truevitals.co.uk and we will move it for you.${b.mock?' <em>(Test mode: this booking is a preview and has not been sent to Randox.)</em>':''}</p>`;
  window.scrollTo({top:root.offsetTop-80,behavior:'smooth'});
}

boot();
})();
