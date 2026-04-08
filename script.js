/* ============================================================
   CORAZZA — INVESTIMENTO IMOBILIÁRIO
   JavaScript: Navbar, Modal Exclusividades, Hamburger, Formulário
   ============================================================ */

// ── SENHA DA ÁREA EXCLUSIVIDADES ──
// Altere aqui para definir a senha de acesso
const SENHA_EXCLUSIVIDADES = 'Exclusive00';

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Fechar menu ao clicar em link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ── MODAL EXCLUSIVIDADES ──
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const senhaForm = document.getElementById('senhaForm');
const senhaInput = document.getElementById('senha');
const modalError = document.getElementById('modalError');
const modalContato = document.getElementById('modalContato');
const exclusividadesArea = document.getElementById('exclusividadesArea');

// Verificar se já está autenticado na sessão
let exclusividadesDesbloqueadas = sessionStorage.getItem('corazza_excl') === '1';

function abrirModal() {
  if (exclusividadesDesbloqueadas) {
    mostrarExclusividades();
    return;
  }
  modalOverlay.classList.add('active');
  setTimeout(() => senhaInput.focus(), 300);
}

function fecharModal() {
  modalOverlay.classList.remove('active');
  senhaInput.value = '';
  modalError.classList.remove('visible');
}

function mostrarExclusividades() {
  exclusividadesArea.style.display = 'block';
  exclusividadesArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Todos os links que abrem exclusividades
document.querySelectorAll('.nav-exclusividades, .nav-exclusividades-link').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    abrirModal();
  });
});

// Fechar modal
modalClose.addEventListener('click', fecharModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) fecharModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharModal();
});

// Verificar senha
senhaForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const digitada = senhaInput.value.trim();
  
  if (digitada === SENHA_EXCLUSIVIDADES) {
    exclusividadesDesbloqueadas = true;
    sessionStorage.setItem('corazza_excl', '1');
    fecharModal();
    setTimeout(mostrarExclusividades, 300);
  } else {
    modalError.classList.add('visible');
    senhaInput.value = '';
    senhaInput.focus();
    // Animação de shake
    senhaInput.style.borderColor = '#e05555';
    setTimeout(() => {
      senhaInput.style.borderColor = '';
    }, 1500);
  }
});

// Link "Fale com Corazza" dentro do modal
modalContato.addEventListener('click', (e) => {
  e.preventDefault();
  fecharModal();
  setTimeout(() => {
    document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
  }, 300);
});

// Botão sair da área exclusiva
document.getElementById('sairExclusividades').addEventListener('click', () => {
  exclusividadesDesbloqueadas = false;
  sessionStorage.removeItem('corazza_excl');
  exclusividadesArea.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── FORMULÁRIO DE CONTATO ──
const contatoForm = document.getElementById('contatoForm');
contatoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const nome = document.getElementById('nome').value.trim();
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const interesse = document.getElementById('interesse').value;
  const mensagem = document.getElementById('mensagem').value.trim();
  
  // Montar mensagem para WhatsApp
  const interesses = {
    investimento: 'Investimento imobiliário',
    clube: 'Clube Corazza',
    mentoria: 'Mentoria',
    parceria: 'Parceria',
    '': 'Geral'
  };
  
  const texto = `Olá Dieison! Vim pelo site Corazza.\n\n*Nome:* ${nome}\n*WhatsApp:* ${whatsapp}\n*Interesse:* ${interesses[interesse] || 'Geral'}${mensagem ? `\n*Mensagem:* ${mensagem}` : ''}`;
  
  const url = `https://wa.me/5547992762266?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
  
  // Feedback visual
  const btn = contatoForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Mensagem enviada ✓';
  btn.style.background = '#5cb85c';
  btn.style.color = '#fff';
  
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.style.color = '';
    contatoForm.reset();
  }, 3000);
});

// ── ANIMAÇÕES DE ENTRADA ──
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Aplicar animação de entrada nos elementos
document.querySelectorAll('.inv-card, .processo-item, .mentoria-card, .excl-card, .parceiro-item, .dep-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease, background 0.3s ease';
  observer.observe(el);
});

// ── SMOOTH SCROLL PARA LINKS INTERNOS ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

// ── VERIFICAR SESSÃO AO CARREGAR ──
if (exclusividadesDesbloqueadas) {
  exclusividadesArea.style.display = 'block';
}

// ── COUNTER ANIMATION ──
function animateCounter(el, target, duration) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const numEl = el.querySelector('.count-num');
    if (numEl) animateCounter(numEl, target, 1800);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── HERO PARALLAX (desktop only) ──
const heroImg = document.querySelector('.hero-img');
const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (heroImg && !isTouch && !prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroImg.style.transform = `translateY(${scrolled * 0.25}px)`;
    }
  }, { passive: true });
}

// ── BACK TO TOP ──
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
