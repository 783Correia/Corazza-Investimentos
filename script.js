/* ============================================================
   CORAZZA — INVESTIMENTO IMOBILIÁRIO
   JavaScript: Navbar, Modal Exclusividades, Hamburger, Formulário
   ============================================================ */

// ── AUTENTICAÇÃO DA ÁREA EXCLUSIVIDADES ──
// Hash SHA-256 da senha (a senha real nunca fica exposta no código)
// Para trocar a senha: gere o novo hash com: echo -n "NovaSenha" | shasum -a 256
const HASH_EXCLUSIVIDADES = '07973a02f25252a985e0687d9680ca8ef315dbbc13297db0ab3765798af383df';

async function hashSenha(senha) {
  const encoder = new TextEncoder();
  const data = encoder.encode(senha);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── LOADING SCREEN ──
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hide'), 850);
});

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

function toggleMenu(force) {
  const isOpen = force !== undefined ? force : !navLinks.classList.contains('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleMenu());

// Fechar ao clicar em link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Fechar ao clicar no overlay (área escura à esquerda do painel)
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== hamburger) {
    toggleMenu(false);
  }
});

// Fechar com Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleMenu(false);
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

// Verificar senha (compara hash — a senha real nunca trafega ou fica exposta)
senhaForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const digitada = senhaInput.value.trim();

  const hashDigitada = await hashSenha(digitada);

  if (hashDigitada === HASH_EXCLUSIVIDADES) {
    exclusividadesDesbloqueadas = true;
    sessionStorage.setItem('corazza_excl', '1');
    fecharModal();
    setTimeout(mostrarExclusividades, 300);
  } else {
    modalError.classList.add('visible');
    senhaInput.value = '';
    senhaInput.focus();
    senhaInput.style.borderColor = '#e05555';
    setTimeout(() => { senhaInput.style.borderColor = ''; }, 1500);
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
  
  const sanitize = (str) => str.replace(/[\n\r]/g, ' ').replace(/[*_~`]/g, '').trim();

  const nome = sanitize(document.getElementById('nome').value);
  const whatsapp = sanitize(document.getElementById('whatsapp').value);
  const interesse = document.getElementById('interesse').value;
  const mensagem = sanitize(document.getElementById('mensagem').value);

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
document.querySelectorAll('.inv-card, .processo-item, .mentoria-card, .excl-card, .parceiro-item, .dep-card, .resultado-card, .problema-item, .metodo-pilar, .parceiro-bar-item').forEach(el => {
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

// ── PROCESSO SLIDER ──
const processoSlider = document.getElementById('processoSlider');
const processoSlides = processoSlider ? processoSlider.querySelectorAll('.processo-slide') : [];
const processoDots   = document.getElementById('processoDots');
const processoDotsEl = processoDots ? processoDots.querySelectorAll('.processo-dot') : [];
let processoAtivo = 0;
let processoTimer = null;

function ativarSlide(index) {
  processoSlides.forEach((s, i) => s.classList.toggle('active', i === index));
  processoDotsEl.forEach((d, i) => d.classList.toggle('active', i === index));
  processoAtivo = index;
}

function proximoSlide() {
  ativarSlide((processoAtivo + 1) % processoSlides.length);
}

function iniciarTimer() {
  clearInterval(processoTimer);
  processoTimer = setInterval(proximoSlide, 4000);
}

if (processoSlides.length) {
  ativarSlide(0);
  iniciarTimer();

  processoSlides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      ativarSlide(i);
      iniciarTimer();
    });
  });

  processoDotsEl.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      ativarSlide(i);
      iniciarTimer();
    });
  });
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
