const canvas = document.getElementById('cosmic-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Random helper
const rand = (min, max) => Math.random() * (max - min) + min;

// Stars
const stars = Array.from({ length: 150 }, () => ({
    x: rand(0, canvas.width),
    y: rand(0, canvas.height),
    radius: rand(0.5, 1.5),
    opacity: rand(0.3, 1)
}));

function drawStars() {
    stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.fill();
    });
}

// Planets
class Planet {
    constructor() {
        this.orbitRadius = rand(80, 350);
        this.angle = rand(0, 2 * Math.PI);
        this.size = rand(5, 15);
        this.speed = rand(0.001, 0.003);
        this.color = `hsl(${rand(250, 300)}, 80%, 70%)`;
        this.orbitX = canvas.width / 2;
        this.orbitY = canvas.height / 2;
        this.hasRing = Math.random() > 0.5;
    }
    update() {
        this.angle += this.speed;
        this.x = this.orbitX + this.orbitRadius * Math.cos(this.angle);
        this.y = this.orbitY + this.orbitRadius * Math.sin(this.angle);
        this.draw();
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        if (this.hasRing) {
            ctx.strokeStyle = `rgba(255,255,255,0.3)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.size * 2, this.size / 2, 0, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}

// Comets
class Comet {
    constructor() { this.reset(); }
    reset() {
        this.x = rand(-canvas.width, canvas.width);
        this.y = rand(-canvas.height, canvas.height / 2);
        this.length = rand(20, 50);
        this.speed = rand(3, 6);
        this.angle = rand(Math.PI / 6, Math.PI / 3);
        this.opacity = rand(0.4, 1);
    }
    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        if (this.x > canvas.width || this.y > canvas.height) this.reset();
        this.draw();
    }
    draw() {
        ctx.strokeStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.length * Math.cos(this.angle), this.y - this.length * Math.sin(this.angle));
        ctx.stroke();
    }
}

// Initialize
const planets = Array.from({ length: 6 }, () => new Planet());
const comets = Array.from({ length: 10 }, () => new Comet());

// Animate
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    planets.forEach(p => p.update());
    comets.forEach(c => c.update());
    requestAnimationFrame(animate);
}

animate();