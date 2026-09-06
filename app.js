const KEY='hukuk50k-os-v6';
const LEGACY_KEYS=['hukuk50k-os-v5','hukuk50k-os-v3'];
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
const defaultState={version:6,days:{},subjects:{},mocks:[],money:[],sessions:[],settings:{studyGoal:270,questionGoal:350,paragraphGoal:20,problemGoal:15,examDate:DEFAULT_EXAM,targetRank:30000,minRank:50000},theme:'dark',focusSessions:0,assistant:{lastPlanDate:'',lastPlanSignature:''}};
let state=load();
function migrate(x){const y=clone(x||{});y.days??={};y.subjects??={};y.mocks??=[];y.money??=[];y.sessions??=[];y.focusSessions??=0;y.theme??='dark';y.assistant??={lastPlanDate:'',lastPlanSignature:''};y.settings={...defaultState.settings,...(y.settings||{})};y.version=6;for(const d of Object.values(y.days)){d.tasks??=[];d.habits??={};d.studyMinutes??=0;d.questions??=0;d.note??='';}return y}
function load(){try{const raw=localStorage.getItem(KEY);if(raw)return migrate(JSON.parse(raw));for(const k of LEGACY_KEYS){const raw2=localStorage.getItem(k);if(raw2)return migrate(JSON.parse(raw2));}}catch{}return clone(defaultState)}
function normalize(x){return migrate(x)}
function save(){localStorage.setItem(KEY,JSON.stringify(state));document.dispatchEvent(new CustomEvent('hukuk50k:changed'))}
function ensureDay(k=today()){
 if(!state.days[k])state.days[k]={tasks:baseTasks().map(t=>({...t,id:uid('task'),done:false,source:'base'})),habits:Object.fromEntries(habitDefs.map(x=>[x[0],false])),studyMinutes:0,questions:0,note:'',phoneMinutes:0,closed:false};
 const d=state.days[k];d.habits??={};d.tasks??=[];d.studyMinutes??=0;d.questions??=0;d.note??='';d.phoneMinutes??=0;d.closed??=false;return d;
}
function taskPct(d){return d.tasks.length?Math.round(d.tasks.filter(t=>t.done).length/d.tasks.length*100):0}
function studyMinutes(d){return d.tasks.filter(t=>t.done&&['study','review'].includes(t.kind)).reduce((a,t)=>a+(Number(t.minutes)||0),0)+Number(d.studyMinutes||0)}
function habitScore(d){return habitDefs.filter(([k])=>d.habits?.[k]).length}
function systemScore(d){return Math.round(taskPct(d)*.5+(habitScore(d)/habitDefs.length*100)*.25+(Math.min(100,studyMinutes(d)/state.settings.studyGoal*100)*.25))}
function streak(){let n=0,k=today();for(let i=0;i<90;i++){const d=state.days[k];if(!d||systemScore(d)<70)break;n++;k=addDays(k,-1)}return n}
function allSubjects(){return Object.entries(curriculum)}
function topicStats(){let total=0,done=0,active=0,review=0;allSubjects().forEach(([name,topics])=>topics.forEach((_,i)=>{total++;const s=stateTopic(name,i);if(s.status==='done')done++;if(['learning','practice','review'].includes(s.status))active++;if(isDue(s))review++}));return {total,done,active,review,pct:total?Math.round(done/total*100):0}}
function stateTopic(name,i){const raw=state.subjects[name]?.[i];if(typeof raw==='string')return {status:raw,confidence:0,last:'',next:''};return raw||{status:'not_started',confidence:0,last:'',next:'',attempts:0,correct:0,wrong:0}}
function isDue(s){return s.next && s.next<=today()}
function latestMocks(type){return state.mocks.filter(m=>!type||m.type===type).slice().sort((a,b)=>a.date.localeCompare(b.date))}
function lastStudyDays(n){const out=[];for(let i=n-1;i>=0;i--){const k=addDays(today(),-i),d=state.days[k];out.push({k,d,mins:d?studyMinutes(d):0,score:d?systemScore(d):0,questions:d?.questions||0})}return out}
function recentMockTrend(type){const arr=latestMocks(type).slice(-3);if(arr.length<2)return 0;const first=arr[0].net,last=arr[arr.length-1].net;return Number((last-first).toFixed(2))}
function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),2200)}
function applyTheme(){document.documentElement.dataset.theme=state.theme;$('#themeBtn').textContent=state.theme==='dark'?'☼':'☾'}
function navigate(view){$$('.view').forEach(v=>v.classList.toggle('active',v.id===view));$$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===view));const titles={dashboard:'Kontrol Merkezi',today:'Bugünün Sistemi',focus:'Focus Room',roadmap:'Konu Motoru',mock:'Deneme Merkezi',analytics:'Performans',discipline:'Disiplin Merkezi',finance:'Para Motoru',settings:'Ayarlar'};$('#pageTitle').textContent=titles[view]||'Kontrol Merkezi';$('#contextLabel').textContent=view==='dashboard'?'HUKUK 50K • COMMAND CENTER':longDate(today()).toUpperCase()}
function daysToExam(){return daysBetween(today(),state.settings.examDate)}
function readiness(){
 const ty=latestMocks('TYT'), ay=latestMocks('AYT EA');
 const t=ty.at(-1)?.net||0,a=ay.at(-1)?.net||0;
 const tBase=50,aBase=30;
 const progress=Math.min(100,(t/tBase)*52+(a/aBase)*48);
 const consistency=Math.min(100,lastStudyDays(14).filter(x=>x.mins>=state.settings.studyGoal*.8).length/10*100);
 const topics=topicStats().pct;
 return Math.round(progress*.5+consistency*.25+topics*.25);
}
function weaknessDetails(){
 const arr=[];
 allSubjects().forEach(([name,topics])=>{
  const stats=topics.map((topic,i)=>stateTopic(name,i));
  const done=stats.filter(x=>x.status==='done').length,active=stats.filter(x=>x.status!=='not_started').length;
  const avg=stats.reduce((a,x)=>a+(Number(x.confidence)||0),0)/(stats.length||1);
  const overdue=stats.filter(isDue).length;
  const completion=done/stats.length, activity=active/stats.length, confidence=avg/5;
  const trendPenalty=name.startsWith('TYT')&&recentMockTrend('TYT')<0?Math.abs(recentMockTrend('TYT'))*1.5:name.startsWith('AYT')&&recentMockTrend('AYT EA')<0?Math.abs(recentMockTrend('AYT EA'))*1.3:0;
  const raw=completion*.45+activity*.2+confidence*.2+Math.min(1,overdue/Math.max(1,stats.length))*0.15;
  const health=clamp(Math.round(raw*100-trendPenalty),0,100);
  const urgency=clamp(Math.round((100-health)*.75+priorityWeight[name]*15),0,100);
  arr.push({label:name,name,area:areaOf(name),health,urgency,done,active,total:stats.length,avg,overdue});
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
 const d=ensureDay(),score=systemScore(d),stats=topicStats(),p=adaptivePlan(),read=readiness();
 $('#scoreBig').textContent=score;$('#scoreBar').style.width=score+'%';$('#studyBig').textContent=studyMinutes(d);$('#studyGoalSmall').textContent=state.settings.studyGoal;$('#streakBig').textContent=streak();$('#countdownBig').textContent=daysToExam();
 $('#heroDay').textContent=new Intl.DateTimeFormat('tr-TR',{weekday:'short'}).format(new Date()).toUpperCase();$('#heroDate').textContent=pad(new Date().getDate());
 $('#subjectProgress').style.width=stats.pct+'%';$('#subjectProgressText').textContent=stats.pct+'%';
 const ai=assistantInsight();$('#assistantHeadline').textContent=ai.h;$('#assistantText').textContent=ai.p;$('#assistantActions').innerHTML=ai.a.map(([v,t])=>`<button data-route="${v}">${t}</button>`).join('')+`<div class="assistant-readiness"><span>READINESS</span><b>${read}/100</b><small>${daysToExam()} gün • hedef ≤${state.settings.targetRank.toLocaleString('tr-TR')}</small></div>`;
 const open=d.tasks.filter(t=>!t.done);$('#remainingTasks').textContent=open.length;$('#questionProgress').textContent=`${d.questions||0} / ${state.settings.questionGoal}`;$('#todayCompletion').textContent=taskPct(d)+'%';$('#priorityTask').innerHTML=open[0]?`<div class="priority-label">NEXT BEST ACTION</div><strong>${esc(open[0].title)}</strong><span>${open[0].minutes||0} dk • ${esc(open[0].category)}</span>`:`<div class="priority-label">SYSTEM COMPLETE</div><strong>Tüm görevler kapalı.</strong><span>Günü kapat ve notunu yaz.</span>`;
 const ds=lastStudyDays(7);$('#weeklyStudyLabel').textContent=`${ds.reduce((a,x)=>a+x.mins,0)} dk`;$('#weeklyChart').innerHTML=ds.map(x=>`<div class="bar-col"><div class="bar-track"><i style="height:${clamp(Math.round(x.mins/Math.max(state.settings.studyGoal,...ds.map(q=>q.mins),1)*100),2,100)}%"></i></div><span>${new Intl.DateTimeFormat('tr-TR',{weekday:'short'}).format(new Date(x.k+'T12:00:00'))}</span><small>${x.mins}</small></div>`).join('');
 const mocks=latestMocks().slice(-4).reverse();$('#recentPerformance').innerHTML=mocks.length?mocks.map(m=>`<div class="stack-row"><div><span class="badge ${m.type==='TYT'?'success':'purple'}">${m.type}</span><strong>${m.net.toFixed(2)} net</strong></div><small>${fmtDate(m.date)}</small></div>`).join(''):'<div class="empty">İlk denemeni girdikten sonra burada trend görünecek.</div>';
 const ws=weaknessDetails().slice(0,3);$('#weaknessRadar').innerHTML=ws.map((w,i)=>`<div class="radar-row"><div><span class="radar-num">0${i+1}</span><strong>${esc(w.label)}</strong><small>${w.overdue?`${w.overdue} tekrar gecikmiş • `:''}${w.done}/${w.total} konu tamam</small></div><div class="radar-meter"><i style="width:${w.urgency}%"></i></div><b>${w.urgency}</b></div>`).join('');
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
 $('#roadmapGrid').innerHTML=allSubjects().filter(([name])=>area==='ALL'||areaOf(name)===area).map(([name,topics])=>{const mapped=topics.map((topic,i)=>({topic,i,data:stateTopic(name,i)})).filter(x=>status==='ALL'||x.data.status===status);const localDone=topics.filter((_,i)=>stateTopic(name,i).status==='done').length;const localActive=topics.filter((_,i)=>['learning','practice','review'].includes(stateTopic(name,i).status)).length;total+=topics.length;done+=localDone;active+=localActive;return `<article class="subject-panel"><div class="subject-top"><div><span class="section-kicker">${areaOf(name)}</span><h3>${name}</h3></div><div class="count">${localDone}/${topics.length} tamam</div></div><div class="subject-progress"><i style="width:${Math.round(localDone/topics.length*100)}%"></i></div>${mapped.map(x=>{const c=clamp(Number(x.data.confidence||0),0,5);const s=x.data.status;return `<div class="topic-row"><div><strong>${esc(x.topic)}</strong><small>${topicStatusLabel(s)}${x.data.next?' • tekrar '+fmtDate(x.data.next):''}${isDue(x.data)?' • GECİKMİŞ':''}</small></div><select data-topic="${encodeURIComponent(name)}|${x.i}"><option value="not_started" ${s==='not_started'?'selected':''}>Başlamadı</option><option value="learning" ${s==='learning'?'selected':''}>Çalışılıyor</option><option value="practice" ${s==='practice'?'selected':''}>Soru aşaması</option><option value="review" ${s==='review'?'selected':''}>Tekrar</option><option value="done" ${s==='done'?'selected':''}>Tamamlandı</option></select><div class="confidence" title="Güven ${c}/5">${[1,2,3,4,5].map(i=>`<i class="conf-dot ${i<=c?'on':''}" data-confidence="${encodeURIComponent(name)}|${x.i}|${i}"></i>`).join('')}</div></div>`}).join('')}</article>`}).join('')||'<div class="empty">Filtreye uygun konu bulunamadı.</div>';
 const p=topicStats();$('#topicTotal').textContent=p.total;$('#topicDone').textContent=p.done;$('#topicActive').textContent=p.active;$('#roadmapProgress').style.width=p.pct+'%';$('#roadmapProgressText').textContent=p.pct+'%';
}
function topicStatusLabel(s){return ({not_started:'Başlamadı',learning:'Çalışılıyor',practice:'Soru aşaması',review:'Tekrar',done:'Tamamlandı'})[s]||'Başlamadı'}
function renderMock(){
 const m=state.mocks.slice().sort((a,b)=>b.date.localeCompare(a.date)),t=m.filter(x=>x.type==='TYT'),a=m.filter(x=>x.type==='AYT EA');const avg=x=>x.length?(x.reduce((s,y)=>s+y.net,0)/x.length):0;
 $('#mockKpis').innerHTML=`${[['Toplam',m.length,'deneme'],['TYT ort.',avg(t).toFixed(2),'net'],['AYT EA ort.',avg(a).toFixed(2),'net'],['Readiness',readiness(),' / 100']].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('')}`;
 const f=$('#mockFilter').value,arr=m.filter(x=>f==='ALL'||x.type===f);$('#mockTable').innerHTML=arr.length?`<div class="mock-header"><span>TÜR</span><span>NET</span><span>TARİH</span><span>KIRILIM</span><span></span></div>`+arr.map(x=>`<div class="mock-row"><div><span class="badge ${x.type==='TYT'?'success':'purple'}">${x.type}</span></div><div><strong>${x.net.toFixed(2)}</strong></div><div><span>${fmtDate(x.date)}</span></div><div class="mock-sub"><span>T/E ${x.breakdown?.turkce??x.breakdown?.edebiyat??'—'}</span><span>M ${x.breakdown?.math??'—'}</span><span>S ${x.breakdown?.social??'—'}</span><span>F ${x.breakdown?.science??'—'}</span></div><button class="danger-btn" data-delmock="${x.id}">Sil</button></div>`).join(''):'<div class="empty">Deneme yok. İlk kaydınla veri motorunu başlat.</div>';
}
function lineSvg(values,labels){if(values.length<2)return '<div class="empty">Trend için en az 2 deneme gerekir.</div>';const w=760,h=250,p=26,min=Math.min(...values),max=Math.max(...values),range=Math.max(1,max-min);const pts=values.map((v,i)=>{const x=p+i*(w-2*p)/(values.length-1),y=h-p-((v-min)/range)*(h-2*p);return [x,y]}),path=pts.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' ');return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="gline" x1="0" x2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".2"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs><path d="${path}" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="${path} L ${pts.at(-1)[0]} ${h-p} L ${pts[0][0]} ${h-p} Z" fill="url(#gline)" opacity=".35"/>${pts.map((q,i)=>`<circle cx="${q[0]}" cy="${q[1]}" r="5" fill="currentColor"><title>${labels[i]} • ${values[i]}</title></circle>`).join('')}</svg>`}
function renderAnalytics(){
 const t=latestMocks('TYT').slice(-10),a=latestMocks('AYT EA').slice(-10),td=lastStudyDays(14);$('#analyticsKpis').innerHTML=`${[['TYT son',t.at(-1)?.net?.toFixed(2)||'—','net'],['AYT EA son',a.at(-1)?.net?.toFixed(2)||'—','net'],['14 gün ders',td.reduce((s,x)=>s+x.mins,0),'dk'],['Readiness',readiness(),' / 100']].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('')}`;
 $('#netChart').innerHTML=t.length<2?'<div class="empty">Trend için en az 2 TYT denemesi kaydet.</div>':lineSvg(t.map(x=>x.net),t.map(x=>fmtDate(x.date)));
 const max=Math.max(state.settings.studyGoal,...td.map(x=>x.mins),1);$('#loadChart').innerHTML=td.map(x=>{const n=fmtDate(x.k);return `<div class="bar-col"><div class="bar-track"><i style="height:${clamp(Math.round(x.mins/max*100),2,100)}%"></i></div><span>${n}</span><small>${x.mins}</small></div>`}).join('');
 const w=weaknessDetails()[0];$('#analysisWeak').textContent=w?`${w.label} / ${w.health}/100`:'—';$('#analysisWeakText').textContent=w?`${w.overdue?`${w.overdue} gecikmiş tekrar • `:''}öncelik skoru ${w.urgency}/100.`:'Konu verisi bekleniyor.';const comp=Math.round(td.slice(-7).reduce((s,x)=>s+x.score,0)/7);$('#analysisReliability').textContent=comp+'%';$('#analysisReliabilityText').textContent='Son 7 gün sistem skoru ortalaması.';const active=lastStudyDays(30).filter(x=>x.d&&systemScore(x.d)>=40).length;$('#analysisConsistency').textContent=active+'/30';$('#analysisConsistencyText').textContent='Son 30 günde ≥40 skor alınan gün.';
}
function renderDiscipline(){const days=lastStudyDays(30);$('#disciplineHeatmap').innerHTML=days.map(x=>`<div class="heat-cell ${heatClass(x.score)}" title="${fmtDate(x.k)} • ${x.score}"></div>`).join('');$('#disciplineCards').innerHTML=`<article class="card"><span class="section-kicker">CURRENT</span><h3>${systemScore(ensureDay())}/100</h3><p class="muted">Bugünün sistem skoru.</p></article><article class="card"><span class="section-kicker">7 DAY AVG</span><h3>${Math.round(days.slice(-7).reduce((a,x)=>a+x.score,0)/7)}%</h3><p class="muted">Son 7 gün ortalaması.</p></article><article class="card"><span class="section-kicker">STREAK</span><h3>${streak()} gün</h3><p class="muted">70+ skorla kırılmadan devam.</p></article>`}
function heatClass(s){return s>=85?'h4':s>=70?'h3':s>=40?'h2':s>0?'h1':'h0'}
function renderFinance(){const m=state.money.reduce((a,x)=>{if(x.date.slice(0,7)===today().slice(0,7)){a[x.type==='income'?'inc':'exp']+=Number(x.amount)||0}return a},{inc:0,exp:0});const net=BASE_SALARY+m.inc-m.exp;$('#financeKpis').innerHTML=`${[['Sabit maaş',BASE_SALARY,'TL'],['Ek gelir',m.inc.toLocaleString('tr-TR'),'TL'],['Gider',m.exp.toLocaleString('tr-TR'),'TL'],['Net akış',net.toLocaleString('tr-TR'),'TL']].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('')}`;const rows=[['Maaş',BASE_SALARY],['Ek gelir',m.inc],['Gider',-m.exp],['Net',net]];const max=Math.max(BASE_SALARY,m.inc,m.exp,Math.abs(net),1);$('#cashflowBars').innerHTML=`<div class="finance-stack">${rows.map(r=>`<div class="cash-line"><span>${r[0]}</span><div class="cash-track"><i style="width:${Math.max(3,Math.round(Math.abs(r[1])/max*100))}%"></i></div><strong>${r[1]<0?'-':''}₺${Math.abs(r[1]).toLocaleString('tr-TR')}</strong></div>`).join('')}</div>`;$('#moneyList').innerHTML=state.money.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,20).map(x=>`<div class="money-item"><div><strong>${esc(x.desc)}</strong><small>${fmtDate(x.date)} • ${x.type==='income'?'Gelir':'Gider'}</small></div><strong class="${x.type==='income'?'income':'expense'}">${x.type==='income'?'+':'-'}₺${Number(x.amount).toLocaleString('tr-TR')}</strong></div>`).join('')||'<div class="empty">Henüz para hareketi yok.</div>'}
function renderSettings(){$('#setStudy').value=state.settings.studyGoal;$('#setQuestions').value=state.settings.questionGoal;$('#setParagraph').value=state.settings.paragraphGoal;$('#setProblem').value=state.settings.problemGoal;ensureSettingsExtra()}
function ensureSettingsExtra(){const host=$('#settings .main-grid-gap');if($('#strategyCard')||!host)return;const a=document.createElement('article');a.id='strategyCard';a.className='card settings-card';a.innerHTML=`<div class="card-head"><div><span class="section-kicker">MISSION CONTROL</span><h3>Hedef & zaman ufku</h3></div><span class="badge purple">LAW / EA</span></div><label>Provisional sınav tarihi<input id="setExamDate" type="date"></label><label>Stretch sıralama hedefi<input id="setTargetRank" type="number" min="1"></label><label>Minimum hukuk hedefi<input id="setMinRank" type="number" min="1"></label><div class="system-note"><strong>Koç prensibi</strong><span>Panel kesin sıralama tahmini yapmaz. Readiness; deneme, konu kapsamı ve disiplin verilerini birleştiren iç performans göstergesidir.</span></div><button id="saveStrategy" class="primary-btn">Stratejiyi kaydet</button>`;host.appendChild(a);$('#setExamDate').value=state.settings.examDate;$('#setTargetRank').value=state.settings.targetRank;$('#setMinRank').value=state.settings.minRank;$('#saveStrategy').onclick=()=>{state.settings.examDate=$('#setExamDate').value||DEFAULT_EXAM;state.settings.targetRank=clamp(Number($('#setTargetRank').value)||30000,1,200000);state.settings.minRank=clamp(Number($('#setMinRank').value)||50000,1,200000);save();renderAll();toast('Hedef stratejisi güncellendi.')}}
function renderAll(){applyTheme();ensureDay();renderDashboard();renderToday();renderRoadmap();renderMock();renderAnalytics();renderDiscipline();renderFinance();renderSettings();}
function addTask(){const d=ensureDay(),title=$('#taskTitle').value.trim();if(!title)return;const cat=$('#taskCategory').value;d.tasks.push({id:uid('task'),title,category:cat,minutes:Number($('#taskMinutes').value)||0,kind:['TYT','AYT','Tekrar'].includes(cat)?'study':cat==='EB Digital'?'work':cat==='Spor'?'life':'life',done:false,source:'manual'});save();$('#taskDialog').close();$('#taskForm').reset();renderAll();toast('Görev eklendi.')}
function addMock(){const type=$('#mockType').value,net=Number($('#mockNet').value);if(!net)return;state.mocks.push({id:uid('mock'),type,net,date:$('#mockDate').value||today(),note:$('#mockNote').value.trim(),duration:Number($('#mockDuration').value)||0,breakdown:{turkce:valOrNull($('#mockTurkce').value),math:valOrNull($('#mockMath').value),social:valOrNull($('#mockSocial').value),science:valOrNull($('#mockScience').value)}});save();$('#mockDialog').close();$('#mockForm').reset();$('#mockDate').value=today();renderAll();toast(`${type} denemesi kaydedildi.`)}
function valOrNull(v){return v===''?null:Number(v)}
function addMoney(typeOverride){$('#moneyType').value=typeOverride||'income';$('#moneyDialog').showModal()}
function saveMoney(){const desc=$('#moneyDesc').value.trim(),amt=Number($('#moneyAmount').value),type=$('#moneyType').value;if(!desc||!amt)return;state.money.push({id:uid('money'),type,desc,amount:amt,date:today()});save();$('#moneyDialog').close();$('#moneyForm').reset();renderAll();toast(type==='income'?'Gelir kaydedildi.':'Gider kaydedildi.')}
function saveNote(){const d=ensureDay();d.note=$('#dayNote').value.trim();save();toast('Gün notu kaydedildi.')}
function finishDay(){const d=ensureDay(),open=d.tasks.filter(t=>!t.done);if(open.length){toast(`${open.length} açık görev var. Sistem günü kapatmıyor.`);return}d.closed=true;d.habits.study=true;save();renderAll();toast('Gün kapatıldı. Sistem bunu başarı gününe işledi.')}
function optimizePlan(){const d=ensureDay(),p=adaptivePlan();const keep=d.tasks.filter(t=>t.done||(!t.ai&&!/^Tekrar •/.test(t.title)&&!/^AI •/.test(t.title)));const existing=new Set(keep.filter(t=>!t.done).map(t=>t.title));p.plan.forEach(x=>{if(!existing.has(x.title))keep.push({id:uid('task'),title:x.title,category:x.category,minutes:x.minutes,kind:'study',done:false,reason:x.reason,ai:true,source:'assistant'})});d.tasks=keep;state.assistant.lastPlanDate=today();state.assistant.lastPlanSignature=p.plan.map(x=>x.title).join('|');save();renderAll();toast(`Plan optimize edildi • ${p.plan.length} akıllı blok`)}
function setTopic(name,i,status){state.subjects[name]??={};const prev=stateTopic(name,i);let next=prev.next;let confidence=prev.confidence||0;if(status==='done'){next=addDays(today(),confidence>=4?14:confidence===3?10:7)}else if(status==='review'){next=addDays(today(),7)}state.subjects[name][i]={...prev,status,last:today(),next,confidence};save()}
function setConfidence(name,i,c){state.subjects[name]??={};const prev=stateTopic(name,i);let next=prev.next;if(prev.status==='done')next=addDays(today(),c>=4?21:c===3?14:7);state.subjects[name][i]={...prev,confidence:c,last:today(),next};save()}
function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`hukuk-50k-os-${today()}.json`;a.click();URL.revokeObjectURL(url);toast('Yedek hazırlanıyor.')}
function importData(file){const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x||typeof x!=='object')throw Error();state=normalize(x);save();renderAll();toast('Yedek yüklendi.')}catch{toast('Geçersiz JSON yedeği.')}};r.readAsText(file)}
const focus={total:1500,left:1500,running:false,handle:null,taskId:null};
function renderTimer(){const m=Math.floor(focus.left/60),s=focus.left%60;$('#timerDisplay').textContent=`${pad(m)}:${pad(s)}`;const pct=focus.total?((focus.total-focus.left)/focus.total)*360:0;$('#focus .focus-ring').style.background=`conic-gradient(var(--accent) ${pct}deg,#1a2230 ${pct}deg)`}
function setFocusTimer(mins=25){focus.total=mins*60;focus.left=focus.total;focus.running=false;renderTimer()}
function startTimer(){if(focus.running)return;focus.running=true;focus.handle=setInterval(()=>{if(focus.left<=0){completeFocus();return}focus.left--;renderTimer()},1000)}
function completeFocus(){stopTimer();const mins=Math.round(focus.total/60);state.focusSessions++;const d=ensureDay();d.studyMinutes=(Number(d.studyMinutes)||0)+mins;if(focus.taskId){const t=d.tasks.find(x=>x.id===focus.taskId);if(t&&!t.done){t.focusLogged=(t.focusLogged||0)+mins;if((t.focusLogged||0)>=Math.max(20,t.minutes||25))t.done=true;}}state.sessions.push({id:uid('session'),date:today(),minutes:mins,taskId:focus.taskId,createdAt:new Date().toISOString()});save();renderAll();toast(`Focus tamamlandı • ${mins} dk gerçek çalışma kaydedildi.`);focus.taskId=null;setFocusTimer(25)}
function stopTimer(){focus.running=false;clearInterval(focus.handle);focus.handle=null;renderTimer()}
function resetTimer(){stopTimer();setFocusTimer(25)}
function commandResults(q){const commands=[['Bugünün sistemini aç','today'],['Focus Room','focus'],['Konu motoru','roadmap'],['Deneme merkezi','mock'],['Performans','analytics'],['Disiplin','discipline'],['Para motoru','finance'],['Ayarlar','settings']];const f=commands.filter(x=>x[0].toLowerCase().includes(q.toLowerCase()));$('#commandResults').innerHTML=f.map(x=>`<button class="command-item" data-route="${x[1]}"><strong>${x[0]}</strong><span>↵ aç</span></button>`).join('')||'<div class="empty">Komut bulunamadı.</div>'}
// Events
$$('.nav-item').forEach(b=>b.addEventListener('click',()=>{navigate(b.dataset.view);$('#sidebar')?.classList.remove('open')}));
document.addEventListener('click',e=>{
 const route=e.target.closest('[data-route]');if(route){navigate(route.dataset.route);const dlg=$('#commandDialog');if(dlg?.open)dlg.close();return}
 const task=e.target.closest('[data-task]');if(task){const d=ensureDay(),t=d.tasks.find(x=>x.id===task.dataset.task);if(t){t.done=!t.done;save();renderAll();toast(t.done?'Görev tamamlandı.':'Görev geri açıldı.')}return}
 const hb=e.target.closest('[data-habit]');if(hb){const d=ensureDay();d.habits[hb.dataset.habit]=!d.habits[hb.dataset.habit];save();renderAll();return}
 const del=e.target.closest('[data-delmock]');if(del){state.mocks=state.mocks.filter(m=>m.id!==del.dataset.delmock);save();renderAll();toast('Deneme silindi.');return}
 const conf=e.target.closest('[data-confidence]');if(conf){const [name,i,c]=decodeURIComponent(conf.dataset.confidence).split('|');setConfidence(name,Number(i),Number(c));renderRoadmap();renderDashboard();toast(`Güven seviyesi ${c}/5.`);return}
});
$('#addTask').onclick=()=>$('#taskDialog').showModal();$('#taskForm').onsubmit=e=>{e.preventDefault();addTask()};
$('#addMock').onclick=()=>{$('#mockDate').value=today();$('#mockDialog').showModal()};$('#mockForm').onsubmit=e=>{e.preventDefault();addMock()};
$('#addIncomeQuick').onclick=()=>addMoney('income');$('#addExpenseQuick').onclick=()=>addMoney('expense');$('#moneyForm').onsubmit=e=>{e.preventDefault();saveMoney()};
$('#finishDay').onclick=finishDay;$('#regeneratePlan').onclick=optimizePlan;$('#saveDayNote').onclick=saveNote;$('#roadmapArea').onchange=renderRoadmap;$('#roadmapStatus').onchange=renderRoadmap;$('#mockFilter').onchange=renderMock;
document.addEventListener('change',e=>{const s=e.target.closest('[data-topic]');if(s){const [name,i]=decodeURIComponent(s.dataset.topic).split('|');setTopic(name,Number(i),s.value);renderRoadmap();renderDashboard()}});
$('#saveSettings').onclick=()=>{state.settings.studyGoal=clamp(Number($('#setStudy').value)||270,120,720);state.settings.questionGoal=clamp(Number($('#setQuestions').value)||350,50,1200);state.settings.paragraphGoal=clamp(Number($('#setParagraph').value)||20,0,100);state.settings.problemGoal=clamp(Number($('#setProblem').value)||15,0,100);save();renderAll();toast('Günlük hedefler güncellendi.')};
$('#exportTop').onclick=exportData;$('#exportSettings').onclick=exportData;$('#importSettings').onchange=e=>{const f=e.target.files?.[0];if(f)importData(f)};$('#resetSettings').onclick=()=>{if(confirm('Tüm takip verileri silinecek. Emin misin?')){state=clone(defaultState);save();renderAll();toast('Veriler sıfırlandı.')}};
$('#themeBtn').onclick=()=>{state.theme=state.theme==='dark'?'light':'dark';save();applyTheme()};$('#mobileMenu').onclick=()=>$('#sidebar').classList.toggle('open');
$('#focusTaskSelect').onclick=()=>{const d=ensureDay(),open=d.tasks.filter(t=>!t.done&&['study','review'].includes(t.kind));if(!open.length){toast('Açık akademik görev kalmadı.');return}focus.taskId=open[0].id;$('#focusTargetLabel').textContent=open[0].title;$('#focusSelected').textContent=`Seçildi • ${open[0].minutes||25} dk • ${open[0].category}`;setFocusTimer(Math.min(50,Math.max(25,Math.round((open[0].minutes||25)/5)*5)))};
$('#timerStart').onclick=startTimer;$('#timerPause').onclick=stopTimer;$('#timerReset').onclick=resetTimer;
$('#globalSearch').onfocus=()=>{$('#commandDialog').showModal();$('#commandInput').focus();commandResults('')};$('#globalSearch').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();$('#commandDialog').showModal();$('#commandInput').focus();commandResults('')}};$('#commandInput').oninput=e=>commandResults(e.target.value);document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#commandDialog').showModal();$('#commandInput').focus();commandResults('')}});$('#commandDialog').addEventListener('close',()=>{$('#globalSearch').value=''});
setFocusTimer(25);ensureDay();renderAll();
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{})}
