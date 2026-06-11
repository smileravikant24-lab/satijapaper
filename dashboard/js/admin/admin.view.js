import { $, escapeHtml }  from '../ui/dom.js';
import { state }          from '../state.js';
import { setActive }      from '../ui/sidebar.view.js';
import { listUsers }      from '../services/users.service.js';
export async function showAdmin(el){
  if (state.curUser?.role !== 'Admin') return;
  setActive(el);
  $('pageHeader').innerText      = 'User Management';
  $('cardBox').style.display     = 'none';
  $('adminPanel').classList.add('visible');
  $('searchWrap').style.display  = 'none';
  await loadAndRenderUsers();
}

export async function loadAndRenderUsers(){
  const tb = $('tblBody');
  tb.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-3)">
                    <i class="fas fa-circle-notch fa-spin"></i> Loading...
                  </td></tr>`;
  try {
    state.cachedUsers = await listUsers();
    renderTable();
  } catch(e){
    tb.innerHTML = `<tr><td colspan="6" style="color:var(--danger);padding:16px;text-align:center">
                      Failed: ${escapeHtml(e.message)}
                    </td></tr>`;
  }
}


function renderTable(){
  const tb = $('tblBody');
  tb.innerHTML = '';

  if (!state.cachedUsers.length){
    tb.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-3)">
                      No users found.
                    </td></tr>`;
    return;
  }

  const html = state.cachedUsers.map(u => {
    const deptPills = (u.deptAccess || [])
      .map(d => `<span class="ap ap-${d}">${d === 'Management' ? 'MIS' : d}</span>`)
      .join('');

    let procHtml = '';
    if (u.role === 'Admin'){
      procHtml = '<span style="font-size:10px;color:var(--text-3)">Full access</span>';
    } else if (u.processAccess && u.processAccess.length){
      procHtml = u.processAccess.map(p => {
        const la = u.linkAccess && u.linkAccess[p];
        const li = la && la.length
          ? ` <span style="font-size:9px;color:var(--text-2);font-weight:600">[${la.join(',')}]</span>`
          : '';
        return `<span class="proc-badge">${escapeHtml(p)}${li}</span>`;
      }).join('');
    } else {
      procHtml = '<span style="font-size:10px;color:var(--text-3)">All in dept</span>';
    }

    const isSelf  = u.id === state.curUser.id;
    const roleCls = u.role.toLowerCase().replace(' ', '.');
    return `<tr>
      <td><strong>${escapeHtml(u.email || '—')}</strong></td>
      <td>${escapeHtml(u.name || '—')}</td>
      <td><span class="role-pill ${roleCls}">${escapeHtml(u.role)}</span></td>
      <td><div class="access-pills">${deptPills || '<span style="font-size:10px;color:var(--text-3)">None</span>'}</div></td>
      <td style="max-width:220px">${procHtml}</td>
      <td style="white-space:nowrap">
        <button class="tbl-act edit" onclick="editUser('${u.id}')"><i class="fas fa-pen"></i></button>
        ${!isSelf
          ? `<button class="tbl-act delete" onclick="deleteUserAct('${u.id}','${escapeHtml(u.name || u.email)}')">
               <i class="fas fa-trash-can"></i>
             </button>`
          : ''}
      </td>
    </tr>`;
  }).join('');

  tb.innerHTML = html;
}
