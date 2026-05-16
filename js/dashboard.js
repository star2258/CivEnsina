/* =============================================
   DASHBOARD.JS — Painel do Usuário
   ============================================= */

// ---- DATA ----
const basicCourses = [
  { id: 'b1', title: 'Introdução à Construção Civil', icon: 'fas fa-building', hours: 8, lessons: 12, type: 'basic' },
  { id: 'b2', title: 'Como Utilizar EPIs', icon: 'fas fa-hard-hat', hours: 6, lessons: 8, type: 'basic' },
  { id: 'b3', title: 'Normas Técnicas e NRs', icon: 'fas fa-clipboard-list', hours: 10, lessons: 15, type: 'basic' },
  { id: 'b4', title: 'Segurança no Trabalho', icon: 'fas fa-shield-alt', hours: 8, lessons: 10, type: 'basic' },
  { id: 'b5', title: 'Leitura e Interpretação de Projetos', icon: 'fas fa-drafting-compass', hours: 12, lessons: 18, type: 'basic' },
  { id: 'b6', title: 'Materiais de Construção', icon: 'fas fa-boxes', hours: 7, lessons: 11, type: 'basic' },
  { id: 'b7', title: 'Organização do Canteiro de Obras', icon: 'fas fa-tools', hours: 5, lessons: 8, type: 'basic' },
  { id: 'b8', title: 'Sustentabilidade na Construção Civil', icon: 'fas fa-leaf', hours: 6, lessons: 9, type: 'basic' },
];

const advancedCourses = [
  { id: 'a1', title: 'Gestão de Obras', icon: 'fas fa-tasks', hours: 20, lessons: 28, type: 'advanced' },
  { id: 'a2', title: 'Orçamento e Planejamento', icon: 'fas fa-calculator', hours: 18, lessons: 24, type: 'advanced' },
  { id: 'a3', title: 'AutoCAD para Construção Civil', icon: 'fas fa-laptop-code', hours: 40, lessons: 52, type: 'advanced' },
  { id: 'a4', title: 'Revit e BIM', icon: 'fas fa-cube', hours: 35, lessons: 44, type: 'advanced' },
  { id: 'a5', title: 'Instalações Elétricas Prediais', icon: 'fas fa-bolt', hours: 22, lessons: 30, type: 'advanced' },
  { id: 'a6', title: 'Instalações Hidráulicas', icon: 'fas fa-tint', hours: 20, lessons: 27, type: 'advanced' },
  { id: 'a7', title: 'Estruturas de Concreto Armado', icon: 'fas fa-industry', hours: 30, lessons: 38, type: 'advanced' },
  { id: 'a8', title: 'Patologia das Construções', icon: 'fas fa-search', hours: 16, lessons: 22, type: 'advanced' },
  { id: 'a9', title: 'Lean Construction', icon: 'fas fa-recycle', hours: 14, lessons: 18, type: 'advanced' },
];

// ---- STATE ----
let currentUser = null;
let currentCourse = null;

// ---- INIT ----
window.addEventListener('load', () => {
  currentUser = JSON.parse(localStorage.getItem('ceCurrentUser') || 'null');
  if (!currentUser) {
    window.location.href = 'auth.html';
    return;
  }
  renderUser();
  renderCourses();
  updateStats();
  renderMyCourses();
  renderCertificates();
  renderProfile();
});

// ---- RENDER USER ----
function renderUser() {
  const firstName = currentUser.name.split(' ')[0];
  document.getElementById('welcomeName').textContent = firstName;
  document.getElementById('sidebarName').textContent = currentUser.name;
  document.getElementById('topbarName').textContent = firstName;

  const isPremium = currentUser.plan === 'premium';
  const badgeEl = document.getElementById('sidebarPlan');
  const planBadgeEl = document.getElementById('planBadge');
  const profilePlanEl = document.getElementById('profilePlanBadge');

  if (isPremium) {
    badgeEl.textContent = '⭐ Premium';
    badgeEl.className = 'sidebar-badge premium';
    planBadgeEl.innerHTML = '<i class="fas fa-crown"></i> Plano Premium';
    planBadgeEl.className = 'plan-badge premium';
    profilePlanEl.innerHTML = '<i class="fas fa-crown"></i> Plano Premium';
    profilePlanEl.className = 'plan-badge premium';
  }
}

