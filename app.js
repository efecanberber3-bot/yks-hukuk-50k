const KEY='hukuk50k-os-v20';
const LEGACY_KEYS=['hukuk50k-os-v19','hukuk50k-os-v15','hukuk50k-os-v14','hukuk50k-os-v13','hukuk50k-os-v12','hukuk50k-os-v8','hukuk50k-os-v7','hukuk50k-os-v6','hukuk50k-os-v5','hukuk50k-os-v3'];
const START='2026-09-07';
const DEFAULT_EXAM='2027-06-20';
const LAW_STRETCH_RANK=30000, LAW_MIN_RANK=50000, BASE_SALARY=15000;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clone=o=>JSON.parse(JSON.stringify(o));
const pad=n=>String(n).padStart(2,'0');
const dateKey=d=>{const x=d instanceof Date?d:new Date(d);return `${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}`};
const today=()=>dateKey(new Date());
const addDays=(k,n)=>{const d=new Date(k+'T12:00:00');d.setDate(d.getDate()+n);return dateKey(d)};
const daysBetween=(a,b)=>Math.max(0,Math.ceil((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/86400000));
const fmtDate=k=>new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'short'}).format(new Date(k+'T12:00:00'));
const longDate=k=>new Intl.DateTimeFormat('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(k+'T12:00:00'));
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const uid=p=>`${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`;
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const curriculum={
 'TYT Türkçe':['Sözcükte Anlam','Cümlede Anlam','Paragraf','Ses Bilgisi','Yazım Kuralları','Noktalama İşaretleri','Sözcük Türleri','Fiiller','Cümlenin Ögeleri','Cümle Türleri','Anlatım Bozukluğu'],
 'TYT Matematik':['Temel Kavramlar','Sayı Basamakları','Bölme-Bölünebilme','EBOB-EKOK','Rasyonel Sayılar','Üslü Sayılar','Köklü Sayılar','Mutlak Değer','Basit Eşitsizlikler','Oran-Orantı','Denklem Çözme','Problemler','Kümeler','Fonksiyonlar','Permütasyon-Kombinasyon','Olasılık','Veri-İstatistik'],
 'TYT Geometri':['Doğruda Açılar','Üçgende Açılar','Üçgende Uzunluk','Üçgende Alan','Benzerlik','Çokgenler','Dörtgenler','Çember-Daire','Katı Cisimler','Analitik Geometri'],
 'TYT Sosyal':['Tarih Bilimine Giriş','İlk Türk Devletleri','İslam Tarihi','Osmanlı Siyasi Tarihi','Milli Mücadele','Atatürk İlkeleri','Coğrafyanın Temelleri','Türkiye Coğrafyası','Felsefeye Giriş','Din Kültürü Temelleri'],
 'TYT Fen':['Fizik Temelleri','Hareket-Kuvvet','İş-Güç-Enerji','Elektrik','Kimyanın Temelleri','Atom ve Periyodik Sistem','Kimyasal Türler','Maddenin Halleri','Biyoloji Bilimine Giriş','Hücre','Kalıtım'],
 'AYT Matematik':['Fonksiyonlar','Polinomlar','İkinci Dereceden Denklemler','Parabol','Eşitsizlikler','Trigonometri','Üstel ve Logaritmik Fonksiyonlar','Diziler','Permütasyon-Kombinasyon','Olasılık','Limit ve Süreklilik','Türev','İntegral','Analitik Geometri'],
 'AYT Edebiyat':['Edebiyat Bilgisi','Şiir Bilgisi','İslamiyet Öncesi Türk Edebiyatı','Geçiş Dönemi','Halk Edebiyatı','Divan Edebiyatı','Tanzimat','Servetifünun','Fecriati','Milli Edebiyat','Cumhuriyet Dönemi','Şiir Akımları','Roman-Hikâye','Tiyatro','Edebi Sanatlar'],
 'AYT Tarih-1':['Tarih ve Zaman','İlk ve Orta Çağlarda Türk Dünyası','Osmanlı Siyasi Tarihi','Osmanlı Kültür ve Medeniyeti','18-19. Yüzyıl Osmanlı','Milli Mücadele','Atatürk Dönemi İç ve Dış Politika'],
 'AYT Coğrafya-1':['Doğal Sistemler','Beşeri Sistemler','Ekonomik Faaliyetler','Türkiye Coğrafyası','Küresel Ortam','Çevre ve Toplum']
};
const priorityWeight={'AYT Matematik':1.45,'TYT Matematik':1.25,'AYT Edebiyat':1.12,'AYT Tarih-1':1.05,'AYT Coğrafya-1':1.0,'TYT Türkçe':1.08,'TYT Geometri':0.95,'TYT Sosyal':0.85,'TYT Fen':0.78};
const areaOf=n=>n.startsWith('TYT')?'TYT':'AYT';
const habitDefs=[['sleep','7+ saat uyku','Temel enerji'],['study','Ders hedefi','Net çalışma'],['phone','Sosyal medya ≤45 dk','Odak'],['exercise','Antrenman / yürüyüş','Fizik'],['eb','EB Digital 60 dk','Ek gelir']];
const schedule=[['08:30','10:30','TYT / Matematik','120 dk • ana blok','TYT'],['10:45','12:15','Türkçe / AYT Edebiyat','90 dk • aktif çalışma','EA'],['12:15','12:45','Paragraf + Problem','30 dk • günlük taban','Taban'],['13:30','14:30','EB Digital Studio','60 dk • para motoru','Para'],['15:00','15:30','Mini tekrar','30 dk • yanlışlar / kartlar','Tekrar']];
const baseTasks=()=>[
 {title:'TYT Matematik • 120 dk',category:'TYT',minutes:120,kind:'study'},
 {title:'Türkçe • paragraf + yanlış analizi',category:'TYT',minutes:45,kind:'study'},
 {title:'AYT Edebiyat • 60 dk',category:'AYT',minutes:60,kind:'study'},
 {title:'Problem • 15 soru',category:'Tekrar',minutes:30,kind:'study'},
 {title:'EB Digital Studio • müşteri / portföy',category:'EB Digital',minutes:60,kind:'work'},
 {title:'Antrenman',category:'Spor',minutes:60,kind:'life'}
];
const defaultState={version:20,days:{},subjects:{},mocks:[],mistakes:[],money:[],sessions:[],weekly:[],settings:{studyGoal:270,questionGoal:350,paragraphGoal:20,problemGoal:15,examDate:DEFAULT_EXAM,targetRank:30000,minRank:50000},theme:'dark',accentTheme:'lime',focusSessions:0,assistant:{lastPlanDate:'',lastPlanSignature:''}};
let state=load();
function migrate(x){const y=clone(x||{});y.days??={};y.subjects??={};y.mocks??=[];y.mistakes??=[];y.money??=[];y.sessions??=[];y.weekly??=[];y.focusSessions??=0;y.theme??='dark';y.accentTheme??='lime';y.assistant??={lastPlanDate:'',lastPlanSignature:''};y.settings={...defaultState.settings,...(y.settings||{})};y.version=20;for(const d of Object.values(y.days)){d.tasks??=[];d.habits??={};d.studyMinutes??=0;d.questions??=0;d.note??='';}return y}
function load(){
 try{
  const raw=localStorage.getItem(KEY);
  let base=raw?migrate(JSON.parse(raw)):null;
  if(!base){for(const k of LEGACY_KEYS){const raw2=localStorage.getItem(k);if(raw2){base=migrate(JSON.parse(raw2));break}}}
  base??=clone(defaultState);
  const savedTheme=localStorage.getItem('hukuk50k-theme');
  const savedAccent=localStorage.getItem('hukuk50k-accent');
  if(savedTheme==='dark'||savedTheme==='light') base.theme=savedTheme;
  if(savedAccent&&accentThemes[savedAccent]) base.accentTheme=savedAccent;
  return base;
 }catch{return clone(defaultState)}
}
function normalize(x){return migrate(x)}
function save(){localStorage.setItem(KEY,JSON.stringify(state));document.dispatchEvent(new CustomEvent('hukuk50k:changed'))}
function makeBaseTasks(){return baseTasks().map(t=>({...t,id:uid('task'),done:false,source:'base'}))}
function ensureDay(k=today()){
 if(!state.days[k])state.days[k]={tasks:makeBaseTasks(),habits:Object.fromEntries(habitDefs.map(x=>[x[0],false])),studyMinutes:0,questions:0,note:'',phoneMinutes:0,closed:false,focusMinutes:0,questionBreakdown:{paragraph:0,problem:0}};
 const d=state.days[k];d.habits??={};d.tasks??=[];d.studyMinutes??=0;d.questions??=0;d.note??='';d.phoneMinutes??=0;d.closed??=false;d.focusMinutes??=0;d.questionBreakdown??={paragraph:0,problem:0};
 const hasRealTasks=d.tasks.length>0;
 if(!hasRealTasks && !d.closed) d.tasks=makeBaseTasks();
 else if(hasRealTasks && d.tasks.length<baseTasks().length){
   const titles=new Set(d.tasks.map(t=>t.title));
   baseTasks().forEach(t=>{if(!titles.has(t.title))d.tasks.push({...t,id:uid('task'),done:false,source:'base'})});
 }
 return d;
}
function taskPct(d){return d.tasks.length?Math.round(d.tasks.filter(t=>t.done).length/d.tasks.length*100):0}
function studyMinutes(d){return d.tasks.filter(t=>t.done&&['study','review'].includes(t.kind)).reduce((a,t)=>a+(Number(t.minutes)||0),0)+Number(d.studyMinutes||0)}
function realStudyMinutes(d){return Number(d?.studyMinutes||0)+Number(d?.focusMinutes||0)}
function habitScore(d){return habitDefs.filter(([k])=>d.habits?.[k]).length}
function systemScore(d){return Math.round(taskPct(d)*.5+(habitScore(d)/habitDefs.length*100)*.25+(Math.min(100,studyMinutes(d)/state.settings.studyGoal*100)*.25))}
function streak(){let n=0,k=today();for(let i=0;i<90;i++){const d=state.days[k];if(!d||systemScore(d)<70)break;n++;k=addDays(k,-1)}return n}
function allSubjects(){return Object.entries(curriculum)}
function topicStats(){let total=0,done=0,active=0,review=0;allSubjects().forEach(([name,topics])=>topics.forEach((_,i)=>{total++;const s=stateTopic(name,i);if(s.status==='done')done++;if(['learning','practice','review'].includes(s.status))active++;if(isDue(s))review++}));return {total,done,active,review,pct:total?Math.round(done/total*100):0}}
function stateTopic(name,i){const raw=state.subjects[name]?.[i];if(typeof raw==='string')return {status:raw,confidence:0,last:'',next:''};return raw||{status:'not_started',confidence:0,last:'',next:'',attempts:0,correct:0,wrong:0,studyMinutesTotal:0,sessionCount:0,note:'',lastNote:'',lastScore:null}}
function isDue(s){return s.next && s.next<=today()}
function latestMocks(type){return state.mocks.filter(m=>!type||m.type===type).slice().sort((a,b)=>a.date.localeCompare(b.date))}
function lastStudyDays(n){const out=[];for(let i=n-1;i>=0;i--){const k=addDays(today(),-i),d=state.days[k];out.push({k,d,mins:d?studyMinutes(d):0,score:d?systemScore(d):0,questions:d?.questions||0})}return out}
function recentMockTrend(type){const arr=latestMocks(type).slice(-3);if(arr.length<2)return 0;const first=arr[0].net,last=arr[arr.length-1].net;return Number((last-first).toFixed(2))}
function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),2200)}
const accentThemes={lime:['#b7ff5a','#63e6be'],ocean:['#5ddcff','#60a5fa'],violet:['#b49cff','#f0abfc'],rose:['#ff7aa8','#fda4af'],amber:['#ffc857','#fb923c'],cyan:['#4de4ff','#22d3ee'],red:['#ff6b6b','#f97316']};
function applyTheme(){
 document.documentElement.dataset.theme=state.theme==='light'?'light':'dark';
 document.documentElement.dataset.accent=state.accentTheme||'lime';
 const btn=$('#themeBtn');
 if(btn){btn.textContent=state.theme==='dark'?'☼':'☾';btn.title=state.theme==='dark'?'Açık temaya geç':'Koyu temaya geç';btn.setAttribute('aria-label',btn.title)}
 $$('.accent-option').forEach(x=>x.classList.toggle('selected',x.dataset.accent===(state.accentTheme||'lime')));
 const cur=accentThemes[state.accentTheme]||accentThemes.lime;
 document.documentElement.style.setProperty('--accent',cur[0]);
 document.documentElement.style.setProperty('--accent2',cur[1]);
 localStorage.setItem('hukuk50k-theme',state.theme);
 localStorage.setItem('hukuk50k-accent',state.accentTheme||'lime');
}
const iconPaths={
 dashboard:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-5h5v5"/>',
 today:'<path d="m5 12 4 4 10-10"/><circle cx="12" cy="12" r="9"/>',
 focus:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
 roadmap:'<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v18H7.5A3.5 3.5 0 0 0 4 23V5.5Z"/><path d="M4 5.5V20M8 6h8M8 10h7M8 14h5"/>',
 mock:'<path d="M5 20V9M12 20V4M19 20v-7"/><path d="M3 20h18"/>',
 mistakes:'<path d="M12 3 21 19H3L12 3Z"/><path d="M12 9v4"/><path d="M12 16h.01"/>',
 analytics:'<path d="M4 19V5M4 19h16"/><path d="m7 15 3-3 3 2 5-6"/>',
 discipline:'<path d="m12 3 2.1 4.2 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7L12 3Z"/>',
 finance:'<path d="M4 7h16v12H4z"/><path d="M4 10h16"/><path d="M8 15h3"/><path d="M15 14h.01"/>',
 settings:'<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="m19.4 15 .1 1.8-2 1.1-1.5-1a8 8 0 0 1-2.1 1l-.5 1.7h-2.8L10 17.9a8 8 0 0 1-2.1-1l-1.5 1-2-1.1.1-1.8a8 8 0 0 1-1.1-2l-1.6-.5v-2.8l1.6-.5a8 8 0 0 1 1.1-2L4.4 5l2-1.1 1.5 1a8 8 0 0 1 2.1-1l.5-1.7h2.8l.5 1.7a8 8 0 0 1 2.1 1l1.5-1 2 1.1-.1 1.8a8 8 0 0 1 1.1 2l1.6.5v2.8l-1.6.5a8 8 0 0 1-1.1 2Z"/>',
};
function renderNavIcons(){
 $$('.nav-item[data-view]').forEach(btn=>{const ico=btn.querySelector('.ico');if(!ico)return;const key=btn.dataset.view;if(iconPaths[key])ico.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[key]}</svg>`;});
}
function navigate(view){$$('.view').forEach(v=>v.classList.toggle('active',v.id===view));$$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===view));const titles={dashboard:'Kontrol Merkezi',today:'Bugünün Sistemi',focus:'Focus Room',roadmap:'Konu Motoru',mock:'Deneme Merkezi',analytics:'Performans',discipline:'Disiplin Merkezi',finance:'Para Motoru',mistakes:'Hata Günlüğü',settings:'Ayarlar'};$('#pageTitle').textContent=titles[view]||'Kontrol Merkezi';$('#contextLabel').textContent=view==='dashboard'?'HUKUK 50K • COMMAND CENTER':longDate(today()).toUpperCase();window.scrollTo({top:0,behavior:'smooth'});setTimeout(renderNavIcons,0)}
function daysToExam(){return daysBetween(today(),state.settings.examDate)}
function readiness(){
 const ty=latestMocks('TYT'), ay=latestMocks('AYT EA');
 const mocks=[...ty,...ay];
 const stats=topicStats();
 const studyDays=lastStudyDays(14).filter(x=>x.mins>0).length;
 // A new account should not look like it has a 0/100 performance score.
 // Until there is at least one real mock OR meaningful topic/study data, show a collection state instead.
 if(!mocks.length && stats.total===0 && studyDays===0) return null;
 const t=ty.at(-1)?.net||0,a=ay.at(-1)?.net||0;
 const tBase=50,aBase=30;
 const progress=Math.min(100,(t/tBase)*52+(a/aBase)*48);
 const consistency=Math.min(100,studyDays/10*100);
 const topics=stats.pct;
 return Math.round(progress*.5+consistency*.25+topics*.25);
}
function readinessDisplay(){
 const value=readiness();
 if(value===null) return {value:null,label:'VERİ TOPLANIYOR',sub:'İlk başlangıç verilerini oluşturalım.'};
 return {value,label:`${value}/100`,sub:'İç performans göstergesi'};
}
function weaknessDetails(){
 const arr=[];
 allSubjects().forEach(([name,topics])=>{
  const stats=topics.map((topic,i)=>stateTopic(name,i));
  const done=stats.filter(x=>x.status==='done').length;
  const active=stats.filter(x=>x.status!=='not_started').length;
  const avg=stats.reduce((a,x)=>a+(Number(x.confidence)||0),0)/(stats.length||1);
  const overdue=stats.filter(isDue).length;
  const attempts=stats.reduce((a,x)=>a+(Number(x.attempts)||0),0);
  const correct=stats.reduce((a,x)=>a+(Number(x.correct)||0),0);
  const wrong=stats.reduce((a,x)=>a+(Number(x.wrong)||0),0);
  const answered=correct+wrong;
  const accuracy=answered?correct/answered:0;
  const completion=done/(stats.length||1);
  const activity=active/(stats.length||1);
  const confidence=avg/5;
  const accuracyScore=answered?accuracy:0.55;
  const trend=(name.startsWith('TYT')?recentMockTrend('TYT'):recentMockTrend('AYT EA'));
  const trendPenalty=Math.max(0,-trend)*1.8;
  const stale=stats.filter(x=>x.last&&daysBetween(x.last,today())>=14&&x.status!=='done').length;
  const overdueRatio=overdue/(stats.length||1);

  // Health: 0 = kırmızı risk, 100 = güçlü alan.
  const healthBase=completion*.38+activity*.10+confidence*.20+accuracyScore*.18+(1-overdueRatio)*.08;
  const health=clamp(Math.round(healthBase*100-trendPenalty-stale*1.5),0,100);
  const urgency=clamp(Math.round((100-health)*.80+priorityWeight[name]*14+overdueRatio*24),0,100);
  const keySignals=[];
  if(done===0) keySignals.push('Henüz konu tamamlanmadı');
  else if(done<Math.ceil(stats.length*.25)) keySignals.push(`Kapsama düşük: ${done}/${stats.length}`);
  if(avg<2.5) keySignals.push(`Güven düşük: ${avg.toFixed(1)}/5`);
  if(overdue) keySignals.push(`${overdue} gecikmiş tekrar`);
  if(stale) keySignals.push(`${stale} bayat konu`);
  if(answered && accuracy<.60) keySignals.push(`Soru başarısı %${Math.round(accuracy*100)}`);
  if(trend<0) keySignals.push(`Son denemede ${Math.abs(trend).toFixed(1)} net düşüş`);
  if(!keySignals.length) keySignals.push('Düşük risk / dengeli alan');
  arr.push({label:name,name,area:areaOf(name),health,urgency,done,active,total:stats.length,avg,overdue,accuracy,attempts,correct,wrong,stale,trend,keySignals});
 });
 return arr.sort((a,b)=>b.urgency-a.urgency);
}
function weakTopicDetails(){
 const rows=[];
 allSubjects().forEach(([name,topics])=>topics.forEach((topic,i)=>{
  const s=stateTopic(name,i);if(s.status==='done'&&s.confidence>=4&&!isDue(s))return;
  const confidence=Number(s.confidence)||0;const overdue=isDue(s)?20:0;const age=s.last?clamp(Math.round(daysBetween(s.last,today())*2),0,20):18;const statusBoost=s.status==='not_started'?22:s.status==='learning'?15:s.status==='practice'?10:s.status==='review'?12:5;
  const score=clamp(Math.round((5-confidence)*12+overdue+age+statusBoost*priorityWeight[name]),0,100);
  rows.push({name,i,topic,score,status:s.status,confidence,next:s.next,last:s.last});
 }));
 return rows.sort((a,b)=>b.score-a.score);
}
function adaptivePlan(){
 const d=ensureDay(), target=Number(state.settings.studyGoal)||270;
 const used= d.tasks.filter(t=>t.done&&['study','review'].includes(t.kind)).reduce((a,t)=>a+(Number(t.minutes)||0),0);
 const remaining=Math.max(0,target-used);
 const dueTopics=weakTopicDetails().filter(x=>x.next&&x.next<=today()).slice(0,2);
 const weak=weakTopicDetails().filter(x=>!dueTopics.includes(x)).slice(0,4);
 const plan=[];
 dueTopics.forEach(x=>plan.push({title:`Tekrar • ${x.topic}`,category:'Tekrar',minutes:30,reason:'Gecikmiş tekrar',topic:x.topic}));
 let rem=Math.max(0,remaining-dueTopics.length*30);
 const add=(title,category,minutes,reason,topic='')=>{if(rem<=0)return;const m=Math.min(minutes,rem);if(m>=20){plan.push({title:`AI • ${title}`,category,minutes:m,reason,topic});rem-=m}};
 weak.filter(x=>x.name==='AYT Matematik').slice(0,1).forEach(x=>add(`${x.topic} • AYT Matematik`,'AYT',60,'Yüksek öncelik / EA',x.topic));
 weak.filter(x=>x.name==='TYT Matematik').slice(0,1).forEach(x=>add(`${x.topic} • TYT Matematik`,'TYT',50,'TYT temel güçlendirme',x.topic));
 weak.filter(x=>x.name==='AYT Edebiyat').slice(0,1).forEach(x=>add(`${x.topic} • Edebiyat`,'AYT',45,'Hatırlama + aktif tekrar',x.topic));
 weak.filter(x=>x.area==='AYT'&&!['AYT Matematik','AYT Edebiyat'].includes(x.name)).slice(0,1).forEach(x=>add(`${x.topic} • ${x.name.replace('AYT ','')}`,'AYT',35,'AYT yan alan dengesi',x.topic));
 if(rem>0)add('Paragraf + hata analizi','TYT',30,'Günlük taban');
 const recent7=lastStudyDays(7).reduce((a,x)=>a+x.mins,0);
 return {plan,remaining,used,recent7,reviews:dueTopics,weak,capacity:target};
}
function subjectReason(w){
 const reasons=[];
 if(w.done===0) reasons.push(`Henüz ${w.total} konunun hiçbiri tamamlanmadı.`);
 else if(w.done<w.total) reasons.push(`${w.done}/${w.total} konu tamam; kapsamın ${Math.round(w.done/w.total*100)}%.`);
 if(w.avg<2.5) reasons.push(`Ortalama güven seviyesi ${w.avg.toFixed(1)}/5.`);
 if(w.overdue) reasons.push(`${w.overdue} konuda tekrar tarihi geçti.`);
 if(w.stale) reasons.push(`${w.stale} konu 14+ gündür dokunulmadan kaldı.`);
 if(w.attempts && w.accuracy<.60) reasons.push(`Kayıtlı soru başarısı %${Math.round(w.accuracy*100)}.`);
 if(w.trend<0) reasons.push(`Son üç denemede trend ${w.trend.toFixed(1)} net.`);
 return reasons.length?reasons:['Şimdilik kritik bir sinyal yok; alanı koruma modunda tut.'];
}
function recommendedAction(w){
 const first=(weakTopicDetails().find(x=>x.name===w.name)||weakTopicDetails()[0]);
 const q=w.name==='AYT Matematik'?30:w.name==='TYT Matematik'?25:w.name==='AYT Edebiyat'?25:20;
 const mins=w.urgency>=80?75:w.urgency>=65?60:45;
 return {mins,q,topic:first?.topic||w.name};
}
function nextDayPlan(){
 const ranked=weaknessDetails();
 const d=ensureDay();
 const used=studyMinutes(d);
 const target=Number(state.settings.studyGoal)||270;
 const capacity=Math.max(120,target);
 const plan=[];
 const review=weakTopicDetails().filter(x=>x.next&&x.next<=today()).slice(0,2);
 review.forEach(x=>plan.push({title:`Tekrar • ${x.topic}`,minutes:30,reason:'Gecikmiş tekrar',category:'Tekrar'}));
 const filled=plan.reduce((a,x)=>a+x.minutes,0);
 let rem=Math.max(0,capacity-filled);
 ranked.slice(0,4).forEach(w=>{
   if(rem<25)return;
   const rec=recommendedAction(w); const m=Math.min(rec.mins,rem);
   if(m>=25){plan.push({title:`${w.name} • ${rec.topic}`,minutes:m,reason:w.keySignals[0],category:w.area});rem-=m;}
 });
 if(rem>=25)plan.push({title:'Paragraf + Problem • günlük taban',minutes:30,reason:'TYT günlük tabanı koru',category:'TYT'});
 return plan;
}
function renderCoachExplanation(w){
 const box=$('#coachExplanation'); if(!box)return;
 if(!w){box.innerHTML='<div class="coach-empty">Konu verisi oluştuğunda koç burada nedenleri gösterecek.</div>';return;}
 const rec=recommendedAction(w); box.innerHTML=`<div class="coach-head"><div><span class="section-kicker">WHY THIS IS PRIORITY</span><h3>${esc(w.label)}</h3></div><span class="coach-risk">RİSK ${w.urgency}</span></div><div class="coach-signals">${subjectReason(w).map((r,i)=>`<div class="coach-signal"><span>${String(i+1).padStart(2,'0')}</span><p>${esc(r)}</p></div>`).join('')}</div><div class="coach-decision"><div><span class="section-kicker">KOÇUN KARARI</span><strong>Yarın ${rec.mins} dk • ${rec.q} soru</strong><small>${esc(rec.topic)} ile başla. Sonunda 10 dk yanlış analizi.</small></div><button class="primary-btn" data-coach-plan="${encodeURIComponent(w.name)}">Yarının planına ekle</button></div>`;
}
function addTomorrowPlan(){
 const d=ensureDay(addDays(today(),1)); const plan=nextDayPlan(); const titles=new Set(d.tasks.map(t=>t.title));
 plan.forEach(x=>{if(!titles.has(x.title))d.tasks.push({id:uid('task'),title:x.title,category:x.category,minutes:x.minutes,kind:'study',done:false,ai:true,source:'coach-v8',reason:x.reason});});
 save();toast(`Yarın için ${plan.length} akıllı blok oluşturuldu.`);renderDashboard();renderToday();
}
function assistantInsight(){
 const d=ensureDay(),p=adaptivePlan(),score=systemScore(d),weak=weaknessDetails()[0],read=readiness();
 if(p.reviews.length)return {h:'Önce borç kapatıyoruz.',p:`${p.reviews[0].topic} tekrar zamanı gelmiş. Sistem ilk bloğu buraya ayırıyor. Ardından ${weak?.label||'en zayıf alan'} geliyor.`,a:[['roadmap','Tekrar kuyruğu'],['focus','Focus başlat']]};
 if(!latestMocks().length)return {h:'Önce veri üret.',p:`Henüz deneme verin yok. İlk hafta amaç mükemmel net değil; başlangıç fotoğrafını çekmek. Bugün çalış ve ilk TYT denemeni programa al.`,a:[['mock','Deneme merkezi'],['today','Bugünün planı']]};
 if(score<55)return {h:'Ritmi kurtar.',p:`Bugünkü sistem skoru ${score}/100. Hedefin ${state.settings.studyGoal} dk; önce ilk 50 dakikalık bloğu temizle.`,a:[['focus','Focus başlat'],['today','Görevler']]};
 if(read<35)return {h:'Temel dönemindesin.',p:`Hukuk 50K için önce güçlü bir taban kuruyoruz. Netten çok sürdürülebilirlik ve konu kapsaması öncelikli.`,a:[['roadmap','Konu motoru'],['discipline','Disiplin']]};
 if(weak&&weak.urgency>=65)return {h:`Öncelik: ${weak.label}.`,p:`Bu alanın sağlık skoru ${weak.health}/100. ${weak.overdue?`${weak.overdue} gecikmiş tekrar var. `:''}Bugünkü planın ağırlığını buraya kaydırmak en verimli hamle.`,a:[['roadmap','Konuyu aç'],['analytics','Performans']]};
 return {h:'Kontrol sende.',p:`Bugün ${score}/100. Readiness ${read}/100. Hedefe gidişte ana iş: planı tamamla, veri gir, yarın için tek kritik eksiği işaretle.`,a:[['today','Bugünün planı'],['discipline','Günü değerlendir']]};
}
function renderDashboard(){
 const d=ensureDay(),score=systemScore(d),stats=topicStats(),p=adaptivePlan(),read=readiness(),rd=readinessDisplay();
 $('#scoreBig').textContent=score;$('#scoreBar').style.width=score+'%';$('#studyBig').textContent=studyMinutes(d);$('#studyGoalSmall').textContent=state.settings.studyGoal;$('#streakBig').textContent=streak();$('#countdownBig').textContent=daysToExam();
 $('#heroDay').textContent=new Intl.DateTimeFormat('tr-TR',{weekday:'short'}).format(new Date()).toUpperCase();$('#heroDate').textContent=pad(new Date().getDate());
 $('#subjectProgress').style.width=stats.pct+'%';$('#subjectProgressText').textContent=stats.pct+'%';
 const ai=assistantInsight();$('#assistantHeadline').textContent=ai.h;$('#assistantText').textContent=ai.p;$('#assistantActions').innerHTML=ai.a.map(([v,t])=>`<button data-route="${v}">${t}</button>`).join('')+`<div class="assistant-readiness ${rd.value===null?'is-pending':''}"><span>READINESS</span><b>${rd.label}</b><small>${rd.value===null?rd.sub:`${daysToExam()} gün • hedef ≤${state.settings.targetRank.toLocaleString('tr-TR')}`}</small></div>`;
 const open=d.tasks.filter(t=>!t.done);$('#remainingTasks').textContent=open.length;$('#questionProgress').textContent=`${d.questions||0} / ${state.settings.questionGoal}`;$('#todayCompletion').textContent=taskPct(d)+'%';$('#priorityTask').innerHTML=open[0]?`<div class="priority-label">NEXT BEST ACTION</div><strong>${esc(open[0].title)}</strong><span>${open[0].minutes||0} dk • ${esc(open[0].category)}</span>`:`<div class="priority-label">SYSTEM COMPLETE</div><strong>Tüm görevler kapalı.</strong><span>Günü kapat ve notunu yaz.</span>`;
 const ds=lastStudyDays(7);$('#weeklyStudyLabel').textContent=`${ds.reduce((a,x)=>a+x.mins,0)} dk`;$('#weeklyChart').innerHTML=ds.map(x=>`<div class="bar-col"><div class="bar-track"><i style="height:${clamp(Math.round(x.mins/Math.max(state.settings.studyGoal,...ds.map(q=>q.mins),1)*100),2,100)}%"></i></div><span>${new Intl.DateTimeFormat('tr-TR',{weekday:'short'}).format(new Date(x.k+'T12:00:00'))}</span><small>${x.mins}</small></div>`).join('');
 const mocks=latestMocks().slice(-4).reverse();$('#recentPerformance').innerHTML=mocks.length?mocks.map(m=>`<div class="stack-row"><div><span class="badge ${m.type==='TYT'?'success':'purple'}">${m.type}</span><strong>${m.net.toFixed(2)} net</strong></div><small>${fmtDate(m.date)}</small></div>`).join(''):'<div class="empty">İlk denemeni girdikten sonra burada trend görünecek.</div>';
 const ws=weaknessDetails().slice(0,3);$('#weaknessRadar').innerHTML=ws.length?ws.map((w,i)=>{const acc=w.accuracy&&w.attempts?` • soru başarısı %${Math.round(w.accuracy*100)}`:'';const detail=w.overdue?`${w.overdue} gecikmiş tekrar • `:w.stale?`${w.stale} bayat konu • `:'';return `<button class="radar-row radar-click" data-radar="${encodeURIComponent(w.name)}" title="${esc(w.name)}: sağlık ${w.health}/100, öncelik ${w.urgency}/100"><div><span class="radar-num">0${i+1}</span><strong>${esc(w.label)}</strong><small>${detail}${w.done}/${w.total} konu tamam${acc}</small></div><div><div class="radar-bar"><i style="width:${w.urgency}%"></i></div><small class="radar-meta">Risk ${w.urgency} • Sağlık ${w.health}</small></div><b>${w.urgency}</b></button>`}).join(''):'<div class="empty">Radar için konu verisi oluştuğunda burada öncelik sırası görünecek.</div>';
 const top=ws[0];renderCoachExplanation(top);
 renderDisciplineMini();
}
function renderDisciplineMini(){const d=ensureDay(),s=habitScore(d);$('#disciplineMiniScore').textContent=`${s}/5`;$('#disciplineMini').innerHTML=habitDefs.map(([k,n,sub])=>`<div class="discipline-line"><button class="tiny-check ${d.habits[k]?'on':''}" data-habit="${k}">${d.habits[k]?'✓':''}</button><span>${n}<small>${sub}</small></span><small>${d.habits[k]?'Tamam':'Bekliyor'}</small></div>`).join('')}
function renderToday(){
 const d=ensureDay(),p=adaptivePlan();$('#taskCountBadge').textContent=`${d.tasks.filter(t=>t.done).length}/${d.tasks.length}`;$('#taskList').innerHTML=d.tasks.map(t=>`<div class="task-item ${t.done?'done':''}"><button class="task-check ${t.done?'on':''}" data-task="${t.id}">${t.done?'✓':''}</button><div><div class="task-title">${esc(t.title)}</div><div class="task-meta">${esc(t.category)} • ${t.kind==='study'?'Akademik':t.kind==='work'?'Para / iş':'Life'}${t.ai?' • ✦ ASİSTAN':''}${t.reason?` • ${esc(t.reason)}`:''}</div></div><div class="task-min">${t.minutes||0} dk</div></div>`).join('');
 $('#scheduleList').innerHTML=schedule.map(x=>`<div class="schedule-item"><div class="schedule-time">${x[0]}</div><div><strong>${x[2]}</strong><p>${x[3]}</p></div><span>${x[4]}</span></div>`).join('');
 $('#habitScoreBadge').textContent=`${habitScore(d)}/5`;$('#habitList').innerHTML=habitDefs.map(([k,n,sub])=>`<button class="habit-btn ${d.habits[k]?'on':''}" data-habit="${k}"><span class="hc">${d.habits[k]?'✓':''}</span><strong>${n}</strong><small>${sub}</small></button>`).join('');$('#dayNote').value=d.note||'';
 ensureQuickInput();
}
function ensureQuickInput(){
 if($('#dailyQuickCard')){ $('#dailyQuestions').value=ensureDay().questions||0;$('#dailyPhone').value=ensureDay().phoneMinutes||0;return; }
 const wrap=$('#today .grid-2.main-grid-gap');if(!wrap)return;const card=document.createElement('article');card.id='dailyQuickCard';card.className='card';card.innerHTML=`<div class="card-head"><div><span class="section-kicker">DAILY DATA</span><h3>Hızlı veri girişi</h3></div><span class="badge purple">KOÇ MOTORU</span></div><div class="quick-grid"><label>Bugünkü soru<input id="dailyQuestions" type="number" min="0" value="0"></label><label>Telefon süresi (dk)<input id="dailyPhone" type="number" min="0" value="0"></label><button id="saveDailyData" class="primary-btn">Veriyi kaydet</button></div>`;wrap.appendChild(card);$('#saveDailyData').onclick=()=>{const d=ensureDay();d.questions=Number($('#dailyQuestions').value)||0;d.phoneMinutes=Number($('#dailyPhone').value)||0;if(d.questions>=state.settings.questionGoal)d.habits.study=true;save();renderAll();toast('Günlük veri koç motoruna işlendi.')};
}
function renderRoadmap(){
 const area=$('#roadmapArea').value,status=$('#roadmapStatus').value;let total=0,done=0,active=0;
 const subjects=allSubjects().filter(([name])=>area==='ALL'||areaOf(name)===area);
 $('#roadmapGrid').innerHTML=subjects.map(([name,topics])=>{
   const mapped=topics.map((topic,i)=>({topic,i,data:stateTopic(name,i)})).filter(x=>status==='ALL'||x.data.status===status);
   const localDone=topics.filter((_,i)=>stateTopic(name,i).status==='done').length;
   const localActive=topics.filter((_,i)=>['learning','practice','review'].includes(stateTopic(name,i).status)).length;
   total+=topics.length;done+=localDone;active+=localActive;
   const shown=mapped.length?mapped.map(x=>{
      const d=x.data,c=clamp(Number(d.confidence||0),0,5),s=d.status,answered=(Number(d.attempts)||0),acc=answered?Math.round(((Number(d.correct)||0)/answered)*100):null,studyTotal=Number(d.studyMinutesTotal)||0;
      return `<div class="topic-card ${isDue(d)?'overdue':''}" data-topic-open="${encodeURIComponent(name)}|${x.i}">
        <div class="topic-main"><div class="topic-title-row"><button type="button" class="topic-open-btn" data-topic-open-btn="${encodeURIComponent(name)}|${x.i}"><strong>${esc(x.topic)}</strong></button><span class="topic-status status-${s}">${topicStatusLabel(s)}</span></div>
        <div class="topic-metrics"><span>${studyTotal} dk</span><span>${answered} soru${acc!==null?` • %${acc}`:''}</span><span>${d.last?'Son '+fmtDate(d.last):'Henüz çalışılmadı'}</span><span>${d.next?'Tekrar '+fmtDate(d.next):'Tekrar yok'}</span></div></div>
        <select data-topic="${encodeURIComponent(name)}|${x.i}"><option value="not_started" ${s==='not_started'?'selected':''}>Başlamadı</option><option value="learning" ${s==='learning'?'selected':''}>Çalışılıyor</option><option value="practice" ${s==='practice'?'selected':''}>Soru aşaması</option><option value="review" ${s==='review'?'selected':''}>Tekrar</option><option value="done" ${s==='done'?'selected':''}>Tamamlandı</option></select>
        <div class="confidence" aria-label="Güven ${c}/5"><span class="conf-label">Güven</span>${[1,2,3,4,5].map(i=>`<button type="button" class="conf-dot ${i<=c?'on':''}" data-confidence="${encodeURIComponent(name)}|${x.i}|${i}" aria-label="Güven ${i}"></button>`).join('')}</div>
      </div>`;
   }).join(''):`<div class="empty">Bu filtrede konu yok.</div>`;
   return `<article class="subject-panel"><div class="subject-top"><div><span class="section-kicker">${areaOf(name)}</span><h3>${name}</h3><p class="subject-caption">Konu → çalışma → soru → tekrar → güven</p></div><div class="count">${localDone}/${topics.length} tamam</div></div><div class="subject-progress"><i style="width:${Math.round(localDone/topics.length*100)}%"></i></div><div class="topic-list">${shown}</div></article>`;
 }).join('')||'<div class="empty">Konu listesi bulunamadı.</div>';
 const p=topicStats();$('#topicTotal').textContent=p.total;$('#topicDone').textContent=p.done;$('#topicActive').textContent=p.active;$('#roadmapProgress').style.width=p.pct+'%';$('#roadmapProgressText').textContent=p.pct+'%';
}
function topicStatusLabel(s){return ({not_started:'Başlamadı',learning:'Çalışılıyor',practice:'Soru aşaması',review:'Tekrar',done:'Tamamlandı'})[s]||'Başlamadı'}
function topicHealth(name,i){const d=stateTopic(name,i);const attempts=Number(d.attempts)||0;const acc=attempts?((Number(d.correct)||0)/attempts):null;const conf=clamp(Number(d.confidence)||0,0,5)/5;const due=isDue(d)?1:0;const stale=d.last?clamp(daysBetween(d.last,today())/14,0,1):1;let health=Math.round(100*(0.30*conf+0.30*(acc===null?0.55:acc)+0.20*(1-stale)+0.10*(d.status==='done'?1:0)+0.10*(1-due)));return {health:clamp(health,0,100),attempts,acc,due,study:Number(d.studyMinutesTotal)||0}}
function openTopicDetail(name,i){const d=stateTopic(name,i),t=curriculum[name]?.[i]||'Konu',h=topicHealth(name,i);$('#topicDetailKey').value=`${encodeURIComponent(name)}|${i}`;$('#topicDetailArea').textContent=`${areaOf(name)} • ${name.replace(areaOf(name)+' ','')}`;$('#topicDetailTitle').textContent=t;$('#topicDetailSubtitle').textContent=d.lastNote||'Gerçek oturum verilerini gir. Bu kayıtlar koç ve zayıflık radarında kullanılacak.';$('#topicDetailHealth').textContent=`SAĞLIK ${h.health}`;$('#topicDetailStudyTotal').textContent=`${h.study} dk`;$('#topicDetailQuestionsTotal').textContent=h.attempts;$('#topicDetailAccuracy').textContent=h.acc===null?'—':`%${Math.round(h.acc*100)}`;$('#topicDetailLast').textContent=d.last?fmtDate(d.last):'Yok';$('#topicStudyMinutes').value=0;$('#topicQuestions').value=0;$('#topicCorrect').value=0;$('#topicWrong').value=0;$('#topicDetailStatus').value=d.status||'not_started';$('#topicDetailConfidence').value=String(clamp(Number(d.confidence)||1,1,5));$('#topicDetailNote').value='';$('#topicAddToToday').dataset.topicAdd=`${encodeURIComponent(name)}|${i}`;$('#topicDetailDialog')?.showModal()}
function saveTopicSession(){const key=$('#topicDetailKey').value;if(!key)return;const [encName,iRaw]=key.split('|');const name=decodeURIComponent(encName),i=Number(iRaw);const prev=stateTopic(name,i);const minutes=Math.max(0,Number($('#topicStudyMinutes').value)||0);const questions=Math.max(0,Number($('#topicQuestions').value)||0);let correct=Math.max(0,Number($('#topicCorrect').value)||0);let wrong=Math.max(0,Number($('#topicWrong').value)||0);if(questions>0){correct=Math.min(correct,questions);wrong=Math.min(wrong,questions-correct);if(correct+wrong<questions)wrong=questions-correct}const status=$('#topicDetailStatus').value,confidence=clamp(Number($('#topicDetailConfidence').value)||1,1,5),note=$('#topicDetailNote').value.trim();let next=prev.next;if(status==='done')next=addDays(today(),confidence>=4?21:confidence===3?14:7);else if(status==='review')next=addDays(today(),7);state.subjects[name]??={};state.subjects[name][i]={...prev,status,confidence,last:today(),next,attempts:(Number(prev.attempts)||0)+questions,correct:(Number(prev.correct)||0)+correct,wrong:(Number(prev.wrong)||0)+wrong,studyMinutesTotal:(Number(prev.studyMinutesTotal)||0)+minutes,sessionCount:(Number(prev.sessionCount)||0)+1,note,lastNote:note,lastScore:questions?Number((correct/questions*100).toFixed(1)):prev.lastScore};if(minutes>0){const d=ensureDay();d.studyMinutes=(Number(d.studyMinutes)||0)+minutes}save();$('#topicDetailDialog')?.close();renderAll();toast(`${name} • ${curriculum[name][i]} oturumu kaydedildi.`)}
function addTopicToToday(){const key=$('#topicAddToToday').dataset.topicAdd;if(!key)return;const [encName,iRaw]=key.split('|');const name=decodeURIComponent(encName),i=Number(iRaw),topic=curriculum[name]?.[Number(i)];if(!topic)return;const d=ensureDay();const title=`${name} • ${topic}`;if(d.tasks.some(t=>t.title===title&&!t.done)){toast('Bu konu bugün zaten planda.');return}d.tasks.push({id:uid('task'),title,category:areaOf(name),minutes:name.includes('AYT')?60:45,kind:'study',done:false,source:'topic-motor',topicKey:`${name}|${i}`});save();renderAll();toast('Konu bugünün planına eklendi.')}

function mistakeTypeLabel(x){return ({concept:'Konu eksiği',careless:'Dikkat',time:'Zaman',interpretation:'Yorum',formula:'Formül',memory:'Bilgi',strategy:'Strateji'})[x]||'Diğer'}
function addMistake(m){state.mistakes.push({id:uid('mistake'),date:m.date||today(),mockId:m.mockId||'',type:m.type||'concept',subject:m.subject||'',topic:m.topic||'',note:m.note||'',severity:Number(m.severity)||3});save();}
function mistakeStats(){const byTopic={},byType={};for(const m of state.mistakes){const k=m.topic||m.subject||'Genel';byTopic[k]=(byTopic[k]||0)+1;byType[m.type]=(byType[m.type]||0)+1;}return {byTopic,byType};}
function coachMistakeInsight(){const st=mistakeStats();const top=Object.entries(st.byTopic).sort((a,b)=>b[1]-a[1])[0];return top?`${top[0]} alanında ${top[1]} hata kaydı var. Bir sonraki çalışma bloğunda bu konuya hata analizi ekle.`:'Henüz hata günlüğü oluşmadı. Denemelerde yanlışlarını konu ve hata türüyle kaydet.'}
function renderMock(){
 const m=state.mocks.slice().sort((a,b)=>b.date.localeCompare(a.date)),t=m.filter(x=>x.type==='TYT'),a=m.filter(x=>x.type==='AYT EA');const avg=x=>x.length?(x.reduce((s,y)=>s+y.net,0)/x.length):0;
 $('#mockKpis').innerHTML=`${[['Toplam',m.length,'deneme'],['TYT ort.',avg(t).toFixed(2),'net'],['AYT EA ort.',avg(a).toFixed(2),'net'],['Readiness',readiness()===null?'—':readiness(),' / 100']].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('')}`;
 const f=$('#mockFilter').value,arr=m.filter(x=>f==='ALL'||x.type===f);$('#mockTable').innerHTML=arr.length?`<div class="mock-header"><span>TÜR</span><span>NET</span><span>TARİH</span><span>KIRILIM</span><span></span></div>`+arr.map(x=>`<div class="mock-row"><div><span class="badge ${x.type==='TYT'?'success':'purple'}">${x.type}</span></div><div><strong>${x.net.toFixed(2)}</strong></div><div><span>${fmtDate(x.date)}</span></div><div class="mock-sub"><span>T/E ${x.breakdown?.turkce??x.breakdown?.edebiyat??'—'}</span><span>M ${x.breakdown?.math??'—'}</span><span>S ${x.breakdown?.social??'—'}</span><span>F ${x.breakdown?.science??'—'}</span></div><button class="danger-btn" data-delmock="${x.id}">Sil</button></div>`).join(''):'<div class="empty">Deneme yok. İlk kaydınla veri motorunu başlat.</div>';
}
function lineSvg(values,labels){if(values.length<2)return '<div class="empty">Trend için en az 2 deneme gerekir.</div>';const w=760,h=250,p=26,min=Math.min(...values),max=Math.max(...values),range=Math.max(1,max-min);const pts=values.map((v,i)=>{const x=p+i*(w-2*p)/(values.length-1),y=h-p-((v-min)/range)*(h-2*p);return [x,y]}),path=pts.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' ');return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="gline" x1="0" x2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".2"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs><path d="${path}" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="${path} L ${pts.at(-1)[0]} ${h-p} L ${pts[0][0]} ${h-p} Z" fill="url(#gline)" opacity=".35"/>${pts.map((q,i)=>`<circle cx="${q[0]}" cy="${q[1]}" r="5" fill="currentColor"><title>${labels[i]} • ${values[i]}</title></circle>`).join('')}</svg>`}
function renderAnalytics(){
 const t=latestMocks('TYT').slice(-10),a=latestMocks('AYT EA').slice(-10),td=lastStudyDays(14);$('#analyticsKpis').innerHTML=`${[['TYT son',t.at(-1)?.net?.toFixed(2)||'—','net'],['AYT EA son',a.at(-1)?.net?.toFixed(2)||'—','net'],['14 gün ders',td.reduce((s,x)=>s+x.mins,0),'dk'],['Readiness',readiness()===null?'—':readiness(),' / 100']].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('')}`;
 $('#netChart').innerHTML=t.length<2?'<div class="empty">Trend için en az 2 TYT denemesi kaydet.</div>':lineSvg(t.map(x=>x.net),t.map(x=>fmtDate(x.date)));
 const max=Math.max(state.settings.studyGoal,...td.map(x=>x.mins),1);$('#loadChart').innerHTML=td.map(x=>{const n=fmtDate(x.k);return `<div class="bar-col"><div class="bar-track"><i style="height:${clamp(Math.round(x.mins/max*100),2,100)}%"></i></div><span>${n}</span><small>${x.mins}</small></div>`}).join('');
 const w=weaknessDetails()[0];$('#analysisWeak').textContent=w?`${w.label} / ${w.health}/100`:'—';$('#analysisWeakText').textContent=w?`${w.overdue?`${w.overdue} gecikmiş tekrar • `:''}öncelik skoru ${w.urgency}/100.`:'Konu verisi bekleniyor.';const comp=Math.round(td.slice(-7).reduce((s,x)=>s+x.score,0)/7);$('#analysisReliability').textContent=comp+'%';$('#analysisReliabilityText').textContent='Son 7 gün sistem skoru ortalaması.';const active=lastStudyDays(30).filter(x=>x.d&&systemScore(x.d)>=40).length;$('#analysisConsistency').textContent=active+'/30';$('#analysisConsistencyText').textContent='Son 30 günde ≥40 skor alınan gün.';
}
function renderDiscipline(){const days=lastStudyDays(30);$('#disciplineHeatmap').innerHTML=days.map(x=>`<div class="heat-cell ${heatClass(x.score)}" title="${fmtDate(x.k)} • ${x.score}"></div>`).join('');$('#disciplineCards').innerHTML=`<article class="card"><span class="section-kicker">CURRENT</span><h3>${systemScore(ensureDay())}/100</h3><p class="muted">Bugünün sistem skoru.</p></article><article class="card"><span class="section-kicker">7 DAY AVG</span><h3>${Math.round(days.slice(-7).reduce((a,x)=>a+x.score,0)/7)}%</h3><p class="muted">Son 7 gün ortalaması.</p></article><article class="card"><span class="section-kicker">STREAK</span><h3>${streak()} gün</h3><p class="muted">70+ skorla kırılmadan devam.</p></article>`}
function heatClass(s){return s>=85?'h4':s>=70?'h3':s>=40?'h2':s>0?'h1':'h0'}
function renderFinance(){const m=state.money.reduce((a,x)=>{if(x.date.slice(0,7)===today().slice(0,7)){a[x.type==='income'?'inc':'exp']+=Number(x.amount)||0}return a},{inc:0,exp:0});const net=BASE_SALARY+m.inc-m.exp;$('#financeKpis').innerHTML=`${[['Sabit maaş',BASE_SALARY,'TL'],['Ek gelir',m.inc.toLocaleString('tr-TR'),'TL'],['Gider',m.exp.toLocaleString('tr-TR'),'TL'],['Net akış',net.toLocaleString('tr-TR'),'TL']].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('')}`;const rows=[['Maaş',BASE_SALARY],['Ek gelir',m.inc],['Gider',-m.exp],['Net',net]];const max=Math.max(BASE_SALARY,m.inc,m.exp,Math.abs(net),1);$('#cashflowBars').innerHTML=`<div class="finance-stack">${rows.map(r=>`<div class="cash-line"><span>${r[0]}</span><div class="cash-track"><i style="width:${Math.max(3,Math.round(Math.abs(r[1])/max*100))}%"></i></div><strong>${r[1]<0?'-':''}₺${Math.abs(r[1]).toLocaleString('tr-TR')}</strong></div>`).join('')}</div>`;$('#moneyList').innerHTML=state.money.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,20).map(x=>`<div class="money-item"><div><strong>${esc(x.desc)}</strong><small>${fmtDate(x.date)} • ${x.type==='income'?'Gelir':'Gider'}</small></div><strong class="${x.type==='income'?'income':'expense'}">${x.type==='income'?'+':'-'}₺${Number(x.amount).toLocaleString('tr-TR')}</strong></div>`).join('')||'<div class="empty">Henüz para hareketi yok.</div>'}
function renderSettings(){$('#setStudy').value=state.settings.studyGoal;$('#setQuestions').value=state.settings.questionGoal;$('#setParagraph').value=state.settings.paragraphGoal;$('#setProblem').value=state.settings.problemGoal;ensureSettingsExtra()}
function ensureSettingsExtra(){const host=$('#settings .main-grid-gap');if($('#strategyCard')||!host)return;const a=document.createElement('article');a.id='strategyCard';a.className='card settings-card';a.innerHTML=`<div class="card-head"><div><span class="section-kicker">MISSION CONTROL</span><h3>Hedef & zaman ufku</h3></div><span class="badge purple">LAW / EA</span></div><label>Provisional sınav tarihi<input id="setExamDate" type="date"></label><label>Stretch sıralama hedefi<input id="setTargetRank" type="number" min="1"></label><label>Minimum hukuk hedefi<input id="setMinRank" type="number" min="1"></label><div class="system-note"><strong>Koç prensibi</strong><span>Panel kesin sıralama tahmini yapmaz. Readiness; deneme, konu kapsamı ve disiplin verilerini birleştiren iç performans göstergesidir.</span></div><button id="saveStrategy" class="primary-btn">Stratejiyi kaydet</button>`;host.appendChild(a);$('#setExamDate').value=state.settings.examDate;$('#setTargetRank').value=state.settings.targetRank;$('#setMinRank').value=state.settings.minRank;$('#saveStrategy').onclick=()=>{state.settings.examDate=$('#setExamDate').value||DEFAULT_EXAM;state.settings.targetRank=clamp(Number($('#setTargetRank').value)||30000,1,200000);state.settings.minRank=clamp(Number($('#setMinRank').value)||50000,1,200000);save();renderAll();toast('Hedef stratejisi güncellendi.')}}
function renderAll(){applyTheme();ensureDay();renderDashboard();renderToday();renderRoadmap();renderMock();renderMistakes();renderAnalytics();renderDiscipline();renderFinance();renderSettings();}
function addTask(){const d=ensureDay(),title=$('#taskTitle').value.trim();if(!title)return;const cat=$('#taskCategory').value;d.tasks.push({id:uid('task'),title,category:cat,minutes:Number($('#taskMinutes').value)||0,kind:['TYT','AYT','Tekrar'].includes(cat)?'study':cat==='EB Digital'?'work':cat==='Spor'?'life':'life',done:false,source:'manual'});save();$('#taskDialog').close();$('#taskForm').reset();renderAll();toast('Görev eklendi.')}
function addMock(){const type=$('#mockType').value,net=Number($('#mockNet').value);if(!net)return;state.mocks.push({id:uid('mock'),type,net,date:$('#mockDate').value||today(),note:$('#mockNote').value.trim(),duration:Number($('#mockDuration').value)||0,breakdown:{turkce:valOrNull($('#mockTurkce').value),math:valOrNull($('#mockMath').value),social:valOrNull($('#mockSocial').value),science:valOrNull($('#mockScience').value)}});save();$('#mockDialog').close();$('#mockForm').reset();$('#mockDate').value=today();renderAll();toast(`${type} denemesi kaydedildi.`)}
function valOrNull(v){return v===''?null:Number(v)}
function addMoney(typeOverride){$('#moneyType').value=typeOverride||'income';$('#moneyDialog').showModal()}
function saveMoney(){const desc=$('#moneyDesc').value.trim(),amt=Number($('#moneyAmount').value),type=$('#moneyType').value;if(!desc||!amt)return;state.money.push({id:uid('money'),type,desc,amount:amt,date:today()});save();$('#moneyDialog').close();$('#moneyForm').reset();renderAll();toast(type==='income'?'Gelir kaydedildi.':'Gider kaydedildi.')}
function saveNote(){const d=ensureDay();d.note=$('#dayNote').value.trim();save();toast('Gün notu kaydedildi.')}
function finishDay(){const d=ensureDay(),open=d.tasks.filter(t=>!t.done);if(open.length){toast(`${open.length} açık görev var. Sistem günü kapatmıyor.`);return}d.closed=true;save();renderAll();toast('Gün kapatıldı. Sistem gerçek veriyi korudu.')}
function optimizePlan(){const d=ensureDay(),p=adaptivePlan();const keep=d.tasks.filter(t=>t.done||(!t.ai&&!/^Tekrar •/.test(t.title)&&!/^AI •/.test(t.title)));const existing=new Set(keep.filter(t=>!t.done).map(t=>t.title));p.plan.forEach(x=>{if(!existing.has(x.title))keep.push({id:uid('task'),title:x.title,category:x.category,minutes:x.minutes,kind:'study',done:false,reason:x.reason,ai:true,source:'assistant'})});d.tasks=keep;state.assistant.lastPlanDate=today();state.assistant.lastPlanSignature=p.plan.map(x=>x.title).join('|');save();renderAll();toast(`Plan optimize edildi • ${p.plan.length} akıllı blok`)}
function setTopic(name,i,status){state.subjects[name]??={};const prev=stateTopic(name,i);let next=prev.next;const confidence=Number(prev.confidence||0);if(status==='done'){next=addDays(today(),confidence>=4?21:confidence===3?14:7)}else if(status==='review'){next=addDays(today(),7)}state.subjects[name][i]={...prev,status,last:today(),next,confidence};save()}
function setConfidence(name,i,c){state.subjects[name]??={};const prev=stateTopic(name,i);let next=prev.next;if(prev.status==='done')next=addDays(today(),c>=4?21:c===3?14:7);state.subjects[name][i]={...prev,confidence:Number(c),next};save()}
function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`hukuk-50k-os-${today()}.json`;a.click();URL.revokeObjectURL(url);toast('Yedek hazırlanıyor.')}
function importData(file){const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x||typeof x!=='object')throw Error();state=normalize(x);save();renderAll();toast('Yedek yüklendi.')}catch{toast('Geçersiz JSON yedeği.')}};r.readAsText(file)}
const focus={total:1500,left:1500,running:false,handle:null,taskId:null};
function renderTimer(){const m=Math.floor(focus.left/60),s=focus.left%60;$('#timerDisplay').textContent=`${pad(m)}:${pad(s)}`;const pct=focus.total?((focus.total-focus.left)/focus.total)*360:0;$('#focus .focus-ring').style.background=`conic-gradient(var(--accent) ${pct}deg,#1a2230 ${pct}deg)`;const d=ensureDay();const t=d.tasks.find(x=>x.id===focus.taskId);$('#focusTargetLabel').textContent=t?.title||'Bir görev seç';}
function setFocusTimer(mins=25){focus.total=mins*60;focus.left=focus.total;focus.running=false;renderTimer()}
function startTimer(){if(focus.running)return;focus.running=true;focus.handle=setInterval(()=>{if(focus.left<=0){completeFocus();return}focus.left--;renderTimer()},1000)}
function completeFocus(){stopTimer();const mins=Math.round(focus.total/60);state.focusSessions++;const d=ensureDay();d.studyMinutes=(Number(d.studyMinutes)||0)+mins;d.focusMinutes=(Number(d.focusMinutes)||0)+mins;if(focus.taskId){const t=d.tasks.find(x=>x.id===focus.taskId);if(t&&!t.done){t.focusLogged=(t.focusLogged||0)+mins;if((t.focusLogged||0)>=Math.max(20,t.minutes||25))t.done=true;}}state.sessions.push({id:uid('session'),date:today(),minutes:mins,taskId:focus.taskId,createdAt:new Date().toISOString()});save();renderAll();toast(`Focus tamamlandı • ${mins} dk gerçek çalışma kaydedildi.`);focus.taskId=null;setFocusTimer(25)}
function stopTimer(){focus.running=false;clearInterval(focus.handle);focus.handle=null;renderTimer()}
function resetTimer(){stopTimer();setFocusTimer(25)}
function commandResults(q){const commands=[['Bugünün sistemini aç','today'],['Focus Room','focus'],['Konu motoru','roadmap'],['Deneme merkezi','mock'],['Performans','analytics'],['Disiplin','discipline'],['Para motoru','finance'],['Ayarlar','settings'],['Hata günlüğü','mock']];const f=commands.filter(x=>x[0].toLowerCase().includes(q.toLowerCase()));$('#commandResults').innerHTML=f.map(x=>`<button class="command-item" data-route="${x[1]}"><strong>${x[0]}</strong><span>↵ aç</span></button>`).join('')||'<div class="empty">Komut bulunamadı.</div>'}
// Events
const bind=(id,event,handler)=>{const el=$('#'+id);if(el)el.addEventListener(event,handler)};
$$('.nav-item').forEach(b=>b.addEventListener('click',()=>{navigate(b.dataset.view); closeSidebar()}));
document.addEventListener('click',e=>{
 const route=e.target.closest('[data-route]');if(route){navigate(route.dataset.route);const dlg=$('#commandDialog');if(dlg?.open)dlg.close();return}
 const task=e.target.closest('[data-task]');if(task){const d=ensureDay(),t=d.tasks.find(x=>x.id===task.dataset.task);if(t){t.done=!t.done;save();renderAll();toast(t.done?'Görev tamamlandı.':'Görev geri açıldı.')}return}
 const hb=e.target.closest('[data-habit]');if(hb){const d=ensureDay();d.habits[hb.dataset.habit]=!d.habits[hb.dataset.habit];save();renderAll();return}
 const del=e.target.closest('[data-delmock]');if(del){state.mocks=state.mocks.filter(m=>m.id!==del.dataset.delmock);save();renderAll();toast('Deneme silindi.');return}
 const conf=e.target.closest('[data-confidence]');if(conf){e.stopPropagation();const [name,i,c]=decodeURIComponent(conf.dataset.confidence).split('|');setConfidence(name,Number(i),Number(c));renderRoadmap();renderDashboard();toast(`Güven seviyesi ${c}/5.`);return}
 const topicOpen=e.target.closest('[data-topic-open-btn]');if(topicOpen){e.stopPropagation();const [name,i]=decodeURIComponent(topicOpen.dataset.topicOpenBtn).split('|');openTopicDetail(name,Number(i));return}
 const coachPlan=e.target.closest('[data-coach-plan]');if(coachPlan){const name=decodeURIComponent(coachPlan.dataset.coachPlan);const d=ensureDay(addDays(today(),1));const w=weaknessDetails().find(x=>x.name===name)||weaknessDetails()[0];if(w){const rec=recommendedAction(w);d.tasks.push({id:uid('task'),title:`${w.name} • ${rec.topic}`,category:w.area,minutes:rec.mins,kind:'study',done:false,ai:true,source:'coach-v8',reason:w.keySignals[0]});save();toast(`${w.label}: yarının planına eklendi.`);return}}
 const radar=e.target.closest('[data-radar]');if(radar){navigate('roadmap');$('#roadmapArea').value=areaOf(decodeURIComponent(radar.dataset.radar));$('#roadmapStatus').value='ALL';renderRoadmap();return}
});
bind('addTask','click',()=>$('#taskDialog')?.showModal());bind('taskForm','submit',e=>{e.preventDefault();addTask()});
bind('addMistake','click',()=>$('#mistakeDialog')?.showModal());bind('mistakeForm','submit',e=>{e.preventDefault();const subject=$('#mistakeSubject').value.trim(),topic=$('#mistakeTopic').value.trim(),type=$('#mistakeType').value,note=$('#mistakeNote').value.trim(),severity=Number($('#mistakeSeverity').value)||3;if(!subject||!note){toast('Ders ve hata açıklaması gerekli.');return}addMistake({subject,topic,type,note,severity,date:today()});$('#mistakeDialog').close();$('#mistakeForm').reset();renderAll();toast('Hata günlüğüne kaydedildi.');});
bind('addMock','click',()=>{$('#mockDate').value=today();$('#mockDialog')?.showModal()});bind('mockForm','submit',e=>{e.preventDefault();addMock()});
bind('addIncomeQuick','click',()=>addMoney('income'));bind('addExpenseQuick','click',()=>addMoney('expense'));bind('moneyForm','submit',e=>{e.preventDefault();saveMoney()});
// Safe event binding: optional controls can be absent without killing the entire app.
bind('finishDay','click',finishDay);
bind('regeneratePlan','click',optimizePlan);
bind('planTomorrow','click',addTomorrowPlan); // optional legacy button
bind('saveDayNote','click',saveNote);
bind('roadmapArea','change',renderRoadmap);
bind('roadmapStatus','change',renderRoadmap);
bind('mockFilter','change',renderMock);
document.addEventListener('change',e=>{const s=e.target.closest('[data-topic]');if(s){e.stopPropagation();const [name,i]=decodeURIComponent(s.dataset.topic).split('|');setTopic(name,Number(i),s.value);renderRoadmap();renderDashboard();toast('Konu durumu güncellendi.')}});
bind('saveSettings','click',()=>{state.settings.studyGoal=clamp(Number($('#setStudy').value)||270,120,720);state.settings.questionGoal=clamp(Number($('#setQuestions').value)||350,50,1200);state.settings.paragraphGoal=clamp(Number($('#setParagraph').value)||20,0,100);state.settings.problemGoal=clamp(Number($('#setProblem').value)||15,0,100);save();renderAll();toast('Günlük hedefler güncellendi.')});
bind('exportTop','click',exportData);bind('exportSettings','click',exportData);bind('importSettings','change',e=>{const f=e.target.files?.[0];if(f)importData(f)});bind('resetSettings','click',()=>{if(confirm('Tüm takip verileri silinecek. Emin misin?')){state=clone(defaultState);save();renderAll();toast('Veriler sıfırlandı.')}});
// Theme controls — one reliable pointer/click path for desktop + touch devices.
const initThemeControls=()=>{
 const themeBtn=$('#themeBtn');
 const accentBtn=$('#accentThemeBtn');
 const accentMenu=$('#accentThemeMenu');
 if(!themeBtn || !accentBtn || !accentMenu) return;
 const toggleTheme=(e)=>{e?.preventDefault();e?.stopPropagation();state.theme=state.theme==='dark'?'light':'dark';save();applyTheme();};
 const toggleAccent=(e)=>{e?.preventDefault();e?.stopPropagation();accentMenu.classList.toggle('open');accentBtn.setAttribute('aria-expanded',String(accentMenu.classList.contains('open')));};
 const setAccent=(e)=>{
   const opt=e.target.closest('[data-accent]');
   if(!opt) return;
   e.preventDefault(); e.stopPropagation();
   const next=opt.dataset.accent;
   if(!accentThemes[next]) return;
   state.accentTheme=next; save(); applyTheme(); renderAll();
   accentMenu.classList.remove('open'); accentBtn.setAttribute('aria-expanded','false');
   toast(`${opt.dataset.label||'Tema'} aktif.`);
 };
 // Direct handlers + touchend fallback; guard against double-firing on touch browsers.
 let touchThemeAt=0, touchAccentAt=0;
 themeBtn.onclick=toggleTheme;
 accentBtn.onclick=toggleAccent;
 accentMenu.onclick=setAccent;
 accentBtn.addEventListener('touchend',(e)=>{if(Date.now()-touchAccentAt<350)return; touchAccentAt=Date.now(); toggleAccent(e);},{passive:false});
 themeBtn.addEventListener('touchend',(e)=>{if(Date.now()-touchThemeAt<350)return; touchThemeAt=Date.now(); toggleTheme(e);},{passive:false});
 accentBtn.setAttribute('aria-haspopup','menu');
 accentBtn.setAttribute('aria-expanded','false');
 document.addEventListener('click',(e)=>{
   if(accentMenu.classList.contains('open') && !accentMenu.contains(e.target) && e.target!==accentBtn) {
     accentMenu.classList.remove('open'); accentBtn.setAttribute('aria-expanded','false');
   }
 });
 document.addEventListener('keydown',(e)=>{
   if(e.key==='Escape'){accentMenu.classList.remove('open');accentBtn.setAttribute('aria-expanded','false');}
 });
};

