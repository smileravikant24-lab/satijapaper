/* ============================================================
   SATIJA PAPER × SYSTEM MASTER - Application Logic
   Depends on firebase-init.js (loaded as ES module first).
   ============================================================ */

/* ============ PROCESS DATABASE ============ */
const DB = [
  {cat:"Sales",name:"Order to Delivery FMS",pc:"Ms. Preksha",solver:"Mukesh",exec:"Khushi",links:{fms:1,form:1,videoBCI:1}},
  {cat:"Sales",name:"O2D Direct Dispatch FMS",pc:"Ms. Preksha",solver:"Mr. Mukesh",exec:"Khushi",links:{fms:1}},
  {cat:"Sales",name:"Follow Up Calls",pc:"Ms. Neha",solver:"Neha / Pranav",exec:"Neha",links:{sheet:1}},
  {cat:"Sales",name:"Double A Order Form",pc:"Ms. Preksha",solver:"Mr. Pranav",exec:"Mr. Rishabh",links:{form:1,sheet:1}},
  {cat:"Sales",name:"Next Day Market Plan",pc:"Ms. Neha",solver:"Neha / Pranav",exec:"Rishabh / Pawan",links:{form:1,sheet:1}},
  {cat:"Sales",name:"Next Week Marketing Plan",pc:"Ms. Preksha",solver:"Mr. Pranav/Mr. Mukesh",exec:"Sale's Team",links:{form:1,sheet:1}},
  {cat:"Sales",name:"Customer Visit",pc:"Neha",solver:"Neha / Pranav",exec:"Sonu, Pawan, Rishabh",links:{form:1,sheet:1}},
  {cat:"Sales",name:"DA New Distributor Checklist",pc:"Mr. Mukesh",solver:"Mr. Pranav/Ms. Neha",exec:"Mr. Rishabh",links:{form:1,sheet:1}},
  {cat:"Sales",name:"Enquiry Capture FY 2026-27",pc:"Ms. Preksha",solver:"Mr. Pranav/Mr. Mukesh",exec:"Ms. Neha",links:{form:1,sheet:1}},
  {cat:"Sales",name:"Double A CME Payment FMS FY 2026-27",pc:"Ms. Preksha",solver:"Mr. Mukesh",exec:"Mr. Indresh/Sandeep/Mukesh/Ms. Preksha",links:{fms:1,form:1}},
  {cat:"Sales",name:"CRM Payment FMS",pc:"Ms. Preksha",solver:"Mr. Pranav/Mr. Mukesh",exec:"Ms. Pooja",links:{fms:1}},
  {cat:"Sales",name:"Price List",pc:"Ms. Preksha",solver:"Mr. Pranav",exec:"Mr. Mukesh",links:{sheet:1}},
  {cat:"Sales",name:"Stock Dashboard",pc:"Ms. Preksha",solver:"Ravi",exec:"All Sales",links:{stockDash:1}},
  {cat:"Sales",name:"Mr. Mukesh Debtors List",pc:"Ms. Preksha",solver:"Ravi",exec:"Mr. Mukesh",links:{sheet:1}},
  {cat:"Sales",name:"Mr. Pranav Satija Debtors List",pc:"Ms. Preksha",solver:"Ravi",exec:"Mr. Mukesh",links:{sheet:1}},
  {cat:"Purchase",name:"Purchase FMS",pc:"Ms. Preksha",solver:"Neha / Pranav",exec:"Khushi",links:{fms:1,form:1,video:1,videoBCI:1}},
  {cat:"Purchase",name:"IMS (Inventory System)",pc:"Ms. Neha",solver:"Mukesh / Pranav",exec:"Khushi",links:{form:1,sheet:1,video:1}},
  {cat:"Purchase",name:"WMS",pc:"Ms. Neha",solver:"Mr. Mukesh",exec:"Ms. Preksha/Ms. Khushi",links:{form:1,sheet:1}},
  {cat:"Purchase",name:"Stock Transfer FMS",pc:"Ms. Preksha",solver:"Mr. Mukesh",exec:"Mr. Indresh/Sandeep/Ms. Pooja",links:{fms:1,form:1}},
  {cat:"Management",name:"Ultimate Checklist",pc:"Ms. Preksha",solver:"Neha / Pranav",exec:"Khushi",links:{check:1,video:1,dashEmp:1,dashPC:1}},
  {cat:"Management",name:"Delegation Sheet",pc:"Ms. Neha",solver:"Neha / Pranav",exec:"Neha",links:{form:1,sheet:1,video:1}},
  {cat:"Management",name:"To Do (MIS)",pc:"Ms. Neha",solver:"Khushi / Pranav",exec:"Neha / Khushi",links:{form:1,sheet:1}},
  {cat:"Management",name:"To Do (EA)",pc:"Ms. Neha",solver:"Neha / Pranav",exec:"Neha / Pranav",links:{form:1,sheet:1}},
  {cat:"Management",name:"MIS Score",pc:"Ms. Neha",solver:"Ms. Khushi",exec:"Ms. Neha/Ms. Khushi",links:{sheet:1}},
  {cat:"Management",name:"Dashboard of All FMS",pc:"Ms. Preksha",solver:"Ms. Khushi",exec:"All Team Members",links:{dashEmp:1,dashPC:1}},
  {cat:"Management",name:"FMS OF FMS",pc:"Ms. Preksha",solver:"Neha / Pranav",exec:"Khushi",links:{sheet:1,form:1}},
  {cat:"Management",name:"Home Loan FMS",pc:"Ms. Preksha",solver:"Mr. Mukesh",exec:"Mr. Indresh/Saneeep/Ms. Neha/Ms. Preksha",links:{fms:1,form:1}},
  {cat:"Management",name:"eMail & Password Sheet",pc:"MDO",solver:"Ms. Khushi",exec:"Ms. Khushi",links:{sheet:1}},
  {cat:"Support",name:"Help Ticket",pc:"Ms. Preksha",solver:"Khushi/Ravi",exec:"Ravi",links:{form:1,sheet:1}},
  {cat:"My System",name:"Google Site",pc:"Ms. Preksha",solver:"Khushi/Ravi",exec:"Ravi",links:{form:1,sheet:1}},
  {cat:"HR",name:"Office Chores Form",pc:"Ms. Neha",solver:"Neha / Pranav",exec:"Rashmi",links:{form:1,sheet:1}},
  {cat:"HR",name:"Attendances Sheet",pc:"Neha / Preksha",solver:"Neha / Pranav",exec:"All Staff",links:{form:1,sheet:1,admin:1}},
  {cat:"HR",name:"Sales Meeting Attendances Sheet",pc:"Neha / Preksha",solver:"Neha / Pranav",exec:"All Staff",links:{form:1,sheet:1}},
  {cat:"HR",name:"Courier FMS",pc:"Neha",solver:"Neha / Pranav",exec:"Indresh",links:{sheet:1,form:1}},
  {cat:"Finance",name:"Petrol/Rider Form",pc:"Neha / Mukesh",solver:"Neha / Pranav",exec:"Sonu, Pawan...",links:{form:1,sheet:1}},
  {cat:"Finance",name:"Cheque Payment",pc:"Neha / Mukesh",solver:"Mukesh",exec:"Indresh",links:{sheet:1,form:1}},
  {cat:"Finance",name:"Company Payment",pc:"Ms. Preksha",solver:"Mr. Pranav ",exec:"Mr. Sandeep/Ms. Neha",links:{fms:1,form:1}},
  {cat:"Finance",name:"GP Sheet",pc:"Ms. Neha",solver:"Mr. Pranav/Mr. Mukesh",exec:"Ms. Khushi",links:{sheet:1,gpDash:1}},
  {cat:"Finance",name:"Sales Marketing Daily Expense",pc:"Ms. Preksha",solver:"Ms. Neha",exec:"Sale's Team",links:{form:1,sheet:1}},
  {cat:"Family",name:"Satija Family Documents",pc:"Ms. Neha",solver:"Ms. Mukesh",exec:"Ms. Khushi",links:{folder:1}}
];

