'use strict';
// Datos ficticios usados exclusivamente para el parcial.
const courts = [
  {id:'patagonia',sport:'futbol',name:'Cancha Patagonia 1',description:'Fútbol 5 · Césped sintético',surface:'sintetico',price:18000,deposit:5000,type:'Fútbol 5',icon:'⚽'},
  {id:'glaciares',sport:'futbol',name:'Cancha Glaciares',description:'Fútbol 7 · Césped sintético',surface:'sintetico',price:24000,deposit:7000,type:'Fútbol 7',icon:'⚽'},
  {id:'indoor',sport:'futbol',name:'Cancha Austral Indoor',description:'Fútbol 5 · Techada',surface:'techada',price:21000,deposit:6000,type:'Fútbol 5',icon:'⚽'},
  {id:'padel1',sport:'padel',name:'Pádel Austral 1',description:'Pádel · Cancha techada',surface:'techada',price:16000,deposit:4500,type:'Pádel',icon:'🎾'},
  {id:'padel2',sport:'padel',name:'Pádel Patagonia',description:'Pádel · Cancha techada',surface:'techada',price:17000,deposit:5000,type:'Pádel',icon:'🎾'},
  {id:'basquet1',sport:'basquet',name:'Básquet Indoor',description:'Básquet · Cancha techada',surface:'techada',price:20000,deposit:6000,type:'Básquet',icon:'🏀'},
  {id:'natural',sport:'futbol',name:'Cancha Fueguina',description:'Fútbol 11 · Césped natural',surface:'natural',price:36000,deposit:10000,type:'Fútbol 11',icon:'⚽'}
];
const $ = s=>document.querySelector(s);
const $$ = s=>[...document.querySelectorAll(s)];
const money = n=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
const state={court:null,date:'',time:null,number:''};
function localToday(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function formatDate(date){if(!date)return '—';const [y,m,d]=date.split('-').map(Number);return new Intl.DateTimeFormat('es-AR',{weekday:'short',day:'numeric',month:'short',year:'numeric'}).format(new Date(y,m-1,d))}
function notify(message,warning=false){const e=$('#notice');e.hidden=false;e.textContent=message;e.classList.toggle('warning',warning);e.scrollIntoView({behavior:'smooth',block:'nearest'});}
function clearNotify(){$('#notice').hidden=true;}
function show(id){if(!document.getElementById(id))id='inicio';if(id==='horarios'&&!state.court)id='canchas';if(id==='confirmacion'&&!state.time)id='horarios';if(id==='comprobante'&&!state.number)id='inicio';$$('.view').forEach(v=>v.hidden=v.id!==id);clearNotify();history.replaceState({},'',`#${id}`);window.scrollTo({top:0,behavior:'instant'});}
function renderCourts(){const sport=$('input[name="sport"]:checked').value;const surface=$('#surface').value;const filtered=courts.filter(c=>c.sport===sport&&(surface==='todos'||surface===c.surface));$('#result-count').textContent=`${filtered.length} ${filtered.length===1?'cancha disponible':'canchas disponibles'}`;$('#match-pill').textContent=`${filtered.length} opciones`;$('#empty-results').hidden=filtered.length>0;$('#court-results').replaceChildren(...filtered.map(c=>{const el=document.createElement('article');el.className='card court';el.innerHTML=`<div class="court-top"><h3></h3><span class="pill">Ver turnos</span></div><p></p><div class="price"></div><button class="btn secondary full" type="button">Ver horarios →</button>`;el.querySelector('h3').textContent=`${c.icon} ${c.name}`;el.querySelector('p').textContent=c.description;el.querySelector('.price').textContent=money(c.price)+' / hora';el.querySelector('button').addEventListener('click',()=>selectCourt(c.id));return el;}));}
function selectCourt(id){state.court=courts.find(c=>c.id===id);state.date=$('#date').value;state.time=null;$('#selected-court-title').textContent=state.court.name;$('#selected-court-info').textContent=state.court.description;$('#selected-date').textContent=formatDate(state.date);renderSlots();show('horarios');}
function slotStatus(hour){const index=Number(hour.slice(0,2));if(index===17||index===23)return 'busy';if(index===21||index===0)return 'closed';return 'free';}
function renderSlots(){const grid=$('#time-grid');grid.replaceChildren();for(const hour of ['16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','00:00']){const status=slotStatus(hour);const btn=document.createElement('button');btn.type='button';btn.className=`slot ${status}${state.time===hour?' active':''}`;btn.disabled=status!=='free';btn.setAttribute('aria-pressed',state.time===hour?'true':'false');btn.innerHTML=`<strong>${hour}</strong><small>${status==='busy'?'Reservado':status==='closed'?'No disponible':state.time===hour?'Seleccionado':'Disponible'}</small>`;if(status==='free')btn.addEventListener('click',()=>{state.time=hour;renderSlots();updateSummary();});grid.append(btn);}updateSummary();}
function updateSummary(){const c=state.court;$('#summary-court').textContent=c?.name||'—';$('#summary-date').textContent=formatDate(state.date);$('#summary-time').textContent=state.time?`${state.time}–${nextHour(state.time)}`:'Elegí un horario';$('#summary-total').textContent=c?money(c.price):'—';$('#to-checkout').disabled=!state.time;}
function nextHour(time){const hour=(Number(time.split(':')[0])+1)%24;return `${String(hour).padStart(2,'0')}:00`}
function summaryLine(label,value){const row=document.createElement('div');row.className='summary-line';const a=document.createElement('span');a.textContent=label;const b=document.createElement('strong');b.textContent=value;row.append(a,b);return row;}
function checkout(){const c=state.court;const wrapper=$('#checkout-summary');wrapper.replaceChildren(summaryLine('Cancha',c.name),summaryLine('Deporte',c.type),summaryLine('Fecha',formatDate(state.date)),summaryLine('Horario',`${state.time}–${nextHour(state.time)}`),summaryLine('Precio total',money(c.price)),summaryLine('Seña de ejemplo',money(c.deposit)),summaryLine('Saldo al llegar',money(c.price-c.deposit)));show('confirmacion');}
function clearErrors(){$$('.error').forEach(e=>{e.hidden=true;e.textContent=''});$$('#checkout-form input').forEach(i=>i.removeAttribute('aria-invalid'));}
function validation(){clearErrors();let first=null;function fail(id,msg){const f=$('#'+id),e=$('#'+(id==='fullName'?'name-error':id+'-error'));f.setAttribute('aria-invalid','true');e.hidden=false;e.textContent=msg;first??=f;}
 const name=$('#fullName').value.trim(), email=$('#email').value.trim(), phone=$('#phone').value.replace(/[\s()+-]/g,'');
 if(name.length<3)fail('fullName','Ingresá tu nombre y apellido (mínimo 3 caracteres).');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))fail('email','Ingresá un correo válido, por ejemplo usuario@dominio.com.');
 if(!/^\d{8,15}$/.test(phone))fail('phone','Ingresá entre 8 y 15 dígitos.');
 if(!$('#terms').checked){const t=$('#terms-error');t.hidden=false;t.textContent='Debés aceptar las reglas antes de confirmar.';first??=$('#terms');}
 if(first){notify('Revisá los campos marcados y corregí los errores.',true);first.focus();return false}return true;
}
function finish(){state.number='#AS-'+String(2000+Math.floor(Math.random()*7000));$('#booking-number').textContent=state.number;$('#ticket-details').replaceChildren(summaryLine('Cancha',state.court.name),summaryLine('Deporte',state.court.type),summaryLine('Fecha',formatDate(state.date)),summaryLine('Horario',`${state.time}–${nextHour(state.time)}`),summaryLine('Seña prevista (simulada)',money(state.court.deposit)),summaryLine('Saldo estimado al llegar',money(state.court.price-state.court.deposit)));$('#payment-amount').textContent=money(state.court.deposit);show('comprobante');}
function init(){const today=localToday();$('#date').min=today;$('#date').value=today;renderCourts();$$('[data-view]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();show(el.dataset.view);}));$('#filters').addEventListener('submit',e=>{e.preventDefault();renderCourts();notify('Resultados actualizados según tus filtros.');});$('#to-checkout').addEventListener('click',checkout);$('#checkout-form').addEventListener('submit',e=>{e.preventDefault();if(validation())finish();});$('#print-ticket').addEventListener('click',()=>window.print());
 const copyData=$('#copy-payment-details');
 copyData.addEventListener('click',async()=>{
   const text=`AUSTRAL SPORTS — DATOS FICTICIOS (NO PAGAR)\nAlias de demostración: ${$('#payment-alias').textContent}\nWhatsApp de demostración: ${$('#payment-phone').textContent}\nSeña de ejemplo: ${$('#payment-amount').textContent}`;
   try { await navigator.clipboard.writeText(text); notify('Datos ficticios copiados. No transferir dinero.'); }
   catch { notify('No se pudo copiar automáticamente. Seleccioná los datos de ejemplo para copiarlos.',true); }
 });$('#book-again').addEventListener('click',()=>{state.time=null;state.number='';clearErrors();$('#checkout-form').reset();show('canchas');});$('#show-rules').addEventListener('click',e=>{e.preventDefault();$('#reglas').scrollIntoView({behavior:'smooth'});});const route=location.hash.slice(1);if(route&&['inicio','canchas','horarios','confirmacion','comprobante'].includes(route))show(route);else show('inicio');}
document.addEventListener('DOMContentLoaded',init);
