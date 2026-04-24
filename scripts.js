/* ============================================================
   Okelo Zikora Portfolio — Animation Engine
   Easing: cubic-bezier(0.496, 0.004, 0, 1) = GSAP power3.out approx
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);
if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);

/* Closest GSAP match to the reference cubic-bezier(0.496, 0.004, 0, 1) */
const EASE      = 'power3.out';
const EASE_SOFT = 'power2.out';

/* ============================================================
   LENIS SMOOTH SCROLL
   ============================================================ */
function initLenis() {
  if (typeof Lenis === 'undefined') return null;

  const lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/* ============================================================
   LIVE CLOCK
   ============================================================ */
function initClock() {
  function tick() {
    const now  = new Date();
    const h    = now.getHours();
    const m    = String(now.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const str  = `${h % 12 || 12}:${m} ${ampm}`;
    const nav    = document.getElementById('nav-time');
    const footer = document.getElementById('footer-time');
    if (nav)    nav.textContent    = str;
    if (footer) footer.textContent = str;
  }
  tick();
  setInterval(tick, 30000);
}

/* ============================================================
   PRELOADER
   — counter counts 0→100 in display font
   — yellow bar uses scaleX (GPU-accelerated) not width
   ============================================================ */
function initPreloader(onComplete) {
  const el      = document.getElementById('preloader');
  const counter = document.getElementById('preloader-counter');
  const bar     = document.getElementById('preloader-bar');

  if (!el || !counter) { onComplete?.(); return; }

  const obj = { val: 0 };

  gsap.to(obj, {
    val: 100,
    duration: 2.4,
    ease: 'power2.inOut',
    onUpdate() {
      const v = Math.round(obj.val);
      counter.textContent = v;
      /* scaleX(0→1) for GPU-accelerated progress bar */
      if (bar) bar.style.transform = `scaleX(${v / 100})`;
    },
    onComplete() {
      gsap.to(el, {
        yPercent: -100,
        duration: 0.85,
        ease: EASE,
        onComplete() {
          el.style.display = 'none';
          onComplete?.();
        },
      });
    },
  });
}

/* ============================================================
   HERO REVEAL
   — SplitText per-character stagger cascade on load
   — i-line dividers scale in from left
   — top/bottom rows fade up
   ============================================================ */
function revealHero() {
  const heroName = document.getElementById('hero-name');
  if (!heroName) return;

  const tl = gsap.timeline();

  if (typeof SplitText !== 'undefined') {
    const split = new SplitText(heroName, { type: 'chars', charsClass: 'hero-char' });
    tl.from(split.chars, {
      yPercent: 120,
      stagger: 0.032,
      duration: 0.85,
      ease: EASE,
    });
  } else {
    tl.from('.hero-name-line', {
      yPercent: 120,
      stagger: 0.14,
      duration: 0.85,
      ease: EASE,
    });
  }

  /* Divider lines scale in from left */
  tl.from(
    '.section-hero .i-line',
    { scaleX: 0, stagger: 0.1, duration: 0.65, ease: EASE_SOFT, transformOrigin: 'left center' },
    '-=0.6'
  );

  /* Meta rows + subtitle row fade up */
  tl.from(
    '.hero-top-row, .hero-bottom-row',
    { opacity: 0, y: 18, stagger: 0.1, duration: 0.55, ease: EASE_SOFT },
    '-=0.5'
  );

  /* Scroll hint fades in last */
  tl.from(
    '.hero-scroll-hint',
    { opacity: 0, y: 10, duration: 0.5, ease: EASE_SOFT },
    '-=0.25'
  );
}

/* ============================================================
   HERO SCROLL PARALLAX  (sticky pin, scrub-linked)
   — name scales down + fades as user scrolls
   — video fades in + scales slightly
   — rows and scroll hint disappear
   ============================================================ */
function initHeroScroll() {
  if (!document.querySelector('.section-hero')) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.section-hero',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
    },
  });

  tl.to('.hero-name',    { scale: 0.86, opacity: 0, y: -55, ease: 'none' }, 0);
  tl.to('.hero-video',   { opacity: 0.5, scale: 1.07, ease: 'none' }, 0);
  tl.to('.hero-top-row, .hero-bottom-row, .hero-scroll-hint',
                         { opacity: 0, ease: 'none' }, 0);
  tl.to('.section-hero .i-line', { opacity: 0, ease: 'none' }, 0);
}

/* ============================================================
   INTRO SECTION — mask reveals on scroll
   — each word/phrase slides up from behind its .t-line-mask clip
   ============================================================ */
