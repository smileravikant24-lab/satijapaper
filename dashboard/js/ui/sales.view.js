import { getSalesDashConfig, fetchGvizSheet, parseSheetTable } from '../services/sales.service.js';

let _view   = 'manager';
let _period = 'monthly';
let _month  = '';
let _allRows = [];
let _allCols = [];
let _allMeta = {};
let _charts  = [];
let _busy    = false;
let _gcReady = false;
let _refreshTimer  = null;
let _spreadsheetId = '';
let _currentGid    = '';

const SHEET_KEY = {
  manager: { monthly: 'monthlyTime', biweekly: 'biweeklyTime', weekly: 'weeklyTime' },
  md:      { monthly: 'monthlyMode', biweekly: 'biweeklyMode', weekly: 'weeklyMode' }
};
const PERIOD_LABEL = { monthly: 'Month', biweekly: 'Period', weekly: 'Week' };
const REFRESH_MS   = 5 * 60 * 1000;

async function _ensureGoogleCharts() {
  if (_gcReady) return;
  if (!window.google?.charts) {
    await new Promise((resolve, reject) => {
      const s   = document.createElement('script');
      s.src     = 'https://www.gstatic.com/charts/loader.js';
      s.onload  = resolve;
      s.onerror = () => reject(new Error('Google Charts failed to load — check your connection.'));
      document.head.appendChild(s);
    });
  }
  await new Promise(resolve => {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(resolve);
  });
  _gcReady = true;
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
  _view = 'manager'; _period = 'monthly'; _month = '';
  _clearRefreshTimer();
  container.innerHTML = _shellHTML();
  await _load();
}

function _clearRefreshTimer() {
  if (_refreshTimer) { clearTimeout(_refreshTimer); _refreshTimer = null; }
}

function _destroyCharts() {
  _charts.forEach(c => { try { c.destroy(); } catch (_) {} });
  _charts = [];
}

