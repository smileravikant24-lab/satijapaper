import { state }                          from '../state.js';
import { showToast }                      from './dom.js';
import {
  getSalaryMonthInfo, getSalaryDoc, saveSalaryDoc,
  updateSalaryField, updateSalaryEntryField
} from '../services/salary.service.js';

const MUKESH_EMAIL = 'mukesh.shukla@pranavsatijapaper.com';
const SATIJA_EMAIL = 'satijapaper@gmail.com';
const PRANAV_EMAIL = 'pranavsatija@satijapaper.com';

const CASH_EMPLOYEES = [
  { id: 'rashmi',   name: 'Ms. Rashmi',                label: 'Salary'   },
  { id: 'pooja',    name: 'Ms. Pooja',                 label: 'Salary'   },
  { id: 'gaurav',   name: 'Mr. Gaurav Mishra',         label: 'Salary'   },
  { id: 'pawan_d',  name: 'Mr. Pawan Bhaiya (Driver)', label: 'Salary'   },
  { id: 'richa',    name: 'Ms. Richa',                 label: 'Salary'   },
  { id: 'ravi',     name: 'Mr. Ravi Kant',             label: 'Salary'   },
  { id: 'rishabh',  name: 'Mr. Rishabh Jain',          label: 'Salary'   },
  { id: 'sonu',     name: 'Mr. Sonu Chauhan',          label: 'Salary C' },
  { id: 'pawan_n',  name: 'Mr. Pawan Negi',            label: 'Salary C' },
  { id: 'sweeper',  name: 'Bala Aunt (Sweeper)',       label: 'Cash'     },
  { id: 'security', name: 'Maan (Security Guard)',     label: 'Cash', note: 'QTRLY ₹1,500' },
];

const BANK_ITEMS = [
  { id: 'mukesh',    name: 'Mr. Mukesh Shukla',              via: 'HSBC',               label: 'Salary'     },
  { id: 'aman',      name: 'Mr. Aman Singh',                 via: 'HSBC',               label: 'Salary'     },
  { id: 'pawan_n',   name: 'Mr. Pawan Singh Negi',           via: 'HSBC',               label: 'Salary'     },
  { id: 'indresh',   name: 'Mr. Indresh Pratap Singh',       via: 'HSBC',               label: 'Salary'     },
  { id: 'sushma',    name: 'Ms. Sushma Shukla',              via: 'HSBC',               label: 'Salary'     },
  { id: 'sandeep',   name: 'Mr. Sandeep Kumar Dhawan',       via: 'HSBC',               label: 'Salary'     },
  { id: 'neha',      name: 'Ms. Neha Nidhi',                 via: 'HSBC',               label: 'Salary'     },
  { id: 'khushi',    name: 'Ms. Khushi Painter',             via: 'HSBC',               label: 'Salary'     },
  { id: 'draw_cash', name: 'Drawing — Pranav',               via: 'Cash / Tally Prime', label: 'Drawing'    },
  { id: 'draw_hsbc', name: 'Drawing — Pranav',               via: 'HSBC → PNB',         label: 'Drawing'    },
  { id: 'hl_pnb',    name: 'Home Loan — Pranav',             via: 'PNB → Kotak Joint',  label: 'Home Loan'  },
  { id: 'hl_yes',    name: 'Home Loan — Silky',              via: 'YES → Kotak Joint',  label: 'Home Loan'  },
  { id: 'godown',    name: 'Santosh Clearing (Godown Rent)', via: 'HSBC',               label: 'Godown Rent'},
  { id: 'office_r',  name: 'Veena Satija — Rent 790 & 787', via: 'PNB',                label: 'Office Rent'},
  { id: 'office_e',  name: 'Cash Withdraw',                  via: 'PNB',                label: 'Office Exp' },
];

// ── Module state ──────────────────────────────────────────────────────────────
let _lastRenderType = 'cash'; // 'cash' | 'bank' | 'combined'

// ── Helpers ───────────────────────────────────────────────────────────────────

function _displayName(email) {
  if (email === MUKESH_EMAIL) return 'Mukesh Ji';
  if (email === SATIJA_EMAIL) return 'Sandeep Ji';
  if (email === PRANAV_EMAIL) return 'Pranav Sir';
  return email;
}

function _panel() { return document.getElementById('salaryPanel'); }

function _canEnterCash(email) {
  return email === MUKESH_EMAIL || state.curUser?.role === 'Admin';
}
function _canEnterBank(email) {
  return email === SATIJA_EMAIL || state.curUser?.role === 'Admin';
}
function _canMarkProcessed(email) {
  return email === PRANAV_EMAIL || state.curUser?.role === 'Admin';
}

function _statusBadge(status) {
  const map = {
    pending:   ['sal-badge-pending',   'fas fa-clock',        'Pending Entry'],
    submitted: ['sal-badge-submitted', 'fas fa-paper-plane',  'Submitted'],
    processed: ['sal-badge-processed', 'fas fa-circle-check', 'Processed'],
  };
  const [cls, ico, txt] = map[status] || map.pending;
  return `<span class="sal-badge ${cls}"><i class="${ico}"></i> ${txt}</span>`;
}

function _fmt(n) {
  if (!n && n !== 0) return '—';
  return '₹' + Number(n).toLocaleString('en-IN');
}

