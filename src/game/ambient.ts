import { MAP_H, MAP_W } from './constants';
import { CHIMNEYS } from '../data/lights';

/** Ambient effects are drawn on a low-res layer so they share the map's chunky pixels. */
const PX = 3;
const LW = Math.ceil(MAP_W / PX);
const LH = Math.ceil(MAP_H / PX);

/** Fountain geometry measured on the map (map px). */
const FOUNTAIN = {
  spout: { x: 1294, y: 702 },
  upper: { x: 1294, y: 753, rx: 30, ry: 9 },
  lower: { x: 1293, y: 801, rx: 66, ry: 24 },
  column: { x0: 1276, x1: 1312 },
};

interface Puff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  r: number;
  seed: number;
}
interface Spark {
  x: number;
  y: number;
  age: number;
  life: number;
}
interface Ripple {
  x: number;
  y: number;
  age: number;
  life: number;
}
interface Drop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  floor: number;
}

/**
 * Light-touch motion layered over the still map: chimney smoke drifting
 * west on the trade wind, and the fountain's sparkle, ripples and drops.
 */
export class Ambient {
  private layer: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private puffs: Puff[] = [];
  private sparks: Spark[] = [];
  private ripples: Ripple[] = [];
  private drops: Drop[] = [];
  private smokeT = CHIMNEYS.map(() => Math.random());
  private sparkT = 0;
  private rippleT = 0;
  private dropT = 0;
  private t = 0;

  constructor() {
    this.layer = document.createElement('canvas');
    this.layer.width = LW;
    this.layer.height = LH;
    this.ctx = this.layer.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;
    // Pre-warm so smoke is already rising when the village opens.
    for (let i = 0; i < 300; i++) this.update(1 / 30);
  }

  update(dt: number) {
    this.t += dt;
    // --- smoke ---
    CHIMNEYS.forEach(([x, y], i) => {
      this.smokeT[i] -= dt;
      if (this.smokeT[i] <= 0) {
        this.smokeT[i] = 0.45 + Math.random() * 0.35;
        this.puffs.push({
          x: x + (Math.random() - 0.5) * 6,
          y,
          vx: -4 - Math.random() * 4,
          vy: -20 - Math.random() * 8,
          age: 0,
          life: 4 + Math.random() * 1.5,
          r: 5 + Math.random() * 2,
          seed: Math.random() * 10,
        });
      }
    });
    for (const p of this.puffs) {
      p.age += dt;
      const wind = -6 - 4 * Math.sin(this.t * 0.3 + p.seed); // trade wind blows west
      p.vx += (wind - p.vx) * dt * 0.4;
      p.vy *= 1 - dt * 0.15;
      p.x += (p.vx + Math.sin(this.t * 1.3 + p.seed) * 3) * dt;
      p.y += p.vy * dt;
    }
    this.puffs = this.puffs.filter((p) => p.age < p.life);

    // --- fountain sparkles on both basins ---
    this.sparkT -= dt;
    if (this.sparkT <= 0) {
      this.sparkT = 0.06 + Math.random() * 0.08;
      const basin = Math.random() < 0.3 ? FOUNTAIN.upper : FOUNTAIN.lower;
      for (let tries = 0; tries < 6; tries++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random());
        const x = basin.x + Math.cos(a) * basin.rx * r;
        const y = basin.y + Math.sin(a) * basin.ry * r;
        if (basin === FOUNTAIN.lower && x > FOUNTAIN.column.x0 && x < FOUNTAIN.column.x1 && y < basin.y + 6) continue;
        this.sparks.push({ x, y, age: 0, life: 0.35 + Math.random() * 0.4 });
        break;
      }
    }
    for (const s of this.sparks) s.age += dt;
    this.sparks = this.sparks.filter((s) => s.age < s.life);

