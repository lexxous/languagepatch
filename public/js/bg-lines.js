/**
 * bg-lines.js
 * Freely moving, non-colliding smooth lines for the background.
 * Each line is a Bezier curve that drifts in a random direction,
 * bounces off walls, and steers away from other lines.
 */
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ── Config ──────────────────────────────────────────────
  const LINE_COUNT   = 9;      // number of lines
  const MIN_SEP      = 55;     // minimum pixel gap between lines (collision radius)
  const SPEED_MIN    = 0.18;
  const SPEED_MAX    = 0.55;
  const CTRL_DRIFT   = 180;    // how far control points deviate from endpoints
  const OPACITY_MIN  = 0.12;
  const OPACITY_MAX  = 0.35;
  const LINE_W_MIN   = 0.6;
  const LINE_W_MAX   = 1.6;
  // ────────────────────────────────────────────────────────

  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  // A "line" is defined by two endpoints (p1, p2) each with velocity,
  // plus two bezier control points that softly follow the endpoints.
  class BgLine {
    constructor(index) {
      // Spread lines evenly vertically with some random offset
      const baseY = (H / (LINE_COUNT + 1)) * (index + 1);
      const jitter = (Math.random() - 0.5) * 80;

      this.p1 = { x: Math.random() * W * 0.4, y: baseY + jitter };
      this.p2 = { x: W * 0.6 + Math.random() * W * 0.4, y: baseY + jitter };

      this.v1 = this._randomVel();
      this.v2 = this._randomVel();

      // Control points for the bezier curve
      this.c1 = { x: this.p1.x + (Math.random() - 0.5) * CTRL_DRIFT, y: this.p1.y + (Math.random() - 0.5) * CTRL_DRIFT };
      this.c2 = { x: this.p2.x + (Math.random() - 0.5) * CTRL_DRIFT, y: this.p2.y + (Math.random() - 0.5) * CTRL_DRIFT };

      this.opacity = OPACITY_MIN + Math.random() * (OPACITY_MAX - OPACITY_MIN);
      this.lineWidth = LINE_W_MIN + Math.random() * (LINE_W_MAX - LINE_W_MIN);

      // Control-point velocity (slower drift for smoother curves)
      this.cv1 = { x: (Math.random() - 0.5) * 0.4, y: (Math.random() - 0.5) * 0.4 };
      this.cv2 = { x: (Math.random() - 0.5) * 0.4, y: (Math.random() - 0.5) * 0.4 };
    }

    _randomVel() {
      const angle = Math.random() * Math.PI * 2;
      const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
      return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
    }

    // Mid-point of the line (used for separation force)
    midY() {
      return (this.p1.y + this.p2.y) / 2;
    }

    update(others) {
      // Move endpoints
      this.p1.x += this.v1.x;
      this.p1.y += this.v1.y;
      this.p2.x += this.v2.x;
      this.p2.y += this.v2.y;

      // Move control points
      this.c1.x += this.cv1.x;
      this.c1.y += this.cv1.y;
      this.c2.x += this.cv2.x;
      this.c2.y += this.cv2.y;

      // Soft wall bounce (margin so lines stay visible)
      const m = 20;
      this._bounce(this.p1, this.v1, m);
      this._bounce(this.p2, this.v2, m);
      this._bounce(this.c1, this.cv1, m);
      this._bounce(this.c2, this.cv2, m);

      // Separation: push away from other lines
      for (const other of others) {
        if (other === this) continue;
        const dy = this.midY() - other.midY();
        const dist = Math.abs(dy);
        if (dist < MIN_SEP && dist > 0.01) {
          const force = (MIN_SEP - dist) / MIN_SEP * 0.25;
          const dir   = dy > 0 ? 1 : -1;
          this.v1.y += dir * force;
          this.v2.y += dir * force;
          // Clamp speed
          this.v1.y = Math.max(-SPEED_MAX, Math.min(SPEED_MAX, this.v1.y));
          this.v2.y = Math.max(-SPEED_MAX, Math.min(SPEED_MAX, this.v2.y));
        }
      }

      // Random micro-nudge to prevent lock-in to straight paths
      if (Math.random() < 0.003) this.v1 = this._randomVel();
      if (Math.random() < 0.003) this.v2 = this._randomVel();
    }

    _bounce(p, v, margin) {
      if (p.x < margin)     { p.x = margin;     v.x =  Math.abs(v.x); }
      if (p.x > W - margin) { p.x = W - margin; v.x = -Math.abs(v.x); }
      if (p.y < margin)     { p.y = margin;     v.y =  Math.abs(v.y); }
      if (p.y > H - margin) { p.y = H - margin; v.y = -Math.abs(v.y); }
    }

    draw() {
      // Create a glowing gradient for dark background
      const grad = ctx.createLinearGradient(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
      grad.addColorStop(0,    `rgba(56, 189, 248, ${this.opacity * 0.2})`);
      grad.addColorStop(0.35, `rgba(59, 130, 246, ${this.opacity})`);
      grad.addColorStop(0.65, `rgba(147, 197, 253, ${this.opacity * 0.7})`);
      grad.addColorStop(1,    `rgba(56, 189, 248, ${this.opacity * 0.15})`);

      ctx.beginPath();
      ctx.moveTo(this.p1.x, this.p1.y);
      ctx.bezierCurveTo(this.c1.x, this.c1.y, this.c2.x, this.c2.y, this.p2.x, this.p2.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = this.lineWidth;
      ctx.lineCap     = 'round';
      ctx.stroke();
    }
  }

  // ── Init ────────────────────────────────────────────────
  resize();

  const lines = Array.from({ length: LINE_COUNT }, (_, i) => new BgLine(i));

  // ── Animation loop ──────────────────────────────────────
  function tick() {
    ctx.clearRect(0, 0, W, H);

    for (const line of lines) {
      line.update(lines);
      line.draw();
    }

    requestAnimationFrame(tick);
  }

  tick();

  // Resize handling
  window.addEventListener('resize', () => {
    resize();
    // Re-clamp all lines into the new viewport
    for (const line of lines) {
      line.p1.x = Math.min(line.p1.x, W - 20);
      line.p1.y = Math.min(line.p1.y, H - 20);
      line.p2.x = Math.min(line.p2.x, W - 20);
      line.p2.y = Math.min(line.p2.y, H - 20);
    }
  });
})();
