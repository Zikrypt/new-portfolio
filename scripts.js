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
   HERO SCROLL — TRUE PINNED SCRUB
   — ScrollTrigger pins the section for +100% scroll distance
   — big wordmark compresses + drifts up + fades (scrubbed)
   — side sub-words migrate inward to merge toward center
   — video tile fades in and gently scales, caption reveals
   — meta rows / dividers / scroll hint fade out
   ============================================================ */
function initHeroScroll() {
  if (!document.querySelector('.section-hero')) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.section-hero',
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: true,
      scrub: 1.1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  tl.to('.hero-name',       { scale: 0.54, y: -30, opacity: 0.1, ease: 'none' }, 0);
  tl.to('.hero-sub--left',  { xPercent: 150, ease: 'none' }, 0);
  tl.to('.hero-sub--right', { xPercent: -150, ease: 'none' }, 0);
  tl.to('.hero-bottom-row', { scale: 0.72, ease: 'none' }, 0);

  tl.to('.hero-video',         { opacity: 0.78, scale: 1.05, ease: 'none' }, 0);
  tl.to('.hero-video-caption', { opacity: 1, ease: 'none' }, 0.25);

  tl.to('.hero-top-row, .hero-scroll-hint, .section-hero .i-line',
                                { opacity: 0, ease: 'none' }, 0);
}

/* ============================================================
   INTRO SECTION (brown #35180A) — smooth scrubbed mask reveals
   — each word slides up from behind its .t-line-mask clip tied
     to scroll progress (scrub)
   — caption chips crossfade through the section progress
   ============================================================ */
function initIntroReveal() {
  const section = document.querySelector('.section-intro');
  if (!section) return;

  const words    = section.querySelectorAll('.intro-word');
  const captions = section.querySelectorAll('.intro-caption');

  /* Words: scrubbed mask reveal across the section */
  if (words.length) {
    gsap.set(words, { yPercent: 110 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'bottom 45%',
        scrub: 1,
      },
    });

    words.forEach((word, i) => {
      tl.to(word, { yPercent: 0, ease: 'none' }, i * 0.12);
    });
  }

  /* Captions: crossfade tied to section scroll progress */
  if (captions.length) {
    gsap.set(captions, { opacity: 0, y: 12 });

    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'bottom 20%',
      onUpdate: (self) => {
        const segs = captions.length;
        const idx  = Math.min(segs - 1, Math.floor(self.progress * segs));
        captions.forEach((c, i) => {
          gsap.to(c, {
            opacity: i === idx ? 1 : 0,
            y: i === idx ? 0 : 12,
            duration: 0.5,
            ease: EASE_SOFT,
            overwrite: 'auto',
          });
        });
      },
    });
  }
}

/* ============================================================
   ABOUT SECTION — heading mask reveals + body/image fade
   ============================================================ */