// ---- RENDER COURSES ----
function renderCourses() {
  const basicGrid = document.getElementById('basicCoursesGrid');
  const advGrid = document.getElementById('advancedCoursesGrid');
  const premGate = document.getElementById('premiumGate');
  const isPremium = currentUser.plan === 'premium';

  basicGrid.innerHTML = basicCourses.map(c => courseCard(c)).join('');

  if (!isPremium) {
    premGate.style.display = 'flex';
    advGrid.innerHTML = advancedCourses.slice(0, 3).map(c => courseCard(c, true)).join('');
  } else {
    premGate.style.display = 'none';
    advGrid.innerHTML = advancedCourses.map(c => courseCard(c)).join('');
  }
}

function courseCard(course, locked = false) {
  const progress = getCourseProgress(course.id);
  const isLocked = locked && course.type === 'advanced';
  return `
    <div class="course-dash-card" onclick="${isLocked ? "showSection('subscription', null)" : `openCourse('${course.id}')`}">
      <div class="cdc-thumb ${course.type}">
        <i class="${course.icon}"></i>
        ${isLocked ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;border-radius:0"><i class="fas fa-lock" style="font-size:2rem;color:var(--gold)"></i></div>' : ''}
      </div>
      <div class="cdc-body">
        <span class="course-tag ${course.type === 'basic' ? 'free' : 'premium'}">${course.type === 'basic' ? 'Gratuito' : 'Premium'}</span>
        <h4>${course.title}</h4>
        <div class="meta">
          <span><i class="fas fa-clock"></i> ${course.hours}h</span>
          <span><i class="fas fa-video"></i> ${course.lessons} aulas</span>
        </div>
        <div class="progress-wrap">
          <div class="prog-label"><span>Progresso</span><span>${progress}%</span></div>
          <div class="prog-bar"><div class="prog-fill" style="width:${progress}%"></div></div>
        </div>
        <button class="btn btn-primary btn-sm" style="width:100%;justify-content:center">
          ${progress > 0 ? '<i class="fas fa-play"></i> Continuar' : '<i class="fas fa-play"></i> Iniciar'}
        </button>
      </div>
    </div>
  `;
}

// ---- STATS ----
function updateStats() {
  const courses = currentUser.courses || [];
  const inProgress = courses.filter(c => c.progress > 0 && c.progress < 100).length;
  const completed = courses.filter(c => c.progress >= 100).length;
  const certs = (currentUser.certificates || []).length;
  const hours = courses.reduce((acc, c) => {
    const allC = [...basicCourses, ...advancedCourses].find(x => x.id === c.id);
    return acc + (allC ? Math.round(allC.hours * c.progress / 100) : 0);
  }, 0);

  document.getElementById('inProgressCount').textContent = inProgress;
  document.getElementById('completedCount').textContent = completed;
  document.getElementById('certsCount').textContent = certs;
  document.getElementById('hoursCount').textContent = `${hours}h`;
}

// ---- MY COURSES (home) ----
function renderMyCourses() {
  const container = document.getElementById('myCoursesContainer');
  const myCourses = (currentUser.courses || []).filter(c => c.progress > 0);

  if (myCourses.length === 0) return;

  container.innerHTML = myCourses.slice(0, 3).map(c => {
    const course = [...basicCourses, ...advancedCourses].find(x => x.id === c.id);
    if (!course) return '';
    return `
      <div class="lesson-item" onclick="openCourse('${course.id}')">
        <div class="l-num"><i class="${course.icon}" style="font-size:0.75rem;color:var(--primary)"></i></div>
        <span class="l-title">${course.title}</span>
        <div style="text-align:right">
          <div style="font-size:0.78rem;color:var(--primary);font-weight:700">${c.progress}%</div>
        </div>
      </div>
    `;
  }).join('');
}

// ---- CERTIFICATES (home) ----
function renderCertificates() {
  const certs = currentUser.certificates || [];
  const container = document.getElementById('myCertsContainer');
  const certsGrid = document.getElementById('certsGrid');

  if (certs.length === 0) return;

  container.innerHTML = certs.slice(0, 3).map(cert => `
    <div class="lesson-item">
      <div class="l-num" style="background:rgba(255,179,0,0.15);border-color:rgba(255,179,0,0.3)"><i class="fas fa-certificate" style="font-size:0.75rem;color:var(--gold)"></i></div>
      <span class="l-title">${cert.courseName}</span>
      <button class="btn btn-outline btn-sm" onclick="downloadCert('${cert.id}')"><i class="fas fa-download"></i></button>
    </div>
  `).join('');

  certsGrid.innerHTML = certs.map(cert => `
    <div class="cert-item">
      <div class="ci-header">
        <i class="fas fa-certificate ci-icon"></i>
        <button class="btn btn-outline btn-sm" onclick="downloadCert('${cert.id}')"><i class="fas fa-download"></i> Baixar</button>
      </div>
      <h4>${cert.courseName}</h4>
      <div class="ci-info">
        <span><i class="fas fa-clock"></i> ${cert.hours}h</span>
        <span><i class="fas fa-calendar"></i> ${cert.date}</span>
        <span><i class="fas fa-barcode"></i> #${cert.id}</span>
      </div>
    </div>
  `).join('');
}

