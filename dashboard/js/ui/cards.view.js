import { $, escapeHtml, showToast } from './dom.js';
import { state }                    from '../state.js';
import { DB, LINK_META }             from '../data.js?v=20261117_fix1';
import { canAccessProc, canAccessLink } from './access.js';
import { resolveProcessUrl }        from '../services/process.service.js';
import { fetchGodownList, getGodownList } from '../services/godown.service.js';

const _G = {
  SHEETS: 'https://www.gstatic.com/images/branding/product/1x/sheets_48dp.png',
  FORMS:  'https://www.gstatic.com/images/branding/product/1x/forms_48dp.png',
  GAS:    'https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png',
  DRIVE:  'https://www.gstatic.com/images/branding/product/1x/drive_48dp.png',
  LOOKER: 'https://www.gstatic.com/images/branding/product/1x/looker_studio_48dp.png',
};

const DISPLAY_FORM_NAMES = ['Double A Corporate Customer', 'Double A Display Links'];

const BUTTON_DEFS = [
  { key: 'fms',               cls: 'btn-fms',    icon: _G.SHEETS,              label: 'FMS' },
  { key: 'form',              cls: 'btn-form',   icon: _G.FORMS,               label: it => DISPLAY_FORM_NAMES.includes(it.name) ? 'Display Form' : 'Form' },
  { key: 'sheet',             cls: 'btn-sheet',  icon: _G.SHEETS,              label: it => it.name === 'Help Ticket' ? 'All Tickets' : it.name === 'Personal Documents' ? 'Policy Details' : it.name === 'Dashboard of All FMS' ? 'PC Sheet' : 'Sheet', adminOnly: it => it.name === 'Help Ticket' },
  { key: 'check',             cls: 'btn-check',  icon: _G.SHEETS,              label: 'Checklist' },
  { key: 'video',             cls: 'btn-video',  icon: 'fab fa-youtube',       label: 'Training' },
  { key: 'videoBCI',          cls: 'btn-video',  icon: 'fab fa-youtube',       label: 'Training (BCI)' },
  { key: 'videoAI',           cls: 'btn-video',  icon: _G.DRIVE,               label: 'Training Video AI' },
  { key: 'dashEmp',           cls: 'btn-dash',   icon: 'fas fa-gauge-high',    label: 'Emp Dashboard' },
  { key: 'dashPC',            cls: 'btn-dash',   icon: 'fas fa-gauge-high',    label: 'PC Dashboard' },
  { key: 'gasForm',           cls: 'btn-gas',    icon: _G.GAS,                 label: 'Form' },
  { key: 'admin',             cls: 'btn-admin',  icon: _G.GAS,                 label: 'Admin Panel' },
  { key: 'gpDash',            cls: 'btn-gp',     icon: _G.GAS,                 label: 'GP Dashboard' },
  { key: 'stockDash',         cls: 'btn-stock',  icon: 'fas fa-gauge',         label: 'Dashboard' },
  { key: 'dash',              cls: 'btn-dash',   icon: 'fas fa-chart-line',    label: 'Dashboard' },
  { key: 'folder',            cls: 'btn-folder', icon: _G.DRIVE,               label: 'View Folder' },
  { key: 'calc',              cls: 'btn-dash',   icon: 'fas fa-calculator',    label: 'Profit Calculator' },
  { key: 'terms',             cls: 'btn-form',   icon: _G.DRIVE,               label: 'T&amp;C' },
  { key: 'drive',             cls: 'btn-form',   icon: _G.DRIVE,               label: 'Drive' },
  { key: 'guidelineForm',     cls: 'btn-form',   icon: _G.DRIVE,               label: it => it.name === 'Double A Retail Customer (Mr. Rishabh)' ? 'Marketing Guideline' : 'Guideline' },
  { key: 'followup',          cls: 'btn-form',   icon: 'fas fa-paper-plane',   label: 'D- Follow up' },
  { key: 'incentive',         cls: 'btn-dash',   icon: 'fas fa-trophy',        label: 'Incentive Portal' },
  { key: 'DAppointment',      cls: 'btn-form',   icon: 'fas fa-calendar-check',label: 'Dist Appointment' },
  { key: 'disPurchase',       cls: 'btn-form',   icon: 'fas fa-cart-shopping', label: 'Dist Purchase' },
  { key: 'DealerAppointment', cls: 'btn-form',   icon: 'fas fa-calendar-check',label: 'Dealer Appointment' },
  { key: 'dealerDisplay',     cls: 'btn-dash',   icon: 'fas fa-store',         label: 'Dealer (Ind) Display' },
  { key: 'sellout',           cls: 'btn-dash',   icon: 'fas fa-chart-line',    label: 'Sellout' },
  { key: 'dsr',               cls: 'btn-sheet',  icon: 'fas fa-clipboard-list',label: 'DSR' },
  { key: 'stockdash',         cls: 'btn-sheet',  icon: 'fas fa-gauge',         label: 'Our Dist Stock' },
  { key: 'orderFormPdf',      cls: 'btn-form',   icon: 'fas fa-file-pdf',      label: 'PDF' },
  { key: 'orderFormDoc',      cls: 'btn-form',   icon: 'fas fa-file-word',     label: 'Word File' },
  { key: 'truckOrderFormPdf', cls: 'btn-form',   icon: 'fas fa-file-pdf',      label: 'PDF' },
  { key: 'truckOrderFormDoc', cls: 'btn-form',   icon: 'fas fa-file-word',     label: 'Word File' },
  { key: 'daDisplayFms',      cls: 'btn-fms',    icon: 'fas fa-table-cells',   label: 'FMS' },
  { key: 'daDisplayDash',     cls: 'btn-dash',   icon: 'fas fa-chart-line',    label: 'Dashboard' },
  { key: 'o2dManager',        cls: 'btn-dash',   icon: 'fas fa-truck-fast',    label: 'Manager' },
  { key: 'o2dPooja',          cls: 'btn-dash',   icon: 'fas fa-truck-fast',    label: 'Pooja' },
  { key: 'o2dPawan',          cls: 'btn-dash',   icon: 'fas fa-truck-fast',    label: 'Pawan' },
  { key: 'o2dSonu',           cls: 'btn-dash',   icon: 'fas fa-truck-fast',    label: 'Sonu' },
  { key: 'salary',            cls: 'btn-dash',   icon: 'fas fa-money-check-dollar', label: 'Salary System' },
  { key: 'aiqa',              cls: 'btn-aiqa',   icon: 'fas fa-robot',         label: 'AI Q&amp;A' },
];

