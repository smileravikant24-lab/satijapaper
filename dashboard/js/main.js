import { $, showToast }           from './ui/dom.js';
import { state }                  from './state.js';
import { onAuth, fetchOrCreateProfile } from './services/auth.service.js';
import {
  handleLogin, handleLogout, forgotPass, togglePwd,
  showLoginScreen, showCheckingSession
}                                 from './ui/login.view.js';
import {
  updateCounts, filterCat, runFilter, paintSidebarUser
}                                 from './ui/sidebar.view.js';
import { renderFiltered, secureOpen } from './ui/cards.view.js';
import { showAdmin }              from './admin/admin.view.js';
import {
  openModal, closeModal, editUser, saveUser, deleteUserAct,
  onRoleChange, selectAllProcs
}                                 from './admin/modal.view.js';

function enterApp(user){
  state.curUser = user;
  $('loginOverlay').classList.add('hidden');
  $('appContainer').classList.add('visible');
  paintSidebarUser(user);
  updateCounts();
  renderFiltered();
}
showCheckingSession();
onAuth(async fbUser => {
  if (!fbUser){
    state.curUser = null;
    showLoginScreen();
    return;
  }
  try {
    const profile = await fetchOrCreateProfile(fbUser);
    enterApp(profile);
  } catch(err){
    console.error('Profile load failed:', err);
    showLoginScreen();
  }
});

Object.assign(window, {
  handleLogin, handleLogout, forgotPass, togglePwd,
  filterCat, runFilter, secureOpen,
  showAdmin,
  openModal, closeModal, editUser, saveUser, deleteUserAct,
  onRoleChange, selectAllProcs
});
