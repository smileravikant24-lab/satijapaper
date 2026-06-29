import { getSalesDashConfig } from '../services/sales.service.js';

let _view = 'manager';
let _busy = false;
let _cfg  = null;

const SHEET_KEY = {
  manager: { monthly: 'monthlyTime', biweekly: 'biweeklyTime', weekly: 'weeklyTime' },
  md:      { monthly: 'monthlyMode', biweekly: 'biweeklyMode', weekly: 'weeklyMode' }
};

const SHEET_CARDS = [
  { key: 'monthly',  label: 'Monthly Summary',  icon: 'fa-calendar-days', desc: 'Month-wise dispatch & financial data' },
  { key: 'biweekly', label: '15-Day Summary',   icon: 'fa-calendar-week', desc: '15-day period dispatch & financial data' },
  { key: 'weekly',   label: 'Weekly Summary',   icon: 'fa-calendar',      desc: 'Week-wise dispatch & financial data' },
];

function _shellHTML() {
  return `
<div class="sdash-wrap">
  <div class="sdash-header-row">
    <div class="sdash-view-tabs">
      <button class="sdash-vtab active" id="sdashVManager" onclick="sdashSetView('manager',this)">
        <i class="fas fa-user-tie"></i> Manager View
      </button>
      <button class="sdash-vtab" id="sdashVMD" onclick="sdashSetView('md',this)">
        <i class="fas fa-crown"></i> MD View
      </button>
    </div>
  </div>
  <div id="sdashBody">
    <div class="sdash-loader"><i class="fas fa-spinner fa-spin"></i> Loading…</div>
  </div>
</div>`;
}

export async function renderSalesDashboard(container) {
  _view = 'manager';
  container.innerHTML = _shellHTML();
  await _load();
}

async function _load() {
  if (_busy) return;
  _busy = true;
  const body = document.getElementById('sdashBody');
  if (!body) { _busy = false; return; }
  body.innerHTML = '<div class="sdash-loader"><i class="fas fa-spinner fa-spin"></i> Loading…</div>';
  try {
    _cfg = await getSalesDashConfig();
    _renderCards();
  } catch (err) {
    body.innerHTML = `
      <div class="sdash-error">
        <i class="fas fa-circle-exclamation"></i>
        <p>${err.message || String(err)}</p>
      </div>`;
  } finally {
    _busy = false;
  }
}

function _renderCards() {
  const body = document.getElementById('sdashBody');
  if (!body || !_cfg) return;

  const cards = SHEET_CARDS.map(({ key, label, icon, desc }) => {
    const sheetKey = SHEET_KEY[_view][key];
    const gidEntry = _cfg.sheets?.[sheetKey];
    const gid = typeof gidEntry === 'object' ? gidEntry.gid : String(gidEntry ?? '');
    const url = gid
      ? `https://docs.google.com/spreadsheets/d/${_cfg.spreadsheetId}/edit#gid=${gid}`
      : '#';
    return `
      <a class="sdash-sheet-card" href="${url}" target="_blank" rel="noopener noreferrer">
        <div class="sdash-sheet-card-icon"><i class="fas ${icon}"></i></div>
        <div class="sdash-sheet-card-info">
          <div class="sdash-sheet-card-label">${label}</div>
          <div class="sdash-sheet-card-desc">${desc}</div>
        </div>
        <i class="fas fa-arrow-up-right-from-square sdash-sheet-card-arrow"></i>
      </a>`;
  }).join('');

  body.innerHTML = `<div class="sdash-sheet-cards">${cards}</div>`;
}

export function sdashSetView(view, btn) {
  _view = view;
  document.querySelectorAll('.sdash-vtab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (_cfg) _renderCards(); else _load();
}