/**
 * Return the ordered list of accessible action buttons for a DB process item.
 * Shared by both dashboard cards and the search command palette.
 */
export function getCardActions(item) {
  const isAdmin = state.curUser?.role === 'Admin';
  const links = item?.links || {};
  const actions = [];
  const seen = new Set();

  const pushLinkAction = (def) => {
    const key = def.key;
    seen.add(key);
    if (!links[key]) return;
    const isAdminOnly = typeof def.adminOnly === 'function' ? def.adminOnly(item) : !!def.adminOnly;
    if (isAdminOnly && !isAdmin) return;
    if (!canAccessLink(state.curUser, item.name, key)) return;
    const label = typeof def.label === 'function' ? def.label(item) : def.label;
    actions.push({ type: 'link', linkType: key, cls: def.cls, icon: def.icon, label });
  };

  for (const def of BUTTON_DEFS) {
    if (def.key === 'sheet' && item.name === 'Dashboard of All FMS') continue;
    pushLinkAction(def);
    if (def.key === 'sheet' && item.name === 'Personal Documents') {
      const hasBankAccess = isAdmin
        || state.curUser?.deptAccess?.includes('All')
        || state.curUser?.deptAccess?.includes('Bank Details');
      if (hasBankAccess) {
        actions.push({
          type: 'custom',
          cls: 'btn-dash',
          icon: 'fas fa-university',
          label: 'Personal Accounts',
          actionId: 'personalAccounts'
        });
      }
    }
    if (def.key === 'dashPC' && item.name === 'Dashboard of All FMS') {
      const sheetDef = BUTTON_DEFS.find(d => d.key === 'sheet');
      if (sheetDef) pushLinkAction(sheetDef);
    }
  }

  for (const key of Object.keys(links)) {
    if (seen.has(key) || !links[key]) continue;
    if (!canAccessLink(state.curUser, item.name, key)) continue;
    const meta = LINK_META[key];
    actions.push({
      type: 'link',
      linkType: key,
      cls: meta?.cls || 'btn-dash',
      icon: meta?.icon || 'fas fa-arrow-up-right-from-square',
      label: escapeHtml(meta?.label || key)
    });
  }

  return actions;
}

