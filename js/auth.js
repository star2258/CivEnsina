/* =============================================
   AUTH.JS — Login / Cadastro
   ============================================= */

// ---- CHECK HASH FOR AUTO-SWITCHING ----
window.addEventListener('load', () => {
  if (window.location.hash === '#cadastro') switchTab('cadastro');
});

// ---- SWITCH TABS ----
function switchTab(tab) {
  const loginPanel = document.getElementById('panelLogin');
  const cadastroPanel = document.getElementById('panelCadastro');
  const tabLogin = document.getElementById('tabLogin');
  const tabCadastro = document.getElementById('tabCadastro');
  const forgotPanel = document.getElementById('forgotPanel');

  forgotPanel.style.display = 'none';
  loginPanel.style.display = '';
  cadastroPanel.style.display = '';

  if (tab === 'login') {
    loginPanel.classList.add('active');
    cadastroPanel.classList.remove('active');
    tabLogin.classList.add('active');
    tabCadastro.classList.remove('active');
  } else {
    cadastroPanel.classList.add('active');
    loginPanel.classList.remove('active');
    tabCadastro.classList.add('active');
    tabLogin.classList.remove('active');
  }
  window.location.hash = tab;
}

// ---- TOGGLE PASSWORD ----
function togglePassword(id) {
  const input = document.getElementById(id);
  const btn = input.nextElementSibling;
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

// ---- PASSWORD STRENGTH ----
const cadSenha = document.getElementById('cadSenha');
if (cadSenha) {
  cadSenha.addEventListener('input', () => {
    const val = cadSenha.value;
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const levels = [
      { cls: '', label: 'Digite uma senha', w: '0%' },
      { cls: 'weak', label: 'Fraca', w: '25%' },
      { cls: 'fair', label: 'Razoável', w: '50%' },
      { cls: 'good', label: 'Boa', w: '75%' },
      { cls: 'strong', label: 'Forte 💪', w: '100%' },
    ];
    const lvl = levels[Math.min(score, 4)];
    fill.className = `strength-fill ${lvl.cls}`;
    fill.style.width = lvl.w;
    text.textContent = lvl.label;
  });
}

// ---- TOAST ----
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ---- HANDLE LOGIN ----
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  let valid = true;

  clearErrors();

  if (!email || !isValidEmail(email)) {
    showError('loginEmailErr', 'Informe um e-mail válido.');
    valid = false;
  }
  if (!pass || pass.length < 6) {
    showError('loginPassErr', 'Senha deve ter pelo menos 6 caracteres.');
    valid = false;
  }
  if (!valid) return;

  // Check stored user
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === pass);
  if (!user) {
    showToast('E-mail ou senha incorretos.', 'error');
    return;
  }

  // Save session
  localStorage.setItem('ceCurrentUser', JSON.stringify(user));
  localStorage.setItem('ceRemember', document.getElementById('rememberMe').checked);
  showToast('Login realizado com sucesso! Redirecionando...', 'success');
  setTimeout(() => window.location.href = 'dashboard.html', 1200);
}

// ---- HANDLE CADASTRO ----
function handleCadastro(e) {
  e.preventDefault();
  const nome = document.getElementById('cadNome').value.trim();
  const email = document.getElementById('cadEmail').value.trim();
  const senha = document.getElementById('cadSenha').value;
  const confirma = document.getElementById('cadConfirma').value;
  const terms = document.getElementById('termsCheck').checked;
  let valid = true;

  clearErrors();

  if (!nome || nome.length < 3) { showError('cadNomeErr', 'Informe seu nome completo.'); valid = false; }
  if (!email || !isValidEmail(email)) { showError('cadEmailErr', 'Informe um e-mail válido.'); valid = false; }
  if (!senha || senha.length < 6) { showError('cadSenhaErr', 'Senha deve ter pelo menos 6 caracteres.'); valid = false; }
  if (senha !== confirma) { showError('cadConfirmaErr', 'As senhas não coincidem.'); valid = false; }
  if (!terms) { showToast('Aceite os Termos de Uso para continuar.', 'error'); valid = false; }
  if (!valid) return;

  // Check if email already exists
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    showError('cadEmailErr', 'Este e-mail já está cadastrado.');
    return;
  }

  // Create user
  const newUser = {
    id: Date.now(),
    name: nome,
    email,
    password: senha,
    plan: 'free',
    joinDate: new Date().toLocaleDateString('pt-BR'),
    courses: [],
    certificates: [],
  };

  users.push(newUser);
  localStorage.setItem('ceUsers', JSON.stringify(users));
  localStorage.setItem('ceCurrentUser', JSON.stringify(newUser));

  showToast('Conta criada com sucesso! Redirecionando...', 'success');
  setTimeout(() => window.location.href = 'dashboard.html', 1200);
}

// ---- FORGOT PASSWORD ----
function showForgotPassword() {
  document.getElementById('panelLogin').style.display = 'none';
  document.getElementById('forgotPanel').style.display = 'block';
}

function hideForgotPassword() {
  document.getElementById('forgotPanel').style.display = 'none';
  document.getElementById('panelLogin').style.display = 'block';
  switchTab('login');
  document.getElementById('forgotSuccess').style.display = 'none';
  document.getElementById('forgotForm').style.display = 'block';
}

function handleForgotPassword(e) {
  e.preventDefault();
  const email = document.getElementById('forgotEmail').value;
  if (!email || !isValidEmail(email)) {
    showToast('Informe um e-mail válido.', 'error');
    return;
  }
  document.getElementById('forgotForm').style.display = 'none';
  document.getElementById('forgotSuccess').style.display = 'block';
}

// ---- SOCIAL LOGIN ----
function socialLogin(provider) {
  showToast(`Login com ${provider === 'google' ? 'Google' : 'Facebook'} (integração em breve)`, '');
  // In production: integrate OAuth provider
}

// ---- HELPERS ----
function getUsers() {
  return JSON.parse(localStorage.getItem('ceUsers') || '[]');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}

// ---- CHECK IF ALREADY LOGGED IN ----
window.addEventListener('load', () => {
  const user = JSON.parse(localStorage.getItem('ceCurrentUser') || 'null');
  if (user) {
    // Already logged in, optionally redirect
    // window.location.href = 'dashboard.html';
  }
});