/* ============ GLOBAL STATE ============ */
let curUser     = null;
let curCat      = 'All';
let cachedUsers = [];
let toastTimer;

const FUNCTION_URL = 'https://asia-south1-sp-dashboard-1e9c8.cloudfunctions.net/getProcessUrl';

/* ============ HELPERS ============ */
const $ = id => document.getElementById(id);

function emailToId(email){ return email.toLowerCase().replace(/[^a-z0-9]/g,'_'); }

function showToast(msg, type='info'){
  const t = $('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ t.className='toast'; }, 3200);
}

/* ============ LOGIN UI HELPERS ============ */
function showLoginError(m){
  $('loginErrorMsg').textContent = m;
  $('loginError').classList.add('show');
  $('loginSuccess').classList.remove('show');
}
function showLoginSuccess(m){
  $('loginSuccessMsg').textContent = m;
  $('loginSuccess').classList.add('show');
  $('loginError').classList.remove('show');
}
function clearLoginMessages(){
  $('loginError').classList.remove('show');
  $('loginSuccess').classList.remove('show');
}
function setLoginLoading(on){
  const b = $('loginBtn');
  b.disabled = on;
  b.innerHTML = on
    ? '<i class="fas fa-circle-notch fa-spin"></i> Signing in...'
    : 'Sign In <i class="fas fa-arrow-right"></i>';
}
function togglePwd(){
  const i  = $('loginPass'), ic = $('pwdEye');
  if (i.type === 'password'){ i.type = 'text';     ic.className = 'fas fa-eye-slash'; }
  else                      { i.type = 'password'; ic.className = 'fas fa-eye'; }
}

/* ============ AUTH ACTIONS ============ */
async function handleLogin(){
  clearLoginMessages();
  const e = $('loginUser').value.trim();
  const p = $('loginPass').value;
  if (!e || !p){ showLoginError("Enter email and password."); return; }
  setLoginLoading(true);
  try {
    await window.fbFns.signIn(window.fbAuth, e, p);
  } catch(err){
    setLoginLoading(false);
    showLoginError(err.message || 'Login failed.');
  }
}

async function forgotPass(){
  const e = $('loginUser').value.trim();
  if (!e){ showLoginError("Enter your email first."); return; }
  try {
    await window.fbFns.resetPass(window.fbAuth, e);
    showLoginSuccess("Reset email sent! Check your inbox.");
  } catch(err){
    showLoginError(err.message);
  }
}

async function handleLogout(){
  await window.fbFns.signOut(window.fbAuth);
  showToast('Signed out.', 'info');
}

/* ============ ACCESS-CONTROL LOGIC ============ */
function hasDeptAccess(u, cat){
  if (!u) return false;
  if (u.role === 'Admin') return true;
  if (cat === 'Family') return false;
  if (u.deptAccess.includes('All')) return true;
  if (cat === 'Support' || cat === 'My System') return true;
  return u.deptAccess.includes(cat);
}

function canAccessProc(u, item){
  if (!u) return false;
  if (u.role === 'Admin') return true;
  if (u.processAccess && u.processAccess.length > 0) return u.processAccess.includes(item.name);
  return hasDeptAccess(u, item.cat);
}

function canAccessLink(u, procName, linkType){
  if (!u) return false;
  if (u.role === 'Admin') return true;
  if (!canAccessProc(u, {name: procName, cat: ''})) return false;
  if (u.linkAccess && u.linkAccess[procName] && u.linkAccess[procName].length > 0)
    return u.linkAccess[procName].includes(linkType);
  return true;
}

/* ============ SIDEBAR COUNTS ============ */
function updateCounts(){
  const isAdmin = curUser && curUser.role === 'Admin';
  const c = {All:0,Sales:0,Purchase:0,Management:0,HR:0,Finance:0,Support:0,'My System':0,Family:0};
  DB.forEach(d=>{
    if (canAccessProc(curUser, d)){
      c.All++;
      if (c[d.cat] !== undefined) c[d.cat]++;
    }
  });
  const tabs = [
    {cat:'All',         nav:'navAll',         cnt:'cntAll'},
    {cat:'Sales',       nav:'navSales',       cnt:'cntSales'},
    {cat:'Purchase',    nav:'navPurchase',    cnt:'cntPurchase'},
    {cat:'Management',  nav:'navManagement',  cnt:'cntManagement'},
    {cat:'HR',          nav:'navHR',          cnt:'cntHR'},
    {cat:'Finance',     nav:'navFinance',     cnt:'cntFinance'},
    {cat:'Support',     nav:'navSupport',     cnt:'cntSupport'},
    {cat:'My System',   nav:'navMy',          cnt:'cntMy'},
    {cat:'Family',      nav:'navFamily',      cnt:'cntFamily'}
  ];
  tabs.forEach(t=>{
    const count = c[t.cat] ?? 0;
    const btn   = $(t.nav);
    if (!btn) return;
    if ($(t.cnt)) $(t.cnt).textContent = count;

    let visible;
    if (t.cat === 'All'){
      const ad = ['Sales','Purchase','Management','HR','Finance','Support','My System']
                 .filter(cat => (c[cat] ?? 0) > 0);
      visible = isAdmin || ad.length >= 2;
    } else if (t.cat === 'Family'){
      visible = count > 0;
    } else {
      visible = isAdmin || count > 0;
    }
    btn.style.display = visible ? '' : 'none';
  });
}

/* ============ SECURE OPEN (Cloud Function) ============ */
async function secureOpen(procName, linkType){
  const item = DB.find(d => d.name === procName);
  if (!item){ showToast('Process not found.', 'err'); return; }
  if (!canAccessProc(curUser, item)){ showToast('Access denied.', 'err'); return; }
  if (!canAccessLink(curUser, procName, linkType)){ showToast('No access to this link.', 'err'); return; }
  showToast('Opening...', 'info');
  try {
    const fbUser = window.fbAuth.currentUser;
    if (!fbUser){ showToast('Please login again.', 'err'); return; }
    const idToken = await fbUser.getIdToken(true);
    const resp = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + idToken
      },
      body: JSON.stringify({procName, linkType})
    });
    const data = await resp.json();
    if (resp.ok && data.url){ window.open(data.url, '_blank', 'noopener'); }
    else                    { showToast(data.error || 'Link not available.', 'err'); }
  } catch(err){
    showToast('Network error.', 'err');
  }
}