function _esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function _calcTotal(items, entries, customEntries = []) {
  const base   = items.reduce((s, it) => s + (Number(entries?.[it.id]?.amount) || 0), 0);
  const custom = customEntries.reduce((s, ce) => s + (Number(ce.amount) || 0), 0);
  return base + custom;
}

// ── WhatsApp section ──────────────────────────────────────────────────────────

function _waSection(type, info, status, whoEnters, email, isAdmin) {
  const canWa = email === PRANAV_EMAIL || isAdmin;
  if (!canWa) return '';
  if (status !== 'submitted' && status !== 'processed') return '';

  const defaultText = status === 'processed'
    ? `${info.label} — processed ho gayi ✓`
    : `${info.label} — salary entries submit ho gayi, please process karein.`;

  const btnLabel = status === 'processed'
    ? `Inform ${_displayName(whoEnters)}`
    : 'Send via WhatsApp';

  return `<div class="sal-wa-section">
    <label class="sal-wa-label">WhatsApp Message</label>
    <textarea class="sal-wa-textarea" id="salWaText_${type}">${_esc(defaultText)}</textarea>
    <button class="sal-wa-send-btn" onclick="window._salSendWa('${type}')">
      <i class="fab fa-whatsapp"></i> ${btnLabel}
    </button>
  </div>`;
}

// ── Section body builder ──────────────────────────────────────────────────────

function _buildSectionBody(type, data, info, email, isAdmin, docId) {
  const items        = type === 'cash' ? CASH_EMPLOYEES : BANK_ITEMS;
  const status       = data?.status || 'pending';
  const entries      = data?.entries || {};
  const customEntries = data?.customEntries || [];
  const nameOverrides = data?.nameOverrides || {};
  const whoEnters    = type === 'cash' ? MUKESH_EMAIL : SATIJA_EMAIL;

  const canEnter  = type === 'cash' ? _canEnterCash(email) : _canEnterBank(email);
  const canProcess = _canMarkProcessed(email);
  const editable  = canEnter && status === 'pending';
  const canEditAmt  = canEnter; // same permission as entering
  const canEditName = canEnter;
  const canAddCustom = type === 'cash'
    ? (email === MUKESH_EMAIL || isAdmin)
    : (email === SATIJA_EMAIL || isAdmin);

  const total = _calcTotal(items, entries, customEntries);

  // ── Banners ──
  const processedBanner = status === 'processed'
    ? `<div class="sal-processed-banner">
         <i class="fas fa-circle-check"></i>
         <span>${_esc(info.label)} — Processed by ${_esc(_displayName(data?.processedBy || ''))}</span>
       </div>` : '';

  const submittedBanner = status === 'submitted' && !canProcess
    ? `<div class="sal-submitted-banner">
         <i class="fas fa-paper-plane"></i>
         Submitted. Awaiting Pranav Sir's confirmation.
       </div>` : '';

  // ── Action button ──
  const actionBtn = (() => {
    if (status === 'processed') return '';
    if (editable)
      return `<button class="sal-submit-btn" onclick="window._salSubmit('${type}','${docId}')">
                <i class="fas fa-paper-plane"></i> Submit ${_esc(info.label)} ${type === 'cash' ? 'Cash Salary' : 'Bank Salary'}
              </button>`;
    if (status === 'submitted' && canProcess)
      return `<button class="sal-process-btn" onclick="window._salMarkProcessed('${type}','${docId}')">
                <i class="fas fa-circle-check"></i> Mark as Processed
              </button>`;
    return '';
  })();

  // ── Table headers ──
  const amtHeader = editable ? 'Enter Amount (₹)' : 'Amount';
  const extraHeaders = type === 'cash'
    ? `<th class="sal-check-cell sal-bank-col-header">Done</th>
       <th class="sal-check-cell sal-bank-col-header">Pending</th>`
    : `<th class="sal-check-cell sal-bank-col-header">Mukesh Ji</th>
       <th class="sal-check-cell sal-bank-col-header">Sandeep Ji</th>
       <th class="sal-check-cell sal-bank-col-header">Pranav Sir</th>`;

  const emptyStatusCols = type === 'cash'
    ? '<td class="sal-check-cell"></td><td class="sal-check-cell"></td>'
    : '<td class="sal-check-cell"></td><td class="sal-check-cell"></td><td class="sal-check-cell"></td>';

  // ── Main employee rows ──
  const mainRows = items.map(it => {
    const entryData   = entries?.[it.id] || {};
    const amt         = entryData.amount ?? '';
    const displayName = _esc(nameOverrides[it.id] || it.name);

    // name cell
    const nameEditBtn = canEditName
      ? `<button class="sal-name-edit-btn" onclick="window._salEditName('${type}','${docId}','${it.id}')" title="Edit name"><i class="fas fa-pencil"></i></button>`
      : '';
    const via  = it.via  ? `<span class="sal-via">${_esc(it.via)}</span>`  : '';
    const note = it.note ? `<span class="sal-note">${_esc(it.note)}</span>` : '';
    const nameCell = `<td class="sal-name-cell" id="sal_namecell_${type}_${it.id}">
      <span class="sal-name-text" id="sal_nametext_${type}_${it.id}">${displayName}</span>${note}${via}${nameEditBtn}
    </td>`;

    // amount cell
    let amtCell;
    if (editable) {
      amtCell = `<td><input type="number" class="sal-amt-input" id="sal_${type}_${it.id}" value="${Number(amt) || ''}" placeholder="0" min="0"></td>`;
    } else {
      const pencil = canEditAmt
        ? `<button class="sal-edit-amt-btn" onclick="window._salEditAmt('${type}','${docId}','${it.id}',${Number(amt) || 0})" title="Edit amount"><i class="fas fa-pencil"></i></button>`
        : '';
      amtCell = `<td class="sal-amt-cell" id="sal_amt_cell_${type}_${it.id}">
        <span class="sal-amt-val" id="sal_amt_val_${type}_${it.id}">${_fmt(amt)}</span>${pencil}
      </td>`;
    }

    // status cells
    const statusCells = _buildStatusCells(type, it.id, entryData, docId, email, isAdmin, false);

    return `<tr>${nameCell}${amtCell}${statusCells}</tr>`;
  }).join('');

  // ── Custom entry rows ──
  const customRows = customEntries.map(ce => {
    const amt = ce.amount ?? '';
    const pencil = canEditAmt
      ? `<button class="sal-edit-amt-btn" onclick="window._salEditAmt('${type}','${docId}','_ce_${ce.id}',${Number(amt) || 0})" title="Edit amount"><i class="fas fa-pencil"></i></button>`
      : '';
    const amtCell = `<td class="sal-amt-cell" id="sal_amt_cell_${type}__ce_${ce.id}">
      <span class="sal-amt-val" id="sal_amt_val_${type}__ce_${ce.id}">${_fmt(amt)}</span>${pencil}
    </td>`;

    const delBtn = canAddCustom
      ? `<button class="sal-custom-del-btn" onclick="window._salDeleteCustom('${docId}','${ce.id}','${type}')" title="Delete entry"><i class="fas fa-times"></i></button>`
      : '';

    const statusCells = _buildStatusCells(type, `_ce_${ce.id}`, ce, docId, email, isAdmin, true, ce.id);

    return `<tr class="sal-custom-row">
      <td class="sal-name-cell">
        <span class="sal-custom-tag">Custom</span>
        ${_esc(ce.name)}${delBtn}
      </td>
      ${amtCell}
      ${statusCells}
    </tr>`;
  }).join('');

  // ── Add form (always rendered, toggled by display) ──
  const addForm = canAddCustom ? `
    <div class="sal-add-form-row" id="salAddForm_${type}" style="display:none">
      <input class="sal-add-name-input" id="salAddName_${type}" placeholder="Name" />
      <input class="sal-add-amt-input" id="salAddAmt_${type}" type="number" placeholder="Amount (₹)" min="0" />
      <button class="sal-add-save-btn" onclick="window._salSaveCustom('${type}','${docId}')">Add</button>
      <button class="sal-add-cancel-btn" onclick="window._salHideAddForm('${type}')">Cancel</button>
    </div>` : '';

  const addCustomBtn = canAddCustom
    ? `<button class="sal-add-entry-btn" onclick="window._salShowAddForm('${type}')">
         <i class="fas fa-plus"></i> Add Custom Entry
       </button>`
    : '';

  const waSection = _waSection(type, info, status, whoEnters, email, isAdmin);

  return `
    ${processedBanner}
    ${submittedBanner}
    <div class="sal-table-wrap" id="salTableWrap_${type}">
      <table class="sal-table">
        <thead>
          <tr>
            <th>Name / Description</th>
            <th style="width:160px">${amtHeader}</th>
            ${extraHeaders}
          </tr>
        </thead>
        <tbody>${mainRows}${customRows}</tbody>
        <tfoot>
          <tr class="sal-total-row">
            <td><strong>Total</strong></td>
            <td id="salTotal_${type}" class="sal-amt-val"><strong>${_fmt(total)}</strong></td>
            ${emptyStatusCols}
          </tr>
        </tfoot>
      </table>
    </div>
    ${addForm}
    ${addCustomBtn}
    ${actionBtn}
    ${waSection}`;
}

