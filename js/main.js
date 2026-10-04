// FrontDesk — comportements partagés (nav mobile, formulaire, smooth scroll)
// Pas de moteur i18n JS : chaque langue a sa propre URL avec son propre contenu.

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initContactForm();
  initSmoothScroll();
  initCardReveal();

  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });
}

function initCardReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cards = document.querySelectorAll('.card, .sector-card, .usecase-row, .pain-card');
  if (!cards.length || !('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(18px)';
    card.style.transition = `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(i, 5) * 0.06}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(i, 5) * 0.06}s`;
    obs.observe(card);
  });
}

// Formulaire branché sur Formspree (même endpoint que talox.be, à dédier à FrontDesk
// une fois créé sur formspree.io — voir .env.example). Textes d'état lus depuis les
// data-attributes du bouton, remplis directement dans le HTML de chaque langue.
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const successMsg = form.querySelector('.form-success');
  const submitBtn = form.querySelector('[data-submit-btn]');
  const submitText = form.querySelector('[data-submit-text]');
  const originalLabel = submitText ? submitText.textContent : '';
  const sendingLabel = submitBtn?.dataset.sendingText || originalLabel;
  const errorMsg = submitBtn?.dataset.errorText || "Une erreur est survenue. Réessayez ou écrivez à contact@talox.be";

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = sendingLabel;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('form submission failed');

      form.hidden = true;
      if (successMsg) {
        successMsg.classList.add('is-visible');
        successMsg.focus?.();
      }
    } catch (err) {
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = originalLabel;
      alert(errorMsg);
    }
  });
}
