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
    // ── Dispatch ──────────────────────────────────────────────
    'Order to Delivery FMS':              'fas fa-route',
    'O2D Direct Dispatch FMS':            'fas fa-box-open',
    'Sale Report':                        'fas fa-chart-bar',
    // ── Sales ─────────────────────────────────────────────────
    'Ruchira 100 Best Customer':          'fas fa-trophy',
    'Follow Up Calls':                    'fas fa-phone-volume',
    'Next Week/ Day Marketing Plan':      'fas fa-calendar-days',
    'New Customer Visit':                 'fas fa-user-plus',
    'Enquiry Capture FY 2026-27':         'fas fa-magnifying-glass',
    'CRM Payment FMS':                    'fas fa-money-bill-wave',
    'Price List':                         'fas fa-tags',
    'Scot Sheet':                         'fas fa-file-lines',
    'Stock Dashboard':                    'fas fa-boxes-stacking',
    'Mr. Mukesh Debtors List':            'fas fa-file-invoice-dollar',
    'Mr. Pranav Satija Debtors List':     'fas fa-file-invoice',
    'All Party Name':                     'fas fa-address-book',
    // ── Sales → Double A ──────────────────────────────────────
    'Double A Advance Container Booking Form': 'fas fa-ship',
    'Double A New Distributor Form':      'fas fa-store',
    'Double A District Distributor':      'fas fa-map-location-dot',
    'Double A CME Payment FMS FY 2026-27':'fas fa-receipt',
    'Double A Dealer':                    'fas fa-handshake',
    'Double A CME Folder':                'fas fa-folder-open',
    'Double A Retail Customer':           'fas fa-shop',
    'Double A Corporate Customer':        'fas fa-building',
    'Double A Display Links':             'fas fa-link',
    // ── Purchase ──────────────────────────────────────────────
    'Purchase FMS':                       'fas fa-cart-plus',
    'IMS (Inventory System)':             'fas fa-warehouse',
    'WMS':                                'fas fa-pallet',
    'Godown Stock Report':                'fas fa-cubes',
    'Godown Inward Report':               'fas fa-truck',
    'Stock Transfer FMS':                 'fas fa-arrows-left-right',
    'Shop Stock Report':                  'fas fa-shop',
    // ── Management ────────────────────────────────────────────
    'Ultimate Checklist':                 'fas fa-list-check',
    'Delegation Sheet':                   'fas fa-user-check',
    'To Do (MIS)':                        'fas fa-circle-check',
    'To Do (EA)':                         'fas fa-clipboard-check',
    'MIS Score':                          'fas fa-star',
    'Dashboard of All FMS':               'fas fa-gauge-high',
    'FMS OF FMS':                         'fas fa-layer-group',
    'Home Loan FMS':                      'fas fa-house',
    'eMail & Password Sheet':             'fas fa-envelope',
    'SCT-FMS':                            'fas fa-truck-moving',
    'Repair & Maintenance System':        'fas fa-wrench',
    // ── Support ───────────────────────────────────────────────
    'Help Ticket':                        'fas fa-ticket',
    // ── My System ─────────────────────────────────────────────
    'Google Site':                        'fas fa-globe',
    // ── HR ────────────────────────────────────────────────────
    'Office Chores Form':                 'fas fa-broom',
    'Attendances Sheet':                  'fas fa-fingerprint',
    'Sales Meeting Attendances Sheet':    'fas fa-people-group',
    'Courier FMS':                        'fas fa-motorcycle',
    // ── Finance ───────────────────────────────────────────────
    'Petrol/Rider Form':                  'fas fa-gas-pump',
    'Cheque Payment':                     'fas fa-money-check-dollar',
    'Company Payment':                    'fas fa-building-columns',
    'GP Sheet':                           'fas fa-percent',
    'Sales Marketing Daily Expense':      'fas fa-wallet',
    'Account Checklist':                  'fas fa-calculator',
    // ── Documents ─────────────────────────────────────────────
    'Satija Family Documents':            'fas fa-house-user',
    'Satija Paper Documents':             'fas fa-file-contract',
    'SP Team Members Documents':          'fas fa-id-card',
    'Policy Details':                     'fas fa-shield-halved',
  };

  const isAdmin = state.curUser?.role === 'Admin';
  const html    = accessible.map((it, i) => {
    const cc = it.cat === 'My System' ? 'My' : (it.cat === 'Documents' ? 'Family' : it.cat);

    let btns = '';
    btns += buildButton(it, !!it.links.fms,        'fms',        'btn-fms',    _G.SHEETS,                 'FMS');
    btns += buildButton(it, !!it.links.form,       'form',       'btn-form',   _G.FORMS,                  'Form');

    if (it.name === 'Help Ticket'){
      btns += buildButton(it, !!it.links.sheet && isAdmin, 'sheet', 'btn-sheet', _G.SHEETS, 'All Tickets');
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

    // ── data-name added for MutationObserver DA-hiding ───────
    return `<div class="card cat-${cc}" data-name="${escapeHtml(it.name)}" style="animation-delay:${i*.028}s">
      <div class="card-inner">
        <i class="card-cat-icon ${catIcon}"></i>
        <span class="card-tag tag-${cc}">${escapeHtml(it.cat)}</span>
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
  }).join('');

  box.innerHTML = html;
}

export function renderFiltered(){
  const raw    = ($('searchInput')?.value || '').toLowerCase();
  const terms  = raw.split(/\s+/).filter(Boolean);
  if (state.curCat === 'Documents') {
    renderCards(DB.filter(it => it.cat === 'Documents' || it.cat === 'Family'));
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