/* ============ APP ENTRY / EXIT ============ */
function enterApp(user){
  curUser = user;
  $('loginOverlay').classList.add('hidden');
  $('appContainer').classList.add('visible');
  $('sAvatar').textContent = (user.name || 'U').charAt(0).toUpperCase();
  $('sName').textContent   = user.name;
  $('sRole').textContent   = user.role;
  const isA = user.role === 'Admin';
  $('adminNavLabel').style.display = isA ? '' : 'none';
  $('adminNavBtn').style.display   = isA ? '' : 'none';
  updateCounts();
  runFilter();
}

function showLoginScreen(){
  curUser = null;
  $('appContainer').classList.remove('visible');
  $('loginOverlay').classList.remove('hidden');
  $('loginForm').style.display    = '';
  $('loadingState').style.display = 'none';
  $('loginUser').value = '';
  $('loginPass').value = '';
  setLoginLoading(false);
  clearLoginMessages();
}

/* ============ CARD RENDERING ============ */
function renderCards(data){
  const b = $('cardBox');
  b.innerHTML = '';
  const accessible = data.filter(it => canAccessProc(curUser, it));
  if (!accessible.length){
    b.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>No processes found.</p></div>';
    return;
  }

  accessible.forEach((it, i)=>{
    const isAdmin = curUser && curUser.role === 'Admin';
    const cc = it.cat === 'My System' ? 'My' : it.cat;

    const buildBtn = (hasUrl, linkType, cls, ico, lbl, adminOnly=false)=>{
      if (!hasUrl) return '';
      if (adminOnly && !isAdmin) return '';
      if (!canAccessLink(curUser, it.name, linkType)) return '';
      const pn = it.name.replace(/'/g, "\\'");
      return `<button onclick="secureOpen('${pn}','${linkType}')" class="btn ${cls}"><i class="${ico}"></i>${lbl}</button>`;
    };

    let btns = '';
    btns += buildBtn(!!it.links.fms,       'fms',       'btn-fms',    'fas fa-table-cells',     'FMS');
    btns += buildBtn(!!it.links.form,      'form',      'btn-form',   'fab fa-google-drive',    'Form');
    if (it.name === 'Help Ticket'){
      btns += buildBtn(!!it.links.sheet && isAdmin, 'sheet', 'btn-sheet', 'fas fa-file-spreadsheet', 'All Tickets');
    } else {
      btns += buildBtn(!!it.links.sheet,   'sheet',     'btn-sheet',  'fas fa-file-spreadsheet','Sheet');
    }
    btns += buildBtn(!!it.links.check,     'check',     'btn-check',  'fas fa-square-check',    'Checklist');
    btns += buildBtn(!!it.links.video,     'video',     'btn-video',  'fas fa-circle-play',     'Training');
    btns += buildBtn(!!it.links.videoBCI,  'videoBCI',  'btn-video',  'fas fa-circle-play',     'Training (BCI)');
    btns += buildBtn(!!it.links.dashEmp,   'dashEmp',   'btn-dash',   'fas fa-chart-pie',       'Emp Dashboard');
    btns += buildBtn(!!it.links.dashPC,    'dashPC',    'btn-dash',   'fas fa-chart-line',      'PC Dashboard');
    btns += buildBtn(!!it.links.admin,     'admin',     'btn-admin',  'fas fa-user-gear',       'Admin Panel');
    btns += buildBtn(!!it.links.gpDash,    'gpDash',    'btn-gp',     'fas fa-chart-column',    'GP Dashboard');
    btns += buildBtn(!!it.links.stockDash, 'stockDash', 'btn-stock',  'fas fa-boxes-stacking',  'Stock Dash');
    btns += buildBtn(!!it.links.folder,    'folder',    'btn-folder', 'fas fa-folder-open',     'View Folder');
    if (!btns) btns = '<div style="grid-column:span 2;text-align:center;color:#ccc;font-size:11px;padding:6px">No links configured</div>';

    const mkCell = (cls, icon, label, val)=>{
      if (!val || val === '-')
        return `<div class="role-cell"><div class="role-key">${label}</div><div class="role-val" style="opacity:.35;font-style:italic;font-size:10.5px"><span>—</span></div></div>`;
      return `<div class="role-cell"><div class="role-key">${label}</div><div class="role-val ${cls}"><i class="${icon}"></i><span title="${val}">${val}</span></div></div>`;
    };

    b.innerHTML += `<div class="card cat-${cc}" style="animation-delay:${i*.028}s">
      <div class="card-inner">
        <span class="card-tag tag-${cc}">${it.cat}</span>
        <div class="card-title">${it.name}</div>
        <div class="roles-grid">
          ${mkCell('rv-pc','fas fa-shield-halved','PC / EA',it.pc)}
          ${mkCell('rv-sv','fas fa-wrench','Solver',it.solver)}
          ${mkCell('rv-ex','fas fa-user-tie','Executive',it.exec)}
        </div>
        <div class="card-divider"></div>
        <div class="actions">${btns}</div>
      </div>
    </div>`;
  });
}

/* ============ NAVIGATION / FILTERING ============ */
function setActive(el){
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
}

function filterCat(cat, el){
  curCat = cat;
  setActive(el);
  $('pageHeader').innerText = cat === 'All' ? 'All Processes' : cat;
  $('cardBox').style.display       = '';
  $('adminPanel').classList.remove('visible');
  $('searchWrap').style.display    = '';
  runFilter();
}

function runFilter(){
  const raw   = $('searchInput').value.toLowerCase();
  const terms = raw.split(/\s+/).filter(Boolean);
  const filtered = DB.filter(it=>{
    if (!canAccessProc(curUser, it)) return false;
    const mc  = curCat === 'All' || it.cat === curCat;
    const txt = `${it.name} ${it.pc} ${it.solver} ${it.exec} ${it.cat}`.toLowerCase();
    return mc && terms.every(t => txt.includes(t));
  });
  renderCards(filtered);
}

/* ============ ADMIN PANEL ============ */
async function showAdmin(el){
  if (!curUser || curUser.role !== 'Admin') return;
  setActive(el);
  $('pageHeader').innerText = 'User Management';
  $('cardBox').style.display       = 'none';
  $('adminPanel').classList.add('visible');
  $('searchWrap').style.display    = 'none';
  await loadUsers();
}

async function loadUsers(){
  const tb = $('tblBody');
  tb.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-3)"><i class="fas fa-circle-notch fa-spin"></i> Loading...</td></tr>';
  try {
    const snap = await window.fbFns.getDocs(window.fbFns.collection(window.fbDb, 'users'));
    cachedUsers = [];
    snap.forEach(d => { cachedUsers.push({id: d.id, ...d.data()}); });
    cachedUsers.sort((a, b) => a.name.localeCompare(b.name));
    renderTable();
  } catch(e){
    tb.innerHTML = `<tr><td colspan="6" style="color:var(--danger);padding:16px;text-align:center">Failed: ${e.message}</td></tr>`;
  }
}

