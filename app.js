const KEY='nexora-study-os-v52';
const LEGACY_KEYS=['nexora-study-os-v50','nexora-study-os-v48','hukuk50k-os-v47','hukuk50k-os-v46','hukuk50k-os-v45','hukuk50k-os-v44','hukuk50k-os-v43','hukuk50k-os-v42','hukuk50k-os-v41','hukuk50k-os-v40','hukuk50k-os-v39','hukuk50k-os-v38','hukuk50k-os-v37','hukuk50k-os-v36','hukuk50k-os-v35','hukuk50k-os-v34','hukuk50k-os-v33','hukuk50k-os-v32','hukuk50k-os-v31','hukuk50k-os-v30','hukuk50k-os-v29','hukuk50k-os-v28','hukuk50k-os-v27','hukuk50k-os-v19','hukuk50k-os-v15','hukuk50k-os-v14','hukuk50k-os-v13','hukuk50k-os-v12','hukuk50k-os-v8','hukuk50k-os-v7','hukuk50k-os-v6','hukuk50k-os-v5','hukuk50k-os-v3'];
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
const goalCatalog={
  'SAY':['Tıp','Diş Hekimliği','Eczacılık','Veteriner Hekimliği','Bilgisayar Mühendisliği','Yazılım Mühendisliği','Elektrik-Elektronik Mühendisliği','Makine Mühendisliği','Endüstri Mühendisliği','İnşaat Mühendisliği','Mekatronik Mühendisliği','Kimya Mühendisliği','Biyomedikal Mühendisliği','Mimarlık','Matematik','Fizik','Kimya','Biyoloji','Fizyoterapi ve Rehabilitasyon','Hemşirelik','Beslenme ve Diyetetik','Öğretmenlik / Sayısal','Diğer / Kendim yazacağım'],
  'EA':['Hukuk','Psikoloji','Psikolojik Danışmanlık ve Rehberlik','İşletme','Ekonomi','Maliye','Uluslararası İlişkiler','Siyaset Bilimi ve Kamu Yönetimi','Yönetim Bilişim Sistemleri','Çalışma Ekonomisi ve Endüstri İlişkileri','Sosyoloji','Sosyal Hizmet','Çocuk Gelişimi','Uluslararası Ticaret ve Lojistik','Bankacılık ve Finans','Ekonometri','Gastronomi ve Mutfak Sanatları','İnsan Kaynakları Yönetimi','Turizm İşletmeciliği','Diğer / Kendim yazacağım'],
  'SÖZ':['Türk Dili ve Edebiyatı','Tarih','Coğrafya','Gazetecilik','Radyo, Televizyon ve Sinema','Yeni Medya ve İletişim','Halkla İlişkiler ve Tanıtım','Reklamcılık','Sinema ve Televizyon','Sanat Tarihi','Kültür Varlıklarını Koruma ve Onarım','Türkçe Öğretmenliği','Sosyal Bilgiler Öğretmenliği','Özel Eğitim Öğretmenliği / Sözel','Diğer / Kendim yazacağım'],
  'DİL':['İngilizce Öğretmenliği','İngiliz Dili ve Edebiyatı','Mütercim ve Tercümanlık','Dilbilim','Amerikan Kültürü ve Edebiyatı','Almanca Öğretmenliği','Almanca Mütercim ve Tercümanlık','Fransızca Öğretmenliği','Fransız Dili ve Edebiyatı','Rus Dili ve Edebiyatı','Arapça Öğretmenliği','Çeviribilim','Turizm Rehberliği / Dil','Diğer / Kendim yazacağım'],
  'TYT':['Bilgisayar Programcılığı','Anestezi','İlk ve Acil Yardım','Tıbbi Görüntüleme Teknikleri','Tıbbi Laboratuvar Teknikleri','Tıbbi Dokümantasyon ve Sekreterlik','Çocuk Gelişimi','Adalet','Aşçılık','Grafik Tasarımı','Web Tasarımı ve Kodlama','E-Ticaret ve Pazarlama','Bankacılık ve Sigortacılık','Dış Ticaret','Lojistik','Sağlık Kurumları İşletmeciliği','Sivil Havacılık Kabin Hizmetleri','Diğer / Kendim yazacağım']
};
const trackMeta={SAY:{label:'Sayısal',short:'SAY',tone:'ocean'},EA:{label:'Eşit Ağırlık',short:'EA',tone:'purple'},'SÖZ':{label:'Sözel',short:'SÖZ',tone:'amber'},'DİL':{label:'Dil',short:'DİL',tone:'rose'},TYT:{label:'TYT / Ön Lisans',short:'TYT',tone:'cyan'}};
const rankPresets=[1000,5000,10000,20000,30000,50000,100000,200000];
const defaultState={version:51,days:{},subjects:{},mocks:[],mistakes:[],money:[],sessions:[],weekly:[],settings:{studyGoal:270,questionGoal:350,paragraphGoal:20,problemGoal:15,examDate:DEFAULT_EXAM,targetRank:30000,minRank:50000,scoreType:'',targetProgram:'',customProgram:'',onboardingComplete:false,onboardingUserId:''},theme:'dark',accentTheme:'lime',focusSessions:0,assistant:{lastPlanDate:'',lastPlanSignature:''}};
let state=load();
function migrate(x){const y=clone(x||{});y.days??={};y.subjects??={};y.mocks??=[];y.mistakes??=[];y.money??=[];y.sessions??=[];y.weekly??=[];y.focusSessions??=0;y.theme??='dark';y.accentTheme??='lime';y.academy??={level:'beginner',duration:60,viewed:[],favorites:[],lastGuide:'',lastSessionDate:''};y.assistant??={lastPlanDate:'',lastPlanSignature:''};y.settings={...defaultState.settings,...(y.settings||{})};y.settings.scoreType??='';y.settings.targetProgram??='';y.settings.customProgram??='';y.settings.onboardingComplete??=false;y.settings.onboardingUserId??='';y.academy??={level:'beginner',duration:60,viewed:[],favorites:[],lastGuide:'',lastSessionDate:''};y.version=52;for(const d of Object.values(y.days)){d.tasks??=[];d.habits??={};d.studyMinutes??=0;d.questions??=0;d.note??='';d.briefingDone??=false;d.briefingFocus??='';d.eveningReview??='';d.eveningClosedAt??='';}return y}
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
 if(!state.days[k])state.days[k]={tasks:makeBaseTasks(),habits:Object.fromEntries(habitDefs.map(x=>[x[0],false])),studyMinutes:0,questions:0,note:'',phoneMinutes:0,closed:false,focusMinutes:0,questionBreakdown:{paragraph:0,problem:0},sleepHours:null,energyLevel:null,exerciseMinutes:null,stressLevel:null};
 const d=state.days[k];d.habits??={};d.tasks??=[];d.studyMinutes??=0;d.questions??=0;d.note??='';d.phoneMinutes??=0;d.closed??=false;d.focusMinutes??=0;d.questionBreakdown??={paragraph:0,problem:0};d.sleepHours??=null;d.energyLevel??=null;d.exerciseMinutes??=null;d.stressLevel??=null;d.sleepHours??=null;d.energyLevel??=null;d.exerciseMinutes??=null;d.stressLevel??=null;
 const hasRealTasks=d.tasks.length>0;
 if(!hasRealTasks && !d.closed) d.tasks=makeBaseTasks();
 else if(hasRealTasks && d.tasks.length<baseTasks().length){
   const titles=new Set(d.tasks.map(t=>t.title));
   baseTasks().forEach(t=>{if(!titles.has(t.title))d.tasks.push({...t,id:uid('task'),done:false,source:'base'})});
 }
 if(!d.closed) addDueReviewTasks(d,k);
 return d;
}
function repeatInterval(confidence,accuracy,repeatCount){
 const c=Number(confidence)||1,a=accuracy===null?null:Number(accuracy);
 if(a!==null && a<0.60) return 1;
 if(c<=2) return 2;
 if(a!==null && a<0.75) return 3;
 if(c===3) return 7;
 if(c===4) return 14;
 return repeatCount>=3?30:21;
}
function addDueReviewTasks(d,k=today()){
 const openKeys=new Set(d.tasks.filter(t=>!t.done && t.repeatKey).map(t=>t.repeatKey));
 allSubjects().forEach(([name,topics])=>topics.forEach((topic,i)=>{
   const s=stateTopic(name,i); if(!s.next || s.next>k) return;
   const key=`repeat|${name}|${i}|${s.next}`;
   if(openKeys.has(key)) return;
   d.tasks.unshift({id:uid('repeat'),title:`Tekrar • ${name} • ${topic}`,category:'Akıllı Tekrar',minutes:name.startsWith('AYT')?35:25,kind:'review',done:false,source:'smart-repeat',ai:true,repeatKey:key,topicKey:`${name}|${i}`,reason:'Akıllı tekrar zamanı geldi'});
 }));
}
function smartRepeatQueue(){
 const rows=[];
 allSubjects().forEach(([name,topics])=>topics.forEach((topic,i)=>{const s=stateTopic(name,i);if(s.next)rows.push({name,i,topic,data:s,due:s.next<=today(),days:s.next<today()?daysBetween(s.next,today()):s.next===today()?0:-daysBetween(today(),s.next),accuracy:(Number(s.attempts)||0)?(Number(s.correct)||0)/(Number(s.attempts)||1):null})}));
 return rows.sort((a,b)=>{if(a.due!==b.due)return a.due?-1:1; if(a.days!==b.days)return b.days-a.days; return (a.data.confidence||1)-(b.data.confidence||1)});
}
function repeatRecommendation(s){const acc=(Number(s.attempts)||0)?(Number(s.correct)||0)/(Number(s.attempts)||1):null;const interval=repeatInterval(s.confidence,acc,s.repeatCount||0);return {interval,accuracy:acc,next:addDays(today(),interval)}}

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
 lifeEnergy:'<path d="M12 3c-1.7 2.8-5 5.7-5 9.4A5 5 0 0 0 12 18a5 5 0 0 0 5-5.6C17 8.7 13.7 5.8 12 3Z"/><path d="M9.5 13.5a2.5 2.5 0 0 0 5 0"/>',
 discipline:'<path d="m12 3 2.1 4.2 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7L12 3Z"/>',
 finance:'<path d="M4 7h16v12H4z"/><path d="M4 10h16"/><path d="M8 15h3"/><path d="M15 14h.01"/>',
 simulator:'<path d="M12 3l2.2 5.1L19 10.3l-4.8 2.2L12 18l-2.2-5.5L5 10.3l4.8-2.2L12 3Z"/><path d="M19 4v4M21 6h-4"/>',
 friends:'<path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M16 14a5 5 0 0 1 5.5 6"/>',
 settings:'<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="m19.4 15 .1 1.8-2 1.1-1.5-1a8 8 0 0 1-2.1 1l-.5 1.7h-2.8L10 17.9a8 8 0 0 1-2.1-1l-1.5 1-2-1.1.1-1.8a8 8 0 0 1-1.1-2l-1.6-.5v-2.8l1.6-.5a8 8 0 0 1 1.1-2L4.4 5l2-1.1 1.5 1a8 8 0 0 1 2.1-1l.5-1.7h2.8l.5 1.7a8 8 0 0 1 2.1 1l1.5-1 2 1.1-.1 1.8a8 8 0 0 1 1.1 2l1.6.5v2.8l-1.6.5a8 8 0 0 1-1.1 2Z"/>',
};
function renderNavIcons(){
 $$('.nav-item[data-view]').forEach(btn=>{const ico=btn.querySelector('.ico');if(!ico)return;const key=btn.dataset.view;if(iconPaths[key])ico.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[key]}</svg>`;});
}
function navigate(view){const active=$$('.view.active')[0]?.id;if(view==='focus'&&active&&active!=='focus')focus.previousView=active;document.body.classList.toggle('focus-mode',view==='focus');$$('.view').forEach(v=>v.classList.toggle('active',v.id===view));$$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===view));const titles={dashboard:'Kontrol Merkezi',today:'Bugünün Sistemi',focus:'Focus Room',roadmap:'Konu Motoru',mock:'Deneme Merkezi',analytics:'Performans',discipline:'Disiplin Merkezi',lifeEnergy:'Yaşam & Enerji',finance:'Para Motoru',mistakes:'Hata Günlüğü',weekly:'Haftalık Koç',simulator:'Hedef Simülasyonu',settings:'Ayarlar'};$('#pageTitle').textContent=titles[view]||'Kontrol Merkezi';$('#contextLabel').textContent=view==='dashboard'?'NEXORA • COMMAND CENTER':longDate(today()).toUpperCase();window.scrollTo({top:0,behavior:'smooth'});setTimeout(renderNavIcons,0);if(view==='focus'){renderFocusTaskPicker();updateFocusStatus()} }
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
function energySnapshot(k=today()){
 const keys=[0,1,2].map(i=>addDays(k,-i));
 const days=keys.map(x=>state.days[x]).filter(Boolean);
 const avg=(arr,fb)=>arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:fb;
 const sleep=avg(days.filter(d=>Number.isFinite(Number(d.sleepHours))).map(d=>Number(d.sleepHours)),7);
 const energy=avg(days.filter(d=>Number.isFinite(Number(d.energyLevel))).map(d=>Number(d.energyLevel)),3.5);
 const phone=avg(days.filter(d=>Number.isFinite(Number(d.phoneMinutes))).map(d=>Number(d.phoneMinutes)),0);
 const exercise=avg(days.filter(d=>Number.isFinite(Number(d.exerciseMinutes))).map(d=>Number(d.exerciseMinutes)),0);
 const stress=avg(days.filter(d=>Number.isFinite(Number(d.stressLevel))).map(d=>Number(d.stressLevel)),3);
 const study=avg(days.map(d=>realStudyMinutes(d)),0);
 const sleepScore=clamp((sleep/8)*100,0,100);
 const energyScore=clamp((energy/5)*100,0,100);
 const phoneScore=phone?clamp(100-(Math.max(0,phone-30)/120*100),25,100):100;
 const exerciseScore=clamp(50+(exercise/60*50),50,100);
 const stressScore=clamp(100-((stress-1)/4*100),0,100);
 const capacityScore=clamp(Math.round(sleepScore*.30+energyScore*.27+phoneScore*.14+exerciseScore*.11+stressScore*.08+clamp((study/(state.settings.studyGoal||270))*100,0,100)*.10),25,100);
 const capacity=Math.round((Number(state.settings.studyGoal)||270)*capacityScore/100);
 let mode='NORMAL', tone='success', message='Enerjin çalışma için dengeli görünüyor.';
 if(capacityScore<55){mode='RECOVERY';tone='danger';message='Enerji düşük. Bugün yükü azaltıp kaliteli kısa bloklara odaklan.';}
 else if(capacityScore<72){mode='CONTROLLED';tone='purple';message='Orta kapasite. Önce en yüksek getirili blokları tamamla, hacmi zorlamaya gerek yok.';}
 return {sleep,energy,phone,exercise,stress,study,sleepScore,energyScore,phoneScore,exerciseScore,stressScore,capacityScore,capacity,mode,tone,message};
}
function applyEnergyToDay(d){
 // Discipline promises are explicit user actions.
 // Quick-data metrics inform the energy coach but never silently toggle promises.
 return d;
}
function adaptivePlan(){
 const d=ensureDay(); applyEnergyToDay(d); const e=energySnapshot(); const cal=targetCalendarData();
 const target=Math.min(Number(state.settings.studyGoal)||270, Math.max(120, e.capacity));
 const used=d.tasks.filter(t=>t.done&&['study','review'].includes(t.kind)).reduce((a,t)=>a+(Number(t.minutes)||0),0);
 let remaining=Math.max(0,target-used);
 const dueTopics=weakTopicDetails().filter(x=>x.next&&x.next<=today()).slice(0,2);
 const weak=weakTopicDetails().filter(x=>!dueTopics.includes(x)).slice(0,6);
 const plan=[];
 dueTopics.forEach(x=>{ if(remaining>=20){ const m=Math.min(30,remaining); plan.push({title:`Tekrar • ${x.topic}`,category:'Tekrar',minutes:m,reason:'Gecikmiş tekrar',topic:x.topic}); remaining-=m; }});
 const behind=Object.values(cal.areas).some(a=>a.status==='HIZ GEREKİYOR');
 const add=(title,category,minutes,reason,topic='')=>{if(remaining<=0)return;const m=Math.min(minutes,remaining);if(m>=20){plan.push({title:`AI • ${title}`,category,minutes:m,reason,topic});remaining-=m}};
 if(behind){
   weak.filter(x=>x.area==='AYT' && ['AYT Matematik','AYT Edebiyat'].includes(x.name)).slice(0,2).forEach(x=>add(`${x.topic} • ${x.name}`,'AYT',x.name==='AYT Matematik'?60:45,'Hedef takviminde tempo açığı',x.topic));
 }
 weak.filter(x=>x.name==='AYT Matematik').slice(0,1).forEach(x=>add(`${x.topic} • AYT Matematik`,'AYT',behind?45:60,'Yüksek öncelik / EA',x.topic));
 weak.filter(x=>x.name==='TYT Matematik').slice(0,1).forEach(x=>add(`${x.topic} • TYT Matematik`,'TYT',50,'TYT temel güçlendirme',x.topic));
 weak.filter(x=>x.name==='AYT Edebiyat').slice(0,1).forEach(x=>add(`${x.topic} • Edebiyat`,'AYT',45,'Hatırlama + aktif tekrar',x.topic));
 weak.filter(x=>x.area==='AYT'&&!['AYT Matematik','AYT Edebiyat'].includes(x.name)).slice(0,1).forEach(x=>add(`${x.topic} • ${x.name.replace('AYT ','')}`,'AYT',35,'AYT yan alan dengesi',x.topic));
 if(remaining>0)add('Paragraf + hata analizi','TYT',30,'Günlük taban');
 const recent7=lastStudyDays(7).reduce((a,x)=>a+x.mins,0);
 return {plan,remaining,used,recent7,reviews:dueTopics,weak,capacity:target,energy:e,calendar:cal,behind};
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
 const target=addDays(today(),1);
 const result=generateCoachPlan(target,'tomorrow');
 toast(result.added?`Yarın için ${result.added} akıllı blok oluşturuldu.`:'Yarın için yeni koç bloğu eklenmedi.');
 renderDashboard(); renderToday();
}
function coachSnapshot(){
 const d=ensureDay(); const e=energySnapshot(); const cal=targetCalendarData();
 const ranked=weaknessDetails(); const top=ranked[0]||null; const repeats=smartRepeatQueue().filter(x=>x.due).length;
 const goal=Number(state.settings.studyGoal)||270; const actual=realStudyMinutes(d); const remaining=Math.max(0,Math.round(goal-actual));
 const capacity=Math.round(e.capacity||goal); const target=Math.min(goal,capacity);
 const paceAreas=Object.values(cal?.areas||{}); const behind=paceAreas.filter(x=>x.status==='HIZ GEREKİYOR').length;
 let mode=e.mode;
 if(top?.urgency>=85||behind>=2) mode='PRIORITY';
 return {energy:e,top,repeats,goal,actual,remaining,capacity,target,behind,mode};
}
function coachNarrative(){
 const c=coachSnapshot(); const t=c.top;
 if(!t){ return {title:'Veri toplama modu',text:'Henüz yeterli performans verisi yok. İlk hafta amacımız seviyeni görmek, çalışma ritmini kurmak ve ilk deneme verisini üretmek.',actions:[['mock','İlk denemeni gir'],['today','Bugünün planı']]}; }
 if(c.mode==='RECOVERY') return {title:'Bugün kaliteyi koruyoruz',text:`Enerji kapasiten ${c.capacity}/100. Hedefi zorlamak yerine en yüksek getirili bloğu tamamla; ${c.repeats} gecikmiş tekrar varsa önce onları kapat.`,actions:[['lifeEnergy','Enerjiye bak'],['focus','Focus Room']]};
 if(c.mode==='PRIORITY') return {title:`Bugünün önceliği: ${t.label}`,text:`Risk ${t.urgency}/100. ${(t.keySignals||[]).slice(0,2).join(' • ')||'Bu alan diğerlerinden daha fazla dikkat istiyor.'} Bugünkü kapasiteni öncelikli çalışmaya ayır.`,actions:[['roadmap','Konu motoru'],['focus','Focus Room']]};
 return {title:'Ritim dengeli',text:`Bugün yaklaşık ${c.target} dk verimli çalışma kapasiten var. Öncelik ${t.label}; gecikmiş tekrarları kapatıp ana bloğu Focus Room'da tamamla.`,actions:[['today','Bugünün planı'],['focus','Focus Room']]};
}
function assistantInsight(){
 const c=coachSnapshot(),score=systemScore(ensureDay()),story=coachNarrative();
 return {h:story.title,p:story.text,a:story.actions,coach:c};
}
function targetSimulation(){
  const ty=clamp(Number($('#simTyt')?.value)||0,0,120);
  const ay=clamp(Number($('#simAyt')?.value)||0,0,80);
  const sg=Math.max(0,Number($('#simStudyGrowth')?.value)||0);
  const qg=Math.max(0,Number($('#simQuestionGrowth')?.value)||0);
  const tScore=ty/70; const aScore=ay/50;
  const readiness=Math.min(1,(tScore*.46+aScore*.54));
  const dataBoost=Math.min(1,(sg/300)*.55+(qg/250)*.45);
  const alignment=clamp(readiness*.72+dataBoost*.28,0,1);
  const tyNeed=Math.max(0,55-ty), ayNeed=Math.max(0,38-ay);
  const priority=ayNeed>=tyNeed?'AYT Matematik + AYT EA':'TYT Matematik + Türkçe';
  let scenario='Başlangıç çizgisi'; let tone='purple';
  if(alignment>=.80){scenario='Hedef yönü güçlü'; tone='success';}
  else if(alignment>=.60){scenario='İyi rota, tempo gerekli'; tone='success';}
  else if(alignment>=.35){scenario='Temel güçlendirme'; tone='purple';}
  else scenario='Veri üret + temel kur';
  return {ty,ay,sg,qg,alignment,tyNeed,ayNeed,priority,scenario,tone};
}
function targetCalendarData(){
 const exam=state.settings.examDate||DEFAULT_EXAM;
 const daysLeft=daysBetween(today(),exam);
 const weeksLeft=Math.max(1,Math.ceil(daysLeft/7));
 const bufferWeeks=Math.min(6,Math.max(2,Math.ceil(weeksLeft*0.12)));
 const contentWeeks=Math.max(1,weeksLeft-bufferWeeks);
 const areas={TYT:{total:0,done:0,subjects:[]},AYT:{total:0,done:0,subjects:[]}};
 allSubjects().forEach(([name,topics])=>{
   const area=areaOf(name), done=topics.filter((_,i)=>stateTopic(name,i).status==='done').length;
   const last4=topics.filter((_,i)=>{const d=stateTopic(name,i);return d.status==='done'&&d.last&&daysBetween(d.last,today())<=28}).length;
   const item={name,total:topics.length,done,remaining:Math.max(0,topics.length-done),last4};
   areas[area].total+=topics.length; areas[area].done+=done; areas[area].subjects.push(item);
 });
 Object.values(areas).forEach(a=>{a.remaining=Math.max(0,a.total-a.done);a.pct=a.total?Math.round(a.done/a.total*100):0;a.currentWeekly=Math.round((a.subjects.reduce((x,s)=>x+s.last4,0)/4)*10)/10;a.requiredWeekly=Math.ceil(a.remaining/contentWeeks*10)/10;a.requiredDaily=Math.ceil(a.remaining/Math.max(1,contentWeeks*7)*10)/10;a.status=a.remaining===0?'TAMAM':a.currentWeekly>=a.requiredWeekly?'ÖNDE':a.currentWeekly>0?'DENGELİ':'HIZ GEREKİYOR'});
 const total=areas.TYT.total+areas.AYT.total,totalDone=areas.TYT.done+areas.AYT.done,totalRemain=total-totalDone;
 const overallPct=total?Math.round(totalDone/total*100):0;
 return {exam,daysLeft,weeksLeft,bufferWeeks,contentWeeks,areas,total,totalDone,totalRemain,overallPct};
}

function executionIntelligence(){
 const r=targetCalendarData();
 const e=energySnapshot();
 const d=ensureDay();
 const completedToday=studyMinutes(d);
 const remainingCapacity=Math.max(0,e.capacity-completedToday);
 const contentDays=Math.max(1,r.contentWeeks*7);
 const baselineMinutesPerTopic=45;
 const dailyTopicMinutes=r.totalRemain?Math.ceil((r.totalRemain*baselineMinutesPerTopic/contentDays)/10)*10:0;
 const requiredToday=Math.min(Math.max(0,dailyTopicMinutes),Math.max(0,remainingCapacity));
 const velocityNeed=Math.max(r.areas.TYT.requiredWeekly,r.areas.AYT.requiredWeekly);
 const lagAreas=Object.entries(r.areas).filter(([_,a])=>a.status==='HIZ GEREKİYOR').map(([a])=>a);
 const behind=lagAreas.length>0 || (r.totalRemain>0 && r.overallPct<25 && r.weeksLeft<30);
 let status='ON TRACK',tone='success',headline='Rota kontrol altında',message='Bugünkü kapasite ile hedef takvimini destekleyecek kadar çalışma alanın var.';
 if(e.capacityScore<55){status='LOW CAPACITY';tone='danger';headline='Bugün kapasiteyi zorlamıyoruz';message=`Yaşam verilerin ${e.capacityScore}/100. Önce gecikmiş tekrarlar ve en yüksek getirili bloklar.`;}
 else if(behind){status='CATCH-UP';tone='purple';headline='Yetişme temposu gerekiyor';message=`Kalan ${r.totalRemain} konuyu ${r.contentWeeks} içerik haftasında kapatmak için yeni konu hızını yükseltmeliyiz.`;}
 else if(r.totalRemain===0){status='CONTENT COMPLETE';tone='success';headline='İçerik yükü tamam';message='Artık tekrar, deneme ve hata kapatma temposuna geçebiliriz.';}
 const targetMinutes=Math.max(120,Math.min(state.settings.studyGoal,e.capacity));
 const todayGap=Math.max(0,targetMinutes-completedToday);
 const topicBlocks=r.totalRemain?Math.max(0,Math.ceil(r.totalRemain/Math.max(1,r.contentWeeks))):0;
 return {r,e,d,completedToday,remainingCapacity,dailyTopicMinutes,requiredToday,velocityNeed,behind,status,tone,headline,message,targetMinutes,todayGap,topicBlocks};
}

function renderTargetCalendar(){
 const r=targetCalendarData();
 const h=$('#targetCalendarHero');if(h) h.innerHTML=`<div class="tc-hero-main"><span class="section-kicker">ROAD TO LAW / ${r.exam}</span><h3>Hedefe yetişme merkezi</h3><p>Mevcut konu hızını ölçüyor, sınava kadar içerik için gereken haftalık tempoyla karşılaştırıyoruz.</p><div class="tc-hero-row"><div><strong>${r.overallPct}%</strong><span>genel konu ilerlemesi</span></div><div><strong>${r.daysLeft}</strong><span>gün kaldı</span></div><div><strong>${r.contentWeeks}</strong><span>içerik haftası</span></div><div><strong>${r.bufferWeeks}</strong><span>tekrar/tampon hafta</span></div></div></div><div class="tc-hero-ring"><div><strong>${r.totalRemain}</strong><span>kalan konu</span></div></div>`;
 const summary=$('#targetSummary'); if(summary) summary.innerHTML=Object.entries(r.areas).map(([area,a])=>`<article class="tc-area-card"><div class="tc-area-head"><div><span class="section-kicker">${area}</span><h3>${area==='TYT'?'Temel Yeterlilik':'Alan Yeterlilik'}</h3></div><span class="tc-state ${a.status==='ÖNDE'?'good':a.status==='DENGELİ'?'warn':a.status==='TAMAM'?'good':'danger'}">${a.status}</span></div><div class="tc-progress"><i style="width:${a.pct}%"></i></div><div class="tc-metric-row"><div><span>Tamam</span><strong>${a.done}/${a.total}</strong></div><div><span>Kalan</span><strong>${a.remaining}</strong></div><div><span>Gerekli hız</span><strong>${a.requiredWeekly}/hf</strong></div><div><span>Mevcut</span><strong>${a.currentWeekly}/hf</strong></div></div><p>${a.remaining?`İçeriği ${r.contentWeeks} haftalık blokta bitirmek için haftada yaklaşık <b>${a.requiredWeekly}</b> yeni konu kapatmalısın.`:'Bu alandaki konu yükün tamamlandı; artık tekrar ve deneme kalitesine ağırlık ver.'}</p></article>`).join('');
 const grid=$('#targetSubjectGrid'); if(grid) grid.innerHTML=allSubjects().map(([name,topics])=>{const a=r.areas[areaOf(name)];const done=topics.filter((_,i)=>stateTopic(name,i).status==='done').length, remain=topics.length-done, last4=topics.filter((_,i)=>{const d=stateTopic(name,i);return d.status==='done'&&d.last&&daysBetween(d.last,today())<=28}).length, need=remain?Math.ceil(remain/r.contentWeeks*10)/10:0, current=Math.round(last4/4*10)/10, ratio=need?current/need:1, cls=ratio>=1?'good':ratio>=.65?'warn':'danger', eta=remain&&current>0?Math.ceil(remain/current):null;return `<article class="tc-subject"><div class="tc-subject-top"><div><span class="section-kicker">${areaOf(name)}</span><h3>${esc(name)}</h3></div><span class="tc-state ${cls}">${ratio>=1?'ÖNDE':ratio>=.65?'DENGELİ':'GERİDE'}</span></div><div class="tc-progress"><i style="width:${Math.round(done/topics.length*100)}%"></i></div><div class="tc-subject-stats"><span><b>${done}</b>/${topics.length} tamam</span><span><b>${remain}</b> kalan</span><span><b>${need}</b>/hf gerekli</span><span><b>${current}</b>/hf mevcut</span></div><small>${eta?`Mevcut hızla yaklaşık ${eta} haftada tamamlanır.`:remain?'Henüz yeterli hız verisi yok. Öncelik belirleyip yeni konu kapanışları üret.':'Konu yükü tamamlandı.'}</small></article>`}).join('');
 const timeline=$('#targetTimeline'); if(timeline){const weeks=Math.min(12,r.weeksLeft), remain=Math.max(0,r.totalRemain);timeline.innerHTML=Array.from({length:weeks},(_,idx)=>{const w=idx+1, planned=Math.ceil(remain/Math.max(1,r.contentWeeks)), cumulative=Math.min(remain,planned*w), pct=r.total?Math.round((r.totalDone+cumulative)/r.total*100):0; return `<div class="tc-week"><div><span>HAFTA ${w}</span><strong>${Math.max(0,planned)}</strong><small>yeni konu</small></div><div class="tc-mini"><i style="width:${pct}%"></i></div><b>${pct}%</b></div>`}).join('')||'<div class="empty">Takvim için konu verisi bekleniyor.</div>';}
 const coach=$('#targetCoach'); if(coach){const lag=Object.entries(r.areas).filter(([_,a])=>a.status==='HIZ GEREKİYOR').map(([area])=>area);const lead=Object.entries(r.areas).filter(([_,a])=>a.status==='ÖNDE').map(([area])=>area);let headline='Rota dengede';let text=`Kalan ${r.totalRemain} konuyu içerik bloğunda kapatıp son ${r.bufferWeeks} haftayı tekrar + denemeye ayırıyoruz.`;let action='Haftalık yeni konu kapanışını koru.';if(lag.length){headline=`${lag.join(' + ')} hız istiyor`;text=`Bu alanlarda mevcut yeni konu kapanış hızı hedef için yetersiz görünüyor.`;action=`Koç önerisi: ${lag.join(' + ')} için haftalık ek çalışma bloğu ekle.`}else if(lead.length){headline=`${lead.join(' + ')} önde`;text='Avantajı koru; fazla zamanı gecikmiş tekrarlar ve deneme analizine kaydır.';action='Koç önerisi: önde olduğun alanı büyütmek yerine zayıf alanı dengele.'}coach.innerHTML=`<div class="tc-coach-icon">✦</div><div><span class="section-kicker">COACH DECISION</span><h3>${headline}</h3><p>${text}</p><strong>${action}</strong></div>`;}
 const ex=executionIntelligence();
 const exBox=$('#executionIntelligence');
 if(exBox){
   const gap=ex.dailyTopicMinutes>ex.e.capacity?Math.max(0,ex.dailyTopicMinutes-ex.e.capacity):0;
   const toneClass=ex.tone==='danger'?'danger':ex.tone==='purple'?'purple':'success';
   exBox.innerHTML=`<div class="exec-hero"><div><span class="section-kicker">ADAPTIVE EXECUTION ENGINE</span><h3>${ex.headline}</h3><p>${ex.message}</p></div><span class="badge ${toneClass}">${ex.status}</span></div><div class="exec-metrics"><div><span>Bugünkü kapasite</span><strong>${ex.e.capacity} dk</strong><small>${ex.e.capacityScore}/100 yaşam kapasitesi</small></div><div><span>Bugün tamamlanan</span><strong>${ex.completedToday} dk</strong><small>Netleşen çalışma</small></div><div><span>Kalan günlük kapasite</span><strong>${ex.remainingCapacity} dk</strong><small>Koçun bugün kullanabileceği alan</small></div><div><span>Gerekli konu temposu</span><strong>${ex.dailyTopicMinutes} dk/gün</strong><small>${ex.r.totalRemain} kalan konu</small></div></div><div class="exec-compare"><div><div class="exec-compare-head"><span>BUGÜNÜN HEDEFİ</span><b>${ex.targetMinutes} dk</b></div><div class="exec-bar"><i style="width:${Math.min(100,ex.targetMinutes?ex.completedToday/ex.targetMinutes*100:0)}%"></i></div></div><div class="exec-compare-note ${gap>0?'warn':''}">${gap>0?`Bugünkü doğal kapasiten ${gap} dk geride. Koç planı hacmi değil önceliği koruyacak.`:`Bugünkü kapasite, hedef yükünü karşılıyor.`}</div></div><div class="exec-actions"><button class="primary-btn" data-coach-generate="today">✦ Bugünün koç planını uygula</button><button class="secondary-btn" data-route="today">Bugünün Sistemini aç →</button></div>`;
 }

}
function renderSimulation(){
  const r=targetSimulation();
  const pct=Math.round(r.alignment*100);
  if($('#simTytDisplay'))$('#simTytDisplay').textContent=r.ty.toFixed(r.ty%1?'2':'0');
  if($('#simAytDisplay'))$('#simAytDisplay').textContent=r.ay.toFixed(r.ay%1?'2':'0');
  if($('#simScore'))$('#simScore').textContent=`${pct}%`;
  if($('#simScoreBar'))$('#simScoreBar').style.width=`${pct}%`;
  if($('#simScoreText'))$('#simScoreText').textContent=pct===0?'Gerçek netlerini gir; simülasyon kişiselleşsin.':`${r.scenario} • 30K stretch hedefi için gelişim yönün izleniyor.`;
  if($('#simGapDisplay')) $('#simGapDisplay').textContent=(r.ty||r.ay)?`TYT +${r.tyNeed.toFixed(0)} • AYT +${r.ayNeed.toFixed(0)}`:'Veri bekleniyor';
  if($('#simTytNeed'))$('#simTytNeed').textContent=r.ty?`+${r.tyNeed} TYT net`:'TYT verisi bekleniyor';
  if($('#simAytNeed'))$('#simAytNeed').textContent=r.ay?`+${r.ayNeed} AYT net`:'AYT verisi bekleniyor';
  if($('#simCoachNeed'))$('#simCoachNeed').textContent=r.priority;
  if($('#simScenarioBadge')){const b=$('#simScenarioBadge');b.textContent=r.scenario.toUpperCase();b.className='badge '+(r.tone==='success'?'success':'purple')}
  if($('#simScenario')){
    const weeks=[]; for(let i=1;i<=4;i++){
      const tyGain=r.sg>0?Math.min(1.5,r.sg/240)*i:0;
      const qGain=r.qg>0?Math.min(1.2,r.qg/300)*i:0;
      const t=Math.min(120,r.ty+tyGain); const a=Math.min(80,r.ay+qGain);
      const al=clamp((t/70)*.46+(a/50)*.54,0,1);
      weeks.push(`<div class="sim-week"><span>HAFTA ${i}</span><strong>${Math.round(al*100)}%</strong><small>TYT ${t.toFixed(0)} • AYT ${a.toFixed(0)}</small></div>`);
    }
    $('#simScenario').innerHTML=weeks.join('');
  }
}
function dayPhase(){const h=new Date().getHours();if(h<12)return 'MORNING';if(h<18)return 'DAY';return 'EVENING';}
function briefingSnapshot(){
 const d=ensureDay(); const e=energySnapshot(); const ranked=weaknessDetails(); const top=ranked[0];
 const completed=realStudyMinutes(d); const target=Math.max(120,Math.min(state.settings.studyGoal,e.capacity));
 const open=d.tasks.filter(t=>!t.done); const overdue=weakTopicDetails().filter(x=>x.next&&x.next<=today()).length;
 const phase=dayPhase();
 let title='Güne başla. Önce yönü belirleyelim.'; let message=''; let focus='';
 if(phase==='MORNING'){
  title=e.capacityScore<55?'Bugün kontrollü başlıyoruz.':e.capacityScore<72?'Bugün seçici çalışıyoruz.':'Bugün güçlü bir çalışma günü.';
  message=`Kapasiten ${e.capacityScore}/100 • hedef çalışma ${target} dk. ${top?`${top.name} tarafında risk sinyali var.`:'Veri geldikçe öncelikler netleşecek.'}`;
  focus=top?`İlk blok: ${top.name} • ${recommendedAction(top).mins} dk`:'İlk blok: TYT Matematik • 50 dk';
 } else if(phase==='DAY'){
  title=completed>=target?'Ana hedefin tamamlandı.':`Günün kalanını akıllı kullanalım.`;
  message=`${completed} dk gerçek çalışma tamamlandı • ${Math.max(0,target-completed)} dk önerilen kapasite kaldı.`;
  focus=open[0]?`Sıradaki iş: ${open[0].title} • ${open[0].minutes||25} dk`:'Açık görev görünmüyor.';
 } else {
  title=completed>=target?'Gün güçlü kapatılıyor.':'Akşam kapanış moduna geçiyoruz.';
  message=`Bugün ${completed} dk çalıştın. ${overdue?`${overdue} gecikmiş tekrar var.`:'Gecikmiş tekrar sinyali yok.'}`;
  focus=open.length?`${open.length} açık görev var • yarına aktar veya tamamla.`:'Açık görev yok • günü kapat.';
 }
 return {d,e,phase,title,message,focus,target,completed,open,overdue};
}
function renderCoachBriefing(){
 const box=$('#coachBriefingCard'); if(!box)return; const x=briefingSnapshot();
 const done=x.d.briefingDone;
 box.innerHTML=`<div class="briefing-head"><div><span class="section-kicker">COACH BRIEFING • ${x.phase}</span><h3>${esc(x.title)}</h3><p>${esc(x.message)}</p></div><span class="badge ${x.e.capacityScore<55?'danger':x.e.capacityScore<72?'purple':'success'}">${x.e.capacityScore}/100</span></div><div class="briefing-grid"><div><span>ÖNERİLEN KAPASİTE</span><strong>${x.target} dk</strong></div><div><span>GERÇEKLEŞEN</span><strong>${x.completed} dk</strong></div><div><span>GECİKMİŞ TEKRAR</span><strong>${x.overdue}</strong></div><div><span>NEXT MOVE</span><strong>${esc(x.focus)}</strong></div></div><div class="briefing-actions"><button class="primary-btn" id="briefingAccept">${done?'Planı tekrar uygula':'Bugünün planını hazırla'}</button><button class="secondary-btn" data-route="today">Bugünün sistemine git →</button></div>`;
 const b=$('#briefingAccept'); if(b)b.onclick=()=>{const r=generateCoachPlan(today(),'today');x.d.briefingDone=true;save();renderAll();toast(r.added?`${r.added} koç bloğu eklendi.`:'Plan zaten güncel.');};
}
function renderEveningClose(){
 const box=$('#eveningCloseCard'); if(!box)return; const x=briefingSnapshot(); const d=x.d; const canClose=dayPhase()==='EVENING';
 const status=d.eveningClosedAt?'CLOSED':canClose?'READY':'WAITING';
 box.innerHTML=`<div class="evening-head"><div><span class="section-kicker">EVENING CLOSING</span><h3>${status==='CLOSED'?'Gün kapatıldı.':'Akşam Kapanışı'}</h3><p>${status==='WAITING'?'Akşam saatlerinde açılır.':status==='CLOSED'?'Bugünkü değerlendirme kaydedildi.':'Günü kapatmadan önce son kontrolünü yap.'}</p></div><span class="badge ${status==='CLOSED'?'success':status==='READY'?'purple':'muted'}">${status}</span></div><div class="evening-grid"><div><span>ÇALIŞMA</span><strong>${x.completed} dk</strong></div><div><span>TAMAMLANAN</span><strong>${d.tasks.filter(t=>t.done).length}/${d.tasks.length}</strong></div><div><span>AÇIK</span><strong>${x.open.length}</strong></div><div><span>ENERJİ</span><strong>${Number.isFinite(Number(d.energyLevel))?d.energyLevel+'/5':'—'}</strong></div></div><label class="evening-note-label">Bugünün tek cümlesi<textarea id="eveningReviewInput" class="note-area" placeholder="Bugün ne öğrendim, neyi yarına taşıyorum?">${esc(d.eveningReview||'')}</textarea></label><div class="evening-actions"><button class="secondary-btn" id="eveningSaveReview">Notu kaydet</button><button class="primary-btn" id="eveningCloseDay" ${status!=='READY'?'disabled':''}>Günü kapat</button></div>`;
 const saveReview=$('#eveningSaveReview');if(saveReview)saveReview.onclick=()=>{d.eveningReview=$('#eveningReviewInput').value.trim();save();renderEveningClose();toast('Akşam notu kaydedildi.');};
 const close=$('#eveningCloseDay');if(close)close.onclick=()=>{d.eveningReview=$('#eveningReviewInput').value.trim();d.eveningClosedAt=new Date().toISOString();save();renderAll();toast('Gün başarıyla kapatıldı.');};
}
function selectedProgram(){return state.settings.targetProgram==='Diğer / Kendim yazacağım'?(state.settings.customProgram||'Özel hedef'):state.settings.targetProgram||'Hukuk'}
function goalRankLabel(){const n=Number(state.settings.targetRank)||30000;return `≤${n.toLocaleString('tr-TR')}`}
function applyGoalProfileUI(){
 const program=selectedProgram(),track=trackMeta[state.settings.scoreType]||trackMeta.EA,rank=goalRankLabel();
 const map=[['.target-mini strong',`${program} • ${rank}`],['#subjectProgressText',document.querySelector('#subjectProgressText')?.textContent],['.target-copy strong',program],['.sim-target-card h3',`${program} • ${track.short}`],['.sim-target-card p',`Hedef sıralama <b>${rank}</b> • Kişisel çalışma hedefin`]];
 map.forEach(([sel,text])=>{document.querySelectorAll(sel).forEach((el,i)=>{if(text!==undefined&&text!==null)el.innerHTML=text})});
 document.querySelectorAll('[data-goal-track]').forEach(el=>{el.textContent=track.label});
 const mission=document.querySelector('.target-mini');if(mission){const small=mission.querySelector('small');if(small)small.textContent=`Puan türü: ${track.short}`}
 const settingsGoal=document.querySelector('#currentGoalProfile');if(settingsGoal)settingsGoal.textContent=`${program} • ${track.label} • ${rank}`;
}
function openGoalSetup(){
 const dlg=$('#goalSetupDialog');if(!dlg)return;goalSetupRender();dlg.showModal();
}
function goalSetupRender(preserveTrack=null,preserveProgram=null){
 const t=$('#goalTrack'),p=$('#goalProgram'),custom=$('#goalCustomProgram');if(!t||!p)return;
 const selectedTrack=preserveTrack||t.value||state.settings.scoreType||'EA';
 const previousProgram=preserveProgram!==null&&preserveProgram!==undefined?preserveProgram:p.value;
 const opts=goalCatalog[selectedTrack]||goalCatalog.EA;
 t.value=selectedTrack;
 p.innerHTML=opts.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
 const helper=$('#goalSetupHelper'); if(helper) helper.textContent=`${trackMeta[selectedTrack]?.label||selectedTrack} için hedef bölümünü seç. Hedef sıralaması tamamen sana ait; sistem çalışma planını bu hedefe göre ayarlar.`;
 const desiredProgram=previousProgram||state.settings.targetProgram||opts[0];
 p.value=opts.includes(desiredProgram)?desiredProgram:opts[0];
 if(custom){custom.value=state.settings.customProgram||'';custom.hidden=p.value!=='Diğer / Kendim yazacağım';custom.required=!custom.hidden}
 const rank=$('#goalRank');if(rank&&!rank.value)rank.value=String(state.settings.targetRank||30000);
 const chips=$('#goalRankPresets');if(chips){
   const currentRank=Number(rank?.value)||Number(state.settings.targetRank)||30000;
   chips.innerHTML=rankPresets.map(n=>`<button type="button" class="rank-chip ${currentRank===n?'active':''}" data-rank-preset="${n}">${n>=1000?(n/1000)+'K':n}</button>`).join('');
 }
 const rankPreview=$('#goalRankPreview'); if(rankPreview) rankPreview.textContent=(Number(rank?.value)||0)?`${Number(rank.value).toLocaleString('tr-TR')} sıra`:'Hedef belirle';
 const pv=$('#goalPreviewProgram'); if(pv) pv.textContent=(p.value==='Diğer / Kendim yazacağım'?(custom?.value?.trim()||'Özel hedef'):p.value)||'Henüz seçilmedi';
 const pt=$('#goalPreviewTrack'); if(pt) pt.textContent=trackMeta[selectedTrack]?.label||'Puan türü seçilmedi';
 const pr=$('#goalPreviewRank'); if(pr) pr.textContent=(Number(rank?.value)||0)?`≤${Number(rank.value).toLocaleString('tr-TR')}`:'≤—';
}
function saveGoalSetup(){
 const track=$('#goalTrack')?.value||'EA', program=$('#goalProgram')?.value||'', custom=($('#goalCustomProgram')?.value||'').trim();
 const finalProgram=program==='Diğer / Kendim yazacağım'?(custom||'Özel hedef'):program;
 state.settings.scoreType=track;
 state.settings.targetProgram=finalProgram;
 state.settings.customProgram=program==='Diğer / Kendim yazacağım'?custom:'';
 state.settings.targetRank=clamp(Number($('#goalRank')?.value)||30000,1,999999);
 state.settings.minRank=Math.max(state.settings.targetRank,Number(state.settings.minRank)||state.settings.targetRank);
 markOnboardingComplete();
 $('#goalSetupDialog')?.close();
 $('#onboardingDialog')?.close();
 renderAll();
 toast(`Hedefin kaydedildi: ${selectedProgram()} • ${goalRankLabel()}`);
}
function currentCloudUserId(){try{return window.hukukCloud?.getUserId?.()||''}catch{return ''}}
const ONBOARDING_DISMISSED_KEY='nexora-onboarding-dismissed-v3';
function hasCompleteGoal(){
 const st=state?.settings||{};
 return !!(st.onboardingComplete && st.scoreType && st.targetProgram && Number(st.targetRank)>0);
}
function shouldShowOnboarding(){
 if(hasCompleteGoal()) return false;
 const uid=currentCloudUserId();
 if(uid && state?.settings?.onboardingUserId && state.settings.onboardingUserId!==uid) return true;
 try{
   const dismissed=localStorage.getItem(`${ONBOARDING_DISMISSED_KEY}:${uid||'local'}`)==='1';
   return !dismissed;
 }catch{return true}
}
function markOnboardingComplete(){
 state.settings.onboardingComplete=true;
 state.settings.onboardingUserId=currentCloudUserId()||state.settings.onboardingUserId||'local';
 try{localStorage.setItem(`${ONBOARDING_DISMISSED_KEY}:${state.settings.onboardingUserId}`,'1');}catch{}
 save();
}
function maybeOpenOnboarding(){
 if(!shouldShowOnboarding()) return;
 const dlg=$('#onboardingDialog');
 if(dlg&&!dlg.open){onboardingRender();try{dlg.showModal()}catch{dlg.setAttribute('open','')}}
}
function onboardingRender(){
 const hasGoal=!!state.settings.targetProgram; const program=hasGoal?selectedProgram():'Henüz hedef seçilmedi'; const track=trackMeta[state.settings.scoreType]; const step=$('#onboardingGoalStep');if(step)step.textContent=track?`${track.label} • ${program}`:program;
 const rank=$('#onboardingRank');if(rank)rank.textContent=hasGoal?`Hedef sıra: ${goalRankLabel()}`:'Puan türü, bölüm ve hedef sıralamanı belirle.';
}
function renderDashboard(){
 const d=ensureDay(),score=systemScore(d),stats=topicStats(),p=adaptivePlan(),read=readiness(),rd=readinessDisplay();
 $('#scoreBig').textContent=score;$('#scoreBar').style.width=score+'%';$('#studyBig').textContent=studyMinutes(d);$('#studyGoalSmall').textContent=state.settings.studyGoal;$('#streakBig').textContent=streak();$('#countdownBig').textContent=daysToExam();
 $('#heroDay').textContent=new Intl.DateTimeFormat('tr-TR',{weekday:'short'}).format(new Date()).toUpperCase();$('#heroDate').textContent=pad(new Date().getDate());
 $('#subjectProgress').style.width=stats.pct+'%';$('#subjectProgressText').textContent=stats.pct+'%';
 const ai=assistantInsight();$('#assistantHeadline').textContent=ai.h;$('#assistantText').textContent=ai.p;const planBtn=`<button data-coach-generate="today">✦ Koç planını uygula</button>`;$('#assistantActions').innerHTML=ai.a.map(([v,t])=>`<button data-route="${v}">${t}</button>`).join('')+planBtn+`<div class="assistant-readiness ${rd.value===null?'is-pending':''}"><span>${rd.value===null?'VERİ DURUMU':'READINESS'}</span><b>${rd.label}</b><small>${rd.value===null?rd.sub:`${daysToExam()} gün • hedef ≤${state.settings.targetRank.toLocaleString('tr-TR')}`}</small></div>`;
 const open=d.tasks.filter(t=>!t.done);$('#remainingTasks').textContent=open.length;$('#questionProgress').textContent=`${d.questions||0} / ${state.settings.questionGoal}`;$('#todayCompletion').textContent=taskPct(d)+'%';$('#priorityTask').innerHTML=open[0]?`<div class="priority-label">NEXT BEST ACTION</div><strong>${esc(open[0].title)}</strong><span>${open[0].minutes||0} dk • ${esc(open[0].category)}</span>`:`<div class="priority-label">SYSTEM COMPLETE</div><strong>Tüm görevler kapalı.</strong><span>Günü kapat ve notunu yaz.</span>`;
 const ds=lastStudyDays(7);$('#weeklyStudyLabel').textContent=`${ds.reduce((a,x)=>a+x.mins,0)} dk`;$('#weeklyChart').innerHTML=ds.map(x=>`<div class="bar-col"><div class="bar-track"><i style="height:${clamp(Math.round(x.mins/Math.max(state.settings.studyGoal,...ds.map(q=>q.mins),1)*100),2,100)}%"></i></div><span>${new Intl.DateTimeFormat('tr-TR',{weekday:'short'}).format(new Date(x.k+'T12:00:00'))}</span><small>${x.mins}</small></div>`).join('');
 const mocks=latestMocks().slice(-4).reverse();$('#recentPerformance').innerHTML=mocks.length?mocks.map(m=>`<div class="stack-row"><div><span class="badge ${m.type==='TYT'?'success':'purple'}">${m.type}</span><strong>${m.net.toFixed(2)} net</strong></div><small>${fmtDate(m.date)}</small></div>`).join(''):'<div class="empty">İlk denemeni girdikten sonra burada trend görünecek.</div>';
 const ws=weaknessDetails().slice(0,3);$('#weaknessRadar').innerHTML=ws.length?ws.map((w,i)=>{const acc=w.accuracy&&w.attempts?` • soru başarısı %${Math.round(w.accuracy*100)}`:'';const detail=w.overdue?`${w.overdue} gecikmiş tekrar • `:w.stale?`${w.stale} bayat konu • `:'';return `<button class="radar-row radar-click" data-radar="${encodeURIComponent(w.name)}" title="${esc(w.name)}: sağlık ${w.health}/100, öncelik ${w.urgency}/100"><div><span class="radar-num">0${i+1}</span><strong>${esc(w.label)}</strong><small>${detail}${w.done}/${w.total} konu tamam${acc}</small></div><div><div class="radar-bar"><i style="width:${w.urgency}%"></i></div><small class="radar-meta">Risk ${w.urgency} • Sağlık ${w.health}</small></div><b>${w.urgency}</b></button>`}).join(''):'<div class="empty">Radar için konu verisi oluştuğunda burada öncelik sırası görünecek.</div>';
 const top=ws[0];renderCoachExplanation(top);
 renderDisciplineMini();
 applyGoalProfileUI();
}

function renderDisciplineMini(){const d=ensureDay(),s=habitScore(d);$('#disciplineMiniScore').textContent=`${s}/5`;$('#disciplineMini').innerHTML=habitDefs.map(([k,n,sub])=>`<div class="discipline-line"><button class="tiny-check ${d.habits[k]?'on':''}" data-habit="${k}">${d.habits[k]?'✓':''}</button><span>${n}<small>${sub}</small></span><small>${d.habits[k]?'Tamam':'Bekliyor'}</small></div>`).join('')}

function dailyAutomation(){
 const d=ensureDay();
 const now=new Date();
 const hour=now.getHours();
 const p=adaptivePlan();
 const e=energySnapshot();
 const open=d.tasks.filter(t=>!t.done);
 const done=d.tasks.filter(t=>t.done);
 const target=Math.max(0,p.capacity);
 const completed=Math.round(realStudyMinutes(d));
 const remaining=Math.max(0,target-completed);
 const afterWork=hour>=16;
 let phase='MORNING',title='Günün çekirdeğini kur';message='Sabah verimli bloklarını koru; bugün en yüksek getirili akademik işi öne al.';
 if(hour>=12&&hour<16){phase='MIDDAY';title='Öğleden sonra yönünü koru';message='Günün kalan kapasitesini en öncelikli görevlere ayır; 16.00 iş bloğu başlayınca akademik yükü zorlamıyoruz.';}
 if(hour>=16&&hour<23){phase='WORK';title='İş bloğu başladı';message='Spor salonu işini koru. Müsait olduğunda antrenman yap; yeni ağır akademik blok eklemek yerine mevcut planı tamamla.';}
 if(hour>=23){phase='EVENING';title='Günü kapat ve yarını hazırla';message='Bugünün gerçek verisini kilitle, açık kalan işleri yarına taşı ve uyku hedefini koru.';}
 if(e.capacityScore<55){phase='RECOVERY';title='Enerji düşük • kaliteyi koru';message='Bugün kapasiteyi zorlamıyoruz. Gecikmiş tekrarlar ve en yüksek getirili tek blok öncelikli.';}
 const completion=target?Math.min(100,Math.round(completed/target*100)):0;
 const openAcademic=open.filter(t=>['study','review'].includes(t.kind));
 const next=openAcademic[0]||open[0];
 const eveningReady=phase==='EVENING';
 return {d,p,e,phase,title,message,target,completed,remaining,completion,next,open,done,eveningReady,afterWork};
}
function renderDailyAutomation(){
 const box=$('#dailyAutomationCard'); if(!box)return;
 const x=dailyAutomation();
 const status=x.e.capacityScore<55?'RECOVERY':x.completion>=100?'ON TARGET':x.remaining>0?'IN PROGRESS':'READY';
 const tone=x.e.capacityScore<55?'danger':x.completion>=100?'success':'purple';
 const next=x.next;
 const evening=`<button class="secondary-btn" id="carryOpenTasks">Açıkları yarına aktar</button><button class="ghost-btn" id="dailyClosePrompt">Gün sonu kontrolü</button>`;
 box.innerHTML=`<div class="daily-auto-head"><div><span class="section-kicker">DAILY AUTOPILOT • ${x.phase}</span><h3>${x.title}</h3><p>${x.message}</p></div><span class="badge ${tone}">${status}</span></div><div class="daily-auto-grid"><div class="daily-auto-stat"><span>Bugünkü kapasite</span><strong>${x.target} dk</strong><small>${x.e.capacityScore}/100 yaşam kapasitesi</small></div><div class="daily-auto-stat"><span>Gerçekleşen</span><strong>${x.completed} dk</strong><small>${x.completion}% hedef tamamlandı</small></div><div class="daily-auto-stat"><span>Kalan</span><strong>${x.remaining} dk</strong><small>${x.open.length} açık görev</small></div><div class="daily-auto-stat"><span>Sonraki hamle</span><strong>${next?x.next.minutes+' dk':'—'}</strong><small>${next?esc(next.title):'Açık görev yok'}</small></div></div><div class="daily-auto-progress"><div><span>GÜNÜN GERÇEKLEŞME ORANI</span><b>${x.completion}%</b></div><div class="daily-auto-bar"><i style="width:${x.completion}%"></i></div></div><div class="daily-auto-actions"><button class="primary-btn" data-coach-generate="today">✦ Koç planını uygula</button><button class="secondary-btn" data-route="focus">Focus Room'a geç →</button>${x.eveningReady?evening:''}</div>`;
 const carry=$('#carryOpenTasks');
 if(carry) carry.onclick=()=>{const target=addDays(today(),1),td=ensureDay(target);let added=0;x.open.filter(t=>!t.done).slice(0,6).forEach(t=>{if(!td.tasks.some(y=>y.title===t.title&& !y.done)){td.tasks.push({...t,id:uid('task'),done:false,source:'carry-over',carriedFrom:today()});added++;}});save();renderAll();toast(added?`${added} açık görev yarına aktarıldı.`:'Yarına aktarılacak yeni görev yok.');};
 const close=$('#dailyClosePrompt');
 if(close) close.onclick=()=>{const open=x.open.filter(t=>!t.done).length;toast(open?`Kapanış için ${open} açık görev var. Açıkları aktarabilir veya tamamlayabilirsin.`:'Gün kapanış için hazır.');};
 renderCoachBriefing();
}
function renderToday(){
 const d=ensureDay(),p=adaptivePlan();
 renderDailyAutomation();$('#taskCountBadge').textContent=`${d.tasks.filter(t=>t.done).length}/${d.tasks.length}`;$('#taskList').innerHTML=d.tasks.map(t=>`<div class="task-item ${t.done?'done':''}"><button class="task-check ${t.done?'on':''}" data-task="${t.id}">${t.done?'✓':''}</button><div><div class="task-title">${esc(t.title)}</div><div class="task-meta">${esc(t.category)} • ${t.kind==='study'?'Akademik':t.kind==='work'?'Para / iş':'Life'}${t.ai?' • ✦ ASİSTAN':''}${t.reason?` • ${esc(t.reason)}`:''}</div></div><div class="task-min">${t.minutes||0} dk</div></div>`).join('');
 $('#scheduleList').innerHTML=schedule.map(x=>`<div class="schedule-item"><div class="schedule-time">${x[0]}</div><div><strong>${x[2]}</strong><p>${x[3]}</p></div><span>${x[4]}</span></div>`).join('');
 $('#habitScoreBadge').textContent=`${habitScore(d)}/5`;$('#habitList').innerHTML=habitDefs.map(([k,n,sub])=>`<button type="button" class="habit-btn ${d.habits[k]?'on':''}" data-habit="${k}" aria-pressed="${!!d.habits[k]}"><span class="hc">${d.habits[k]?'✓':'○'}</span><strong>${n}</strong><small>${d.habits[k]?'Tamamlandı':'Henüz tamamlanmadı'} • ${sub}</small></button>`).join('');$('#dayNote').value=d.note||'';
 ensureQuickInput(); renderEnergyCard();
}
function ensureQuickInput(){
 const wrap=$('#today .day-layout')?.parentElement || $('#today'); if(!wrap)return;
 let card=$('#dailyQuickCard');
 if(!card){
   card=document.createElement('article'); card.id='dailyQuickCard'; card.className='card quick-data-card';
   card.innerHTML=`<div class="card-head"><div><span class="section-kicker">DAILY DATA</span><h3>Hızlı veri girişi</h3><p class="quick-helper">Bugünün gerçek verilerini gir. Koç yalnızca kaydettiğin veriyi kullanır.</p></div><span class="badge purple">LIVE INPUT</span></div>
   <div class="quick-grid life-quick-grid">
     <label>Soru sayısı<input id="dailyQuestions" type="number" min="0" max="3000" inputmode="numeric" value="0"></label>
     <label>Telefon süresi <span class="field-hint">dakika</span><input id="dailyPhone" type="number" min="0" max="1440" inputmode="numeric" value="0"></label>
     <label>Uyku <span class="field-hint">saat</span><input id="dailySleep" type="number" min="0" max="14" step="0.1" inputmode="decimal" placeholder="7.5"></label>
     <div class="quick-choice-field"><div class="quick-label">Enerji <span>1 düşük • 5 yüksek</span></div><div id="dailyEnergyChoices" class="segmented-row" role="group" aria-label="Enerji"></div><input id="dailyEnergy" type="hidden"></div>
     <label>Egzersiz <span class="field-hint">dakika</span><input id="dailyExercise" type="number" min="0" max="600" inputmode="numeric" value="0"></label>
     <div class="quick-choice-field"><div class="quick-label">Stres <span>1 düşük • 5 yüksek</span></div><div id="dailyStressChoices" class="segmented-row" role="group" aria-label="Stres"></div><input id="dailyStress" type="hidden"></div>
     <button id="saveDailyData" type="button" class="primary-btn quick-save">Verileri kaydet</button>
   </div>`;
   wrap.insertBefore(card,wrap.firstChild);
 }
 const d=ensureDay();
 $('#dailyQuestions').value=d.questions||0; $('#dailyPhone').value=d.phoneMinutes||0; $('#dailySleep').value=d.sleepHours??''; $('#dailyExercise').value=d.exerciseMinutes??0;
 const buildChoices=(hostId,inputId,labelMap)=>{const host=$(`#${hostId}`),input=$(`#${inputId}`);if(!host||!input)return;const current=Number(input.value||'0');host.innerHTML=[1,2,3,4,5].map(v=>`<button type="button" class="seg-btn ${current===v?'active':''}" data-quick-value="${inputId}" data-value="${v}" aria-pressed="${current===v}">${labelMap[v]||v}</button>`).join('');};
 $('#dailyEnergy').value=d.energyLevel??''; $('#dailyStress').value=d.stressLevel??'';
 buildChoices('dailyEnergyChoices','dailyEnergy',{1:'1',2:'2',3:'3',4:'4',5:'5'}); buildChoices('dailyStressChoices','dailyStress',{1:'1',2:'2',3:'3',4:'4',5:'5'});
 if(!card.dataset.bound){
   card.dataset.bound='1';
   card.addEventListener('click',e=>{const b=e.target.closest('[data-quick-value]');if(!b)return;const input=$(`#${b.dataset.quickValue}`);if(!input)return;input.value=b.dataset.value;card.querySelectorAll(`[data-quick-value="${b.dataset.quickValue}"]`).forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});});
   $('#saveDailyData').onclick=()=>{
     const d=ensureDay(); d.questions=Math.max(0,Number($('#dailyQuestions').value)||0); d.phoneMinutes=Math.max(0,Number($('#dailyPhone').value)||0);
     d.sleepHours=$('#dailySleep').value===''?null:clamp(Number($('#dailySleep').value)||0,0,14);
     d.energyLevel=$('#dailyEnergy').value===''?null:clamp(Number($('#dailyEnergy').value)||0,1,5);
     d.exerciseMinutes=Math.max(0,Number($('#dailyExercise').value)||0); d.stressLevel=$('#dailyStress').value===''?null:clamp(Number($('#dailyStress').value)||0,1,5);
     applyEnergyToDay(d); save(); renderAll(); toast('Günlük veriler kaydedildi ve koça işlendi.');
   };
 }
}function renderEnergyCard(){
 const host=$('#energyCoachCard');if(!host)return;const e=energySnapshot();const d=ensureDay();const sleep=Number.isFinite(Number(d.sleepHours))?`${Number(d.sleepHours).toFixed(1)} saat`:'—';const energy=Number.isFinite(Number(d.energyLevel))?`${d.energyLevel}/5`:'—';const ex=Number.isFinite(Number(d.exerciseMinutes))?`${d.exerciseMinutes} dk`:'—';const phone=Number.isFinite(Number(d.phoneMinutes))?`${d.phoneMinutes} dk`:'—';const stress=Number.isFinite(Number(d.stressLevel))?`${d.stressLevel}/5`:'—';host.innerHTML=`<div class="energy-hero"><div><span class="section-kicker">LIFE OS / ENERGY COACH</span><h3>Bugünkü kapasite: <b>${e.capacityScore}/100</b></h3><p>${e.message}</p></div><span class="badge ${e.tone}">${e.mode}</span></div><div class="energy-grid"><div><span>Uyku</span><strong>${sleep}</strong></div><div><span>Enerji</span><strong>${energy}</strong></div><div><span>Telefon</span><strong>${phone}</strong></div><div><span>Egzersiz</span><strong>${ex}</strong></div><div><span>Stres</span><strong>${stress}</strong></div></div><div class="energy-bar"><i style="width:${e.capacityScore}%"></i></div><div class="energy-decision"><span>ÖNERİLEN NET ÇALIŞMA KAPASİTESİ</span><strong>${e.capacity} dk</strong><small>Temel hedefin ${state.settings.studyGoal} dk. Koç, bugünkü yaşam verisine göre hacmi ayarlıyor.</small></div>`;
}
function renderRepeatEngine(){
 const el=$('#repeatEngine');if(!el)return;
 const queue=smartRepeatQueue();const due=queue.filter(x=>x.due).slice(0,8);
 const upcoming=queue.filter(x=>!x.due).slice(0,5);
 const label=x=>x.due?`Gecikti • ${x.days} gün`:x.data.next===today()?'Bugün':`Yaklaşık ${Math.max(1,Math.abs(x.days))} gün`;
 el.innerHTML=`<div class=\"repeat-hero\"><div><span class=\"section-kicker\">SPACED REPETITION</span><h3>Akıllı tekrar kuyruğu</h3><p>Güven, soru başarısı ve tekrar geçmişine göre bir sonraki dönüş otomatik planlanır.</p></div><div class=\"repeat-count\"><strong>${due.length}</strong><span>bugün öncelikli</span></div></div>
 <div class=\"repeat-grid\"><div><div class=\"repeat-head\"><strong>Şimdi tekrar et</strong><span>${due.length} konu</span></div>${due.length?due.map(x=>`<button class=\"repeat-row repeat-due\" data-repeat-open=\"${encodeURIComponent(x.name)}|${x.i}\"><div><strong>${esc(x.topic)}</strong><small>${esc(x.name)} • güven ${x.data.confidence||0}/5 ${x.accuracy===null?'• veri yok':`• %${Math.round(x.accuracy*100)}`}</small></div><b>${label(x)} ↗</b></button>`).join(''):'<div class=\"repeat-empty\">Bugün gecikmiş tekrar yok. Ritim iyi gidiyor.</div>'}</div><div><div class=\"repeat-head\"><strong>Sıradaki dönüşler</strong><span>Önümüzde</span></div>${upcoming.length?upcoming.map(x=>`<button class=\"repeat-row\" data-repeat-open=\"${encodeURIComponent(x.name)}|${x.i}\"><div><strong>${esc(x.topic)}</strong><small>${esc(x.name)} • güven ${x.data.confidence||0}/5</small></div><b>${fmtDate(x.data.next)}</b></button>`).join(''):'<div class=\"repeat-empty\">Henüz planlanmış tekrar yok.</div>'}</div></div>`;
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
function saveTopicSession(){const key=$('#topicDetailKey').value;if(!key)return;const [encName,iRaw]=key.split('|');const name=decodeURIComponent(encName),i=Number(iRaw);const prev=stateTopic(name,i);const minutes=Math.max(0,Number($('#topicStudyMinutes').value)||0);const questions=Math.max(0,Number($('#topicQuestions').value)||0);let correct=Math.max(0,Number($('#topicCorrect').value)||0);let wrong=Math.max(0,Number($('#topicWrong').value)||0);if(questions>0){correct=Math.min(correct,questions);wrong=Math.min(wrong,questions-correct);if(correct+wrong<questions)wrong=questions-correct}const status=$('#topicDetailStatus').value,confidence=clamp(Number($('#topicDetailConfidence').value)||1,1,5),note=$('#topicDetailNote').value.trim();const attempts=(Number(prev.attempts)||0)+questions, correctTotal=(Number(prev.correct)||0)+correct, wrongTotal=(Number(prev.wrong)||0)+wrong, acc=attempts?correctTotal/attempts:null;let next=prev.next, repeatCount=Number(prev.repeatCount)||0;if(status==='done'||status==='review'||questions>0){const rec=repeatRecommendation({confidence,attempts,correct:correctTotal,repeatCount:repeatCount+(questions>0?1:0)});next=rec.next;repeatCount+=1;}state.subjects[name]??={};state.subjects[name][i]={...prev,status,confidence,last:today(),next,attempts,correct:correctTotal,wrong:wrongTotal,studyMinutesTotal:(Number(prev.studyMinutesTotal)||0)+minutes,sessionCount:(Number(prev.sessionCount)||0)+1,repeatCount,note,lastNote:note,lastScore:questions?Number((correct/questions*100).toFixed(1)):prev.lastScore};if(minutes>0){const d=ensureDay();d.studyMinutes=(Number(d.studyMinutes)||0)+minutes}save();$('#topicDetailDialog')?.close();renderAll();toast(`${name} • ${curriculum[name][i]} oturumu kaydedildi.`)}
function addTopicToToday(){const key=$('#topicAddToToday').dataset.topicAdd;if(!key)return;const [encName,iRaw]=key.split('|');const name=decodeURIComponent(encName),i=Number(iRaw),topic=curriculum[name]?.[Number(i)];if(!topic)return;const d=ensureDay();const title=`${name} • ${topic}`;if(d.tasks.some(t=>t.title===title&&!t.done)){toast('Bu konu bugün zaten planda.');return}d.tasks.push({id:uid('task'),title,category:areaOf(name),minutes:name.includes('AYT')?60:45,kind:'study',done:false,source:'topic-motor',topicKey:`${name}|${i}`});save();renderAll();toast('Konu bugünün planına eklendi.')}

function mistakeTypeLabel(x){return ({concept:'Konu eksiği',careless:'Dikkat',time:'Zaman',interpretation:'Yorum',formula:'Formül',memory:'Bilgi',strategy:'Strateji'})[x]||'Diğer'}
function addMistake(m){state.mistakes.push({id:uid('mistake'),date:m.date||today(),mockId:m.mockId||'',type:m.type||'concept',subject:m.subject||'',topic:m.topic||'',note:m.note||'',severity:Number(m.severity)||3});save();}
function mistakeStats(){const byTopic={},byType={};for(const m of state.mistakes){const k=m.topic||m.subject||'Genel';byTopic[k]=(byTopic[k]||0)+1;byType[m.type]=(byType[m.type]||0)+1;}return {byTopic,byType};}
function coachMistakeInsight(){const st=mistakeStats();const top=Object.entries(st.byTopic).sort((a,b)=>b[1]-a[1])[0];return top?`${top[0]} alanında ${top[1]} hata kaydı var. Bir sonraki çalışma bloğunda bu konuya hata analizi ekle.`:'Henüz hata günlüğü oluşmadı. Denemelerde yanlışlarını konu ve hata türüyle kaydet.'}
function renderMock(){
 const m=state.mocks.slice().sort((a,b)=>b.date.localeCompare(a.date)),t=m.filter(x=>x.type==='TYT'),a=m.filter(x=>x.type==='AYT EA');const avg=x=>x.length?(x.reduce((s,y)=>s+y.net,0)/x.length):0;
 const rr=readiness();$('#mockKpis').innerHTML=`${[['Toplam',m.length,'deneme'],['TYT ort.',avg(t).toFixed(2),'net'],['AYT EA ort.',avg(a).toFixed(2),'net'],[rr===null?'Veri durumu':'Readiness',rr===null?'—':rr,rr===null?'bekleniyor':' / 100']].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('')}`;
 const f=$('#mockFilter').value,arr=m.filter(x=>f==='ALL'||x.type===f);$('#mockTable').innerHTML=arr.length?`<div class="mock-header"><span>TÜR</span><span>NET</span><span>TARİH</span><span>KIRILIM</span><span></span></div>`+arr.map(x=>`<div class="mock-row"><div><span class="badge ${x.type==='TYT'?'success':'purple'}">${x.type}</span></div><div><strong>${x.net.toFixed(2)}</strong></div><div><span>${fmtDate(x.date)}</span></div><div class="mock-sub"><span>T/E ${x.breakdown?.turkce??x.breakdown?.edebiyat??'—'}</span><span>M ${x.breakdown?.math??'—'}</span><span>S ${x.breakdown?.social??'—'}</span><span>F ${x.breakdown?.science??'—'}</span></div><div class="mock-actions"><button class="small-btn" data-analyze-mock="${x.id}">+ Hata</button><button class="danger-btn" data-delmock="${x.id}">Sil</button></div></div>`).join(''):'<div class="empty">Deneme yok. İlk kaydınla veri motorunu başlat.</div>';
 renderMockIntelligence();
}
function renderMockIntelligence(){
 const ms=state.mistakes||[],byTopic={};ms.forEach(x=>{const k=x.topic||x.subject||'Genel';byTopic[k]=(byTopic[k]||0)+1;});
 const top=Object.entries(byTopic).sort((a,b)=>b[1]-a[1])[0];
 const topicEl=$('#mockIntelTopic'),topicText=$('#mockIntelTopicText');if(top){if(topicEl)topicEl.textContent=top[0];if(topicText)topicText.textContent=`${top[1]} hata kaydı. Bu alanı sonraki planın ilk sıralarına taşı.`}else{if(topicEl)topicEl.textContent='Veri bekleniyor';if(topicText)topicText.textContent='Bir denemeye ait ilk hatanı konu ve hata tipiyle kaydet.'}
 const trendFor=a=>a.length>=2?Number((a.at(-1).net-a[0].net).toFixed(2)):null;const tt=trendFor(latestMocks('TYT').slice(-3)),aa=trendFor(latestMocks('AYT EA').slice(-3));let trend='—',trendText='Henüz yeterli deneme yok.';if(tt!==null||aa!==null){const bits=[];if(tt!==null)bits.push(`TYT ${tt>0?'+':''}${tt}`);if(aa!==null)bits.push(`AYT ${aa>0?'+':''}${aa}`);trend=bits.join(' • ')+' net';trendText='Son üç denemedeki yaklaşık değişim.'}if($('#mockIntelTrend'))$('#mockIntelTrend').textContent=trend;if($('#mockIntelTrendText'))$('#mockIntelTrendText').textContent=trendText;
 let action='Veri topla',actionText='İlk denemeni ve yanlışlarını kaydet; koç motoru sinyali güçlensin.';if(top){action=`${top[0]} tekrar`;actionText=`${top[1]} hata kaydı nedeniyle konuya özel soru + yanlış analizi öneriliyor.`}if(aa!==null&&aa<0){action='AYT Matematik öncelik';actionText='AYT trendi geriliyorsa matematik çalışma ve hata analizi hacmini artır.'}if($('#mockIntelAction'))$('#mockIntelAction').textContent=action;if($('#mockIntelActionText'))$('#mockIntelActionText').textContent=actionText;
}
function populateMistakeMockOptions(selected=''){const sel=$('#mistakeMockId');if(!sel)return;const arr=state.mocks.slice().sort((a,b)=>b.date.localeCompare(a.date));sel.innerHTML='<option value="">Genel çalışma hatası</option>'+arr.map(x=>`<option value="${x.id}">${esc(x.type)} • ${fmtDate(x.date)} • ${Number(x.net).toFixed(2)} net</option>`).join('');sel.value=arr.some(x=>x.id===selected)?selected:'';}
function lineSvg(values,labels){if(values.length<2)return '<div class="empty">Trend için en az 2 deneme gerekir.</div>';const w=760,h=250,p=26,min=Math.min(...values),max=Math.max(...values),range=Math.max(1,max-min);const pts=values.map((v,i)=>{const x=p+i*(w-2*p)/(values.length-1),y=h-p-((v-min)/range)*(h-2*p);return [x,y]}),path=pts.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' ');return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="gline" x1="0" x2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".2"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs><path d="${path}" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="${path} L ${pts.at(-1)[0]} ${h-p} L ${pts[0][0]} ${h-p} Z" fill="url(#gline)" opacity=".35"/>${pts.map((q,i)=>`<circle cx="${q[0]}" cy="${q[1]}" r="5" fill="currentColor"><title>${labels[i]} • ${values[i]}</title></circle>`).join('')}</svg>`}
function renderAnalytics(){
 const t=latestMocks('TYT').slice(-10),a=latestMocks('AYT EA').slice(-10),td=lastStudyDays(14);$('#analyticsKpis').innerHTML=`${[['TYT son',t.at(-1)?.net?.toFixed(2)||'—','net'],['AYT EA son',a.at(-1)?.net?.toFixed(2)||'—','net'],['14 gün ders',td.reduce((s,x)=>s+x.mins,0),'dk'],[readiness()===null?'Veri durumu':'Readiness',readiness()===null?'—':readiness(),readiness()===null?'bekleniyor':' / 100']].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('')}`;
 $('#netChart').innerHTML=t.length<2?'<div class="empty">Trend için en az 2 TYT denemesi kaydet.</div>':lineSvg(t.map(x=>x.net),t.map(x=>fmtDate(x.date)));
 const max=Math.max(state.settings.studyGoal,...td.map(x=>x.mins),1);$('#loadChart').innerHTML=td.map(x=>{const n=fmtDate(x.k);return `<div class="bar-col"><div class="bar-track"><i style="height:${clamp(Math.round(x.mins/max*100),2,100)}%"></i></div><span>${n}</span><small>${x.mins}</small></div>`}).join('');
 const w=weaknessDetails()[0];$('#analysisWeak').textContent=w?`${w.label} / ${w.health}/100`:'—';$('#analysisWeakText').textContent=w?`${w.overdue?`${w.overdue} gecikmiş tekrar • `:''}öncelik skoru ${w.urgency}/100.`:'Konu verisi bekleniyor.';const comp=Math.round(td.slice(-7).reduce((s,x)=>s+x.score,0)/7);$('#analysisReliability').textContent=comp+'%';$('#analysisReliabilityText').textContent='Son 7 gün sistem skoru ortalaması.';const active=lastStudyDays(30).filter(x=>x.d&&systemScore(x.d)>=40).length;$('#analysisConsistency').textContent=active+'/30';$('#analysisConsistencyText').textContent='Son 30 günde ≥40 skor alınan gün.';
}
function renderDiscipline(){const d0=ensureDay();applyEnergyToDay(d0);const days=lastStudyDays(30);$('#disciplineHeatmap').innerHTML=days.map(x=>`<div class="heat-cell ${heatClass(x.score)}" title="${fmtDate(x.k)} • ${x.score}"></div>`).join('');$('#disciplineCards').innerHTML=`<article class="card"><span class="section-kicker">CURRENT</span><h3>${systemScore(ensureDay())}/100</h3><p class="muted">Bugünün sistem skoru.</p></article><article class="card"><span class="section-kicker">7 DAY AVG</span><h3>${Math.round(days.slice(-7).reduce((a,x)=>a+x.score,0)/7)}%</h3><p class="muted">Son 7 gün ortalaması.</p></article><article class="card"><span class="section-kicker">STREAK</span><h3>${streak()} gün</h3><p class="muted">70+ skorla kırılmadan devam.</p></article>`}
function heatClass(s){return s>=85?'h4':s>=70?'h3':s>=40?'h2':s>0?'h1':'h0'}
function renderFinance(){const m=state.money.reduce((a,x)=>{if(x.date.slice(0,7)===today().slice(0,7)){a[x.type==='income'?'inc':'exp']+=Number(x.amount)||0}return a},{inc:0,exp:0});const net=BASE_SALARY+m.inc-m.exp;$('#financeKpis').innerHTML=`${[['Sabit maaş',BASE_SALARY,'TL'],['Ek gelir',m.inc.toLocaleString('tr-TR'),'TL'],['Gider',m.exp.toLocaleString('tr-TR'),'TL'],['Net akış',net.toLocaleString('tr-TR'),'TL']].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('')}`;const rows=[['Maaş',BASE_SALARY],['Ek gelir',m.inc],['Gider',-m.exp],['Net',net]];const max=Math.max(BASE_SALARY,m.inc,m.exp,Math.abs(net),1);$('#cashflowBars').innerHTML=`<div class="finance-stack">${rows.map(r=>`<div class="cash-line"><span>${r[0]}</span><div class="cash-track"><i style="width:${Math.max(3,Math.round(Math.abs(r[1])/max*100))}%"></i></div><strong>${r[1]<0?'-':''}₺${Math.abs(r[1]).toLocaleString('tr-TR')}</strong></div>`).join('')}</div>`;$('#moneyList').innerHTML=state.money.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,20).map(x=>`<div class="money-item"><div><strong>${esc(x.desc)}</strong><small>${fmtDate(x.date)} • ${x.type==='income'?'Gelir':'Gider'}</small></div><strong class="${x.type==='income'?'income':'expense'}">${x.type==='income'?'+':'-'}₺${Number(x.amount).toLocaleString('tr-TR')}</strong></div>`).join('')||'<div class="empty">Henüz para hareketi yok.</div>'}
function renderSettings(){$('#setStudy').value=state.settings.studyGoal;$('#setQuestions').value=state.settings.questionGoal;$('#setParagraph').value=state.settings.paragraphGoal;$('#setProblem').value=state.settings.problemGoal;ensureSettingsExtra()}
function ensureSettingsExtra(){const host=$('#settings .main-grid-gap');if($('#strategyCard')||!host)return;const a=document.createElement('article');a.id='strategyCard';a.className='card settings-card';a.innerHTML=`<div class="card-head"><div><span class="section-kicker">MISSION CONTROL</span><h3>Hedef & zaman ufku</h3></div><span class="badge purple">LAW / EA</span></div><label>Provisional sınav tarihi<input id="setExamDate" type="date"></label><label>Stretch sıralama hedefi<input id="setTargetRank" type="number" min="1"></label><label>Minimum hukuk hedefi<input id="setMinRank" type="number" min="1"></label><div class="system-note"><strong>Koç prensibi</strong><span>Panel kesin sıralama tahmini yapmaz. Readiness; deneme, konu kapsamı ve disiplin verilerini birleştiren iç performans göstergesidir.</span></div><button id="saveStrategy" class="primary-btn">Stratejiyi kaydet</button>`;host.appendChild(a);$('#setExamDate').value=state.settings.examDate;$('#setTargetRank').value=state.settings.targetRank;$('#setMinRank').value=state.settings.minRank;$('#saveStrategy').onclick=()=>{state.settings.examDate=$('#setExamDate').value||DEFAULT_EXAM;state.settings.targetRank=clamp(Number($('#setTargetRank').value)||30000,1,200000);state.settings.minRank=clamp(Number($('#setMinRank').value)||50000,1,200000);save();renderAll();toast('Hedef stratejisi güncellendi.')}}
function weekKeys(end=today()){const arr=[];for(let i=6;i>=0;i--)arr.push(addDays(end,-i));return arr}
function weekSummary(end=today()){const keys=weekKeys(end);const days=keys.map(k=>state.days[k]).filter(Boolean);const totalStudy=days.reduce((a,d)=>a+realStudyMinutes(d),0);const plannedStudy=days.reduce((a,d)=>a+(Number(d.studyMinutes)||0),0);const questions=days.reduce((a,d)=>a+(Number(d.questions)||0),0);const tasks=days.reduce((a,d)=>a+d.tasks.length,0);const done=days.reduce((a,d)=>a+d.tasks.filter(t=>t.done).length,0);const habits=days.length?days.reduce((a,d)=>a+habitScore(d),0)/(days.length*habitDefs.length)*100:0;const avgScore=days.length?days.reduce((a,d)=>a+systemScore(d),0)/days.length:0;const focus=state.sessions.filter(x=>keys.includes(x.date)).reduce((a,x)=>a+(Number(x.minutes)||0),0);const mocks=state.mocks.filter(m=>keys.includes(m.date)).length;const mistakes=state.mistakes.filter(m=>keys.includes(m.date)).length;const income=state.money.filter(m=>keys.includes(m.date)&&m.type==='income').reduce((a,m)=>a+(Number(m.amount)||0),0);const expense=state.money.filter(m=>keys.includes(m.date)&&m.type==='expense').reduce((a,m)=>a+(Number(m.amount)||0),0);return {keys,days,totalStudy,plannedStudy,questions,tasks,done,taskPct:tasks?done/tasks*100:0,habits,avgScore,focus,mocks,mistakes,income,expense};}
function weeklyPriorities(){return weaknessDetails().slice(0,3).map((w,i)=>{const r=recommendedAction(w);return {rank:i+1,name:w.name,label:w.label,area:w.area,urgency:w.urgency,topic:r.topic,mins:r.mins,signal:w.keySignals?.[0]||'Veri ihtiyacı'}})}
function renderWeekly(){const s=weekSummary();const hasData=s.days.length>0||s.totalStudy>0||s.questions>0||s.mocks>0;const hero=$('#weeklyHero');if(!hero)return;const score=Math.round(s.avgScore);const status=!hasData?'İlk haftanın fotoğrafı hazırlanıyor':score>=85?'Çok güçlü hafta':score>=70?'İyi ve sürdürülebilir hafta':score>=50?'Toparlanma haftası':'Sistemi yeniden kurma haftası';hero.innerHTML=`<div class="weekly-hero-copy"><span class="section-kicker">${esc(fmtDate(s.keys[0]))} → ${esc(fmtDate(s.keys.at(-1)))}</span><h3>${status}</h3><p>${hasData?`Bu hafta ${Math.round(s.totalStudy)} dk gerçek çalışma, ${s.questions} soru ve ${s.mocks} deneme kaydı var.`:'Veri geldikçe bu alan otomatik dolacak. İlk hedef mükemmel performans değil, doğru başlangıç fotoğrafı.'}</p></div><div class="weekly-score"><span>HAFTA SKORU</span><strong>${hasData?score:'—'}</strong><small>${hasData?'100 üzerinden iç performans göstergesi':'veri bekleniyor'}</small></div>`;
 $('#weeklyKpis').innerHTML=[['Çalışma',`${Math.round(s.totalStudy)} dk`,'gerçek odak'],['Soru',s.questions,'günlük veri'],['Görev',`${Math.round(s.taskPct)}%`,'tamamlama'],['Disiplin',`${Math.round(s.habits)}%`,'alışkanlık uyumu'],['Deneme',s.mocks,'bu hafta'],['Odak',`${Math.round(s.focus)} dk`,'Focus Room']].map(([a,b,c])=>`<div class="kpi-card"><span>${a}</span><strong>${b}</strong><small>${c}</small></div>`).join('');
 const wins=[];if(s.totalStudy>=state.settings.studyGoal*5)wins.push(['Çalışma ritmi',`${Math.round(s.totalStudy)} dk gerçek çalışma ile güçlü bir hacim oluşturdun.`]);if(s.habits>=75)wins.push(['Disiplin',`Alışkanlık uyumun %${Math.round(s.habits)} seviyesinde.`]);if(s.taskPct>=80)wins.push(['Görevler',`Planlanan işlerin %${Math.round(s.taskPct)}'ini kapattın.`]);if(s.mocks>0)wins.push(['Deneme',`${s.mocks} deneme kaydı sisteme işlendi.`]);if(!wins.length)wins.push(['Başlangıç', 'Bu hafta veri toplamaya devam et; düzen kurulduğunda koçun daha net karar verecek.']);$('#weeklyWins').innerHTML=wins.map(x=>`<div class="insight-row"><span class="insight-icon">✓</span><div><strong>${x[0]}</strong><p>${x[1]}</p></div></div>`).join('');
 const risks=[];if(s.totalStudy<state.settings.studyGoal*4)risks.push(['Çalışma hacmi',`Haftalık net çalışma ${Math.round(s.totalStudy)} dk. Hedefe yaklaşmak için sabah bloklarını koru.`]);if(s.habits<70)risks.push(['Disiplin',`Alışkanlık uyumu %${Math.round(s.habits)}. Özellikle uyku ve günlük çalışma sözünü takip et.`]);if(s.mocks===0)risks.push(['Deneme verisi','Henüz bu hafta deneme yok. Gerçek performans resmi için en az bir TYT/AYT denemesi ekle.']);if(s.questions<state.settings.questionGoal*3)risks.push(['Soru hacmi',`Bu hafta ${s.questions} soru kaydı var. Küçük ama istikrarlı artış hedefle.`]);if(!risks.length)risks.push(['Kontrol','Belirgin bir alarm yok. Aynı ritmi bozmadan devam et.']);$('#weeklyRisks').innerHTML=risks.slice(0,4).map(x=>`<div class="insight-row"><span class="insight-icon danger">!</span><div><strong>${x[0]}</strong><p>${x[1]}</p></div></div>`).join('');
 const pr=weeklyPriorities();$('#weeklyPriorities').innerHTML=pr.map(x=>`<div class="priority-row"><span class="priority-rank">0${x.rank}</span><div><strong>${esc(x.label)}</strong><small>${esc(x.topic)} • ${x.mins} dk</small><p>${esc(x.signal)}</p></div><b>${x.urgency}</b></div>`).join('')||'<div class="empty">Koç önceliği için konu verisi bekleniyor.</div>';
 const weeks=[];for(let i=3;i>=0;i--){const end=addDays(today(),-i*7);const ws=weekSummary(end);weeks.push(ws)}const max=Math.max(1,...weeks.map(x=>x.totalStudy));$('#weeklyTrend').innerHTML=weeks.map((w,i)=>`<div class="trend-col"><div class="trend-bar"><i style="height:${Math.max(8,Math.round(w.totalStudy/max*100))}%"></i></div><span>${i===3?'Bu hafta':`-${3-i}`}</span><small>${Math.round(w.totalStudy)} dk</small></div>`).join('');const delta=weeks.length>1?weeks.at(-1).totalStudy-weeks.at(-2).totalStudy:0;$('#weeklyTrendLabel').textContent=`${delta>=0?'+':''}${Math.round(delta)} dk`;
 let note='';if(!hasData)note='İlk hafta hedefimiz mükemmel sonuç değil; veri üretmek, ritim kurmak ve günlük sistemi oturtmak.';else if(score>=85)note='Ritmi yakaladın. Gelecek hafta hacmi değil, kaliteyi artır: zayıf ders + deneme analizi + akıllı tekrar.';else if(score>=70)note='Sistem çalışıyor. En yüksek getiriyi AYT Matematik ve gecikmiş tekrarları istikrarlı kapatarak alırsın.';else note='Önceliğimiz yeniden kusursuz program yazmak değil; her gün minimum çalışma tabanını koruyup zinciri kırmamak.';$('#weeklyCoachNote').innerHTML=`<div class="coach-note-accent">✦</div><div><strong>${hasData?'Koçun kararı':'Başlangıç kararı'}</strong><p>${note}</p></div>`;}