    // --- ripples where the water falls ---
    this.rippleT -= dt;
    if (this.rippleT <= 0) {
      this.rippleT = 0.7 + Math.random() * 0.6;
      const side = Math.random() < 0.5 ? -1 : 1;
      this.ripples.push({
        x: FOUNTAIN.lower.x + side * (26 + Math.random() * 10),
        y: FOUNTAIN.lower.y + 2 + Math.random() * 6,
        age: 0,
        life: 1.6,
      });
    }
    for (const r of this.ripples) r.age += dt;
    this.ripples = this.ripples.filter((r) => r.age < r.life);

    // --- drops: from the spout into the top bowl, and over its rim ---
    this.dropT -= dt;
    if (this.dropT <= 0) {
      this.dropT = 0.08;
      const s = FOUNTAIN.spout;
      this.drops.push({ x: s.x + (Math.random() - 0.5) * 4, y: s.y, vx: (Math.random() - 0.5) * 30, vy: -10, floor: FOUNTAIN.upper.y - 2 });
      const side = Math.random() < 0.5 ? -1 : 1;
      const u = FOUNTAIN.upper;
      this.drops.push({ x: u.x + side * (u.rx + 3), y: u.y + 4, vx: side * (6 + Math.random() * 6), vy: 0, floor: FOUNTAIN.lower.y + 2 });
    }
    for (const d of this.drops) {
      d.vy += 140 * dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
    }
    this.drops = this.drops.filter((d) => d.y < d.floor);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const c = this.ctx;
    c.clearRect(0, 0, LW, LH);

    // Smoke: chunky grey puffs that grow and fade.
    for (const p of this.puffs) {
      const k = p.age / p.life;
      const alpha = 0.42 * Math.min(1, p.age * 3) * (1 - k);
      const r = (p.r + k * 16) / PX;
      c.fillStyle = `rgba(214, 212, 218, ${alpha})`;
      fillPixelDisc(c, p.x / PX, p.y / PX, r);
    }

    // Ripples: thin ellipses that widen and fade.
    for (const r of this.ripples) {
      const k = r.age / r.life;
      c.strokeStyle = `rgba(220, 240, 255, ${0.5 * (1 - k)})`;
      c.lineWidth = 1;
      c.beginPath();
      c.ellipse(Math.round(r.x / PX) + 0.5, Math.round(r.y / PX) + 0.5, (2 + k * 9) / 1.2, (1 + k * 3.5) / 1.2, 0, 0, Math.PI * 2);
      c.stroke();
    }

    // Drops.
    c.fillStyle = 'rgba(210, 236, 255, 0.85)';
    for (const d of this.drops) c.fillRect(Math.round(d.x / PX), Math.round(d.y / PX), 1, 1);

    // Sparkles: a pixel that flares into a tiny cross and back.
    for (const s of this.sparks) {
      const k = s.age / s.life;
      const v = Math.sin(k * Math.PI);
      const x = Math.round(s.x / PX);
      const y = Math.round(s.y / PX);
      c.fillStyle = `rgba(255, 255, 255, ${0.9 * v})`;
      c.fillRect(x, y, 1, 1);
      if (v > 0.6) {
        c.fillStyle = `rgba(220, 245, 255, ${0.6 * v})`;
        c.fillRect(x - 1, y, 1, 1);
        c.fillRect(x + 1, y, 1, 1);
        c.fillRect(x, y - 1, 1, 1);
        c.fillRect(x, y + 1, 1, 1);
      }
    }

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.layer, 0, 0, LW * PX, LH * PX);
    ctx.restore();
  }
}

/** A disc built from whole pixels (no anti-aliasing). */
function fillPixelDisc(c: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  const x0 = Math.floor(cx - r);
  const x1 = Math.ceil(cx + r);
  const y0 = Math.floor(cy - r);
  const y1 = Math.ceil(cy + r);
  for (let y = y0; y <= y1; y++) {
    const dy = y + 0.5 - cy;
    const half = Math.sqrt(Math.max(0, r * r - dy * dy));
    if (half <= 0) continue;
    const xa = Math.max(x0, Math.round(cx - half));
    const xb = Math.min(x1, Math.round(cx + half));
    if (xb > xa) c.fillRect(xa, y, xb - xa, 1);
  }
}
