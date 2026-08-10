/* ============================================================
   NORTUS — CONTROLE DE RENDA E FINANÇAS PESSOAIS
   Single-file demo app. Persistence via window.storage (per-user,
   private/non-shared). Email sending is simulated on-screen since
   this environment cannot dispatch real emails.
   ============================================================ */

const ICONS = {
  dashboard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  income:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  expense:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>',
  tx:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-3"/><path d="M21 3l-9 9M21 3h-6M21 3v6"/></svg>',
  cat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  budget:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/></svg>',
  goal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21V9M10 21V3M17 21v-7"/></svg>',
  ia:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg>',
  settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>',
  logout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>',
  empty:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12l2-8h14l2 8M3 12v6a2 2 0 002 2h14a2 2 0 002-2v-6M3 12h18"/></svg>'
};

const DEFAULT_INCOME_CATS = [
  {id:'salario',name:'Salário',icon:'💼',color:'#3ddc97'},
  {id:'freelance',name:'Freelance',icon:'💻',color:'#20e3a8'},
  {id:'vendas',name:'Vendas',icon:'🛒',color:'#4fd1e8'},
  {id:'investimentos_r',name:'Investimentos',icon:'📈',color:'#e3b567'},
  {id:'comissoes',name:'Comissões',icon:'🤝',color:'#8fe3a0'},
  {id:'alugueis',name:'Aluguéis',icon:'🏠',color:'#6fd8b0'},
  {id:'outros_r',name:'Outros',icon:'✨',color:'#9d9da7'},
];
const DEFAULT_EXPENSE_CATS = [
  {id:'moradia',name:'Moradia',icon:'🏠',color:'#fb7a8c'},
  {id:'alimentacao',name:'Alimentação',icon:'🍽️',color:'#f5945f'},
  {id:'transporte',name:'Transporte',icon:'🚗',color:'#f2c14e'},
  {id:'saude',name:'Saúde',icon:'💊',color:'#e26d8c'},
  {id:'educacao',name:'Educação',icon:'📚',color:'#c17ce8'},
  {id:'lazer',name:'Lazer',icon:'🎮',color:'#7ca8e8'},
  {id:'assinaturas',name:'Assinaturas',icon:'🔁',color:'#e88fc1'},
  {id:'compras',name:'Compras',icon:'🛍️',color:'#e8a67c'},
  {id:'cartao',name:'Cartão de crédito',icon:'💳',color:'#d8687a'},
  {id:'dividas',name:'Dívidas',icon:'📉',color:'#c9495c'},
  {id:'investimentos_d',name:'Investimentos',icon:'📊',color:'#8b6ee8'},
  {id:'impostos',name:'Impostos',icon:'🏛️',color:'#a67ce8'},
  {id:'outros_d',name:'Outros',icon:'✨',color:'#9d9da7'},
];

let STATE = {
  user:null,
  categories:{income:[], expense:[]},
  transactions:[],
  budgets:[],
  goals:[],
  notifications:[],
  page:'dashboard',
  period:'this_month',
  customRange:{start:null,end:null},
  chatHistory:[],
  aiAnalysis:null,
};
let charts = {};

