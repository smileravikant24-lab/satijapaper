import { db, doc, getDoc } from './firebase.js';

let _cfg = null;

export async function getSalesDashConfig() {
  if (_cfg) return _cfg;
  const snap = await getDoc(doc(db, 'config', 'salesDashboard'));
  if (!snap.exists()) throw new Error('Sales dashboard not configured in Firestore.');
  _cfg = snap.data();
  return _cfg;
}

// Fetch a sheet tab via Google Visualization Query API
// Requires the spreadsheet to be publicly viewable (Anyone with link → View)
export async function fetchGvizSheet(spreadsheetId, gid) {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${gid}&headers=0`;
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  const text = await res.text();
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
  if (!match) {
    if (/sign.?in|login/i.test(text))
      throw new Error('Sheet is private — set the Google Sheet to "Anyone with link → View".');
    throw new Error('Unexpected response from Google Sheets. Check sharing settings.');
  }
  const obj = JSON.parse(match[1]);
  if (obj.status !== 'ok') {
    const e = obj.errors?.[0];
    throw new Error(e?.detailed_message || e?.message || 'Google Sheets error');
  }
  return obj.table;
}

// Parse raw GViz table (all rows, no predefined header count)
// Finds the actual data header row by searching for period/mode keyword in first few columns
export function parseSheetTable(table) {
  if (!table?.rows?.length) return { cols: [], rows: [], meta: {} };

  const raw = table.rows.map(r =>
    (r.c || []).map(cell => {
      if (!cell || cell.v == null) return null;
      // Keep numbers as numbers; prefer formatted string for everything else
      return typeof cell.v === 'number' ? cell.v : (cell.f ?? cell.v);
    })
  );

  // Find header row: a row where col 0-3 has a short period/mode keyword AND
  // the row has at least 2 non-null cells (rules out merged title rows like
  // "Monthly Dispatch & Financial Summary" which match "month" but have 1 cell).
  const KW = /^(week|month|period|mode|day|transport|date)/i;
  let hIdx = -1, startCol = 0;
  outer: for (let i = 0; i < Math.min(raw.length, 15); i++) {
    for (let c = 0; c < Math.min((raw[i] || []).length, 4); c++) {
      const cell = String(raw[i][c] ?? '').trim();
      if (!KW.test(cell)) continue;
      if (cell.length > 30) continue;                               // skip long title strings
      const nonNull = (raw[i] || []).filter(v => v != null && String(v).trim() !== '').length;
      if (nonNull < 2) continue;                                    // skip merged/single-cell rows
      hIdx = i; startCol = c; break outer;
    }
  }
  if (hIdx === -1) { hIdx = 0; startCol = 0; }

  // Trim cols to those with non-empty labels
  const allCols = (raw[hIdx] || []).slice(startCol).map(v => String(v ?? '').trim());
  const colLen  = allCols.findLastIndex(v => v !== '') + 1;
  const cols    = allCols.slice(0, colLen);

  const dataRows = raw.slice(hIdx + 1)
    .map(r => (r || []).slice(startCol, startCol + cols.length))
    // Keep rows that have at least one non-null, non-empty cell (removes blank spacer rows)
    .filter(r => r.some(v => v != null && String(v).trim() !== ''));

  // Extract metadata (Start Date / End Date) from rows above header
  const meta = {};
  for (let i = 0; i < hIdx; i++) {
    const row = raw[i] || [];
    for (let j = 0; j < row.length - 1; j++) {
      const k = String(row[j] ?? '').trim().toLowerCase().replace(/[:\s]/g, '');
      if (k === 'startdate' && row[j + 1] != null) meta.startDate = String(row[j + 1]);
      if (k === 'enddate'   && row[j + 1] != null) meta.endDate   = String(row[j + 1]);
    }
  }
  console.log('[Sheet] hIdx:', hIdx, '| startCol:', startCol, '| cols:', cols, '| dataRows:', dataRows.length);
  if (dataRows.length === 0) console.log('[Sheet] first 5 raw rows:', raw.slice(0, 5));
  return { cols, rows: dataRows, meta };
}
