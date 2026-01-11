/* ===============================
   Timer Logic with Neon Circle
================================= */

const workDuration = 90 * 60; // 90 minutes
const breakDuration = 20 * 60; // 20 minutes

let timeLeft = workDuration;
let timerInterval = null;
let isWorkPhase = true;

const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const phaseIndicator = document.querySelector('.phase-indicator');


const canvasCircle = document.getElementById('timer-circle');
canvasCircle.width = 300;
canvasCircle.height = 300;
const ctxCircle = canvasCircle.getContext('2d');
const radius = canvasCircle.width / 2 - 15; // padding for neon glow
const centerX = canvasCircle.width / 2;
const centerY = canvasCircle.height / 2;

// format seconds as mm:ss
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}

// update timer number & circle
function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
    phaseIndicator.textContent = `Current Phase: ${isWorkPhase ? "Work" : "Break"}`;
    drawCircle();
}

// switch between work and break
function switchPhase() {
    isWorkPhase = !isWorkPhase;
    timeLeft = isWorkPhase ? workDuration : breakDuration;
    updateDisplay();
}

// start timer
function startTimer() {
    if (timerInterval) return;

    // show space window
    spaceWindow.classList.add('active');

    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            switchPhase();
        }
        updateDisplay();
    }, 1000);
}

// pause timer
function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;

    // hide space window
    spaceWindow.classList.remove('active');
}

// reset timer
function resetTimer() {
    pauseTimer();
    timeLeft = isWorkPhase ? workDuration : breakDuration;
    updateDisplay();
}

// ===============================
// Neon Circle Drawing
// ===============================
function drawCircle() {
    const totalTime = isWorkPhase ? workDuration : breakDuration;
    const fraction = (totalTime - timeLeft) / totalTime;

    ctxCircle.clearRect(0, 0, canvasCircle.width, canvasCircle.height);

    // background circle (dim neon)
    ctxCircle.beginPath();
    ctxCircle.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctxCircle.strokeStyle = isWorkPhase ? 'rgba(138,43,226,0.15)' : 'rgba(0,255,128,0.15)';
    ctxCircle.lineWidth = 15;
    ctxCircle.stroke();

    // progress circle (bright neon)
    ctxCircle.beginPath();
    ctxCircle.arc(
        centerX,
        centerY,
        radius,
        -Math.PI / 2,
        -Math.PI / 2 + fraction * 2 * Math.PI
    );
    ctxCircle.strokeStyle = isWorkPhase ? '#b266ff' : '#00ffcc';
    ctxCircle.shadowBlur = 25;
    ctxCircle.shadowColor = ctxCircle.strokeStyle;
    ctxCircle.lineWidth = 15;
    ctxCircle.lineCap = 'round';
    ctxCircle.stroke();
}

// ===============================
// Mini Space Window
// ===============================
const spaceWindow = document.querySelector('.space-window');
const canvasSpace = spaceWindow.querySelector('canvas');
const ctxSpace = canvasSpace.getContext('2d');
canvasSpace.width = canvasSpace.offsetWidth;
canvasSpace.height = canvasSpace.offsetHeight;

const stars = [];
const shootingStars = [];
const planets = [];

// Create stars
for (let i = 0; i < 60; i++) {
    stars.push({
        x: Math.random() * canvasSpace.width,
        y: Math.random() * canvasSpace.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.2 + 0.05
    });
}

// Shooting stars
for (let i = 0; i < 3; i++) {
    shootingStars.push({
        x: Math.random() * canvasSpace.width,
        y: Math.random() * canvasSpace.height / 2,
        length: Math.random() * 60 + 20,
        speed: Math.random() * 4 + 2,
        active: Math.random() < 0.5
    });
}

// Tiny planets
for (let i = 0; i < 3; i++) {
    planets.push({
        x: canvasSpace.width / 2,
        y: canvasSpace.height / 2,
        radius: Math.random() * 5 + 3,
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 60 + 40,
        speed: (Math.random() * 0.02) + 0.005,
        color: `hsl(${Math.random()*360}, 70%, 60%)`
    });
}

// animate mini space window
function animateSpace() {
    ctxSpace.clearRect(0, 0, canvasSpace.width, canvasSpace.height);

    // Stars
    stars.forEach(s => {
        s.y -= s.speed;
        if (s.y < 0) s.y = canvasSpace.height;
        ctxSpace.beginPath();
        ctxSpace.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctxSpace.fillStyle = '#ffffff';
        ctxSpace.fill();
    });

    // Shooting stars
    shootingStars.forEach(star => {
        if (Math.random() < 0.003) star.active = true;
        if (star.active) {
            star.x += star.speed;
            star.y += star.speed / 2;
            ctxSpace.beginPath();
            ctxSpace.moveTo(star.x, star.y);
            ctxSpace.lineTo(star.x - star.length, star.y - star.length / 2);
            ctxSpace.strokeStyle = 'white';
            ctxSpace.lineWidth = 2;
            ctxSpace.stroke();

            if (star.x > canvasSpace.width || star.y > canvasSpace.height) {
                star.x = Math.random() * canvasSpace.width;
                star.y = Math.random() * canvasSpace.height / 2;
                star.active = false;
            }
        }
    });

    // Planets orbiting
    planets.forEach(p => {
        p.angle += p.speed;
        const px = canvasSpace.width/2 + Math.cos(p.angle) * p.distance;
        const py = canvasSpace.height/2 + Math.sin(p.angle) * p.distance;
        ctxSpace.beginPath();
        ctxSpace.arc(px, py, p.radius, 0, Math.PI * 2);
        ctxSpace.fillStyle = p.color;
        ctxSpace.fill();
    });

    requestAnimationFrame(animateSpace);
}

animateSpace();

// ===============================
// Event Listeners
// ===============================
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize display
updateDisplay();

/* ===============================
   Back Button Space Effect
   (Subtle & Lightweight)
================================= */

const backCanvas = document.getElementById('back-canvas');
const backCtx = backCanvas.getContext('2d');

function resizeBackCanvas() {
    backCanvas.width = 180;
    backCanvas.height = 50;
}
resizeBackCanvas();

const backStars = [];
const BACK_STAR_COUNT = 30;

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

// create particles
for (let i = 0; i < BACK_STAR_COUNT; i++) {
    backStars.push({
        x: rand(0, backCanvas.width),
        y: rand(0, backCanvas.height),
        r: rand(0.6, 1.6),
        vy: rand(0.15, 0.4),
        alpha: rand(0.3, 0.9)
    });
}

// animate particles
function animateBackStars() {
    backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);

    backStars.forEach(s => {
        s.y -= s.vy;
        if (s.y < -2) {
            s.y = backCanvas.height + 2;
            s.x = rand(0, backCanvas.width);
        }

        backCtx.beginPath();
        backCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        backCtx.fillStyle = `rgba(255,200,255,${s.alpha})`;
        backCtx.fill();
    });

    requestAnimationFrame(animateBackStars);
}

animateBackStars();