function renderTable(){
  const tb = $('tblBody');
  tb.innerHTML = '';
  if (!cachedUsers.length){
    tb.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-3)">No users found.</td></tr>';
    return;
  }
  cachedUsers.forEach(u=>{
    const dp = (u.deptAccess || []).map(d => `<span class="ap ap-${d}">${d==='Management'?'MIS':d}</span>`).join('');
    let procHtml = '';
    if (u.role === 'Admin'){
      procHtml = '<span style="font-size:10px;color:var(--text-3)">Full access</span>';
    } else if (u.processAccess && u.processAccess.length){
      procHtml = u.processAccess.map(p=>{
        const la = u.linkAccess && u.linkAccess[p];
        const li = la && la.length ? ` <span style="font-size:9px;color:#0369a1;font-weight:600">[${la.join(',')}]</span>` : '';
        return `<span class="proc-badge">${p}${li}</span>`;
      }).join('');
    } else {
      procHtml = '<span style="font-size:10px;color:var(--text-3)">All in dept</span>';
    }
    const isSelf = u.id === curUser.id;
    tb.innerHTML += `<tr>
      <td><strong>${u.email || '—'}</strong></td>
      <td>${u.name || '—'}</td>
      <td><span class="role-pill ${u.role.toLowerCase().replace(' ','.')}">${u.role}</span></td>
      <td><div class="access-pills">${dp || '<span style="font-size:10px;color:var(--text-3)">None</span>'}</div></td>
      <td style="max-width:220px">${procHtml}</td>
      <td style="white-space:nowrap">
        <button class="tbl-act edit" onclick="editUser('${u.id}')"><i class="fas fa-pen"></i></button>
        ${!isSelf ? `<button class="tbl-act delete" onclick="deleteUserAct('${u.id}','${u.name||u.email}')"><i class="fas fa-trash-can"></i></button>` : ''}
      </td></tr>`;
  });
}

