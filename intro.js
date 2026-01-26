const symbol = document.getElementById("symbol");
const text = document.getElementById("text");
const quote = document.getElementById("quote");
const intro = document.getElementById("intro");

const blades = {
  b1: document.querySelector(".b1"),
  b2: document.querySelector(".b2"),
  b3: document.querySelector(".b3"),
};

const quotes = [
  "Education is not the learning of facts, but the training of the mind to think. — Einstein",
  "Somewhere, something incredible is waiting to be known. — Carl Sagan",
  "The mind is not a vessel to be filled, but a fire to be kindled. — Plutarch",
  "Science is a way of thinking much more than it is a body of knowledge. — Carl Sagan"
];

quote.textContent = quotes[Math.floor(Math.random() * quotes.length)];

/* ====== PHASE CHAOS (1.5s) ====== */
let chaosStart = performance.now();
function phaseChaos(time) {
  const t = (time - chaosStart) / 1000;
  blades.b1.style.transform = `rotate(${ -6 + Math.sin(t * 3) * 6 }deg)`;
  blades.b2.style.transform = `rotate(${114 + Math.sin(t * 2.5 + 1) * 7 }deg)`;
  blades.b3.style.transform = `rotate(${246 + Math.sin(t * 3.2 + 2) * 5 }deg)`;
  if (t < 2) requestAnimationFrame(phaseChaos);
}
requestAnimationFrame(phaseChaos);

/* ====== ALIGN + ASSEMBLE (1s) ====== */
setTimeout(() => {
  blades.b1.style.transform = "rotate(0deg)";
  blades.b2.style.transform = "rotate(120deg)";
  blades.b3.style.transform = "rotate(240deg)";

  symbol.style.transition = "transform 1s cubic-bezier(.22,.9,.28,1), filter 1s ease";
  symbol.style.transform = "rotate(720deg) scale(1.1)";
  symbol.classList.add("power");
}, 2000);

/* ====== REVEAL TEXT (0.8s) ====== */
setTimeout(() => {
  symbol.style.marginBottom = "60px";
  text.style.opacity = "1";
  text.style.transform = "translateY(0)";
}, 2800);

/* ====== FADE OUT + GO TO MAIN PAGE (0.7s) ====== */
setTimeout(() => {
  intro.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  intro.style.opacity = "0";
  intro.style.transform = "scale(1.05)";

  setTimeout(() => {
    window.location.href = "VSedu.html";
  }, 700);
}, 4200);