// Returns the status cell HTML for a row (works for both regular entries and custom)
function _buildStatusCells(type, rowKey, entryData, docId, email, isAdmin, isCustom, customId) {
  if (type === 'cash') {
    const done = !!entryData.done;
    const canToggle = email === MUKESH_EMAIL || isAdmin;
    const toggleFn = isCustom
      ? `window._salToggleCashCustom('${docId}','${customId}',`
      : `window._salToggleCash('${docId}','${rowKey}',`;

    if (canToggle) {
      return `
        <td class="sal-check-cell">
          <button class="sal-chk-toggle ${done ? 'done' : ''}" onclick="${toggleFn}true)">
            ${done ? 'Done' : 'Mark Done'}
          </button>
        </td>
        <td class="sal-check-cell">
          <button class="sal-chk-toggle ${!done ? 'pending' : ''}" onclick="${toggleFn}false)">
            ${!done ? 'Pending' : 'Mark Pending'}
          </button>
        </td>`;
    }
    return `
      <td class="sal-check-cell">${done ? '<span class="sal-chk-toggle done">Done</span>' : '<span class="sal-chk-toggle muted">—</span>'}</td>
      <td class="sal-check-cell">${!done ? '<span class="sal-chk-toggle pending">Pending</span>' : '<span class="sal-chk-toggle muted">—</span>'}</td>`;
  }

  // bank: 3 approval columns
  const mukeshDone  = !!entryData.mukesh_done;
  const sandeepDone = !!entryData.sandeep_done;
  const pranavDone  = !!entryData.pranav_done;

  const canToggleMukesh  = email === MUKESH_EMAIL || isAdmin;
  const canToggleSandeep = email === SATIJA_EMAIL  || isAdmin;
  const canTogglePranav  = email === PRANAV_EMAIL  || isAdmin;

  const toggleFn = isCustom
    ? (col) => `window._salToggleBankCustom('${docId}','${customId}','${col}')`
    : (col) => `window._salToggleBank('${docId}','${rowKey}','${col}')`;

  const mkChip = canToggleMukesh
    ? `<button class="sal-chk-toggle ${mukeshDone ? 'done' : 'pending'}" onclick="${toggleFn('mukesh')}">${mukeshDone ? 'Done' : 'Pending'}</button>`
    : `<span class="sal-chk-toggle ${mukeshDone ? 'done' : 'pending'}">${mukeshDone ? 'Done' : 'Pending'}</span>`;

  const sdChip = canToggleSandeep
    ? `<button class="sal-chk-toggle ${sandeepDone ? 'done' : 'pending'}" onclick="${toggleFn('sandeep')}">${sandeepDone ? 'Done' : 'Pending'}</button>`
    : `<span class="sal-chk-toggle ${sandeepDone ? 'done' : 'pending'}">${sandeepDone ? 'Done' : 'Pending'}</span>`;

  const pvChip = canTogglePranav
    ? `<button class="sal-chk-toggle ${pranavDone ? 'done' : 'pending'}" onclick="${toggleFn('pranav')}">${pranavDone ? 'Done' : 'Pending'}</button>`
    : `<span class="sal-chk-toggle ${pranavDone ? 'done' : 'pending'}">${pranavDone ? 'Done' : 'Pending'}</span>`;

  return `<td class="sal-check-cell">${mkChip}</td>
          <td class="sal-check-cell">${sdChip}</td>
          <td class="sal-check-cell">${pvChip}</td>`;
}

