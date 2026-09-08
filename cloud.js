(() => {
  'use strict';
  const CFG_KEY = 'hukuk50k-supabase-config-v1';
  const CLOUD_META_KEY = 'hukuk50k-cloud-meta-v1';
  const CLOUD_USER_KEY = 'hukuk50k-cloud-user-v1';
  let client = null;
  let user = null;
  let syncTimer = null;
  let lastCloudUpdate = 0;
  let syncing = false;

  const $c = (s, r = document) => r.querySelector(s);
  const escC = s => String(s).replace(/[&<>\'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));

  function readConfig() {
    try {
      const saved = JSON.parse(localStorage.getItem(CFG_KEY) || 'null');
      if (saved?.url && saved?.key) return saved;
    } catch {}
    return window.HUKUK50K_SUPABASE || { url: '', key: '' };
  }

  function writeConfig(url, key) {
    localStorage.setItem(CFG_KEY, JSON.stringify({ url: String(url).trim(), key: String(key).trim() }));
  }

  function configured() {
    const c = readConfig();
    return !!(c.url && c.key && window.supabase?.createClient);
  }

  function setCloudStatus(text, tone='muted') {
    const el = $c('#cloudStatus');
    if (!el) return;
    el.textContent = text;
    el.dataset.tone = tone;
  }

  function injectStyles() {
    if ($c('#cloudStyles')) return;
    const st = document.createElement('style');
    st.id = 'cloudStyles';
    st.textContent = `
      #cloudGate{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgba(3,7,13,.72);backdrop-filter:blur(18px);padding:24px}
      #cloudGate[hidden]{display:none}
      .cloud-card{width:min(470px,100%);border:1px solid rgba(255,255,255,.10);background:linear-gradient(145deg,rgba(18,25,38,.98),rgba(10,15,24,.98));border-radius:24px;padding:28px;box-shadow:0 28px 90px rgba(0,0,0,.45)}
      .cloud-brand{font-size:12px;letter-spacing:.14em;color:#8d9ab3;font-weight:800}.cloud-card h2{margin:8px 0 6px;font-size:28px}.cloud-card p{color:#9ca9bd;line-height:1.55}.cloud-card label{display:block;margin:14px 0 0;font-size:12px;color:#9aa7bb;font-weight:700}.cloud-card input{width:100%;margin-top:7px;padding:12px 13px;border-radius:12px;border:1px solid rgba(255,255,255,.10);background:#0a1019;color:#fff;outline:none}.cloud-card input:focus{border-color:rgba(111,95,255,.65);box-shadow:0 0 0 3px rgba(111,95,255,.14)}
      .cloud-row{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}.cloud-row button{flex:1;min-width:140px}.cloud-note{font-size:11px;color:#738096;margin-top:16px}.cloud-error{color:#ff8d9a;font-size:12px;margin-top:10px;min-height:16px}.cloud-user-pill{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(255,255,255,.025);margin-top:14px}.cloud-user-pill small{display:block;color:#7d8aa1}.cloud-link{background:none;border:0;color:#9f92ff;cursor:pointer;font-weight:700;padding:4px}.cloud-sync-dot{width:8px;height:8px;border-radius:50%;display:inline-block;background:#5d687b;margin-right:7px;box-shadow:0 0 0 4px rgba(93,104,123,.10)}.cloud-sync-dot.ok{background:#5bda9a;box-shadow:0 0 0 4px rgba(91,218,154,.12)}.cloud-sync-dot.busy{background:#ffc65a;box-shadow:0 0 0 4px rgba(255,198,90,.12)}.cloud-sync-dot.err{background:#ff7080;box-shadow:0 0 0 4px rgba(255,112,128,.12)}
    `;
    document.head.appendChild(st);
  }

  function injectGate() {
    if ($c('#cloudGate')) return;
    const gate = document.createElement('div');
    gate.id = 'cloudGate';
    gate.hidden = true;
    gate.innerHTML = `
      <div class="cloud-card" role="dialog" aria-modal="true" aria-labelledby="cloudTitle">
        <div class="cloud-brand">NEXORA • CLOUD</div>
        <h2 id="cloudTitle">Kişisel hesabına giriş</h2>
        <p>Verilerin artık cihazdan bağımsız senkronize edilebilir. Hesap açınca çalışma geçmişin, denemelerin ve hedeflerin bulutta saklanır.</p>
        <label class="cloud-name-field">Ad / görünen isim <span style="font-weight:500;color:#637087">(isteğe bağlı)</span><input id="cloudDisplayName" type="text" autocomplete="name" maxlength="40" placeholder="Efecan, Bercan…"></label>
        <label>E-posta<input id="cloudEmail" type="email" autocomplete="email" placeholder="ornek@mail.com"></label>
        <label>Şifre<input id="cloudPassword" type="password" autocomplete="current-password" placeholder="En az 6 karakter"></label>
        <div class="cloud-row"><button id="cloudLogin" class="primary-btn">Giriş yap</button><button id="cloudSignup" class="secondary-btn">Hesap oluştur</button></div>
        <div id="cloudGateError" class="cloud-error"></div>
        <div class="cloud-note">Yalnızca Supabase'in publishable/anon anahtarını kullan. service_role/secret anahtarını tarayıcıya koyma.</div>
      </div>`;
    document.body.appendChild(gate);
    $c('#cloudLogin').onclick = () => auth('login');
    $c('#cloudSignup').onclick = () => auth('signup');
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$c('#cloudGate').hidden) closeGate(); });
  }

  function openGate(error='') {
    const gate = $c('#cloudGate');
    if (!gate) return;
    gate.hidden = false;
    $c('#cloudGateError').textContent = error;
    setTimeout(() => $c('#cloudEmail')?.focus(), 40);
  }
  function closeGate() { const gate=$c('#cloudGate'); if(gate) gate.hidden=true; }

  async function initClient() {
    if (!configured()) return false;
    const c = readConfig();
    try {
      client = window.supabase.createClient(c.url, c.key, { auth: { persistSession:true, autoRefreshToken:true, detectSessionInUrl:true } });
      const { data } = await client.auth.getSession();
      user = data?.session?.user || null;
      client.auth.onAuthStateChange((_event, session) => {
        user = session?.user || null;
        refreshCloudUI();
        document.dispatchEvent(new CustomEvent('hukuk50k:cloud-ready'));
        if (user) pullCloud();
      });
      return true;
    } catch (e) {
      client=null; user=null; setCloudStatus('Bağlantı ayarı geçersiz','err'); return false;
    }
  }

  async function auth(mode) {
    if (!client) return openGate('Önce Ayarlar > Bulut Senkronizasyonu bölümünden Supabase bağlantısını yap.');
    const email = $c('#cloudEmail').value.trim();
    const password = $c('#cloudPassword').value;
    const err = $c('#cloudGateError'); err.textContent='';
    if (!email || password.length < 6) { err.textContent='Geçerli bir e-posta ve en az 6 karakterlik şifre gir.'; return; }
    const res = mode==='signup'
      ? await client.auth.signUp({ email, password, options:{ emailRedirectTo: location.origin + location.pathname, data:{ full_name: (($c('#cloudDisplayName')?.value || '').trim()).slice(0,40) } } })
      : await client.auth.signInWithPassword({ email, password });
    if (res.error) { err.textContent = res.error.message; return; }
    if (mode==='signup' && !res.data?.session) {
      err.textContent='Hesap oluşturuldu. E-posta doğrulamasını tamamladıktan sonra giriş yap.';
      return;
    }
    user = res.data.user || res.data.session?.user || null;
    closeGate();
    await pullCloud();
    refreshCloudUI();
    document.dispatchEvent(new CustomEvent('hukuk50k:cloud-ready'));
  }

  function getDisplayName() {
    const meta = user?.user_metadata || {};
    const raw = meta.full_name || meta.name || meta.display_name || '';
    return String(raw).trim().slice(0,40);
  }

  function renderSidebarProfile() {
    const nameEl = document.querySelector('#sidebarProfileName');
    const subEl = document.querySelector('#sidebarProfileSub');
    const avatarEl = document.querySelector('#sidebarAvatar');
    const card = document.querySelector('#sidebarProfile');
    if (!card) return;
    const name = getDisplayName();
    if (name) {
      nameEl.textContent = name;
      nameEl.hidden = false;
      avatarEl.textContent = name.charAt(0).toLocaleUpperCase('tr-TR');
    } else if (user?.email) {
      // İsim yoksa kişiye özel sabit bir isim göstermiyoruz.
      nameEl.textContent = '';
      nameEl.hidden = true;
      avatarEl.textContent = '•';
    } else {
      nameEl.textContent = '';
      nameEl.hidden = true;
      avatarEl.textContent = '•';
    }
    if (subEl) { try { const program=(typeof selectedProgram==='function'?selectedProgram():'Hedef'); subEl.textContent = `Hedef • ${program}`; } catch { subEl.textContent = 'Hedef • Henüz seçilmedi'; } }
  }

  function profileMarkup() {
    const box = $c('#cloudProfileBox');
    if (!box) return;
    if (!configured()) {
      box.innerHTML = `<div class="system-note"><strong>Bulut bağlantısı hazır değil</strong><span>Supabase URL + publishable key girerek çoklu cihaz senkronizasyonunu aç.</span></div>`;
      setCloudStatus('Yerel mod','muted');
      return;
    }
    if (!client) {
      box.innerHTML = `<div class="system-note"><strong>Bağlantı başlatılamadı</strong><span>URL ve publishable key değerlerini kontrol et.</span></div>`;
      return;
    }
    if (!user) {
      box.innerHTML = `<div class="system-note"><strong>Bulut bağlı • giriş bekleniyor</strong><span>Hesabını aç veya giriş yap. Yerel verilerin silinmez.</span><button id="cloudOpenLogin" class="secondary-btn" style="margin-top:12px">Giriş / Kayıt</button></div>`;
      $c('#cloudOpenLogin').onclick=()=>openGate();
      setCloudStatus('Giriş bekleniyor','muted');
      return;
    }
    box.innerHTML = `<div class="cloud-user-pill"><div><strong>${escC(user.email||'Hesap')}</strong><small>Bulut hesabı aktif</small></div><div><button id="cloudSyncNow" class="cloud-link">Şimdi senkronize</button><button id="cloudLogout" class="cloud-link">Çıkış</button></div></div><div id="cloudStatus" class="system-note" style="margin-top:12px"><strong><span class="cloud-sync-dot ok"></span>Senkronizasyon açık</strong><span>Değişiklikler otomatik olarak kaydedilir.</span></div>`;
    $c('#cloudSyncNow').onclick=async()=>{await pushCloud(true)};
    $c('#cloudLogout').onclick=async()=>{await client.auth.signOut(); user=null; refreshCloudUI()};
    setCloudStatus('Senkronize hazır','ok');
  }

  function refreshCloudUI() {
    renderSidebarProfile();
    profileMarkup();
    const badge=$c('#sidebarCloudBadge');
    if (badge) badge.textContent = user ? 'CLOUD • AKTİF' : configured() ? 'CLOUD • PASİF' : 'LOCAL MODE';
  }

  function statePayload() {
    return clone(state);
  }

  async function pullCloud() {
    if (!client || !user || syncing) return;
    syncing=true; setCloudStatus('Bulut verisi okunuyor…','busy');
    try {
      const { data, error } = await client.from('user_state').select('data,updated_at').eq('user_id',user.id).maybeSingle();
      if (error) throw error;
      if (data?.data) {
        const localAt = Number(localStorage.getItem(CLOUD_META_KEY)||0);
        const cloudAt = Date.parse(data.updated_at||'') || 0;
        if (cloudAt > localAt || !localAt) {
          const merged = normalize(data.data);
          state = merged;
          save();
          try { localStorage.setItem(CLOUD_META_KEY,String(cloudAt||Date.now())); } catch {}
          if (typeof renderAll==='function') renderAll();
          toast('Bulut verisi cihaza eşitlendi.');
        }
      } else {
        const localOwner = state?.settings?.onboardingUserId || '';
        const knownUser = localStorage.getItem(CLOUD_USER_KEY) || '';
        const belongsToCurrent = localOwner === user.id || knownUser === user.id;
        if (!belongsToCurrent) {
          state = clone(defaultState);
          state.settings.onboardingComplete = false;
          state.settings.onboardingUserId = '';
          save();
          try { localStorage.removeItem(CLOUD_META_KEY); } catch {}
          try { localStorage.setItem(CLOUD_USER_KEY, user.id); } catch {}
          if (typeof renderAll==='function') renderAll();
        } else {
          try { localStorage.setItem(CLOUD_USER_KEY, user.id); } catch {}
        }
        await pushCloud(false);
        document.dispatchEvent(new CustomEvent('hukuk50k:cloud-ready'));
      }
      try { localStorage.setItem(CLOUD_USER_KEY, user.id); } catch {}
      document.dispatchEvent(new CustomEvent('hukuk50k:cloud-ready'));
      setCloudStatus('Senkronize edildi','ok');
    } catch(e) {
      setCloudStatus('Senkronizasyon hatası','err');
      toast('Bulut senkronizasyonu başarısız.');
      console.error(e);
    } finally { syncing=false; }
  }

  async function pushCloud(manual=false) {
    if (!client || !user || syncing) return;
    syncing=true; setCloudStatus('Buluta kaydediliyor…','busy');
    try {
      const payload=statePayload();
      const { error } = await client.from('user_state').upsert({ user_id:user.id, data:payload, updated_at:new Date().toISOString() }, { onConflict:'user_id' });
      if (error) throw error;
      const now=Date.now();
      try { localStorage.setItem(CLOUD_META_KEY,String(now)); } catch {}
      setCloudStatus('Son senkron: şimdi','ok');
      if (manual) toast('Bulut senkronizasyonu tamamlandı.');
    } catch(e) {
      setCloudStatus('Kaydetme hatası','err');
      if (manual) toast('Buluta kaydedilemedi.');
      console.error(e);
    } finally { syncing=false; }
  }

  function hookSave() {
    const original = window.save;
    // save() is declared in app.js as a global lexical binding; wrapper via event queue is safer.
    document.addEventListener('hukuk50k:changed', () => {
      clearTimeout(syncTimer);
      syncTimer=setTimeout(()=>pushCloud(false),900);
    });
    const oldLocalStorage = localStorage.setItem.bind(localStorage);
    // No monkey-patching; app.js emits changes only through this lightweight observer below.
    const originalSave = eval('save');
    if (typeof originalSave === 'function') {
      // Repeated calls remain synchronous in the app; cloud sync is debounced through a polling signature.
      let last='';
      setInterval(()=>{
        try {
          const raw=localStorage.getItem('hukuk50k-os-v20')||'';
          if(raw && raw!==last){ last=raw; if(user){ clearTimeout(syncTimer); syncTimer=setTimeout(()=>pushCloud(false),1100); } }
        } catch {}
      },1500);
    }
  }

  function injectSettingsCard() {
    const settings = $c('#settings .main-grid-gap');
    if (!settings || $c('#cloudSettingsCard')) return;
    const article=document.createElement('article');
    article.id='cloudSettingsCard'; article.className='card settings-card';
    const c=readConfig();
    article.innerHTML=`<div class="card-head"><div><span class="section-kicker">CLOUD SYNC / AUTH</span><h3>Bulut Senkronizasyonu</h3></div><span id="sidebarCloudBadge" class="badge purple">CLOUD</span></div>
      <p class="muted">Telefon + bilgisayar arasında aynı verileri kullanmak için Supabase hesabını bağla. Publishable key tarayıcıda kullanılabilir; <b>service_role</b> anahtarını kesinlikle girme.</p>
      <label>Supabase Project URL<input id="cloudUrl" value="${escC(c.url)}" placeholder="https://xxxx.supabase.co"></label>
      <label>Supabase Publishable / Anon Key<input id="cloudKey" type="password" value="${escC(c.key)}" placeholder="sb_publishable_… veya anon key"></label>
      <div class="settings-actions"><button id="cloudSaveConfig" class="primary-btn">Bağlantıyı kaydet</button><button id="cloudTest" class="secondary-btn">Bağlantıyı test et</button></div>
      <div id="cloudProfileBox"></div>`;
    settings.appendChild(article);
    $c('#cloudSaveConfig').onclick=async()=>{
      const url=$c('#cloudUrl').value.trim(), key=$c('#cloudKey').value.trim();
      if(!/^https:\/\/[^\s]+\.supabase\.co$/.test(url) || key.length<20){toast('Supabase URL veya key biçimi geçersiz.');return;}
      writeConfig(url,key); await initClient(); refreshCloudUI(); toast('Bulut bağlantısı kaydedildi.');
    };
    $c('#cloudTest').onclick=async()=>{await initClient(); refreshCloudUI(); if(client) toast('Supabase istemcisi hazır. Giriş yaparak bağlantıyı tamamla.'); else toast('Bağlantı kurulamadı. URL ve key kontrol et.');};
    profileMarkup();
  }

  async function boot() {
    injectStyles(); injectGate(); injectSettingsCard();
    await initClient(); refreshCloudUI();
    if (client && user) await pullCloud();
    hookSave();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
  async function publishFriendProfile(stats, social) {
    if (!client || !user) return false;
    const code = social?.shareCode || '';
    if (!code) return false;
    try {
      const payload = {user_id:user.id,share_code:code,display_name:getDisplayName()||'Hukuk 50K öğrencisi',share_enabled:!!social.shareEnabled,study_minutes:Number(stats?.studyMinutes)||0,weekly_questions:Number(stats?.weeklyQuestions)||0,week_score:Number(stats?.weekScore)||0,streak:Number(stats?.streak)||0,target_rank:Number(stats?.targetRank)||30000,target_label:String(stats?.target||'Hedef'),updated_at:new Date().toISOString()};
      const {error}=await client.from('friend_profiles').upsert(payload,{onConflict:'user_id'});
      if(error) throw error; return true;
    } catch(e) { console.error('publishFriendProfile',e); return false; }
  }
  async function getFriendProfile(code) {
    if (!client || !user || !code) return null;
    try {
      const {data,error}=await client.from('friend_profiles').select('share_code,display_name,study_minutes,weekly_questions,week_score,streak,target_rank,target_label,updated_at,share_enabled').eq('share_code',String(code).trim().toUpperCase()).eq('share_enabled',true).maybeSingle();
      if(error) throw error; if(!data) return null;
      return {code:data.share_code,name:data.display_name,studyMinutes:data.study_minutes,weeklyQuestions:data.weekly_questions,weekScore:data.week_score,streak:data.streak,targetRank:data.target_rank,target:data.target_label,updatedAt:data.updated_at};
    } catch(e) { console.error('getFriendProfile',e); return null; }
  }
  window.hukukCloud = { openLogin:openGate, push:()=>pushCloud(true), pull:pullCloud, configured, publishFriendProfile, getFriendProfile, getUserId:()=>user?.id||'' };
})();
