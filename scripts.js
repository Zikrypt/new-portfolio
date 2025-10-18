// Enhanced Draggable shapes functionality with Mobile Optimizations
function createDraggableShapes() {
  const backgroundContainer = document.createElement('div');
  backgroundContainer.className = 'background-container';
  document.body.appendChild(backgroundContainer);

  const shapes = [];
  const shapeTypes = ['circle', 'square'];
  const colors = ['brown', 'beige', 'green'];
  
  // Reduced number of shapes for mobile performance
  const shapeCount = window.innerWidth < 768 ? 6 : 10;
  
  for (let i = 0; i < shapeCount; i++) {
    const shape = document.createElement('div');
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    shape.className = `draggable-shape shape-${shapeType} shape-${color}`;
    shape.setAttribute('data-shape-id', i);
    
    // Size based on screen size
    const size = window.innerWidth < 768 ? 
      Math.random() * 40 + 30 : 
      Math.random() * 80 + 40;
    
    if (shapeType === 'triangle') {
      shape.style.width = '0';
      shape.style.height = '0';
      shape.style.borderLeft = `${size/2}px solid transparent`;
      shape.style.borderRight = `${size/2}px solid transparent`;
    } else {
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
    }
    
    // Enhanced random position with boundaries
    shape.style.left = `${Math.random() * 85}%`;
    shape.style.top = `${Math.random() * 85}%`;
    
    // Reduced animation complexity for mobile
    const opacity = 0.4 + Math.random() * 0.3;
    const animationDelay = Math.random() * 5;
    
    shape.style.opacity = opacity;
    shape.style.animationDelay = `${animationDelay}s`;
    
    // Random rotation for squares only
    if (shapeType === 'square') {
      const rotation = Math.random() * 360;
      shape.style.transform = `rotate(${rotation}deg)`;
    }
    
    backgroundContainer.appendChild(shape);
    shapes.push(shape);
    
    // Make shape draggable with enhanced functionality
    makeDraggable(shape);
    
    // Add click interaction for micro-interactions
    shape.addEventListener('click', (e) => {
      e.stopPropagation();
      animateShapeClick(shape);
    });
  }
  
  return shapes;
}

// Enhanced drag functionality with touch support
function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let isDragging = false;
  
  // Mouse events
  element.addEventListener('mousedown', dragMouseDown);
  
  // Touch events
  element.addEventListener('touchstart', dragTouchStart, { passive: false });
  
  function dragMouseDown(e) {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
    document.addEventListener('mousemove', elementDrag);
    document.addEventListener('mouseup', closeDragElement);
  }
  
  function dragTouchStart(e) {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
    document.addEventListener('touchmove', elementTouchMove, { passive: false });
    document.addEventListener('touchend', closeDragElement);
  }
  
  function startDrag(clientX, clientY) {
    isDragging = true;
    element.classList.add('dragging-active');
    pos3 = clientX;
    pos4 = clientY;
    document.body.style.userSelect = 'none';
    document.body.style.touchAction = 'none';
  }
  
  function elementDrag(e) {
    if (!isDragging) return;
    e.preventDefault();
    updatePosition(e.clientX, e.clientY);
  }
  
  function elementTouchMove(e) {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    updatePosition(touch.clientX, touch.clientY);
  }
  
  function updatePosition(clientX, clientY) {
    pos1 = pos3 - clientX;
    pos2 = pos4 - clientY;
    pos3 = clientX;
    pos4 = clientY;
    
    const newTop = element.offsetTop - pos2;
    const newLeft = element.offsetLeft - pos1;
    
    // Apply smooth transform
    element.style.transform = `translate(${newLeft - element.offsetLeft}px, ${newTop - element.offsetTop}px)`;
    
    // Update actual position
    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
  }
  
  function closeDragElement() {
    isDragging = false;
    element.classList.remove('dragging-active');
    element.style.transform = '';
    
    // Clean up event listeners
    document.removeEventListener('mousemove', elementDrag);
    document.removeEventListener('touchmove', elementTouchMove);
    document.removeEventListener('mouseup', closeDragElement);
    document.removeEventListener('touchend', closeDragElement);
    
    // Restore body styles
    document.body.style.userSelect = '';
    document.body.style.touchAction = '';
    
    // Add subtle bounce effect
    animateShapeBounce(element);
  }
}

// Enhanced shape animations for modern UI
function animateShapeClick(shape) {
  gsap.to(shape, {
    scale: 1.2,
    duration: 0.15,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut"
  });
}