function generateNextWeekPlan(){const target=addDays(today(),1);const r=generateCoachPlan(target,'tomorrow');toast(r.added?`${r.added} görev gelecek plana eklendi.`:'Yeni görev eklenmedi.');renderWeekly();renderAll();}


function friendShareCode(){
  if(state.social?.shareCode) return state.social.shareCode;
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code=''; for(let i=0;i<6;i++) code+=chars[Math.floor(Math.random()*chars.length)];
  state.social??={}; state.social.shareCode=code; state.social.shareEnabled=false; save(); return code;
}
function sharedStats(){const d=ensureDay();const wk=weekSummary();return {studyMinutes:Math.round(wk.totalStudy),weeklyQuestions:wk.questions,weekScore:Math.round(wk.avgScore),streak:streak(),todayScore:systemScore(d),targetRank:Number(state.settings.targetRank)||30000,target:selectedProgram()||'Hedef'}}
function ensureSocial(){state.social??={};state.social.shareCode??='';state.social.shareEnabled??=false;state.social.friends??=[];return state.social}
function renderFriends(){
  const social=ensureSocial();
  const code=friendShareCode();
  const codeEl=$('#friendShareCode'); if(codeEl) codeEl.textContent=code;
  const enabled=$('#friendShareEnabled'); if(enabled) enabled.checked=!!social.shareEnabled;
  const status=$('#friendShareStatus'); if(status){status.textContent=social.shareEnabled?'AKTİF':'PASİF';status.className='badge '+(social.shareEnabled?'success':'purple')}
  const m=sharedStats();
  const mm=$('#friendShareMetrics'); if(mm) mm.innerHTML=[['Hafta',`${m.studyMinutes} dk`],['Soru',m.weeklyQuestions],['Streak',`${m.streak} gün`],['Skor',m.weekScore||0]].map(([a,b])=>`<div class="share-metric"><span>${a}</span><strong>${b}</strong></div>`).join('');
  const fl=$('#friendList'); if(fl){fl.innerHTML=social.friends.length?social.friends.map((f,i)=>`<div class="friend-item"><div class="friend-item-main"><div class="friend-avatar">${esc((f.name||'?')[0].toUpperCase())}</div><div><strong>${esc(f.name||'Arkadaş')}</strong><small>${esc(f.code||'')}</small></div></div><button class="ghost-btn" data-remove-friend="${i}">Kaldır</button></div>`).join(''):'<div class="empty">Henüz arkadaş eklemedin.</div>'}
  renderFriendBoard();
}
function renderFriendBoard(){
 const box=$('#friendLeaderboard');if(!box)return;
 const friends=ensureSocial().friends||[];
 if(!friends.length){box.innerHTML='<div class="empty">Arkadaşının paylaşım kodunu eklediğinde seçili istatistikleri burada göreceksin.</div>';return;}
 box.innerHTML=friends.map(f=>`<article class="friend-card"><div class="friend-card-head"><div class="friend-avatar">${esc((f.name||'?')[0].toUpperCase())}</div><div><h4>${esc(f.name||'Arkadaş')}</h4><small>Hedef • ${esc(f.target||'Hukuk')}</small></div></div><div class="friend-grid"><div class="friend-stat"><span>Hafta çalışması</span><strong>${Number(f.studyMinutes)||0} dk</strong></div><div class="friend-stat"><span>Hafta sorusu</span><strong>${Number(f.weeklyQuestions)||0}</strong></div><div class="friend-stat"><span>Streak</span><strong>${Number(f.streak)||0} gün</strong></div><div class="friend-stat"><span>Hafta skoru</span><strong>${Number(f.weekScore)||0}</strong></div></div><p class="muted" style="margin:12px 0 0">Son güncelleme: ${esc(f.updatedAt?fmtDate(f.updatedAt.slice(0,10)):'—')}</p></article>`).join('');
}
async function refreshFriends(){
  if(!window.hukukCloud?.getFriendProfile){toast('Önce Supabase hesabının bağlı olduğundan emin ol.');return;}
  const code=($('#friendCodeInput')?.value||'').trim().toUpperCase(); if(!code){toast('Arkadaş kodunu gir.');return;}
  const p=await window.hukukCloud.getFriendProfile(code);
  if(!p){toast('Bu kod bulunamadı veya paylaşım kapalı.');return;}
  const social=ensureSocial(); social.friends??=[]; const idx=social.friends.findIndex(x=>x.code===code); if(idx>=0)social.friends[idx]=p;else social.friends.push(p); save(); renderFriends(); $('#friendCodeInput').value=''; toast(`${p.name||'Arkadaş'} eklendi.`);
}
function publishFriendProfile(){window.hukukCloud?.publishFriendProfile?.(sharedStats(), ensureSocial());}
function renderLifeEnergy(){
 const el=$('#lifeEnergySummary');if(!el)return;const e=energySnapshot();const action=$('#lifeActionTitle'),text=$('#lifeActionText');if(action&&text){action.textContent=e.capacityScore<55?'Bugün toparlanma öncelikli':e.capacityScore<72?'Bugün kontrollü ilerle':'Bugün tam kapasiteye yakın çalışabilirsin';text.textContent=e.capacityScore<55?'Kısa, kaliteli bloklar seç; gecikmiş tekrarları öne al ve gece uykusunu koru.':e.capacityScore<72?'En yüksek getirili 2–3 akademik bloğu tamamla; kalan işi yarına taşıyabilirsin.':'Hedef ders süreni koru, Focus Room ile ana blokları tamamla.';}const d=ensureDay();const rows=[['Uyku',Number.isFinite(Number(d.sleepHours))?`${Number(d.sleepHours).toFixed(1)} saat`:'Veri gir',e.sleepScore],['Enerji',Number.isFinite(Number(d.energyLevel))?`${d.energyLevel}/5`:'Veri gir',e.energyScore],['Telefon',Number.isFinite(Number(d.phoneMinutes))?`${d.phoneMinutes} dk`:'Veri gir',e.phoneScore],['Egzersiz',Number.isFinite(Number(d.exerciseMinutes))?`${d.exerciseMinutes} dk`:'Veri gir',e.exerciseScore]];el.innerHTML=`<div class="life-score-hero"><div><span class="section-kicker">CAPACITY INDEX</span><h3>${e.capacityScore}/100</h3><p>${e.message}</p></div><span class="badge ${e.tone}">${e.mode}</span></div><div class="life-score-list">${rows.map(r=>`<div class="life-score-row"><div><strong>${r[0]}</strong><span>${r[1]}</span></div><div class="life-mini-bar"><i style="width:${Math.round(r[2])}%"></i></div><b>${Math.round(r[2])}</b></div>`).join('')}</div><div class="life-plan"><span>BUGÜNÜN ÖNERİLEN DERS KAPASİTESİ</span><strong>${e.capacity} dk</strong><p>Hedefin ${state.settings.studyGoal} dk. Enerjin düşükse sistem hacmi azaltır; öncelikleri korur.</p></div>`;
}
function renderMistakes(){
 const list=$('#mistakeList'), total=$('#mistakeTotal'), todayEl=$('#mistakeToday'), topEl=$('#mistakeTopTopic'), insightEl=$('#mistakeInsight');
 const ms=Array.isArray(state.mistakes)?state.mistakes:[];
 const todayKey=today();
 if(total) total.textContent=ms.length;
 if(todayEl) todayEl.textContent=ms.filter(m=>m.date===todayKey).length;
 const stats=mistakeStats();
 const top=Object.entries(stats.byTopic||{}).sort((a,b)=>b[1]-a[1])[0];
 if(topEl) topEl.textContent=top?top[0]:'—';
 if(insightEl) insightEl.textContent=coachMistakeInsight();
 if(!list) return;
 const ordered=ms.slice().sort((a,b)=>{
   const ds=(b.date||'').localeCompare(a.date||'');
   if(ds!==0)return ds;
   return (Number(b.severity)||0)-(Number(a.severity)||0);
 });
 list.innerHTML=ordered.length?ordered.map(m=>`<div class="money-row"><div class="money-row-main"><strong>${esc(m.subject||'Genel')}</strong><span>${esc(m.topic||'Konu belirtilmedi')} • ${esc(mistakeTypeLabel(m.type))}</span><small>${esc(fmtDate(m.date||today()))}</small></div><div class="money-row-side"><span class="badge ${Number(m.severity)>=4?'danger':Number(m.severity)>=3?'purple':'success'}">Şiddet ${Number(m.severity)||3}</span><span class="money-amount">${esc(m.note||'')}</span>${m.mockId?'<small>Denemeye bağlı</small>':''}</div></div>`).join(''):'<div class="empty">Henüz hata günlüğü yok. Deneme sonuçlarını ve yanlışlarını kaydetmeye başlayınca burada desenleri göreceksin.</div>';
}