function initAboutReveal() {
  document.querySelectorAll('.about-heading').forEach((h, i) => {
    gsap.set(h, { yPercent: 110 });
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
   PAGE TRANSITIONS — route-aware clip-path wipes
   Each route has a dedicated themed panel and a unique wipe
   direction. Mirrors the jasminegunarto.com pattern:
     • home    — vertical (collapses upward)
     • works   — horizontal (reveals from left, slides right)
     • study   — horizontal (reveals from right, slides left)
     • contact — diagonal/corner reveal
   ============================================================ */
const ROUTE_MAP = {
  'index.html':     'home',
  '':               'home',
  '/':              'home',
  'projects.html':  'works',
  'casestudy.html': 'study',
  'contact.html':   'contact',
};

/* Inset states: [top, right, bottom, left] in % */
const PANEL_STATES = {
  home: {
    cover:  'inset(0% 0% 0% 0%)',
    enter:  'inset(100% 0% 0% 0%)',  /* covers from bottom up */
    exit:   'inset(0% 0% 100% 0%)',  /* collapses upward to reveal */
  },
  works: {
    cover:  'inset(0% 0% 0% 0%)',
    enter:  'inset(0% 100% 0% 0%)',  /* reveals from left edge */
    exit:   'inset(0% 0% 0% 100%)',  /* slides off to the right */
  },
  study: {
    cover:  'inset(0% 0% 0% 0%)',
    enter:  'inset(0% 0% 0% 100%)',  /* reveals from right edge */
    exit:   'inset(0% 100% 0% 0%)',  /* slides off to the left */
  },
  contact: {
    cover:  'inset(0% 0% 0% 0%)',
    enter:  'inset(100% 100% 0% 0%)',/* opens from bottom-left corner */
    exit:   'inset(0% 0% 100% 100%)',/* closes to top-right corner */
  },
};

function routeFromHref(href) {
  if (!href) return null;
  const clean = href.split('#')[0].split('?')[0].split('/').pop();
  return ROUTE_MAP[clean] || null;
}

function initPageTransitions() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  const panels = {};
  overlay.querySelectorAll('.pt-panel').forEach((p) => {
    panels[p.dataset.route] = p;
    /* default — fully hidden until JS drives them */
    gsap.set(p, { clipPath: 'inset(0% 0% 100% 0%)', webkitClipPath: 'inset(0% 0% 100% 0%)' });
  });

  const currentRoute = document.body.dataset.route || 'home';
  const currentPanel = panels[currentRoute];
  const states = PANEL_STATES[currentRoute] || PANEL_STATES.home;

  /* Pre-cover the current route's panel so it's already
     covering the viewport when the preloader lifts.
     The actual reveal is triggered later by playIntroReveal(). */
  if (currentPanel) {
    overlay.classList.add('is-active');
    /* Place this panel above siblings during the intro */
    Object.values(panels).forEach((p) => p.style.zIndex = '1');
    currentPanel.style.zIndex = '2';
    gsap.set(currentPanel, { clipPath: states.cover, webkitClipPath: states.cover });
  }

  /* Exposed so MAIN INIT can fire it after the preloader exits */
  window.__playIntroReveal = () => {
    if (!currentPanel) return;
    if (currentPanel.dataset.played === '1') return;
    currentPanel.dataset.played = '1';

    gsap.to(currentPanel, {
      clipPath: states.exit,
      webkitClipPath: states.exit,
      duration: 1.05,
      ease: EASE,
      delay: 0.05,
      onComplete: () => {
        overlay.classList.remove('is-active');
        Object.values(panels).forEach((p) => {
          gsap.set(p, { clipPath: 'inset(0% 0% 100% 0%)', webkitClipPath: 'inset(0% 0% 100% 0%)' });
        });
      },
    });
  };

  /* Safety net — if MAIN INIT never calls it (older entry point,
     errors elsewhere), still reveal the panel after a beat. */
  setTimeout(() => window.__playIntroReveal && window.__playIntroReveal(), 4000);

  /* ── EXIT TRANSITION ─────────────────────────────────────
     On internal-link click, run the destination route's
     enter wipe to fully cover the viewport, then navigate. */
  const isInternal = (href) => {
    if (!href) return false;
    if (href.startsWith('#'))     return false;
    if (/^(https?:|\/\/|mailto:|tel:)/i.test(href)) return false;
    return true;
  };

  document.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!isInternal(href))       return;
    if (a.target === '_blank')   return;
    if (a.hasAttribute('download')) return;

    const targetRoute = routeFromHref(href);
    if (!targetRoute || !panels[targetRoute]) return;
    if (targetRoute === currentRoute) return; /* same page — let it scroll */

    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();

      const panel = panels[targetRoute];
      const s = PANEL_STATES[targetRoute];

      let navigated = false;
      const go = () => { if (navigated) return; navigated = true; window.location.href = href; };

      overlay.classList.add('is-active');
      /* Place the chosen panel above the others */
      Object.values(panels).forEach((p) => p.style.zIndex = '1');
      panel.style.zIndex = '2';

      gsap.set(panel, { clipPath: s.enter, webkitClipPath: s.enter });
      gsap.to(panel, {
        clipPath: s.cover,
        webkitClipPath: s.cover,
        duration: 0.85,
        ease: EASE,
        onComplete: go,
      });

      /* Safety net — navigate even if the ticker stalls (e.g. bg tab) */
      setTimeout(go, 1100);
    });
  });
}

/* ============================================================
   CARD HOVER VIDEOS — play on mouseenter, pause on leave
   Drop-in for .t-card-hover-media / .break-hover-media videos.
   ============================================================ */
function initCardHoverVideo() {
  document.querySelectorAll('.t-card, .break-item').forEach((card) => {
    const vid = card.querySelector('.t-card-hover-media, .break-hover-media');
    if (!vid) return;
    card.addEventListener('mouseenter', () => {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => { vid.pause(); });
  });
}

/* ============================================================
   MAIN INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.innerWidth < 768;

  initClock();
  initBackToTop();
  initForm();
  initPageTransitions();
  initCardHoverVideo();

  const lenis = initLenis();
  if (lenis) window.__lenis = lenis;

  const runAnimations = () => {
    /* Play the page-transition intro reveal first so its
       clip-path wipe is visible the moment the preloader lifts. */
    if (window.__playIntroReveal) window.__playIntroReveal();
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
    const preloaderEl = document.getElementById('preloader');
    if (preloaderEl) preloaderEl.style.display = 'none';
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
