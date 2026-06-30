import { $, escapeHtml, showToast } from './dom.js';
import { state }                    from '../state.js';
import { DB }                       from '../data.js';
import { canAccessProc, canAccessLink } from './access.js';
import { resolveProcessUrl }        from '../services/process.service.js';

const _G = {
  SHEETS: 'https://www.gstatic.com/images/branding/product/1x/sheets_48dp.png',
  FORMS:  'https://www.gstatic.com/images/branding/product/1x/forms_48dp.png',
  GAS:    'https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png',
  DRIVE:  'https://www.gstatic.com/images/branding/product/1x/drive_48dp.png',
  LOOKER: 'https://www.gstatic.com/images/branding/product/1x/looker_studio_48dp.png',
};
export async function secureOpen(procName, linkType){
  const item = DB.find(d => d.name === procName);
  if (!item){                               showToast('Process not found.',  'err'); return; }
  if (!canAccessProc(state.curUser, item)){ showToast('Access denied.',      'err'); return; }
  if (!canAccessLink(state.curUser, procName, linkType)){
    showToast('No access to this link.', 'err'); return;
  }

  showToast('Opening...', 'info');
  const result = await resolveProcessUrl(procName, linkType);
  if (result.ok) window.open(result.url, '_blank', 'noopener');
  else           showToast(result.error, 'err');
}

