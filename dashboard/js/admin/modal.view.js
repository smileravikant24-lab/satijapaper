import { $, showToast }                       from '../ui/dom.js';
import { state }                              from '../state.js';
import { emailToId }                          from '../services/auth.service.js';
import { saveUserProfile, deleteUserProfile } from '../services/users.service.js';
import { loadAndRenderUsers }                 from './admin.view.js';
import {
  buildProcList,
  selectAllProcs
} from './proc-builder.js';

export function onRoleChange(){
  $('accessSection').style.display = $('mRole').value === 'Admin' ? 'none' : '';
}

export function openModal(uid){
  $('editUserId').value       = '';
  $('mName').value            = '';
  $('mUser').value            = '';
  $('mRole').value            = 'Team Member';
  $('modalTitle').textContent = 'Add User Profile';

  if (uid){
    const u = state.cachedUsers.find(x => x.id === uid);
    if (u){
      $('editUserId').value       = u.id;
      $('mName').value            = u.name;
      $('mUser').value            = u.email;
      $('mRole').value            = u.role;
      $('modalTitle').textContent = 'Edit User Profile';

      const seed = {...(u.linkAccess || {}), __procs__: u.processAccess || []};
      buildProcList(seed, u.deptAccess || []);
    } else {
      buildProcList();
    }
  } else {
    buildProcList();
  }

  onRoleChange();
  $('userModal').classList.add('show');
}

export const editUser   = id => openModal(id);
export const closeModal = () => $('userModal').classList.remove('show');

export async function saveUser(){
  const id    = $('editUserId').value;
  const name  = $('mName').value.trim();
  const email = $('mUser').value.trim().toLowerCase();
  const role  = $('mRole').value;

  if (!name || !email){ showToast('Fill in name and email.', 'err'); return; }

  const deptAccess  = [];
  let processAccess = [];
  let linkAccess    = {};

  if (role !== 'Admin') {
    document.querySelectorAll('#procListContainer .dept-access-cb:checked').forEach(cb => {
      deptAccess.push(cb.value);
    });
    document.querySelectorAll('#procListContainer .proc-master-cb:not(.dept-access-cb):checked').forEach(cb => {
      const pName = cb.value;
      processAccess.push(pName);
      const lr = cb.closest('.proc-row').querySelector('.proc-link-row');
      if (lr){
        const checked = [];
        lr.querySelectorAll('input[data-link]:checked').forEach(lcb => checked.push(lcb.dataset.link));
        const total = lr.querySelectorAll('input[data-link]').length;
        if (checked.length > 0 && checked.length < total) linkAccess[pName] = checked;
      }
    });
  }

  const saveBtn = document.querySelector('.modal-foot .mbtn.pri');
  const orig    = saveBtn.innerHTML;
  saveBtn.innerHTML = 'Saving...';
  saveBtn.disabled  = true;
  try {
    const docId = id || emailToId(email);
    await saveUserProfile(docId, {name, email, role, deptAccess, processAccess, linkAccess});
    closeModal();
    await loadAndRenderUsers();
    showToast('User saved', 'ok');
  } catch(e){
    showToast('Save failed: ' + e.message, 'err');
  } finally {
    saveBtn.innerHTML = orig;
    saveBtn.disabled  = false;
  }
}

export async function deleteUserAct(id, name){
  if (!confirm(`Delete profile for "${name}"?`)) return;
  try {
    await deleteUserProfile(id);
    await loadAndRenderUsers();
    showToast('Deleted', 'ok');
  } catch(e){
    showToast('Delete failed', 'err');
  }
}

export { selectAllProcs };