function animateShapeBounce(shape) {
  gsap.to(shape, {
    y: "+=5",
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: "elastic.out(1, 0.5)"
  });
}

// Modern Scroll Animations with mobile optimization
function initScrollAnimations() {
  if (typeof ScrollTrigger === 'undefined') {
    console.log('ScrollTrigger not available, skipping scroll animations');
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Animate project cards on scroll
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.fromTo(card, {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        end: "bottom 20%",
        toggleActions: "play none none none"
      },
      delay: i * 0.1
    });
  });
  
  // Animate contact methods
  gsap.utils.toArray('.contact-method').forEach((method, i) => {
    gsap.fromTo(method, {
      opacity: 0,
      scale: 0.8
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: method,
        start: "top 95%",
        toggleActions: "play none none none"
      }
    });
  });
  
  // Animate social media cards
  gsap.utils.toArray('.social-media-card').forEach((card, i) => {
    gsap.fromTo(card, {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 95%",
        toggleActions: "play none none none"
      },
      delay: i * 0.1
    });
  });
}

// Enhanced Text Animations
function initTextAnimations() {
  const textElements = document.querySelectorAll('.text-reveal-element');
  
  textElements.forEach((element, index) => {
    gsap.fromTo(element, {
      y: 50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 95%",
        toggleActions: "play none none none"
      },
      delay: index * 0.1
    });
  });
}

// Enhanced Cursor Effects (desktop only)
function initCursorEffects() {
  if (window.matchMedia("(pointer: fine)").matches && window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    
    const interactiveElements = document.querySelectorAll('a, button, .draggable-shape, .nav-link');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
      });
    });
  }
}

// Enhanced Form Interactions
function initFormInteractions() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  
  const inputs = form.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
    
    input.addEventListener('input', () => {
      validateField(input);
    });
  });
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    gsap.to(submitBtn, {
      scale: 0.95,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      submitBtn.textContent = 'Message Sent!';
      submitBtn.style.background = 'var(--color-accent)';
      
      setTimeout(() => {
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
      }, 3000);
      
    } catch (error) {
      submitBtn.textContent = 'Error - Try Again';
      submitBtn.style.background = '#ef4444';
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
      }, 3000);
    }
  });
}

function validateField(field) {
  const value = field.value.trim();
  
  if (!value) return;
  
  let isValid = true;
  
  switch(field.type) {
    case 'email':
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      break;
    case 'text':
      isValid = value.length >= 2;
      break;
    case 'textarea':
      isValid = value.length >= 10;
      break;
  }
  
  if (isValid) {
    field.style.borderColor = 'var(--color-accent)';
  } else {
    field.style.borderColor = '#ef4444';
  }
}

// Enhanced Terminal Preloader with Mobile Support
function animateTerminalPreloader() {
  const tl = gsap.timeline({ onComplete: revealContent });
  const lines = Array.from(document.querySelectorAll(".terminal-line"));
  
  // Enhanced line animations with mobile optimization
  lines.forEach((line, i) => {
    tl.to(line, { 
      opacity: 1, 
      duration: 0.2,
      ease: "power2.out"
    }, i * 0.1);
    
    const highlights = line.querySelectorAll('.highlight');
    if (highlights.length > 0) {
      tl.to(highlights, {
        textShadow: '0 0 8px currentColor',
        duration: 0.4,
        ease: "power2.inOut"
      }, i * 0.1);
    }
  });
  
  tl.to({}, { duration: 0.3 });
  
  tl.to(lines, { 
    opacity: 0, 
    duration: 0.2, 
    stagger: 0.03,
    ease: "power2.in" 
  });
  
  tl.eventCallback("onUpdate", function() {
    const progress = Math.min(99, this.progress() * 100);
    updateProgress(progress);
  });
  
  tl.call(() => updateProgress(100));
  
  return tl.play();
}

function updateProgress(percent) {
  const progressBar = document.getElementById("progress-bar");
  if (progressBar) {
    progressBar.style.width = percent + "%";
    
    if (percent > 90) {
      progressBar.style.boxShadow = '0 0 8px var(--color-accent)';
    }
  }
}

