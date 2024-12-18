// Animação do Menu
const menuToggleOpen = document.querySelector("#menu-toggle-open");
const menuToggleClose = document.querySelector("#menu-toggle-close");
const menu = document.querySelector(".menu");

const tl = gsap.timeline({
  paused: true
});

tl.to(".menu", {
  x: 0,
  duration: 0.6,
  ease: "expo.inOut"
});

tl.from(".menu nav a", {
  y: 40,
  opacity: 0,
  duration: 0.4,
  ease: "expo.out",
  stagger: 0.1
});

tl.from(".social", {
  y: 40,
  opacity: 0,
  duration: 0.4,
  ease: "expo.out"
});

menuToggleOpen.addEventListener("click", () => tl.play());
menuToggleClose.addEventListener("click", () => tl.reverse());
