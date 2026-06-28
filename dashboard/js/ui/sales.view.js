import { getSalesDashConfig, fetchGvizSheet, parseSheetTable } from '../services/sales.service.js';

let _view   = 'manager';
let _period = 'monthly';
let _charts = [];
let _busy   = false;
let _chartJsReady = false;

const SHEET_KEY = {
  manager: { monthly: 'monthlyTime', biweekly: 'biweeklyTime', weekly: 'weeklyTime' },
  md:      { monthly: 'monthlyMode', biweekly: 'biweeklyMode', weekly: 'weeklyMode' }
};

async function _ensureChartJs() {
  if (_chartJsReady || window.Chart) { _chartJsReady = true; return; }
  return new Promise((resolve, reject) => {
    const s   = document.createElement('script');
    s.src     = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js';
    s.onload  = () => { _chartJsReady = true; resolve(); };
    s.onerror = () => reject(new Error('Chart.js failed to load — check your connection.'));
    document.head.appendChild(s);
  });
}

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
    <div class="sdash-period-tabs">
      <button class="sdash-ptab active" id="sdashPMonthly"  onclick="sdashSetPeriod('monthly',this)">Monthly</button>
      <button class="sdash-ptab"        id="sdashPBiweekly" onclick="sdashSetPeriod('biweekly',this)">15-Day</button>
      <button class="sdash-ptab"        id="sdashPWeekly"   onclick="sdashSetPeriod('weekly',this)">Weekly</button>
    </div>
  </div>
  <div id="sdashBody">
    <div class="sdash-loader"><i class="fas fa-spinner fa-spin"></i> Loading data…</div>
  </div>