// Enhanced Content Reveal with Mobile Optimization
function revealContent() {
  const tl = gsap.timeline();
  const preloaderEl = document.getElementById("preloader");
  const contentEl = document.getElementById("content");
  const slideEase = "cubic-bezier(0.65,0.05,0.36,1)";

  if (contentEl) {
    contentEl.style.opacity = "1";
    contentEl.style.visibility = "visible";
  }

  if (preloaderEl) {
    tl.to(preloaderEl, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 0.6,
      ease: slideEase,
      onComplete: () => {
        if (preloaderEl) {
          preloaderEl.style.display = "none";
        }
        initScrollAnimations();
        initTextAnimations();
      }
    });
  }
  
  const heroTitleLines = document.querySelectorAll(".hero-title .title-line span");
  if (heroTitleLines.length > 0) {
    tl.to(heroTitleLines, { 
      y: "0%", 
      duration: 0.6, 
      stagger: 0.08, 
      ease: "back.out(1.7)" 
    }, "-=0.2");
  }
  
  const shapes = document.querySelectorAll('.draggable-shape');
  if (shapes.length > 0) {
    tl.fromTo(shapes, {
      scale: 0,
      rotation: 180
    }, {
      scale: 1,
      rotation: 0,
      duration: 0.8,
      stagger: 0.01,
      ease: "elastic.out(1, 0.5)"
    }, "-=0.3");
  }
}

// Enhanced Menu System - MOBILE OPTIMIZED
function initializeMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const closeBtn = document.getElementById("close-btn");
  const overlay = document.getElementById("overlay");
  const featuredImage = document.getElementById("featured-image");
  const navLinks = document.querySelectorAll(".nav-link");
  let isAnimating = false;

  function openMenu() {
    if (isAnimating) return;
    isAnimating = true;
    
    const tl = gsap.timeline({ 
      onComplete: () => {
        isAnimating = false;
        if (overlay) overlay.style.pointerEvents = "all";
      }
    });
    
    if (!overlay) return;
    
    // Hide featured image on mobile
    if (window.innerWidth < 768 && featuredImage) {
      featuredImage.style.display = "none";
    }
    
    tl.to(overlay, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 0.4, 
      ease: "power2.inOut"
    });
    
    if (featuredImage && window.innerWidth >= 768) {
      tl.to(featuredImage, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.4, 
        ease: "power2.out"
      }, "<");
    }
    
    if (navLinks.length > 0) {
      tl.to(navLinks, { 
        y: "0%", 
        duration: 0.4, 
        stagger: 0.03, 
        ease: "back.out(1.7)" 
      }, "<");
    }
  }

  function closeMenu() {
    if (isAnimating) return;
    isAnimating = true;
    
    const tl = gsap.timeline({ 
      onComplete: () => {
        isAnimating = false;
        if (overlay) {
          overlay.style.pointerEvents = "none";
        }
        // Restore featured image display
        if (featuredImage) {
          featuredImage.style.display = "block";
        }
      }
    });
    
    if (navLinks.length > 0) {
      tl.to(navLinks, { 
        y: "-100%", 
        duration: 0.3, 
        stagger: 0.03, 
        ease: "power2.in" 
      });
    }
    
    if (featuredImage && window.innerWidth >= 768) {
      tl.to(featuredImage, {
        clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
        duration: 0.3, 
        ease: "power2.in"
      }, "<");
    }
    
    if (overlay) {
      tl.to(overlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 0.4, 
        ease: "power2.inOut"
      }, "<");
    }
  }

  // Add event listeners
  if (menuBtn) {
    menuBtn.addEventListener("click", openMenu);
    menuBtn.addEventListener("touchstart", openMenu, { passive: true });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
    closeBtn.addEventListener("touchstart", closeMenu, { passive: true });
  }
  
  // Handle nav link clicks
  if (navLinks) {
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        
        closeMenu();
        
        setTimeout(() => {
          if (target && target.startsWith('#')) {
            const section = document.querySelector(target);
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' });
            }
          } else if (target) {
            window.location.href = target;
          }
        }, 400);
      });
      
      // Add touch support
      link.addEventListener("touchstart", (e) => {
        e.preventDefault();
        link.click();
      }, { passive: false });
    });
  }

  // Close menu when clicking on overlay background
  if (overlay) {
    overlay.addEventListener("click", function(e) {
      if (e.target === overlay) {
        closeMenu();
      }
    });
    
    // Touch support for overlay
    overlay.addEventListener("touchstart", function(e) {
      if (e.target === overlay) {
        closeMenu();
      }
    }, { passive: true });
  }
  
  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.style.pointerEvents === "all") {
      closeMenu();
    }
  });
}