function buildButton(item, hasUrl, linkType, cls, icon, label, adminOnly = false){
  const isAdmin = state.curUser?.role === 'Admin';
  if (!hasUrl)                                             return '';
  if (adminOnly && !isAdmin)                               return '';
  if (!canAccessLink(state.curUser, item.name, linkType))  return '';
  const pn = item.name.replace(/'/g, "\\'");
  const iconHtml = icon.startsWith('http')
    ? `<img src="${icon}" style="width:12px;height:12px;object-fit:contain;vertical-align:middle;flex-shrink:0">`
    : `<i class="${icon}"></i>`;
  return `<button onclick="secureOpen('${pn}','${linkType}')" class="btn ${cls}">
            ${iconHtml}${label}
          </button>`;
}

/** Build a role cell (PC / Solver / Executive). */
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

/** Render a list of processes into #cardBox. */
export function renderCards(data){
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

  const accessible = data.filter(it => canAccessProc(state.curUser, it) && it.cat !== 'Products' && it.cat !== 'Bank Details');
  if (!accessible.length){
    box.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>No processes found.</p></div>';
    return;
  }

  const PROC_ICON = {
    // ── Import & Procurement ──────────────────────────────────
    'Custom Clearance Checklist':        'fas fa-clipboard-list',
    'Shipping Document Checklist':       'fas fa-file-lines',
    // ── Sales & Marketing ────────────────────────────────────
    'CRM Payment FMS':                   'fas fa-money-bill-wave',
    'Price List':                        'fas fa-tags',
    'Next Week/ Day Marketing Plan':     'fas fa-calendar-days',
    'Sales Report':                      'fas fa-chart-bar',
    'New Customer Visit':                'fas fa-user-plus',
    'Follow Up Calls':                   'fas fa-phone-volume',
    'Scott Sheet':                       'fas fa-file-lines',
    'All Party Name':                    'fas fa-address-book',
    'Mukesh Debtor List':                'fas fa-file-invoice-dollar',
    'Pranav Debtor List':                'fas fa-file-invoice',
    'Ruchira 100 Best Customer':         'fas fa-trophy',
    'Sales Meeting Attendance Sheet':    'fas fa-people-group',
    'Bank Details':                      'fas fa-landmark',
    'Double A Advance Container Booking Form': 'fas fa-ship',
    'Double A New Distributor Form':     'fas fa-handshake',
    'Double A District Distributor':     'fas fa-map-location-dot',
    'Double A CME Payment FMS FY 2026-27':'fas fa-money-bill-transfer',
    'Double A Dealer':                   'fas fa-store',
    'Double A CME Folder':               'fas fa-folder-open',
    'Double A Retail Customer':          'fas fa-users',
    'Double A Corporate Customer':       'fas fa-building',
    'Double A Display Links':            'fas fa-link',
    'Enquiry Capture FY 2026-27':        'fas fa-magnifying-glass-chart',
    'Stock Dashboard Khera':             'fas fa-boxes-stacking',
    'Stock Dashboard Mukherjee Nagar':   'fas fa-boxes-stacking',
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
    'Company Payment':                   'fas fa-building-columns',
    'GP Sheet':                          'fas fa-percent',
    'Cheque Payment':                    'fas fa-money-check-dollar',
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

  // In All view: group by category with section headers
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

  const html    = accessible.map((it, i) => _buildCardHTML(it, i, CAT_TAG, PROC_ICON, isAdmin)).join('');
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
      return `<div class="bank-card godown-card" style="animation-delay:${i*.028}s">
        <div class="bank-card-header godown-header">
          <i class="fas fa-warehouse"></i> Godown Address
        </div>
        <div class="bank-card-body">
          <div class="bank-details-table">
            <table>
              <tr><td>Firm</td><td>:</td><td><strong>M/s. SATIJA PAPER</strong></td></tr>
              <tr><td>Godown No.</td><td>:</td><td>19, Vikas Mandal</td></tr>
              <tr><td>Location</td><td>:</td><td>Khera Kalan</td></tr>
              <tr><td>Near</td><td>:</td><td>Shri Ram Dharam Kanta</td></tr>
              <tr><td>City</td><td>:</td><td>Delhi – 110082</td></tr>
              <tr><td>Godown Keeper</td><td>:</td><td>Mr. Chandresh</td></tr>
              <tr><td>Mobile</td><td>:</td><td><a href="tel:9899701090" style="color:inherit;text-decoration:none">9899701090</a></td></tr>
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

    let btns = '';
    btns += buildButton(it, !!it.links.fms,        'fms',        'btn-fms',    _G.SHEETS,                 'FMS');
    btns += buildButton(it, !!it.links.form,       'form',       'btn-form',   _G.FORMS,                  'Form');

    if (it.name === 'Help Ticket'){
      btns += buildButton(it, !!it.links.sheet && isAdmin, 'sheet', 'btn-sheet', _G.SHEETS, 'All Tickets');
    } else if (it.name === 'Personal Documents') {
      btns += buildButton(it, !!it.links.sheet, 'sheet', 'btn-sheet', _G.SHEETS, 'Policy Details');
      const hasBankAccess = state.curUser?.role === 'Admin'
        || state.curUser?.deptAccess?.includes('All')
        || state.curUser?.deptAccess?.includes('Bank Details');
      if (hasBankAccess) {
        btns += `<button onclick="showPersonalAccounts()" class="btn btn-dash"><i class="fas fa-university"></i> Personal Accounts</button>`;
      }
    } else if (it.name !== 'Dashboard of All FMS') {
      btns += buildButton(it, !!it.links.sheet,    'sheet',      'btn-sheet',  _G.SHEETS,                 'Sheet');
    }

    btns += buildButton(it, !!it.links.check,      'check',      'btn-check',  _G.SHEETS,                 'Checklist');
    btns += buildButton(it, !!it.links.video,      'video',      'btn-video',  'fab fa-youtube',          'Training');
    btns += buildButton(it, !!it.links.videoBCI,   'videoBCI',  'btn-video',  'fab fa-youtube',          'Training (BCI)');
    btns += buildButton(it, !!it.links.videoAI,    'videoAI',   'btn-video',  _G.DRIVE,                  'Training Video AI');
    btns += buildButton(it, !!it.links.dashEmp,    'dashEmp',   'btn-dash',   'fas fa-gauge-high',       'Emp Dashboard');
    btns += buildButton(it, !!it.links.dashPC,     'dashPC',    'btn-dash',   'fas fa-gauge-high',       'PC Dashboard');
    if (it.name === 'Dashboard of All FMS') {
      btns += buildButton(it, !!it.links.sheet,    'sheet',      'btn-sheet',  _G.SHEETS,                 'PC Sheet');
    }
    btns += buildButton(it, !!it.links.gasForm,    'gasForm',   'btn-gas',    _G.GAS,                    'Form');
    btns += buildButton(it, !!it.links.admin,      'admin',     'btn-admin',  _G.GAS,                    'Admin Panel');
    btns += buildButton(it, !!it.links.gpDash,     'gpDash',    'btn-gp',     _G.GAS,                    'GP Dashboard');
    btns += buildButton(it, !!it.links.stockDash,  'stockDash', 'btn-stock',  _G.LOOKER,                 'Dashboard');
    btns += buildButton(it, !!it.links.folder,     'folder',    'btn-folder', _G.DRIVE,                  'View Folder');
    btns += buildButton(it, !!it.links.terms,      'terms',     'btn-form',   _G.DRIVE,                  'T&amp;C');
    btns += buildButton(it, !!it.links.drive,      'drive',     'btn-form',   _G.DRIVE,                  'Drive');
    btns += buildButton(it, !!it.links.guidelineForm,'guidelineForm','btn-form',_G.DRIVE, it.name === 'Double A Retail Customer' ? 'Marketing Guideline' : 'Guideline');

    // ── AI Q&A button ─────────────────────────────────────────
    btns += buildButton(it, !!it.links.aiqa,       'aiqa',      'btn-aiqa',   'fas fa-robot',            'AI Q&amp;A');
    // ────────────────────────────────────────────────────────

    if (!btns){
      btns = '<div style="grid-column:span 2;text-align:center;color:#ccc;font-size:11px;padding:6px">No links configured</div>';
    }

    const catIcon = PROC_ICON[it.name] || 'fas fa-circle-dot';
    const catIconHtml = cc === 'Family'
      ? `<img class="card-cat-icon sp-family-icon" src="logo.png" alt="SP">`
      : `<i class="card-cat-icon ${catIcon}"></i>`;

    return `<div class="card cat-${cc}" data-name="${escapeHtml(it.name)}" style="animation-delay:${i*.028}s">
      <div class="card-inner">
        ${catIconHtml}
        <span class="card-tag tag-${cc}">${CAT_TAG[cc] || cc}</span>
        <div class="card-title">${escapeHtml(it.name)}</div>
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
    const matchesCat = state.curCat === 'All' || it.cat === state.curCat;
    const haystack   = `${it.name} ${it.pc} ${it.solver} ${it.exec} ${it.cat}`.toLowerCase();
    return matchesCat && terms.every(t => haystack.includes(t));
  });
  renderCards(filtered);
}
