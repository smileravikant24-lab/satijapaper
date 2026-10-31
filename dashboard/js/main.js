import { state }                        from './state.js';
import { onAuth, fetchOrCreateProfile } from './services/auth.service.js';
import {
  handleLogin, handleLogout, forgotPass, togglePwd,
  showLoginScreen, showCheckingSession
}                                       from './ui/login.view.js';

// Expose login handlers to window for inline onclicks in index.html
Object.assign(window, {
  handleLogin,
  handleLogout,
  forgotPass,
  togglePwd
});

showCheckingSession();

onAuth(async fbUser => {
  if (!fbUser) {
    state.curUser = null;
    showLoginScreen();
    return;
  }
  try {
    const profile = await fetchOrCreateProfile(fbUser);
    // Dynamically load the dashboard application ONLY after login is verified!
    const { startDashboard } = await import('./app.js?v=20261031b');
    startDashboard(profile);
  } catch (err) {
    console.error('Profile load failed:', err);
    showLoginScreen();
  }
});