</div>`;
}

export async function renderSalesDashboard(container) {
  _view   = 'manager';
  _period = 'monthly';
  container.innerHTML = _shellHTML();
  await _load();
}

function _destroyCharts() {
  _charts.forEach(c => { try { c.destroy(); } catch (_) {} });
  _charts = [];
}

async function _load() {
  if (_busy) return;
  _busy = true;
  const body = document.getElementById('sdashBody');
  if (!body) { _busy = false; return; }

  body.innerHTML = '<div class="sdash-loader"><i class="fas fa-spinner fa-spin"></i> Loading data…</div>';
  _destroyCharts();

  try {
    await _ensureChartJs();
    const cfg = await getSalesDashConfig();
    const key = SHEET_KEY[_view][_period];
    const gidEntry = cfg.sheets?.[key];
    if (!gidEntry) throw new Error(`Sheet "${key}" not configured in Firestore (config/salesDashboard).`);
    const gid   = typeof gidEntry === 'object' ? gidEntry.gid : String(gidEntry);
    const table = await fetchGvizSheet(cfg.spreadsheetId, gid);
    const { cols, rows, meta } = parseSheetTable(table);
    _render(body, cols, rows, meta);
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

function _render(container, cols, rows, meta) {
  if (!rows.length) {
    container.innerHTML = '<div class="sdash-error"><i class="fas fa-table"></i><p>No data rows found in this sheet.</p></div>';
    return;
  }

  const dateRange = (meta.startDate && meta.endDate)
    ? `<div class="sdash-daterange"><i class="fas fa-calendar-days"></i> ${meta.startDate} – ${meta.endDate}</div>`
    : '';

  container.innerHTML = `
    ${dateRange}
    <div class="sdash-charts-row">
      <div class="sdash-chart-card">
        <div class="sdash-chart-title"><i class="fas fa-truck-fast"></i> Dispatch Summary</div>
        <div class="sdash-canvas-wrap"><canvas id="sdashChartDispatch"></canvas></div>
      </div>
      <div class="sdash-chart-card">
        <div class="sdash-chart-title"><i class="fas fa-indian-rupee-sign"></i> Amount Summary</div>
        <div class="sdash-canvas-wrap"><canvas id="sdashChartAmount"></canvas></div>
      </div>
    </div>
    <div class="sdash-table-card">
      ${_buildTable(cols, rows)}
    </div>`;

  requestAnimationFrame(() => {
    _makeChart('sdashChartDispatch', cols, rows, false);
    _makeChart('sdashChartAmount',   cols, rows, true);
  });
}

// Find column index — tries combined keyword match first, then any keyword
function _findCol(cols, ...keywords) {
  const kws = keywords.map(k => k.toLowerCase());
  let idx = cols.findIndex(c => kws.every(k => c.toLowerCase().includes(k)));
  if (idx !== -1) return idx;
  return cols.findIndex(c => kws.some(k => c.toLowerCase().includes(k)));
}

function _makeChart(canvasId, cols, rows, isAmount) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.Chart) return;

  const labels = rows.map(r => String(r[0] ?? '').trim());
  let colA, colB, labelA, labelB, colorA, colorB;

  if (!isAmount) {
    colA = _findCol(cols, 'on time', 'dispatch');
    if (colA === -1) colA = _findCol(cols, 'ontime', 'qty');
    if (colA === -1) colA = _findCol(cols, 'on time');
    colB = _findCol(cols, 'delay', 'dispatch');
    if (colB === -1) colB = _findCol(cols, 'delayed');
    if (colB === -1) colB = _findCol(cols, 'delay');
    labelA = 'On Time Dispatch'; colorA = '#22c55e';
    labelB = 'Delay Dispatch';   colorB = '#ef4444';
  } else {
    colA = _findCol(cols, 'total', 'amount');
    if (colA === -1) colA = _findCol(cols, 'total amt');
    if (colA === -1) colA = _findCol(cols, 'total');
    colB = _findCol(cols, 'on time', 'amount');
    if (colB === -1) colB = _findCol(cols, 'ontime', 'amount');
    if (colB === -1) colB = _findCol(cols, 'received', 'amount');
    labelA = 'Total Amount';   colorA = '#3b82f6';
    labelB = 'On Time Amount'; colorB = '#22c55e';
  }

  const dataA = (colA !== -1) ? rows.map(r => _toNum(r[colA])) : null;
  const dataB = (colB !== -1) ? rows.map(r => _toNum(r[colB])) : null;

  if (!dataA && !dataB) {
    const card = canvas.closest('.sdash-chart-card');
    if (card) card.insertAdjacentHTML('beforeend', '<div class="sdash-no-col">Column not found — check sheet column names.</div>');
    return;
  }

  const datasets = [];
  if (dataA) datasets.push({ label: labelA, data: dataA, backgroundColor: colorA + 'bb', borderColor: colorA, borderWidth: 1.5, borderRadius: 5, borderSkipped: false });
  if (dataB) datasets.push({ label: labelB, data: dataB, backgroundColor: colorB + 'bb', borderColor: colorB, borderWidth: 1.5, borderRadius: 5, borderSkipped: false });

  const chart = new window.Chart(canvas, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 11, weight: '700' }, boxWidth: 13, padding: 14 } },
        tooltip: {
          callbacks: {
            label: ctx => isAmount ? ` ₹${_fmt(ctx.parsed.y)}` : ` ${ctx.parsed.y}`
          }
        }
      },
      scales: {
        x: { ticks: { font: { size: 10 }, maxRotation: 40, color: '#64748b' }, grid: { display: false } },
        y: {
          beginAtZero: true,
          ticks: { font: { size: 10 }, color: '#64748b', callback: v => isAmount ? '₹' + _fmtK(v) : v },
          grid: { color: 'rgba(0,0,0,.06)' }
        }
      }
    }
  });
  _charts.push(chart);
}

function _buildTable(cols, rows) {
  const head = cols.map(c => `<th>${c}</th>`).join('');
  const body = rows.map(r => {
    const cells = cols.map((c, i) => {
      const v = r[i];
      if (v == null || v === '') return '<td class="sdash-td-na">—</td>';
      const isAmt = /amount|value|rate|inr|₹/i.test(c);
      if (typeof v === 'number') {
        return `<td class="sdash-num">${isAmt ? '₹' + _fmt(v) : v}</td>`;
      }
      return `<td>${v}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  return `
    <div class="sdash-tbl-scroll">
      <table class="sdash-tbl">
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}

function _toNum(v) { const n = Number(v); return isNaN(n) ? 0 : n; }
function _fmt(n)   { return new Intl.NumberFormat('en-IN').format(Math.round(n)); }
function _fmtK(n) {
  if (n >= 1e7) return (n / 1e7).toFixed(1) + 'Cr';
  if (n >= 1e5) return (n / 1e5).toFixed(1) + 'L';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
  return n;
}

export function sdashSetView(view, btn) {
  _view   = view;
  _period = 'monthly';
  document.querySelectorAll('.sdash-vtab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.sdash-ptab').forEach((b, i) => b.classList.toggle('active', i === 0));
  _load();
}

export function sdashSetPeriod(period, btn) {
  _period = period;
  document.querySelectorAll('.sdash-ptab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  _load();
}
