import { getSalesDashConfig } from '../services/sales.service.js';
import { state } from '../state.js';

let _busy = false;
let _cfg  = null;

// Manager → Mode sheets, MD → Time sheets
const SHEETS = {
  manager: { monthly: 'monthlyMode', biweekly: 'biweeklyMode', weekly: 'weeklyMode' },
  md:      { monthly: 'monthlyTime', biweekly: 'biweeklyTime', weekly: 'weeklyTime'  }
};

const PERIOD_BTNS = [
  { key: 'monthly',  label: 'Monthly', icon: 'fa-calendar-days' },
  { key: 'biweekly', label: '15-Day',  icon: 'fa-calendar-week' },
  { key: 'weekly',   label: 'Weekly',  icon: 'fa-calendar'      },
];

function _canMDView() {
  const u = state.curUser;
  return u?.role === 'Admin'
    || u?.deptAccess?.includes('All')
    || u?.deptAccess?.includes('SalesDashMD');
}

function _buildCard(view) {
  const sid   = _cfg.spreadsheetId;
  const isManager = view === 'manager';

  const btns = PERIOD_BTNS.map(({ key, label, icon }) => {
    const gidEntry = _cfg.sheets?.[SHEETS[view][key]];
    const gid = typeof gidEntry === 'object' ? gidEntry.gid : String(gidEntry ?? '');
    const url = gid ? `https://docs.google.com/spreadsheets/d/${sid}/edit#gid=${gid}` : '#';
    return `<a class="btn sdash-btn-${view}" href="${url}" target="_blank" rel="noopener noreferrer">
              <i class="fas ${icon}"></i> ${label}
            </a>`;
  }).join('');

  return `
    <div class="card sdash-card-${view}">
      <div class="card-inner">
        <i class="card-cat-icon fas ${isManager ? 'fa-user-tie' : 'fa-crown'}"></i>
        <span class="card-tag sdash-tag-${view}">${isManager ? 'Dispatch View' : 'Sales View'}</span>
        <div class="card-title">${isManager ? 'Dispatch' : 'Sales'}</div>
        <div class="card-divider"></div>
        <div class="actions">${btns}</div>
      </div>
    </div>`;
}

function _buildReportCard() {
  return `
    <div class="card sdash-card-report">
      <div class="card-inner">
        <i class="card-cat-icon fas fa-chart-bar"></i>
        <span class="card-tag sdash-tag-report">GSTR-3B</span>
        <div class="card-title">Sales Report (GSTR-3B)</div>
        <div class="card-divider"></div>
        <div class="actions">
          <button class="btn sdash-btn-report" onclick="secureOpen('Sales Report (GSTR-3B)','sheet')">
            <i class="fas fa-table-cells-large"></i> Open Sheet
          </button>
        </div>
      </div>
    </div>`;
}

export async function renderSalesDashboard(container) {
  container.innerHTML = '<div class="sdash-grid"><div class="sdash-loader"><i class="fas fa-spinner fa-spin"></i> Loading…</div></div>';
  if (_busy) return;
  _busy = true;
  try {
    _cfg = await getSalesDashConfig();
    let html = _buildCard('manager');
    if (_canMDView()) html += _buildCard('md');
    html += _buildReportCard();
    container.innerHTML = `<div class="sdash-grid">${html}</div>`;
  } catch (err) {
    container.innerHTML = `
      <div class="sdash-grid">
        <div class="sdash-error">
          <i class="fas fa-circle-exclamation"></i>
          <p>${err.message || String(err)}</p>
        </div>
      </div>`;
  } finally {
    _busy = false;
  }
}

export function sdashSetView() {} // window compat stub
