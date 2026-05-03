/* ── STATE ── */
const S={role:'',sub:'Sunset Village Phase 2',hoa:'Sunset Village HOA',adminName:'',splashBg:'',logoSrc:'',assignTarget:null,declineTarget:null,contactReqTarget:null,currentForm:'',calMode:''};

/* ── MINI SLIDER ── */
let miniIdx=0;
function miniGoTo(i){
  miniIdx=Math.max(0,Math.min(3,i));
  document.getElementById('mini-track').style.transform='translateX(-'+miniIdx*100+'vw)';
  for(let j=0;j<4;j++){const d=document.getElementById('mdot-'+j);if(d)d.classList.toggle('on',j===miniIdx);}
}
let _mt=setInterval(()=>{if(miniIdx<3)miniGoTo(miniIdx+1);else clearInterval(_mt);},3500);
(function(){
  const t=document.getElementById('mini-track');if(!t)return;
  let sx=0;
  t.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;},{passive:true});
  t.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40){clearInterval(_mt);miniGoTo(miniIdx+(dx<0?1:-1));}},{passive:true});
})();

/* ── GREETING ── */
function getGreeting(){const h=new Date().getHours();return h<12?'Good morning':h<18?'Good afternoon':'Good evening';}

/* ── SCREEN NAV ── */
function showScr(id){document.querySelectorAll('.scr').forEach(s=>s.classList.remove('on'));document.getElementById(id).classList.add('on');window.scrollTo(0,0);}

/* ── AUTH ── */
function authTab(t){
  document.getElementById('tab-adm').classList.toggle('on',t==='adm');
  document.getElementById('tab-acc').classList.toggle('on',t==='acc');
  document.getElementById('panel-adm').style.display=t==='adm'?'':'none';
  document.getElementById('panel-acc').style.display=t==='acc'?'':'none';
}
function adminLogin(){
  const e=document.getElementById('adm-email').value;const p=document.getElementById('adm-pass').value;
  if(!e||!p){toast('⚠️','Missing Fields','Enter your email and password.');return;}
  S.role='admin';S.adminName=e.split('@')[0];setSplash('admin',S.adminName,'','Admin');showScr('scr-splash');
}
function createAdmin(){
  const sub=document.getElementById('su-sub').value;const nm=document.getElementById('su-name').value;
  const em=document.getElementById('su-email').value;const p=document.getElementById('su-pass').value;const p2=document.getElementById('su-pass2').value;
  if(!sub||!nm||!em||!p){toast('⚠️','Incomplete','Fill in all required fields.');return;}
  if(p!==p2){toast('⚠️','Mismatch','Passwords do not match.');return;}
  S.sub=sub;S.hoa=document.getElementById('su-hoa').value||sub+' HOA';S.adminName=nm;S.role='admin';
  setSplash('admin',nm,'','Admin');applySubLabels();showScr('scr-splash');
}
function loginRole(role){
  S.role=role;
  const maps={resident:{name:'Jose Reyes',roleLabel:'Resident',addr:'Unit 12B · Block 7 · Phase 2'},leader:{name:'Roberto Cruz',roleLabel:'Block Leader',addr:'Blocks 7 & 8 · Phase 2'},guard:{name:'Guard Station 1',roleLabel:'Guardhouse',addr:'Main Gate'},toda:{name:'Mang Ben',roleLabel:'Tricycle Admin',addr:'TODA-2024-0001 · TRC-001'}};
  const m=maps[role]||{name:'User',roleLabel:'Member',addr:''};
  setSplash(role,m.name,m.addr,m.roleLabel);applySubLabels();showScr('scr-splash');
}
function loginCode(){const c=document.getElementById('acc-code').value.replace(/-/g,'');if(!c||c.length<4){toast('⚠️','Invalid Code','Enter your 8-character access code.');return;}loginRole('resident');}
function fmtCode(el){let v=el.value.replace(/[^A-Z0-9a-z]/gi,'').toUpperCase().substring(0,8);if(v.length>4)v=v.substring(0,4)+'-'+v.substring(4);el.value=v;}

/* ── SPLASH ── */
function setSplash(role,name,addr,roleLabel){
  document.getElementById('splash-hello').textContent=getGreeting();
  document.getElementById('splash-name').textContent=name;
  document.getElementById('splash-sub').textContent=S.sub;
  document.getElementById('splash-role').textContent=roleLabel+' · '+(addr||S.sub);
  if(S.logoSrc){const b=document.getElementById('splash-logo-badge');b.innerHTML=`<img src="${S.logoSrc}" alt="logo">`;} 
  if(S.splashBg){document.getElementById('splash-bg-img').src=S.splashBg;document.getElementById('splash-bg-img').style.display='block';document.getElementById('splash-bg').style.background='transparent';}
  else{document.getElementById('splash-bg').style.background='var(--p1)';document.getElementById('splash-bg-img').style.display='none';}
}
function getCSSVar(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim();}

/* ── ENTER DASHBOARD ── */
function enterDashboard(){
  applySubLabels();
  const map={admin:'scr-admin',resident:'scr-resident',leader:'scr-resident',guard:'scr-guard',toda:'scr-toda'};
  if(S.role==='leader'){
    document.getElementById('leader-dash-panel').style.display='block';
    document.getElementById('r-role-badge').textContent='LEADER';
    document.getElementById('r-role-badge').style.cssText='background:rgba(124,58,237,.25);color:#c4b5fd';
    document.getElementById('r-other-leaders').style.display='block';
    document.getElementById('r-av').style.background='var(--purple)';
    document.getElementById('r-av').textContent='RC';
    document.getElementById('r-title-lbl').textContent=getGreeting()+', Roberto';
    addLeaderTabs();
  } else if(S.role==='resident'){
    document.getElementById('leader-dash-panel').style.display='none';
    document.getElementById('r-role-badge').textContent='RESIDENT';
    document.getElementById('r-role-badge').style.cssText='';
    document.getElementById('r-other-leaders').style.display='none';
    document.getElementById('r-av').style.background='var(--acc)';
    document.getElementById('r-av').textContent='JR';
    document.getElementById('r-title-lbl').textContent=getGreeting()+', Jose';
    S.name='Jose';
    removeLeaderTabs();
    const smBtn=document.getElementById('r-simple-btn');if(smBtn)smBtn.style.display='';
  }
  if(S.role==='admin'){
    document.getElementById('a-sub-lbl').textContent=S.sub;
    const bd=document.getElementById('a-dash-banner-title');if(bd)bd.textContent=S.sub;
    const ini=S.adminName.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
    document.getElementById('a-av').textContent=ini||'AD';
    document.getElementById('a-title-lbl').textContent='Admin Dashboard';
    buildCalendar('admin-calendar','admin');buildCalendarEvents();
  }
  applyRoleVisibility();
  if(S.logoSrc){
    const slots=['a-hoa-logo-badge','r-hoa-logo'];
    slots.forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML=`<img src="${S.logoSrc}" alt="logo" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">`;});
  }
  if(S.role==='resident'&&isSimpleMode()){
    enterDashboardSimple();
  } else {
    showScr(map[S.role]||'scr-resident');
  }
}
function applySubLabels(){
  ['a-sub-lbl','r-sub-lbl','g-sub-lbl','t-sub-lbl'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=S.sub;});
  const rb=document.getElementById('r-banner-title');if(rb)rb.textContent=S.sub;
  const db=document.getElementById('a-dash-banner-title');if(db)db.textContent=S.sub;
  const mh=document.getElementById('trike-month-hdr');if(mh)mh.textContent=new Date().toLocaleString('en-PH',{month:'long'})+' · Bookings';
}

/* ── LEADER TABS ── */
function addLeaderTabs(){
  const nav=document.getElementById('r-botnav');if(document.getElementById('rbn-post'))return;
  [{id:'rbn-post',ic:'📢',lbl:'Post',fn:"rNav('post')"},{id:'rbn-myblock',ic:'🏘️',lbl:'My Block',fn:"rNav('myblock')"}].forEach(t=>{
    const d=document.createElement('div');d.className='bni';d.id=t.id;d.onclick=new Function(t.fn);
    d.innerHTML=`<div class="bni-ic">${t.ic}</div><div class="bni-lbl">${t.lbl}</div>`;nav.appendChild(d);
  });
  // Replace feedback with forms for leader
}
function removeLeaderTabs(){['rbn-post','rbn-myblock'].forEach(id=>{const el=document.getElementById(id);if(el)el.remove();});}

/* ── RESIDENT NAV ── */
function rNav(p){
  document.querySelectorAll('#scr-resident .pg').forEach(x=>x.classList.remove('on'));
  document.getElementById('rp-'+p)?.classList.add('on');
  document.querySelectorAll('#r-botnav .bni').forEach(x=>x.classList.remove('on'));
  document.getElementById('rbn-'+p)?.classList.add('on');
  if(p==='calendar'){showCalView(null);}
}
function rOpenDetail(id,from){
  const cur=document.querySelector('#scr-resident .pg.on');
  S.prevPage=from||(cur?cur.id.replace('rp-','').replace('rd-',''):'home');
  document.querySelectorAll('#scr-resident .pg').forEach(x=>x.classList.remove('on'));
  document.getElementById(id)?.classList.add('on');
}
function rCloseDetail(){
  const back=S.prevPage||'home';S.prevPage=null;rNav(back);
}

/* ── ADMIN NAV ── */
function aNav(p){
  document.querySelectorAll('#scr-admin .pg').forEach(x=>x.classList.remove('on'));
  document.getElementById('ap-'+p)?.classList.add('on');
  document.querySelectorAll('#scr-admin .bni').forEach(x=>x.classList.remove('on'));
  document.getElementById('abn-'+p)?.classList.add('on');
}