export function getPrimaryAction(item) {
  const actions = getCardActions(item);
  if (!actions.length) return null;
  for (const preferred of ['fms', 'form', 'sheet', 'dash', 'daDisplayDash', 'stockDash', 'check']) {
    const match = actions.find(a => a.linkType === preferred);
    if (match) return match;
  }
  return actions[0];
}
export async function secureOpen(procName, linkType){
  const item = DB.find(d => d.name === procName);
  if (!item){                               showToast('Process not found.',  'err'); return; }
  if (!canAccessProc(state.curUser, item)){ showToast('Access denied.',      'err'); return; }
  if (!canAccessLink(state.curUser, procName, linkType)){
    showToast('No access to this link.', 'err'); return;
  }


  if (item.urls?.[linkType]) {
    const u = typeof item.urls[linkType] === 'string' ? item.urls[linkType].trim() : '';
    if (u) { window.open(u, '_blank', 'noopener'); return; }
  }
  if (item.url) {
    const u = typeof item.url === 'string' ? item.url.trim() : '';
    if (u) { window.open(u, '_blank', 'noopener'); return; }
  }


  const directUrl = LINK_META[linkType]?.url;
  if (directUrl) { window.open(directUrl, '_blank', 'noopener'); return; }

  showToast('Opening...', 'info');
  const result = await resolveProcessUrl(procName, linkType);
  if (result.ok) window.open(result.url, '_blank', 'noopener');
  else           showToast(result.error, 'err');
}

