// =============================================
// ZIKORA OKELO PORTFOLIO — 2026 REDESIGN
// =============================================

// ---- CUSTOM CURSOR ----
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => cursor.classList.add('cursor--hidden'));
  document.addEventListener('mouseenter', () => cursor.classList.remove('cursor--hidden'));

  const hoverTargets = document.querySelectorAll('a, button, [data-cursor]');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
  });

  function tick() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top = curY + 'px';
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
}

// ---- PRELOADER ----
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) {
    initHeroAnimation();
    return;
  }

  const counter = preloader.querySelector('.preloader__counter');
  const bar = preloader.querySelector('.preloader__bar');

  let count = 0;
  const total = 100;
  const duration = 1800;
  const step = duration / total;

  const timer = setInterval(() => {
    count++;
    const display = count < 10 ? '0' + count : '' + count;
    if (counter) counter.textContent = display;
    if (bar) bar.style.width = count + '%';

    if (count >= total) {
      clearInterval(timer);
      setTimeout(() => {
        preloader.style.transition = 'clip-path 0.85s cubic-bezier(0.76, 0, 0.24, 1)';
        preloader.style.clipPath = 'inset(0 0 100% 0)';
        setTimeout(() => {
          preloader.style.display = 'none';
          initHeroAnimation();
        }, 900);
      }, 250);
    }
  }, step);
}

// ---- HERO ANIMATION ----
function initHeroAnimation() {
  const eyebrow = document.querySelector('.hero__eyebrow');
  const lines = document.querySelectorAll('.hero__name .line span');
  const meta = document.querySelector('.hero__meta');

  if (eyebrow) {
    setTimeout(() => {
      eyebrow.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      eyebrow.style.opacity = '1';
      eyebrow.style.transform = 'translateY(0)';
    }, 80);
  }

  lines.forEach((span, i) => {
    setTimeout(() => {
      span.style.transition = 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)';
      span.style.transform = 'translateY(0)';
    }, 180 + i * 130);
  });

  if (meta) {
    setTimeout(() => {
      meta.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      meta.style.opacity = '1';
      meta.style.transform = 'translateY(0)';
    }, 650);
  }
}

// ---- SCROLL REVEAL ----
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ---- PROJECT ITEMS STAGGER ----
function initProjectReveal() {
  const items = document.querySelectorAll('.project-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(24px)';
    item.style.transition = 'opacity 0.65s cubic-bezier(0.76, 0, 0.24, 1), transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)';
    observer.observe(item);
  });
}

// ---- MOBILE NAV ----
function initMobileNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const overlay = document.querySelector('.nav-mobile-overlay');
  if (!hamburger || !overlay) return;

  let isOpen = false;

  function setHamburger(open) {
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  }

  hamburger.addEventListener('click', () => {
    isOpen = !isOpen;
    overlay.classList.toggle('open', isOpen);
    setHamburger(isOpen);
  });

  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      isOpen = false;
      overlay.classList.remove('open');
      setHamburger(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
      overlay.classList.remove('open');
      setHamburger(false);
    }
  });
}

// ---- CONTACT FORM ----
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sending... →';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        btn.innerHTML = 'Sent ✓';
        btn.style.background = '#4CAF50';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      } else {
        throw new Error('Failed');
      }
    } catch {
      btn.innerHTML = 'Error — try again';
      btn.style.background = '#ff4444';
      btn.disabled = false;
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
      }, 3000);
    }
  });
}

// ---- NAV SCROLL STYLE ----
function initNavScroll() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(12,12,12,0.92)';
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.borderBottom = '1px solid var(--border)';
    } else {
      nav.style.background = '';
      nav.style.backdropFilter = '';
      nav.style.borderBottom = '';
    }
  }, { passive: true });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initPreloader();
  initScrollReveal();
  initProjectReveal();
  initMobileNav();
  initContactForm();
  initNavScroll();
});
