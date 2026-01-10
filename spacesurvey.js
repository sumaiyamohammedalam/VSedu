const canvas = document.getElementById("space-canvas");
const ctx = canvas.getContext("2d");

// Full viewport canvas
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

function random(min, max) { return Math.random() * (max - min) + min; }

function applyLensing(obj, bh) {
    const dx = obj.x - bh.x;
    const dy = obj.y - bh.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const lensRadius = bh.radius * 3; // area affected by lensing
    if(dist < lensRadius) {
        const factor = (lensRadius - dist) / lensRadius * 0.5; // max bend
        obj.x += dx * factor * 0.05; // bend slightly toward/around BH
        obj.y += dy * factor * 0.05;
    }
}

// =======================
// Stars
// =======================
const stars = [];
const numStars = 200;
const starColors = ["#fff", "#c7a2ff", "#7f00ff", "#ff77cc"];

class Star {
    constructor() { this.reset(); }
    reset() {
        this.x = random(0, w);
        this.y = random(0, h);
        this.radius = random(0.5, 2);
        this.color = starColors[Math.floor(random(0, starColors.length))];
        this.vx = random(-0.05, 0.05);
        this.vy = random(0.1, 0.4);
        this.alpha = random(0.3, 0.9);
        this.alphaChange = random(0.002, 0.008);
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${parseInt(this.color.slice(1,3),16)},${parseInt(this.color.slice(3,5),16)},${parseInt(this.color.slice(5,7),16)},${this.alpha})`;
        ctx.fill();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha += this.alphaChange;
        if(this.alpha > 1 || this.alpha < 0.3) this.alphaChange *= -1;
        if(this.y > h || this.x > w || this.x < 0) this.reset();
    }
}
for(let i=0;i<numStars;i++) stars.push(new Star());

// =======================
// Shooting Stars
// =======================
const shootingStars = [];
class ShootingStar {
    constructor() { this.reset(); }
    reset() {
        this.x = random(0, w*0.6);
        this.y = random(0, h/2);
        this.len = random(80, 150);
        this.speed = random(4,10);
        this.angle = Math.PI/4;
        this.alpha = 1;
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.len*Math.cos(this.angle), this.y - this.len*Math.sin(this.angle));
        ctx.strokeStyle = `rgba(255,255,255,${this.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    update() {
        this.x += this.speed*Math.cos(this.angle);
        this.y += this.speed*Math.sin(this.angle);
        this.alpha -= 0.02;
        if(this.alpha <= 0 || this.x > w*0.6 || this.y > h) this.reset();
    }
}
for(let i=0;i<3;i++) shootingStars.push(new ShootingStar());

// =======================
// Black Holes
// =======================
const blackHoles = [
  { x: w*0.2, y: h*0.5, radius: 20, spin: 0 }
];

class AccretionParticle {
  constructor(bh) {
    this.bh = bh;
    this.angle = random(0, Math.PI*2);
    this.radius = random(bh.radius + 5, bh.radius + 25);
    this.size = random(1, 3);
    this.speed = random(0.02, 0.05);
  }
  update() { this.angle += this.speed; }
  draw() {
    const x = this.bh.x + Math.cos(this.angle) * this.radius;
    const y = this.bh.y + Math.sin(this.angle) * this.radius;
    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, Math.PI*2);
    ctx.fillStyle = "rgba(255,200,255,0.8)";
    ctx.fill();
  }
}

const accretionParticles = [];
blackHoles.forEach(bh => {
  for(let i=0;i<30;i++) accretionParticles.push(new AccretionParticle(bh));
});

// =======================
// Neutron Stars
// =======================
const neutronStars = [];
for (let i = 0; i < 3; i++) {
  neutronStars.push({
    x: random(50, w*0.7),
    y: random(50, h-50),
    radius: random(5, 10),
    pulse: 0,
    pulseSpeed: random(0.03, 0.07),
    color: `hsl(${random(200, 360)}, 100%, 80%)`,
    arcs: Array.from({length:3},()=>({angle: random(0,Math.PI*2), speed: random(0.02,0.05), radiusOffset: random(10,15)}))
  });
}

// =======================
// Nebula Clouds
// =======================
const nebulaes = [];
for (let i = 0; i < 4; i++) {
  nebulaes.push({
    x: random(0, w),
    y: random(0, h),
    radius: random(60, 150),
    color: `rgba(${Math.floor(random(50,200))}, ${Math.floor(random(20,150))}, ${Math.floor(random(100,255))}, 0.12)`,
    dx: random(-0.1, 0.15),
    dy: random(-0.05, 0.05),
  });
}

// =======================
// Comets
// =======================
const comets = [];
for(let i=0;i<6;i++){
  comets.push({
    x: random(0,w),
    y: random(0,h/2),
    len: random(50,120),
    speed: random(2,5),
    angle: Math.PI/6 + random(-0.1,0.1),
    alpha: random(0.5,0.9),
    sparks: Array.from({length:5},()=>({xOff: random(-10,0), yOff: random(-5,5), size: random(1,2)}))
  });
}

// =======================
// Animate
// =======================
function animate() {
  ctx.clearRect(0,0,w,h);

  // Nebula
  nebulaes.forEach(nb=>{
    nb.x += nb.dx; nb.y += nb.dy;
    if(nb.x<-nb.radius) nb.x=w+nb.radius;
    if(nb.x>w+nb.radius) nb.x=-nb.radius;
    if(nb.y<-nb.radius) nb.y=h+nb.radius;
    if(nb.y>h+nb.radius) nb.y=-nb.radius;

    const g = ctx.createRadialGradient(nb.x,nb.y,0,nb.x,nb.y,nb.radius);
    g.addColorStop(0, nb.color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(nb.x,nb.y,nb.radius,0,Math.PI*2);
    ctx.fill();
  });

  // Stars with black hole lensing
  stars.forEach(s => {
      blackHoles.forEach(bh => applyLensing(s, bh));
      s.update();
      s.draw();
  });

  // Shooting stars with lensing
  shootingStars.forEach(ss => {
      blackHoles.forEach(bh => applyLensing(ss, bh));
      ss.update();
      ss.draw();
  });

  // Neutron stars
  neutronStars.forEach(ns=>{
    ns.pulse += ns.pulseSpeed;
    const pulseR = ns.radius + Math.sin(ns.pulse)*3;

    const g = ctx.createRadialGradient(ns.x,ns.y,0,ns.x,ns.y,pulseR);
    g.addColorStop(0, ns.color);
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(ns.x,ns.y,pulseR,0,Math.PI*2);
    ctx.fill();

    ns.arcs.forEach(a=>{
      a.angle += a.speed;
      const x1 = ns.x + Math.cos(a.angle)*(pulseR + a.radiusOffset);
      const y1 = ns.y + Math.sin(a.angle)*(pulseR + a.radiusOffset);
      const x2 = ns.x + Math.cos(a.angle+0.5)*(pulseR + a.radiusOffset);
      const y2 = ns.y + Math.sin(a.angle+0.5)*(pulseR + a.radiusOffset);
      ctx.strokeStyle = `hsla(${random(200,360)},100%,80%,0.7)`;
      ctx.lineWidth=1;
      ctx.beginPath();
      ctx.moveTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.stroke();
    });
  });

  // Black holes
  blackHoles.forEach(bh=>{
    bh.spin += 0.01;

    const g = ctx.createRadialGradient(bh.x,bh.y,bh.radius*0.1,bh.x,bh.y,bh.radius*2);
    g.addColorStop(0,'rgba(0,0,0,1)');
    g.addColorStop(0.5,'rgba(100,0,255,0.7)');
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(bh.x,bh.y,bh.radius*2,0,Math.PI*2);
    ctx.fill();

    accretionParticles.forEach(p=>{ p.update(); p.draw(); });
  });

  // Comets
  comets.forEach(c=>{
    c.x += c.speed*Math.cos(c.angle);
    c.y += c.speed*Math.sin(c.angle);
    c.alpha -= 0.005;
    if(c.alpha<=0 || c.x>w || c.y>h) {
      c.x=random(0,w);
      c.y=random(0,h/2);
      c.alpha=random(0.5,0.9);
      c.len=random(50,120);
      c.speed=random(2,5);
    }
    ctx.beginPath();
    ctx.moveTo(c.x,c.y);
    ctx.lineTo(c.x-c.len*Math.cos(c.angle), c.y-c.len*Math.sin(c.angle));
    ctx.strokeStyle = `rgba(255,255,255,${c.alpha})`;
    ctx.lineWidth=2;
    ctx.stroke();

    c.sparks.forEach(s=>{
      ctx.beginPath();
      ctx.arc(c.x+s.xOff, c.y+s.yOff, s.size,0,Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${c.alpha})`;
      ctx.fill();
    });
  });

  requestAnimationFrame(animate);
}

animate();

// =======================
// Responsive
// =======================
window.addEventListener("resize",()=>{
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

// End of spacesurvey.js