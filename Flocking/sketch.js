const c = document.getElementById('sky'), x = c.getContext('2d'), cs = getComputedStyle(document.documentElement);
const k = { sep: 1, ali: 1, coh: 1 }, B = [], R = 60, S = 20, MAX = 2.2;
let W, H, fx = 0, fy = 0, ft = -1e5;
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

function size() { const d = devicePixelRatio || 1; W = c.clientWidth; H = c.clientHeight; c.width = W * d; c.height = H * d; x.setTransform(d, 0, 0, d, 0, 0) }
function seed() { const n = Math.max(40, Math.min(130, Math.round(W * H / 10000))); for (let i = 0; i < n; i++) { const a = Math.random() * 6.28; B.push({ x: Math.random() * W, y: Math.random() * H, vx: Math.cos(a) * 1.5, vy: Math.sin(a) * 1.5 }) } }

function step() {
  const fal = performance.now() - ft < 700;
  for (const b of B) {
    let n = 0, ax = 0, ay = 0, cx = 0, cy = 0, sx = 0, sy = 0;
    for (const o of B) {
      if (o === b) continue;
      const dx = o.x - b.x, dy = o.y - b.y, d = dx * dx + dy * dy;
      if (d < R * R) { n++; ax += o.vx; ay += o.vy; cx += o.x; cy += o.y }
      if (d < S * S) { sx -= dx; sy -= dy }
    }
    if (n) {
      b.vx += (ax / n - b.vx) * .06 * k.ali + (cx / n - b.x) * .004 * k.coh;
      b.vy += (ay / n - b.vy) * .06 * k.ali + (cy / n - b.y) * .004 * k.coh;
    }
    b.vx += sx * .06 * k.sep; b.vy += sy * .06 * k.sep;
    if (fal) { const dx = b.x - fx, dy = b.y - fy, d = Math.hypot(dx, dy) || 1; if (d < 130) { b.vx += dx / d * .9; b.vy += dy / d * .9 } }
    const s = Math.hypot(b.vx, b.vy) || 1;
    if (s > MAX) { b.vx *= MAX / s; b.vy *= MAX / s } else if (s < .8) { b.vx *= .8 / s; b.vy *= .8 / s }
  }
  for (const b of B) { b.x = (b.x + b.vx + W) % W; b.y = (b.y + b.vy + H) % H }
}

function draw() {
  x.clearRect(0, 0, W, H);
  x.fillStyle = cs.getPropertyValue('--ink'); x.globalAlpha = .55;
  for (const b of B) {
    x.save(); x.translate(b.x, b.y); x.rotate(Math.atan2(b.vy, b.vx));
    x.beginPath(); x.moveTo(7, 0); x.lineTo(-5, 3.5); x.lineTo(-3, 0); x.lineTo(-5, -3.5); x.closePath(); x.fill();
    x.restore();
  }
  x.globalAlpha = 1;
  if (performance.now() - ft < 700) { x.strokeStyle = cs.getPropertyValue('--accent'); x.lineWidth = 2; x.beginPath(); x.arc(fx, fy, 10, 0, 7); x.stroke() }
}

function loop() { step(); draw(); requestAnimationFrame(loop) }
function settle(n) { for (let i = 0; i < n; i++)step(); draw() }

size(); seed();
if (still) settle(120); else loop();

addEventListener('resize', () => { size(); for (const b of B) { b.x %= W; b.y %= H } if (still) draw() });
document.querySelectorAll('input[data-k]').forEach(i => i.addEventListener('input', e => { k[e.target.dataset.k] = +e.target.value; if (still) settle(60) }));
const hit = e => { fx = e.clientX; fy = e.clientY; ft = performance.now() };
addEventListener('pointermove', hit); addEventListener('pointerdown', hit);

const p = new URLSearchParams(location.search).get('p');
if (p) { const el = document.querySelector('.way[data-p="' + p.replace(/[^\w-]/g, '') + '"]'); if (el) el.classList.add('here') }