/* ============ USER MODAL ============ */
function openModal(uid){
  $('editUserId').value = '';
  $('mName').value      = '';
  $('mUser').value      = '';
  $('mRole').value      = 'Team Member';
  $('modalTitle').textContent = 'Add User Profile';
  document.querySelectorAll('#deptChks .chk-pill').forEach(p=>{
    p.classList.remove('checked');
    p.querySelector('input').checked = false;
  });
  if (uid){
    const u = cachedUsers.find(x => x.id === uid);
    if (u){
      $('editUserId').value = u.id;
      $('mName').value      = u.name;
      $('mUser').value      = u.email;
      $('mRole').value      = u.role;
      $('modalTitle').textContent = 'Edit User Profile';
      document.querySelectorAll('#deptChks .chk-pill').forEach(p=>{
        if ((u.deptAccess || []).includes(p.dataset.val)){
          p.classList.add('checked');
          p.querySelector('input').checked = true;
        }
      });
      const la = u.linkAccess || {};
      la['__procs__'] = u.processAccess || [];
      buildProcList(la);
    } else {
      buildProcList();
    }
  } else {
    buildProcList();
  }
  onRoleChange();
  $('userModal').classList.add('show');
}

function editUser(id){ openModal(id); }
function closeModal(){ $('userModal').classList.remove('show'); }
function onRoleChange(){
  $('accessSection').style.display = $('mRole').value === 'Admin' ? 'none' : '';
}