function initIntroReveal() {
  document.querySelectorAll('.intro-word').forEach((word, i) => {
    gsap.fromTo(word,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.9,
        ease: EASE,
        delay: i * 0.03,
        scrollTrigger: {
          trigger: word.closest('.t-line-mask'),
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/* ============================================================
   ABOUT SECTION — heading mask reveals + body/image fade
   ============================================================ */
function initAboutReveal() {
  document.querySelectorAll('.about-heading').forEach((h, i) => {
    gsap.fromTo(h,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.9,
        ease: EASE,
        delay: i * 0.07,
        scrollTrigger: {
          trigger: h.closest('.t-line-mask') || h,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  gsap.from('.about-body, .section-about .pill-btn', {
    opacity: 0, y: 24,
    stagger: 0.12,
    duration: 0.7,
    ease: EASE_SOFT,
    scrollTrigger: {
      trigger: '.about-body',
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  });

  gsap.from('.about-img-wrap', {
    opacity: 0, scale: 0.95,
    duration: 0.9,
    ease: EASE_SOFT,
    scrollTrigger: {
      trigger: '.about-img-wrap',
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  });
}

/* ============================================================
   WORKS — clip-path wipe reveal (scroll triggered)
   — card wipes in from top via clip-path inset
   — card-inner fades in with slight delay
   ============================================================ */
function initWorksReveal() {
  document.querySelectorAll('.t-card').forEach((card, i) => {
    const inner = card.querySelector('.t-card-inner');

    /* Start fully clipped (invisible), wipe down to reveal */
    gsap.set(card, { clipPath: 'inset(0 0 100% 0)' });
    if (inner) gsap.set(inner, { opacity: 0 });

    const st = {
      trigger: card,
      start: 'top 90%',
      toggleActions: 'play none none none',
    };

    gsap.to(card, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 0.9,
      ease: EASE,
      delay: i * 0.06,
      scrollTrigger: st,
    });

    if (inner) {
      gsap.to(inner, {
        opacity: 1,
        duration: 0.6,
        ease: EASE_SOFT,
        delay: i * 0.06 + 0.3,
        scrollTrigger: st,
      });
    }
  });

  /* CTA button fades up */
  gsap.from('.works-cta-row .pill-btn', {
    opacity: 0, y: 18,
    duration: 0.6,
    ease: EASE_SOFT,
    scrollTrigger: {
      trigger: '.works-cta-row',
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  });
}

/* ============================================================
   BREAK SECTION — clip-path wipe reveal per item
   ============================================================ */
function initBreakReveal() {
  document.querySelectorAll('.break-item').forEach((item, i) => {
    const inner = item.querySelector('.break-item-inner');

    gsap.set(item, { clipPath: 'inset(0 0 100% 0)' });
    if (inner) gsap.set(inner, { opacity: 0 });

    const st = {
      trigger: item,
      start: 'top 90%',
      toggleActions: 'play none none none',
    };

    gsap.to(item, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 0.9,
      ease: EASE,
      delay: i * 0.07,
      scrollTrigger: st,
    });

    if (inner) {
      gsap.to(inner, {
        opacity: 1,
        duration: 0.6,
        ease: EASE_SOFT,
        delay: i * 0.07 + 0.25,
        scrollTrigger: st,
      });
    }
  });
}

/* ============================================================
   SECTION HEADER LINES — scale in from left on scroll
   ============================================================ */
function initSectionHeaders() {
  document.querySelectorAll('.section-header-row').forEach((row) => {
    const line  = row.querySelector('.i-line--flex');
    const label = row.querySelector('.section-label');

    if (line) {
      gsap.from(line, {
        scaleX: 0,
        duration: 0.9,
        ease: EASE_SOFT,
        transformOrigin: 'left center',
        scrollTrigger: { trigger: row, start: 'top 90%', toggleActions: 'play none none none' },
      });
    }
    if (label) {
      gsap.from(label, {
        opacity: 0, x: -14,
        duration: 0.65,
        ease: EASE_SOFT,
        scrollTrigger: { trigger: row, start: 'top 90%', toggleActions: 'play none none none' },
      });
    }
  });
}

/* ============================================================
   3-LAYER CURSOR HOVER-REVEAL (work cards)
   — Layer 1 (outer .cursor-reveal):  follows cursor, slow drift
   — Layer 2 (.hover-reveal__inner):  rotation from mouse velocity
   — Layer 3 (.hover-reveal__img):    counter-parallax inside inner
   ============================================================ */
function initHoverReveal() {
  const cards  = document.querySelectorAll('.t-card[data-img]');
  const reveal = document.getElementById('cursor-reveal');
  const inner  = document.querySelector('.hover-reveal__inner');
  const img    = document.getElementById('cursor-reveal-img');

  if (!cards.length || !reveal || !img) return;

  let mouseX = 0, mouseY = 0;
  let prevX  = 0, prevY  = 0;
  let rafId  = null;
  let active = false;

  function trackMouse(e) {
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    prevX = mouseX;
    prevY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        /* Layer 1: outer follows cursor with smooth lag */
        gsap.to(reveal, {
          left: mouseX, top: mouseY,
          duration: 0.55, ease: EASE_SOFT,
          overwrite: 'auto',
        });

        if (active) {
          /* Layer 2: inner rotates subtly based on horizontal velocity */
          if (inner) {
            gsap.to(inner, {
              rotation: dx * 0.06,
              duration: 0.8, ease: EASE_SOFT,
              overwrite: 'auto',
            });
          }
          /* Layer 3: image parallaxes in opposite direction */
          gsap.to(img, {
            x: dx * -0.12,
            y: dy * -0.12,
            duration: 0.9, ease: EASE_SOFT,
            overwrite: 'auto',
          });
        }

        rafId = null;
      });
    }
  }

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      const src = card.getAttribute('data-img');
      if (src) img.src = src;
      active = true;
      reveal.classList.add('is-visible');

      /* Inner: slide up into position on enter */
      if (inner) {
        gsap.fromTo(inner,
          { yPercent: 10, scale: 0.94 },
          { yPercent: 0, scale: 1, duration: 0.65, ease: EASE }
        );
      }
    });

    card.addEventListener('mouseleave', () => {
      active = false;
      reveal.classList.remove('is-visible');
      if (inner) gsap.to(inner, { rotation: 0, yPercent: 0, duration: 0.55, ease: EASE_SOFT });
      gsap.to(img, { x: 0, y: 0, duration: 0.55, ease: EASE_SOFT });
    });
  });

  document.addEventListener('mousemove', trackMouse, { passive: true });
}

/* ============================================================
   MAGNETIC BUTTONS
   — .magnet elements pull toward cursor, snap back elastically
   ============================================================ */
function initMagnetic() {
  document.querySelectorAll('.magnet').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.34;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.34;
      gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: EASE_SOFT, overwrite: 'auto' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop() {
  document.querySelectorAll('.footer-back-top').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.8 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   PROJECT CARDS (projects.html) — clip-path wipe per card
   ============================================================ */
function initProjectReveal() {
  document.querySelectorAll('.project-card').forEach((card, i) => {
    gsap.fromTo(card,
      { clipPath: 'inset(0 0 100% 0)', opacity: 1 },
      {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.9,
        ease: EASE,
        delay: (i % 2) * 0.1,
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  let statusEl = document.getElementById('form-status');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.id = 'form-status';
    statusEl.style.display = 'none';
    statusEl.style.marginTop = '1rem';
    form.appendChild(statusEl);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn  = form.querySelector('.submit-btn');
    const orig = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    statusEl.style.display = 'none';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        statusEl.textContent = 'Message sent — talk soon.';
        statusEl.style.color = 'var(--black)';
        statusEl.style.display = 'block';
        form.reset();
        btn.textContent = 'Sent!';
        setTimeout(() => { btn.textContent = orig; btn.disabled = false; statusEl.style.display = 'none'; }, 3500);
      } else { throw new Error(); }
    } catch {
      statusEl.textContent = 'Something went wrong. Email me directly.';
      statusEl.style.color = '#c0392b';
      statusEl.style.display = 'block';
      btn.textContent = 'Try again';
      btn.disabled = false;
    }
  });
}

/* ============================================================
   ROW WRAPPER REVEAL — generic scroll-in for page elements
   (transform + opacity, mirrors .row-wrapper .row-inner pattern)
   ============================================================ */
function initRowReveals() {
  /* Page hero content on inner pages */
  const pageHero = document.querySelector('.page-hero');
  if (pageHero) {
    gsap.from(pageHero.children, {
      opacity: 0, y: 32,
      stagger: 0.12,
      duration: 0.75,
      ease: EASE_SOFT,
      delay: 0.2,
    });
  }

  /* Contact heading + subtext */
  const contactLeft = document.querySelector('.contact-inner > div:first-child');
  if (contactLeft) {
    gsap.from(contactLeft.children, {
      opacity: 0, y: 28,
      stagger: 0.1,
      duration: 0.7,
      ease: EASE_SOFT,
      delay: 0.25,
    });
  }
}

/* ============================================================
   MAIN INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.innerWidth < 768;

  initClock();
  initBackToTop();
  initForm();

  const lenis = initLenis();
  if (lenis) window.__lenis = lenis;

  const runAnimations = () => {
    try { revealHero(); } catch (_) { /* SplitText CDN may block */ }
    initHeroScroll();
    initIntroReveal();
    initAboutReveal();
    initWorksReveal();
    initBreakReveal();
    initHoverReveal();
    initMagnetic();
    initProjectReveal();
    initSectionHeaders();
    initRowReveals();
    ScrollTrigger.refresh();
  };

  if (isMobile) {
    runAnimations();
  } else {
    initPreloader(runAnimations);
  }

  window.addEventListener('resize', () => ScrollTrigger.refresh());
  window.addEventListener('orientationchange', () => {
    setTimeout(() => ScrollTrigger.refresh(), 200);
  });
});

/* Safety net — always dismiss preloader if any JS error occurs */
window.addEventListener('error', () => {
  const el = document.getElementById('preloader');
  if (el) el.style.display = 'none';
});