// Add enhanced CSS styles dynamically
function addEnhancedStyles() {
  const styles = `
    /* Mobile-first responsive improvements */
    @media (max-width: 767px) {
      .featured-image {
        display: none;
      }
      
      .nav-menu {
        left: 1rem;
        width: calc(100% - 2rem);
      }
      
      .overlay-header, 
      .overlay-footer {
        padding: 1rem;
      }
    }
    
    /* Prevent zoom on input focus on mobile */
    @media (max-width: 768px) {
      input, textarea, select {
        font-size: 16px !important;
      }
    }
    
    /* Improved touch targets for mobile */
    @media (max-width: 768px) {
      .nav-link {
        padding: 0.5rem 0;
      }
      
      .project-link,
      .tech-tag,
      .social-links a {
        min-height: 44px;
        min-width: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .menu-toggle p,
      .close-toggle p {
        padding: 12px;
        min-height: 44px;
        display: flex;
        align-items: center;
      }
    }
    
    /* Performance optimizations */
    .draggable-shape {
      will-change: transform;
    }
    
    /* Smooth scrolling for all devices */
    html {
      scroll-behavior: smooth;
    }
    
    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// Handle viewport changes
function handleResize() {
  // Reinitialize animations on resize if needed
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

// Error handling for better UX
window.addEventListener('error', (e) => {
  console.error('Script error:', e.error);
  
  const contentEl = document.getElementById("content");
  const preloaderEl = document.getElementById("preloader");
  
  if (contentEl) {
    contentEl.style.opacity = "1";
    contentEl.style.visibility = "visible";
  }
  
  if (preloaderEl) {
    preloaderEl.style.display = "none";
  }
});

// Main initialization with mobile-first approach
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing with mobile optimizations...");
  
  try {
    // Apply mobile fixes first
    applyMobileFixes();

    // Initialize core functionality
    initializeMenu();

    // Check if we're on a page with preloader
    const preloaderEl = document.getElementById("preloader");

    // Mobile: skip preloader and animations
    if (window.innerWidth < 768) {
      if (preloaderEl) {
        preloaderEl.style.display = "none";
      }

      const contentEl = document.getElementById("content");
      if (contentEl) {
        contentEl.style.opacity = "1";
        contentEl.style.visibility = "visible";
      }

      createDraggableShapes();
      initScrollAnimations();
      initFormInteractions();
      addEnhancedStyles();
    } else {
      // Desktop: use animations
      gsap.set(".hero-title .title-line span", { y: "100%" });
      gsap.set(".terminal-line", { opacity: 0 });
      gsap.set(".text-reveal-element", { y: 50, opacity: 0 });

      if (preloaderEl) {
        console.log("Preloader found, starting animation sequence");
        createDraggableShapes();
        animateTerminalPreloader();
      } else {
        console.log("No preloader found, revealing content immediately");
        createDraggableShapes();

        const contentEl = document.getElementById("content");
        if (contentEl) {
          contentEl.style.opacity = "1";
          contentEl.style.visibility = "visible";
        }

        initScrollAnimations();
        initTextAnimations();
      }

      setTimeout(() => {
        initCursorEffects();
        initFormInteractions();
        addEnhancedStyles();
      }, 100);
    }

    // Add resize handler
    window.addEventListener('resize', handleResize);

  } catch (error) {
    console.error("Initialization error:", error);

    const contentEl = document.getElementById("content");
    const preloaderEl = document.getElementById("preloader");

    if (contentEl) {
      contentEl.style.opacity = "1";
      contentEl.style.visibility = "visible";
    }

    if (preloaderEl) {
      preloaderEl.style.display = "none";
    }
  }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
});

// Mobile-specific fixes
function applyMobileFixes() {
  if (window.innerWidth < 768) {
    // Force content visibility on mobile
    const contentEl = document.getElementById("content");
    if (contentEl) {
      contentEl.style.opacity = "1";
      contentEl.style.visibility = "visible";
      contentEl.classList.add('mobile-fix');
    }

    // Hide preloader immediately on mobile
    const preloaderEl = document.getElementById("preloader");
    if (preloaderEl) {
      preloaderEl.style.display = "none";
    }

    // Ensure all main sections are visible
    const mainSections = document.querySelectorAll('main, .about-section, .projects-main, .contact-main');
    mainSections.forEach(section => {
      section.style.opacity = "1";
      section.style.visibility = "visible";
    });
  }
}