/* ── UPDATES VIEW TOGGLE ── */
function updView(v){
  document.getElementById('upd-view-date').classList.toggle('on',v==='date');
  document.getElementById('upd-view-cat').classList.toggle('on',v==='cat');
  document.getElementById('upd-view-block').classList.toggle('on',v==='block');
  document.getElementById('upd-date-panel').style.display=v==='date'?'':'none';
  document.getElementById('upd-cat-panel').style.display=v==='cat'?'':'none';
  document.getElementById('upd-block-panel').style.display=v==='block'?'':'none';
}
function openCatDrillIn(cat){
  const catData={
    urgent:{title:'⚠️ Urgent Notices',items:[{color:'var(--red)',ic:'⚠️',t:'Water interruption tonight 10PM–2AM',p:'Blocks 5–9 affected.',tm:'Today 8:00 AM',tag:'Urgent',tgClass:'tg-red'}]},
    events:{title:'📅 Events & Meetings',items:[{color:'var(--acc)',ic:'📅',t:'General Assembly — April 25',p:'Main Clubhouse, 5:30 PM.',tm:'Apr 17',tag:'Event',tgClass:'tg-teal'},{color:'var(--purple)',ic:'🎉',t:'Fiesta sa Subdivision — May 5',p:'Annual block party.',tm:'Apr 16',tag:'Event',tgClass:'tg-purple'}]},
    utilities:{title:'💧 Utilities & Garbage',items:[{color:'var(--amber)',ic:'🗑️',t:'Bulk Garbage Pickup — Saturday 6AM',p:'Place bins outside before 6AM.',tm:'Apr 16',tag:'Schedule',tgClass:'tg-amber'},{color:'var(--amber)',ic:'💧',t:'Water Refill Station — Block 8',p:'Available Mon–Fri 8AM–5PM.',tm:'Apr 14',tag:'Info',tgClass:'tg-amber'}]},
    reminders:{title:'💵 Dues & Reminders',items:[{color:'var(--p1)',ic:'💵',t:'Monthly Dues Reminder',p:'Pay at HOA office 1st–5th.',tm:'Apr 15',tag:'Reminder',tgClass:'tg-navy'}]}
  };
  const d=catData[cat];if(!d)return;
  const pg=document.getElementById('rp-updates');
  const tmp=document.createElement('div');tmp.id='cat-drill-view';tmp.innerHTML=`<div class="subhdr"><div class="back-btn" onclick="closeCatDrillIn()">←</div><div><div class="subhdr-title">${d.title}</div></div></div>`+d.items.map(it=>`<div class="uc" style="margin-top:${d.items.indexOf(it)===0?'8':'0'}px;border-left-color:${it.color}"><div class="uc-ic" style="background:${it.color}22">${it.ic}</div><div class="uc-b"><div class="uc-t">${it.t}</div><div class="uc-p">${it.p}</div><div class="uc-f"><span class="uc-tm">${it.tm}</span><span class="tag ${it.tgClass}">${it.tag}</span></div></div></div>`).join('');
  pg.querySelector('#upd-date-panel').style.display='none';
  pg.querySelector('#upd-cat-panel').style.display='none';
  pg.querySelector('.view-toggle').style.display='none';
  pg.querySelector('.subhdr').style.display='none';
  pg.appendChild(tmp);
}
function closeCatDrillIn(){
  const pg=document.getElementById('rp-updates');
  const drill=document.getElementById('cat-drill-view');if(drill)drill.remove();
  pg.querySelector('#upd-cat-panel').style.display='';
  pg.querySelector('.view-toggle').style.display='';
  pg.querySelector('.subhdr').style.display='';
  updView('cat');
}

/* ── CALENDAR (resident, category-first) ── */
function showCalView(view){
  document.getElementById('cal-main-view').style.display=view?'none':'block';
  document.getElementById('cal-avail-view').style.display=view==='availability'?'block':'none';
  document.getElementById('cal-detail-view').style.display=(view&&view!=='availability')?'block':'none';
  S.calMode=view;
  if(view==='announcements'){
    document.getElementById('cal-detail-title').textContent='📢 Announcements & Events';
    document.getElementById('cal-detail-sub').textContent='HOA events and notices';
    document.getElementById('cal-detail-back-btn').onclick=()=>showCalView(null);
    buildCalendar('resident-calendar','events');
    document.getElementById('cal-event-list').innerHTML=`<div class="bk-item"><div class="bk-date">APRIL 18 · TODAY</div><div class="bk-title">⚠️ Water interruption tonight 10PM–2AM</div><div class="bk-status"><span class="tag tg-red">Urgent</span></div></div><div class="bk-item"><div class="bk-date">APRIL 25</div><div class="bk-title">📅 General Assembly Meeting</div><div class="bk-status"><span class="tag tg-teal">Event</span></div></div><div class="bk-item"><div class="bk-date">MAY 5</div><div class="bk-title">🎉 Fiesta sa Subdivision</div><div class="bk-status"><span class="tag tg-purple">Event</span></div></div>`;
  } else if(view==='repairs'){
    document.getElementById('cal-detail-title').textContent='🔧 HOA Repairs & Maintenance';
    document.getElementById('cal-detail-sub').textContent='Scheduled works in the subdivision';
    document.getElementById('cal-detail-back-btn').onclick=()=>showCalView(null);
    buildCalendar('resident-calendar','repairs');
    document.getElementById('cal-event-list').innerHTML=`<div class="bk-item" style="border-left-color:var(--amber)"><div class="bk-date">APRIL 20–21</div><div class="bk-title">🔧 Road Resealing — Block 3 Alley</div><div class="bk-status"><span class="tag tg-amber">Scheduled</span></div></div><div class="bk-item" style="border-left-color:var(--amber)"><div class="bk-date">APRIL 25</div><div class="bk-title">💡 Streetlight Replacement — Gate B</div><div class="bk-status"><span class="tag tg-amber">Scheduled</span></div></div>`;
  } else if(view==='bookings'){
    document.getElementById('cal-detail-title').textContent='🗂️ My Bookings';
    document.getElementById('cal-detail-sub').textContent='Your reservations and requests';
    document.getElementById('cal-detail-back-btn').onclick=()=>showCalView(null);
    buildCalendar('resident-calendar','bookings');
    document.getElementById('cal-event-list').innerHTML=`<div class="bk-item" style="border-left-color:var(--purple)"><div class="bk-date">APRIL 19 · SATURDAY</div><div class="bk-title">🛺 Tricycle Booking — 9:00 AM</div><div class="bk-status"><span class="tag tg-amber">Pending Approval</span></div></div>`;
  }
}
function openAvailCalendar(facility){
  const info={pool:{title:'🏊 Pool Availability',sub:'Numbers = remaining slots today'},hall:{title:'🏟️ Function Hall',sub:'Green = available for full-day booking'},parking:{title:'🅿️ Visitor Parking',sub:'Numbers = available spaces'},trike:{title:'🛺 Tricycle Slots',sub:'Available ride times this week'}};
  const i=info[facility]||info.pool;
  document.getElementById('cal-avail-view').style.display='none';
  document.getElementById('cal-detail-view').style.display='block';
  document.getElementById('cal-detail-title').textContent=i.title;
  document.getElementById('cal-detail-sub').textContent=i.sub;
  document.getElementById('cal-detail-back-btn').onclick=()=>{document.getElementById('cal-detail-view').style.display='none';document.getElementById('cal-avail-view').style.display='block';};
  buildCalendar('resident-calendar','avail');
  document.getElementById('cal-event-list').innerHTML=`<div style="background:var(--card);border-radius:9px;padding:11px 13px;margin-bottom:8px;box-shadow:var(--sh)"><span class="tag tg-green" style="margin-bottom:5px;display:inline-flex">✅ Slots Available</span><div style="font-family:var(--font);font-weight:700;font-size:13px;color:var(--text);letter-spacing:0.02em">Today: 3 slots remaining</div><div style="font-size:12px;color:var(--muted);margin-top:2px">Tap on a green date to see details and book</div></div>`;
}