// Dept pill clicks
document.querySelectorAll('#deptChks .chk-pill').forEach(pill=>{
  pill.addEventListener('click', function(e){
    e.preventDefault();
    const cb = this.querySelector('input');
    const nv = !cb.checked;
    cb.checked = nv;
    this.classList.toggle('checked', nv);
    if (this.dataset.val === 'All' && nv){
      document.querySelectorAll('#deptChks .chk-pill').forEach(p=>{
        if (p.dataset.val !== 'All'){
          p.classList.remove('checked');
          p.querySelector('input').checked = false;
        }
      });
    } else if (this.dataset.val !== 'All' && nv){
      const ap = document.querySelector('#deptChks .chk-pill[data-val="All"]');
      if (ap){
        ap.classList.remove('checked');
        ap.querySelector('input').checked = false;
      }
    }
    updateAccessModeNote();
  });
});

function updateAccessModeNote(){
  $('accessModeNote').style.display =
    document.querySelectorAll('#procListContainer .proc-master-cb:checked').length > 0 ? '' : 'none';
}

/* ============ LINK META + PROC LIST ============ */
const LINK_META = {
  fms:       {label:'FMS',           icon:'fas fa-table-cells',      cls:'btn-fms'},
  form:      {label:'Form',          icon:'fab fa-google-drive',     cls:'btn-form'},
  sheet:     {label:'Sheet',         icon:'fas fa-file-spreadsheet', cls:'btn-sheet'},
  check:     {label:'Checklist',     icon:'fas fa-square-check',     cls:'btn-check'},
  video:     {label:'Training',      icon:'fas fa-circle-play',      cls:'btn-video'},
  videoBCI:  {label:'Training(BCI)', icon:'fas fa-circle-play',      cls:'btn-video'},
  dashEmp:   {label:'Emp Dashboard', icon:'fas fa-chart-pie',        cls:'btn-dash'},
  dashPC:    {label:'PC Dashboard',  icon:'fas fa-chart-line',       cls:'btn-dash'},
  admin:     {label:'Admin Panel',   icon:'fas fa-user-gear',        cls:'btn-admin'},
  gpDash:    {label:'GP Dashboard',  icon:'fas fa-chart-column',     cls:'btn-gp'},
  stockDash: {label:'Stock Dashboard',icon:'fas fa-boxes-stacking',  cls:'btn-stock'},
  folder:    {label:'View Folder',   icon:'fas fa-folder-open',      cls:'btn-folder'}
};