// ── Live total listener attachment ────────────────────────────────────────────

function _attachTotalListeners(type, items, data, docId) {
  const status = data?.status || 'pending';
  const email  = state.curUser?.email || '';
  const canEnter = type === 'cash' ? _canEnterCash(email) : _canEnterBank(email);
  if (!(canEnter && status === 'pending')) return;

  const customEntries = data?.customEntries || [];
  const totalEl = document.getElementById(`salTotal_${type}`);

  document.querySelectorAll(`input.sal-amt-input[id^="sal_${type}_"]`).forEach(inp => {
    inp.addEventListener('input', () => {
      const t = items.reduce((s, it) => {
        const v = Number(document.getElementById(`sal_${type}_${it.id}`)?.value) || 0;
        return s + v;
      }, 0) + customEntries.reduce((s, ce) => s + (Number(ce.amount) || 0), 0);
      if (totalEl) totalEl.innerHTML = `<strong>${_fmt(t)}</strong>`;
    });
  });
}

// ── Re-render helper ──────────────────────────────────────────────────────────

async function _rerender() {
  if (_lastRenderType === 'combined') {
    await _renderPranavView();
  } else {
    await _renderSalaryPanel(_lastRenderType);
  }
}

// ── Single-type panel render ──────────────────────────────────────────────────

async function _renderSalaryPanel(type) {
  _lastRenderType = type;
  const panel = _panel();
  if (!panel) return;
  panel.style.display = 'block';
  panel.innerHTML = `<div class="sal-loading"><i class="fas fa-circle-notch fa-spin"></i> Loading...</div>`;

  const info  = getSalaryMonthInfo();
  const docId = type === 'cash' ? info.cashId : info.bankId;
  const items = type === 'cash' ? CASH_EMPLOYEES : BANK_ITEMS;
  const title = type === 'cash' ? 'Cash Salary' : 'Bank Salary & Payments';
  const icon  = type === 'cash' ? 'fas fa-money-bill-wave' : 'fas fa-building-columns';

  let data = null;
  try { data = await getSalaryDoc(docId); } catch(_) {}

  const status  = data?.status || 'pending';
  const email   = state.curUser?.email || '';
  const isAdmin = state.curUser?.role === 'Admin';

  const canEnter  = type === 'cash' ? _canEnterCash(email) : _canEnterBank(email);
  const canProcess = _canMarkProcessed(email);
  const canView   = canEnter || canProcess;

  if (!canView) {
    panel.innerHTML = `<div class="sal-empty"><i class="fas fa-lock"></i><p>Access Denied</p></div>`;
    return;
  }

  const bodyHTML = _buildSectionBody(type, data, info, email, isAdmin, docId);

  panel.innerHTML = `
    <div class="sal-panel">
      <div class="sal-header">
        <button class="sal-back-btn" onclick="window._salBack()">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <div class="sal-header-info">
          <i class="${icon}" style="font-size:20px;color:var(--accent)"></i>
          <div>
            <div class="sal-title">${title}</div>
            <div class="sal-month">${info.label}</div>
          </div>
        </div>
        ${_statusBadge(status)}
      </div>
      ${bodyHTML}
    </div>`;

  _attachTotalListeners(type, items, data, docId);
}

// ── Pranav combined view ──────────────────────────────────────────────────────

