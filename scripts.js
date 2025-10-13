// Draggable shapes functionality
function createDraggableShapes() {
  const backgroundContainer = document.createElement('div');
  backgroundContainer.className = 'background-container';
  document.body.appendChild(backgroundContainer);

  const shapes = [];
  const shapeTypes = ['circle', 'square', 'triangle'];
  const colors = ['brown', 'beige', 'green', 'white'];
  
  // Create 15-20 shapes
  for (let i = 0; i < 18; i++) {
    const shape = document.createElement('div');
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    shape.className = `draggable-shape shape-${shapeType} shape-${color}`;
    
    // Random size
    const size = Math.random() * 120 + 60;
    
    if (shapeType === 'triangle') {
      shape.style.width = '0';
      shape.style.height = '0';
      shape.style.borderLeft = `${size/2}px solid transparent`;
      shape.style.borderRight = `${size/2}px solid transparent`;
    } else {
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
    }
    
    // Random position
    shape.style.left = `${Math.random() * 85}%`;
    shape.style.top = `${Math.random() * 85}%`;
    
    // Random rotation for squares
    if (shapeType === 'square') {
      shape.style.transform = `rotate(${Math.random() * 360}deg)`;
    }
    
    backgroundContainer.appendChild(shape);
    shapes.push(shape);
    
    // Make shape draggable
    makeDraggable(shape);
  }
}

function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  element.onmousedown = dragMouseDown;
  
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves
    document.onmousemove = elementDrag;
  }
  
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }
  
  function closeDragElement() {
    // stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Touch support for mobile devices
function addTouchSupport() {
  let xDown = null;                                                        
  let yDown = null;
  let draggedElement = null;

  function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
    
    // Check if touching a draggable shape
    draggedElement = evt.target;
    if (!draggedElement.classList.contains('draggable-shape')) {
      draggedElement = null;
    }
  }

  function handleTouchMove(evt) {
    if (!draggedElement) return;
    
    evt.preventDefault();
    
    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;
    
    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;
    
    draggedElement.style.left = (draggedElement.offsetLeft - xDiff) + "px";
    draggedElement.style.top = (draggedElement.offsetTop - yDiff) + "px";
    
    xDown = xUp;
    yDown = yUp;
  }

  document.addEventListener('touchstart', handleTouchStart, false);        
  document.addEventListener('touchmove', handleTouchMove, false);
}

document.addEventListener("DOMContentLoaded", function () {
  const preloaderEl = document.getElementById("preloader");
  const contentEl = document.getElementById("content");
  const slideEase = "cubic-bezier(0.65,0.05,0.36,1)";

  // Get hero title lines from both possible locations
  const heroTitleLines = document.querySelectorAll(".hero-title .title-line span");
  const quoteTitleLines = document.querySelectorAll(".quote-section .title-line span");

  // Set initial states
  gsap.set(heroTitleLines, { y: "100%" });
  gsap.set(quoteTitleLines, { y: "100%" });
  gsap.set(".terminal-line", { opacity: 0 });

  function updateProgress(percent) {
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) progressBar.style.width = percent + "%";
  }

  function animateTerminalPreloader() {
    const tl = gsap.timeline({ onComplete: revealContent });
    const lines = Array.from(document.querySelectorAll(".terminal-line"));
    lines.forEach((line, i) => tl.to(line, { opacity: 1, duration: 0.3 }, i * 0.15));
    tl.to({}, { duration: 0.5 });
    tl.to(lines, { opacity: 0, duration: 0.3, stagger: 0.05 });
    tl.eventCallback("onUpdate", () => updateProgress(Math.min(99, tl.progress() * 100)));
    tl.call(() => updateProgress(100));
    return tl.play();
  }

  function revealContent() {
    const tl = gsap.timeline();
    tl.to(preloaderEl, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 0.8,
      ease: slideEase,
      onComplete: () => (preloaderEl.style.display = "none")
    });
    tl.to(contentEl, { opacity: 1, visibility: "visible", duration: 0.5 }, "-=0.3");
    
    // Animate hero section title lines if they exist
    if (heroTitleLines.length > 0) {
      tl.to(heroTitleLines, { 
        y: "0%", 
        duration: 0.8, 
        stagger: 0.1, 
        ease: slideEase 
      }, "-=0.3");
    }
    
    // Animate quote section title lines
    tl.to(quoteTitleLines, { 
      y: "0%", 
      duration: 0.8, 
      stagger: 0.1, 
      ease: slideEase 
    }, "-=0.5");
  }

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
      const tl = gsap.timeline({ onComplete: () => (isAnimating = false) });
      tl.to(overlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.6, 
        ease: slideEase,
        onStart: () => (overlay.style.pointerEvents = "all")
      });
      tl.to(featuredImage, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.6, 
        ease: slideEase
      }, "<");
      tl.to(navLinks, { 
        y: "0%", 
        duration: 0.6, 
        stagger: 0.05, 
        ease: slideEase 
      }, "<");
    }

    function closeMenu() {
      if (isAnimating) return;
      isAnimating = true;
      const tl = gsap.timeline({ onComplete: () => (isAnimating = false) });
      tl.to(navLinks, { 
        y: "-100%", 
        duration: 0.5, 
        stagger: 0.05, 
        ease: slideEase 
      });
      tl.to(featuredImage, {
        clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
        duration: 0.5, 
        ease: slideEase
      }, "<");
      tl.to(overlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 0.6, 
        ease: slideEase,
        onComplete: () => (overlay.style.pointerEvents = "none")
      }, "<");
    }

    // Add event listeners
    if (menuBtn) {
      menuBtn.addEventListener("click", openMenu);
    }
    
    if (closeBtn) {
      closeBtn.addEventListener("click", closeMenu);
    }
    
    if (navLinks) {
      navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    }

    // Add click event to overlay background (optional)
    overlay.addEventListener("click", function(e) {
      if (e.target === overlay) {
        closeMenu();
      }
    });
  }

  // Initialize everything
  createDraggableShapes();
  addTouchSupport();
  animateTerminalPreloader();
  initializeMenu();
});