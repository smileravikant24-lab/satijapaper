import { state }                          from '../state.js';
import { showToast }                      from './dom.js';
import { getSalaryMonthInfo, getSalaryDoc, saveSalaryDoc } from '../services/salary.service.js';

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

function _buildTable(items, entries, editable, type) {
  let lastLabel = '';
  const rows = items.map(it => {
    const amt = entries?.[it.id]?.amount ?? '';
    const labelCell = it.label !== lastLabel
      ? `<td class="sal-label-cell" rowspan="X">${it.label}</td>`
      : '';
    lastLabel = it.label;

    const via = it.via ? `<span class="sal-via">${it.via}</span>` : '';
    const note = it.note ? `<span class="sal-note">${it.note}</span>` : '';

    const amtCell = editable
      ? `<td><input type="number" class="sal-amt-input" id="sal_${type}_${it.id}"
              value="${amt}" placeholder="0" min="0"></td>`
      : `<td class="sal-amt-val">${_fmt(amt)}</td>`;

    return `<tr>
      <td class="sal-name-cell">${it.name}${via}${note}</td>
      ${amtCell}
    </tr>`;
  });
  return rows.join('');
}

function _calcTotal(items, entries) {
  return items.reduce((s, it) => s + (Number(entries?.[it.id]?.amount) || 0), 0);
}