const academyGuides={
 'TYT Türkçe':{track:'TYT',tone:'cyan',purpose:'Anlamı hızlı çözmek, paragraf doğruluğunu ve süre kontrolünü aynı anda geliştirmek.',method:['Önce kısa bir paragraf seti çöz ve süre tut.','Yanlışları “anlam / dikkat / çıkarım / hız” olarak ayır.','Doğru yaptığın ama uzun sürdüğün soruları da işaretle.','Her oturum sonunda 5 dakikalık hata tekrarına dön.'],session:[[10,'Süreli 5–8 paragraf'],[30,'Paragraf + detaylı analiz'],[20,'Hata tipi ve tekrar']],mistakes:'En verimli veri sadece yanlış sayısı değil; yanlışın nedenidir. Aynı hata tipini iki kez gördüğünde kısa tekrar ekle.'},
 'TYT Matematik':{track:'TYT',tone:'ocean',purpose:'Temel kavramları sağlamlaştırıp soru tiplerini tanıyarak problem çözme hızını artırmak.',method:['Konuyu 15–25 dakikalık kısa bir öğrenme bloğunda kavra.','Önce temel örnekler, sonra orta seviye sorular çöz.','Takıldığın soruda çözümü hemen açmak yerine kısa bir ikinci deneme yap.','Oturum sonunda yanlışları konuya bağla ve tekrar tarihini güncelle.'],session:[[20,'Konu + örnek'],[30,'Kademeli soru seti'],[10,'Yanlış analizi']],mistakes:'İşlem, kavram, soru okuma ve süre hatalarını ayrı tut. Problem sorularında yalnızca doğru cevabı değil, kurduğun yolu incele.'},
 'TYT Sosyal':{track:'TYT',tone:'amber',purpose:'Bilgiyi ezberden çıkarıp kronoloji, neden-sonuç ve kavram ilişkileriyle hatırlamak.',method:['Konuyu kısa parçalar halinde öğren.','Kitabı kapatıp ana başlıkları kendi cümlelerinle söyle.','Ardından konu soruları çöz.','Yanlış çıkan kavramlar için mikro tekrar kartları oluştur.'],session:[[15,'Konu öğrenme'],[25,'Aktif hatırlama + soru'],[20,'Mikro tekrar']],mistakes:'Bilgi karışıklığı ile dikkat hatasını ayır. Aynı kavramı ikinci kez karıştırıyorsan tekrar aralığını kısalt.'},
 'TYT Fen':{track:'TYT',tone:'cyan',purpose:'Kavramı anlamayı, temel bağıntıyı kurmayı ve soru üzerinden kullanmayı öğrenmek.',method:['Önce “ne oluyor ve neden?” sorusunu cevapla.','Bir iki örnekle kavramı uygula.','Sonra karışık soru setine geç.','Yanlışları konu + hata türü şeklinde kaydet.'],session:[[20,'Kavramsal öğrenme'],[25,'Soru uygulaması'],[15,'Analiz + tekrar']],mistakes:'Formül ezberlediğin halde uygulayamıyorsan problem formülde değil kavramdadır. Bir cümleyle prensibi açıklamayı dene.'},
 'AYT Matematik':{track:'AYT',tone:'ocean',purpose:'Kavramı derinleştirmek, soru tiplerini sistematikleştirmek ve seçici sorularda dayanıklılık kazanmak.',method:['Konu anlatımını pasif izlemek yerine ara ara kendin açıklama yap.','Kolay → orta → seçici sorular şeklinde ilerle.','Bir soruyu kaçırdığında hangi adımda koptuğunu yaz.','Aynı konudan karışık mini set ile oturumu kapat.'],session:[[25,'Konu + aktif hatırlama'],[40,'Kademeli soru'],[25,'Yanlış analizi + mini set']],mistakes:'AYT Matematikte “çözümü görünce anladım” gerçek öğrenme sayılmaz. Çözümü kapatıp soruyu yeniden kurabildiğin an öğrenme pekişir.'},
 'AYT Edebiyat':{track:'EA',tone:'purple',purpose:'Dönem, sanatçı, eser ve tür ilişkilerini uzun süreli hatırlanabilir bir yapıya dönüştürmek.',method:['Önce dönemin büyük resmini çıkar.','Bilgiyi tablo / karşılaştırma / kısa çağrışımlarla düzenle.','Kitabı kapatıp aktif hatırlama yap.','Sonra soru çöz ve karıştırdığın noktaları tekrar kuyruğuna al.'],session:[[20,'Dönem bilgisi'],[20,'Aktif hatırlama'],[20,'Soru + tekrar']],mistakes:'Benzer sanatçı ve eserleri karıştırıyorsan karşılaştırmalı mini tablo oluştur. Salt tekrar okumak yerine kapalı kitap hatırlama yap.'},
 'AYT Tarih-1':{track:'EA',tone:'amber',purpose:'Tarih bilgisini kronoloji ve neden-sonuç bağlantısıyla kalıcı hale getirmek.',method:['Olayları tek tek ezberlemek yerine dönem haritası çıkar.','Neden → olay → sonuç zincirini kendi cümlelerinle kur.','Kısa kapalı kitap tekrar yap.','Sonra seçici sorularla bilgiyi test et.'],session:[[20,'Kronoloji + neden-sonuç'],[25,'Soru'],[15,'Aktif tekrar']],mistakes:'Tarih yanlışlarında “bilmediğim için” ile “iki bilgiyi karıştırdım”ı ayır. Karıştırma varsa karşılaştırma tablosu kullan.'},
 'AYT Coğrafya-1':{track:'EA',tone:'cyan',purpose:'Coğrafi kavramları harita, dağılış ve neden-sonuç ilişkileriyle düşünmek.',method:['Kavramı öğrenirken mutlaka bir mekân/harita bağlantısı kur.','“Nerede ve neden orada?” sorusunu sor.','Soru çözerken grafik, harita ve tabloyu yorumla.','Oturumu kısa bir görsel tekrar ile bitir.'],session:[[20,'Kavram + harita'],[25,'Yorum soruları'],[15,'Tekrar']],mistakes:'Ezberleyip unutuyorsan mekânsal bağlantı kur. Aynı veri farklı sorularda nasıl kullanılıyor, ona bak.'},
 'AYT Fen':{track:'SAY',tone:'ocean',purpose:'Fizik, kimya ve biyolojide kavramı anlayıp soruya dönüştürmek.',method:['Konuyu “neden?” sorusuyla öğren.','Temel bağıntı veya kavramı kendi cümlelerinle açıkla.','Örnek soru ile uygula, sonra karışık teste geç.','Yanlışları tekrar kuyruğuna ekle.'],session:[[25,'Kavramsal öğrenme'],[40,'Soru'],[25,'Analiz + tekrar']],mistakes:'Bilgi eksiği ile uygulama eksiğini ayır. Uygulama hatasında daha fazla benzer soru, bilgi hatasında aktif tekrar gerekir.'},
 'YDT Dil':{track:'DİL',tone:'rose',purpose:'Kelime, okuma, dil bilgisi ve soru stratejisini süre içinde birleştirmek.',method:['Kelimeyi tek başına değil cümle içinde öğren.','Her gün kısa süreli okuma yap.','Soru türlerine göre hata analizi tut.','Haftalık olarak zamanlı mini set çöz.'],session:[[15,'Kelime + örnek cümle'],[30,'Reading + soru'],[15,'Hata analizi']],mistakes:'Kelime bilgisi ile metni anlamama sorununu ayır. Süre hataları için zamanlı mini setler kullan.'},
 'Genel Sınav Çalışması':{track:'ALL',tone:'purple',purpose:'Sıfırdan düzen kurmak, çalışma oturumunu doğru kapatmak ve sürdürülebilir ritim oluşturmak.',method:['Her oturum için tek bir ana hedef belirle.','Oturumun başında ne öğreneceğini, sonunda ne öğrendiğini söyle.','Telefonu odak süresince uzaklaştır.','Oturumu kısa bir değerlendirme ve tekrar kararıyla kapat.'],session:[[10,'Hedef belirleme'],[40,'Tek görev odak'],[10,'Kapanış + plan']],mistakes:'Aynı gün içinde çok fazla ders değiştirerek derinliği kaybetme. Kalite düşüyorsa blokları kısalt.'}
};
function ensureAcademy(){state.academy??={level:'beginner',duration:60,viewed:[],favorites:[],lastGuide:'',lastSessionDate:'',trackFilter:'ALL'};state.academy.viewed??=[];state.academy.trackFilter??='ALL';state.academy.favorites??=[];state.academy.level??='beginner';state.academy.duration??=60;return state.academy}
function academyTrack(){return ensureAcademy().trackFilter||state.settings.scoreType||'ALL'}
function academyRelevant(g){const tr=academyTrack();if(g.track==='ALL'||tr==='ALL')return true;if(tr==='SAY')return ['TYT','SAY'].includes(g.track);if(tr==='EA')return ['TYT','EA'].includes(g.track);if(tr==='SÖZ')return ['TYT','SOZ','EA'].includes(g.track);if(tr==='DİL')return ['TYT','DİL'].includes(g.track);if(tr==='TYT')return g.track==='TYT';return true}
function academySessionFor(id,mins){const g=academyGuides[id];if(!g)return[];const template=g.session||[];let remain=mins,rows=[];template.forEach(([m,label])=>{if(remain<=0)return;const take=Math.min(m,remain);rows.push([take,label]);remain-=take});if(remain>0)rows.push([remain,'Soru + analiz']);return rows}
function academyCoachSuggestion(){try{const p=adaptivePlan();const first=p?.plan?.[0];if(first)return {title:first.title,reason:first.reason||'Koç önceliğine göre seçildi.',mins:first.minutes||60}}catch{}return null}
function renderAcademy(){const grid=$('#academyGrid');if(!grid)return;const a=ensureAcademy();const q=($('#academySearch')?.value||'').trim().toLocaleLowerCase('tr-TR');const trackPills=$('#academyTrackPills');const tracks=[['ALL','Tüm'],['TYT','TYT'],['EA','Eşit Ağırlık'],['SAY','Sayısal'],['SÖZ','Sözel'],['DİL','Dil']];if(trackPills&&!trackPills.children.length){trackPills.innerHTML=tracks.map(([v,l])=>`<button type="button" class="academy-track-pill ${academyTrack()===v?'active':''}" data-academy-track="${v}">${l}</button>`).join('')}else if(trackPills){trackPills.querySelectorAll('[data-academy-track]').forEach(b=>b.classList.toggle('active',b.dataset.academyTrack===academyTrack()))}
 const rows=Object.entries(academyGuides).filter(([id,g])=>academyRelevant(g)&&(!q||`${id} ${g.purpose}`.toLocaleLowerCase('tr-TR').includes(q)));
 grid.innerHTML=rows.map(([id,g])=>{const level=a.level==='beginner'?'Temel yaklaşım':a.level==='basic'?'Temel + soru':a.level==='intermediate'?'Soru + analiz':'İleri + zaman';const fav=a.favorites.includes(id);return `<article class="card academy-guide-card"><div class="academy-guide-card-top"><span class="guide-icon ${g.tone}">✦</span><span class="badge ${fav?'success':''}">${g.track==='ALL'?'CORE':g.track}</span></div><span class="section-kicker">${level.toUpperCase()}</span><h3>${esc(id)}</h3><p>${esc(g.purpose)}</p><div class="academy-card-meta"><span>${g.method.length} adımlı yöntem</span><span>${g.session?.reduce((n,x)=>n+x[0],0)||60} dk örnek</span></div><div class="academy-card-actions"><button type="button" class="secondary-btn" data-academy-open="${encodeURIComponent(id)}">Rehberi aç</button><button type="button" class="small-btn" data-academy-start="${encodeURIComponent(id)}">Focus'a başla</button></div></article>`}).join('')||'<div class="empty">Seçtiğin filtreyle eşleşen rehber bulunamadı.</div>';
 const todayCard=$('#academyTodayCard');if(todayCard){const sug=academyCoachSuggestion();todayCard.innerHTML=`<div class="academy-today-inner"><div><span class="section-kicker">KOÇUN ÖNERİSİ</span><h3>${sug?esc(sug.title):'İlk adımını seç'}</h3><p>${sug?esc(sug.reason):'Henüz yeterli performans verin yoksa “Sıfırdan başla” akışından uygun bir ders seç.'}</p></div><div class="academy-today-side"><span>${sug?.mins||a.duration} dk</span><button type="button" class="primary-btn" id="academyTodayStart">Uygula →</button></div></div>`}
}
function openAcademyGuide(id){const g=academyGuides[id];if(!g)return;const a=ensureAcademy();a.lastGuide=id;a.viewed=[...new Set([...a.viewed,id])];save();const dlg=$('#academyGuideDialog');if(!dlg)return;dlg.dataset.guide=id;$('#academyGuideTitle').textContent=id;$('#academyGuideIntro').textContent=g.purpose;$('#academyGuideKicker').textContent=`${g.track==='ALL'?'CORE':g.track} • STUDY GUIDE`;$('#academyGuideBadge').textContent=g.tone==='ocean'?'CORE SKILL':'METHOD';renderAcademyGuideTab('method');dlg.showModal()}
function renderAcademyGuideTab(tab){const dlg=$('#academyGuideDialog');const id=dlg?.dataset.guide;const g=academyGuides[id];if(!g)return;const body=$('#academyGuideBody');if(!body)return;$('#academyGuideTabs')?.querySelectorAll('[data-academy-tab]').forEach(b=>b.classList.toggle('active',b.dataset.academyTab===tab));if(tab==='method'){body.innerHTML=`<div class="guide-intro-block"><span class="section-kicker">METHOD</span><h4>Bu dersi şu sırayla çalış</h4><div class="guide-step-list">${g.method.map((x,i)=>`<div><b>0${i+1}</b><p>${esc(x)}</p></div>`).join('')}</div></div>`}else if(tab==='session'){const mins=ensureAcademy().duration;const rows=academySessionFor(id,mins);body.innerHTML=`<div class="guide-intro-block"><span class="section-kicker">${mins} DK SESSION</span><h4>${mins} dakikalık örnek çalışma</h4><div class="guide-session-list">${rows.map(([m,l],i)=>`<div><strong>${m} dk</strong><span>${esc(l)}</span></div>`).join('')}</div><p class="guide-note">Bu bir şablondur. Performansına göre süreyi kısaltabilir veya uzatabilirsin.</p></div>`}else{body.innerHTML=`<div class="guide-intro-block"><span class="section-kicker">ERROR + REPEAT</span><h4>Yanlışın sana ne söylüyor?</h4><p class="guide-note">${esc(g.mistakes||'Yanlışlarını konu ve hata türüyle kaydet; sonra tekrar kuyruğunu kullan.')}</p><div class="guide-checks"><span>Hata nedeni →</span><span>Benzer soru →</span><span>Aktif tekrar →</span><span>Tekrar tarihi →</span></div></div>`}}
function academyCreateTask(id,mins,opts={}){const g=academyGuides[id];if(!g)return null;const d=ensureDay();const title=`${id} • ${opts.label||'Study Guide'}`;let t=d.tasks.find(x=>!x.done&&x.title===title);if(!t){t={id:uid('task'),title,category:g.track==='AYT'?'AYT':g.track==='TYT'?'TYT':'Tekrar',minutes:mins,kind:'study',done:false,ai:true,source:'academy-v52',reason:g.purpose};d.tasks.push(t);save();}return t}
function academyStart(id){const a=ensureAcademy(),mins=clamp(Number(a.duration)||60,10,240);const t=academyCreateTask(id,mins,{label:'Academy'});if(!t)return;focus.previousView='academy';focus.taskId=t.id;navigate('focus');setTimeout(()=>{setFocusTimer(mins);renderTimer()},0);toast(`${id}: ${mins} dakikalık Focus oturumu hazır.`)}
function academySetTrack(v){ensureAcademy().trackFilter=v||'ALL';save();renderAcademy()}
function academyStarter(){const dlg=$('#academyGuideDialog');if(!dlg)return;openAcademyGuide('Genel Sınav Çalışması')}

