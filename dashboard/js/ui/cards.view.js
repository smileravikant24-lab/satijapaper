// ============================================================
// CARDS VIEW - renders the process card grid
// ============================================================

import { $, escapeHtml, showToast } from './dom.js';
import { state }                    from '../state.js';
import { DB }                       from '../data.js';
import { canAccessProc, canAccessLink } from './access.js';
import { resolveProcessUrl }        from '../services/process.service.js';

/**
 * Open a process link via the secure Cloud Function.
 * Exposed on window for inline onclick handlers.
 */
export async function secureOpen(procName, linkType){
  const item = DB.find(d => d.name === procName);
  if (!item){                               showToast('Process not found.',  'err'); return; }
  if (!canAccessProc(state.curUser, item)){ showToast('Access denied.',      'err'); return; }
  if (!canAccessLink(state.curUser, procName, linkType)){
    showToast('No access to this link.', 'err'); return;
  }

  // ── AI Q&A: direct external link — skip Cloud Function ──────
  if (linkType === 'aiqa'){
    window.open(
      'https://chatgpt.com/g/g-6a0c9090a45c81919ac3a2682dfe1dfa-satija-paper-ai-command-center',
      '_blank', 'noopener,noreferrer'
    );
    return;
  }
  // ────────────────────────────────────────────────────────────

  showToast('Opening...', 'info');
  const result = await resolveProcessUrl(procName, linkType);
  if (result.ok) window.open(result.url, '_blank', 'noopener');
  else           showToast(result.error, 'err');
}

/** Build a single action button's HTML, or '' if user has no access. */
function buildButton(item, hasUrl, linkType, cls, icon, label, adminOnly = false){
  const isAdmin = state.curUser?.role === 'Admin';
  if (!hasUrl)                                             return '';
  if (adminOnly && !isAdmin)                               return '';
  if (!canAccessLink(state.curUser, item.name, linkType))  return '';
  const pn = item.name.replace(/'/g, "\\'");
  return `<button onclick="secureOpen('${pn}','${linkType}')" class="btn ${cls}">
            <i class="${icon}"></i>${label}
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

  const accessible = data.filter(it => canAccessProc(state.curUser, it));
  if (!accessible.length){
    box.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>No processes found.</p></div>';
    return;
  }

  const isAdmin = state.curUser?.role === 'Admin';
  const html    = accessible.map((it, i) => {
    const cc = it.cat === 'My System' ? 'My' : it.cat;

    let btns = '';
    btns += buildButton(it, !!it.links.fms,       'fms',       'btn-fms',    'fas fa-table-cells',      'FMS');
    btns += buildButton(it, !!it.links.form,       'form',      'btn-form',   'fab fa-google-drive',     'Form');

    if (it.name === 'Help Ticket'){
      btns += buildButton(it, !!it.links.sheet && isAdmin, 'sheet', 'btn-sheet', 'fas fa-file-spreadsheet', 'All Tickets');
    } else {
      btns += buildButton(it, !!it.links.sheet,    'sheet',     'btn-sheet',  'fas fa-file-spreadsheet', 'Sheet');
    }

    btns += buildButton(it, !!it.links.check,      'check',     'btn-check',  'fas fa-square-check',     'Checklist');
    btns += buildButton(it, !!it.links.video,      'video',     'btn-video',  'fas fa-circle-play',      'Training');
    btns += buildButton(it, !!it.links.videoBCI,   'videoBCI',  'btn-video',  'fas fa-circle-play',      'Training (BCI)');
    btns += buildButton(it, !!it.links.dashEmp,    'dashEmp',   'btn-dash',   'fas fa-chart-pie',        'Emp Dashboard');
    btns += buildButton(it, !!it.links.dashPC,     'dashPC',    'btn-dash',   'fas fa-chart-line',       'PC Dashboard');
    btns += buildButton(it, !!it.links.admin,      'admin',     'btn-admin',  'fas fa-user-gear',        'Admin Panel');
    btns += buildButton(it, !!it.links.gpDash,     'gpDash',    'btn-gp',     'fas fa-chart-column',     'GP Dashboard');
    btns += buildButton(it, !!it.links.stockDash,  'stockDash', 'btn-stock',  'fas fa-boxes-stacking',   'Stock Dash');
    btns += buildButton(it, !!it.links.folder,     'folder',    'btn-folder', 'fas fa-folder-open',      'View Folder');

    // ── AI Q&A button (Sales only) ───────────────────────────
    btns += buildButton(it, !!it.links.aiqa,       'aiqa',      'btn-aiqa',   'fas fa-robot',            'AI Q&amp;A');
    // ────────────────────────────────────────────────────────

    if (!btns){
      btns = '<div style="grid-column:span 2;text-align:center;color:#ccc;font-size:11px;padding:6px">No links configured</div>';
    }

    // ── data-name added for MutationObserver DA-hiding ───────
    return `<div class="card cat-${cc}" data-name="${escapeHtml(it.name)}" style="animation-delay:${i*.028}s">
      <div class="card-inner">
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

/**
 * Apply current search + category filters and re-render.
 * Sidebar / search input both call this.
 */
export function renderFiltered(){
  const raw    = $('searchInput').value.toLowerCase();
  const terms  = raw.split(/\s+/).filter(Boolean);
  const filtered = DB.filter(it => {
    if (!canAccessProc(state.curUser, it)) return false;
    const matchesCat = state.curCat === 'All' || it.cat === state.curCat;
    const haystack   = `${it.name} ${it.pc} ${it.solver} ${it.exec} ${it.cat}`.toLowerCase();
    return matchesCat && terms.every(t => haystack.includes(t));
  });
  renderCards(filtered);
}