async function _renderPranavView() {
  _lastRenderType = 'combined';
  const panel = _panel();
  if (!panel) return;
  panel.style.display = 'block';
  panel.innerHTML = `<div class="sal-loading"><i class="fas fa-circle-notch fa-spin"></i> Loading...</div>`;

  const info    = getSalaryMonthInfo();
  const email   = state.curUser?.email || '';
  const isAdmin = state.curUser?.role === 'Admin';

  let cashData = null, bankData = null;
  try {
    [cashData, bankData] = await Promise.all([
      getSalaryDoc(info.cashId),
      getSalaryDoc(info.bankId),
    ]);
  } catch(_) {}

  const cashStatus = cashData?.status || 'pending';
  const bankStatus = bankData?.status || 'pending';

  const cashBody = _buildSectionBody('cash', cashData, info, email, isAdmin, info.cashId);
  const bankBody = _buildSectionBody('bank', bankData, info, email, isAdmin, info.bankId);

  panel.innerHTML = `
    <div class="sal-panel">
      <div class="sal-header">
        <button class="sal-back-btn" onclick="window._salBack()">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <div class="sal-header-info">
          <i class="fas fa-money-check-dollar" style="font-size:20px;color:var(--accent)"></i>
          <div>
            <div class="sal-title">Salary Disbursement Overview</div>
            <div class="sal-month">${info.label}</div>
          </div>
        </div>
      </div>

      <div class="sal-pranav-section" id="salSection_cash">
        <div class="sal-pranav-section-header" onclick="window._salToggleSection('cash')">
          <span><i class="fas fa-money-bill-wave"></i> Cash Salary</span>
          <div style="display:flex;align-items:center;gap:8px">
            ${_statusBadge(cashStatus)}
            <i class="fas fa-chevron-down sal-section-chevron" id="salChevron_cash"></i>
          </div>
        </div>
        <div class="sal-section-body" id="salSectionBody_cash">
          ${cashBody}
        </div>
      </div>

      <div class="sal-pranav-section" id="salSection_bank">
        <div class="sal-pranav-section-header" onclick="window._salToggleSection('bank')">
          <span><i class="fas fa-building-columns"></i> Bank Salary &amp; Payments</span>
          <div style="display:flex;align-items:center;gap:8px">
            ${_statusBadge(bankStatus)}
            <i class="fas fa-chevron-down sal-section-chevron" id="salChevron_bank"></i>
          </div>
        </div>
        <div class="sal-section-body" id="salSectionBody_bank">
          ${bankBody}
        </div>
      </div>
    </div>`;

  _attachTotalListeners('cash', CASH_EMPLOYEES, cashData, info.cashId);
  _attachTotalListeners('bank', BANK_ITEMS, bankData, info.bankId);
}

// ── Public panel functions ────────────────────────────────────────────────────

export async function showCashSalary() {
  _hideOtherPanels();
  const email   = state.curUser?.email || '';
  const isAdmin = state.curUser?.role === 'Admin';
  if (email === PRANAV_EMAIL || isAdmin) {
    document.getElementById('pageHeader').textContent   = 'Salary Disbursement Overview';
    document.getElementById('searchWrap').style.display = 'none';
    document.getElementById('cardBox').style.display    = 'none';
    await _renderPranavView();
  } else {
    document.getElementById('pageHeader').textContent   = 'Cash Salary';
    document.getElementById('searchWrap').style.display = 'none';
    document.getElementById('cardBox').style.display    = 'none';
    await _renderSalaryPanel('cash');
  }
}

export async function showBankSalary() {
  _hideOtherPanels();
  const email   = state.curUser?.email || '';
  const isAdmin = state.curUser?.role === 'Admin';
  if (email === PRANAV_EMAIL || isAdmin) {
    document.getElementById('pageHeader').textContent   = 'Salary Disbursement Overview';
    document.getElementById('searchWrap').style.display = 'none';
    document.getElementById('cardBox').style.display    = 'none';
    await _renderPranavView();
  } else {
    document.getElementById('pageHeader').textContent   = 'Bank Salary & Payments';
    document.getElementById('searchWrap').style.display = 'none';
    document.getElementById('cardBox').style.display    = 'none';
    await _renderSalaryPanel('bank');
  }
}

export function hideSalaryPanel() {
  const p = _panel();
  if (p) { p.style.display = 'none'; p.innerHTML = ''; }
}

