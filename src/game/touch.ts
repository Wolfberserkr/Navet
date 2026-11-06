import type { Input } from './input';

/**
 * Phone controls: drag anywhere on the map to walk (a virtual stick that
 * appears where the thumb lands); a quick tap interacts.
 */
export class TouchStick {
  origin: { x: number; y: number } | null = null;
  knob = { x: 0, y: 0 };
  private id: number | null = null;
  private startT = 0;
  private travelled = 0;
  enabled = true;

  constructor(
    private canvas: HTMLCanvasElement,
    private input: Input,
  ) {
    canvas.addEventListener('pointerdown', this.down);
    window.addEventListener('pointermove', this.move);
    window.addEventListener('pointerup', this.up);
    window.addEventListener('pointercancel', this.up);
  }

  dispose() {
    this.canvas.removeEventListener('pointerdown', this.down);
    window.removeEventListener('pointermove', this.move);
    window.removeEventListener('pointerup', this.up);
    window.removeEventListener('pointercancel', this.up);
  }

  /** Stick radius in CSS px. */
  static RADIUS = 56;

  private down = (e: PointerEvent) => {
    if (!this.enabled || e.pointerType !== 'touch' || this.id !== null) return;
    this.id = e.pointerId;
    this.origin = { x: e.clientX, y: e.clientY };
    this.knob = { x: 0, y: 0 };
    this.startT = performance.now();
    this.travelled = 0;
  };

  private move = (e: PointerEvent) => {
    if (e.pointerId !== this.id || !this.origin) return;
    let dx = e.clientX - this.origin.x;
    let dy = e.clientY - this.origin.y;
    this.travelled = Math.max(this.travelled, Math.hypot(dx, dy));
    const r = TouchStick.RADIUS;
    const len = Math.hypot(dx, dy);
    if (len > r) {
      dx = (dx / len) * r;
      dy = (dy / len) * r;
    }
    this.knob = { x: dx, y: dy };
    const dead = 8;
    const active = len > dead;
    this.input.stick = { x: dx / r, y: dy / r, active };
  };

  private up = (e: PointerEvent) => {
    if (e.pointerId !== this.id) return;
    const tap = performance.now() - this.startT < 250 && this.travelled < 10;
    this.id = null;
    this.origin = null;
    this.input.stick = { x: 0, y: 0, active: false };
    if (tap) this.input.push('interact');
  };

  draw(ctx: CanvasRenderingContext2D, dpr: number) {
    if (!this.origin) return;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#f1e3c0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.origin.x, this.origin.y, TouchStick.RADIUS, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#f1e3c0';
    ctx.beginPath();
    ctx.arc(this.origin.x + this.knob.x, this.origin.y + this.knob.y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