// ---- PROFILE ----
function renderProfile() {
  document.getElementById('profName').value = currentUser.name || '';
  document.getElementById('profEmail').value = currentUser.email || '';
  document.getElementById('profPhone').value = currentUser.phone || '';
  document.getElementById('profJob').value = currentUser.job || '';
  document.getElementById('profCity').value = currentUser.city || '';
  document.getElementById('profileMemberSince').textContent = `Membro desde: ${currentUser.joinDate || '2026'}`;
}

function saveProfile(e) {
  e.preventDefault();
  currentUser.name = document.getElementById('profName').value;
  currentUser.email = document.getElementById('profEmail').value;
  currentUser.phone = document.getElementById('profPhone').value;
  currentUser.job = document.getElementById('profJob').value;
  currentUser.city = document.getElementById('profCity').value;
  saveUser();
  showToast('Perfil atualizado com sucesso! ✓', 'success');
  renderUser();
}

function changePassword(e) {
  e.preventDefault();
  const cur = document.getElementById('curPass').value;
  const newp = document.getElementById('newPass').value;
  const conf = document.getElementById('confPass').value;
  if (cur !== currentUser.password) { showToast('Senha atual incorreta.', 'error'); return; }
  if (newp.length < 6) { showToast('Nova senha deve ter pelo menos 6 caracteres.', 'error'); return; }
  if (newp !== conf) { showToast('As senhas não coincidem.', 'error'); return; }
  currentUser.password = newp;
  saveUser();
  document.getElementById('passForm').reset();
  showToast('Senha alterada com sucesso! ✓', 'success');
}

// ---- SECTION NAVIGATION ----
function showSection(id, navEl) {
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
  document.getElementById(`section-${id}`).classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navEl) navEl.classList.add('active');
  else {
    document.querySelectorAll('.nav-item').forEach(n => {
      if (n.getAttribute('onclick') && n.getAttribute('onclick').includes(`'${id}'`)) n.classList.add('active');
    });
  }

  // Close sidebar on mobile
  document.getElementById('sidebar').classList.remove('open');
}

// ---- SIDEBAR TOGGLE ----
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});
document.getElementById('sidebarClose').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
});

// ---- OPEN COURSE MODAL ----
function openCourse(courseId) {
  const course = [...basicCourses, ...advancedCourses].find(c => c.id === courseId);
  if (!course) return;

  if (course.type === 'advanced' && currentUser.plan !== 'premium') {
    showSection('subscription', null);
    return;
  }

  currentCourse = course;
  const progress = getCourseProgress(courseId);

  document.getElementById('modalTitle').textContent = course.title;
  document.getElementById('modalTag').innerHTML = `<span class="course-tag ${course.type === 'basic' ? 'free' : 'premium'}">${course.type === 'basic' ? 'Gratuito' : 'Premium'}</span>`;
  document.getElementById('modalIcon').innerHTML = `<i class="${course.icon}"></i>`;
  document.getElementById('modalPercent').textContent = `${progress}%`;
  document.getElementById('modalProgFill').style.width = `${progress}%`;

  // Render lessons
  const lessonsList = document.getElementById('lessonsList');
  const lessons = generateLessons(course);
  lessonsList.innerHTML = lessons.map((l, i) => `
    <div class="lesson-item ${l.done ? 'done' : ''}" onclick="watchLesson(${i})">
      <div class="l-num">${l.done ? '<i class="fas fa-check" style="color:var(--success);font-size:0.75rem"></i>' : i + 1}</div>
      <span class="l-title">${l.title}</span>
      <span class="l-dur">${l.duration}</span>
    </div>
  `).join('');

  switchModalTab('aulas');
  document.getElementById('courseModal').style.display = 'flex';
}

