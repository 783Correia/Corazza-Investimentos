/* ============================================================
   CORAZZA — INVESTIMENTO IMOBILIÁRIO
   JavaScript: Navbar, Modal Exclusividades, Hamburger,
               Accordion Processo, Selected Projects, Formulário
   ============================================================ */

// ── CONSTANTES ──
const WA_NUMBER = '5547992762266';

// ── AUTENTICAÇÃO DA ÁREA EXCLUSIVIDADES ──
// Validação feita server-side via /api/verify — nenhum segredo fica exposto no cliente.
async function verificarSenha(senha) {
  try {
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: senha }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.ok ? data.token : null;
  } catch {
    return null;
  }
}

// ── LOADING SCREEN ──
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hide'), 500);
});

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

function toggleMenu(force) {
  const isOpen = force !== undefined ? force : !navLinks.classList.contains('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleMenu());

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== hamburger) {
    toggleMenu(false);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { toggleMenu(false); fecharModal(); }
});

// ── MODAL EXCLUSIVIDADES ──
const modalOverlay       = document.getElementById('modalOverlay');
const modalClose         = document.getElementById('modalClose');
const senhaForm          = document.getElementById('senhaForm');
const senhaInput         = document.getElementById('senha');
const modalError         = document.getElementById('modalError');
const modalContato       = document.getElementById('modalContato');
const exclusividadesArea = document.getElementById('exclusividadesArea');

// Token de sessão (string assinada pelo servidor, ou null)
let exclusividadesDesbloqueadas = !!sessionStorage.getItem('corazza_token');

function abrirModal() {
  if (exclusividadesDesbloqueadas) { mostrarExclusividades(); return; }
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

document.querySelectorAll('.nav-exclusividades, .nav-exclusividades-link').forEach(el => {
  el.addEventListener('click', (e) => { e.preventDefault(); abrirModal(); });
});

modalClose.addEventListener('click', fecharModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) fecharModal(); });

senhaForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const digitada = senhaInput.value.trim();

  const submitBtn = senhaForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Verificando…';

  const token = await verificarSenha(digitada);

  submitBtn.disabled = false;
  submitBtn.textContent = 'Entrar';

  if (token) {
    exclusividadesDesbloqueadas = true;
    sessionStorage.setItem('corazza_token', token);
    fecharModal();
    setTimeout(mostrarExclusividades, 300);
  } else {
    modalError.classList.add('visible');
    senhaInput.value = '';
    senhaInput.focus();
    senhaInput.style.borderColor = '#c0392b';
    setTimeout(() => { senhaInput.style.borderColor = ''; }, 1500);
  }
});

modalContato.addEventListener('click', (e) => {
  e.preventDefault();
  fecharModal();
  setTimeout(() => document.getElementById('contato').scrollIntoView({ behavior: 'smooth' }), 300);
});