async function _renderSalaryPanel(type) {
  const panel = _panel();
  if (!panel) return;
  panel.style.display = 'block';
  panel.innerHTML = `<div class="sal-loading"><i class="fas fa-circle-notch fa-spin"></i> Loading...</div>`;

  const info = getSalaryMonthInfo();
  const docId = type === 'cash' ? info.cashId : info.bankId;
  const items = type === 'cash' ? CASH_EMPLOYEES : BANK_ITEMS;
  const title = type === 'cash' ? 'Cash Salary' : 'Bank Salary & Payments';
  const icon  = type === 'cash' ? 'fas fa-money-bill-wave' : 'fas fa-building-columns';

  let data = null;
  try { data = await getSalaryDoc(docId); } catch(_) {}

  const status  = data?.status || 'pending';
  const entries = data?.entries || {};
  const email   = state.curUser?.email || '';
  const isAdmin = state.curUser?.role === 'Admin';

  const canEnter    = type === 'cash' ? _canEnterCash(email) : _canEnterBank(email);
  const canProcess  = _canMarkProcessed(email);
  const editable    = canEnter && status === 'pending';
  const total       = _calcTotal(items, entries);

  // Pranav/Admin sees both sections — we don't restrict reading
  const canView = canEnter || canProcess;
  if (!canView) {
    panel.innerHTML = `<div class="sal-empty"><i class="fas fa-lock"></i><p>Access Denied</p></div>`;
    return;
  }

  const whoEnters = type === 'cash' ? MUKESH_EMAIL : SATIJA_EMAIL;
  const waText    = encodeURIComponent(`${info.label} ${title} processed ho gayi. ✓ — Pranav Sir`);
  const waBtn     = (status === 'processed' && canProcess)
    ? `<a class="sal-wa-btn" href="https://wa.me/?text=${waText}" target="_blank" rel="noopener noreferrer">
         <i class="fab fa-whatsapp"></i> Inform ${_displayName(whoEnters)}
       </a>` : '';

  const processedBanner = status === 'processed'
    ? `<div class="sal-processed-banner">
         <i class="fas fa-circle-check"></i>
         <span>${info.label} — Processed by ${_displayName(data.processedBy || '')}</span>
         ${waBtn}
       </div>` : '';

  const submittedBanner = status === 'submitted' && !canProcess
    ? `<div class="sal-submitted-banner">
         <i class="fas fa-paper-plane"></i>
         Submitted. Awaiting Pranav Sir's confirmation.
       </div>` : '';

  const actionBtn = (() => {
    if (status === 'processed') return '';
    if (editable)
      return `<button class="sal-submit-btn" onclick="window._salSubmit('${type}','${docId}')">
                <i class="fas fa-paper-plane"></i> Submit ${info.label} ${title}
              </button>`;
    if (status === 'submitted' && canProcess)
      return `<button class="sal-process-btn" onclick="window._salMarkProcessed('${type}','${docId}')">
                <i class="fas fa-circle-check"></i> Mark as Processed
              </button>`;
    return '';
  })();

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

      ${processedBanner}
      ${submittedBanner}

      <div class="sal-table-wrap">
        <table class="sal-table">
          <thead>
            <tr>
              <th>Name / Description</th>
              <th style="width:140px">${editable ? 'Enter Amount (₹)' : 'Amount'}</th>
            </tr>
          </thead>
          <tbody>${_buildTable(items, entries, editable, type)}</tbody>
          <tfoot>
            <tr class="sal-total-row">
              <td><strong>Total</strong></td>
              <td id="salTotal_${type}" class="sal-amt-val"><strong>${_fmt(total)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>

      ${actionBtn}
    </div>`;

  // Live total update
  if (editable) {
    panel.querySelectorAll('.sal-amt-input').forEach(inp => {
      inp.addEventListener('input', () => {
        const t = items.reduce((s, it) => {
          const v = Number(document.getElementById(`sal_${type}_${it.id}`)?.value) || 0;
          return s + v;
        }, 0);
        const el = document.getElementById(`salTotal_${type}`);
        if (el) el.innerHTML = `<strong>${_fmt(t)}</strong>`;
      });
    });
  }
}

// ── Public functions (exposed to window) ──────────────────────────────────────

export async function showCashSalary() {
  _hideOtherPanels();
  document.getElementById('pageHeader').textContent   = 'Cash Salary';
  document.getElementById('searchWrap').style.display = 'none';
  document.getElementById('cardBox').style.display    = 'none';
  await _renderSalaryPanel('cash');
}

export async function showBankSalary() {
  _hideOtherPanels();
  document.getElementById('pageHeader').textContent   = 'Bank Salary & Payments';
  document.getElementById('searchWrap').style.display = 'none';
  document.getElementById('cardBox').style.display    = 'none';
  await _renderSalaryPanel('bank');
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

// window-level handlers for onclick

window._salBack = function() {
  hideSalaryPanel();
  document.getElementById('searchWrap').style.display = '';
  document.getElementById('cardBox').style.display    = '';
  document.getElementById('pageHeader').textContent   = 'All Processes';
};

window._salSubmit = async function(type, docId) {
  const items = type === 'cash' ? CASH_EMPLOYEES : BANK_ITEMS;
  const entries = {};
  items.forEach(it => {
    const val = Number(document.getElementById(`sal_${type}_${it.id}`)?.value) || 0;
    entries[it.id] = { name: it.name, amount: val };
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
    await _renderSalaryPanel(type);
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
    await _renderSalaryPanel(type);
  } catch(e) {
    showToast('Failed: ' + e.message, 'err');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-circle-check"></i> Mark as Processed'; }
  }
};

// ── Salary Reminder Popup ─────────────────────────────────────────────────────

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
  const mo   = now.getMonth(); // 0-indexed (July = 6)

  // Special first window: July 21–31 2026 (deployment date onwards for July salary)
  // Regular window: 3rd–15th of every month (getSalaryMonthInfo auto-returns previous month in this range)
  const inEntryWindow = (yr === 2026 && mo === 6 && day >= 21) || (day >= 3 && day <= 15);

  // Once-per-day key includes today's date so it resets daily
  const today = `${yr}-${String(mo + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  let cashData = null, bankData = null;
  try { cashData = await getSalaryDoc(info.cashId); } catch(_) {}
  try { bankData = await getSalaryDoc(info.bankId); } catch(_) {}

  const cashStatus = cashData?.status || 'pending';
  const bankStatus = bankData?.status || 'pending';

  const reminders = [];

  // Entry reminders — once per day (localStorage resets daily), within entry window, while pending
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

  // Process reminders — every login for Pranav while status is submitted (no day limit)
  if (canProc && cashStatus === 'submitted')
    reminders.push({ type: 'process', label: 'Cash Salary', month: info.label, action: 'cash' });
  if (canProc && bankStatus === 'submitted')
    reminders.push({ type: 'process', label: 'Bank Salary & Payments', month: info.label, action: 'bank' });

  // Done notifications — once ever (per salary month) for Mukesh Ji / Sandeep Ji when processed
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