/* ── CALENDAR BUILD ── */
let calYear=2026,calMonth=3;
const CAL_EVENTS={events:[18,25],repairs:[20,21,25],bookings:[19],avail:[],admin:[18,19,20,25,26]};
function buildCalendar(cid,mode){
  const el=document.getElementById(cid);if(!el)return;
  const fd=new Date(calYear,calMonth,1).getDay();
  const dim=new Date(calYear,calMonth+1,0).getDate();
  const today=new Date();const todayStr=today.toISOString().slice(0,10);
  const evDays=new Set(CAL_EVENTS[mode]||[]);
  const mn=new Date(calYear,calMonth,1).toLocaleString('en-PH',{month:'long',year:'numeric'});
  let h=`<div class="cal-wrap"><div class="cal-nav"><div class="cal-nav-btn" onclick="calNav(-1,'${cid}','${mode}')">‹</div><div class="cal-month">${mn}</div><div class="cal-nav-btn" onclick="calNav(1,'${cid}','${mode}')">›</div></div><div class="cal-grid">`;
  ['S','M','T','W','T','F','S'].forEach(d=>h+=`<div class="cal-dow">${d}</div>`);
  for(let i=0;i<fd;i++)h+=`<div class="cal-day empty"></div>`;
  // Pool availability slots data
  const slots={18:3,19:0,20:2,21:4,22:4,25:1,26:0};
  for(let d=1;d<=dim;d++){
    const ds=`${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isTd=ds===todayStr;const hasEv=evDays.has(d);
    const isAvailMode=mode==='avail';
    const sl=slots[d]||5;const isFull=isAvailMode&&sl===0;
    if(isAvailMode){
      const availCls=isFull?'full':sl>=4?'avail-high':sl>=2?'avail-med':'avail-low';
      h+=`<div class="cal-day${isTd?' today':''} ${availCls}" onclick="calDayClick(${d},'${mode}')"><div class="cal-day-num">${d}</div><div class="cal-day-slots">${isFull?'Full':sl+' left'}</div></div>`;
    } else {
      h+=`<div class="cal-day${isTd?' today':''}${hasEv?' has-event':''}" style="${hasEv&&!isTd?'background:rgba(245,158,11,.1);border-radius:7px':''}" onclick="calDayClick(${d},'${mode}')"><div class="cal-day-num" style="${hasEv&&!isTd?'color:var(--amber);font-weight:800':''}">${d}</div></div>`;
    }
  }
  h+=`</div></div>`;el.innerHTML=h;
}
function calNav(dir,cid,mode){calMonth+=dir;if(calMonth>11){calMonth=0;calYear++;}if(calMonth<0){calMonth=11;calYear--;}buildCalendar(cid,mode);}
function calDayClick(d,mode){
  const ds=new Date(calYear,calMonth,d).toLocaleDateString('en-PH',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  const slots={18:3,19:0,20:2,21:4,22:4,25:1,26:0};
  if(mode==='avail'){
    const sl=slots[d]||5;
    if(sl===0){toast('❌','Fully Booked',`${ds} has no available slots. Please choose another date.`);return;}
    // Ask if they want to book
    S._bookDate=ds;S._bookSlots=sl;
    openModal('avail-book-modal');
    document.getElementById('avail-book-date').textContent=ds;
    document.getElementById('avail-book-slots').textContent=sl+' slot'+(sl!==1?'s':'')+' remaining';
    return;
  }
  const msgs={events:`Events on ${ds}`,repairs:`Repair schedule on ${ds}`,bookings:`Your bookings on ${ds}`,admin:`Community events on ${ds}`};
  toast('📆',msgs[mode]||ds,'Tap a date with events to see details.');
}
function buildCalendarEvents(){
  const el=document.getElementById('cal-events-admin');if(!el)return;
  const events=[{date:'Apr 18',title:'⚠️ Water Interruption 10PM–2AM',color:'var(--red)',tag:'Urgent',tg:'tg-red'},{date:'Apr 19',title:'🛺 Tricycle Booking · Unit 12B',color:'var(--purple)',tag:'Booking',tg:'tg-purple'},{date:'Apr 25',title:'📅 General Assembly Meeting',color:'var(--acc)',tag:'Event',tg:'tg-teal'},{date:'May 5',title:'🎉 Fiesta sa Subdivision',color:'var(--purple)',tag:'Event',tg:'tg-purple'}];
  el.innerHTML=events.map(e=>`<div class="bk-item" style="border-left-color:${e.color}"><div class="bk-date">${e.date.toUpperCase()}</div><div class="bk-title">${e.title}</div><div class="bk-status"><span class="tag ${e.tg}">${e.tag}</span></div></div>`).join('');
}

/* ── SEARCH OVERLAY ── */
const SEARCH_DATA=[
  {type:'update',label:'⚠️ Urgent · Today',title:'Water interruption tonight 10PM–2AM',body:'Blocks 5–9 affected. Scheduled maintenance on main water line.',color:'var(--red)',action:"closeSearchOverlay();rOpenDetail('rd-ann')"},
  {type:'update',label:'📅 Event · Yesterday',title:'General Assembly — April 25',body:'Annual meeting at the Main Clubhouse, 5:30 PM.',color:'var(--acc)',action:"closeSearchOverlay();rOpenDetail('rd-upd')"},
  {type:'update',label:'🗑️ Schedule · Apr 16',title:'Bulk Garbage Pickup — Saturday 6AM',body:'Place bins outside before 6:00 AM.',color:'var(--amber)',action:''},
  {type:'update',label:'💧 Info · Apr 14',title:'Water Refill Station Location',body:'Available at the corner of Block 8, Monday–Friday 8AM–5PM.',color:'var(--blue)',action:''},
  {type:'service',label:'🛺 Booking',title:'Book Tricycle / E-Trike Service',body:'Schedule a ride — select date and time slot',action:"closeSearchOverlay();rOpenDetail('rd-book')"},
  {type:'service',label:'🏊 Booking',title:'Pool / Clubhouse Reservation',body:'Reserve a slot — check availability first',action:"closeSearchOverlay();rOpenDetail('rd-book')"},
  {type:'service',label:'🔧 Request',title:'Contact Repairman / Maintenance',body:'Submit a repair request to HOA maintenance team',action:"closeSearchOverlay();openForm('parking-report');rOpenDetail('rp-form-fill')"},
  {type:'service',label:'🅿️ Report',title:'Report Illegal Parking',body:'File a parking violation report',action:"closeSearchOverlay();openForm('parking-report')"},
  {type:'service',label:'🚗 Request',title:'Request Guest Parking Sticker',body:'Apply for a visitor parking sticker',action:"closeSearchOverlay();openForm('parking')"},
  {type:'service',label:'💡 Info',title:'Water Meter Reading Schedule',body:'Reading done every 28th of the month by HOA team',action:''},
  {type:'contact',label:'⭐ Block Leader',title:'Roberto Cruz — Block 7 & 8',body:'Your Block Leader — call or SMS anytime'},
  {type:'contact',label:'🛡️ Security',title:'Guardhouse / Security Gate',body:'24/7 gate security'},
  {type:'form',label:'📋 Form',title:'Visitor / Guest Registration',body:'Pre-register guests before arrival',action:"closeSearchOverlay();openForm('visitor')"},
  {type:'form',label:'📋 Form',title:'Gate Pass Request',body:'For workers, deliveries, service vehicles',action:"closeSearchOverlay();openForm('gatepass')"},
  {type:'form',label:'📋 Form',title:'Concern / Complaint Letter',body:'Formal letter to HOA Board',action:"closeSearchOverlay();openForm('concern')"},
];
function openSearchOverlay(){document.getElementById('search-overlay').classList.add('on');document.getElementById('search-inp').value='';renderSearchDefault();setTimeout(()=>document.getElementById('search-inp').focus(),100);}
function closeSearchOverlay(){document.getElementById('search-overlay').classList.remove('on');}
function renderSearchDefault(){
  const body=document.getElementById('search-body');
  const byType=(t,title)=>{
    const items=SEARCH_DATA.filter(d=>d.type===t);
    return`<div class="search-section"><div class="search-section-title">${title}</div>${items.map(d=>`<div class="search-result-card" style="border-left-color:${d.color||'var(--border)'}" onclick="${d.action||''}"><div class="src-label">${d.label}</div><div class="src-title">${d.title}</div><div class="src-preview">${d.body}</div></div>`).join('')}</div>`;
  };
  body.innerHTML=byType('update','📋 Updates & Announcements')+byType('service','🛎️ Services')+byType('contact','📞 Contacts')+byType('form','📋 Forms & Requests');
}
function doSearch(q){
  const body=document.getElementById('search-body');
  if(!q.trim()){renderSearchDefault();return;}
  const ql=q.toLowerCase();
  const results=SEARCH_DATA.filter(d=>(d.title+d.body+d.label).toLowerCase().includes(ql));
  if(!results.length){body.innerHTML=`<div class="search-empty"><div class="se-icon">🔍</div><div class="se-txt">No results for "${q}"</div><div style="font-size:12px;color:var(--muted);margin-top:6px">Try another word, like "water", "parking", or "pool"</div></div>`;return;}
  function hl(t){return t.replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),m=>`<span class="src-match">${m}</span>`);}
  body.innerHTML=`<div style="font-size:12px;color:var(--muted);padding:4px 0 8px">${results.length} result${results.length!==1?'s':''} for "<strong>${q}</strong>"</div>`+results.map(d=>`<div class="search-result-card" style="border-left-color:${d.color||'var(--border)'};margin-bottom:8px" onclick="${d.action||''}"><div class="src-label">${d.label}</div><div class="src-title">${hl(d.title)}</div><div class="src-preview">${hl(d.body)}</div></div>`).join('');
}

/* ── FORMAL FORMS ── */
const FORMS={
  visitor:{title:'Visitor / Guest Registration',fields:[{l:'Visitor Full Name',p:'Full name of your guest',id:'f-vis-name'},{l:'Relationship to You',p:'e.g. Family, Friend, Business partner',id:'f-vis-rel'},{l:'Date of Visit',p:'',type:'date',id:'f-vis-date'},{l:'Expected Arrival Time',p:'e.g. 2:00 PM',id:'f-vis-arrival'},{l:'Expected Departure Time',p:'e.g. 5:00 PM',id:'f-vis-depart'},{l:'Purpose of Visit',p:'e.g. Personal visit, birthday celebration',id:'f-vis-purpose'},{l:'Vehicle Plate (if bringing a vehicle)',p:'Leave blank if visitor is on foot',id:'f-vis-plate'},{l:'Parking Needed?',p:'Yes — requesting a visitor parking slot / No — no vehicle',id:'f-vis-parking'},{l:'Parking Duration (if needed)',p:'e.g. 3 hours, full day',id:'f-vis-park-dur'}]},
  gatepass:{title:'Gate Pass for Service / Delivery',fields:[{l:'Name of Person or Company',p:'Full name or business name',id:'f-gp-name'},{l:'Type of Service',p:'e.g. Appliance delivery, third-party repair, construction',id:'f-gp-type'},{l:'Valid Date(s)',p:'e.g. May 5–6, 2026',id:'f-gp-dates'},{l:'Entry Time Window',p:'e.g. 8:00 AM – 5:00 PM',id:'f-gp-time'},{l:'Description of Items or Work',p:'What will be brought in or what work will be done',id:'f-gp-items'},{l:'Your Name and Unit Number',p:'Resident requesting this gate pass',id:'f-gp-resident'}]},
  'resident-parking':{title:'Special Parking Request (Residents Only)',fields:[{l:'Your Name and Unit Number',p:'e.g. Jose Reyes — Unit 12B',id:'f-rp-resident'},{l:'Vehicle Plate Number',p:'e.g. ABC 1234',id:'f-rp-plate'},{l:'Vehicle Make & Model',p:'e.g. Toyota Vios 2020',id:'f-rp-car'},{l:'Reason for Special Parking',p:'Explain why you need temporary parking (e.g. guests staying overnight, emergency)',id:'f-rp-reason'},{l:'Date(s) Needed',p:'e.g. May 5–6, 2026',id:'f-rp-dates'},{l:'Duration',p:'e.g. 2 nights, 1 week',id:'f-rp-dur'}]},
  concern:{title:'Concern / Complaint Letter',fields:[{l:'Subject / Title of Concern',p:'Brief description of the issue',id:'f-co-subject'},{l:'Full Description',p:'Describe in detail what happened',id:'f-co-body',area:true},{l:'Location / Area Affected',p:'e.g. Block 7, near Unit 12B',id:'f-co-loc'},{l:'Date / Time of Incident',p:'When did this happen?',id:'f-co-when'},{l:'Requested Action',p:'What do you want HOA to do?',id:'f-co-action'}]},
  'parking-report':{title:'Illegal Parking Report',fields:[{l:'Vehicle Plate Number',p:'e.g. ABC 1234',id:'f-pr-plate'},{l:'Vehicle Description',p:'Color, make, model',id:'f-pr-desc'},{l:'Location of Vehicle',p:'e.g. In front of Unit 7D',id:'f-pr-loc'},{l:'Since When Parked',p:'e.g. Since this morning, April 18',id:'f-pr-since'},{l:'Your Unit Number',p:'For reference',id:'f-pr-unit'}]},
  maintenance:{title:'Maintenance Request',fields:[{l:'Type of Repair Needed',p:'e.g. Plumbing, Electrical, Painting',id:'f-mx-type'},{l:'Location / Area',p:'e.g. Unit 12B bathroom, Block 7 alley',id:'f-mx-loc'},{l:'Description of Problem',p:'Describe what needs to be fixed',id:'f-mx-desc',area:true},{l:'Urgency Level',p:'e.g. Urgent, Can wait, Scheduled',id:'f-mx-urgency'},{l:'Preferred Schedule',p:'e.g. Weekdays AM, ASAP',id:'f-mx-sched'}]}
};
function openForm(formKey,from){
  const f=FORMS[formKey];if(!f)return;
  S.currentForm=formKey;
  document.getElementById('form-fill-title').textContent=f.title;
  const body=document.getElementById('form-fill-body');
  body.innerHTML=f.fields.map(fld=>`<div class="fg"><span class="lbl">${fld.l}</span>${fld.area?`<textarea class="inp" placeholder="${fld.p}" id="${fld.id}" style="min-height:75px"></textarea>`:`<input class="inp" type="${fld.type||'text'}" placeholder="${fld.p}" id="${fld.id}">`}</div>`).join('');
  document.getElementById('doc-preview-area').style.display='none';
  rOpenDetail('rp-form-fill',from||S.prevPage||'forms');
}
function generateDocument(){
  const f=FORMS[S.currentForm];if(!f)return;
  const vals={};f.fields.forEach(fld=>{const el=document.getElementById(fld.id);if(el)vals[fld.id]=el.value||'[Not provided]';});
  const today=new Date().toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'});
  const refNo='REF-'+Math.floor(Math.random()*90000+10000)+'-'+new Date().getFullYear();
  let docBody='';
  if(S.currentForm==='visitor'){const visQrRef='VIS-'+genCode();docBody=`<p>This is to certify that <strong class="doc-field">${vals['f-vis-name']}</strong>, a <strong class="doc-field">${vals['f-vis-rel']}</strong>, is hereby authorized to enter <strong>${S.sub}</strong> to visit <strong class="doc-field">Unit 12B — Jose Reyes</strong>.</p><br><p><strong>Date of Visit:</strong> <span class="doc-field">${vals['f-vis-date']}</span><br><strong>Time:</strong> <span class="doc-field">${vals['f-vis-arrival']}</span> – <span class="doc-field">${vals['f-vis-depart']}</span><br><strong>Purpose:</strong> <span class="doc-field">${vals['f-vis-purpose']}</span><br><strong>Vehicle Plate:</strong> <span class="doc-field">${vals['f-vis-plate']||'N/A — On foot'}</span><br><strong>Parking Request:</strong> <span class="doc-field">${vals['f-vis-parking']||'Not requested'}</span></p><br><p>The undersigned resident takes full responsibility for the conduct of the said visitor while inside the subdivision premises.</p><br><div style="background:var(--bg);border-radius:8px;padding:10px 12px;margin-top:8px"><div style="font-family:var(--font);font-weight:800;font-size:12px;color:var(--p1);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:6px">📲 Visitor Gate Pass QR Code</div><div style="font-family:var(--font);font-weight:900;font-size:16px;color:var(--acc);letter-spacing:0.15em">${visQrRef}</div><div style="font-size:11px;color:var(--muted);margin-top:3px">This reference code will be converted to a QR pass upon HOA approval. The visitor must present this at the gate.</div></div>`;}
  else if(S.currentForm==='parking'){docBody=`<p>I, <strong>Jose Reyes</strong>, a resident of <strong>Unit 12B, ${S.sub}</strong>, am respectfully requesting a temporary guest parking pass for the following vehicle:</p><br><p><strong>Vehicle Owner:</strong> <span class="doc-field">${vals['f-pk-owner']}</span><br><strong>Make &amp; Model:</strong> <span class="doc-field">${vals['f-pk-car']}</span><br><strong>Plate Number:</strong> <span class="doc-field">${vals['f-pk-plate']}</span><br><strong>Duration:</strong> <span class="doc-field">${vals['f-pk-dur']}</span><br><strong>Reason:</strong> <span class="doc-field">${vals['f-pk-reason']}</span></p><br><p>I understand that this parking pass is subject to HOA rules and regulations and may be revoked at any time.</p>`;}
  else if(S.currentForm==='gatepass'){docBody=`<p>This serves as a formal request for a Gate Pass for the following person/service to enter <strong>${S.sub}</strong>:</p><br><p><strong>Name / Company:</strong> <span class="doc-field">${vals['f-gp-name']}</span><br><strong>Type of Entry:</strong> <span class="doc-field">${vals['f-gp-type']}</span><br><strong>Valid Dates:</strong> <span class="doc-field">${vals['f-gp-dates']}</span><br><strong>Time:</strong> <span class="doc-field">${vals['f-gp-time']}</span><br><strong>Items / Work:</strong> <span class="doc-field">${vals['f-gp-items']}</span></p><br><p>Requested by: <span class="doc-field">${vals['f-gp-resident']}</span></p><br><p>The requesting resident guarantees that the above individual/service provider has been authorized and will comply with all subdivision rules during the duration of their visit.</p>`;}
  else if(S.currentForm==='concern'){docBody=`<p>Dear HOA Board of Directors,<br><strong>${S.hoa}</strong>,<br>${S.sub}</p><br><p>I, <strong>Jose Reyes</strong> of <strong>Unit 12B, Block 7</strong>, am writing to formally bring to your attention the following concern:</p><br><p><strong>Subject:</strong> <span class="doc-field">${vals['f-co-subject']}</span></p><br><p>${vals['f-co-body']}</p><br><p><strong>Location:</strong> <span class="doc-field">${vals['f-co-loc']}</span><br><strong>Date/Time of Incident:</strong> <span class="doc-field">${vals['f-co-when']}</span></p><br><p>I am respectfully requesting the HOA to: <span class="doc-field">${vals['f-co-action']}</span></p><br><p>I trust that the HOA Board will give this matter the appropriate attention it deserves. Thank you.</p>`;}
  else if(S.currentForm==='parking-report'){docBody=`<p>I am formally reporting an illegally parked vehicle within the premises of <strong>${S.sub}</strong>:</p><br><p><strong>Plate Number:</strong> <span class="doc-field">${vals['f-pr-plate']}</span><br><strong>Vehicle Description:</strong> <span class="doc-field">${vals['f-pr-desc']}</span><br><strong>Location:</strong> <span class="doc-field">${vals['f-pr-loc']}</span><br><strong>Parked Since:</strong> <span class="doc-field">${vals['f-pr-since']}</span></p><br><p>Reported by: <strong>Jose Reyes, ${vals['f-pr-unit']}</strong></p><br><p>I respectfully request the HOA security team to address this parking violation immediately.</p>`;}
  else if(S.currentForm==='maintenance'){docBody=`<p>Dear HOA Maintenance Team,</p><br><p>I, <strong>Jose Reyes</strong> of <strong>Unit 12B, Block 7</strong>, am requesting maintenance service for the following:</p><br><p><strong>Type of Repair:</strong> <span class="doc-field">${vals['f-mx-type']}</span><br><strong>Location:</strong> <span class="doc-field">${vals['f-mx-loc']}</span><br><strong>Problem Description:</strong> <span class="doc-field">${vals['f-mx-desc']}</span><br><strong>Urgency:</strong> <span class="doc-field">${vals['f-mx-urgency']}</span><br><strong>Preferred Schedule:</strong> <span class="doc-field">${vals['f-mx-sched']}</span></p><br><p>Please coordinate with me at your earliest convenience. Thank you.</p>`;}
  else if(S.currentForm==='resident-parking'){docBody=`<p>I, <strong>${vals['f-rp-resident']}</strong>, am respectfully requesting a temporary special parking slot for my personal vehicle:</p><br><p><strong>Vehicle:</strong> <span class="doc-field">${vals['f-rp-car']}</span><br><strong>Plate Number:</strong> <span class="doc-field">${vals['f-rp-plate']}</span><br><strong>Date(s) Needed:</strong> <span class="doc-field">${vals['f-rp-dates']}</span><br><strong>Duration:</strong> <span class="doc-field">${vals['f-rp-dur']}</span><br><strong>Reason:</strong> <span class="doc-field">${vals['f-rp-reason']}</span></p><br><p>I understand this is a temporary arrangement subject to HOA approval and availability of parking slots.</p>`;}
  else{docBody='<p>Request submitted for review.</p>';}
  document.getElementById('doc-preview-box').innerHTML=`
    <div class="doc-letterhead">
      <div class="doc-hoa-name">${S.hoa}</div>
      <div class="doc-sub-name">${S.sub}</div>
    </div>
    <div class="doc-form-title">${f.title}</div>
    <div class="doc-ref">Reference No.: ${refNo} &nbsp;|&nbsp; Date: ${today}</div>
    <div class="doc-body">${docBody}</div>
    <div class="doc-sig-row" style="margin-top:24px">
      <div class="doc-sig">Resident Signature &amp; Printed Name</div>
      <div class="doc-sig">Received by (HOA Staff)</div>
    </div>
    <div style="text-align:center;font-size:10px;color:var(--muted);margin-top:14px;letter-spacing:0.04em">Generated via CasaConnect HOA App · ${today}</div>
  `;
  document.getElementById('doc-preview-area').style.display='block';
  document.getElementById('doc-preview-area').scrollIntoView({behavior:'smooth',block:'start'});
}

/* ── CONTACT REQUEST ── */
function openContactRequest(name,category){
  S.contactReqTarget={name,category};
  document.getElementById('contact-req-info').innerHTML=`Requesting contact access to: <b>${name}</b>`;
  document.getElementById('cr-nature').value=category;
  document.getElementById('cr-desc').value='';
  openModal('contact-req-modal');
}
function submitContactRequest(){
  const d=document.getElementById('cr-desc').value;
  if(!d){toast('⚠️','Please describe your concern','');return;}
  const t=S.contactReqTarget;
  closeModal('contact-req-modal');
  toast('✅','Request Submitted',`Your request to contact ${t.name} has been sent to your Block Leader for routing. You will receive a callback within 24 hours.`);
}

/* ── THEME / UPLOADS ── */
function applyTheme(el,p1,p2,acc){
  document.querySelectorAll('.tp').forEach(x=>x.classList.remove('on'));el.classList.add('on');
  document.documentElement.style.setProperty('--p1',p1);document.documentElement.style.setProperty('--p2',p2);document.documentElement.style.setProperty('--acc',acc);
  document.getElementById('c-p1').value=p1;document.getElementById('c-p2').value=p2;document.getElementById('c-acc').value=acc;
}
function applyCustomTheme(){
  document.documentElement.style.setProperty('--p1',document.getElementById('c-p1').value);
  document.documentElement.style.setProperty('--p2',document.getElementById('c-p2').value);
  document.documentElement.style.setProperty('--acc',document.getElementById('c-acc').value);
  document.querySelectorAll('.tp').forEach(x=>x.classList.remove('on'));
}
function uploadLogo(input){
  if(!input.files[0])return;
  const r=new FileReader();r.onload=e=>{S.logoSrc=e.target.result;const p=document.getElementById('logo-prev');p.src=e.target.result;p.style.display='block';toast('🏛️','Logo Uploaded!','Your HOA logo will appear on the splash screen and dashboard.');};r.readAsDataURL(input.files[0]);
}
function uploadPhoto(input){
  if(!input.files[0])return;
  const r=new FileReader();r.onload=e=>{S.splashBg=e.target.result;const p=document.getElementById('photo-prev');p.src=e.target.result;p.style.display='block';toast('📸','Photo Uploaded!','Your community photo will appear on the welcome screen for all users.');};r.readAsDataURL(input.files[0]);
}
function setDriverPhoto(input,targetId){
  if(!input.files[0])return;
  const r=new FileReader();r.onload=e=>{const b=document.getElementById(targetId);if(b)b.innerHTML=`<img src="${e.target.result}" alt="driver" style="width:100%;height:100%;object-fit:cover;border-radius:10px">`;};r.readAsDataURL(input.files[0]);
}

/* ── DECLINE BOOKING ── */
function openDeclineModal(btn,name,service){
  S.declineTarget={btn,name,service};
  document.getElementById('decline-booking-info').innerHTML=`<b>${name}</b> — ${service}`;
  document.getElementById('decline-extra-note').value='';
  openModal('decline-modal');
}
function confirmDeclineBooking(){
  const reason=document.querySelector('#decline-reason-pills .pill.on')?.textContent||'Slot unavailable';
  const note=document.getElementById('decline-extra-note').value;
  const t=S.declineTarget;
  const sms=`CasaConnect: Your booking "${t.service}" was declined. Reason: ${reason}${note?'. Note: '+note:''}. Contact HOA for info. – ${S.sub} HOA`;
  closeModal('decline-modal');
  if(t.btn)handleBkr(t.btn,'❌ Declined',sms);
  else toast('❌','Booking Declined','Resident notified via SMS.',sms);
}

/* ── ASSIGN / DECLINE TRIKE ── */
function openAssign(unit,name,date,time){
  S.assignTarget={unit,name,date,time};
  document.getElementById('assign-booking-info').innerHTML=`<b>${unit} · ${name}</b><br><span style="font-size:12px;color:var(--muted)">${date} · ${time}</span>`;
  document.getElementById('assign-driver').value='';document.getElementById('assign-tric').value='';
  openModal('assign-modal');
}
function confirmAssign(){
  const driver=document.getElementById('assign-driver').value;const tric=document.getElementById('assign-tric').value;
  if(!driver||!tric){toast('⚠️','Missing Info','Enter driver name and tricycle number.');return;}
  const t=S.assignTarget;closeModal('assign-modal');
  toast('✅','Booking Approved!',`${t.name} (${t.unit}) — ${t.date} ${t.time} approved.`,`CasaConnect: Tricycle ${t.date} at ${t.time} APPROVED! Driver: ${driver} · ${tric}. – ${S.sub} HOA`);
}
function openDeclineTrike(){closeModal('assign-modal');document.getElementById('trike-decline-note').value='';openModal('decline-trike-modal');}
function confirmDeclineTrike(){
  const reason=document.querySelector('#trike-decline-pills .pill.on')?.textContent||'No driver available';
  const note=document.getElementById('trike-decline-note').value;
  const t=S.assignTarget;closeModal('decline-trike-modal');
  toast('❌','Booking Declined','Resident notified via SMS.',`CasaConnect: Tricycle ${t.date} at ${t.time} DECLINED. Reason: ${reason}${note?'. '+note:''}. Please rebook. – ${S.sub} HOA`);
}

/* ── BOOKING ACTIONS ── */
function handleBkr(btn,title,sms){
  toast('📲',title,'Resident notified via SMS.',sms);
  const row=btn.closest('.bkr'),tag=row.querySelector('.tag');
  if(title.includes('Approved')){tag.className='tag tg-green';tag.textContent='Approved';}
  else if(title.includes('Declin')||title.includes('Cancel')){tag.className='tag tg-red';tag.textContent='Declined';}
  else{tag.className='tag tg-navy';tag.textContent='Acknowledged';}
  row.querySelectorAll('.btn').forEach(b=>{b.disabled=true;b.style.opacity='.35';});
}

/* ── POSTS ── */
function postAnn(){const imgEl=document.getElementById("ann-photo-prev-img");const imgSrc=imgEl&&imgEl.src&&!imgEl.src.endsWith("hoa-app.js")?imgEl.src:"";
  const t=document.getElementById('a-ann-t').value||'New Announcement';
  const b=document.getElementById('a-ann-b').value||'';
  const pill=document.querySelector('#ap-post .pill.on')?.textContent||'📋 Update';
  const colors={'Urgent':'var(--red)','Update':'var(--acc)','Event':'var(--purple)','Reminder':'var(--amber)'};
  const col=Object.entries(colors).find(([k])=>pill.includes(k))?.[1]||'var(--acc)';
  const targets=bpGetSelected('admin-block-picker');
  const targetLbl=targets.length===0?'All Residents':targets.join(', ');
  const d=document.createElement('div');d.className='post-card';d.style.borderLeftColor=col;
  d.dataset.targets=JSON.stringify(targets);
  d.innerHTML=`${imgSrc?"<img class=\"post-card-img\" src=\""+imgSrc+"\">":""}<div class="post-head"><span class="post-title">${pill.substring(0,2)} ${t}</span><span class="tag tg-navy">${pill.substring(2).trim()}</span></div><div class="post-body">${b||"No details."}</div><div class="post-foot"><span class="post-tm">Just now · ${targetLbl}</span><span class="post-del" onclick="removePost(this)">Delete</span></div>`;
  document.getElementById('a-all-posts').prepend(d);
  document.getElementById('a-ann-t').value='';document.getElementById('a-ann-b').value='';
  clearPostPhoto('ann-photo-prev','ann-photo-prev-img','ann-photo-inp');
  toast('📢','Published!',`"${t}" sent to: ${targetLbl}.`,`CasaConnect ALERT: ${t}. Check the app for details. – ${S.sub} HOA`);
}
function leaderPost(){
  const t=document.getElementById('l-post-t').value||'Notice';const b=document.getElementById('l-post-b').value||'';
  const pill=document.querySelector('#rp-post .pill.on')?.textContent||'📌 Reminder';
  const imgEl=document.getElementById('l-photo-prev-img');
  const imgSrc=imgEl&&imgEl.src&&!imgEl.src.endsWith('hoa-app.js')?imgEl.src:'';
  const targets=bpGetSelected('leader-block-picker');
  const targetLbl=targets.length===0?'All My Blocks':targets.join(', ');
  const d=document.createElement('div');d.className='post-card';d.style.borderLeftColor='var(--amber)';
  d.dataset.targets=JSON.stringify(targets);
  d.innerHTML=`${imgSrc?`<img class="post-card-img" src="${imgSrc}">`:''}<div class="post-head"><span class="post-title">${pill.substring(0,2)} ${t}</span><span class="tag tg-amber">Block Post</span></div><div class="post-body">${b}</div><div class="post-foot"><span class="post-tm">Just now · ${targetLbl}</span><span class="post-del" onclick="removePost(this)">Delete</span></div>`;
  document.getElementById('l-posts').prepend(d);
  document.getElementById('l-post-t').value='';document.getElementById('l-post-b').value='';
  clearPostPhoto('l-photo-prev','l-photo-prev-img','l-photo-inp');
  toast('📢','Posted!',`Block post "${t}" sent to: ${targetLbl}.`);rNav('home');
}
function pickPostPhoto(inputId){document.getElementById(inputId).click();}
function loadPostPhoto(inp,prevWrapperId,prevImgId){
  const f=inp.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=e=>{
    const w=document.getElementById(prevWrapperId);
    const img=document.getElementById(prevImgId);
    img.src=e.target.result;w.style.display='block';
  };r.readAsDataURL(f);
}
function clearPostPhoto(prevWrapperId,prevImgId,inputId){
  const w=document.getElementById(prevWrapperId);const img=document.getElementById(prevImgId);
  const inp=document.getElementById(inputId);
  if(w)w.style.display='none';if(img)img.src='';if(inp)inp.value='';
}
function removePost(el){el.closest('.post-card').remove();}

/* ── SERVICES ── */
function addSvc(){
  const n=document.getElementById('svc-name').value;if(!n){toast('⚠️','Enter name','');return;}
  const ic=document.querySelector('.ic-opt.on')?.textContent||'📌';
  document.getElementById('a-svc-list').insertAdjacentHTML('beforeend',`<div class="mr"><div class="mr-av">${ic}</div><div class="mr-info"><div class="mr-name">${n}</div><div class="mr-meta">Booking · Active</div></div><span class="tag tg-teal">Live</span></div>`);
  document.getElementById('r-svc-grid').insertAdjacentHTML('beforeend',`<div class="s3-chip" onclick="rOpenDetail('rd-book')"><div class="s3-ic">${ic}</div><div class="s3-lbl">${n}</div><div class="s3-sub">Tap to book</div></div>`);
  document.getElementById('svc-name').value='';
  toast('✅','Service Added!',`"${n}" is now live in the resident Services tab.`);
}

/* ── QR ── */
function toggleQrF(){const r=document.getElementById('qr-role').value;document.getElementById('qrf-resident').style.display=r==='toda'?'none':'';document.getElementById('qrf-toda').style.display=r==='toda'?'':'none';}
function genQR(){
  const nm=document.getElementById('qr-name').value;if(!nm){toast('⚠️','Enter name','');return;}
  const role=document.getElementById('qr-role').value;
  const unit=document.getElementById('qr-unit')?.value||'';const block=document.getElementById('qr-block')?.value||'';const phase=document.getElementById('qr-phase')?.value||'';
  const todaId=document.getElementById('qr-toda-id')?.value||'';const tricNum=document.getElementById('qr-tric-num')?.value||'';
  const code=genCode();
  const payload=JSON.stringify({role,name:nm,unit,block,phase,todaId,tricNum,code,sub:S.sub,issued:new Date().toISOString().slice(0,10)});
  document.getElementById('qr-lbl-txt').textContent=role==='toda'?`${nm} · ${todaId} · ${tricNum}`:`${nm} · ${unit} · ${block} · ${phase}`;
  document.getElementById('qr-manual').textContent=code;
  document.getElementById('qr-result').style.display='block';
  const qc=document.getElementById('qrcode');qc.innerHTML='';
  try{new QRCode(qc,{text:payload,width:150,height:150,colorDark:getCSSVar('--p1')||'#0F2137',colorLight:'#FFFFFF',correctLevel:QRCode.CorrectLevel.M});}
  catch(e){qc.innerHTML='<div style="width:150px;height:150px;background:var(--bg);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--muted);text-align:center;padding:10px">QR loading…<br>Use backup code above.</div>';}
  document.getElementById('qr-result').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function genCode(){const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<8;i++){if(i===4)s+='-';s+=c[Math.floor(Math.random()*c.length)];}return s;}

/* ── UI HELPERS ── */
function selPill(el){el.closest('.pill-row').querySelectorAll('.pill').forEach(p=>p.classList.remove('on'));el.classList.add('on');}
function pickIc(el){document.querySelectorAll('.ic-opt').forEach(i=>i.classList.remove('on'));el.classList.add('on');}

/* ── VISITOR ── */
function gNav(page){
  document.querySelectorAll('#scr-guard .g-sub-pg').forEach(x=>x.classList.remove('on'));
  document.getElementById('gp-'+page)?.classList.add('on');
}
function gVisTab(t){
  ['expected','inside','walkin'].forEach(x=>{
    document.getElementById('gvt-'+x)?.classList.toggle('on',x===t);
    const p=document.getElementById('gvp-'+x);if(p)p.style.display=x===t?'block':'none';
  });
}

function logEntry(btn,name,dest){toast('✅','Visitor Admitted',`${name} logged in. Destination: ${dest}. ID collected.`);btn.closest('.vli').style.opacity='.5';btn.textContent='✅';btn.disabled=true;}
function logWalkIn(){
  const n=document.getElementById('g-v-name').value;const u=document.getElementById('g-v-unit').value;
  if(!n||!u){toast('⚠️','Incomplete','Enter visitor name and destination.');return;}
  toast('✅','Walk-in Logged',`${n} → ${u}. ID held at gate. ${new Date().toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'})}.`);
  ['g-v-name','g-v-unit','g-v-purpose'].forEach(id=>document.getElementById(id).value='');
}

/* ── NOTIFICATIONS ── */
const NOTIFS={
  admin:[{u:1,t:'📅 New Booking — Unit 12B',m:'Tricycle Sat Apr 19 9AM',tm:'Today 7:44 AM'},{u:1,t:'💬 New Feedback',m:'Streetlight issue Unit 7D',tm:'Today 7:14 AM'},{u:0,t:'👥 New Member',m:'Unit 2A registered.',tm:'Apr 16'}],
  resident:[{u:1,t:'⚠️ Urgent Notice',m:'Water interruption 10PM–2AM.',tm:'Today 8:00 AM'},{u:1,t:'✅ Booking Received',m:'Tricycle request pending approval.',tm:'Today 7:45 AM'},{u:0,t:'📋 New Update',m:'General Assembly April 25.',tm:'Yesterday'}],
  leader:[{u:1,t:'📢 HOA: Water Interruption',m:'Tonight 10PM–2AM.',tm:'Today 8:00 AM'},{u:1,t:'💬 Resident Feedback',m:'Noise issue near Unit 9.',tm:'Yesterday'}],
  guard:[{u:1,t:'⚠️ Urgent Notice',m:'Water interruption tonight.',tm:'Today 8:00 AM'}],
  toda:[{u:1,t:'🛺 2 New Booking Requests',m:'Units 12B and 4A for Sat Apr 19.',tm:'Today 7:44 AM'}]
};
function openNotif(){
  const list=document.getElementById('notif-list');list.innerHTML='';
  (NOTIFS[S.role]||NOTIFS.resident).forEach(n=>{
    const d=document.createElement('div');
    d.style.cssText='display:flex;gap:10px;padding:11px 14px;border-bottom:1px solid var(--border)';
    d.innerHTML=`<div style="width:7px;height:7px;border-radius:50%;background:${n.u?'var(--acc)':'var(--border)'};flex-shrink:0;margin-top:5px"></div><div><div style="font-family:var(--font);font-weight:700;font-size:13px;color:var(--text);letter-spacing:0.02em">${n.t}</div><div style="font-size:12px;color:var(--muted);margin-top:2px">${n.m}</div><div style="font-size:10px;color:var(--muted);margin-top:2px">${n.tm}</div></div>`;
    list.appendChild(d);
  });
  openModal('notif-modal');
}

/* ── MODAL / TOAST ── */
function openModal(id){document.getElementById(id).classList.add('on');}
function closeModal(id){document.getElementById(id).classList.remove('on');}
function toast(icon,title,msg,sms){
  document.getElementById('t-icon').textContent=icon;document.getElementById('t-title').textContent=title;document.getElementById('t-msg').textContent=msg;
  const s=document.getElementById('t-sms');
  if(sms){s.style.display='block';document.getElementById('t-sms-txt').textContent=sms;}else s.style.display='none';
  openModal('toast-modal');
}

/* ── BOOKING TABS ── */
function bkrTab(t){
  document.getElementById('bkr-tab-svc').classList.toggle('on',t==='svc');
  document.getElementById('bkr-tab-vis').classList.toggle('on',t==='vis');
  document.getElementById('bkr-panel-svc').style.display=t==='svc'?'':'none';
  document.getElementById('bkr-panel-vis').style.display=t==='vis'?'':'none';
}

/* ── APPROVE VISITOR (sends QR pass SMS) ── */
function approveVisitor(btn,visitorName,residentUnit,parkingSlot){
  const slotInput=btn.closest('.bkr').querySelector('input[type=text]');
  const slot=slotInput?slotInput.value:parkingSlot;
  const qrCode='VIS-'+genCode();
  const parkingTxt=slot?`Parking Slot: ${slot}.`:'No parking reserved.';
  const sms=`CasaConnect: Your visitor request for ${visitorName} has been APPROVED. Gate Pass Code: ${qrCode}. ${parkingTxt} Please share this code with your visitor. – ${S.sub} HOA`;
  const row=btn.closest('.bkr');
  const tag=row.querySelector('.tag');
  if(tag){tag.className='tag tg-green';tag.textContent='Approved';}
  row.querySelectorAll('.btn').forEach(b=>{b.disabled=true;b.style.opacity='.35';});
  toast('✅','Visitor Approved!',`${visitorName} approved for ${residentUnit}. QR Pass sent to resident via SMS.`,sms);
}

/* ── GUARD: VERIFY VISITOR CODE ── */
function verifyVisitorCode(){
  const code=document.getElementById('guard-qr-code').value.trim().toUpperCase();
  if(!code){toast('⚠️','Enter code','Enter the visitor reference code.');return;}
  const result=document.getElementById('guard-verify-result');
  // Simulate verification
  const approved=[
    {code:'VIS-7A3K',name:'Mark Dela Cruz',unit:'Unit 12B',resident:'Jose Reyes',time:'2:00 PM – 5:00 PM',parking:null},
    {code:'VIS-9BM2',name:'Carlos Mendoza',unit:'Unit 5A',resident:'Maria Santos',time:'10:00 AM – 12:00 PM',parking:'P-04'},
  ];
  const found=approved.find(v=>code.includes(v.code.replace('VIS-',''))||v.code===code);
  if(found){
    result.style.display='block';
    result.innerHTML=`<div style="background:rgba(16,185,129,.08);border:1.5px solid rgba(16,185,129,.3);border-radius:11px;padding:13px"><div style="font-family:var(--font);font-weight:800;font-size:13px;color:var(--green);letter-spacing:0.04em;margin-bottom:7px">✅ VISITOR APPROVED</div><div style="font-family:var(--font);font-weight:700;font-size:14px;color:var(--text);margin-bottom:3px">${found.name}</div><div style="font-size:12px;color:var(--muted)">Visiting ${found.unit} — ${found.resident}</div><div style="font-size:12px;color:var(--muted);margin-top:2px">Time: ${found.time}</div>${found.parking?`<div style="margin-top:8px;background:rgba(245,158,11,.12);border-radius:8px;padding:8px 10px"><span style="font-family:var(--font);font-weight:800;font-size:12px;color:var(--amber)">🅿️ PARKING APPROVED · Slot ${found.parking}</span><div style="font-size:11px;color:var(--muted);margin-top:2px">Direct vehicle to visitor parking slot ${found.parking}</div></div>`:'<div style="margin-top:6px;font-size:11px;color:var(--muted)">🚶 No parking — visitor is on foot or parking not requested</div>'}<div style="margin-top:10px"><button class="btn btn-green" style="width:100%" onclick="logEntry(this,'${found.name}','${found.unit}')">✓ Allow Entry</button></div></div>`;
  } else {
    result.style.display='block';
    result.innerHTML=`<div style="background:rgba(239,68,68,.08);border:1.5px solid rgba(239,68,68,.25);border-radius:11px;padding:13px"><div style="font-family:var(--font);font-weight:800;font-size:13px;color:var(--red);letter-spacing:0.04em;margin-bottom:4px">❌ NOT FOUND / INVALID</div><div style="font-size:12px;color:var(--muted)">Code "${code}" is not in the approved visitor list. Contact HOA admin for assistance.</div></div>`;
  }
}

/* ── TODA TABS ── */
function todaTab(t){
  ['pending','approved','declined','calendar'].forEach(tab=>{
    document.getElementById('tt-'+tab).classList.toggle('on',tab===t);
    document.getElementById('toda-panel-'+tab).style.display=tab===t?'':'none';
  });
  if(t==='calendar') buildCalendar('toda-calendar','admin');
}

/* ── HOA STRUCTURE ── */
function toggleNode(id){const ch=document.querySelector(`[data-id="${id}"] .hoa-children`);if(ch)ch.style.display=ch.style.display==='none'?'':'none';}
function openAddGroup(parentId,depth){
  if(depth>=5){toast('🔒','Level Limit Reached','Free plan supports up to 5 hierarchy levels. Upgrade to Pro to add a 6th sub-level.');return;}
  const name=prompt(`Add a sub-group under ${parentId||'root'}:
Examples: Phase 3, Block 5, Tower A, Floor 2`);
  if(!name||!name.trim())return;
  const icons=['🏛️','🏘️','🏠','🏢','🚪','📍'];
  const ic=icons[Math.min(depth,icons.length-1)];
  const newId='grp-'+Date.now();
  const container=parentId?document.querySelector(`[data-id="${parentId}"] .hoa-children`):document.getElementById('hoa-tree');
  if(!container){toast('⚠️','Structure error','Parent group not found.');return;}
  // Ensure children container exists
  if(!document.querySelector(`[data-id="${parentId}"] .hoa-children`)&&parentId){
    const parent=document.querySelector(`[data-id="${parentId}"]`);
    if(parent){const ch=document.createElement('div');ch.className='hoa-children';parent.appendChild(ch);}
  }
  const node=document.createElement('div');node.className='hoa-node';node.dataset.id=newId;node.dataset.depth=depth;
  node.innerHTML=`<div class="hoa-node-row"><span class="hoa-node-ic">${ic}</span><div class="hoa-node-body"><div class="hoa-node-name">${name.trim()}</div><div class="hoa-node-meta">Level ${depth+1} · 0 members</div></div>${depth<4?`<span class="hoa-node-add" onclick="event.stopPropagation();openAddGroup('${newId}',${depth+1})">+ Add</span>`:''}</div>`;
  const target=document.querySelector(`[data-id="${parentId}"] .hoa-children`)||document.getElementById('hoa-tree');
  target.appendChild(node);
  // Update qa-group dropdown
  const sel=document.getElementById('qa-group');
  if(sel){const opt=document.createElement('option');opt.value=newId;opt.textContent=name.trim();sel.appendChild(opt);}
  toast('✅','Group Added!',`"${name.trim()}" added to your HOA structure. You can now assign members to this group.`);
  refreshPickersFromTree();
}
function quickAddMember(){
  const nm=document.getElementById('qa-name').value;
  const role=document.getElementById('qa-role').value;
  const group=document.getElementById('qa-group');
  const unit=document.getElementById('qa-unit').value;
  if(!nm){toast('⚠️','Enter name','');return;}
  const groupName=group.options[group.selectedIndex]?.text||'HOA';
  const code=genCode();
  toast('🔐','Member Added!',`${nm} (${role}) assigned to ${groupName}${unit?' · '+unit:''}.`,`CasaConnect: Welcome to ${S.sub}! Your access code is ${code}. Show this to HOA admin or scan your QR code at the gate. – ${S.hoa}`);
  document.getElementById('qa-name').value='';document.getElementById('qa-unit').value='';
}

/* ── BOOKING FILTERS ── */
function filterBookings(){
  const svc=(document.getElementById('bkr-filter-svc')?.value||'').toLowerCase();
  const status=(document.getElementById('bkr-filter-status')?.value||'').toLowerCase();
  const q=(document.getElementById('bkr-search')?.value||'').toLowerCase();
  const date=document.getElementById('bkr-filter-date')?.value||'';
  document.querySelectorAll('#bkr-panel-svc .bkr').forEach(row=>{
    const txt=row.textContent.toLowerCase();
    const tagTxt=row.querySelector('.tag')?.textContent.toLowerCase()||'';
    const svcMatch=!svc||txt.includes(svc)||
      (svc==='pool'&&txt.includes('pool'))||(svc==='hall'&&txt.includes('hall'))||
      (svc==='maintenance'&&txt.includes('maintenance'))||(svc==='visitor'&&txt.includes('visitor'))||
      (svc==='parking'&&txt.includes('parking'));
    const statusMatch=!status||(status==='pending'&&tagTxt.includes('pending'))||
      (status==='approved'&&tagTxt.includes('approved'))||
      (status==='declined'&&(tagTxt.includes('declined')||tagTxt.includes('cancel')));
    const qMatch=!q||txt.includes(q);
    row.style.display=svcMatch&&statusMatch&&qMatch?'':'none';
  });
}

/* ── HIDE UPGRADE NUDGE FROM LEADERS ── */
function applyRoleVisibility(){
  const btn=document.getElementById('suggest-feature-btn');
  if(btn){const wrap=btn.closest('div[style]');if(wrap&&S.role==='leader')wrap.parentElement.style.display='none';}
}

/* ── INTERACTIVE ── */
document.querySelectorAll('.dc').forEach(c=>c.addEventListener('click',function(){this.closest('.date-scroll').querySelectorAll('.dc').forEach(x=>x.classList.remove('on'));this.classList.add('on');}));
document.querySelectorAll('.slot:not(.taken)').forEach(s=>s.addEventListener('click',function(){this.closest('.slot-grid').querySelectorAll('.slot').forEach(x=>x.classList.remove('on'));this.classList.add('on');}));

/* ════════════════════════════════
   SIMPLE MODE
════════════════════════════════ */
let _smPendingFn='';

function isSimpleMode(){return S.role==='resident'&&localStorage.getItem('hoa_simple')==='1';}

function enterDashboardSimple(){
  document.getElementById('sm-hello').textContent=getGreeting()+', '+S.name+'!';
  document.getElementById('sm-sub').textContent=S.sub;
  showScr('scr-simple');
}

function toggleSimpleMode(){
  const on=isSimpleMode();
  localStorage.setItem('hoa_simple', on?'0':'1');
  if(!on){
    enterDashboardSimple();
  } else {
    showScr('scr-resident');
  }
}

/* Search inside simple mode */
const SM_INDEX=[
  {kw:'tricycle trike ride book tric',ic:'🛺',t:'Book a Tricycle',sub:'Schedule a ride',fn:"smConfirm('🛺','Book a Tricycle','We will send your request to the TODA office.','smDoBook')"},
  {kw:'pool swim clubhouse reserve',ic:'🏊',t:'Reserve the Pool',sub:'Clubhouse / Swimming pool',fn:"smConfirm('🏊','Reserve the Pool','We will send your reservation request to the HOA office.','smDoPoolBook')"},
  {kw:'visitor guest register gate pass',ic:'👤',t:'Register a Visitor',sub:'Pre-register your guest at the gate',fn:"smConfirm('👤','Register a Visitor','We will notify the guardhouse about your guest.','smDoVisitor')"},
  {kw:'repair maintenance fix broken',ic:'🔧',t:'Request Repair',sub:'Report a problem at home or in the area',fn:"smConfirm('🔧','Request Repair','We will forward your request to the maintenance team.','smDoRepair')"},
  {kw:'complaint feedback concern report',ic:'💬',t:'Send a Complaint',sub:'Tell the HOA about a concern',fn:"smGoFull('feedback')"},
  {kw:'contact call phone leader guard security',ic:'📞',t:'Contact Directory',sub:'HOA office, block leader, guardhouse',fn:"smGoFull('contact')"},
  {kw:'announcement update news notice',ic:'📋',t:'View All Announcements',sub:'Updates for this month',fn:"smGoFull('updates')"},
  {kw:'parking illegal report',ic:'🅿️',t:'Report Illegal Parking',sub:'File a parking violation',fn:"smGoFull('forms')"},
  {kw:'garbage trash collection pickup',ic:'🗑️',t:'Garbage Schedule',sub:'View collection schedule',fn:"smGoFull('updates')"},
];

function smSearch(q){
  const r=document.getElementById('sm-search-results');
  const qa=document.getElementById('sm-quick-actions');
  if(!q.trim()){r.innerHTML='';qa.style.display='';return;}
  qa.style.display='none';
  const hits=SM_INDEX.filter(x=>x.kw.includes(q.toLowerCase())||x.t.toLowerCase().includes(q.toLowerCase()));
  if(!hits.length){r.innerHTML='<div style="text-align:center;padding:24px;font-size:15px;color:var(--muted)">Nothing found. Try other words.</div>';return;}
  r.innerHTML=hits.map(x=>`<button class="sm-action-btn" style="margin-bottom:10px" onclick="${x.fn}"><div class="sm-action-btn-ic">${x.ic}</div><div class="sm-action-btn-b"><div class="sm-action-btn-lbl">${x.t}</div><div class="sm-action-btn-sub">${x.sub}</div></div><span>›</span></button>`).join('');
}

/* Confirmation overlay */
function smConfirm(ic,title,detail,fn){
  _smPendingFn=fn;
  document.getElementById('sm-confirm-ic').textContent=ic;
  document.getElementById('sm-confirm-title').textContent=title+'?';
  document.getElementById('sm-confirm-detail').textContent=detail+'\n\nAre you sure you want to continue?';
  document.getElementById('sm-confirm-overlay').classList.add('on');
}
function smConfirmCancel(){document.getElementById('sm-confirm-overlay').classList.remove('on');_smPendingFn='';}
function smConfirmProceed(){
  document.getElementById('sm-confirm-overlay').classList.remove('on');
  if(_smPendingFn&&window[_smPendingFn])window[_smPendingFn]();
  _smPendingFn='';
}

/* Go to full resident screen for a specific page */
function smGoFull(page){
  showScr('scr-resident');
  rNav(page);
}

/* Open announcement detail (switch to resident screen briefly) */
function smOpenAnn(detailId){
  showScr('scr-resident');
  rOpenDetail(detailId);
}

/* Simple mode action handlers */
function smDoBook(){
  showScr('scr-resident');rOpenDetail('rd-book');
  // Small delay so screen transition completes, then open confirmation
}
function smDoPoolBook(){
  bconfOpen({ic:'🏊',title:'Confirm Pool Reservation',
    rows:[{ic:'👤',label:'Resident',value:'Jose Reyes — Unit 12B, Block 7'},{ic:'🏊',label:'Facility',value:'Swimming Pool / Clubhouse'},{ic:'📅',label:'Date',value:'To be selected'}],
    nextStep:'HOA Admin will call you to confirm the time slot',
    onProceed:()=>toast('🏊','Request Sent!','Your pool reservation request has been submitted. The HOA office will call you to confirm.',
      'CasaConnect: Pool reservation from Jose Reyes.\n\n⚠️ Submitted via Simple Mode — please call resident to confirm.')
  });
}
function smDoVisitor(){
  showScr('scr-resident');openForm('visitor');
}
function smDoRepair(){
  showScr('scr-resident');openForm('maintenance');
}

/* ════════════════════════════════
   BLOCK PICKER
════════════════════════════════ */

// Central store of HOA groups (populated from hoa-tree + dynamically added nodes)
const HOA_GROUPS=[
  {id:'phase1',label:'Phase 1',depth:1,children:[
    {id:'p1b1',label:'Block 1',depth:2,children:[]},
    {id:'p1b2',label:'Block 2',depth:2,children:[]},
  ]},
  {id:'phase2',label:'Phase 2',depth:1,children:[]},
];

// Render group checkboxes into a picker container
function bpRender(containerId,groups,allCheckId){
  const el=document.getElementById(containerId);if(!el)return;
  el.innerHTML='';
  function renderNode(node,prefix){
    const fullLabel=prefix?`${prefix} › ${node.label}`:node.label;
    const hdr=document.createElement('div');
    hdr.className='bp-group-hdr';
    hdr.innerHTML=`<span class="bp-group-hdr-ic">${node.depth<=1?'🏘️':'🏠'}</span>${node.label}`;
    el.appendChild(hdr);
    // checkbox for this node itself
    const item=document.createElement('label');
    item.className='bp-check-item';
    item.innerHTML=`<input type="checkbox" value="${node.id}" data-label="${fullLabel}" onchange="bpOnChange('${allCheckId}','${containerId}')"><span class="bp-check-box"></span><span class="bp-check-lbl">${fullLabel}</span>`;
    el.appendChild(item);
    // render children
    if(node.children&&node.children.length){
      node.children.forEach(ch=>renderNode(ch,node.label));
    }
  }
  groups.forEach(g=>renderNode(g,''));
}

function bpOnChange(allCheckId,containerId){
  // If any individual is unchecked, uncheck "All"
  const allCb=document.getElementById(allCheckId);
  const checks=document.querySelectorAll(`#${containerId} .bp-groups input[type=checkbox]`);
  const anyUnchecked=[...checks].some(c=>!c.checked);
  if(allCb)allCb.checked=!anyUnchecked;
}

function bpToggleAll(allCb,pickerId){
  const checks=document.querySelectorAll(`#${pickerId} .bp-groups input[type=checkbox]`);
  checks.forEach(c=>c.checked=allCb.checked);
}

function bpGetSelected(pickerId){
  const allCb=document.querySelector(`#${pickerId} .bp-all-row input`);
  if(allCb&&allCb.checked)return[]; // empty = all
  const checks=document.querySelectorAll(`#${pickerId} .bp-groups input[type=checkbox]:checked`);
  return [...checks].map(c=>c.dataset.label);
}

// Init pickers when app loads
function initBlockPickers(){
  bpRender('bp-groups-admin',HOA_GROUPS,'bp-all');
  // Leader only sees their own blocks (Phase 2 in demo)
  const leaderGroups=HOA_GROUPS.filter(g=>g.id==='phase2'||g.children.length===0?false:true);
  bpRender('bp-groups-leader',HOA_GROUPS,'bp-leader-all');
}

// Call after HOA structure loads
document.addEventListener('DOMContentLoaded',initBlockPickers);

// When a new group is added via openAddGroup, also push to HOA_GROUPS and re-render pickers
const _origOpenAddGroup=typeof openAddGroup==='function'?openAddGroup:null;
function refreshPickersFromTree(){
  // Re-read tree DOM to build updated groups list (simple: just add new leaf nodes)
  const allNodes=document.querySelectorAll('#hoa-tree .hoa-node');
  HOA_GROUPS.length=0;
  // Parse top-level children of root
  const rootChildren=document.querySelectorAll('[data-id="root"] > .hoa-children > .hoa-node');
  rootChildren.forEach(node=>{
    const id=node.dataset.id;const depth=parseInt(node.dataset.depth||1);
    const label=node.querySelector('.hoa-node-name')?.textContent||id;
    const childNodes=node.querySelectorAll(':scope > .hoa-children > .hoa-node');
    const children=[...childNodes].map(ch=>({id:ch.dataset.id,label:ch.querySelector('.hoa-node-name')?.textContent||ch.dataset.id,depth:parseInt(ch.dataset.depth||2),children:[]}));
    HOA_GROUPS.push({id,label,depth,children});
  });
  bpRender('bp-groups-admin',HOA_GROUPS,'bp-all');
  bpRender('bp-groups-leader',HOA_GROUPS,'bp-leader-all');
}

/* ════════════════════════════════
   BOOKING / REQUEST CONFIRMATION
════════════════════════════════ */
let _bconfOnProceed=null;

function bconfOpen({ic,title,sub,rows,nextStep,onProceed}){
  document.getElementById('bconf-ic').textContent=ic;
  document.getElementById('bconf-title').textContent=title;
  document.getElementById('bconf-sub').textContent=sub||'Please review your details before submitting';
  if(nextStep)document.getElementById('bconf-next-step').textContent=nextStep;
  // Build summary rows
  const rc=document.getElementById('bconf-rows');
  rc.innerHTML=rows.map(r=>`<div class="bconf-row"><div class="bconf-row-ic">${r.ic}</div><div class="bconf-row-b"><div class="bconf-row-lbl">${r.label}</div><div class="bconf-row-val">${r.value}</div></div></div>`).join('');
  // Simple mode notice
  const sn=document.getElementById('bconf-simple-notice');
  sn.style.display=isSimpleMode()?'flex':'none';
  _bconfOnProceed=onProceed;
  document.getElementById('bconf-overlay').classList.add('on');
  window.scrollTo(0,0);
}
function bconfClose(){
  document.getElementById('bconf-overlay').classList.remove('on');
  _bconfOnProceed=null;
}
function bconfProceed(){
  document.getElementById('bconf-overlay').classList.remove('on');
  if(_bconfOnProceed)_bconfOnProceed();
  _bconfOnProceed=null;
}

/* ── TRIKE BOOKING ── */
function submitBooking(){
  const dateEl=document.querySelector('#rd-book .dc.on');
  const slotEl=document.querySelector('#rd-book .slot.on:not(.taken)');
  if(!dateEl){toast('⚠️','Select a Date','Please choose a date before continuing.');return;}
  if(!slotEl){toast('⚠️','Select a Time Slot','Please choose an available time slot.');return;}
  const day=dateEl.querySelector('.dc-d').textContent;
  const num=dateEl.querySelector('.dc-n').textContent;
  const slot=slotEl.textContent;
  const simpleTag=isSimpleMode()?' · Simple Mode':''
  bconfOpen({
    ic:'🛺',
    title:'Confirm Tricycle Booking',
    rows:[
      {ic:'👤',label:'Resident',value:'Jose Reyes — Unit 12B, Block 7'},
      {ic:'📅',label:'Date',value:`${day}, April ${num}, 2026`},
      {ic:'🕐',label:'Time Slot',value:slot},
      {ic:'📍',label:'Service',value:'Tricycle / E-Trike — Sunset Village HOA'},
    ],
    nextStep:'You will receive an SMS once TODA confirms your booking',
    onProceed:()=>{
      const smsTag=isSimpleMode()?'\n\n⚠️ Submitted via Simple Mode — please call resident to confirm.':'';
      toast('🎉','Booking Submitted!',`Your tricycle booking for ${day} April ${num} at ${slot} has been sent to TODA for approval.`,
        `CasaConnect: Trike booking ${day} Apr ${num}, ${slot} from Jose Reyes${simpleTag}.${smsTag}`);
      rCloseDetail();
    }
  });
}

function submitBookingFor(type){
  const cfg={
    pool:{ic:'🏊',label:'Pool / Clubhouse',nextStep:'HOA staff will confirm your slot via SMS'},
    hall:{ic:'🏟️',label:'Function Hall',nextStep:'HOA Admin will contact you to arrange the deposit and confirm'}
  }[type];
  const pageId='rd-'+type;
  const dateEl=document.querySelector('#'+pageId+' .dc.on');
  const slotEl=document.querySelector('#'+pageId+' .slot.on:not(.taken)');
  if(!dateEl){toast('⚠️','Select a Date','Please choose a date before continuing.');return;}
  if(!slotEl){toast('⚠️','Select a Slot','Please choose an available slot.');return;}
  const day=dateEl.querySelector('.dc-d').textContent;
  const num=dateEl.querySelector('.dc-n').textContent;
  const slot=slotEl.textContent;
  const smsTag=isSimpleMode()?'\n\n⚠️ Submitted via Simple Mode — please call resident to confirm.':'';
  bconfOpen({
    ic:cfg.ic,
    title:`Confirm ${cfg.label} Booking`,
    rows:[
      {ic:'👤',label:'Resident',value:'Jose Reyes — Unit 12B, Block 7'},
      {ic:'📅',label:'Date',value:`${day}, April ${num}, 2026`},
      {ic:'🕐',label:'Slot',value:slot},
      {ic:'📍',label:'Facility',value:cfg.label+' — Sunset Village HOA'},
    ],
    nextStep:cfg.nextStep,
    onProceed:()=>{
      toast('🎉','Booking Submitted!',`Your ${cfg.label} booking for ${day} April ${num} (${slot}) has been submitted.`,
        `CasaConnect: ${cfg.label} booking ${day} Apr ${num} from Jose Reyes.${smsTag}`);
      rCloseDetail();
    }
  });
}

function submitFormRequest(){
  const f=FORMS[S.currentForm];if(!f)return;
  const vals={};
  f.fields.forEach(fld=>{const el=document.getElementById(fld.id);if(el)vals[fld.id]=el.value||'[Not provided]';});
  // Build summary rows from first 3 filled fields
  const rows=f.fields.slice(0,4).map(fld=>({
    ic:'📋',
    label:fld.l,
    value:vals[fld.id]||'—'
  }));
  rows.unshift({ic:'👤',label:'Submitted By',value:'Jose Reyes — Unit 12B, Block 7'});
  const smsTag=isSimpleMode()?'\n\n⚠️ Submitted via Simple Mode — please call resident to confirm.':'';
  bconfOpen({
    ic:'📄',
    title:`Confirm: ${f.title}`,
    sub:'Please review before submitting to HOA Admin',
    rows,
    nextStep:'HOA Admin will review and contact you within 24–48 hours',
    onProceed:()=>{
      toast('📲','Submitted to HOA!',`Your ${f.title} has been sent to HOA Admin for review. They will contact you within 24–48 hours.`,
        `CasaConnect: New request — ${f.title} from Jose Reyes, Unit 12B.${smsTag}`);
    }
  });
}