function renderActionButton(item, act) {
  const iconHtml = act.icon.startsWith('http')
    ? `<img src="${act.icon}" style="width:12px;height:12px;object-fit:contain;vertical-align:middle;flex-shrink:0">`
    : `<i class="${act.icon}"></i>`;
  const pn = item.name.replace(/'/g, "\\'");
  const onclk = act.type === 'custom' && act.actionId === 'personalAccounts'
    ? 'showPersonalAccounts()'
    : `secureOpen('${pn}','${act.linkType}')`;
  return `<button onclick="${onclk}" class="btn ${act.cls}">
            ${iconHtml}${act.label}
          </button>`;
}

function buildRoleCell(cls, icon, label, val){
  if (!val || val === '-'){
    return `<div class="role-cell">
              <div class="role-key">${label}</div>
              <div class="role-val" style="opacity:.35;font-style:italic;font-size:10.5px"><span>—</span></div>
            </div>`;
  }
  const safe = escapeHtml(val);
  return `<div class="role-cell">
            <div class="role-key">${label}</div>
            <div class="role-val ${cls}">
              <i class="${icon}"></i><span title="${safe}">${safe}</span>
            </div>
          </div>`;
}

// ── World-Class Spotlight & Pinning Engine ────────────────────────
export function getPinnedProcs() {
  try {
    return JSON.parse(localStorage.getItem('sp_pinned_procs') || '[]');
  } catch(_) { return []; }
}

export function isProcPinned(name) {
  return getPinnedProcs().includes(name);
}

export function togglePinProcess(name, ev) {
  if (ev) ev.stopPropagation();
  let list = getPinnedProcs();
  if (list.includes(name)) {
    list = list.filter(n => n !== name);
    showToast(`Removed from shortcuts.`, 'info');
  } else {
    list.push(name);
    showToast(`Pinned to top shortcuts!`, 'ok');
  }
  localStorage.setItem('sp_pinned_procs', JSON.stringify(list));
  renderPinnedTray();
  document.querySelectorAll(`.card[data-name="${name.replace(/"/g, '\\"')}"] .card-star-btn`).forEach(btn => {
    const pinned = list.includes(name);
    btn.classList.toggle('pinned', pinned);
    btn.title = pinned ? 'Unpin from shortcuts' : 'Pin to top shortcuts';
    btn.innerHTML = `<i class="${pinned ? 'fas fa-star' : 'far fa-star'}"></i>`;
  });
}

export function renderPinnedTray() {
  const tray = document.getElementById('pinnedTray');
  const box = document.getElementById('pinnedList');
  if (!tray || !box) return;
  const list = getPinnedProcs();
  if (!list.length) {
    tray.style.display = 'none';
    box.innerHTML = '';
    return;
  }
  tray.style.display = 'flex';
  box.innerHTML = list.map(name => {
    const item = DB.find(d => d.name === name);
    if (!item) return '';
    const safe = escapeHtml(name);
    const pn = name.replace(/'/g, "\\'");
    const primary = getPrimaryAction(item);
    const clickAct = primary?.type === 'custom' && primary.actionId === 'personalAccounts'
      ? 'showPersonalAccounts()'
      : `secureOpen('${pn}', '${primary?.linkType || Object.keys(item.links || {})[0] || ''}')`;
    return `<div class="pinned-item-chip" onclick="${clickAct}" title="Open ${safe}">
      <i class="fas fa-arrow-up-right-from-square" style="font-size:10px"></i>
      <span>${safe}</span>
      <span class="pinned-remove-btn" onclick="togglePinProcess('${pn}', event)" title="Remove shortcut">&times;</span>
    </div>`;
  }).join('');
}

export function trackCardGlow(e, card) {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  card.style.setProperty('--mouse-x', `${x}px`);
  card.style.setProperty('--mouse-y', `${y}px`);
}

// Expose handlers to window for inline onclicks
Object.assign(window, {
  togglePinProcess,
  trackCardGlow,
  renderPinnedTray,
  secureOpen
});

/** Render a list of processes into #cardBox. */
export async function renderCards(data){
  renderPinnedTray();
  if (data.some(it => it.navTo === 'GodownAddress')) {
    try { await fetchGodownList(); } catch(e) { console.error('[Godown] Firestore read failed:', e); }
  }
  const box = $('cardBox');
  box.innerHTML = '';

  // ── Documents: horizontal file-list design ──
  if (state.curCat === 'Documents') {
    const DOC_STYLE = {
      folder: { icon:'fa-folder-open',      bg:'#be185d', light:'#fdf2f8', label:'Google Drive' },
      sheet:  { icon:'fa-table-cells-large', bg:'#065f46', light:'#ecfdf5', label:'Spreadsheet'  },
      fms:    { icon:'fa-table-cells',       bg:'#1e40af', light:'#eff6ff', label:'FMS'          },
      form:   { icon:'fa-clipboard-list',    bg:'#4338ca', light:'#eef2ff', label:'Form'         },
    };
    const docItems = DB.filter(it => (it.cat === 'Documents' || it.cat === 'Family') && canAccessProc(state.curUser, it));
    if (!docItems.length){
      box.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>No documents found.</p></div>';
      return;
    }
    const html = docItems.map((it, i) => {
      const lk  = Object.keys(it.links)[0] || 'folder';
      const st  = DOC_STYLE[lk] || DOC_STYLE.folder;
      const pn  = it.name.replace(/'/g, "\\'");
      const action = `<button onclick="secureOpen('${pn}','${lk}')" class="doc-open-btn" style="background:${st.bg}">
                        <i class="fas fa-arrow-up-right-from-square"></i> Open
                      </button>`;
      return `<div class="doc-list-item" style="animation-delay:${i*.04}s;border-left-color:${st.bg}">
        <div class="doc-list-icon" style="background:${st.light};color:${st.bg}">
          <i class="fas ${st.icon}"></i>
        </div>
        <div class="doc-list-body">
          <div class="doc-list-name">${escapeHtml(it.name)}</div>
          <div class="doc-list-meta">
            <span class="doc-list-type">${st.label}</span>
          </div>
        </div>
        <div class="doc-list-action">${action}</div>
      </div>`;
    }).join('');
    box.innerHTML = `<div class="doc-list">${html}</div>`;
    return;
  }

  const accessible = data.filter(it => canAccessProc(state.curUser, it) && it.cat !== 'Products' && it.cat !== 'Bank Details' && !it.salesdash);
  if (!accessible.length){
    box.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>No processes found.</p></div>';
    return;
  }

  const PROC_ICON = {
    // ── Import & Procurement ──────────────────────────────────
    'Custom Clearance Checklist':        'fas fa-clipboard-list',
    'Shipping Document Checklist':       'fas fa-file-lines',
    'Import Process System':             'fas fa-diagram-project',
    // ── Sales & Marketing ────────────────────────────────────
    'Rozaana Field Order Dashboard':     'fas fa-calendar-day',
    'CRM Payment FMS':                   'fas fa-money-bill-wave',
    'Price List':                        'fas fa-tags',
    'Next Week/ Day Marketing Plan':     'fas fa-calendar-days',
    'Sales Report (GSTR-3B)':            'fas fa-chart-bar',
    'Sales Overview Dashboard':          'fas fa-chart-line',
    'Sales Performance':                 'fas fa-chart-pie',
    'Truck Sale Dashboard':              'fas fa-truck',
    'New Customer Visit':                'fas fa-user-plus',
    'Follow Up Calls':                   'fas fa-phone-volume',
    'Scott Sheet':                       'fas fa-file-lines',
    'All Party Name':                    'fas fa-address-book',
    'Mukesh Debtor List':                'fas fa-file-invoice-dollar',
    'Pranav Debtor List':                'fas fa-file-invoice',
    'Ruchira Color Copier Client (Mr. Pawan)': 'fas fa-trophy',
    'Sales Meeting Attendance Sheet':    'fas fa-people-group',
    'Bank Details':                      'fas fa-landmark',
    'Double A Advance Container Booking Form': 'fas fa-ship',
    'Double A New Distributor Form':     'fas fa-handshake',
    'Double A District Distributor':     'fas fa-map-location-dot',
    'Double A CME Payment FMS FY 2026-27':'fas fa-money-bills',
    'Double A Dealer':                   'fas fa-store',
    'Double A CME Folder':               'fas fa-folder-open',
    'Double A Retail Customer (Mr. Rishabh)': 'fas fa-users',
    'Double A Corporate Customer':       'fas fa-building',
    'Double A Container Tracker':         'fas fa-location-crosshairs',
    'Double A Display Links':            'fas fa-link',
    'Enquiry Capture FY 2026-27':        'fas fa-magnifying-glass',
    'Stock Dashboard Khera':             'fas fa-cubes',
    'Stock Dashboard Mukherjee Nagar':   'fas fa-cubes',
    // ── Warehouse & Logistics ────────────────────────────────
    'Order to Delivery FMS':             'fas fa-route',
    'O2D Direct Dispatch FMS':           'fas fa-box-open',
    'Warehouse Stock Report Form':       'fas fa-cubes',
    'Shop Stock Report Form':            'fas fa-shop',
    'Transporter Details':               'fas fa-truck',
    'Products Photos':                   'fas fa-images',
    // ── Purchase & Inventory ─────────────────────────────────
    'Purchase FMS':                      'fas fa-cart-plus',
    'Stock Transfer FMS':                'fas fa-arrows-left-right',
    'IMS (Inventory System)':            'fas fa-warehouse',
    'WMS':                               'fas fa-pallet',
    'Godown Inward Report':              'fas fa-truck-ramp-box',
    // ── Accounts, GST & Taxation ─────────────────────────────
    'Account Checklist':                 'fas fa-calculator',
    'Company Payment FMS':               'fas fa-building-columns',
    'GP Sheet':                          'fas fa-percent',
    'Cheque Payment FMS':                'fas fa-money-check-dollar',
    'Sales Marketing Daily Expense':     'fas fa-wallet',
    'Courier FMS':                       'fas fa-motorcycle',
    'Home Loan/ OD FMS':                 'fas fa-house',
    'Petrol & Rider Form':               'fas fa-gas-pump',
    // ── Admin & MIS ──────────────────────────────────────────
    'Attendance Sheet':                  'fas fa-fingerprint',
    'Office Chores Form':                'fas fa-broom',
    'Ultimate Checklist':                'fas fa-list-check',
    'Delegation Sheet':                  'fas fa-user-check',
    'To Do (MIS)':                       'fas fa-circle-check',
    'To Do (EA)':                        'fas fa-clipboard-check',
    'MIS Score':                         'fas fa-star',
    'Dashboard of All FMS':              'fas fa-gauge-high',
    'FMS of FMS':                        'fas fa-layer-group',
    'Email & Password Sheet':            'fas fa-envelope',
    'SCT FMS':                           'fas fa-truck-moving',
    'Repair & Maintenance System':       'fas fa-wrench',
    'Office Door Key':                   'fas fa-key',
    'Salary System':                     'fas fa-money-check-dollar',
    // ── Support ──────────────────────────────────────────────
    'Help Ticket':                       'fas fa-ticket',
    'Google Site':                       'fas fa-globe',
    // ── Family ───────────────────────────────────────────────
    'Personal Documents':                'fas fa-folder-heart',
    'Teams Member Document':             'fas fa-users-rectangle',
    'Satija Paper Document':             'fas fa-building',
  };

  const CAT_TAG = {
    Import:   'Import & Procurement',
    Sales:    'Sales & Marketing',
    Warehouse:'Warehouse & Logistics',
    Purchase: 'Purchase & Inventory',
    Accounts: 'Accounts, GST & Tax',
    AdminMIS: 'Admin & MIS',
    Support:  'Team / Support',
    Family:   'SP Family',
  };

  const isAdmin = state.curUser?.role === 'Admin';

  const showingAll = state.curCat === 'All';
  const CAT_ORDER  = ['Import','Sales','Warehouse','Purchase','Accounts','AdminMIS','Support'];

  if (showingAll) {
    const grouped = {};
    accessible.forEach(it => {
      if (!grouped[it.cat]) grouped[it.cat] = [];
      grouped[it.cat].push(it);
    });
    let allHtml = '';
    let globalIdx = 0;
    CAT_ORDER.filter(c => grouped[c]?.length).forEach(cat => {
      const label = CAT_TAG[cat] || cat;
      const realCount = grouped[cat].filter(x => !x.navTo).length;
      allHtml += `<div class="cat-section-header">
        <span class="cat-section-label">${label}</span>
        <span class="cat-section-count">${realCount}</span>
      </div>`;
      allHtml += grouped[cat].map(it => _buildCardHTML(it, globalIdx++, CAT_TAG, PROC_ICON, isAdmin)).join('');
    });
    box.innerHTML = allHtml || '<div class="empty-state"><i class="fas fa-box-open"></i><p>No processes found.</p></div>';
    return;
  }

  const onSubcatPage = state.curCat === 'DoubleA';
  const plain    = onSubcatPage ? accessible : accessible.filter(it => !it.subcat);
  const subcats  = onSubcatPage ? [] : [...new Set(accessible.filter(it => it.subcat).map(it => it.subcat))];

  let idx = 0;
  let html = plain.map(it => _buildCardHTML(it, idx++, CAT_TAG, PROC_ICON, isAdmin)).join('');
  subcats.forEach(sc => {
    const items = accessible.filter(it => it.subcat === sc);
    html += `<div class="cat-section-header">
      <span class="cat-section-label">${sc}</span>
      <span class="cat-section-count">${items.length}</span>
    </div>`;
    html += items.map(it => _buildCardHTML(it, idx++, CAT_TAG, PROC_ICON, isAdmin)).join('');
  });

  box.innerHTML = html || '<div class="empty-state"><i class="fas fa-box-open"></i><p>No processes found.</p></div>';
}

function _buildCardHTML(it, i, CAT_TAG, PROC_ICON, isAdmin) {
    if (it.navTo === 'BankDetails') {
      return `<div class="bank-nav-card" onclick="showBankDetails(document.getElementById('navBankDetails'))" style="animation-delay:${i*.028}s">
        <div class="bank-nav-icon"><i class="fas fa-landmark"></i></div>
        <div class="bank-nav-text">
          <div class="bank-nav-title">Bank Details</div>
          <div class="bank-nav-sub">View company &amp; personal bank accounts</div>
        </div>
        <i class="fas fa-arrow-right" style="color:#93c5fd;font-size:13px"></i>
      </div>`;
    }

    if (it.navTo === 'GodownAddress') {
      const g = getGodownList()[0];
      if (!g) return `<div class="bank-card godown-card" style="animation-delay:${i*.028}s">
        <div class="bank-card-header godown-header"><i class="fas fa-warehouse"></i> Godown Address</div>
        <div class="bank-card-body"><div style="padding:20px;color:#999;font-size:13px">Not configured in Firestore.</div></div>
      </div>`;
      const tel = `<a href="tel:${escapeHtml(g.mobile)}" style="color:inherit;text-decoration:none">${escapeHtml(g.mobile)}</a>`;
      return `<div class="bank-card godown-card" style="animation-delay:${i*.028}s">
        <div class="bank-card-header godown-header">
          <i class="fas fa-warehouse"></i> ${escapeHtml(g.name || 'Godown Address')}
        </div>
        <div class="bank-card-body">
          <div class="bank-details-table">
            <table>
              ${g.firm     ? `<tr><td>Firm</td><td>:</td><td><strong>${escapeHtml(g.firm)}</strong></td></tr>` : ''}
              ${g.godownNo ? `<tr><td>Godown No.</td><td>:</td><td>${escapeHtml(g.godownNo)}</td></tr>` : ''}
              ${g.location ? `<tr><td>Location</td><td>:</td><td>${escapeHtml(g.location)}</td></tr>` : ''}
              ${g.near     ? `<tr><td>Near</td><td>:</td><td>${escapeHtml(g.near)}</td></tr>` : ''}
              ${g.city     ? `<tr><td>City</td><td>:</td><td>${escapeHtml(g.city)}</td></tr>` : ''}
              ${g.keeper   ? `<tr><td>Godown Keeper</td><td>:</td><td>${escapeHtml(g.keeper)}</td></tr>` : ''}
              ${g.mobile   ? `<tr><td>Mobile</td><td>:</td><td>${tel}</td></tr>` : ''}
            </table>
            <div class="bank-action-row">
              <button class="bank-copy-btn" onclick="copyGodownAddr()">
                <i class="fas fa-copy"></i> Copy Details
              </button>
              <button class="bank-share-btn" onclick="shareGodownAddr()">
                <i class="fas fa-share-nodes"></i> Share
              </button>
            </div>
          </div>
        </div>
      </div>`;
    }

    const cc = it.cat === 'Documents' ? 'Family' : it.cat;

    let btns = getCardActions(it).map(act => renderActionButton(it, act)).join('');

    if (!btns){
      btns = '<div style="grid-column:span 2;text-align:center;color:#ccc;font-size:11px;padding:6px">No links configured</div>';
    }

    const CAT_ICON = {
      Import:'fas fa-ship', Sales:'fas fa-chart-line', Warehouse:'fas fa-warehouse',
      Purchase:'fas fa-cart-shopping', Accounts:'fas fa-calculator',
      AdminMIS:'fas fa-clipboard-check', Support:'fas fa-headset', Family:'fas fa-folder-heart',
    };
    const catIcon = PROC_ICON[it.name] || CAT_ICON[it.cat] || 'fas fa-circle';
    const catIconHtml = `<i class="card-cat-icon ${catIcon}"></i>`;
    const pn = it.name.replace(/'/g, "\\'");
    const isPinned = isProcPinned(it.name);

    return `<div class="card cat-${cc}" data-name="${escapeHtml(it.name)}" onmousemove="trackCardGlow(event, this)" style="animation-delay:${i*.028}s">
      <div class="card-inner">
        <div class="card-top-row">
          <span class="card-tag tag-${cc}">${CAT_TAG[cc] || cc}</span>
          <div class="card-top-right">
            <button class="card-star-btn ${isPinned ? 'pinned' : ''}" onclick="togglePinProcess('${pn}', event)" title="${isPinned ? 'Unpin from shortcuts' : 'Pin to top shortcuts'}">
              <i class="${isPinned ? 'fas fa-star' : 'far fa-star'}"></i>
            </button>
            ${catIconHtml}
          </div>
        </div>
        <div class="card-title"><i class="${catIcon} card-title-icon"></i>${escapeHtml(it.name)}</div>
        <div class="roles-grid">
          ${buildRoleCell('rv-pc','fas fa-shield-halved','PC / EA',   it.pc)}
          ${buildRoleCell('rv-sv','fas fa-wrench',       'Solver',    it.solver)}
          ${buildRoleCell('rv-ex','fas fa-user-tie',     'Executive', it.exec)}
        </div>
        <div class="card-divider"></div>
        <div class="actions">${btns}</div>
      </div>
    </div>`;
}

export function renderFiltered(){
  const raw    = ($('searchInput')?.value || '').toLowerCase();
  const terms  = raw.split(/\s+/).filter(Boolean);
  if (state.curCat === 'Family') {
    renderCards(DB.filter(it => it.cat === 'Family' || it.cat === 'Documents'));
    return;
  }

  const filtered = DB.filter(it => {
    if (it.cat === 'Products' || it.cat === 'Bank Details') return false;
    if (!canAccessProc(state.curUser, it)) return false;
    const matchesCat = state.curCat === 'All' || it.cat === state.curCat
      || (state.curCat === 'DoubleA' && it.subcat === 'Double A');
    const haystack   = `${it.name} ${it.pc} ${it.solver} ${it.exec} ${it.cat}`.toLowerCase();
    return matchesCat && terms.every(t => haystack.includes(t));
  });
  renderCards(filtered);
}
