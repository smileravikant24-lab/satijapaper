import { $ }                              from './dom.js';
import { login, resetPassword, logout }   from '../services/auth.service.js';
import { showToast }                      from './dom.js';

// ---- Status messages -----------------------------------------------------

function showError(msg){
  if ($('loginErrorMsg')) {
    $('loginErrorMsg').textContent = msg;
  } else if ($('loginError')) {
    $('loginError').textContent = msg;
  }
  $('loginError')?.classList.add('show');
  $('loginSuccess')?.classList.remove('show');
}
function showSuccess(msg){
  if ($('loginSuccessMsg')) {
    $('loginSuccessMsg').textContent = msg;
  } else if ($('loginSuccess')) {
    $('loginSuccess').textContent = msg;
  }
  $('loginSuccess')?.classList.add('show');
  $('loginError')?.classList.remove('show');
}
function clearMessages(){
  $('loginError')?.classList.remove('show');
  $('loginSuccess')?.classList.remove('show');
}
function setLoading(on){
  const b = $('loginBtn');
  if (!b) return;
  b.disabled = on;
  b.innerHTML = on
    ? '<i class="fas fa-circle-notch fa-spin"></i> Signing in...'
    : 'Sign In <i class="fas fa-arrow-right"></i>';
}

// ---- Public actions ------------------------------------------------------

export async function handleLogin(e){
  if (e && e.preventDefault) e.preventDefault();
  clearMessages();
  
  const userField = $('loginUser') || $('loginEmail');
  const passField = $('loginPass');
  const email = userField ? userField.value.trim() : '';
  const pass  = passField ? passField.value : '';
  
  if (!email || !pass){ showError('Enter email and password.'); return; }
  setLoading(true);
  try {
    await login(email, pass);
  } catch(err){
    setLoading(false);
    showError(err.message || 'Login failed.');
  }
}

export async function forgotPass(e){
  if (e && e.preventDefault) e.preventDefault();
  const userField = $('loginUser') || $('loginEmail');
  const email = userField ? userField.value.trim() : '';
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
  if (!input || !eye) return;
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
  $('appContainer')?.classList.remove('visible');
  $('loginOverlay')?.classList.remove('hidden');
  if ($('loginForm')) $('loginForm').style.display = '';
  if ($('loadingState')) $('loadingState').style.display = 'none';
  
  const userField = $('loginUser') || $('loginEmail');
  if (userField) userField.value = '';
  if ($('loginPass')) $('loginPass').value = '';
  
  setLoading(false);
  clearMessages();
}

/** Switch from form view to spinner ("checking session"). */
export function showCheckingSession(){
  if ($('loginForm')) $('loginForm').style.display = 'none';
  if ($('loadingState')) $('loadingState').style.display = '';
}

const _loginUser = $('loginUser') || $('loginEmail');
const _loginPass = $('loginPass');
const _onEnter = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleLogin();
  }
};
if (_loginUser) _loginUser.addEventListener('keypress', _onEnter);
if (_loginPass) _loginPass.addEventListener('keypress', _onEnter);

const _loginForm = $('loginForm');
if (_loginForm) {
  _loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin();
  });
}
