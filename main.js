// 1. Menu Code
const menuOpen = document.getElementById('menu-toggle-open');
const menuClose = document.getElementById('menu-toggle-close');
const menu = document.querySelector('.menu');
const overlay = document.querySelector('.overlay');

function openMenu() {
    menu.classList.add('active');
    overlay.style.display = 'block';
}

function closeMenu() {
    menu.classList.remove('active');
    overlay.style.display = 'none';
}

menuOpen.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

// 2. Gradient Code
const gradientCanvas = document.getElementById('gradient');
const ctx = gradientCanvas.getContext('2d');

function resizeGradientCanvas() {
    gradientCanvas.width = window.innerWidth;
    gradientCanvas.height = window.innerHeight;
}

function createGradient(time) {
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

// Initialize
resizeGradientCanvas();
requestAnimationFrame(animateGradient);

// 3. Adicione apenas este código novo para as animações
gsap.registerPlugin(ScrollTrigger);

// Animação do texto inicial
const textElements = document.querySelectorAll('.main-title, .is-a, .subtitle');
const tl = gsap.timeline();

textElements.forEach((element, index) => {
    const text = new SplitType(element, {
        types: 'chars',
        tagName: 'span'
    });

    tl.from(text.chars, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.02,
        ease: "power4.out"
    }, index * 0.3);
});

gsap.to('.curved-transition', {
  scrollTrigger: {
    trigger: '.hero-section',  // Mudamos o trigger para o hero-section
    start: "top top",         // Começa assim que o topo do hero atinge o topo da viewport
    end: "bottom center",     // Termina quando o bottom do hero atinge o centro
    scrub: 0.5,               
    markers: true
  },
  y: '0%',
  ease: "none"
});

// Para o fade do hero section
gsap.to('.hero-section', {
    scrollTrigger: {
        trigger: '.services-section',
        start: "top bottom",
        end: "top top",    // Alinhamos com o fim da curva
        scrub: 2,          // Mantemos o mesmo timing da curva
    },
    opacity: 0,
    ease: "none"
});

// Adicione isto ao seu JavaScript existente
gsap.to('#menu-toggle-open', {
  scrollTrigger: {
      trigger: '.services-section',
      start: "top 70%", // Ajuste este valor baseado na posição do seu botão
      end: "bottom 80px",
      onEnter: () => document.getElementById('menu-toggle-open').classList.add('light-section'),
      onLeave: () => document.getElementById('menu-toggle-open').classList.remove('light-section'),
      onEnterBack: () => document.getElementById('menu-toggle-open').classList.add('light-section'),
      onLeaveBack: () => document.getElementById('menu-toggle-open').classList.remove('light-section'),
  }
});
// Animação de cor para serviços
// Vamos criar uma timeline diferente
gsap.timeline({
  scrollTrigger: {
    trigger: '.services-section',
    start: "top bottom", // Começa quando o topo da seção services chegar ao final da viewport
    end: "top 40%",     // Termina quando o topo estiver a 40% da viewport
    scrub: true,        // Suaviza a animação
    onUpdate: (self) => {
      // Se estiver durante a transição
      if(self.progress > 0 && self.progress < 1) {
        gsap.set(".services-title-section", {
          position: "fixed",
          top: "50%",
          transform: "translateY(-50%)"
        });
      } else {
        // Se estiver antes ou depois da transição
        gsap.set(".services-title-section", {
          position: "relative",
          top: "auto",
          transform: "none"
        });
      }
    }
  }
});

// Mantenha a animação de cor separada
gsap.to('#services-heading, #services-arrow', {
  scrollTrigger: {
    trigger: '.services-section',
    start: "top 70%",
    end: "top 40%",
    onEnter: () => {
      gsap.to("#services-heading, #services-arrow", {
        color: "#CC5500",
        duration: 0.3
      });
    },
    onLeaveBack: () => {
      gsap.to("#services-heading, #services-arrow", {
        color: "#1E1E1E",
        duration: 0.3
      });
    },
    toggleActions: "play reverse play reverse"
  }
});