function _hideOtherPanels() {
  ['adminPanel','productsPanel','salesPanel','personalBankPanel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  hideSalaryPanel();
}

// ── window-level handlers ─────────────────────────────────────────────────────

window._salBack = function() {
  hideSalaryPanel();
  document.getElementById('searchWrap').style.display = '';
  document.getElementById('cardBox').style.display    = '';
  document.getElementById('pageHeader').textContent   = 'All Processes';
};

window._salToggleSection = function(type) {
  const body    = document.getElementById(`salSectionBody_${type}`);
  const chevron = document.getElementById(`salChevron_${type}`);
  if (!body) return;
  const collapsed = body.style.display === 'none';
  body.style.display    = collapsed ? '' : 'none';
  if (chevron) chevron.style.transform = collapsed ? '' : 'rotate(-90deg)';
};

// ── Submit / Process ──────────────────────────────────────────────────────────

window._salSubmit = async function(type, docId) {
  const items = type === 'cash' ? CASH_EMPLOYEES : BANK_ITEMS;

  // Fetch existing to preserve per-entry fields (done, mukesh_done, etc.)
  let existingData = null;
  try { existingData = await getSalaryDoc(docId); } catch(_) {}
  const existingEntries = existingData?.entries || {};

  const entries = {};
  items.forEach(it => {
    const val = Number(document.getElementById(`sal_${type}_${it.id}`)?.value) || 0;
    const existing = existingEntries[it.id] || {};
    entries[it.id] = { ...existing, name: it.name, amount: val };
  });

  const btn = document.querySelector('.sal-submit-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'; }

  try {
    await saveSalaryDoc(docId, {
      status:      'submitted',
      submittedBy: state.curUser?.email,
      submittedAt: new Date().toISOString(),
      entries,
    });
    showToast('Submitted successfully!', 'ok');
    await _rerender();
  } catch(e) {
    showToast('Save failed: ' + e.message, 'err');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit'; }
  }
};

window._salMarkProcessed = async function(type, docId) {
  if (!confirm('Mark this as Processed?')) return;
  const btn = document.querySelector('.sal-process-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'; }

  try {
    await saveSalaryDoc(docId, {
      status:      'processed',
      processedBy: state.curUser?.email,
      processedAt: new Date().toISOString(),
    });
    showToast('Marked as Processed!', 'ok');
    await _rerender();
  } catch(e) {
    showToast('Failed: ' + e.message, 'err');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-circle-check"></i> Mark as Processed'; }
  }
};

// ── Inline amount edit ────────────────────────────────────────────────────────

window._salEditAmt = function(type, docId, entryId, currentAmt) {
  // entryId may start with '_ce_' for custom entries
  const safeCellId = `sal_amt_cell_${type}_${entryId}`;
  const cell = document.getElementById(safeCellId);
  if (!cell) return;

  const input = document.createElement('input');
  input.type        = 'number';
  input.className   = 'sal-amt-input sal-amt-inline';
  input.value       = currentAmt || '';
  input.placeholder = '0';
  input.min         = '0';

  const saveBtn = document.createElement('button');
  saveBtn.className   = 'sal-save-inline-btn';
  saveBtn.title       = 'Save';
  saveBtn.innerHTML   = '<i class="fas fa-check"></i>';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'sal-cancel-inline-btn';
  cancelBtn.title     = 'Cancel';
  cancelBtn.innerHTML = '<i class="fas fa-times"></i>';

  cell.innerHTML = '';
  cell.appendChild(input);
  cell.appendChild(saveBtn);
  cell.appendChild(cancelBtn);
  input.focus();
  input.select();

  const pencilFn = `window._salEditAmt('${type}','${docId}','${entryId}',${currentAmt})`;

  const restore = (displayAmt) => {
    const pencil = `<button class="sal-edit-amt-btn" onclick="${pencilFn}" title="Edit amount"><i class="fas fa-pencil"></i></button>`;
    cell.innerHTML = `<span class="sal-amt-val" id="sal_amt_val_${type}_${entryId}">${_fmt(displayAmt)}</span>${pencil}`;
  };

  let _committed = false;

  const commit = async (doSave) => {
    if (_committed) return;
    _committed = true;
    input.removeEventListener('blur', onBlur);
    if (!doSave) { restore(currentAmt); return; }
    const newAmt = Number(input.value) || 0;
    saveBtn.disabled = true;
    try {
      if (entryId.startsWith('_ce_')) {
        const d = await getSalaryDoc(docId);
        const ces = (d?.customEntries || []).map(ce =>
          `_ce_${ce.id}` === entryId ? { ...ce, amount: newAmt } : ce
        );
        await updateSalaryField(docId, 'customEntries', ces);
      } else {
        await updateSalaryEntryField(docId, entryId, 'amount', newAmt);
      }
      showToast('Amount saved', 'ok');
      await _rerender();
    } catch(e) {
      showToast('Failed: ' + e.message, 'err');
      restore(currentAmt);
    }
  };

  // Prevent blur when clicking save/cancel buttons
  saveBtn.addEventListener('mousedown',   e => e.preventDefault());
  cancelBtn.addEventListener('mousedown', e => e.preventDefault());

  const onBlur = () => commit(true);
  saveBtn.onclick   = () => commit(true);
  cancelBtn.onclick = () => commit(false);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); commit(true); }
    if (e.key === 'Escape') { _committed = true; input.removeEventListener('blur', onBlur); restore(currentAmt); }
  });
  input.addEventListener('blur', onBlur);
};

// ── Inline name edit ──────────────────────────────────────────────────────────

window._salEditName = function(type, docId, entryId) {
  const textEl = document.getElementById(`sal_nametext_${type}_${entryId}`);
  if (!textEl) return;
  const currentName = textEl.textContent.trim();

  const input = document.createElement('input');
  input.className = 'sal-amt-input sal-name-inline';
  input.value     = currentName;
  input.style.minWidth = '140px';
  textEl.replaceWith(input);
  input.focus();
  input.select();

  const restore = (name) => {
    const span = document.createElement('span');
    span.className = 'sal-name-text';
    span.id        = `sal_nametext_${type}_${entryId}`;
    span.textContent = name;
    input.replaceWith(span);
  };

  let _committed = false;

  const commit = async (doSave) => {
    if (_committed) return;
    _committed = true;
    input.removeEventListener('blur', onBlur);
    const newName = input.value.trim();
    if (!doSave) { restore(currentName); return; }
    if (newName && newName !== currentName) {
      try {
        await updateSalaryField(docId, `nameOverrides.${entryId}`, newName);
        showToast('Name saved', 'ok');
      } catch(e) {
        showToast('Failed: ' + e.message, 'err');
      }
    }
    restore(newName || currentName);
  };

  const onBlur = () => commit(true);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); commit(true); }
    if (e.key === 'Escape') { commit(false); }
  });
  input.addEventListener('blur', onBlur);
};