function getAvailableLinks(it){
  return Object.keys(LINK_META).filter(k => !!it.links[k]);
}

function buildProcList(existingLinkAccess){
  existingLinkAccess = existingLinkAccess || {};
  const container = $('procListContainer');
  container.innerHTML = '';
  const cats = [...new Set(DB.map(d => d.cat))];
  cats.forEach(cat=>{
    const items = DB.filter(d => d.cat === cat);
    const grpDiv = document.createElement('div');
    grpDiv.className = 'proc-group';
    grpDiv.innerHTML = `<div class="proc-group-label" style="font-size:10px;font-weight:800;text-transform:uppercase;color:var(--text-3);margin-bottom:6px;">${cat}</div>`;
    items.forEach(it=>{
      const availLinks = getAvailableLinks(it);
      const procRow = document.createElement('div');
      procRow.className = 'proc-row';
      const isChecked = existingLinkAccess['__procs__'] && existingLinkAccess['__procs__'].includes(it.name);

      const procHeader = document.createElement('div');
      procHeader.className = 'proc-row-header';
      const procCb = document.createElement('input');
      procCb.type = 'checkbox';
      procCb.className = 'proc-master-cb';
      procCb.value = it.name;
      if (isChecked) procCb.checked = true;

      procHeader.innerHTML = `<span class="proc-name">${it.name}</span>`;
      procHeader.prepend(procCb);
      procRow.appendChild(procHeader);

      if (availLinks.length > 0){
        const linkRow = document.createElement('div');
        linkRow.className = 'proc-link-row';
        linkRow.style.display = isChecked ? 'flex' : 'none';
        const existingLinks = existingLinkAccess[it.name] || [];
        availLinks.forEach(lk=>{
          const m = LINK_META[lk];
          const pill = document.createElement('label');
          pill.className = `link-pill ${m.cls}`;
          const cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.dataset.proc = it.name;
          cb.dataset.link = lk;
          cb.style.display = 'none';
          if (!existingLinks.length || existingLinks.includes(lk)){
            cb.checked = true;
            pill.classList.add('link-checked');
          }
          pill.innerHTML = `<i class="${m.icon}"></i> ${m.label}`;
          pill.prepend(cb);
          pill.addEventListener('click', e=>{
            e.preventDefault();
            cb.checked = !cb.checked;
            pill.classList.toggle('link-checked', cb.checked);
          });
          linkRow.appendChild(pill);
        });
        procRow.appendChild(linkRow);
        procCb.addEventListener('change', ()=>{
          linkRow.style.display = procCb.checked ? 'flex' : 'none';
          if (procCb.checked){
            linkRow.querySelectorAll('label.link-pill').forEach(p=>{
              p.querySelector('input').checked = true;
              p.classList.add('link-checked');
            });
          }
          updateAccessModeNote();
        });
      } else {
        procCb.addEventListener('change', updateAccessModeNote);
      }
      grpDiv.appendChild(procRow);
    });
    container.appendChild(grpDiv);
  });
  updateAccessModeNote();
}

function selectAllProcs(val){
  document.querySelectorAll('#procListContainer .proc-master-cb').forEach(cb=>{
    cb.checked = val;
    const lr = cb.closest('.proc-row').querySelector('.proc-link-row');
    if (lr){
      lr.style.display = val ? 'flex' : 'none';
      if (val){
        lr.querySelectorAll('label.link-pill').forEach(p=>{
          p.querySelector('input').checked = true;
          p.classList.add('link-checked');
        });
      }
    }
  });
  updateAccessModeNote();
}