function generateLessons(course) {
  const lessonTitles = [
    'Introdução ao Módulo', 'Conceitos Fundamentais', 'Aplicações Práticas',
    'Estudo de Caso', 'Exercícios Práticos', 'Normas e Regulamentações',
    'Ferramentas e Equipamentos', 'Segurança e Boas Práticas',
    'Exemplos do Mercado', 'Revisão e Resumo', 'Avaliação Intermediária',
    'Projeto Final'
  ];
  const progress = getCourseProgress(course.id);
  const doneLessons = Math.floor(course.lessons * progress / 100);

  return Array.from({ length: Math.min(course.lessons, 12) }, (_, i) => ({
    title: lessonTitles[i % lessonTitles.length],
    duration: `${Math.floor(Math.random() * 15 + 8)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    done: i < doneLessons,
  }));
}

function watchLesson(index) {
  document.querySelectorAll('.lesson-item').forEach((item, i) => {
    if (i <= index) item.classList.add('done');
  });
  showToast('Assistindo aula... Boa sorte! 🎬');
}

function closeModal() {
  document.getElementById('courseModal').style.display = 'none';
}

// ---- COMPLETE LESSON ----
function completeLesson() {
  if (!currentCourse) return;
  const courseData = getCourseData(currentCourse.id);
  courseData.progress = Math.min(100, courseData.progress + 10);
  saveCourseProgress(currentCourse.id, courseData.progress);
  document.getElementById('modalPercent').textContent = `${courseData.progress}%`;
  document.getElementById('modalProgFill').style.width = `${courseData.progress}%`;

  if (courseData.progress >= 100) {
    generateCertificate(currentCourse);
    showToast('🎉 Parabéns! Curso concluído! Certificado gerado!', 'success');
    renderCertificates();
  } else {
    showToast(`Progresso salvo! ${courseData.progress}% concluído ✓`, 'success');
  }
  updateStats();
  renderMyCourses();
  renderCourses();
}

function completeQuiz() {
  completeLesson();
  showToast('Questionário concluído com sucesso! 🏆', 'success');
}

// ---- CERTIFICATES ----
function generateCertificate(course) {
  const certs = currentUser.certificates || [];
  const exists = certs.find(c => c.courseId === course.id);
  if (exists) return;
  const cert = {
    id: `CE${Date.now()}`,
    courseId: course.id,
    courseName: course.title,
    hours: course.hours,
    date: new Date().toLocaleDateString('pt-BR'),
  };
  currentUser.certificates = [...certs, cert];
  saveUser();
}

function downloadCert(certId) {
  showToast('Preparando download do certificado... 📄', '');
  // In production: generate PDF with jsPDF or backend
  setTimeout(() => showToast('Certificado PDF gerado! (integração em produção)', 'success'), 1200);
}

// ---- SUBSCRIPTION ----
function handleSubscription() {
  showToast('Redirecionando para pagamento... (Integração Stripe/MP em produção)', '');
  // In production: redirect to Stripe Checkout or Mercado Pago
  setTimeout(() => {
    currentUser.plan = 'premium';
    saveUser();
    renderUser();
    renderCourses();
    showToast('✨ Plano Premium ativado com sucesso!', 'success');
  }, 1500);
}

// ---- SUPPORT ----
function sendSupportMessage(e) {
  e.preventDefault();
  showToast('Mensagem enviada! Nossa equipe responderá em breve. ✓', 'success');
  e.target.reset();
}

// ---- MODAL TABS ----
function switchModalTab(tab) {
  document.querySelectorAll('.mtab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.mtab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`mtab-${tab}`).classList.add('active');
  const btn = document.querySelector(`.mtab[onclick="switchModalTab('${tab}')"]`);
  if (btn) btn.classList.add('active');
}

// ---- TOGGLE PASSWORD ----
function togglePassword(id) {
  const input = document.getElementById(id);
  const btn = input.nextElementSibling;
  const icon = btn.querySelector('i');
  input.type = input.type === 'password' ? 'text' : 'password';
  icon.className = input.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

// ---- TOAST ----
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ---- STORAGE HELPERS ----
function getCourseProgress(id) {
  const c = (currentUser.courses || []).find(x => x.id === id);
  return c ? c.progress : 0;
}

function getCourseData(id) {
  let c = (currentUser.courses || []).find(x => x.id === id);
  if (!c) {
    c = { id, progress: 0 };
    currentUser.courses = [...(currentUser.courses || []), c];
  }
  return c;
}

function saveCourseProgress(id, progress) {
  let courses = currentUser.courses || [];
  const idx = courses.findIndex(c => c.id === id);
  if (idx >= 0) courses[idx].progress = progress;
  else courses.push({ id, progress });
  currentUser.courses = courses;
  saveUser();
}

function saveUser() {
  localStorage.setItem('ceCurrentUser', JSON.stringify(currentUser));
  const users = JSON.parse(localStorage.getItem('ceUsers') || '[]');
  const idx = users.findIndex(u => u.id === currentUser.id);
  if (idx >= 0) users[idx] = currentUser;
  localStorage.setItem('ceUsers', JSON.stringify(users));
}

// ---- CLOSE MODAL ON OVERLAY CLICK ----
document.getElementById('courseModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