/* ---------------- utils ---------------- */
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8);}
function fmtBRL(v){
  const n = Number(v)||0;
  return n.toLocaleString('pt-BR',{style:'currency',currency: (STATE.user&&STATE.user.currency)||'BRL'});
}
function fmtDate(d){
  const dt = new Date(d+'T00:00:00');
  return dt.toLocaleDateString('pt-BR');
}
function todayISO(){return new Date().toISOString().slice(0,10);}
function monthKey(dateStr){return dateStr.slice(0,7);}
function toast(msg,type='success'){
  const wrap=document.getElementById('toast-wrap');
  const el=document.createElement('div');
  el.className='toast '+type;
  el.textContent=msg;
  wrap.appendChild(el);
  setTimeout(()=>el.remove(),3200);
}
async function sha256(str){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
function genCode(){return Math.floor(100000+Math.random()*900000).toString();}
function escapeHtml(s){return (s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

/* ---------------- storage helpers ----------------
   Priority: window.storage (only exists inside Claude.ai artifacts) →
   localStorage (persists per-browser on any real hosted site, e.g. GitHub
   Pages) → in-memory (last-resort fallback for the current tab only).
   Each visitor's data lives only in their own browser — there is no
   central database. */
const LS_PREFIX = 'financeia_';
let memStore = {};
let persistentStorageOK = true;
function hasBridge(){ return typeof window!=='undefined' && !!window.storage; }
function hasLocalStorage(){
  try{ const k='__fia_test__'; localStorage.setItem(k,'1'); localStorage.removeItem(k); return true; }
  catch(e){ return false; }
}
async function sget(key){
  try{
    if(hasBridge()){
      const r = await window.storage.get(key,false);
      if(r) return JSON.parse(r.value);
    }
  }catch(e){ /* key may simply not exist yet in the bridge — fall through */ }
  try{
    if(hasLocalStorage()){
      const raw = localStorage.getItem(LS_PREFIX+key);
      if(raw!=null) return JSON.parse(raw);
    }
  }catch(e){}
  if(Object.prototype.hasOwnProperty.call(memStore,key)) return JSON.parse(memStore[key]);
  return null;
}
async function sset(key,val){
  const json = JSON.stringify(val);
  memStore[key] = json;
  let savedAnywhere = false;
  try{ if(hasLocalStorage()){ localStorage.setItem(LS_PREFIX+key, json); savedAnywhere = true; } }catch(e){}
  try{ if(hasBridge()){ await window.storage.set(key, json, false); savedAnywhere = true; } }catch(e){ console.error('storage bridge set fail',e); }
  if(!savedAnywhere) persistentStorageOK = false;
}
async function sdel(key){
  delete memStore[key];
  try{ if(hasLocalStorage()) localStorage.removeItem(LS_PREFIX+key); }catch(e){}
  try{ if(hasBridge()) await window.storage.delete(key,false); }catch(e){}
}

/* ============================================================
   AUTH
   ============================================================ */
let authView = 'login';
let pendingSignup = null; // {name,email,passwordHash,code}
let pendingReset = null;

function renderAuth(){
  const c = document.getElementById('auth-content');
  if(authView==='login') c.innerHTML = tplLogin();
  else if(authView==='signup') c.innerHTML = tplSignup();
  else if(authView==='verify') c.innerHTML = tplVerify();
  else if(authView==='verified') c.innerHTML = tplVerified();
  else if(authView==='forgot') c.innerHTML = tplForgot();
  else if(authView==='reset') c.innerHTML = tplReset();
  else if(authView==='admin-login') c.innerHTML = tplAdminLogin();
  else if(authView==='admin-panel') renderAdminPanel();
}

function tplLogin(){
  return `
  <div class="auth-card">
    <div class="auth-title">Entrar</div>
    <div class="auth-sub">Acesse seu painel financeiro.</div>
    <div class="field"><label>E-mail</label><input id="li-email" type="email" placeholder="voce@email.com"></div>
    <div class="field"><label>Senha</label><input id="li-pass" type="password" placeholder="••••••••"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
      <label style="display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--text-dim);">
        <input type="checkbox" id="li-remember" checked style="width:14px;height:14px;"> Manter conectado
      </label>
      <span class="link" style="font-size:12.5px;" onclick="authView='forgot';renderAuth();">Esqueci a senha</span>
    </div>
    <button class="btn btn-primary" onclick="doLogin()">Entrar</button>
    <div class="auth-foot">Não tem conta? <span class="link" onclick="authView='signup';renderAuth();">Criar conta</span></div>
    <div class="auth-foot" style="margin-top:6px;"><span class="link" style="color:var(--text-faint);font-weight:500;" onclick="authView='admin-login';renderAuth();">Acesso administrador</span></div>
  </div>`;
}
function tplAdminLogin(){
  return `
  <div class="auth-card">
    <div class="auth-title">Painel administrativo</div>
    <div class="auth-sub">Acesso restrito para gestão de contas e testes do sistema.</div>
    <div class="field"><label>Senha de administrador</label><input id="ad-pass" type="password" placeholder="••••••••" onkeydown="if(event.key==='Enter')doAdminLogin();"></div>
    <div id="ad-err" class="field-err"></div>
    <button class="btn btn-primary" onclick="doAdminLogin()">Entrar como administrador</button>
    <div class="sim-note">Acesso restrito. Solicite a senha ao administrador do sistema.</div>
    <div class="auth-foot"><span class="link" onclick="authView='login';renderAuth();">Voltar ao login</span></div>
  </div>`;
}
function tplSignup(){
  return `
  <div class="auth-card">
    <div class="auth-title">Criar conta</div>
    <div class="auth-sub">Comece a organizar sua vida financeira.</div>
    <div class="field"><label>Nome</label><input id="su-name" placeholder="Seu nome completo"></div>
    <div class="field">
      <label>E-mail do Gmail</label>
      <input id="su-email" type="email" placeholder="voce@gmail.com" oninput="checkGmailField(this)">
      <div style="font-size:11.5px;color:var(--text-faint);margin-top:6px;display:flex;align-items:center;gap:6px;">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>
        Somente contas @gmail.com podem se cadastrar.
      </div>
    </div>
    <div class="field"><label>Senha</label><input id="su-pass" type="password" placeholder="Mínimo 6 caracteres"></div>
    <div class="field"><label>Confirmar senha</label><input id="su-pass2" type="password" placeholder="Repita a senha"></div>
    <div id="su-err" class="field-err" style="margin-bottom:12px;"></div>
    <button class="btn btn-primary" onclick="doSignup()">Criar conta</button>
    <div class="auth-foot">Já tem conta? <span class="link" onclick="authView='login';renderAuth();">Entrar</span></div>
  </div>`;
}
function tplVerify(){
  return `
  <div class="auth-card">
    <div class="auth-title">Confirme seu e-mail</div>
    <div class="auth-sub">Enviamos um código de verificação para <b>${escapeHtml(pendingSignup.email)}</b>.</div>
    <div class="code-box">${pendingSignup.code}</div>
    <div class="sim-note">Ambiente de demonstração: e-mails reais não podem ser enviados aqui, então o código aparece na tela para você simular a confirmação.</div>
    <div class="field" style="margin-top:18px;"><label>Digite o código recebido</label><input id="vf-code" inputmode="numeric" placeholder="000000" maxlength="6" onkeydown="if(event.key==='Enter')doVerify();" oninput="this.value=this.value.replace(/\D/g,'')"></div>
    <div id="vf-err" class="field-err"></div>
    <button class="btn btn-primary" style="margin-top:6px;" onclick="doVerify()">Confirmar e-mail</button>
    <button class="btn btn-ghost" style="width:100%;margin-top:10px;" onclick="resendCode()">Reenviar e-mail de confirmação</button>
  </div>`;
}
function tplVerified(){
  return `
  <div class="auth-card" style="text-align:center;">
    <div style="font-size:42px;margin-bottom:10px;">✅</div>
    <div class="auth-title">E-mail confirmado!</div>
    <div class="auth-sub">Sua conta foi validada com sucesso. Você já pode acessar seu painel.</div>
    <button class="btn btn-primary" onclick="authView='login';renderAuth();">Ir para o login</button>
  </div>`;
}
function tplForgot(){
  return `
  <div class="auth-card">
    <div class="auth-title">Recuperar senha</div>
    <div class="auth-sub">Informe seu e-mail para receber o código de redefinição.</div>
    <div class="field"><label>E-mail</label><input id="fg-email" type="email" placeholder="voce@email.com"></div>
    <div id="fg-err" class="field-err"></div>
    <button class="btn btn-primary" onclick="doForgot()">Enviar código</button>
    <div class="auth-foot"><span class="link" onclick="authView='login';renderAuth();">Voltar ao login</span></div>
  </div>`;
}
function tplReset(){
  return `
  <div class="auth-card">
    <div class="auth-title">Redefinir senha</div>
    <div class="auth-sub">Código enviado para <b>${escapeHtml(pendingReset.email)}</b>.</div>
    <div class="code-box">${pendingReset.code}</div>
    <div class="sim-note">Ambiente de demonstração: o código de redefinição aparece na tela em vez de ser enviado por e-mail.</div>
    <div class="field" style="margin-top:16px;"><label>Código</label><input id="rs-code" inputmode="numeric" placeholder="000000" maxlength="6" oninput="this.value=this.value.replace(/\D/g,'')"></div>
    <div class="field"><label>Nova senha</label><input id="rs-pass" type="password" placeholder="Mínimo 6 caracteres"></div>
    <div class="field"><label>Confirmar nova senha</label><input id="rs-pass2" type="password"></div>
    <div id="rs-err" class="field-err"></div>
    <button class="btn btn-primary" onclick="doReset()">Redefinir senha</button>
  </div>`;
}

function showErr(id,msg){const e=document.getElementById(id);e.textContent=msg;e.classList.toggle('show',!!msg);}

function isGmail(email){ return /^[^\s@]+@gmail\.com$/i.test(email.trim()); }
function checkGmailField(el){
  const v = el.value.trim();
  if(v.length===0){ el.classList.remove('err'); return; }
  el.classList.toggle('err', !isGmail(v));
}

async function doLogin(){
  const email = document.getElementById('li-email').value.trim().toLowerCase();
  const pass = document.getElementById('li-pass').value;
  const remember = document.getElementById('li-remember').checked;
  if(!email||!pass) return toast('Preencha e-mail e senha.','error');
  const user = await sget('user:'+email);
  if(!user) return toast('Conta não encontrada.','error');
  const hash = await sha256(pass);
  if(hash !== user.passwordHash) return toast('Senha incorreta.','error');
  if(!user.verified){
    const code = genCode();
    pendingSignup = {name:user.name, email:user.email, passwordHash:user.passwordHash, code, expires:Date.now()+15*60000};
    sset('verification:'+email, {code, expires:pendingSignup.expires}); // fire-and-forget backup record
    authView='verify'; renderAuth();
    return toast('Confirme seu e-mail para continuar.','error');
  }
  if(remember) await sset('session_email', email);
  await enterApp(user);
}

async function doSignup(){
  const name=document.getElementById('su-name').value.trim();
  const email=document.getElementById('su-email').value.trim().toLowerCase();
  const pass=document.getElementById('su-pass').value;
  const pass2=document.getElementById('su-pass2').value;
  showErr('su-err','');
  if(!name||!email||!pass||!pass2) return showErr('su-err','Preencha todos os campos.');
  if(!isGmail(email)){ document.getElementById('su-email').classList.add('err'); return showErr('su-err','Use um e-mail do Gmail (exemplo: voce@gmail.com).'); }
  if(pass.length<6) return showErr('su-err','A senha deve ter no mínimo 6 caracteres.');
  if(pass!==pass2) return showErr('su-err','As senhas não coincidem.');
  const existing = await sget('user:'+email);
  if(existing) return showErr('su-err','Já existe uma conta com este e-mail.');
  const passwordHash = await sha256(pass);
  const code = genCode();
  const expires = Date.now()+15*60000;
  const newUser = {name,email,passwordHash,verified:false,currency:'BRL',createdAt:new Date().toISOString()};
  await sset('user:'+email,newUser);
  sset('verification:'+email,{code,expires}); // fire-and-forget backup record
  pendingSignup = {name,email,passwordHash,code,expires};
  authView='verify'; renderAuth();
  toast('Conta criada! Confirme seu e-mail.');
}

function resendCode(){
  const code = genCode();
  pendingSignup.code = code;
  pendingSignup.expires = Date.now()+15*60000;
  sset('verification:'+pendingSignup.email,{code,expires:pendingSignup.expires});
  renderAuth();
  toast('Novo código gerado.');
}

async function doVerify(){
  const code = document.getElementById('vf-code').value.trim();
  showErr('vf-err','');
  if(!code) return showErr('vf-err','Digite o código enviado.');
  if(!pendingSignup || Date.now()>pendingSignup.expires){ return showErr('vf-err','Código expirado. Solicite um novo.'); }
  if(code !== pendingSignup.code) return showErr('vf-err','Código incorreto. Verifique e tente novamente.');
  const user = await sget('user:'+pendingSignup.email);
  if(!user) return showErr('vf-err','Não encontramos essa conta. Tente se cadastrar novamente.');
  user.verified = true;
  await sset('user:'+pendingSignup.email,user);
  await sdel('verification:'+pendingSignup.email);
  authView='verified'; renderAuth();
}

async function doForgot(){
  const email = document.getElementById('fg-email').value.trim().toLowerCase();
  showErr('fg-err','');
  const user = await sget('user:'+email);
  if(!user) return showErr('fg-err','Nenhuma conta encontrada com este e-mail.');
  const code = genCode();
  const expires = Date.now()+15*60000;
  sset('reset:'+email,{code,expires}); // fire-and-forget backup record
  pendingReset = {email,code,expires};
  authView='reset'; renderAuth();
}

async function doReset(){
  const code=document.getElementById('rs-code').value.trim();
  const pass=document.getElementById('rs-pass').value;
  const pass2=document.getElementById('rs-pass2').value;
  showErr('rs-err','');
  if(!pendingReset || Date.now()>pendingReset.expires) return showErr('rs-err','Código expirado. Solicite novamente.');
  if(code!==pendingReset.code) return showErr('rs-err','Código incorreto.');
  if(pass.length<6) return showErr('rs-err','A senha deve ter no mínimo 6 caracteres.');
  if(pass!==pass2) return showErr('rs-err','As senhas não coincidem.');
  const user = await sget('user:'+pendingReset.email);
  user.passwordHash = await sha256(pass);
  await sset('user:'+pendingReset.email,user);
  await sdel('reset:'+pendingReset.email);
  toast('Senha redefinida com sucesso!');
  authView='login'; renderAuth();
}

async function doLogout(){
  await sdel('session_email');
  STATE.user=null;
  document.getElementById('app-shell').classList.remove('active');
  document.getElementById('auth-screen').style.display='flex';
  authView='login'; renderAuth();
}

/* ============================================================
   ADMIN PANEL — acesso paralelo para testes e suporte
   ============================================================ */
// Senha nunca fica em texto puro no código — apenas o hash SHA-256 dela.
// Para trocar a senha: gere um novo hash (ex: no console do navegador
// rode `await sha256('sua-nova-senha')`) e substitua o valor abaixo.
const ADMIN_PASSWORD_HASH = '5527390bc42aae9757ee149e1ab57bfd39073e2df49cdf24ccd4b6f0a2a0c090';
let isAdminSession = false;

async function doAdminLogin(){
  const pass = document.getElementById('ad-pass').value;
  showErr('ad-err','');
  const hash = await sha256(pass);
  if(hash !== ADMIN_PASSWORD_HASH) return showErr('ad-err','Senha de administrador incorreta.');
  isAdminSession = true;
  authView='admin-panel';
  renderAuth();
}

async function listAllUsers(){
  const emails = new Set();
  try{
    if(hasBridge()){
      const r = await window.storage.list('user:', false);
      if(r && r.keys) r.keys.forEach(k=>emails.add(k));
    }
  }catch(e){ /* bridge unavailable — fall back below */ }
  try{
    if(hasLocalStorage()){
      for(let i=0;i<localStorage.length;i++){
        const k = localStorage.key(i);
        if(k && k.startsWith(LS_PREFIX+'user:')) emails.add(k.slice(LS_PREFIX.length));
      }
    }
  }catch(e){}
  Object.keys(memStore).filter(k=>k.startsWith('user:')).forEach(k=>emails.add(k));
  const users = [];
  for(const k of emails){
    const u = await sget(k);
    if(u) users.push(u);
  }
  return users.sort((a,b)=> (b.createdAt||'').localeCompare(a.createdAt||''));
}

async function renderAdminPanel(){
  document.getElementById('auth-box').classList.add('wide');
  const c = document.getElementById('auth-content');
  c.innerHTML = `<div class="auth-card" style="max-width:none;"><div style="text-align:center;color:var(--text-faint);font-size:12.5px;">Carregando contas...</div></div>`;
  const users = await listAllUsers();
  const rows = await Promise.all(users.map(async u=>{
    const ver = await sget('verification:'+u.email);
    return {u, code: ver ? ver.code : null, expired: ver ? Date.now()>ver.expires : null};
  }));
  c.innerHTML = `
  <div class="auth-card" style="max-width:none;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
      <div class="auth-title" style="margin-bottom:0;">Painel administrativo</div>
      <span class="link" style="font-size:12.5px;" onclick="isAdminSession=false;authView='login';document.getElementById('auth-box').classList.remove('wide');renderAuth();">Sair do painel</span>
    </div>
    <div class="auth-sub">Contas cadastradas neste ambiente de demonstração. Use este painel para testar o cadastro/verificação sem depender de e-mail real.</div>
    <div class="auth-alert" style="text-align:left;">
      <b>Como testar o cadastro por e-mail agora:</b> crie uma conta normalmente na tela de cadastro. Ela vai aparecer aqui como "não verificada". Se o código na tela de verificação não funcionar, volte aqui, veja o código real armazenado (coluna "Código atual") ou clique em <b>Verificar manualmente</b> para liberar o acesso sem digitar código.
    </div>
    <div class="tbl-wrap">
      <table>
        <thead><tr><th>Nome</th><th>E-mail</th><th>Status</th><th>Código atual</th><th>Criado em</th><th>Ações</th></tr></thead>
        <tbody>
        ${rows.length ? rows.map(({u,code,expired})=>`
          <tr>
            <td>${escapeHtml(u.name)}</td>
            <td>${escapeHtml(u.email)}</td>
            <td>${u.verified?'<span class="pill income">Verificado</span>':'<span class="pill expense">Pendente</span>'}</td>
            <td class="mono">${code ? code + (expired?' (expirado)':'') : '—'}</td>
            <td>${u.createdAt ? new Date(u.createdAt).toLocaleString('pt-BR') : '—'}</td>
            <td>
              <div class="row-actions">
                ${!u.verified?`<button class="btn btn-ghost btn-sm" onclick="adminVerifyUser('${u.email}')">Verificar manualmente</button>`:''}
                <button class="btn btn-primary btn-sm" style="width:auto;" onclick="adminImpersonate('${u.email}')">Entrar como</button>
                <button class="btn btn-danger btn-sm" onclick="adminDeleteUser('${u.email}')">Excluir</button>
              </div>
            </td>
          </tr>`).join('') : `<tr><td colspan="6" style="text-align:center;color:var(--text-faint);padding:24px;">Nenhuma conta cadastrada ainda. Crie uma na tela de cadastro para testar.</td></tr>`}
        </tbody>
      </table>
    </div>
  </div>`;
}

async function adminVerifyUser(email){
  const user = await sget('user:'+email);
  if(!user) return;
  user.verified = true;
  await sset('user:'+email,user);
  await sdel('verification:'+email);
  toast('Conta verificada manualmente.');
  renderAdminPanel();
}
async function adminImpersonate(email){
  const user = await sget('user:'+email);
  if(!user) return;
  document.getElementById('auth-box').classList.remove('wide');
  await enterApp(user);
}
async function adminDeleteUser(email){
  if(!confirm('Excluir permanentemente esta conta e todos os seus dados?')) return;
  await sdel('user:'+email); await sdel('categories:'+email); await sdel('transactions:'+email);
  await sdel('budgets:'+email); await sdel('goals:'+email); await sdel('notifications:'+email);
  await sdel('verification:'+email); await sdel('reset:'+email);
  toast('Conta excluída.');
  renderAdminPanel();
}

/* ============================================================
   APP BOOTSTRAP
   ============================================================ */
async function enterApp(user){
  STATE.user = user;
  const email = user.email;
  let cats = await sget('categories:'+email);
  if(!cats){ cats = {income:DEFAULT_INCOME_CATS, expense:DEFAULT_EXPENSE_CATS}; await sset('categories:'+email,cats); }
  STATE.categories = cats;
  STATE.transactions = (await sget('transactions:'+email)) || [];
  STATE.budgets = (await sget('budgets:'+email)) || [];
  STATE.goals = (await sget('goals:'+email)) || [];
  STATE.notifications = (await sget('notifications:'+email)) || [];

  document.getElementById('auth-screen').style.display='none';
  document.getElementById('app-shell').classList.add('active');
  computeNotifications();
  renderSidebar();
  go('dashboard');
}

async function persist(){
  const email = STATE.user.email;
  await sset('transactions:'+email, STATE.transactions);
  await sset('categories:'+email, STATE.categories);
  await sset('budgets:'+email, STATE.budgets);
  await sset('goals:'+email, STATE.goals);
  await sset('notifications:'+email, STATE.notifications);
}

async function tryAutoLogin(){
  const email = await sget('session_email');
  if(email){
    const user = await sget('user:'+email);
    if(user && user.verified){ await enterApp(user); return; }
  }
  renderAuth();
}

/* ============================================================
   SIDEBAR / NAV
   ============================================================ */
const NAV = [
  {id:'dashboard',label:'Dashboard',icon:'dashboard'},
  {id:'receitas',label:'Receitas',icon:'income'},
  {id:'despesas',label:'Despesas',icon:'expense'},
  {id:'transacoes',label:'Transações',icon:'tx'},
  {id:'categorias',label:'Categorias',icon:'cat'},
  {id:'orcamentos',label:'Orçamentos',icon:'budget'},
  {id:'metas',label:'Metas',icon:'goal'},
  {id:'graficos',label:'Gráficos e Relatórios',icon:'chart'},
  {id:'ia',label:'Análise por IA',icon:'ia'},
  {id:'config',label:'Configurações',icon:'settings'},
];
function renderSidebar(){
  const u = STATE.user;
  const initials = (u.name||'?').split(' ').filter(Boolean).slice(0,2).map(s=>s[0].toUpperCase()).join('');
  document.getElementById('sidebar').innerHTML = `
    <div class="brand"><div class="brand-mark">F</div><div class="brand-name">Finance IA</div></div>
    <nav>
      ${NAV.map(n=>`<div class="nav-item ${STATE.page===n.id?'active':''}" onclick="go('${n.id}')">${ICONS[n.icon]}<span>${n.label}</span></div>`).join('')}
    </nav>
    <div class="sidebar-foot">
      <div class="nav-item" onclick="doLogout()">${ICONS.logout}<span>Sair</span></div>
      <div class="user-chip" onclick="go('config')">
        <div class="avatar">${initials}</div>
        <div><div class="user-chip-name">${escapeHtml(u.name)}</div><div class="user-chip-email">${escapeHtml(u.email)}</div></div>
      </div>
    </div>`;
}
function openSidebar(){document.getElementById('sidebar').classList.add('open');document.getElementById('overlay-bg').classList.remove('hidden');}
function closeSidebar(){document.getElementById('sidebar').classList.remove('open');document.getElementById('overlay-bg').classList.add('hidden');}

function go(page){
  STATE.page = page;
  closeSidebar();
  renderSidebar();
  document.getElementById('page-title').textContent = NAV.find(n=>n.id===page)?.label || '';
  renderPage();
}

/* ============================================================
   PERIOD / DATE FILTER LOGIC
   ============================================================ */
function periodRange(period){
  const now = new Date();
  const y=now.getFullYear(), m=now.getMonth(), d=now.getDate();
  function iso(dt){return dt.toISOString().slice(0,10);}
  if(period==='today'){ return [iso(now), iso(now)]; }
  if(period==='this_week'){
    const day = now.getDay()||7;
    const start = new Date(now); start.setDate(d-day+1);
    return [iso(start), iso(now)];
  }
  if(period==='this_month'){ return [iso(new Date(y,m,1)), iso(now)]; }
  if(period==='last_3'){ return [iso(new Date(y,m-2,1)), iso(now)]; }
  if(period==='last_6'){ return [iso(new Date(y,m-5,1)), iso(now)]; }
  if(period==='this_year'){ return [iso(new Date(y,0,1)), iso(now)]; }
  if(period==='custom'){ return [STATE.customRange.start||iso(new Date(y,m,1)), STATE.customRange.end||iso(now)]; }
  return [iso(new Date(y,m,1)), iso(now)];
}
function txInPeriod(period){
  const [s,e] = periodRange(period);
  return STATE.transactions.filter(t=>t.date>=s && t.date<=e);
}
function periodLabel(p){
  return {today:'Hoje',this_week:'Esta semana',this_month:'Este mês',last_3:'Últimos 3 meses',last_6:'Últimos 6 meses',this_year:'Este ano',custom:'Personalizado'}[p]||p;
}

/* ============================================================
   PAGE ROUTER
   ============================================================ */
function renderPage(){
  const el = document.getElementById('page-content');
  if(STATE.page==='dashboard') el.innerHTML = pageDashboard();
  else if(STATE.page==='receitas') el.innerHTML = pageTxList('income');
  else if(STATE.page==='despesas') el.innerHTML = pageTxList('expense');
  else if(STATE.page==='transacoes') el.innerHTML = pageTransacoes();
  else if(STATE.page==='categorias') el.innerHTML = pageCategorias();
  else if(STATE.page==='orcamentos') el.innerHTML = pageOrcamentos();
  else if(STATE.page==='metas') el.innerHTML = pageMetas();
  else if(STATE.page==='graficos') { el.innerHTML = pageGraficos(); setTimeout(renderAllCharts,30); }
  else if(STATE.page==='ia') el.innerHTML = pageIA();
  else if(STATE.page==='config') el.innerHTML = pageConfig();
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function catInfo(type,id){
  const list = STATE.categories[type]||[];
  return list.find(c=>c.id===id) || {name:'Outros',icon:'✨',color:'#9d9da7'};
}
function sumBy(txs,type){return txs.filter(t=>t.type===type).reduce((a,t)=>a+Number(t.amount),0);}

function pageDashboard(){
  const txs = txInPeriod(STATE.period);
  const income = sumBy(txs,'income');
  const expense = sumBy(txs,'expense');
  const saldo = income-expense;
  const economia = income-expense;
  const pct = income>0 ? (expense/income*100) : 0;

  // previous period comparison (same length, immediately before)
  const [s,e] = periodRange(STATE.period);
  const days = (new Date(e)-new Date(s))/86400000 + 1;
  const prevEnd = new Date(new Date(s).getTime()-86400000);
  const prevStart = new Date(prevEnd.getTime()-(days-1)*86400000);
  const prevTxs = STATE.transactions.filter(t=>t.date>=prevStart.toISOString().slice(0,10) && t.date<=prevEnd.toISOString().slice(0,10));
  const prevExpense = sumBy(prevTxs,'expense');
  const prevIncome = sumBy(prevTxs,'income');
  const deltaExpense = prevExpense>0 ? ((expense-prevExpense)/prevExpense*100) : (expense>0?100:0);
  const deltaIncome = prevIncome>0 ? ((income-prevIncome)/prevIncome*100) : (income>0?100:0);

  const recentTx = [...STATE.transactions].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6);
  const biggestExpenses = [...txs].filter(t=>t.type==='expense').sort((a,b)=>b.amount-a.amount).slice(0,5);

  // category summary (expenses)
  const catTotals = {};
  txs.filter(t=>t.type==='expense').forEach(t=>{ catTotals[t.category]=(catTotals[t.category]||0)+Number(t.amount); });
  const catRows = Object.entries(catTotals).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxCat = catRows.length? catRows[0][1] : 1;

  return `
  ${periodBar()}
  <div class="grid grid-4">
    ${statCard('Saldo atual', fmtBRL(saldo), saldo>=0?'income':'expense')}
    ${statCard('Receitas no período', fmtBRL(income), 'income', deltaIncome)}
    ${statCard('Despesas no período', fmtBRL(expense), 'expense', deltaExpense, true)}
    ${statCard('Economia do período', fmtBRL(economia), economia>=0?'income':'expense')}
  </div>
  <div class="grid grid-2 section-block">
    <div class="card">
      <div class="stat-label">Percentual da renda comprometida</div>
      <div class="stat-value">${pct.toFixed(1)}%</div>
      <div class="progress-bg" style="margin-top:12px;"><div class="progress-fill ${pct>90?'over':pct>70?'warn':''}" style="width:${Math.min(pct,100)}%"></div></div>
      <div class="stat-delta" style="margin-top:10px;">${pct>90?'Atenção: quase toda sua renda está comprometida.':pct>70?'Comprometimento elevado — vale revisar despesas.':'Sob controle.'}</div>
    </div>
    <div class="card">
      <div class="stat-label">Atalhos rápidos</div>
      <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;">
        <button class="btn btn-primary" style="width:auto;" onclick="openTxModal('income')">${ICONS.plus} Nova receita</button>
        <button class="btn btn-ghost" onclick="openTxModal('expense')">${ICONS.plus} Nova despesa</button>
      </div>
    </div>
  </div>
  <div class="grid grid-2 section-block">
    <div class="card">
      <div class="card-head"><h3>Últimas movimentações</h3><span class="link" style="font-size:12px;" onclick="go('transacoes')">Ver todas</span></div>
      ${recentTx.length? recentTx.map(txRowHtml).join('') : emptyState('Nenhuma movimentação ainda','Cadastre sua primeira receita ou despesa.')}
    </div>
    <div class="card">
      <div class="card-head"><h3>Maiores despesas do período</h3></div>
      ${biggestExpenses.length? biggestExpenses.map(txRowHtml).join('') : emptyState('Sem despesas no período','Nenhuma despesa registrada ainda.')}
    </div>
  </div>
  <div class="card section-block">
    <div class="card-head"><h3>Resumo por categoria (despesas)</h3></div>
    ${catRows.length? catRows.map(([id,val])=>{
      const c = catInfo('expense',id);
      return `<div class="cat-row"><span class="cat-dot" style="background:${c.color}"></span><span class="cat-name">${c.icon} ${escapeHtml(c.name)}</span><div class="cat-bar-bg"><div class="cat-bar-fill" style="width:${(val/maxCat*100)}%;background:${c.color}"></div></div><span class="cat-val mono">${fmtBRL(val)}</span></div>`;
    }).join('') : emptyState('Sem dados de categoria','Cadastre despesas para ver o resumo.')}
  </div>
  <div class="card section-block">
    <div class="card-head"><h3>Evolução do saldo</h3></div>
    <canvas id="dashLineChart" height="90"></canvas>
  </div>
  `;
}
function statCard(label,val,cls,delta,invertColor){
  let deltaHtml='';
  if(delta!==undefined){
    const up = delta>=0;
    const good = invertColor? !up : up;
    deltaHtml = `<div class="stat-delta ${good?'up':'down'}">${up?'▲':'▼'} ${Math.abs(delta).toFixed(1)}% vs. período anterior</div>`;
  }
  return `<div class="card"><div class="stat-label">${label}</div><div class="stat-value ${cls==='income'?'income':cls==='expense'?'expense':''} mono">${val}</div>${deltaHtml}</div>`;
}
function periodBar(){
  const opts=[['today','Hoje'],['this_week','Esta semana'],['this_month','Este mês'],['last_3','Últimos 3 meses'],['last_6','Últimos 6 meses'],['this_year','Este ano'],['custom','Personalizado']];
  return `<div class="period-bar">${opts.map(([k,l])=>`<div class="period-chip ${STATE.period===k?'active':''}" onclick="setPeriod('${k}')">${l}</div>`).join('')}</div>
  ${STATE.period==='custom'?`<div class="toolbar" style="margin-top:-10px;"><input type="date" class="sel" value="${STATE.customRange.start||''}" onchange="STATE.customRange.start=this.value;renderPage();"><span style="color:var(--text-faint);">até</span><input type="date" class="sel" value="${STATE.customRange.end||''}" onchange="STATE.customRange.end=this.value;renderPage();"></div>`:''}`;
}
function setPeriod(p){STATE.period=p; if(p==='custom' && !STATE.customRange.start){STATE.customRange={start:todayISO(),end:todayISO()};} renderPage();}
function txRowHtml(t){
  const c = catInfo(t.type,t.category);
  return `<div class="tx-row">
    <div class="tx-icon ${t.type}">${c.icon}</div>
    <div class="tx-info"><div class="tx-desc">${escapeHtml(t.description)}</div><div class="tx-meta">${c.name} · ${fmtDate(t.date)}</div></div>
    <div class="tx-amount ${t.type} mono">${t.type==='income'?'+':'-'} ${fmtBRL(t.amount)}</div>
  </div>`;
}
function emptyState(title,sub){
  return `<div class="empty-state">${ICONS.empty}<div class="empty-state-title">${title}</div><div class="empty-state-sub">${sub}</div></div>`;
}

/* ============================================================
   RECEITAS / DESPESAS LIST PAGES
   ============================================================ */
let listFilters = {search:'',category:'all',sort:'date_desc'};
function pageTxList(type){
  const isIncome = type==='income';
  let txs = STATE.transactions.filter(t=>t.type===type);
  if(listFilters.search) txs = txs.filter(t=>t.description.toLowerCase().includes(listFilters.search.toLowerCase()));
  if(listFilters.category!=='all') txs = txs.filter(t=>t.category===listFilters.category);
  txs.sort((a,b)=>{
    if(listFilters.sort==='date_desc') return b.date.localeCompare(a.date);
    if(listFilters.sort==='date_asc') return a.date.localeCompare(b.date);
    if(listFilters.sort==='value_desc') return b.amount-a.amount;
    if(listFilters.sort==='value_asc') return a.amount-b.amount;
  });
  const cats = STATE.categories[type];
  const total = txs.reduce((a,t)=>a+Number(t.amount),0);
  return `
  <div class="card" style="margin-bottom:18px;">
    <div class="stat-label">Total (${escapeHtml(listFilters.category==='all'?'todas categorias':catInfo(type,listFilters.category).name)})</div>
    <div class="stat-value ${type} mono">${fmtBRL(total)}</div>
  </div>
  <div class="toolbar">
    <input class="search-input" placeholder="Pesquisar ${isIncome?'receita':'despesa'}..." value="${escapeHtml(listFilters.search)}" oninput="listFilters.search=this.value;renderPage();">
    <select class="sel" onchange="listFilters.category=this.value;renderPage();">
      <option value="all">Todas as categorias</option>
      ${cats.map(c=>`<option value="${c.id}" ${listFilters.category===c.id?'selected':''}>${c.icon} ${escapeHtml(c.name)}</option>`).join('')}
    </select>
    <select class="sel" onchange="listFilters.sort=this.value;renderPage();">
      <option value="date_desc" ${listFilters.sort==='date_desc'?'selected':''}>Mais recentes</option>
      <option value="date_asc" ${listFilters.sort==='date_asc'?'selected':''}>Mais antigas</option>
      <option value="value_desc" ${listFilters.sort==='value_desc'?'selected':''}>Maior valor</option>
      <option value="value_asc" ${listFilters.sort==='value_asc'?'selected':''}>Menor valor</option>
    </select>
    <button class="btn btn-primary" style="width:auto;" onclick="openTxModal('${type}')">${ICONS.plus} Adicionar ${isIncome?'receita':'despesa'}</button>
  </div>
  <div class="card">
    ${txs.length? txs.map(t=>txRowEditable(t)).join('') : emptyState(`Nenhuma ${isIncome?'receita':'despesa'} encontrada`, 'Ajuste os filtros ou cadastre uma nova.')}
  </div>`;
}
function txRowEditable(t){
  const c = catInfo(t.type,t.category);
  return `<div class="tx-row">
    <div class="tx-icon ${t.type}">${c.icon}</div>
    <div class="tx-info"><div class="tx-desc">${escapeHtml(t.description)}</div><div class="tx-meta">${c.name} · ${fmtDate(t.date)} · ${escapeHtml(t.method||'')}${t.recurring?' · Recorrente':''}</div></div>
    <div class="tx-amount ${t.type} mono">${t.type==='income'?'+':'-'} ${fmtBRL(t.amount)}</div>
    <div class="row-actions">
      <button class="iconbtn-sm" onclick="openTxModal('${t.type}','${t.id}')">${ICONS.edit}</button>
      <button class="iconbtn-sm" onclick="confirmDeleteTx('${t.id}')">${ICONS.trash}</button>
    </div>
  </div>`;
}

/* ============================================================
   TRANSAÇÕES (tabela completa)
   ============================================================ */
let txTableState = {search:'',type:'all',category:'all',sort:'date_desc',page:1,pageSize:8};
function pageTransacoes(){
  let txs = [...STATE.transactions];
  if(txTableState.search) txs = txs.filter(t=>t.description.toLowerCase().includes(txTableState.search.toLowerCase()));
  if(txTableState.type!=='all') txs = txs.filter(t=>t.type===txTableState.type);
  if(txTableState.category!=='all') txs = txs.filter(t=>t.category===txTableState.category);
  txs.sort((a,b)=>{
    if(txTableState.sort==='date_desc') return b.date.localeCompare(a.date);
    if(txTableState.sort==='date_asc') return a.date.localeCompare(b.date);
    if(txTableState.sort==='value_desc') return b.amount-a.amount;
    if(txTableState.sort==='value_asc') return a.amount-b.amount;
  });
  const total = txs.length;
  const pages = Math.max(1,Math.ceil(total/txTableState.pageSize));
  txTableState.page = Math.min(txTableState.page,pages);
  const start = (txTableState.page-1)*txTableState.pageSize;
  const pageItems = txs.slice(start,start+txTableState.pageSize);
  const allCats = [...STATE.categories.income, ...STATE.categories.expense];

  return `
  <div class="toolbar">
    <input class="search-input" placeholder="Pesquisar descrição..." value="${escapeHtml(txTableState.search)}" oninput="txTableState.search=this.value;txTableState.page=1;renderPage();">
    <select class="sel" onchange="txTableState.type=this.value;txTableState.page=1;renderPage();">
      <option value="all" ${txTableState.type==='all'?'selected':''}>Todos os tipos</option>
      <option value="income" ${txTableState.type==='income'?'selected':''}>Receitas</option>
      <option value="expense" ${txTableState.type==='expense'?'selected':''}>Despesas</option>
    </select>
    <select class="sel" onchange="txTableState.category=this.value;txTableState.page=1;renderPage();">
      <option value="all">Todas as categorias</option>
      ${allCats.map(c=>`<option value="${c.id}" ${txTableState.category===c.id?'selected':''}>${c.icon} ${escapeHtml(c.name)}</option>`).join('')}
    </select>
    <select class="sel" onchange="txTableState.sort=this.value;renderPage();">
      <option value="date_desc">Mais recentes</option>
      <option value="date_asc">Mais antigas</option>
      <option value="value_desc">Maior valor</option>
      <option value="value_asc">Menor valor</option>
    </select>
  </div>
  <div class="card">
    <div class="tbl-wrap"><table>
      <thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Tipo</th><th>Pagamento</th><th>Valor</th><th>Ações</th></tr></thead>
      <tbody>
      ${pageItems.map(t=>{
        const c=catInfo(t.type,t.category);
        return `<tr>
          <td>${fmtDate(t.date)}</td>
          <td>${escapeHtml(t.description)}</td>
          <td>${c.icon} ${escapeHtml(c.name)}</td>
          <td><span class="pill ${t.type}">${t.type==='income'?'Receita':'Despesa'}</span></td>
          <td>${escapeHtml(t.method||'—')}</td>
          <td class="mono ${t.type==='income'?'stat-value income':'stat-value expense'}" style="font-size:13px;">${t.type==='income'?'+':'-'} ${fmtBRL(t.amount)}</td>
          <td><div class="row-actions"><button class="iconbtn-sm" onclick="openTxModal('${t.type}','${t.id}')">${ICONS.edit}</button><button class="iconbtn-sm" onclick="confirmDeleteTx('${t.id}')">${ICONS.trash}</button></div></td>
        </tr>`;
      }).join('') || `<tr><td colspan="7">${emptyState('Nenhuma transação encontrada','Ajuste os filtros ou adicione uma movimentação.')}</td></tr>`}
      </tbody>
    </table></div>
    <div class="pagination">
      <span style="font-size:12px;color:var(--text-faint);margin-right:8px;">${total} registro(s) · página ${txTableState.page}/${pages}</span>
      <button class="btn btn-ghost btn-sm" onclick="txTableState.page=Math.max(1,txTableState.page-1);renderPage();">Anterior</button>
      <button class="btn btn-ghost btn-sm" onclick="txTableState.page=Math.min(${pages},txTableState.page+1);renderPage();">Próxima</button>
    </div>
  </div>`;
}

/* ============================================================
   TRANSACTION MODAL (create/edit)
   ============================================================ */
function openTxModal(type,id){
  const editing = id ? STATE.transactions.find(t=>t.id===id) : null;
  const cats = STATE.categories[type];
  const isIncome = type==='income';
  const html = `
  <div class="modal-overlay" id="modal-ov" onclick="if(event.target===this)closeModal()">
  <div class="modal">
    <div class="modal-head"><h3>${editing?'Editar':'Adicionar'} ${isIncome?'receita':'despesa'}</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div class="field"><label>Descrição</label><input id="m-desc" value="${editing?escapeHtml(editing.description):''}" placeholder="Ex: ${isIncome?'Salário de agosto':'Supermercado'}"></div>
      <div class="field-row">
        <div class="field"><label>Valor (R$)</label><input id="m-amount" type="number" step="0.01" value="${editing?editing.amount:''}" placeholder="0,00"></div>
        <div class="field"><label>Data</label><input id="m-date" type="date" value="${editing?editing.date:todayISO()}"></div>
      </div>
      <div class="field"><label>Categoria</label><select id="m-cat">${cats.map(c=>`<option value="${c.id}" ${editing&&editing.category===c.id?'selected':''}>${c.icon} ${escapeHtml(c.name)}</option>`).join('')}</select></div>
      <div class="field"><label>Forma de ${isIncome?'recebimento':'pagamento'}</label>
        <select id="m-method">
          ${(isIncome?['Transferência','Pix','Dinheiro','Depósito','Outro']:['Dinheiro','Pix','Cartão de débito','Cartão de crédito','Boleto','Transferência']).map(m=>`<option ${editing&&editing.method===m?'selected':''}>${m}</option>`).join('')}
        </select>
      </div>
      ${!isIncome?`<div class="field"><label>Tipo de despesa</label><select id="m-fixed"><option value="fixed" ${editing&&editing.fixed==='fixed'?'selected':''}>Fixa</option><option value="variable" ${editing&&editing.fixed==='variable'?'selected':''}>Variável</option></select></div>`:''}
      <div class="toggle-row">
        <div><div style="font-size:13px;font-weight:600;">${isIncome?'Receita':'Despesa'} recorrente</div><div style="font-size:11.5px;color:var(--text-faint);">Repete automaticamente</div></div>
        <div class="toggle ${editing&&editing.recurring?'on':''}" id="m-recurring-toggle" onclick="this.classList.toggle('on');document.getElementById('m-freq-wrap').classList.toggle('hidden',!this.classList.contains('on'));"></div>
      </div>
      <div class="field ${editing&&editing.recurring?'':'hidden'}" id="m-freq-wrap"><label>Frequência</label>
        <select id="m-freq"><option value="weekly" ${editing&&editing.frequency==='weekly'?'selected':''}>Semanal</option><option value="monthly" ${!editing||editing.frequency==='monthly'?'selected':''}>Mensal</option><option value="yearly" ${editing&&editing.frequency==='yearly'?'selected':''}>Anual</option></select>
      </div>
      <div class="field"><label>Observação (opcional)</label><textarea id="m-notes" rows="2">${editing?escapeHtml(editing.notes||''):''}</textarea></div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" style="width:auto;" onclick="saveTx('${type}','${id||''}')">Salvar</button>
    </div>
  </div></div>`;
  document.getElementById('modal-slot').innerHTML = html;
}
function closeModal(){document.getElementById('modal-slot').innerHTML='';}

async function saveTx(type,id){
  const desc = document.getElementById('m-desc').value.trim();
  const amount = parseFloat(document.getElementById('m-amount').value);
  const date = document.getElementById('m-date').value;
  const category = document.getElementById('m-cat').value;
  const method = document.getElementById('m-method').value;
  const fixedEl = document.getElementById('m-fixed');
  const fixed = fixedEl ? fixedEl.value : undefined;
  const recurring = document.getElementById('m-recurring-toggle').classList.contains('on');
  const frequency = recurring ? document.getElementById('m-freq').value : null;
  const notes = document.getElementById('m-notes').value.trim();
  if(!desc) return toast('Informe uma descrição.','error');
  if(!amount || amount<=0) return toast('Informe um valor válido.','error');
  if(!date) return toast('Informe a data.','error');

  if(id){
    const t = STATE.transactions.find(x=>x.id===id);
    Object.assign(t,{description:desc,amount,date,category,method,fixed,recurring,frequency,notes,updatedAt:new Date().toISOString()});
    toast('Movimentação atualizada!');
  } else {
    STATE.transactions.push({id:uid(),type,description:desc,amount,date,category,method,fixed,recurring,frequency,notes,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
    toast(type==='income'?'Receita adicionada!':'Despesa adicionada!');
  }
  await persist();
  computeNotifications();
  closeModal();
  renderPage();
}
function confirmDeleteTx(id){
  const t = STATE.transactions.find(x=>x.id===id);
  document.getElementById('modal-slot').innerHTML = confirmModal(
    'Excluir movimentação?',
    `Tem certeza que deseja excluir "${escapeHtml(t.description)}"? Esta ação não pode ser desfeita.`,
    `deleteTx('${id}')`
  );
}
async function deleteTx(id){
  STATE.transactions = STATE.transactions.filter(t=>t.id!==id);
  await persist();
  computeNotifications();
  closeModal();
  toast('Movimentação excluída.');
  renderPage();
}
function confirmModal(title,body,onConfirm){
  return `<div class="modal-overlay" onclick="if(event.target===this)closeModal()"><div class="modal" style="max-width:380px;">
    <div class="modal-head"><h3>${title}</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body"><p style="font-size:13.5px;color:var(--text-dim);line-height:1.6;">${body}</p></div>
    <div class="modal-foot"><button class="btn btn-ghost" onclick="closeModal()">Cancelar</button><button class="btn btn-danger" onclick="${onConfirm}">Excluir</button></div>
  </div></div>`;
}

/* ============================================================
   CATEGORIAS
   ============================================================ */
const CAT_COLORS = ['#20e3a8','#3ddc97','#4fd1e8','#e3b567','#fb7a8c','#f5945f','#c17ce8','#7ca8e8','#e88fc1','#8b6ee8'];
const CAT_ICONS = ['💼','💻','🛒','📈','🤝','🏠','🍽️','🚗','💊','📚','🎮','🔁','🛍️','💳','📉','📊','🏛️','✨','🎯','💰'];

function pageCategorias(){
  return `
  <div class="grid grid-2">
    ${categoryColumn('income','Grupos de receitas')}
    ${categoryColumn('expense','Grupos de despesas')}
  </div>`;
}
function categoryColumn(type,title){
  const cats = STATE.categories[type];
  const txs = STATE.transactions.filter(t=>t.type===type);
  return `<div class="card">
    <div class="card-head"><h3>${title}</h3><button class="btn btn-primary btn-sm" style="width:auto;" onclick="openCatModal('${type}')">${ICONS.plus} Nova categoria</button></div>
    ${cats.map(c=>{
      const total = txs.filter(t=>t.category===c.id).reduce((a,t)=>a+Number(t.amount),0);
      return `<div class="cat-row">
        <span class="cat-dot" style="background:${c.color}"></span>
        <span class="cat-name" style="width:auto;flex:1;">${c.icon} ${escapeHtml(c.name)}</span>
        <span class="cat-val mono" style="width:auto;">${fmtBRL(total)}</span>
        <div class="row-actions" style="margin-left:8px;">
          <button class="iconbtn-sm" onclick="openCatModal('${type}','${c.id}')">${ICONS.edit}</button>
          <button class="iconbtn-sm" onclick="deleteCat('${type}','${c.id}')">${ICONS.trash}</button>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}
function openCatModal(type,id){
  const editing = id ? STATE.categories[type].find(c=>c.id===id) : null;
  const html = `<div class="modal-overlay" onclick="if(event.target===this)closeModal()"><div class="modal">
    <div class="modal-head"><h3>${editing?'Editar':'Nova'} categoria</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div class="field"><label>Nome</label><input id="c-name" value="${editing?escapeHtml(editing.name):''}" placeholder="Ex: Pets"></div>
      <div class="field"><label>Ícone</label><div class="chip-row" id="c-icons">${CAT_ICONS.map(ic=>`<div class="icon-swatch ${editing&&editing.icon===ic?'sel':''}" data-ic="${ic}" onclick="selIcon(this)">${ic}</div>`).join('')}</div></div>
      <div class="field"><label>Cor</label><div class="chip-row" id="c-colors">${CAT_COLORS.map(cl=>`<div class="color-swatch ${editing&&editing.color===cl?'sel':''}" data-cl="${cl}" style="background:${cl}" onclick="selColor(this)"></div>`).join('')}</div></div>
    </div>
    <div class="modal-foot"><button class="btn btn-ghost" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" style="width:auto;" onclick="saveCat('${type}','${id||''}')">Salvar</button></div>
  </div></div>`;
  document.getElementById('modal-slot').innerHTML = html;
  if(!editing){ document.querySelector('#c-icons .icon-swatch').classList.add('sel'); document.querySelector('#c-colors .color-swatch').classList.add('sel'); }
}
function selIcon(el){document.querySelectorAll('#c-icons .icon-swatch').forEach(e=>e.classList.remove('sel'));el.classList.add('sel');}
function selColor(el){document.querySelectorAll('#c-colors .color-swatch').forEach(e=>e.classList.remove('sel'));el.classList.add('sel');}
async function saveCat(type,id){
  const name = document.getElementById('c-name').value.trim();
  const icon = document.querySelector('#c-icons .icon-swatch.sel')?.dataset.ic || '✨';
  const color = document.querySelector('#c-colors .color-swatch.sel')?.dataset.cl || '#9d9da7';
  if(!name) return toast('Informe um nome.','error');
  if(id){
    Object.assign(STATE.categories[type].find(c=>c.id===id),{name,icon,color});
  } else {
    STATE.categories[type].push({id:uid(),name,icon,color});
  }
  await persist(); closeModal(); toast('Categoria salva!'); renderPage();
}
async function deleteCat(type,id){
  const inUse = STATE.transactions.some(t=>t.type===type && t.category===id);
  if(inUse) return toast('Categoria em uso por movimentações. Remova ou reclassifique-as primeiro.','error');
  STATE.categories[type] = STATE.categories[type].filter(c=>c.id!==id);
  await persist(); toast('Categoria excluída.'); renderPage();
}

/* ============================================================
   ORÇAMENTOS
   ============================================================ */
function pageOrcamentos(){
  const [s,e] = periodRange('this_month');
  const monthTx = STATE.transactions.filter(t=>t.type==='expense' && t.date>=s && t.date<=e);
  return `
  <div class="toolbar"><div style="flex:1;color:var(--text-dim);font-size:13px;">Defina limites mensais por categoria de despesa.</div><button class="btn btn-primary" style="width:auto;" onclick="openBudgetModal()">${ICONS.plus} Novo orçamento</button></div>
  <div class="grid grid-3">
  ${STATE.budgets.length ? STATE.budgets.map(b=>{
      const c = catInfo('expense',b.category);
      const spent = monthTx.filter(t=>t.category===b.category).reduce((a,t)=>a+Number(t.amount),0);
      const pct = b.limit>0 ? (spent/b.limit*100) : 0;
      const cls = pct>=100?'over':pct>=90?'over':pct>=70?'warn':'';
      return `<div class="card">
        <div class="card-head"><h3>${c.icon} ${escapeHtml(c.name)}</h3><div class="row-actions"><button class="iconbtn-sm" onclick="openBudgetModal('${b.id}')">${ICONS.edit}</button><button class="iconbtn-sm" onclick="deleteBudget('${b.id}')">${ICONS.trash}</button></div></div>
        <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--text-dim);margin-bottom:8px;">
          <span class="mono">${fmtBRL(spent)} gasto</span><span class="mono">${fmtBRL(b.limit)} limite</span>
        </div>
        <div class="progress-bg"><div class="progress-fill ${cls}" style="width:${Math.min(pct,100)}%"></div></div>
        <div style="margin-top:10px;font-size:12px;color:${pct>=100?'var(--expense)':'var(--text-faint)'};">
          ${pct>=100?'Limite ultrapassado':'Disponível: '+fmtBRL(Math.max(b.limit-spent,0))} · ${pct.toFixed(0)}%
        </div>
      </div>`;
    }).join('') : `<div class="card" style="grid-column:1/-1;">${emptyState('Nenhum orçamento definido','Crie limites de gastos por categoria para receber alertas.')}</div>`}
  </div>`;
}
function openBudgetModal(id){
  const editing = id? STATE.budgets.find(b=>b.id===id):null;
  const used = STATE.budgets.filter(b=>!editing||b.id!==editing.id).map(b=>b.category);
  const cats = STATE.categories.expense.filter(c=>!used.includes(c.id) || (editing&&editing.category===c.id));
  document.getElementById('modal-slot').innerHTML = `<div class="modal-overlay" onclick="if(event.target===this)closeModal()"><div class="modal">
    <div class="modal-head"><h3>${editing?'Editar':'Novo'} orçamento</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div class="field"><label>Categoria</label><select id="b-cat">${cats.map(c=>`<option value="${c.id}" ${editing&&editing.category===c.id?'selected':''}>${c.icon} ${escapeHtml(c.name)}</option>`).join('')}</select></div>
      <div class="field"><label>Limite mensal (R$)</label><input id="b-limit" type="number" step="0.01" value="${editing?editing.limit:''}" placeholder="1000,00"></div>
    </div>
    <div class="modal-foot"><button class="btn btn-ghost" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" style="width:auto;" onclick="saveBudget('${id||''}')">Salvar</button></div>
  </div></div>`;
}
async function saveBudget(id){
  const category = document.getElementById('b-cat').value;
  const limit = parseFloat(document.getElementById('b-limit').value);
  if(!limit || limit<=0) return toast('Informe um limite válido.','error');
  if(id){ Object.assign(STATE.budgets.find(b=>b.id===id),{category,limit}); }
  else { STATE.budgets.push({id:uid(),category,limit}); }
  await persist(); computeNotifications(); closeModal(); toast('Orçamento salvo!'); renderPage();
}
async function deleteBudget(id){
  STATE.budgets = STATE.budgets.filter(b=>b.id!==id);
  await persist(); toast('Orçamento removido.'); renderPage();
}

/* ============================================================
   METAS
   ============================================================ */
function pageMetas(){
  return `
  <div class="toolbar"><div style="flex:1;color:var(--text-dim);font-size:13px;">Acompanhe suas metas financeiras.</div><button class="btn btn-primary" style="width:auto;" onclick="openGoalModal()">${ICONS.plus} Nova meta</button></div>
  <div class="grid grid-3">
  ${STATE.goals.length? STATE.goals.map(g=>{
    const pct = g.target>0? (g.saved/g.target*100):0;
    const daysLeft = g.deadline ? Math.ceil((new Date(g.deadline)-new Date())/86400000) : null;
    return `<div class="card">
      <div class="card-head"><h3>🎯 ${escapeHtml(g.name)}</h3><div class="row-actions"><button class="iconbtn-sm" onclick="openGoalModal('${g.id}')">${ICONS.edit}</button><button class="iconbtn-sm" onclick="deleteGoal('${g.id}')">${ICONS.trash}</button></div></div>
      <div class="stat-value mono" style="font-size:19px;">${fmtBRL(g.saved)} <span style="font-size:12.5px;color:var(--text-faint);font-weight:500;">de ${fmtBRL(g.target)}</span></div>
      <div class="progress-bg" style="margin-top:10px;"><div class="progress-fill" style="width:${Math.min(pct,100)}%"></div></div>
      <div style="display:flex;justify-content:space-between;margin-top:10px;font-size:11.5px;color:var(--text-faint);">
        <span>${pct.toFixed(0)}% concluído</span>
        <span>${g.monthly? 'Meta mensal: '+fmtBRL(g.monthly):''}</span>
      </div>
      ${g.deadline?`<div style="font-size:11.5px;color:var(--text-faint);margin-top:4px;">Prazo: ${fmtDate(g.deadline)} ${daysLeft!==null?`(${daysLeft>=0?daysLeft+' dias restantes':'atrasado'})`:''}</div>`:''}
      <button class="btn btn-ghost btn-sm" style="width:100%;margin-top:12px;" onclick="addGoalProgress('${g.id}')">+ Registrar aporte</button>
    </div>`;
  }).join('') : `<div class="card" style="grid-column:1/-1;">${emptyState('Nenhuma meta cadastrada','Crie metas como reserva de emergência, viagem ou compra de imóvel.')}</div>`}
  </div>`;
}
function openGoalModal(id){
  const editing = id? STATE.goals.find(g=>g.id===id):null;
  document.getElementById('modal-slot').innerHTML = `<div class="modal-overlay" onclick="if(event.target===this)closeModal()"><div class="modal">
    <div class="modal-head"><h3>${editing?'Editar':'Nova'} meta</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div class="field"><label>Nome da meta</label><input id="g-name" value="${editing?escapeHtml(editing.name):''}" placeholder="Ex: Reserva de emergência"></div>
      <div class="field-row">
        <div class="field"><label>Valor total (R$)</label><input id="g-target" type="number" step="0.01" value="${editing?editing.target:''}"></div>
        <div class="field"><label>Já acumulado (R$)</label><input id="g-saved" type="number" step="0.01" value="${editing?editing.saved:'0'}"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Valor desejado/mês (R$)</label><input id="g-monthly" type="number" step="0.01" value="${editing?editing.monthly||'':''}"></div>
        <div class="field"><label>Data limite</label><input id="g-deadline" type="date" value="${editing?editing.deadline||'':''}"></div>
      </div>
    </div>
    <div class="modal-foot"><button class="btn btn-ghost" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" style="width:auto;" onclick="saveGoal('${id||''}')">Salvar</button></div>
  </div></div>`;
}
async function saveGoal(id){
  const name=document.getElementById('g-name').value.trim();
  const target=parseFloat(document.getElementById('g-target').value);
  const saved=parseFloat(document.getElementById('g-saved').value)||0;
  const monthly=parseFloat(document.getElementById('g-monthly').value)||0;
  const deadline=document.getElementById('g-deadline').value;
  if(!name) return toast('Informe o nome da meta.','error');
  if(!target||target<=0) return toast('Informe um valor total válido.','error');
  if(id){ Object.assign(STATE.goals.find(g=>g.id===id),{name,target,saved,monthly,deadline}); }
  else { STATE.goals.push({id:uid(),name,target,saved,monthly,deadline}); }
  await persist(); computeNotifications(); closeModal(); toast('Meta salva!'); renderPage();
}
async function deleteGoal(id){ STATE.goals=STATE.goals.filter(g=>g.id!==id); await persist(); toast('Meta removida.'); renderPage(); }
async function addGoalProgress(id){
  const val = prompt('Valor do aporte (R$):');
  const n = parseFloat(val);
  if(!n || n<=0) return;
  const g = STATE.goals.find(x=>x.id===id);
  const wasBelow = g.saved < g.target;
  g.saved += n;
  await persist();
  if(wasBelow && g.saved>=g.target){
    STATE.notifications.unshift({id:uid(),text:`Você alcançou sua meta de "${g.name}"! 🎉`,date:new Date().toISOString()});
    await persist();
  }
  computeNotifications();
  toast('Aporte registrado!');
  renderPage();
}

/* ============================================================
   GRÁFICOS
   ============================================================ */
let chartFilters = {period:'last_6'};
function pageGraficos(){
  return `
  <div class="period-bar">
    ${[['last_6','Últimos 6 meses'],['last_3','Últimos 3 meses'],['this_year','Este ano'],['this_month','Este mês']].map(([k,l])=>`<div class="period-chip ${chartFilters.period===k?'active':''}" onclick="chartFilters.period='${k}';renderPage();">${l}</div>`).join('')}
  </div>
  <div class="grid grid-2">
    <div class="card"><div class="card-head"><h3>Receitas x Despesas por mês</h3></div><canvas id="chBar1" height="220"></canvas></div>
    <div class="card"><div class="card-head"><h3>Distribuição das despesas por categoria</h3></div><canvas id="chDonut" height="220"></canvas></div>
    <div class="card"><div class="card-head"><h3>Evolução do saldo</h3></div><canvas id="chLine" height="220"></canvas></div>
    <div class="card"><div class="card-head"><h3>Maiores categorias de gastos</h3></div><canvas id="chBarH" height="220"></canvas></div>
    <div class="card"><div class="card-head"><h3>Receitas por categoria</h3></div><canvas id="chIncomeCat" height="220"></canvas></div>
    <div class="card"><div class="card-head"><h3>Despesas fixas x variáveis</h3></div><canvas id="chFixedVar" height="220"></canvas></div>
    <div class="card"><div class="card-head"><h3>Mês atual x mês anterior</h3></div><canvas id="chCompare" height="220"></canvas></div>
    <div class="card"><div class="card-head"><h3>% da renda consumido por categoria</h3></div><canvas id="chPctIncome" height="220"></canvas></div>
  </div>`;
}
function lastNMonths(n){
  const arr=[]; const now=new Date();
  for(let i=n-1;i>=0;i--){ const d=new Date(now.getFullYear(),now.getMonth()-i,1); arr.push(d.toISOString().slice(0,7)); }
  return arr;
}
function destroyCharts(){ Object.values(charts).forEach(c=>c&&c.destroy()); charts={}; }
function chartOpts(extra){
  return Object.assign({
    responsive:true,
    plugins:{legend:{labels:{color:'#9d9da7',font:{size:11}}}},
    scales:{
      x:{ticks:{color:'#5f5f6b',font:{size:10.5}},grid:{color:'#1c1c21'}},
      y:{ticks:{color:'#5f5f6b',font:{size:10.5}},grid:{color:'#1c1c21'}}
    }
  },extra||{});
}
function renderAllCharts(){
  destroyCharts();
  const nMonths = chartFilters.period==='last_3'?3:chartFilters.period==='this_year'?12:chartFilters.period==='this_month'?1:6;
  const months = lastNMonths(nMonths);
  const monthLabel = m=>{const [y,mo]=m.split('-');return new Date(y,mo-1,1).toLocaleDateString('pt-BR',{month:'short',year:'2-digit'});};

  // 1. receitas x despesas por mes
  const incByM = months.map(m=>sumBy(STATE.transactions.filter(t=>monthKey(t.date)===m),'income'));
  const expByM = months.map(m=>sumBy(STATE.transactions.filter(t=>monthKey(t.date)===m),'expense'));
  charts.bar1 = new Chart(document.getElementById('chBar1'), {type:'bar',data:{labels:months.map(monthLabel),datasets:[
    {label:'Receitas',data:incByM,backgroundColor:'#3ddc97',borderRadius:6},
    {label:'Despesas',data:expByM,backgroundColor:'#fb7a8c',borderRadius:6}
  ]},options:chartOpts()});

  // 2. donut despesas por categoria (current filtered period)
  const [ps,pe] = periodRange(chartFilters.period==='this_month'?'this_month':chartFilters.period);
  const periodTx = STATE.transactions.filter(t=>t.date>=ps&&t.date<=pe&&t.type==='expense');
  const catAgg={};
  periodTx.forEach(t=>{catAgg[t.category]=(catAgg[t.category]||0)+Number(t.amount);});
  const catEntries = Object.entries(catAgg).sort((a,b)=>b[1]-a[1]);
  charts.donut = new Chart(document.getElementById('chDonut'),{type:'doughnut',data:{
    labels:catEntries.map(([id])=>catInfo('expense',id).name),
    datasets:[{data:catEntries.map(([,v])=>v),backgroundColor:catEntries.map(([id])=>catInfo('expense',id).color),borderWidth:0}]
  },options:{responsive:true,plugins:{legend:{position:'bottom',labels:{color:'#9d9da7',font:{size:10.5},boxWidth:10}}}}});

  // 3. evolucao do saldo (cumulative)
  let running=0;
  const saldoSeries = months.map(m=>{
    const inc = sumBy(STATE.transactions.filter(t=>monthKey(t.date)===m),'income');
    const exp = sumBy(STATE.transactions.filter(t=>monthKey(t.date)===m),'expense');
    running += (inc-exp);
    return running;
  });
  charts.line = new Chart(document.getElementById('chLine'),{type:'line',data:{labels:months.map(monthLabel),datasets:[{label:'Saldo acumulado',data:saldoSeries,borderColor:'#20e3a8',backgroundColor:'rgba(32,227,168,.12)',fill:true,tension:.35,pointRadius:3}]},options:chartOpts()});

  // 4. maiores categorias (horizontal)
  const top5 = catEntries.slice(0,5);
  charts.barH = new Chart(document.getElementById('chBarH'),{type:'bar',data:{labels:top5.map(([id])=>catInfo('expense',id).name),datasets:[{data:top5.map(([,v])=>v),backgroundColor:top5.map(([id])=>catInfo('expense',id).color),borderRadius:6}]},options:Object.assign(chartOpts({indexAxis:'y'}),{plugins:{legend:{display:false}}})});

  // 5. receitas por categoria
  const incTx = STATE.transactions.filter(t=>t.date>=ps&&t.date<=pe&&t.type==='income');
  const incAgg={};
  incTx.forEach(t=>{incAgg[t.category]=(incAgg[t.category]||0)+Number(t.amount);});
  const incEntries = Object.entries(incAgg).sort((a,b)=>b[1]-a[1]);
  charts.incomeCat = new Chart(document.getElementById('chIncomeCat'),{type:'pie',data:{labels:incEntries.map(([id])=>catInfo('income',id).name),datasets:[{data:incEntries.map(([,v])=>v),backgroundColor:incEntries.map(([id])=>catInfo('income',id).color),borderWidth:0}]},options:{responsive:true,plugins:{legend:{position:'bottom',labels:{color:'#9d9da7',font:{size:10.5},boxWidth:10}}}}});

  // 6. fixas x variaveis
  const fixed = periodTx.filter(t=>t.fixed==='fixed').reduce((a,t)=>a+Number(t.amount),0);
  const variable = periodTx.filter(t=>t.fixed==='variable').reduce((a,t)=>a+Number(t.amount),0);
  charts.fixedVar = new Chart(document.getElementById('chFixedVar'),{type:'doughnut',data:{labels:['Fixas','Variáveis'],datasets:[{data:[fixed,variable],backgroundColor:['#e3b567','#7ca8e8'],borderWidth:0}]},options:{responsive:true,plugins:{legend:{position:'bottom',labels:{color:'#9d9da7'}}}}});

  // 7. mes atual x anterior
  const thisM = months[months.length-1];
  const [ty,tm] = thisM.split('-').map(Number);
  const prevD = new Date(ty,tm-2,1);
  const prevM = prevD.toISOString().slice(0,7);
  const curInc = sumBy(STATE.transactions.filter(t=>monthKey(t.date)===thisM),'income');
  const curExp = sumBy(STATE.transactions.filter(t=>monthKey(t.date)===thisM),'expense');
  const pInc = sumBy(STATE.transactions.filter(t=>monthKey(t.date)===prevM),'income');
  const pExp = sumBy(STATE.transactions.filter(t=>monthKey(t.date)===prevM),'expense');
  charts.compare = new Chart(document.getElementById('chCompare'),{type:'bar',data:{labels:['Receitas','Despesas'],datasets:[
    {label:monthLabel(prevM),data:[pInc,pExp],backgroundColor:'#3a3a42',borderRadius:6},
    {label:monthLabel(thisM),data:[curInc,curExp],backgroundColor:'#20e3a8',borderRadius:6}
  ]},options:chartOpts()});

  // 8. pct da renda por categoria
  const totalIncPeriod = incTx.reduce((a,t)=>a+Number(t.amount),0) || periodTx.reduce((a,t)=>a+Number(t.amount),0) || 1;
  const pctEntries = catEntries.slice(0,6).map(([id,v])=>[catInfo('expense',id).name, totalIncPeriod>0?(v/totalIncPeriod*100):0]);
  charts.pctIncome = new Chart(document.getElementById('chPctIncome'),{type:'bar',data:{labels:pctEntries.map(e=>e[0]),datasets:[{label:'% da renda',data:pctEntries.map(e=>e[1].toFixed(1)),backgroundColor:'#e3b567',borderRadius:6}]},options:Object.assign(chartOpts({indexAxis:'y'}),{plugins:{legend:{display:false}}})});
}

/* ============================================================
   ANÁLISE POR IA
   ============================================================ */
function buildFinancialSummary(){
  const months = lastNMonths(6);
  const byMonth = months.map(m=>{
    const tx = STATE.transactions.filter(t=>monthKey(t.date)===m);
    return {month:m, income:sumBy(tx,'income'), expense:sumBy(tx,'expense')};
  });
  const thisM = months[months.length-1];
  const lastM = months[months.length-2];
  const catAgg={};
  STATE.transactions.filter(t=>t.type==='expense'&&monthKey(t.date)===thisM).forEach(t=>{catAgg[t.category]=(catAgg[t.category]||0)+Number(t.amount);});
  const catAggPrev={};
  STATE.transactions.filter(t=>t.type==='expense'&&monthKey(t.date)===lastM).forEach(t=>{catAggPrev[t.category]=(catAggPrev[t.category]||0)+Number(t.amount);});
  const categoriesDetail = Object.entries(catAgg).map(([id,v])=>({
    categoria: catInfo('expense',id).name, valor_atual: Number(v.toFixed(2)), valor_mes_anterior: Number((catAggPrev[id]||0).toFixed(2))
  }));
  const recurring = STATE.transactions.filter(t=>t.recurring).map(t=>({descricao:t.description,tipo:t.type,valor:t.amount,categoria:catInfo(t.type,t.category).name,frequencia:t.frequency}));
  const fixedTotal = STATE.transactions.filter(t=>t.type==='expense'&&t.fixed==='fixed'&&monthKey(t.date)===thisM).reduce((a,t)=>a+Number(t.amount),0);
  const variableTotal = STATE.transactions.filter(t=>t.type==='expense'&&t.fixed==='variable'&&monthKey(t.date)===thisM).reduce((a,t)=>a+Number(t.amount),0);
  return {
    moeda:'BRL',
    total_transacoes: STATE.transactions.length,
    historico_mensal: byMonth,
    despesas_por_categoria_mes_atual: categoriesDetail,
    despesas_recorrentes: recurring,
    despesas_fixas_mes_atual: Number(fixedTotal.toFixed(2)),
    despesas_variaveis_mes_atual: Number(variableTotal.toFixed(2)),
    orcamentos: STATE.budgets.map(b=>({categoria:catInfo('expense',b.category).name, limite:b.limit})),
    metas: STATE.goals.map(g=>({nome:g.name, alvo:g.target, acumulado:g.saved})),
  };
}

function pageIA(){
  const hasData = STATE.transactions.length >= 3;
  return `
  <div class="ia-hero">
    <h2 style="font-size:20px;margin-bottom:8px;">Análise Financeira Inteligente</h2>
    <p style="color:var(--text-dim);font-size:13.5px;max-width:480px;margin:0 auto 20px;">A IA analisa suas receitas, despesas, categorias e recorrências reais para gerar recomendações personalizadas.</p>
    <button class="ia-btn" onclick="runAIAnalysis()" id="ia-run-btn">${ICONS.ia} Analisar minhas finanças</button>
  </div>
  <div id="ia-results">
    ${!hasData? `<div class="card">${emptyState('Ainda não existem dados suficientes para realizar esta análise.','Cadastre ao menos algumas receitas e despesas para liberar a análise por IA.')}</div>` : (STATE.aiAnalysis? renderAICards(STATE.aiAnalysis) : `<div class="card">${emptyState('Pronto para analisar','Clique em "Analisar minhas finanças" para gerar sua análise personalizada.')}</div>`)}
  </div>

  <div class="section-block">
    <div class="card-head"><h3>Pergunte à IA sobre suas finanças</h3></div>
    <div class="chat-box">
      <div class="chat-msgs" id="chat-msgs">
        ${STATE.chatHistory.length? STATE.chatHistory.map(m=>`<div class="chat-msg ${m.role}">${escapeHtml(m.text)}</div>`).join('') : `<div style="text-align:center;color:var(--text-faint);font-size:12.5px;padding:20px;">Pergunte algo como "Como posso economizar R$ 500 por mês?"</div>`}
      </div>
      <div style="padding:0 14px;display:flex;gap:8px;flex-wrap:wrap;">
        <div class="suggest-chip" onclick="sendChat('Como posso economizar R\$ 500 por mês?')">Como economizar R$500/mês?</div>
        <div class="suggest-chip" onclick="sendChat('Quais despesas eu deveria reduzir primeiro?')">Quais despesas reduzir?</div>
        <div class="suggest-chip" onclick="sendChat('Quanto posso guardar mensalmente?')">Quanto posso guardar?</div>
        <div class="suggest-chip" onclick="sendChat('Qual categoria está prejudicando meu orçamento?')">Categoria mais prejudicial?</div>
      </div>
      <div class="chat-input-row">
        <input id="chat-input" placeholder="Pergunte à IA sobre suas finanças..." onkeydown="if(event.key==='Enter')sendChat();">
        <button class="btn btn-primary" style="width:auto;" onclick="sendChat()">Enviar</button>
      </div>
    </div>
  </div>`;
}

async function callClaude(systemPrompt, userPrompt){
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    })
  });
  if(!response.ok){
    throw new Error('AI_UNAVAILABLE');
  }
  const data = await response.json();
  const text = (data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('\n');
  return text;
}
const AI_UNAVAILABLE_MSG = 'A Análise por IA precisa de uma chave de API da Anthropic configurada em um backend próprio para funcionar fora do ambiente do Claude. Veja o README do projeto para instruções de configuração.';

async function runAIAnalysis(){
  const btn = document.getElementById('ia-run-btn');
  btn.disabled = true; btn.innerHTML = 'Analisando...';
  const summary = buildFinancialSummary();
  try{
    const sys = `Você é um analista financeiro pessoal. Responda SOMENTE com um JSON válido (sem markdown, sem crases), no formato:
{"resumo":"...", "problemas":"...", "onde_mais_gasta":"...", "onde_economizar":"...", "gastos_que_aumentaram":"...", "recomendacoes":"...", "meta_economia_sugerida":"...", "plano_30_dias":"..."}
Regras: use APENAS os dados fornecidos, nunca invente números. Se não houver dados suficientes para algum card, escreva exatamente "Ainda não existem dados suficientes para realizar esta análise." nesse campo. Valores monetários em Real (R$). Seja específico e cite percentuais/valores reais dos dados. Responda em português do Brasil, tom direto e prático, cada campo com 2-4 frases.`;
    const userMsg = `Dados financeiros do usuário (JSON):\n${JSON.stringify(summary)}`;
    const text = await callClaude(sys,userMsg);
    const clean = text.replace(/```json|```/g,'').trim();
    const parsed = JSON.parse(clean);
    STATE.aiAnalysis = parsed;
    document.getElementById('ia-results').innerHTML = renderAICards(parsed);
    toast('Análise concluída!');
  }catch(e){
    console.error(e);
    toast(e && e.message==='AI_UNAVAILABLE' ? AI_UNAVAILABLE_MSG : 'Não foi possível concluir a análise agora. Tente novamente.','error');
  }
  btn.disabled=false; btn.innerHTML = `${ICONS.ia} Analisar minhas finanças`;
}
function renderAICards(a){
  const cards = [
    ['Resumo financeiro',a.resumo],
    ['Principais problemas encontrados',a.problemas],
    ['Onde você mais gasta dinheiro',a.onde_mais_gasta],
    ['Onde é possível economizar',a.onde_economizar],
    ['Gastos que aumentaram',a.gastos_que_aumentaram],
    ['Recomendações para reduzir despesas',a.recomendacoes],
    ['Meta de economia sugerida',a.meta_economia_sugerida],
    ['Plano financeiro para os próximos 30 dias',a.plano_30_dias],
  ];
  return `<div class="grid grid-2">${cards.map(([t,c])=>`<div class="ia-card"><h4>${ICONS.ia} ${t}</h4><p>${escapeHtml(c||'Ainda não existem dados suficientes para realizar esta análise.')}</p></div>`).join('')}</div>`;
}

async function sendChat(preset){
  const input = document.getElementById('chat-input');
  const msg = (preset || input.value).trim();
  if(!msg) return;
  input.value='';
  STATE.chatHistory.push({role:'user',text:msg});
  renderChatOnly();
  try{
    const summary = buildFinancialSummary();
    const sys = `Você é um assistente financeiro pessoal. Use SOMENTE os dados fornecidos abaixo para responder, nunca invente números. Se não houver dados suficientes, diga isso claramente. Responda em português do Brasil, de forma direta, prática, em até 4 frases.\nDados financeiros do usuário: ${JSON.stringify(summary)}`;
    const text = await callClaude(sys, msg);
    STATE.chatHistory.push({role:'ai',text:text.trim()});
  }catch(e){
    STATE.chatHistory.push({role:'ai',text: e && e.message==='AI_UNAVAILABLE' ? AI_UNAVAILABLE_MSG : 'Não consegui responder agora. Tente novamente em instantes.'});
  }
  renderChatOnly();
}
function renderChatOnly(){
  const el = document.getElementById('chat-msgs');
  if(!el) return;
  el.innerHTML = STATE.chatHistory.length? STATE.chatHistory.map(m=>`<div class="chat-msg ${m.role}">${escapeHtml(m.text)}</div>`).join('') : '';
  el.scrollTop = el.scrollHeight;
}

/* ============================================================
   NOTIFICAÇÕES
   ============================================================ */
function computeNotifications(){
  const notifs = [];
  const [s,e] = periodRange('this_month');
  const monthExp = STATE.transactions.filter(t=>t.type==='expense'&&t.date>=s&&t.date<=e);
  STATE.budgets.forEach(b=>{
    const spent = monthExp.filter(t=>t.category===b.category).reduce((a,t)=>a+Number(t.amount),0);
    const pct = b.limit>0? spent/b.limit*100:0;
    const c = catInfo('expense',b.category);
    if(pct>=100) notifs.push({id:'b100-'+b.id,text:`Seu gasto com ${c.name} ultrapassou o limite do orçamento.`,date:new Date().toISOString()});
    else if(pct>=90) notifs.push({id:'b90-'+b.id,text:`Seu gasto com ${c.name} atingiu ${pct.toFixed(0)}% do limite.`,date:new Date().toISOString()});
    else if(pct>=70) notifs.push({id:'b70-'+b.id,text:`Seu gasto com ${c.name} atingiu ${pct.toFixed(0)}% do limite.`,date:new Date().toISOString()});
  });
  // month over month expense increase
  const now=new Date(); const prevD=new Date(now.getFullYear(),now.getMonth()-1,1);
  const prevM = prevD.toISOString().slice(0,7);
  const thisM = now.toISOString().slice(0,7);
  const curExp = sumBy(STATE.transactions.filter(t=>monthKey(t.date)===thisM),'expense');
  const prevExp = sumBy(STATE.transactions.filter(t=>monthKey(t.date)===prevM),'expense');
  if(prevExp>0 && curExp>prevExp){
    const delta = ((curExp-prevExp)/prevExp*100);
    if(delta>=10) notifs.push({id:'exp-up',text:`Suas despesas estão ${delta.toFixed(0)}% maiores que no mês anterior.`,date:new Date().toISOString()});
  }
  // recurring due tomorrow
  const tomorrow = new Date(Date.now()+86400000).toISOString().slice(0,10);
  const tmDay = tomorrow.slice(8,10);
  STATE.transactions.filter(t=>t.recurring).forEach(t=>{
    if(t.date.slice(8,10)===tmDay) notifs.push({id:'rec-'+t.id,text:`Existe uma movimentação recorrente prevista para amanhã: ${t.description}.`,date:new Date().toISOString()});
  });
  const manualOnes = STATE.notifications.filter(n=>n.id.startsWith('goal-')||!n.id.includes('-')===false ? true:true);
  STATE.notifications = [...STATE.notifications.filter(n=>n.text.includes('meta de')), ...notifs];
}
function toggleNotifPanel(){
  const slot = document.getElementById('notif-panel-slot');
  if(slot.innerHTML){ slot.innerHTML=''; return; }
  const list = STATE.notifications.slice(0,15);
  slot.innerHTML = `<div class="notif-panel">${list.length? list.map(n=>`<div class="notif-item"><div class="t">${escapeHtml(n.text)}</div><div class="d">${new Date(n.date).toLocaleString('pt-BR')}</div></div>`).join(''):`<div class="notif-item">Sem notificações no momento.</div>`}</div>`;
  setTimeout(()=>{
    document.addEventListener('click',function h(ev){
      if(!ev.target.closest('.notif-panel') && !ev.target.closest('#notif-btn')){ slot.innerHTML=''; document.removeEventListener('click',h); }
    });
  },10);
  document.getElementById('notif-dot').classList.add('hidden');
}
function refreshNotifDot(){
  document.getElementById('notif-dot')?.classList.toggle('hidden', STATE.notifications.length===0);
}

/* ============================================================
   CONFIGURAÇÕES
   ============================================================ */
function pageConfig(){
  const u = STATE.user;
  return `
  <div class="grid grid-2">
    <div class="card">
      <div class="card-head"><h3>Perfil</h3></div>
      <div class="field"><label>Nome</label><input id="cf-name" value="${escapeHtml(u.name)}"></div>
      <div class="field"><label>E-mail</label><input id="cf-email" value="${escapeHtml(u.email)}" disabled style="opacity:.6;"></div>
      ${!u.verified?`<button class="btn btn-ghost btn-sm" onclick="toast('E-mail já verificado.')">Reenviar verificação</button>`:''}
      <div class="field" style="margin-top:14px;"><label>Moeda</label>
        <select id="cf-currency"><option value="BRL" ${u.currency==='BRL'?'selected':''}>Real (R$)</option><option value="USD" ${u.currency==='USD'?'selected':''}>Dólar (US$)</option><option value="EUR" ${u.currency==='EUR'?'selected':''}>Euro (€)</option></select>
      </div>
      <button class="btn btn-primary" style="width:auto;margin-top:6px;" onclick="saveProfile()">Salvar alterações</button>
    </div>
    <div class="card">
      <div class="card-head"><h3>Alterar senha</h3></div>
      <div class="field"><label>Senha atual</label><input id="cf-oldpass" type="password"></div>
      <div class="field"><label>Nova senha</label><input id="cf-newpass" type="password"></div>
      <div class="field"><label>Confirmar nova senha</label><input id="cf-newpass2" type="password"></div>
      <button class="btn btn-primary" style="width:auto;" onclick="changePassword()">Atualizar senha</button>
    </div>
  </div>
  <div class="card section-block">
    <div class="card-head"><h3>💾 Onde seus dados ficam salvos</h3></div>
    <p style="font-size:13px;color:var(--text-dim);line-height:1.7;">
      Este sistema guarda seus dados no armazenamento local do seu próprio navegador. Isso significa que suas informações ficam só neste dispositivo/navegador — não existe um servidor central compartilhando dados entre usuários. Se você limpar os dados do navegador ou acessar de outro aparelho, não verá as mesmas informações.
    </p>
  </div>
  <div class="card section-block">
    <div class="card-head"><h3>📧 Verificação de e-mail — status</h3></div>
    <p style="font-size:13px;color:var(--text-dim);line-height:1.7;">
      Os códigos de verificação e recuperação de senha aparecem na tela em vez de serem enviados por e-mail de verdade, pois este site é apenas front-end (sem servidor/backend próprio).<br><br>
      <b style="color:var(--text);">Para envio real de e-mail</b>, é necessário conectar um provedor (ex: EmailJS, Resend, SendGrid) com credenciais próprias.<br><br>
      Enquanto isso, use o <b style="color:var(--accent);">Acesso administrador</b> (tela de login) para verificar contas manualmente e testar o fluxo completo.
    </p>
  </div>
  <div class="card section-block" style="border-color:rgba(251,122,140,.25);">
    <div class="card-head"><h3 style="color:var(--expense);">Excluir conta</h3></div>
    <p style="font-size:13px;color:var(--text-dim);margin-bottom:14px;">Esta ação apagará permanentemente seus dados financeiros, categorias, metas e orçamentos.</p>
    <button class="btn btn-danger" onclick="confirmDeleteAccount()">Excluir minha conta</button>
  </div>`;
}
async function saveProfile(){
  const name = document.getElementById('cf-name').value.trim();
  const currency = document.getElementById('cf-currency').value;
  if(!name) return toast('Informe um nome.','error');
  STATE.user.name = name; STATE.user.currency = currency;
  await sset('user:'+STATE.user.email, STATE.user);
  renderSidebar();
  toast('Perfil atualizado!');
  renderPage();
}
async function changePassword(){
  const old = document.getElementById('cf-oldpass').value;
  const n1 = document.getElementById('cf-newpass').value;
  const n2 = document.getElementById('cf-newpass2').value;
  const oldHash = await sha256(old);
  if(oldHash !== STATE.user.passwordHash) return toast('Senha atual incorreta.','error');
  if(n1.length<6) return toast('A nova senha deve ter no mínimo 6 caracteres.','error');
  if(n1!==n2) return toast('As senhas não coincidem.','error');
  STATE.user.passwordHash = await sha256(n1);
  await sset('user:'+STATE.user.email, STATE.user);
  toast('Senha atualizada!');
}
function confirmDeleteAccount(){
  document.getElementById('modal-slot').innerHTML = confirmModal('Excluir conta?','Todos os seus dados financeiros serão apagados permanentemente. Esta ação é irreversível.','deleteAccount()');
}
async function deleteAccount(){
  const email = STATE.user.email;
  await sdel('user:'+email); await sdel('categories:'+email); await sdel('transactions:'+email);
  await sdel('budgets:'+email); await sdel('goals:'+email); await sdel('notifications:'+email); await sdel('session_email');
  closeModal();
  toast('Conta excluída.');
  setTimeout(()=>doLogout(),800);
}

/* ============================================================
   INIT
   ============================================================ */
tryAutoLogin();
setInterval(refreshNotifDot,1500);

/* Detect storage availability and warn (non-blocking) */
(async function checkStorageBridge(){
  try{
    if(!hasLocalStorage() && !hasBridge()) throw new Error('no storage available');
  }catch(e){
    persistentStorageOK = false;
    setTimeout(()=>{
      toast('Armazenamento indisponível neste navegador — dados válidos apenas nesta sessão.','error');
    }, 600);
  }
})();
