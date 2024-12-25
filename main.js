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

// Animação da transição curva
gsap.to('.curved-transition', {
    scrollTrigger: {
        trigger: '.hero-section',
        start: "top top",
        end: "bottom center",
        scrub: 0.5,
        markers: true
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
        scrub: 2,
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

// Event Listeners
window.addEventListener('resize', resizeGradientCanvas);


