// Configuração inicial para melhor performance
gsap.config({
  force3D: true
});

// Detecta dispositivo mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Ajusta configurações baseado no dispositivo
if (isMobile) {
  gsap.ticker.fps(30);
  gsap.ticker.lagSmoothing(0);
}

// Menu Code
const menuOpen = document.getElementById('menu-toggle-open');
const menuClose = document.getElementById('menu-toggle-close');
const menu = document.querySelector('.menu');
const overlay = document.querySelector('.overlay');

function openMenu(e) {
  e.preventDefault();
  menu.classList.add('active');
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeMenu(e) {
  e.preventDefault();
  menu.classList.remove('active');
  overlay.style.display = 'none';
  document.body.style.overflow = '';
}

['click', 'touchstart'].forEach(evt => {
  menuOpen.addEventListener(evt, openMenu, { passive: false });
  menuClose.addEventListener(evt, closeMenu, { passive: false });
  overlay.addEventListener(evt, closeMenu, { passive: false });
});

// Gradient Code
const gradientCanvas = document.getElementById('gradient');
const ctx = gradientCanvas.getContext('2d');

function resizeGradientCanvas() {
  gradientCanvas.width = window.innerWidth;
  gradientCanvas.height = window.innerHeight;
}

function createGradient(time) {
  if (isMobile) {
      const gradient = ctx.createLinearGradient(0, 0, gradientCanvas.width, gradientCanvas.height);
      gradient.addColorStop(0, '#CC5500');
      gradient.addColorStop(1, '#ceba9c');
      return gradient;
  }
  
  const gradient = ctx.createRadialGradient(
      gradientCanvas.width * (0.5 + Math.sin(time * 0.0003) * 0.2),
      gradientCanvas.height * (0.5 + Math.cos(time * 0.0004) * 0.2),
      0,
      gradientCanvas.width * (0.5 + Math.cos(time * 0.0003) * 0.2),
      gradientCanvas.height * (0.5 + Math.sin(time * 0.0004) * 0.2),
      gradientCanvas.width * 0.7
  );

  gradient.addColorStop(0, '#CC5500');
  gradient.addColorStop(1, '#ceba9c');

  return gradient;
}

function animateGradient(time) {
  ctx.fillStyle = createGradient(time);
  ctx.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);
  requestAnimationFrame(animateGradient);
}

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Inicialização do gradient
resizeGradientCanvas();
requestAnimationFrame(animateGradient);

// Otimize o ScrollTrigger para mobile
ScrollTrigger.config({
  ignoreMobileResize: true
});

// Animação do texto inicial
const textElements = document.querySelectorAll('.main-title, .is-a, .subtitle');
const tl = gsap.timeline({
  onComplete: () => {
      textElements.forEach(element => {
          if (element.split) element.split.revert();
      });
  }
});

textElements.forEach((element, index) => {
  const text = new SplitType(element, {
      types: 'chars',
      tagName: 'span'
  });

  tl.from(text.chars, {
      opacity: 0,
      y: isMobile ? 25 : 50,
      duration: isMobile ? 0.8 : 1,
      stagger: isMobile ? 0.01 : 0.02,
      ease: "power4.out"
  }, index * (isMobile ? 0.2 : 0.3));
});

// Animação da transição curva
gsap.to('.curved-transition', {
  scrollTrigger: {
      trigger: '.hero-section',
      start: "top top",
      end: isMobile ? "bottom 80%" : "bottom center",
      scrub: isMobile ? 0.3 : 0.5,
      markers: false
  },
  y: '0%',
  ease: "none"
});

// Fade do hero section
gsap.to('.hero-section', {
  scrollTrigger: {
      trigger: '.services-section',
      start: "top bottom",
      end: "top top",
      scrub: isMobile ? 1 : 2,
  },
  opacity: 0,
  ease: "none"
});

// Alteração de cor do menu no scroll
gsap.to('#menu-toggle-open', {
  scrollTrigger: {
      trigger: '.services-section',
      start: "top 70%",
      end: "bottom 80px",
      onEnter: () => document.getElementById('menu-toggle-open').classList.add('light-section'),
      onLeave: () => document.getElementById('menu-toggle-open').classList.remove('light-section'),
      onEnterBack: () => document.getElementById('menu-toggle-open').classList.add('light-section'),
      onLeaveBack: () => document.getElementById('menu-toggle-open').classList.remove('light-section'),
  }
});

// Marquee Code
const marqueeContent = document.querySelector('.marquee-content');
const marqueeItems = document.querySelectorAll('.marquee-item');

if (marqueeItems.length > 0) {
  marqueeItems.forEach(item => {
      const clone = item.cloneNode(true);
      marqueeContent.appendChild(clone);
  });
}

// Otimiza o marquee para mobile
const marqueeSpeed = isMobile ? 40 : 27;

let lastScrollPosition = 0;
let isReversed = false;

window.addEventListener('scroll', function() {
  if (!marqueeContent) return;
  
  const st = window.scrollY || document.documentElement.scrollTop;

  if (st > lastScrollPosition) {
      if (isReversed) {
          marqueeContent.style.animation = `marquee ${marqueeSpeed}s linear infinite`;
          isReversed = false;
      }
  } else {
      if (!isReversed) {
          marqueeContent.style.animation = `marquee ${marqueeSpeed}s linear infinite reverse`;
          isReversed = true;
      }
  }

  lastScrollPosition = st <= 0 ? 0 : st;
}, { passive: true });

// Event Listeners com passive true para melhor performance
window.addEventListener('resize', resizeGradientCanvas, { passive: true });

// Cleanup function para evitar memory leaks
function cleanup() {
  ScrollTrigger.getAll().forEach(st => st.kill());
  gsap.killTweensOf('*');
}

// Opcional: Adicionar cleanup quando a página for fechada
window.addEventListener('unload', cleanup);