document.addEventListener('DOMContentLoaded', function() {
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

  // 3. GSAP Animations
  gsap.registerPlugin(ScrollTrigger);

  // Inicialização do gradient
  resizeGradientCanvas();
  requestAnimationFrame(animateGradient);

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
// NOVA FUNÇÃO: Animação da curva
function initCurvedTransition() {
  const vw = window.innerWidth;
  const curveHeight = vw < 768 ? 50 : 100;
  const startPosition = vw < 768 ? 150 : 200;
  
  gsap.fromTo(".curved-divider path", 
      {
          attr: { d: `M0 ${startPosition} L0 ${startPosition} C360 ${startPosition} 1080 ${startPosition} 1440 ${startPosition} L1440 ${startPosition} L1440 2000 L0 2000 Z` }
      },
      {
          scrollTrigger: {
              trigger: ".services-section",
              start: "top bottom",
              end: "top 80%",
              scrub: 1,
              markers: true,
          },
          attr: { d: `M0 0 L0 0 C360 ${curveHeight} 1080 ${curveHeight} 1440 0 L1440 0 L1440 2000 L0 2000 Z` },
          ease: "none"
      }
  );
}

// Inicializar a animação da curva
initCurvedTransition();
// NOVO: Controle do fixed hero
ScrollTrigger.create({
  trigger: ".services-section",
  start: "top top",
  end: "bottom bottom",
  onEnter: () => {
      document.querySelector('.hero-section').classList.add('scrolled');
  },
  onLeaveBack: () => {
      document.querySelector('.hero-section').classList.remove('scrolled');
  }
});

// Reinicializar em resize
window.addEventListener('resize', initCurvedTransition);

  // Alteração de cor do menu no scroll
  gsap.to('#menu-toggle-open', {
      scrollTrigger: {
          trigger: '.services-section',
          start: "top 30%",
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

  // Duplicar os itens para criar o efeito infinito
  if (marqueeItems.length > 0) {
      marqueeItems.forEach(item => {
          const clone = item.cloneNode(true);
          marqueeContent.appendChild(clone);
      });
  }

  let lastScrollPosition = 0;
  let isReversed = false;

  window.addEventListener('scroll', function() {
      if (!marqueeContent) return;
      
      const st = window.scrollY || document.documentElement.scrollTop;

      if (st > lastScrollPosition) {
          // Scrolling down
          if (isReversed) {
              marqueeContent.style.animation = 'marquee 27s linear infinite';
              isReversed = false;
          }
      } else {
          // Scrolling up
          if (!isReversed) {
              marqueeContent.style.animation = 'marquee 27s linear infinite reverse';
              isReversed = true;
          }
      }

      lastScrollPosition = st <= 0 ? 0 : st;
  });

  // Código das Tabs com GSAP
  document.querySelectorAll('.service-tab').forEach((tab, index) => {
    const header = tab.querySelector('.service-header');
    const content = tab.querySelector('.service-content');
    const toggle = tab.querySelector('.toggle');
    
    header.addEventListener('click', () => {
        const isActive = tab.classList.contains('active');
        
        if (!isActive) {
            // Abrir tab
            tab.classList.add('active');
            gsap.to(toggle, {
                rotation: 45,
                duration: 0.3,
                ease: "power2.inOut"
            });
            
            // Medir a altura real do conteúdo
            gsap.set(content, { 
                display: 'block',
                height: 'auto',
                opacity: 1 
            });
            const contentHeight = content.offsetHeight;
            
            gsap.fromTo(content, 
                { 
                    height: 0,
                    opacity: 0,
                    padding: 0
                },
                {
                    height: contentHeight,
                    opacity: 1,
                    padding: "1rem 150px",
                    duration: 0.3,
                    ease: "power2.inOut"
                }
            );
        } else {
            // Fechar tab
            tab.classList.remove('active');
            gsap.to(toggle, {
                rotation: 0,
                duration: 0.3,
                ease: "power2.inOut"
            });
            
            gsap.to(content, {
                height: 0,
                opacity: 0,
                padding: 0,
                duration: 0.3,
                ease: "power2.inOut",
                onComplete: () => {
                    gsap.set(content, { display: 'none' });
                }
            });
        }

        // Fechar outras tabs abertas
        document.querySelectorAll('.service-tab').forEach((otherTab) => {
            if (otherTab !== tab && otherTab.classList.contains('active')) {
                const otherContent = otherTab.querySelector('.service-content');
                const otherToggle = otherTab.querySelector('.toggle');
                
                otherTab.classList.remove('active');
                gsap.to(otherToggle, {
                    rotation: 0,
                    duration: 0.3,
                    ease: "power2.inOut"
                });
                
                gsap.to(otherContent, {
                    height: 0,
                    opacity: 0,
                    padding: 0,
                    duration: 0.3,
                    ease: "power2.inOut",
                    onComplete: () => {
                        gsap.set(otherContent, { display: 'none' });
                    }
                });
            }
        });
    });
});
  // Event Listeners
  window.addEventListener('resize', resizeGradientCanvas);
});