/* ============ SAVE / DELETE USER ============ */
async function saveUser(){
  const id    = $('editUserId').value;
  const name  = $('mName').value.trim();
  const email = $('mUser').value.trim().toLowerCase();
  const role  = $('mRole').value;
  if (!name || !email){ showToast('Fill in name and email.', 'err'); return; }

  let deptAccess = [], processAccess = [], linkAccess = {};
  if (role === 'Admin'){
    deptAccess = ['All'];
  } else {
    document.querySelectorAll('#deptChks .chk-pill.checked')
            .forEach(p => deptAccess.push(p.dataset.val));
    document.querySelectorAll('#procListContainer .proc-master-cb:checked').forEach(cb=>{
      const pName = cb.value;
      processAccess.push(pName);
      const lr = cb.closest('.proc-row').querySelector('.proc-link-row');
      if (lr){
        const cl = [];
        lr.querySelectorAll('input[data-link]:checked').forEach(lcb => cl.push(lcb.dataset.link));
        const all = lr.querySelectorAll('input[data-link]').length;
        if (cl.length > 0 && cl.length < all) linkAccess[pName] = cl;
      }
    });
  }

  const saveBtn = document.querySelector('.modal-foot .mbtn.pri');
  const orig = saveBtn.innerHTML;
  saveBtn.innerHTML = 'Saving...';
  saveBtn.disabled = true;
  try {
    const docId = id || emailToId(email);
    await window.fbFns.setDoc(
      window.fbFns.doc(window.fbDb, 'users', docId),
      {name, email, role, deptAccess, processAccess, linkAccess},
      {merge: true}
    );
    closeModal();
    await loadUsers();
    showToast('User saved', 'ok');
  } catch(e){
    showToast('Save failed: ' + e.message, 'err');
  } finally {
    saveBtn.innerHTML = orig;
    saveBtn.disabled = false;
  }
}

async function deleteUserAct(id, name){
  if (!confirm(`Delete profile for "${name}"?`)) return;
  try {
    await window.fbFns.deleteDoc(window.fbFns.doc(window.fbDb, 'users', id));
    await loadUsers();
    showToast('Deleted', 'ok');
  } catch(e){
    showToast('Delete failed', 'err');
  }
}

/* ============ FIREBASE READY / AUTH STATE ============ */
window.addEventListener('firebaseReady', ()=>{
  $('loginForm').style.display    = 'none';
  $('loadingState').style.display = '';
  window.fbFns.onAuth(window.fbAuth, async fbUser=>{
    if (fbUser){
      try {
        const emailId = emailToId(fbUser.email);
        const ref     = window.fbFns.doc(window.fbDb, 'users', emailId);
        const snap    = await window.fbFns.getDoc(ref);
        let profile;
        if (snap.exists()){
          const d = snap.data();
          if (!d.uid){
            try { await window.fbFns.setDoc(ref, {uid: fbUser.uid}, {merge: true}); } catch(e){}
          }
          profile = {
            id:            emailId,
            uid:           fbUser.uid,
            email:         fbUser.email,
            name:          d.name          || fbUser.email.split('@')[0],
            role:          d.role          || 'Team Member',
            deptAccess:    Array.isArray(d.deptAccess)    ? d.deptAccess    : [],
            processAccess: Array.isArray(d.processAccess) ? d.processAccess : [],
            linkAccess:    (d.linkAccess && typeof d.linkAccess === 'object') ? d.linkAccess : {}
          };
        } else {
          const isAdmin = fbUser.email.toLowerCase() === "mis@satijapaper.com";
          profile = {
            id:            emailId,
            email:         fbUser.email.toLowerCase(),
            uid:           fbUser.uid,
            name:          fbUser.email.split('@')[0],
            role:          isAdmin ? 'Admin' : 'Team Member',
            deptAccess:    isAdmin ? ['All'] : [],
            processAccess: []
          };
          await window.fbFns.setDoc(ref, profile);
        }
        enterApp(profile);
      } catch(e){
        showLoginScreen();
      }
    } else {
      showLoginScreen();
    }
  });
});

/* ============ EXPORT TO GLOBAL (for inline onclick handlers) ============ */
window.handleLogin    = handleLogin;
window.handleLogout   = handleLogout;
window.forgotPass     = forgotPass;
window.togglePwd      = togglePwd;
window.filterCat      = filterCat;
window.runFilter      = runFilter;
window.secureOpen     = secureOpen;
window.showAdmin      = showAdmin;
window.openModal      = openModal;
window.closeModal     = closeModal;
window.editUser       = editUser;
window.saveUser       = saveUser;
window.deleteUserAct  = deleteUserAct;
window.onRoleChange   = onRoleChange;
window.selectAllProcs = selectAllProcs;
