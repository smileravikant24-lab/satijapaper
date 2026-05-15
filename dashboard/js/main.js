// ============================================================
// MAIN ENTRY POINT
// Bootstraps the app, listens to auth state, exposes the few
// functions needed by inline onclick handlers in index.html.
// ============================================================

import { $, showToast }           from './ui/dom.js';
import { state }                  from './state.js';
import { onAuth, fetchOrCreateProfile } from './services/auth.service.js';

// Views
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

// ---- App entry on successful auth ---------------------------------------
function enterApp(user){
  state.curUser = user;
  $('loginOverlay').classList.add('hidden');
  $('appContainer').classList.add('visible');
  paintSidebarUser(user);
  updateCounts();
  renderFiltered();
}

// ---- Wire up auth state listener ----------------------------------------
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

// ---- Expose handlers used by inline onclick="" in HTML ------------------
// (Inline handlers can only reach window-scoped functions.)
Object.assign(window, {
  // login
  handleLogin, handleLogout, forgotPass, togglePwd,
  // nav + cards
  filterCat, runFilter, secureOpen,
  // admin panel
  showAdmin,
  // modal
  openModal, closeModal, editUser, saveUser, deleteUserAct,
  onRoleChange, selectAllProcs
});
