/* TrueVitals Signature booking picker. 4 Nov 2026 (v1: book after payment), 5 Nov 2026 (v2: choose before payment).
   Book (thank-you page, after payment):
     TVSigBook.mount(el, { sessionId: 'cs_live_...', ref: client_reference_id, onBooked: fn, onUnavailable: fn })
     postcode -> nearest Randox clinics -> date -> time -> confirm. The Worker creates the lab order, holds the slot and
     confirms the booking in one call (/book). If a time was chosen before payment (ref "v-<venue>_a-<YYYYMMDDHHMM>",
     or the same choice saved in this browser), it opens on that clinic with that time selected: one tap to confirm.
     If that time has gone, it says so and shows the nearest times at the same clinic.
   Browse (Signature page, before payment, read-only, nothing is held or booked):
     TVSigBook.browse(el, { onPick: fn(choice), onClear: fn, onUnavailable: fn })
     TVSigBook.ref(choice) -> "v-140_a-202611050800" for the Stripe client_reference_id; TVSigBook.saved() -> last choice.
   Times from Randox are UTC; the Worker returns UK local times to show and we send the raw values back. */
(function () {
  'use strict';
  var API = 'https://truevitals-randox-booking.james-smillie-8c6.workers.dev';
  var KEY = 'tv_sig_pick';
  var CSS = '' +
    '.tvsb{font-family:"Inter Tight",sans-serif;text-align:left;color:#111827}' +
    '.tvsb *{box-sizing:border-box}' +
    '.tvsb-card{background:#fff;border:2px solid #2ce4ad;border-radius:12px;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,.06);margin-bottom:20px}' +
    '.tvsb.browse .tvsb-card{border:1px solid rgba(17,17,17,.08);background:#F5F8F8;box-shadow:none;border-radius:20px;padding:22px;margin:0}' +
    '.tvsb-label{display:inline-block;background:#2ce4ad22;color:#16a085;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:4px 10px;border-radius:100px;margin-bottom:10px}' +
    '.tvsb h3{font-size:20px;margin:0 0 6px;font-weight:700}' +
    '.tvsb p.tvsb-sub{margin:0 0 16px;color:#4b5563;font-size:15px;line-height:1.5}' +
    '.tvsb-row{display:flex;gap:8px}' +
    '.tvsb input{flex:1;min-width:0;padding:12px 14px;border:1px solid #d1d5db;border-radius:10px;font:inherit;font-size:16px;text-transform:uppercase;background:#fff}' +
    '.tvsb-btn{background:#2ce4ad;color:#04211a;border:0;border-radius:10px;padding:12px 16px;font:inherit;font-weight:700;font-size:15px;cursor:pointer}' +
    '.tvsb-btn[disabled]{opacity:.6;cursor:default}' +
    '.tvsb-btn.ghost{background:#fff;color:#111827;border:1px solid #d1d5db}' +
    '.tvsb-btn.full{width:100%;margin-top:14px;padding:15px}' +
    '.tvsb-list{margin-top:14px;display:flex;flex-direction:column;gap:8px}' +
    '.tvsb-venue{display:flex;justify-content:space-between;align-items:center;gap:10px;width:100%;text-align:left;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:12px 14px;cursor:pointer;font:inherit;color:#111827}' +
    '.tvsb-venue:hover,.tvsb-venue.on{border-color:#2ce4ad;background:#f0fdf9}' +
    '.tvsb-venue b{display:block;font-size:15px}.tvsb-venue small{display:block;color:#6b7280;font-size:13px;margin-top:2px}' +
    '.tvsb-dist{white-space:nowrap;font-size:13px;font-weight:700;color:#16a085}' +
    '.tvsb-days{display:flex;gap:8px;overflow-x:auto;padding:4px 0 8px;margin-top:12px;-webkit-overflow-scrolling:touch}' +
    '.tvsb-day{flex:0 0 auto;border:1px solid #d1d5db;background:#fff;border-radius:10px;padding:8px 12px;font:inherit;font-size:14px;cursor:pointer;text-align:center;line-height:1.3;color:#111827}' +
    '.tvsb-day.on{border-color:#2ce4ad;background:#2ce4ad;color:#04211a;font-weight:700}' +
    '.tvsb-times{display:grid;grid-template-columns:repeat(auto-fill,minmax(76px,1fr));gap:8px;margin-top:8px}' +
    '.tvsb-time{border:1px solid #d1d5db;background:#fff;border-radius:8px;padding:10px 0;font:inherit;font-size:15px;cursor:pointer;color:#111827}' +
    '.tvsb-time.on{border-color:#2ce4ad;background:#2ce4ad;color:#04211a;font-weight:700}' +
    '.tvsb-group{font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-top:14px}' +
    '.tvsb-sum{background:#f0fdf9;border:1px solid #a7f3d0;border-radius:10px;padding:14px;margin-top:16px;font-size:15px;line-height:1.5}' +
    '.tvsb-msg{margin-top:12px;font-size:14px;line-height:1.5;color:#92400e;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px 12px}' +
    '.tvsb-msg.ok{color:#065f46;background:#f0fdf9;border-color:#a7f3d0}' +
    '.tvsb-msg.err{color:#991b1b;background:#fef2f2;border-color:#fecaca}' +
    '.tvsb-link{background:none;border:0;color:#16a085;font:inherit;font-weight:700;cursor:pointer;padding:8px 0;font-size:14px}' +
    '.tvsb-muted{color:#6b7280;font-size:14px;margin-top:10px;line-height:1.5}' +
    '.tvsb-done h3{color:#065f46}' +
    '.tvsb-sticky{position:sticky;bottom:0;background:#fff;padding-bottom:4px;z-index:5}' +
    '.tvsb.browse .tvsb-sticky{position:static;background:none}' +
    '.tvsb-hide{display:none!important}';

  // Host pages may reset margins/padding on every element (the Signature page does: .tv-bk *{margin:0;padding:0}),
  // so every .tvsb-* rule is scoped under .tvsb to outrank a one-class reset.
  CSS = CSS.replace(/(^|[},])\.tvsb-/g, '$1.tvsb .tvsb-');
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function api(path, body) {
    var opt = body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {};
    return fetch(API + path, opt).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, status: r.status, body: j || {} }; }); });
  }
  function dayLabel(iso) { var d = new Date(iso + 'T12:00:00Z'); return { top: d.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' }), bottom: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }) }; }
  function longDay(iso) { return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }); }
  function miles(a, b) { var R = 3958.8, r = Math.PI / 180; var dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r; var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2); return 2 * R * Math.asin(Math.sqrt(h)); }
  function rx(name) { return (/^randox/i.test(String(name || '')) ? '' : 'Randox Health ') + String(name || ''); }
  function addDays(iso, n) { var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function todayUK() { try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date()); } catch (e) { return new Date().toISOString().slice(0, 10); } }
  function geocode(pc) {
    var clean = String(pc || '').replace(/\s+/g, '').toUpperCase();
    if (!/^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(clean)) return Promise.resolve(null);
    return fetch('https://api.postcodes.io/postcodes/' + encodeURIComponent(clean)).then(function (r) { return r.json(); }).then(function (j) { return j && j.result && j.result.latitude ? { lat: j.result.latitude, lng: j.result.longitude } : null; }).catch(function () { return null; });
  }

  // ---- a chosen time travels as "v-<venue id>_a-<YYYYMMDDHHMM UK local>" (Stripe allows letters, digits, - and _) ----
  function toRef(c) {
    if (!c || !/^\d+$/.test(String(c.venue)) || !/^\d{4}-\d{2}-\d{2}$/.test(c.local_date) || !/^\d{2}:\d{2}$/.test(c.local_time)) return '';
    return 'v-' + c.venue + '_a-' + c.local_date.replace(/-/g, '') + c.local_time.replace(':', '');
  }
  function fromRef(ref) {
    var v = /(?:^|_)v-(\d{1,6})(?:_|$)/.exec(String(ref || '')), a = /(?:^|_)a-(\d{12})(?:_|$)/.exec(String(ref || ''));
    if (!v || !a) return null;
    var s = a[1];
    return { venue: v[1], local_date: s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8), local_time: s.slice(8, 10) + ':' + s.slice(10, 12) };
  }
  function save(c) { try { if (c) localStorage.setItem(KEY, JSON.stringify(c)); else localStorage.removeItem(KEY); } catch (e) {} }
  function saved() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!c || !c.saved_at || Date.now() - c.saved_at > 3 * 86400000 || c.local_date < todayUK()) return null;
      return c;
    } catch (e) { return null; }
  }

  function build(el, opts, mode) {
    opts = opts || {};
    var browse = mode === 'browse';
    var sid = opts.sessionId;
    var done = false;
    function unavailable(reason) { if (done) return; done = true; el.innerHTML = ''; if (opts.onUnavailable) opts.onUnavailable(reason); }
    if (!el) return;
    if (!browse && !/^cs_(live|test)_[A-Za-z0-9]+$/.test(String(sid || ''))) return unavailable('no session');
    if (!document.getElementById('tvsb-css')) { var st = document.createElement('style'); st.id = 'tvsb-css'; st.textContent = CSS; document.head.appendChild(st); }

    var prefer = browse ? null : (fromRef(opts.ref) || saved());
    var S = { venues: [], venue: null, slots: [], from: null, day: null, slot: null, origin: null, showAll: false };
    var head = browse
      ? '<span class="tvsb-label">Optional</span><h3>Choose your clinic and time now</h3>' +
        '<p class="tvsb-sub">These are live appointments at Randox Health clinics. Pick one, pay, add the patient\'s details, and confirm it in one tap. Nothing is held until you confirm.</p>'
      : '<span class="tvsb-label">Book your appointment</span><h3>Choose your Randox clinic and time</h3>' +
        '<p class="tvsb-sub">Pick the clinic and appointment that suit you and it is booked straight away. It takes about 20 minutes on the day.</p>';
    el.innerHTML = '<div class="tvsb' + (browse ? ' browse' : '') + '"><div class="tvsb-card" id="tvsbCard">' + head +
      '<div id="tvsbS1"><div class="tvsb-row"><input id="tvsbPc" placeholder="Your postcode" autocomplete="postal-code" maxlength="8"><button class="tvsb-btn" id="tvsbFind">Find clinics</button></div>' +
      '<div class="tvsb-list" id="tvsbVenues"></div><button class="tvsb-link tvsb-hide" id="tvsbAll">Show all clinics</button></div>' +
      '<div id="tvsbS2" class="tvsb-hide"><button class="tvsb-link" id="tvsbBack1">&larr; Change clinic</button><div id="tvsbVenueHead"></div>' +
      '<div class="tvsb-days" id="tvsbDays"></div><div id="tvsbTimes"></div><button class="tvsb-link tvsb-hide" id="tvsbLater">Show later dates &rarr;</button>' +
      '<div class="tvsb-sticky"><div id="tvsbSum" class="tvsb-sum tvsb-hide"></div><button class="tvsb-btn full tvsb-hide" id="tvsbBook">' + (browse ? 'Choose this time' : 'Confirm appointment') + '</button></div></div>' +
      '<div id="tvsbS3" class="tvsb-hide"></div>' +
      '<div id="tvsbMsg" class="tvsb-msg tvsb-hide"></div>' +
      '</div></div>';
    var root = el.querySelector('.tvsb');
    var $ = function (id) { return root.querySelector('#' + id); };
    var BOOK_LABEL = browse ? 'Choose this time' : 'Confirm appointment';
    function msg(text, kind) { var m = $('tvsbMsg'); m.textContent = text; m.className = 'tvsb-msg' + (kind ? ' ' + kind : ''); }
    function clearMsg() { $('tvsbMsg').className = 'tvsb-msg tvsb-hide'; }

    function showDone(b) {
      done = true; save(null);
      $('tvsbCard').innerHTML = '<div class="tvsb-done"><span class="tvsb-label">Booked</span><h3>Your appointment is booked</h3>' +
        '<p class="tvsb-sub"><strong>' + esc(longDay(b.date)) + ' at ' + esc(b.time) + '</strong><br>' + esc(rx(b.venue_name)) + (b.venue_address ? '<br>' + esc(b.venue_address) : '') + '</p>' +
        '<p class="tvsb-muted">We have emailed you the details. Fast from 10pm the night before (water is fine), bring photo ID, and allow around 20 minutes. Need to change it? Reply to the confirmation email and we will move it for you.</p></div>';
      if (opts.onBooked) opts.onBooked(b);
    }

    function renderVenues() {
      var list = S.origin ? S.venues.slice().sort(function (a, b) { return a.dist - b.dist; }) : S.venues.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
      var shown = S.showAll ? list : list.slice(0, S.origin ? 5 : 8);
      $('tvsbVenues').innerHTML = shown.map(function (v) {
        return '<button type="button" class="tvsb-venue" data-id="' + esc(v.id) + '"><span><b>' + esc(v.name) + '</b><small>' + esc(v.address) + '</small></span>' + (S.origin && v.dist != null ? '<span class="tvsb-dist">' + (v.dist < 10 ? v.dist.toFixed(1) : Math.round(v.dist)) + ' mi</span>' : '') + '</button>';
      }).join('');
      $('tvsbAll').classList.toggle('tvsb-hide', S.showAll || list.length <= shown.length);
      Array.prototype.forEach.call($('tvsbVenues').querySelectorAll('.tvsb-venue'), function (b) {
        b.addEventListener('click', function () { var v = venueById(b.getAttribute('data-id')); if (v) pickVenue(v, null); });
      });
    }
    function venueById(id) { return S.venues.filter(function (x) { return String(x.id) === String(id); })[0]; }

    function find() {
      clearMsg();
      var pc = $('tvsbPc').value.trim();
      $('tvsbFind').disabled = true;
      return geocode(pc).then(function (o) {
        $('tvsbFind').disabled = false;
        if (!o && pc) msg('We could not find that postcode, so the clinics are listed A to Z.');
        S.origin = o;
        S.venues.forEach(function (v) { v.dist = o && v.lat != null && v.lng != null ? miles(o, v) : null; });
        S.showAll = false; renderVenues();
      });
    }

    function pickVenue(v, want) {
      S.venue = v; S.slot = null; S.day = null; S.slots = []; S.from = null;
      $('tvsbS1').classList.add('tvsb-hide'); $('tvsbS3').classList.add('tvsb-hide'); $('tvsbS2').classList.remove('tvsb-hide');
      $('tvsbVenueHead').innerHTML = '<div class="tvsb-venue on" style="cursor:default"><span><b>' + esc(rx(v.name)) + '</b><small>' + esc(v.address) + '</small></span></div>';
      // A wanted time within the first week loads from today, so earlier days stay visible; later ones load from that day.
      var from = want && want.local_date > addDays(todayUK(), 5) ? want.local_date : null;
      loadSlots(from, want);
    }

    function loadSlots(from, want) {
      clearMsg(); hideSum();
      $('tvsbDays').innerHTML = ''; $('tvsbTimes').innerHTML = '<p class="tvsb-muted">Loading available times&hellip;</p>'; $('tvsbLater').classList.add('tvsb-hide');
      var q = '/availability?venue=' + encodeURIComponent(S.venue.id) + (from ? '&from=' + from : '');
      return api(q).then(function (r) {
        if (!r.ok || !Array.isArray(r.body.slots)) { $('tvsbTimes').innerHTML = ''; msg('We could not load times for this clinic just now. Please try again, or choose another clinic.', 'err'); return; }
        S.slots = r.body.slots; S.from = r.body.from;
        var days = []; S.slots.forEach(function (s) { if (days.indexOf(s.local_date) < 0) days.push(s.local_date); });
        if (!days.length) {
          $('tvsbTimes').innerHTML = '<p class="tvsb-muted">No appointments are free at this clinic ' + (from ? 'that week' : 'this week') + '.</p>';
          $('tvsbLater').classList.remove('tvsb-hide'); S.lastDay = addDays(S.from || todayUK(), 6);
          if (want) msg(want.retry ? 'Sorry, that time has just been taken. Please choose another time or clinic.' : 'Sorry, the time you chose (' + longDay(want.local_date) + ' at ' + want.local_time + ') has been taken since. Please choose another time or clinic.', 'err');
          return;
        }
        S.lastDay = days[days.length - 1];
        $('tvsbDays').innerHTML = days.map(function (d) { var l = dayLabel(d); return '<button type="button" class="tvsb-day" data-d="' + d + '">' + l.top + '<br>' + l.bottom + '</button>'; }).join('');
        Array.prototype.forEach.call($('tvsbDays').querySelectorAll('.tvsb-day'), function (b) { b.addEventListener('click', function () { pickDay(b.getAttribute('data-d')); }); });
        $('tvsbLater').classList.remove('tvsb-hide');
        if (!want) return pickDay(days[0]);
        var hit = S.slots.filter(function (s) { return s.local_date === want.local_date && s.local_time === want.local_time; })[0];
        if (hit) {
          pickDay(hit.local_date); selectSlot(hit);
          if (want.retry) msg('That time could not be booked just now. Please try again, or choose another time.', 'err');
          else msg(browse ? 'Your chosen time is still free.' : 'This is the time you chose before paying, and it is still free. Tap Confirm appointment to book it.', 'ok');
          return;
        }
        // Gone: show the same day if it still has times, otherwise the next day that does.
        var day = days.filter(function (d) { return d >= want.local_date; })[0] || days[days.length - 1];
        pickDay(day);
        msg(want.retry ? 'Sorry, that time has just been taken. These are the nearest times at the same clinic.' : 'Sorry, ' + longDay(want.local_date) + ' at ' + want.local_time + ' has been taken since you chose it. These are the nearest times at the same clinic.', 'err');
      }).catch(function () { $('tvsbTimes').innerHTML = ''; msg('Connection problem. Please try again in a moment.', 'err'); });
    }

    function hideSum() { $('tvsbSum').classList.add('tvsb-hide'); $('tvsbBook').classList.add('tvsb-hide'); }

    function pickDay(d) {
      S.day = d; S.slot = null; hideSum();
      Array.prototype.forEach.call($('tvsbDays').querySelectorAll('.tvsb-day'), function (b) { b.classList.toggle('on', b.getAttribute('data-d') === d); });
      var day = S.slots.filter(function (s) { return s.local_date === d; });
      var groups = [['Morning', function (t) { return t < '12:00'; }], ['Afternoon', function (t) { return t >= '12:00' && t < '17:00'; }], ['Evening', function (t) { return t >= '17:00'; }]];
      var html = '';
      groups.forEach(function (g) {
        var ts = day.filter(function (s) { return g[1](s.local_time); });
        if (!ts.length) return;
        html += '<div class="tvsb-group">' + g[0] + '</div><div class="tvsb-times">' + ts.map(function (s) { return '<button type="button" class="tvsb-time" data-k="' + esc(s.slotId) + '|' + esc(s.date) + '|' + esc(s.time) + '">' + esc(s.local_time) + '</button>'; }).join('') + '</div>';
      });
      $('tvsbTimes').innerHTML = html;
      Array.prototype.forEach.call($('tvsbTimes').querySelectorAll('.tvsb-time'), function (b) {
        b.addEventListener('click', function () {
          var k = b.getAttribute('data-k').split('|');
          var s = day.filter(function (x) { return String(x.slotId) === k[0] && x.date === k[1] && x.time === k[2]; })[0];
          if (s) { clearMsg(); selectSlot(s); }
        });
      });
    }

    function selectSlot(s) {
      S.slot = s;
      Array.prototype.forEach.call($('tvsbTimes').querySelectorAll('.tvsb-time'), function (x) { x.classList.toggle('on', x.getAttribute('data-k') === s.slotId + '|' + s.date + '|' + s.time); });
      $('tvsbSum').innerHTML = '<strong>' + esc(longDay(s.local_date)) + ' at ' + esc(s.local_time) + '</strong><br>' + esc(rx(S.venue.name)) + '<br><span style="color:#6b7280">' + esc(S.venue.address) + '</span>';
      $('tvsbSum').classList.remove('tvsb-hide'); $('tvsbBook').classList.remove('tvsb-hide');
    }

    // ---- browse mode: remember the choice (nothing is held) ----
    function choose() {
      if (!S.slot || !S.venue) return;
      var c = { venue: String(S.venue.id), venue_name: S.venue.name, venue_address: S.venue.address, local_date: S.slot.local_date, local_time: S.slot.local_time, saved_at: Date.now() };
      save(c); showChosen(c);
      if (opts.onPick) opts.onPick(c);
    }
    function showChosen(c) {
      $('tvsbS1').classList.add('tvsb-hide'); $('tvsbS2').classList.add('tvsb-hide'); clearMsg();
      var s3 = $('tvsbS3'); s3.classList.remove('tvsb-hide');
      s3.innerHTML = '<div class="tvsb-sum"><strong>' + esc(longDay(c.local_date)) + ' at ' + esc(c.local_time) + '</strong><br>' + esc(rx(c.venue_name)) + '<br><span style="color:#6b7280">' + esc(c.venue_address) + '</span></div>' +
        '<p class="tvsb-muted">Pay below, add the details of the person being tested, and this time will be waiting for you to confirm in one tap. It is not held until then; if someone takes it first, we will show you the nearest times at the same clinic.</p>' +
        '<button type="button" class="tvsb-link" id="tvsbChange">Change time or clinic</button> &nbsp; <button type="button" class="tvsb-link" id="tvsbClear" style="color:#6b7280">Remove</button>';
      $('tvsbChange').addEventListener('click', function () { var v = venueById(c.venue); if (v) pickVenue(v, c); else backToList(); });
      $('tvsbClear').addEventListener('click', function () { save(null); backToList(); if (opts.onClear) opts.onClear(); });
    }
    function backToList() { $('tvsbS2').classList.add('tvsb-hide'); $('tvsbS3').classList.add('tvsb-hide'); $('tvsbS1').classList.remove('tvsb-hide'); clearMsg(); if (!$('tvsbVenues').innerHTML) renderVenues(); }

    // ---- book mode ----
    function book() {
      if (!S.slot || !S.venue) return;
      var btn = $('tvsbBook'); btn.disabled = true; btn.textContent = 'Booking…'; clearMsg();
      api('/book', { session_id: sid, venue: S.venue.id, venue_name: S.venue.name, venue_address: S.venue.address, slotId: S.slot.slotId, date: S.slot.date, time: S.slot.time }).then(function (r) {
        btn.disabled = false; btn.textContent = BOOK_LABEL;
        if (r.ok && r.body.ok && r.body.booking) { var b = r.body.booking; showDone({ date: b.local_date || S.slot.local_date, time: b.local_time || S.slot.local_time, venue_name: b.venue_name, venue_address: b.venue_address }); return; }
        var e = r.body.error || '';
        if (e === 'already booked') { return checkExisting(true); }
        if (e === 'slot_taken' || e === 'booking_failed') { var gone = S.slot; return loadSlots(S.from && S.from !== todayUK() ? S.from : null, { local_date: gone.local_date, local_time: gone.local_time, retry: true }); }
        if (e === 'booking_in_progress') { msg('We are finishing a booking for this order. One moment…'); return setTimeout(function () { checkExisting(true); }, 4000); }
        if (e === 'lab_order_failed') { msg('We could not complete the booking online. Our team has been alerted and will book this time for you, or the nearest one to it, and email you within one working hour.', 'err'); btn.classList.add('tvsb-hide'); return; }
        msg('Something went wrong. Please try again, or email support@truevitals.co.uk and we will book it for you.', 'err');
      }).catch(function () { btn.disabled = false; btn.textContent = BOOK_LABEL; msg('Connection problem. Please try again in a moment.', 'err'); });
    }

    function checkExisting(fromBook) {
      return api('/booking?session_id=' + encodeURIComponent(sid)).then(function (r) {
        if (r.ok && r.body.booking) { showDone(r.body.booking); return true; }
        if (fromBook) msg('Please choose your time again.', 'err');
        return false;
      });
    }

    $('tvsbFind').addEventListener('click', find);
    $('tvsbPc').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); find(); } });
    $('tvsbAll').addEventListener('click', function () { S.showAll = true; renderVenues(); });
    $('tvsbBack1').addEventListener('click', backToList);
    $('tvsbLater').addEventListener('click', function () { loadSlots(addDays(S.lastDay, 1), null); });
    $('tvsbBook').addEventListener('click', browse ? choose : book);

    function start(postcode) {
      return api('/venues').then(function (v) {
        if (!v.ok || !v.body.enabled || !Array.isArray(v.body.venues) || !v.body.venues.length) return unavailable('no venues');
        S.venues = v.body.venues;
        if (prefer && prefer.local_date < todayUK()) prefer = null; // a choice from an earlier day is no use now
        var pv = prefer && venueById(prefer.venue);
        if (postcode) { $('tvsbPc').value = postcode; find(); } else renderVenues();
        if (pv) pickVenue(pv, prefer);
        else if (browse) { var c = saved(); if (c && venueById(c.venue)) { showChosen(c); if (opts.onPick) opts.onPick(c); } }
      });
    }

    if (browse) { start(opts.postcode || '').catch(function () { unavailable('error'); }); return; }
    // Start: is this a Signature order with details done and booking switched on? Already booked?
    api('/booking?session_id=' + encodeURIComponent(sid)).then(function (r) {
      if (!r.ok || !r.body.found) return unavailable('order not found');
      if (r.body.booking) return showDone(r.body.booking);
      if (r.body.panel_type !== 'randox' || !r.body.booking_enabled || !r.body.details_complete) return unavailable('not available');
      var p = r.body.preferred;
      if (!fromRef(opts.ref) && p && /^\d+$/.test(String(p.venue)) && /^\d{4}-\d{2}-\d{2}$/.test(p.local_date) && /^\d{2}:\d{2}$/.test(p.local_time)) prefer = p;
      return start(r.body.patient_postcode);
    }).catch(function () { unavailable('error'); });
  }

  window.TVSigBook = {
    mount: function (el, opts) { return build(el, opts, 'book'); },
    browse: function (el, opts) { return build(el, opts, 'browse'); },
    ref: toRef, parseRef: fromRef, saved: saved
  };
})();