document.getElementById('sairExclusividades').addEventListener('click', () => {
  exclusividadesDesbloqueadas = false;
  sessionStorage.removeItem('corazza_token');
  exclusividadesArea.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (exclusividadesDesbloqueadas) exclusividadesArea.style.display = 'block';

// ── ACCORDION PROCESSO ──
const accordionItems = document.querySelectorAll('.processo-item-acc');

accordionItems.forEach(item => {
  const header = item.querySelector('.processo-item-header');
  header.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
  header.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    accordionItems.forEach(i => {
      i.classList.remove('open');
      i.querySelector('.processo-item-header').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      header.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── INVESTIMENTOS — SELECTED PROJECTS ──
const invProjects = [
  {
    img:   'images/palazzo-hero.png',
    alt:   'Palazzo Giardino',
    tag:   'Pré-lançamento',
    title: 'Palazzo Giardino',
    stat1: { val: '132m²',       label: 'Área privativa' },
    stat2: { val: 'R$15.628/m²', label: 'Valor/m²' },
    stat3: { val: '–40%',        label: 'vs. mercado' },
  },
  {
    img:   'images/vivapark-hero.jpg',
    alt:   'Viva Park Corporate',
    tag:   'Última unidade',
    title: 'Viva Park Corporate',
    stat1: { val: '41,56m²',  label: 'Área' },
    stat2: { val: '23º andar', label: 'Vista Parque' },
    stat3: { val: '80k/mês',  label: 'Visitantes' },
  },
  {
    img:   'images/paesaggio-hero.jpg',
    alt:   'Paesaggio Residencial',
    tag:   'Pronto para morar',
    title: 'Paesaggio Residencial',
    stat1: { val: '131m²',       label: 'Área privativa' },
    stat2: { val: 'R$21.374/m²', label: 'Valor/m²' },
    stat3: { val: '–27%',        label: 'vs. teto de mercado' },
  },
];

const invListItems    = document.querySelectorAll('.inv-list-item');
const invPreviewImg   = document.getElementById('invPreviewImg');
const invPreviewTag   = document.getElementById('invPreviewTag');
const invPreviewTitle = document.getElementById('invPreviewTitle');
const invStat1Val     = document.getElementById('invStat1Val');
const invStat1Label   = document.getElementById('invStat1Label');
const invStat2Val     = document.getElementById('invStat2Val');
const invStat2Label   = document.getElementById('invStat2Label');
const invStat3Val     = document.getElementById('invStat3Val');
const invStat3Label   = document.getElementById('invStat3Label');

function updatePreview(index) {
  const p = invProjects[index];
  if (!p || !invPreviewImg) return;
  invPreviewImg.style.opacity = '0';
  setTimeout(() => {
    invPreviewImg.src             = p.img;
    invPreviewImg.alt             = p.alt;
    invPreviewTag.textContent     = p.tag;
    invPreviewTitle.textContent   = p.title;
    invStat1Val.textContent       = p.stat1.val;
    invStat1Label.textContent     = p.stat1.label;
    invStat2Val.textContent       = p.stat2.val;
    invStat2Label.textContent     = p.stat2.label;
    invStat3Val.textContent       = p.stat3.val;
    invStat3Label.textContent     = p.stat3.label;
    invPreviewImg.style.opacity   = '1';
  }, 250);
  invListItems.forEach((item, i) => item.classList.toggle('active', i === index));
}

invListItems.forEach((item, i) => {
  item.addEventListener('click', () => updatePreview(i));
});

// ── FORMULÁRIO DE CONTATO (opcional — seção usa WhatsApp direto) ──
const contatoForm = document.getElementById('contatoForm');
if (contatoForm) {
  contatoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const sanitize = (str) => str.replace(/[\n\r]/g, ' ').replace(/[*_~`]/g, '').trim();
    const nome      = sanitize(document.getElementById('nome').value);
    const whatsapp  = sanitize(document.getElementById('whatsapp').value);
    const interesse = document.getElementById('interesse').value;
    const mensagem  = sanitize(document.getElementById('mensagem').value);
    const interesses = { investimento: 'Investimento imobiliário', clube: 'Clube Corazza', mentoria: 'Mentoria', parceria: 'Parceria', '': 'Geral' };
    const texto = `Olá Dieison! Vim pelo site Corazza.\n\n*Nome:* ${nome}\n*WhatsApp:* ${whatsapp}\n*Interesse:* ${interesses[interesse] || 'Geral'}${mensagem ? `\n*Mensagem:* ${mensagem}` : ''}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(texto)}`, '_blank');
    const btn = contatoForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Mensagem enviada ✓';
    btn.style.background = '#27ae60';
    setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; contatoForm.reset(); }, 3000);
  });
}

// ── ANIMAÇÕES DE ENTRADA ──
const prefersReducedMotionAnim = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotionAnim) {
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(
    '.resultado-card, .bento-pilar, .bento-intro, .dep-card, .excl-card, .clube-beneficio, .processo-item-acc'
  ).forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

}

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

// ── CARROSSEL DE DEPOIMENTOS ──
const depTrack    = document.getElementById('depTrack');
const depPrev     = document.getElementById('depPrev');
const depNext     = document.getElementById('depNext');
const depDotsWrap = document.getElementById('depDotsWrap');

if (depTrack && depPrev && depNext && depDotsWrap) {
  const slides = depTrack.querySelectorAll('.dep-slide');
  let depCurrent = 0;
  const depTotal = slides.length;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dep-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
    dot.addEventListener('click', () => depGoTo(i));
    depDotsWrap.appendChild(dot);
  });

  function depGoTo(index) {
    depCurrent = index;
    depTrack.style.transform = `translateX(-${depCurrent * 100}%)`;
    depDotsWrap.querySelectorAll('.dep-dot').forEach((d, i) => d.classList.toggle('active', i === depCurrent));
    depPrev.disabled = depCurrent === 0;
    depNext.disabled = depCurrent === depTotal - 1;
  }

  depPrev.addEventListener('click', () => { if (depCurrent > 0) depGoTo(depCurrent - 1); });
  depNext.addEventListener('click', () => { if (depCurrent < depTotal - 1) depGoTo(depCurrent + 1); });

  let depTouchX = 0;
  depTrack.addEventListener('touchstart', e => { depTouchX = e.touches[0].clientX; }, { passive: true });
  depTrack.addEventListener('touchend', e => {
    const diff = depTouchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && depCurrent < depTotal - 1) depGoTo(depCurrent + 1);
      if (diff < 0 && depCurrent > 0) depGoTo(depCurrent - 1);
    }
  });

  depGoTo(0);
}

// ── BACK TO TOP ──
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
