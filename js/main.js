/* =============================================
   MAIN.JS — Landing Page
   ============================================= */

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navButtons = document.querySelector('.nav-buttons');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);

  // Também abre/fecha os botões (Entrar / Cadastrar)
  if (navButtons) {
    navButtons.classList.toggle('open', isOpen);
  }
});

// Fecha menu ao clicar em qualquer link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Fecha menu ao clicar fora
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) closeMenu();
});

function closeMenu() {
  navLinks.classList.remove('open');
  if (navButtons) navButtons.classList.remove('open');
  hamburger.classList.remove('active');
}

// Animação do hamburguer (X)
const style = document.createElement('style');
style.textContent = `
  .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  .hamburger span { transition: all 0.3s ease; transform-origin: center; }
`;
document.head.appendChild(style);

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- ANIMATE ON SCROLL ----
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('animated'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);
document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ---- COUNTER ANIMATION ----
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(counter => {
    const target = counter.textContent;
    const num = parseInt(target.replace(/\D/g, ''));
    const suffix = target.replace(/[\d]/g, '');
    let current = 0;
    const step = num / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= num) { current = num; clearInterval(timer); }
      counter.textContent = Math.floor(current).toLocaleString('pt-BR') + suffix;
    }, 16);
  });
}

const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    setTimeout(animateCounters, 300);
    heroObserver.disconnect();
  }
}, { threshold: 0.5 });
heroObserver.observe(document.querySelector('.hero'));

// ---- ACTIVE NAV LINK ON SCROLL ----
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) current = section.getAttribute('id');
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) link.style.color = 'var(--orange)';
  });
});