// ── Cash done/pending toggles ─────────────────────────────────────────────────

window._salToggleCash = async function(docId, entryId, setDone) {
  try {
    await updateSalaryEntryField(docId, entryId, 'done', setDone);
    showToast(setDone ? 'Marked as Done' : 'Marked as Pending', 'ok');
    await _rerender();
  } catch(e) {
    showToast('Failed: ' + e.message, 'err');
  }
};

window._salToggleCashCustom = async function(docId, customId, setDone) {
  try {
    const d = await getSalaryDoc(docId);
    const ces = (d?.customEntries || []).map(ce =>
      ce.id === customId ? { ...ce, done: setDone } : ce
    );
    await updateSalaryField(docId, 'customEntries', ces);
    showToast(setDone ? 'Marked as Done' : 'Marked as Pending', 'ok');
    await _rerender();
  } catch(e) {
    showToast('Failed: ' + e.message, 'err');
  }
};

// ── Bank approval toggles ─────────────────────────────────────────────────────

window._salToggleBank = async function(docId, entryId, col) {
  try {
    const d = await getSalaryDoc(docId);
    const current = d?.entries?.[entryId]?.[col + '_done'] || false;
    await updateSalaryEntryField(docId, entryId, col + '_done', !current);
    showToast(!current ? 'Marked as Done' : 'Marked as Pending', 'ok');
    await _rerender();
  } catch(e) {
    showToast('Failed: ' + e.message, 'err');
  }
};

window._salToggleBankCustom = async function(docId, customId, col) {
  try {
    const d = await getSalaryDoc(docId);
    const ce = (d?.customEntries || []).find(c => c.id === customId);
    const current = ce?.[col + '_done'] || false;
    const ces = (d?.customEntries || []).map(c =>
      c.id === customId ? { ...c, [col + '_done']: !current } : c
    );
    await updateSalaryField(docId, 'customEntries', ces);
    showToast(!current ? 'Marked as Done' : 'Marked as Pending', 'ok');
    await _rerender();
  } catch(e) {
    showToast('Failed: ' + e.message, 'err');
  }
};

// ── Custom entry add/delete ───────────────────────────────────────────────────

window._salShowAddForm = function(type) {
  const form = document.getElementById(`salAddForm_${type}`);
  if (!form) return;
  form.style.display = 'flex';
  document.getElementById(`salAddName_${type}`)?.focus();
};

window._salHideAddForm = function(type) {
  const form = document.getElementById(`salAddForm_${type}`);
  if (form) form.style.display = 'none';
};

window._salSaveCustom = async function(type, docId) {
  const name = document.getElementById(`salAddName_${type}`)?.value.trim();
  const amt  = Number(document.getElementById(`salAddAmt_${type}`)?.value) || 0;
  if (!name) { showToast('Please enter a name', 'err'); return; }

  try {
    const d = await getSalaryDoc(docId);
    const ces = d?.customEntries || [];
    ces.push({
      id:     `_custom_${Date.now()}`,
      name,
      label:  'Custom',
      amount: amt,
    });
    await updateSalaryField(docId, 'customEntries', ces);
    showToast('Entry added', 'ok');
    await _rerender();
  } catch(e) {
    showToast('Failed: ' + e.message, 'err');
  }
};

window._salDeleteCustom = async function(docId, customId, type) {
  if (!confirm('Delete this custom entry?')) return;
  try {
    const d = await getSalaryDoc(docId);
    const ces = (d?.customEntries || []).filter(c => c.id !== customId);
    await updateSalaryField(docId, 'customEntries', ces);
    showToast('Entry deleted', 'ok');
    await _rerender();
  } catch(e) {
    showToast('Failed: ' + e.message, 'err');
  }
};

// ── WhatsApp send ─────────────────────────────────────────────────────────────

window._salSendWa = function(type) {
  const ta = document.getElementById(`salWaText_${type}`);
  if (!ta) return;
  const text = ta.value.trim();
  if (!text) { showToast('Message is empty', 'err'); return; }
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
};

// ── Reminder Popup (unchanged) ────────────────────────────────────────────────