function renderAll(){
 applyTheme(); ensureDay();
 const jobs=[renderDashboard,renderToday,renderAcademy,renderCoachBriefing,renderEveningClose,renderRoadmap,renderMock,renderMistakes,renderAnalytics,renderDiscipline,renderFinance,renderSettings,renderWeekly,renderFriends,renderSimulation,renderTargetCalendar,renderLifeEnergy,applyGoalProfileUI];
 const failures=[];
 jobs.forEach(fn=>{try{fn()}catch(err){failures.push(fn.name||'render');console.error(`[NEXORA] ${fn.name||'render'} failed`,err);}});
 if(failures.length){window.__NEXORA_RENDER_FAILURES=failures;} else {delete window.__NEXORA_RENDER_FAILURES;}
}

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
const focus={total:600,left:600,running:false,handle:null,taskId:null,previousView:'dashboard'};
function renderTimer(){const m=Math.floor(focus.left/60),s=focus.left%60;$('#timerDisplay').textContent=`${pad(m)}:${pad(s)}`;const pct=focus.total?((focus.total-focus.left)/focus.total)*360:0;const ring=$('#focus .focus-ring');if(ring)ring.style.background=`conic-gradient(var(--accent) ${pct}deg,#1a2230 ${pct}deg)`;const d=ensureDay();const t=d.tasks.find(x=>x.id===focus.taskId);$('#focusTargetLabel').textContent=t?.title||'Bir görev seç';if($('#focusStatusText'))$('#focusStatusText').textContent=focus.running?`Odak açık • ${t?.title||'Görev seçilmedi'}`:(focus.left<focus.total?'Duraklatıldı • Devam etmeye hazırsın.':(t?'Hazır • Başlatabilirsin.':'Hazır • Görevini seç ve başlat.'));}
function setFocusTimer(mins=10){focus.total=mins*60;focus.left=focus.total;focus.running=false;renderTimer()}
function startTimer(){if(focus.running)return;if(!focus.taskId){toast('Önce bir görev seç.');renderFocusTaskPicker();const dlg=$('#focusTaskDialog');if(dlg&&!dlg.open){try{dlg.showModal()}catch{dlg.setAttribute('open','')}}return}focus.running=true;renderTimer();focus.handle=setInterval(()=>{if(focus.left<=0){completeFocus();return}focus.left--;renderTimer()},1000)}
function completeFocus(){stopTimer();const mins=Math.round(focus.total/60);state.focusSessions++;const d=ensureDay();d.studyMinutes=(Number(d.studyMinutes)||0)+mins;d.focusMinutes=(Number(d.focusMinutes)||0)+mins;if(focus.taskId){const t=d.tasks.find(x=>x.id===focus.taskId);if(t&&!t.done){t.focusLogged=(t.focusLogged||0)+mins;if((t.focusLogged||0)>=Math.max(20,t.minutes||25))t.done=true;}}state.sessions.push({id:uid('session'),date:today(),minutes:mins,taskId:focus.taskId,createdAt:new Date().toISOString()});save();renderAll();toast(`Focus tamamlandı • ${mins} dk gerçek çalışma kaydedildi.`);focus.taskId=null;setFocusTimer(10);const sel=$('#focusDuration');if(sel)sel.value='10'}
function stopTimer(){focus.running=false;clearInterval(focus.handle);focus.handle=null;renderTimer()}
function resetTimer(){stopTimer();setFocusTimer(10);const sel=$('#focusDuration');if(sel)sel.value='10'}
function commandResults(q){const commands=[['Bugünün sistemini aç','today'],['Focus Room','focus'],['NEXORA Academy','academy'],['Konu motoru','roadmap'],['Deneme merkezi','mock'],['Performans','analytics'],['Disiplin','discipline'],['Yaşam & Enerji','lifeEnergy'],['Para motoru','finance'],['Ayarlar','settings'],['Hata günlüğü','mock']];const f=commands.filter(x=>x[0].toLowerCase().includes(q.toLowerCase()));$('#commandResults').innerHTML=f.map(x=>`<button class="command-item" data-route="${x[1]}"><strong>${x[0]}</strong><span>↵ aç</span></button>`).join('')||'<div class="empty">Komut bulunamadı.</div>'}
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
 const repeatOpen=e.target.closest('[data-repeat-open]');if(repeatOpen){const [name,i]=decodeURIComponent(repeatOpen.dataset.repeatOpen).split('|');navigate('roadmap');openTopicDetail(name,Number(i));return}
 const coachGenerate=e.target.closest('[data-coach-generate]');if(coachGenerate){const target=coachGenerate.dataset.coachGenerate==='tomorrow'?addDays(today(),1):today();const result=generateCoachPlan(target,coachGenerate.dataset.coachGenerate);toast(result.added?`${result.added} koç görevi eklendi.`:'Yeni koç görevi eklenmedi.');renderAll();return}
 const coachPlan=e.target.closest('[data-coach-plan]');if(coachPlan){const name=decodeURIComponent(coachPlan.dataset.coachPlan);const d=ensureDay(addDays(today(),1));const w=weaknessDetails().find(x=>x.name===name)||weaknessDetails()[0];if(w){const rec=recommendedAction(w);d.tasks.push({id:uid('task'),title:`${w.name} • ${rec.topic}`,category:w.area,minutes:rec.mins,kind:'study',done:false,ai:true,source:'coach-v8',reason:w.keySignals[0]});save();toast(`${w.label}: yarının planına eklendi.`);return}}
 const radar=e.target.closest('[data-radar]');if(radar){navigate('roadmap');$('#roadmapArea').value=areaOf(decodeURIComponent(radar.dataset.radar));$('#roadmapStatus').value='ALL';renderRoadmap();return}
});
document.addEventListener('click',e=>{const close=e.target.closest('[data-close-dialog]');if(close){e.preventDefault();e.stopPropagation();const dlg=close.closest('dialog');if(dlg?.open){dlg.close('cancel');}return;}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const open=[...document.querySelectorAll('dialog[open]')].pop();if(open?.open){open.close('cancel');}}});
bind('addTask','click',()=>$('#taskDialog')?.showModal());bind('taskForm','submit',e=>{e.preventDefault();addTask()});
bind('addMistake','click',()=>{populateMistakeMockOptions();$('#mistakeDialog')?.showModal()});bind('mistakeForm','submit',e=>{e.preventDefault();const subject=$('#mistakeSubject').value.trim(),topic=$('#mistakeTopic').value.trim(),type=$('#mistakeType').value,note=$('#mistakeNote').value.trim(),severity=Number($('#mistakeSeverity').value)||3;if(!subject||!note){toast('Ders ve hata açıklaması gerekli.');return}addMistake({subject,topic,type,note,severity,mockId:$('#mistakeMockId')?.value||'',date:today()});$('#mistakeDialog').close();$('#mistakeForm').reset();if($('#mistakeMockId'))$('#mistakeMockId').value='';renderAll();toast('Hata günlüğüne kaydedildi.');});
bind('addMock','click',()=>{$('#mockDate').value=today();$('#mockDialog')?.showModal()});bind('mockForm','submit',e=>{if(e.submitter?.value==='cancel')return;e.preventDefault();addMock()});
bind('addIncomeQuick','click',()=>addMoney('income'));bind('addExpenseQuick','click',()=>addMoney('expense'));bind('moneyForm','submit',e=>{e.preventDefault();saveMoney()});
// Safe event binding: optional controls can be absent without killing the entire app.
bind('finishDay','click',finishDay);
bind('regeneratePlan','click',optimizePlan);
bind('planTomorrow','click',addTomorrowPlan); // optional legacy button
bind('saveDayNote','click',saveNote);
bind('roadmapArea','change',renderRoadmap);
bind('roadmapStatus','change',renderRoadmap);
bind('mockFilter','change',renderMock);document.addEventListener('click',e=>{const b=e.target.closest('[data-analyze-mock]');if(!b)return;const m=state.mocks.find(x=>x.id===b.dataset.analyzeMock);if(!m)return;$('#mistakeSubject').value=m.type==='AYT EA'?'AYT Matematik':'TYT Türkçe';populateMistakeMockOptions(m.id);$('#mistakeDialog')?.showModal();});
document.addEventListener('change',e=>{const s=e.target.closest('[data-topic]');if(s){e.stopPropagation();const [name,i]=decodeURIComponent(s.dataset.topic).split('|');setTopic(name,Number(i),s.value);renderRoadmap();renderDashboard();toast('Konu durumu güncellendi.')}});
bind('generateNextWeek','click',generateNextWeekPlan);
bind('simTyt','input',renderSimulation);bind('simAyt','input',renderSimulation);bind('simStudyGrowth','input',renderSimulation);bind('simQuestionGrowth','input',renderSimulation);bind('resetSimulation','click',()=>{['simTyt','simAyt','simStudyGrowth','simQuestionGrowth'].forEach(id=>{const el=$('#'+id);if(el)el.value=0});renderSimulation();toast('Simülasyon varsayılanlara döndü.')});
bind('openGoalSetup','click',openGoalSetup);
bind('goalTrack','change',e=>{goalSetupRender(e.target.value,null)});
bind('goalProgram','change',e=>{goalSetupRender(null,e.target.value)});
document.addEventListener('input',e=>{if(e.target?.id==='goalRank'){const r=$('#goalRank');const chips=$('#goalRankPresets');if(chips){const val=Number(r?.value)||0;chips.querySelectorAll('[data-rank-preset]').forEach(b=>b.classList.toggle('active',Number(b.dataset.rankPreset)===val))}}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-rank-preset]');if(b){const r=$('#goalRank');if(r){r.value=b.dataset.rankPreset;r.dispatchEvent(new Event('input',{bubbles:true}))}}});
bind('goalSetupSave','click',saveGoalSetup);
bind('onboardingOpenSetup','click',openGoalSetup);
bind('onboardingSkip','click',()=>{$('#onboardingDialog')?.close();toast('Kurulumu şimdilik kapattın. Hedefini Ayarlar’dan belirleyebilirsin.');});
bind('onboardingStart','click',()=>{openGoalSetup()});
bind('saveSettings','click',()=>{state.settings.studyGoal=clamp(Number($('#setStudy').value)||270,120,720);state.settings.questionGoal=clamp(Number($('#setQuestions').value)||350,50,1200);state.settings.paragraphGoal=clamp(Number($('#setParagraph').value)||20,0,100);state.settings.problemGoal=clamp(Number($('#setProblem').value)||15,0,100);save();renderAll();toast('Günlük hedefler güncellendi.')});
bind('exportTop','click',exportData);bind('exportSettings','click',exportData);bind('importSettings','change',e=>{const f=e.target.files?.[0];if(f)importData(f)});bind('resetSettings','click',()=>{if(confirm('Tüm takip verileri silinecek. Emin misin?')){state=clone(defaultState);save();renderAll();toast('Veriler sıfırlandı.')}});
bind('friendShareEnabled','change',e=>{ensureSocial().shareEnabled=!!e.target.checked;save();publishFriendProfile();renderFriends();toast(e.target.checked?'Paylaşım açıldı.':'Paylaşım kapatıldı.')});bind('copyFriendCode','click',async()=>{const code=friendShareCode();try{await navigator.clipboard.writeText(code);toast('Arkadaş kodu kopyalandı.')}catch{toast(`Kod: ${code}`)}});bind('addFriendByCode','click',refreshFriends);bind('refreshFriend','click',renderFriends);document.addEventListener('click',e=>{const b=e.target.closest('[data-remove-friend]');if(b){ensureSocial().friends.splice(Number(b.dataset.removeFriend),1);save();renderFriends();toast('Arkadaş çıkarıldı.')}});// Theme controls — one reliable pointer/click path for desktop + touch devices.
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
function updateFocusStatus(){renderTimer()}
function exitFocusRoom(){if(focus.running){const ok=confirm('Odak oturumun devam ediyor. Çıkarsan oturum duraklatılacak. Odadan çıkmak istiyor musun?');if(!ok)return;stopTimer()}const target=focus.previousView&&focus.previousView!=='focus'?focus.previousView:'dashboard';document.body.classList.remove('focus-mode');navigate(target)}
function renderFocusTaskPicker(){const d=ensureDay(),open=d.tasks.filter(t=>!t.done&&['study','review'].includes(t.kind));const box=$('#focusTaskList');if(!box)return;if(!open.length){box.innerHTML='<div class=\"empty\">Bugün seçilebilir açık akademik görev yok. Önce Bugünün Sistemi bölümünden bir görev ekle.</div>';return}box.innerHTML=open.map(t=>`<button type=\"button\" class=\"focus-task-option ${focus.taskId===t.id?'selected':''}\" data-focus-task=\"${t.id}\"><div><strong>${esc(t.title)}</strong><span>${esc(t.category)} • ${t.minutes||25} dk${t.ai?' • ✦ Asistan':''}</span></div><b>${focus.taskId===t.id?'✓':'→'}</b></button>`).join('')}
bind('focusTaskSelect','click',()=>{renderFocusTaskPicker();const dlg=$('#focusTaskDialog');if(dlg&&!dlg.open){try{dlg.showModal()}catch{dlg.setAttribute('open','')}}});bind('focusExit','click',exitFocusRoom);bind('focusDuration','change',e=>{if(focus.running)return;setFocusTimer(Number(e.target.value)||25)});
bind('focusTaskList','click',e=>{const btn=e.target.closest('[data-focus-task]');if(!btn)return;const d=ensureDay(),t=d.tasks.find(x=>x.id===btn.dataset.focusTask);if(!t)return;focus.taskId=t.id;$('#focusTargetLabel').textContent=t.title;$('#focusSelected').textContent=t.title;const suggested=clamp(Math.round((t.minutes||25)/10)*10,10,240);const dur=$('#focusDuration');if(dur){const allowed=Array.from({length:24},(_,idx)=>(idx+1)*10);dur.value=String(allowed.includes(suggested)?suggested:30)}setFocusTimer(Number($('#focusDuration')?.value||suggested));$('#focusTaskDialog')?.close();renderFocusTaskPicker();updateFocusStatus()});
bind('topicSaveSession','click',saveTopicSession);bind('topicAddToToday','click',addTopicToToday);bind('timerStart','click',startTimer);bind('timerPause','click',stopTimer);bind('timerReset','click',resetTimer);

bind('academyStarterBtn','click',academyStarter);bind('academyTodayBtn','click',()=>{const s=academyCoachSuggestion();if(s){const id=(s.title||'').split(' • ')[0];const fallback=Object.keys(academyGuides).find(k=>s.title?.toLocaleLowerCase('tr-TR').includes(k.toLocaleLowerCase('tr-TR')))||'Genel Sınav Çalışması';openAcademyGuide(academyGuides[id]?id:fallback)}else academyStarter()});
bind('academySearch','input',renderAcademy);
document.addEventListener('click',e=>{const lvl=e.target.closest('[data-academy-level]');if(lvl){ensureAcademy().level=lvl.dataset.academyLevel;save();document.querySelectorAll('[data-academy-level]').forEach(b=>b.classList.toggle('active',b===lvl));renderAcademy();return}const dur=e.target.closest('[data-academy-mins]');if(dur){ensureAcademy().duration=Number(dur.dataset.academyMins)||60;save();document.querySelectorAll('[data-academy-mins]').forEach(b=>b.classList.toggle('active',b===dur));const h=$('#academyDurationHint');if(h)h.textContent=`${ensureAcademy().duration} dakikalık oturum.`;const dialog=$('#academyGuideDialog');if(dialog?.open)renderAcademyGuideTab('session');return}const tr=e.target.closest('[data-academy-track]');if(tr){academySetTrack(tr.dataset.academyTrack);return}const open=e.target.closest('[data-academy-open]');if(open){openAcademyGuide(decodeURIComponent(open.dataset.academyOpen));return}const start=e.target.closest('[data-academy-start]');if(start){academyStart(decodeURIComponent(start.dataset.academyStart));return}const todayStart=e.target.closest('#academyTodayStart');if(todayStart){const s=academyCoachSuggestion();const id=Object.keys(academyGuides).find(k=>s?.title?.toLocaleLowerCase('tr-TR').includes(k.toLocaleLowerCase('tr-TR'))) || 'Genel Sınav Çalışması';academyStart(id);return}const tab=e.target.closest('[data-academy-tab]');if(tab){renderAcademyGuideTab(tab.dataset.academyTab);return}const add=e.target.closest('#academyAddGuide');if(add){const dlg=$('#academyGuideDialog'),id=dlg?.dataset.guide;const t=academyCreateTask(id,ensureAcademy().duration,{label:'Academy'});if(t){dlg.close();navigate('today');toast('Academy çalışması bugünün planına eklendi.')}return}const fg=e.target.closest('#academyFocusGuide');if(fg){const dlg=$('#academyGuideDialog'),id=dlg?.dataset.guide;if(id){dlg.close();academyStart(id)}return}});

bind('globalSearch','focus',()=>{$('#commandDialog')?.showModal();$('#commandInput')?.focus();commandResults('')});bind('globalSearch','keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('#commandDialog')?.showModal();$('#commandInput')?.focus();commandResults('')}});bind('commandInput','input',e=>commandResults(e.target.value));document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#commandDialog')?.showModal();$('#commandInput')?.focus();commandResults('')}});bind('commandDialog','close',()=>{const x=$('#globalSearch');if(x)x.value=''});
setFocusTimer(10);ensureDay();try{renderAll()}catch(err){console.error('Initial render error',err)}finally{setTimeout(maybeOpenOnboarding,50);setTimeout(maybeOpenOnboarding,300);setTimeout(maybeOpenOnboarding,1000)}
setTimeout(maybeOpenOnboarding,2000);
document.addEventListener('hukuk50k:cloud-ready',()=>{ setTimeout(maybeOpenOnboarding,60); setTimeout(maybeOpenOnboarding,500); });

window.addEventListener('error',e=>{
 if(/Script error/.test(e.message||''))return;
 console.error('[NEXORA] Runtime error',e.error||e.message);
});
unhandledrejection = e=>console.error('[NEXORA] Promise rejection',e.reason||e);
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{})}

document.addEventListener('hukuk50k:changed',()=>{if(ensureSocial().shareEnabled) publishFriendProfile();});