const sidebar=$('#sidebar'), mobileMenu=$('#mobileMenu'), sidebarBackdrop=$('#sidebarBackdrop');
const syncSidebarUi=()=>{
 const isOpen=sidebar?.classList.contains('open');
 const isCollapsed=sidebar?.classList.contains('collapsed');
 if(mobileMenu){
  mobileMenu.textContent=(isOpen||isCollapsed)?'←':'☰';
  mobileMenu.setAttribute('aria-label',(isOpen||isCollapsed)?'Menüyü kapat':'Menüyü aç');
  mobileMenu.setAttribute('title',(isOpen||isCollapsed)?'Menüyü kapat':'Menüyü aç');
  mobileMenu.classList.toggle('is-open',!!(isOpen||isCollapsed));
 }
 sidebarBackdrop?.classList.toggle('show',!!isOpen);
 if(sidebarBackdrop) sidebarBackdrop.setAttribute('aria-hidden',String(!isOpen));
};
const closeSidebar=()=>{sidebar?.classList.remove('open');syncSidebarUi()};
const toggleSidebar=()=>{
 if(!sidebar)return;
 if(window.innerWidth<=840){sidebar.classList.toggle('open');}
 else {sidebar.classList.toggle('collapsed');}
 syncSidebarUi();
};
bind('mobileMenu','click',toggleSidebar);
bind('sidebarBackdrop','click',closeSidebar);
window.addEventListener('resize',()=>{if(window.innerWidth>840) sidebar?.classList.remove('open'); syncSidebarUi();});
syncSidebarUi();
renderNavIcons();
initThemeControls();
applyTheme();
function renderFocusTaskPicker(){const d=ensureDay(),open=d.tasks.filter(t=>!t.done&&['study','review'].includes(t.kind));const box=$('#focusTaskList');if(!box)return;if(!open.length){box.innerHTML='<div class=\"empty\">Bugün seçilebilir açık akademik görev yok. Önce Bugünün Sistemi bölümünden bir görev ekle.</div>';return}box.innerHTML=open.map(t=>`<button type=\"button\" class=\"focus-task-option ${focus.taskId===t.id?'selected':''}\" data-focus-task=\"${t.id}\"><div><strong>${esc(t.title)}</strong><span>${esc(t.category)} • ${t.minutes||25} dk${t.ai?' • ✦ Asistan':''}</span></div><b>${focus.taskId===t.id?'✓':'→'}</b></button>`).join('')}
bind('focusTaskSelect','click',()=>{renderFocusTaskPicker();const dlg=$('#focusTaskDialog');if(dlg&&!dlg.open){try{dlg.showModal()}catch{dlg.setAttribute('open','')}}});
bind('focusTaskList','click',e=>{const btn=e.target.closest('[data-focus-task]');if(!btn)return;const d=ensureDay(),t=d.tasks.find(x=>x.id===btn.dataset.focusTask);if(!t)return;focus.taskId=t.id;$('#focusTargetLabel').textContent=t.title;$('#focusSelected').textContent=`Seçildi • ${t.minutes||25} dk • ${t.category}`;setFocusTimer(Math.min(50,Math.max(25,Math.round((t.minutes||25)/5)*5)));$('#focusTaskDialog')?.close();renderFocusTaskPicker()});
bind('topicSaveSession','click',saveTopicSession);bind('topicAddToToday','click',addTopicToToday);bind('timerStart','click',startTimer);bind('timerPause','click',stopTimer);bind('timerReset','click',resetTimer);
bind('globalSearch','focus',()=>{$('#commandDialog')?.showModal();$('#commandInput')?.focus();commandResults('')});bind('globalSearch','keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('#commandDialog')?.showModal();$('#commandInput')?.focus();commandResults('')}});bind('commandInput','input',e=>commandResults(e.target.value));document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#commandDialog')?.showModal();$('#commandInput')?.focus();commandResults('')}});bind('commandDialog','close',()=>{const x=$('#globalSearch');if(x)x.value=''});
setFocusTimer(25);ensureDay();renderAll();
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{})}