async function _load() {
  if (_busy) return;
  _clearRefreshTimer();
  _busy = true;
  const body = document.getElementById('sdashBody');
  if (!body) { _busy = false; return; }

  body.innerHTML = '<div class="sdash-loader"><i class="fas fa-spinner fa-spin"></i> Loading data…</div>';
  _destroyCharts();

  try {
    await _ensureGoogleCharts();
    const cfg      = await getSalesDashConfig();
    const key      = SHEET_KEY[_view][_period];
    const gidEntry = cfg.sheets?.[key];
    if (!gidEntry) throw new Error(`Sheet "${key}" not configured in Firestore (config/salesDashboard).`);
    const gid   = typeof gidEntry === 'object' ? gidEntry.gid : String(gidEntry);
    _spreadsheetId = cfg.spreadsheetId;
    _currentGid    = gid;
    const table = await fetchGvizSheet(cfg.spreadsheetId, gid);
    const { cols, rows, meta } = parseSheetTable(table);

    console.log('[SalesDash] cols:', cols, '| rows:', rows.length, '| key:', key);

    _allCols = cols; _allRows = rows; _allMeta = meta; _month = '';
    _renderAll(body, cols, rows, meta);

    _refreshTimer = setTimeout(() => _load(), REFRESH_MS);
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

function _renderAll(container, cols, rows, meta) {
  if (!rows.length) {
    container.innerHTML = '<div class="sdash-error"><i class="fas fa-table"></i><p>No data rows found in this sheet.</p></div>';
    return;
  }

  const periods     = [...new Set(rows.map(r => String(r[0] ?? '').trim()).filter(Boolean))];
  const periodLabel = PERIOD_LABEL[_period] || 'Period';
  const pillsHtml   = periods.length > 1
    ? `<div class="sdash-month-row">
         <span class="sdash-month-label"><i class="fas fa-filter"></i> ${periodLabel}:</span>
         <div class="sdash-month-pills">
           <button class="sdash-mpill active" onclick="sdashSetMonth('',this)">All</button>
           ${periods.map(p => `<button class="sdash-mpill" onclick="sdashSetMonth('${_esc(p)}',this)">${p}</button>`).join('')}
         </div>
       </div>`
    : '';

  const now       = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const dateRange = (meta.startDate && meta.endDate)
    ? `<span class="sdash-daterange"><i class="fas fa-calendar-days"></i> ${meta.startDate} – ${meta.endDate}</span>`
    : '';
  const sheetUrl  = `https://docs.google.com/spreadsheets/d/${_spreadsheetId}/edit#gid=${_currentGid}`;

  container.innerHTML = `
    <div class="sdash-top-bar">
      ${dateRange}
      <div class="sdash-refresh-info">
        <span class="sdash-last-updated" id="sdashLastUpdated"><i class="fas fa-circle-check"></i> Updated ${now}</span>
        <a class="sdash-open-sheet-btn" href="${sheetUrl}" target="_blank" rel="noopener noreferrer" title="Open this sheet in Google Sheets">
          <i class="fas fa-arrow-up-right-from-square"></i> Open Sheet
        </a>
        <button class="sdash-refresh-btn" onclick="sdashRefresh()" title="Refresh data">
          <i class="fas fa-rotate-right"></i>
        </button>
      </div>
    </div>
    ${pillsHtml}
    <div class="sdash-charts-row">
      <div class="sdash-chart-card">
        <div class="sdash-chart-title"><i class="fas fa-truck-fast"></i> Dispatch Comparison</div>
        <div class="sdash-gchart-wrap" id="sdashChartDispatch"></div>
      </div>
      <div class="sdash-chart-card">
        <div class="sdash-chart-title"><i class="fas fa-indian-rupee-sign"></i> Amount Comparison</div>
        <div class="sdash-gchart-wrap" id="sdashChartAmount"></div>
      </div>
    </div>
    <div class="sdash-table-card">
      ${_buildTable(cols, rows)}
    </div>`;

  requestAnimationFrame(() => {
    _makeGoogleChart('sdashChartDispatch', cols, rows, false);
    _makeGoogleChart('sdashChartAmount',   cols, rows, true);
  });
}

function _renderFiltered() {
  const body = document.getElementById('sdashBody');
  if (!body || !_allCols.length) return;
  _destroyCharts();

  const rows    = _month ? _allRows.filter(r => String(r[0] ?? '').trim() === _month) : _allRows;
  const dispDiv = document.getElementById('sdashChartDispatch');
  const amtDiv  = document.getElementById('sdashChartAmount');
  const tblWrap = body.querySelector('.sdash-table-card');

  if (dispDiv) requestAnimationFrame(() => {
    _makeGoogleChart('sdashChartDispatch', _allCols, rows, false);
    _makeGoogleChart('sdashChartAmount',   _allCols, rows, true);
  });
  if (tblWrap) tblWrap.innerHTML = _buildTable(_allCols, rows);
}

function _findCol(cols, ...keywords) {
  const kws = keywords.map(k => k.toLowerCase());
  return cols.findIndex(c => kws.every(k => c.toLowerCase().includes(k)));
}

function _makeGoogleChart(divId, cols, rows, isAmount) {
  const container = document.getElementById(divId);
  if (!container || !window.google?.visualization) return;

  let colA, colB, labelA, labelB, colorA, colorB;

  if (!isAmount) {
    colA = _findCol(cols, 'on time', 'dispatch');
    if (colA === -1) colA = _findCol(cols, 'ontime', 'dispatch');
    if (colA === -1) colA = _findCol(cols, 'ot', 'dispatch');
    colB = _findCol(cols, 'delay', 'dispatch');
    if (colB === -1) colB = _findCol(cols, 'delayed', 'dispatch');
    if (colB === -1) colB = _findCol(cols, 'late', 'dispatch');
    labelA = 'On Time Dispatch'; colorA = '#22c55e';
    labelB = 'Delay Dispatch';   colorB = '#ef4444';
  } else {
    colA = _findCol(cols, 'total', 'amount');
    if (colA === -1) colA = _findCol(cols, 'total', 'amt');
    if (colA === -1) colA = _findCol(cols, 'gross', 'amount');
    colB = _findCol(cols, 'on time', 'amount');
    if (colB === -1) colB = _findCol(cols, 'ontime', 'amount');
    if (colB === -1) colB = _findCol(cols, 'ot', 'amount');
    labelA = 'Total Amount';   colorA = '#22c55e';
    labelB = 'On Time Amount'; colorB = '#ef4444';
  }

  if (colA === -1 && colB === -1) {
    container.insertAdjacentHTML('beforeend',
      `<div class="sdash-no-col">Columns not detected. Found: ${cols.join(', ')}</div>`);
    return;
  }

  const dt = new google.visualization.DataTable();
  dt.addColumn('string', 'Period');
  if (colA !== -1) dt.addColumn('number', labelA);
  if (colB !== -1) dt.addColumn('number', labelB);

  rows.forEach(r => {
    const row = [String(r[0] ?? '').trim() || '—'];
    if (colA !== -1) row.push(_toNum(r[colA]));
    if (colB !== -1) row.push(_toNum(r[colB]));
    dt.addRow(row);
  });

  // Format numbers in tooltips
  const fmt = isAmount
    ? new google.visualization.NumberFormat({ prefix: '₹', pattern: '#,##0' })
    : new google.visualization.NumberFormat({ pattern: '#,##0' });
  let fmtIdx = 1;
  if (colA !== -1) { fmt.format(dt, fmtIdx); fmtIdx++; }
  if (colB !== -1) { fmt.format(dt, fmtIdx); }

  const colors = [];
  if (colA !== -1) colors.push(colorA);
  if (colB !== -1) colors.push(colorB);

  const options = {
    chartArea:   { left: 72, top: 36, right: 16, bottom: 68, width: '100%', height: '64%' },
    bar:         { groupWidth: '65%' },
    colors,
    legend:      { position: 'top', textStyle: { fontSize: 11, bold: true, color: '#1e293b' } },
    hAxis: {
      textStyle:       { fontSize: 10, color: '#64748b' },
      slantedText:     true,
      slantedTextAngle: 38
    },
    vAxis: {
      title:           isAmount ? 'Amount (₹)' : 'Dispatch Count',
      titleTextStyle:  { fontSize: 10, color: '#94a3b8', italic: false },
      textStyle:       { fontSize: 10, color: '#64748b' },
      gridlines:       { color: '#e2e8f0' },
      minorGridlines:  { color: 'transparent' },
      minValue: 0,
      format: isAmount ? 'short' : '#,##0'
    },
    backgroundColor: 'transparent',
    fontName:        'inherit',
    tooltip:         { textStyle: { fontSize: 12 } },
    animation:       { startup: true, duration: 700, easing: 'out' }
  };

  const chart = new google.visualization.ColumnChart(container);
  chart.draw(dt, options);

  // Re-draw on container resize
  const ro = new ResizeObserver(() => chart.draw(dt, options));
  ro.observe(container);

  _charts.push({ destroy: () => { try { ro.disconnect(); chart.clearChart(); } catch (_) {} } });
}

function _buildTable(cols, rows) {
  const head = cols.map(c => `<th>${c}</th>`).join('');
  const body = rows.map(r => {
    const cells = cols.map((c, i) => {
      const v = r[i];
      if (v == null || v === '') return '<td class="sdash-td-na">—</td>';
      const isAmt = /amount|value|inr|₹/i.test(c);
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
function _esc(s)   { return String(s).replace(/'/g, "\\'"); }

export function sdashSetView(view, btn) {
  _view = view; _period = 'monthly'; _month = '';
  document.querySelectorAll('.sdash-vtab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.sdash-ptab').forEach((b, i) => b.classList.toggle('active', i === 0));
  _load();
}

export function sdashSetPeriod(period, btn) {
  _period = period; _month = '';
  document.querySelectorAll('.sdash-ptab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  _load();
}

export function sdashSetMonth(month, btn) {
  _month = month;
  document.querySelectorAll('.sdash-mpill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  _renderFiltered();
}

export function sdashRefresh() {
  _load();
}
