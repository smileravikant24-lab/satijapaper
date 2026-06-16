import { $, escapeHtml, showToast } from './dom.js';
import { state }                    from '../state.js';
import { DB }                       from '../data.js';
import { canAccessProc, canAccessLink } from './access.js';
import { resolveProcessUrl }        from '../services/process.service.js';

export async function secureOpen(procName, linkType){
  const item = DB.find(d => d.name === procName);
  if (!item){                               showToast('Process not found.',  'err'); return; }
  if (!canAccessProc(state.curUser, item)){ showToast('Access denied.',      'err'); return; }
  if (!canAccessLink(state.curUser, procName, linkType)){
    showToast('No access to this link.', 'err'); return;
  }

  if (linkType === 'aiqa'){
    window.open(
      'https://chatgpt.com/g/g-6a0c9090a45c81919ac3a2682dfe1dfa-satija-paper-ai-command-center',
      '_blank', 'noopener,noreferrer'
    );
    return;
  }

  if (linkType === 'videoAI'){
    window.open(
      'https://drive.google.com/file/d/1cDYnQ2xb6-y0HgZdXtd8W5cci5sZrGO_/view?usp=sharing',
      '_blank', 'noopener,noreferrer'
    );
    return;
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

  // ── Documents: horizontal file-list design ──
  if (state.curCat === 'Documents') {
    const DRIVE_URLS = {
      'Satija Paper Documents':   'https://drive.google.com/drive/folders/1TY7m4KyQqF2l9yHfy8ZcaM8rWUHlgZLr?usp=sharing',
      'SP Team Members Documents':'https://drive.google.com/drive/folders/1jtkH6QsT8MzMmOwnkrtWdFzWU6vWvQ1z?usp=sharing',
      'Satija Family Documents':  'https://drive.google.com/drive/folders/18UcntWtEEj9mB0av6Zk4kABstyKqXwaj?usp=sharing',
    };
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
      let action = '';
      if (it.links.folder){
        const url = DRIVE_URLS[it.name] || '#';
        action = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="doc-open-btn" style="background:${st.bg}">
                    <i class="fas fa-arrow-up-right-from-square"></i> Open
                  </a>`;
      } else {
        action = `<button onclick="secureOpen('${pn}','${lk}')" class="doc-open-btn" style="background:${st.bg}">
                    <i class="fas fa-arrow-up-right-from-square"></i> Open
                  </button>`;
      }
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

  const isAdmin = state.curUser?.role === 'Admin';
  const html    = accessible.map((it, i) => {
    const cc = it.cat === 'My System' ? 'My' : (it.cat === 'Documents' ? 'Family' : it.cat);

    let btns = '';
    btns += buildButton(it, !!it.links.fms,        'fms',        'btn-fms',    'fas fa-table-cells',      'FMS');
    btns += buildButton(it, !!it.links.form,       'form',       'btn-form',   'fab fa-google-drive',     'Form');

    if (it.name === 'Help Ticket'){
      btns += buildButton(it, !!it.links.sheet && isAdmin, 'sheet', 'btn-sheet', 'fas fa-file-spreadsheet', 'All Tickets');
    } else if (it.name !== 'Dashboard of All FMS') {
      btns += buildButton(it, !!it.links.sheet,    'sheet',      'btn-sheet',  'fas fa-file-spreadsheet', 'Sheet');
    }

    btns += buildButton(it, !!it.links.check,      'check',      'btn-check',  'fas fa-square-check',     'Checklist');
    btns += buildButton(it, !!it.links.video,      'video',      'btn-video',  'fas fa-circle-play',      'Training');
    btns += buildButton(it, !!it.links.videoBCI,   'videoBCI',  'btn-video',  'fas fa-circle-play',      'Training (BCI)');
    btns += buildButton(it, !!it.links.videoAI,    'videoAI',   'btn-video',  'fas fa-circle-play',      'Training Video AI');
    btns += buildButton(it, !!it.links.dashEmp,    'dashEmp',   'btn-dash',   'fas fa-chart-pie',        'Emp Dashboard');
    btns += buildButton(it, !!it.links.dashPC,     'dashPC',    'btn-dash',   'fas fa-chart-line',       'PC Dashboard');
    if (it.name === 'Dashboard of All FMS') {
      btns += buildButton(it, !!it.links.sheet,    'sheet',      'btn-sheet',  'fas fa-table-cells-large','PC Sheet');
    }
    btns += buildButton(it, !!it.links.gasForm,    'gasForm',   'btn-gas',    'fas fa-bolt',             'Form');
    btns += buildButton(it, !!it.links.admin,      'admin',     'btn-admin',  'fas fa-user-gear',        'Admin Panel');
    btns += buildButton(it, !!it.links.gpDash,     'gpDash',    'btn-gp',     'fas fa-chart-column',     'GP Dashboard');
    btns += buildButton(it, !!it.links.stockDash,  'stockDash', 'btn-stock',  'fas fa-boxes-stacking',   'Stock Dash');
    btns += buildButton(it, !!it.links.folder,     'folder',    'btn-folder', 'fas fa-folder-open',      'View Folder');
    btns += buildButton(it, !!it.links.terms,      'terms',     'btn-form',   'fas fa-file-contract',    'T&amp;C');
    btns += buildButton(it, !!it.links.drive,      'drive',     'btn-form',   'fab fa-google-drive',     'Drive');
    btns += buildButton(it, !!it.links.guidelineForm,'guidelineForm','btn-form','fas fa-clipboard-list', it.name === 'Double A Retail Customer' ? 'Marketing Guideline' : 'Guideline');

    // ── AI Q&A button ─────────────────────────────────────────
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
