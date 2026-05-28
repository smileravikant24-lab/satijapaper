import { $ }                              from './dom.js';
import { login, resetPassword, logout }   from '../services/auth.service.js';
import { showToast }                      from './dom.js';

// ---- Status messages -----------------------------------------------------

function showError(msg){
  $('loginErrorMsg').textContent = msg;
  $('loginError').classList.add('show');
  $('loginSuccess').classList.remove('show');
}
function showSuccess(msg){
  $('loginSuccessMsg').textContent = msg;
  $('loginSuccess').classList.add('show');
  $('loginError').classList.remove('show');
}
function clearMessages(){
  $('loginError').classList.remove('show');
  $('loginSuccess').classList.remove('show');
}
function setLoading(on){
  const b = $('loginBtn');
  b.disabled = on;
  b.innerHTML = on
    ? '<i class="fas fa-circle-notch fa-spin"></i> Signing in...'
    : 'Sign In <i class="fas fa-arrow-right"></i>';
}

// ---- Public actions ------------------------------------------------------

export async function handleLogin(){
  clearMessages();
  const email = $('loginUser').value.trim();
  const pass  = $('loginPass').value;
  if (!email || !pass){ showError('Enter email and password.'); return; }
  setLoading(true);
  try {
    await login(email, pass);
  } catch(err){
    setLoading(false);
    showError(err.message || 'Login failed.');
  }
}

export async function forgotPass(){
  const email = $('loginUser').value.trim();
  if (!email){ showError('Enter your email first.'); return; }
  try {
    await resetPassword(email);
    showSuccess('Reset email sent! Check your inbox.');
  } catch(err){
    showError(err.message);
  }
}

export async function handleLogout(){
  await logout();
  showToast('Signed out.', 'info');
}

export function togglePwd(){
  const input = $('loginPass');
  const eye   = $('pwdEye');
  if (input.type === 'password'){
    input.type = 'text';
    eye.className = 'fas fa-eye-slash';
  } else {
    input.type = 'password';
    eye.className = 'fas fa-eye';
  }
}

/** Reset the login overlay to its initial empty state. */
export function showLoginScreen(){
  $('appContainer').classList.remove('visible');
  $('loginOverlay').classList.remove('hidden');
  $('loginForm').style.display    = '';
  $('loadingState').style.display = 'none';
  $('loginUser').value = '';
  $('loginPass').value = '';
  setLoading(false);
  clearMessages();
}

/** Switch from form view to spinner ("checking session"). */
export function showCheckingSession(){
  $('loginForm').style.display    = 'none';
  $('loadingState').style.display = '';
}
