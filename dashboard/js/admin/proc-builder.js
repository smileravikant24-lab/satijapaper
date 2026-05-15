// ============================================================
// PROC LIST BUILDER - constructs the process-access editor
// inside the user modal. Handles the master checkbox + nested
// link-pill checkboxes for each process.
// ============================================================

import { $ }                  from '../ui/dom.js';
import { DB, LINK_META }      from '../data.js';

/** Return the link types actually configured for a process. */
const getAvailableLinks = item =>
  Object.keys(LINK_META).filter(k => !!item.links[k]);

/** Show/hide the "individual processes selected" info note. */
export function updateAccessModeNote(){
  const any = document.querySelectorAll('#procListContainer .proc-master-cb:checked').length > 0;
  $('accessModeNote').style.display = any ? '' : 'none';
}

/**
 * Build the entire process list inside the modal.
 * @param {Object} existingLinkAccess
 *        Map of procName -> string[] (allowed link types).
 *        Plus '__procs__': string[] of pre-selected process names.
 */
export function buildProcList(existingLinkAccess = {}){
  const container = $('procListContainer');
  container.innerHTML = '';
  const cats = [...new Set(DB.map(d => d.cat))];

  cats.forEach(cat => {
    const items   = DB.filter(d => d.cat === cat);
    const grpDiv  = document.createElement('div');
    grpDiv.className = 'proc-group';
    grpDiv.innerHTML = `
      <div class="proc-group-label"
           style="font-size:10px;font-weight:800;text-transform:uppercase;color:var(--text-3);margin-bottom:6px;">
        ${cat}
      </div>`;

    items.forEach(it => grpDiv.appendChild(buildProcRow(it, existingLinkAccess)));
    container.appendChild(grpDiv);
  });
  updateAccessModeNote();
}

/** Build one row (master checkbox + link pills) for a single process. */
function buildProcRow(item, existingLinkAccess){
  const availLinks = getAvailableLinks(item);
  const procRow    = document.createElement('div');
  procRow.className = 'proc-row';
  const isChecked  = existingLinkAccess.__procs__?.includes(item.name);

  // master checkbox
  const procHeader = document.createElement('div');
  procHeader.className = 'proc-row-header';
  const procCb = document.createElement('input');
  procCb.type      = 'checkbox';
  procCb.className = 'proc-master-cb';
  procCb.value     = item.name;
  if (isChecked) procCb.checked = true;
  procHeader.innerHTML = `<span class="proc-name">${item.name}</span>`;
  procHeader.prepend(procCb);
  procRow.appendChild(procHeader);

  if (availLinks.length > 0){
    const linkRow = document.createElement('div');
    linkRow.className = 'proc-link-row';
    linkRow.style.display = isChecked ? 'flex' : 'none';

    const existingLinks = existingLinkAccess[item.name] || [];
    availLinks.forEach(lk => {
      const meta = LINK_META[lk];
      const pill = document.createElement('label');
      pill.className = `link-pill ${meta.cls}`;
      const cb = document.createElement('input');
      cb.type           = 'checkbox';
      cb.dataset.proc   = item.name;
      cb.dataset.link   = lk;
      cb.style.display  = 'none';
      if (!existingLinks.length || existingLinks.includes(lk)){
        cb.checked = true;
        pill.classList.add('link-checked');
      }
      pill.innerHTML = `<i class="${meta.icon}"></i> ${meta.label}`;
      pill.prepend(cb);
      pill.addEventListener('click', e => {
        e.preventDefault();
        cb.checked = !cb.checked;
        pill.classList.toggle('link-checked', cb.checked);
      });
      linkRow.appendChild(pill);
    });
    procRow.appendChild(linkRow);

    procCb.addEventListener('change', () => {
      linkRow.style.display = procCb.checked ? 'flex' : 'none';
      if (procCb.checked){
        linkRow.querySelectorAll('label.link-pill').forEach(p => {
          p.querySelector('input').checked = true;
          p.classList.add('link-checked');
        });
      }
      updateAccessModeNote();
    });
  } else {
    procCb.addEventListener('change', updateAccessModeNote);
  }

  return procRow;
}

/** Bulk-toggle every process and its links. */
export function selectAllProcs(value){
  document.querySelectorAll('#procListContainer .proc-master-cb').forEach(cb => {
    cb.checked = value;
    const lr = cb.closest('.proc-row').querySelector('.proc-link-row');
    if (lr){
      lr.style.display = value ? 'flex' : 'none';
      if (value){
        lr.querySelectorAll('label.link-pill').forEach(p => {
          p.querySelector('input').checked = true;
          p.classList.add('link-checked');
        });
      }
    }
  });
  updateAccessModeNote();
}
