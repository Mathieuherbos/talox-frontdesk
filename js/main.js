// TALOX V2 — comportements partagés (nav mobile, i18n, formulaire, calculateur ROI)
// Pas de lib d'icônes tierce : les icônes Phosphor sont inline dans le HTML.

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initI18n();
  initContactForm();
  initRoiCalculator();
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
  const cards = document.querySelectorAll('.card, .sector-card, .service-row, .compare-row');
  if (!cards.length || !('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = entry.target.dataset.restTransform || 'none';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach((card, i) => {
    const restTransform = card.style.transform || 'none';
    card.dataset.restTransform = restTransform;
    card.style.opacity = '0';
    card.style.transform = restTransform === 'none' ? 'translateY(18px)' : `${restTransform} translateY(18px)`;
    card.style.transition = `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(i, 5) * 0.06}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(i, 5) * 0.06}s`;
    obs.observe(card);
  });
}

// ---------- i18n (même moteur que talox-website : data-i18n + dictionnaire par page) ----------
function resolveKey(dict, key) {
  return key.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), dict);
}

function applyLang(lang) {
  const dict = window.TALOX_I18N && window.TALOX_I18N[lang];
  if (!dict) return;

  document.documentElement.lang = lang;
  localStorage.setItem('talox_lang_v2', lang);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const val = resolveKey(dict, el.getAttribute('data-i18n'));
    if (val !== undefined) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const val = resolveKey(dict, el.getAttribute('data-i18n-html'));
    if (val !== undefined) el.innerHTML = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const val = resolveKey(dict, el.getAttribute('data-i18n-placeholder'));
    if (val !== undefined) el.placeholder = val;
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const active = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  document.dispatchEvent(new CustomEvent('talox:langchange', { detail: { lang } }));
}

function initI18n() {
  if (!window.TALOX_I18N) return;
  const stored = localStorage.getItem('talox_lang_v2');
  const lang = (stored && window.TALOX_I18N[stored]) ? stored : 'fr';
  applyLang(lang);

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => applyLang(btn.getAttribute('data-lang')));
  });
}

function currentLang() {
  return document.documentElement.lang || 'fr';
}

// Formulaire branché sur le même endpoint Formspree que talox-website.
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const successMsg = form.querySelector('.form-success');
  const submitBtn = form.querySelector('[data-submit-btn]');
  const submitText = form.querySelector('[data-submit-text]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const dict = window.TALOX_I18N && window.TALOX_I18N[currentLang()];
    if (submitBtn) submitBtn.disabled = true;
    if (submitText && dict) submitText.textContent = resolveKey(dict, 'form.sending') || submitText.textContent;

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
      if (submitText && dict) submitText.textContent = resolveKey(dict, 'form.submit') || submitText.textContent;
      const errMsg = dict && resolveKey(dict, 'form.error');
      alert(errMsg || "Une erreur est survenue. Réessayez ou écrivez à contact@talox.be");
    }
  });
}

// Calculateur "combien vous coûtent vos contacts manqués"
function initRoiCalculator() {
  const calc = document.querySelector('[data-calculator]');
  if (!calc) return;

  const missedInput = calc.querySelector('[data-missed]');
  const valueInput = calc.querySelector('[data-value]');
  const missedOutput = calc.querySelector('[data-missed-output]');
  const valueOutput = calc.querySelector('[data-value-output]');
  const resultValue = calc.querySelector('[data-result-value]');
  const resultCompare = calc.querySelector('[data-result-compare]');

  function format(n) {
    return new Intl.NumberFormat('fr-BE', { maximumFractionDigits: 0 }).format(n);
  }

  function update() {
    const missed = Number(missedInput.value);
    const value = Number(valueInput.value);
    const monthlyLoss = missed * value * 4.33;

    missedOutput.textContent = missed;
    valueOutput.textContent = `${format(value)} €`;
    resultValue.textContent = `${format(monthlyLoss)} €`;

    const dict = window.TALOX_I18N && window.TALOX_I18N[currentLang()];
    const template = dict && resolveKey(dict, 'calculator.compareTemplate');
    if (template) {
      resultCompare.textContent = template.replace('{amount}', format(Math.max(monthlyLoss - 149, 0)));
    }
  }

  [missedInput, valueInput].forEach((input) => input.addEventListener('input', update));
  update();
  document.addEventListener('talox:langchange', update);
}
