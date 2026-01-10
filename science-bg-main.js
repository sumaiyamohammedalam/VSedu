const canvas = document.getElementById("science-bg");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* =========================
   PLANETARY BODIES
========================= */
const bodies = [];
const BODY_COUNT = 14;

for (let i = 0; i < BODY_COUNT; i++) {
    bodies.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 18 + 10,
        z: Math.random() * 0.8 + 0.2,   // depth
        vx: (Math.random() - 0.5) * 0.15, // increased speed
        vy: (Math.random() - 0.5) * 0.15,
        type: Math.random(),           // planet / black hole / neutron
        phase: Math.random() * Math.PI * 2
    });
}

/* =========================
   PARTICLES (CONNECTED)
========================= */
const particles = [];
const COUNT = 180;

for (let i = 0; i < COUNT; i++) {
    particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, // increased speed
        vy: (Math.random() - 0.5) * 0.4,
        z: Math.random() * 0.7 + 0.3,
        phase: Math.random() * Math.PI * 2
    });
}

/* =========================
   LOOP
========================= */
let driftX = 0, driftY = 0;

function animate() {
    ctx.clearRect(0, 0, w, h);

    /* Space fog */
    const fog = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w);
    fog.addColorStop(0, "rgba(120,80,255,0.06)");
    fog.addColorStop(1, "rgba(10,0,30,0.9)");
    ctx.fillStyle = fog;
    ctx.fillRect(0,0,w,h);

    /* ======================
       PARTICLE FIELD
    ====================== */
    for (let p of particles) {
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;
        p.phase += 0.015; // slightly faster pulse

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const glow = Math.sin(p.phase)*0.5+1.5;
        ctx.fillStyle = "rgba(140,120,255,0.5)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, glow * p.z, 0, Math.PI*2);
        ctx.fill();

        for (let q of particles) {
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const d = Math.sqrt(dx*dx+dy*dy);
            if (d < 140) {
                ctx.strokeStyle = `rgba(120,80,255,${0.06*(1-d/140)})`;
                ctx.beginPath();
                ctx.moveTo(p.x,p.y);
                ctx.lineTo(q.x,q.y);
                ctx.stroke();
            }
        }
    }

    /* ======================
       BODIES
    ====================== */
    driftX += 0.001; // slightly faster drift
    driftY += 0.0006;

    for (let b of bodies) {
        b.x += b.vx * b.z;
        b.y += b.vy * b.z;
        b.phase += 0.004; // slightly faster rotation

        if (b.x < -200) b.x = w+200;
        if (b.x > w+200) b.x = -200;
        if (b.y < -200) b.y = h+200;
        if (b.y > h+200) b.y = -200;

        const sr = b.r * b.z;
        const px = b.x + Math.sin(driftX) * 30 * b.z;
        const py = b.y + Math.cos(driftY) * 30 * b.z;

        /* === Black Hole === */
        if (b.type > 0.7) {
            const lens = ctx.createRadialGradient(px,py,0,px,py,sr*6);
            lens.addColorStop(0,"rgba(0,0,0,0.8)");
            lens.addColorStop(0.4,"rgba(40,0,80,0.4)");
            lens.addColorStop(1,"rgba(0,0,0,0)");
            ctx.fillStyle = lens;
            ctx.beginPath();
            ctx.arc(px,py,sr*6,0,Math.PI*2);
            ctx.fill();

            ctx.fillStyle="rgba(0,0,0,0.9)";
            ctx.beginPath();
            ctx.arc(px,py,sr,0,Math.PI*2);
            ctx.fill();
            continue;
        }

        /* === Glow field === */
        const g = ctx.createRadialGradient(px,py,0,px,py,sr*3);
        g.addColorStop(0,"rgba(180,120,255,0.35)");
        g.addColorStop(1,"rgba(20,0,60,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px,py,sr*3,0,Math.PI*2);
        ctx.fill();

        /* === Planet core === */
        const core = ctx.createRadialGradient(px-sr*0.3,py-sr*0.3,2,px,py,sr);
        if (b.type < 0.4) {
            core.addColorStop(0,"#fff");
            core.addColorStop(1,"#6b5cff");
        } else {
            core.addColorStop(0,"#fff");
            core.addColorStop(1,"#ff7bff");
        }
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(px,py,sr,0,Math.PI*2);
        ctx.fill();

        /* === Rings === */
        ctx.strokeStyle="rgba(200,180,255,0.15)";
        ctx.beginPath();
        ctx.ellipse(px,py,sr*1.6,sr*0.6,b.phase,0,Math.PI*2);
        ctx.stroke();
    }

    requestAnimationFrame(animate);
}

animate();