function _showReminderPopup(reminders, info) {
  document.getElementById('salReminderOverlay')?.remove();

  const hasProcess = reminders.some(r => r.type === 'process');
  const hasEntry   = reminders.some(r => r.type === 'entry');
  const hasDone    = reminders.some(r => r.type === 'done');

  let icon, iconCls, title, sub;
  if (hasDone && !hasEntry && !hasProcess) {
    icon    = 'fas fa-circle-check';
    iconCls = 'sal-rem-green';
    title   = `${info.label} — Processed! ✓`;
    sub     = 'Pranav Sir ne salary process kar di.';
  } else if (hasProcess && !hasEntry) {
    icon    = 'fas fa-circle-check';
    iconCls = 'sal-rem-blue';
    title   = `${info.label} — Ready to Process`;
    sub     = 'Entries submitted. Please mark as processed.';
  } else {
    icon    = 'fas fa-bell';
    iconCls = 'sal-rem-amber';
    title   = `${info.label} Salary Due`;
    sub     = 'Salary entry window open hai.';
  }

  const itemsHtml = reminders.map(r => {
    const goFn = r.action === 'cash' ? 'showCashSalary()' : 'showBankSalary()';
    if (r.type === 'done') {
      return `<div class="sal-rem-item">
        <div class="sal-rem-item-left">
          <i class="fas fa-circle-check" style="color:#16a34a"></i>
          <div>
            <div class="sal-rem-item-label">${r.label}</div>
            <div class="sal-rem-item-sub">${r.month} — by ${_displayName(r.by || '')}</div>
          </div>
        </div>
        <button class="sal-rem-go sal-rem-go-green" onclick="window._salCloseReminder();${goFn}">
          View <i class="fas fa-arrow-right"></i>
        </button>
      </div>`;
    }
    const goLabel = r.type === 'process' ? 'Mark Processed' : 'Enter Now';
    const icoType = r.type === 'process' ? 'fas fa-circle-check' : 'fas fa-pen-to-square';
    return `<div class="sal-rem-item">
      <div class="sal-rem-item-left">
        <i class="${icoType}"></i>
        <div>
          <div class="sal-rem-item-label">${r.label}</div>
          <div class="sal-rem-item-sub">${r.month}</div>
        </div>
      </div>
      <button class="sal-rem-go${r.type === 'process' ? ' sal-rem-go-green' : ''}"
              onclick="window._salCloseReminder();${goFn}">
        ${goLabel} <i class="fas fa-arrow-right"></i>
      </button>
    </div>`;
  }).join('');

  document.body.insertAdjacentHTML('beforeend', `
  <div class="sal-rem-overlay" id="salReminderOverlay">
    <div class="sal-rem-card">
      <button class="sal-rem-x" onclick="window._salCloseReminder()">
        <i class="fas fa-xmark"></i>
      </button>
      <div class="sal-rem-icon-wrap ${iconCls}">
        <i class="${icon}"></i>
      </div>
      <div class="sal-rem-title">${title}</div>
      <div class="sal-rem-sub">${sub}</div>
      <div class="sal-rem-items">${itemsHtml}</div>
    </div>
  </div>`);

  requestAnimationFrame(() =>
    document.getElementById('salReminderOverlay')?.classList.add('active')
  );
}

window._salCloseReminder = function() {
  const ov = document.getElementById('salReminderOverlay');
  if (!ov) return;
  ov.classList.remove('active');
  setTimeout(() => ov.remove(), 260);
};

export async function checkSalaryReminder() {
  const email   = state.curUser?.email || '';
  const isAdmin = state.curUser?.role === 'Admin';

  const canCash = email === MUKESH_EMAIL || isAdmin;
  const canBank = email === SATIJA_EMAIL || isAdmin;
  const canProc = email === PRANAV_EMAIL || isAdmin;

  if (!canCash && !canBank && !canProc) return;

  const info = getSalaryMonthInfo();
  const now  = new Date();
  const day  = now.getDate();
  const yr   = now.getFullYear();
  const mo   = now.getMonth();

  // Special first window: July 21–31 2026 (deployment date onwards for July salary)
  // Regular window: 3rd–15th of every month (getSalaryMonthInfo auto-returns previous month in this range)
  const inEntryWindow = (yr === 2026 && mo === 6 && day >= 21) || (day >= 3 && day <= 15);

  const today = `${yr}-${String(mo + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  let cashData = null, bankData = null;
  try { cashData = await getSalaryDoc(info.cashId); } catch(_) {}
  try { bankData = await getSalaryDoc(info.bankId); } catch(_) {}

  const cashStatus = cashData?.status || 'pending';
  const bankStatus = bankData?.status || 'pending';

  const reminders = [];

  if (canCash && inEntryWindow && cashStatus === 'pending') {
    const key = `salRem_cash_${info.cashId}_${today}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, '1');
      reminders.push({ type: 'entry', label: 'Cash Salary', month: info.label, action: 'cash' });
    }
  }
  if (canBank && inEntryWindow && bankStatus === 'pending') {
    const key = `salRem_bank_${info.bankId}_${today}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, '1');
      reminders.push({ type: 'entry', label: 'Bank Salary & Payments', month: info.label, action: 'bank' });
    }
  }

  if (canProc && cashStatus === 'submitted')
    reminders.push({ type: 'process', label: 'Cash Salary', month: info.label, action: 'cash' });
  if (canProc && bankStatus === 'submitted')
    reminders.push({ type: 'process', label: 'Bank Salary & Payments', month: info.label, action: 'bank' });

  if (email === MUKESH_EMAIL && cashStatus === 'processed') {
    const key = `salRem_done_cash_${info.cashId}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, '1');
      reminders.push({ type: 'done', label: 'Cash Salary', month: info.label, action: 'cash', by: cashData?.processedBy });
    }
  }
  if (email === SATIJA_EMAIL && bankStatus === 'processed') {
    const key = `salRem_done_bank_${info.bankId}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, '1');
      reminders.push({ type: 'done', label: 'Bank Salary & Payments', month: info.label, action: 'bank', by: bankData?.processedBy });
    }
  }

  if (!reminders.length) return;
  _showReminderPopup(reminders, info);
}
