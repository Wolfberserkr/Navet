import { MAP_H, MAP_W } from './constants';
import { WINDOWS } from '../data/lights';
import { previewTimes, skyAt, arubaClock, type Sky } from './daynight';

/** Tint and lit windows over the map, synced to the real sun over Oranjestad. */
export class Lighting {
  private shown: Sky;
  private target: Sky;
  private recheck = 0;
  /** -1 = live Aruba time; otherwise an index into previewTimes(). */
  private preview = -1;
  private previewAt: Date | null = null;
  private previewName = '';
  /** Houses with lit windows. Phase 1: all of them. */
  litHouses = new Set(Object.keys(WINDOWS));
  private t = 0;

  constructor() {
    this.target = skyAt(new Date());
    this.shown = { ...this.target, tint: [...this.target.tint] as Sky['tint'] };
  }

  /** Debug key T: Dawn → Morning → Day → Golden hour → Dusk → Night → live. */
  cycle() {
    const list = previewTimes(new Date());
    this.preview = this.preview + 1 >= list.length ? -1 : this.preview + 1;
    if (this.preview === -1) {
      this.previewAt = null;
      this.previewName = '';
    } else {
      this.previewAt = list[this.preview].at;
      this.previewName = list[this.preview].name;
    }
    this.recheck = 0;
  }

  /** Text for the debug readout, or null in normal (live) use. */
  get previewLabel(): string | null {
    if (!this.previewAt) return null;
    return `${this.previewName} · ${arubaClock(this.previewAt)} Aruba · ${this.shown.phase}`;
  }

  update(dt: number) {
    this.t += dt;
    this.recheck -= dt;
    if (this.recheck <= 0) {
      this.target = skyAt(this.previewAt ?? new Date());
      this.recheck = this.previewAt ? 1e9 : 30;
    }
    // Ease toward the target so previews (and the real dusk) blend smoothly.
    const k = 1 - Math.exp(-dt * 3);
    const s = this.shown;
    for (let i = 0; i < 3; i++) s.tint[i] += (this.target.tint[i] - s.tint[i]) * k;
    s.dark += (this.target.dark - s.dark) * k;
    s.altitude = this.target.altitude;
    s.phase = this.target.phase;
  }

  get dark() {
    return this.shown.dark;
  }

  /** Multiply tint over the whole map. Call with the map transform set. */
  drawTint(ctx: CanvasRenderingContext2D) {
    const [r, g, b] = this.shown.tint;
    if (r > 253 && g > 253 && b > 253) return;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
    ctx.fillRect(0, 0, MAP_W, MAP_H);
    ctx.restore();
  }

  /** Warm window glows. Call with the map transform set. */
  drawGlows(ctx: CanvasRenderingContext2D) {
    const dark = this.shown.dark;
    if (dark < 0.02) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    let n = 0;
    for (const [house, spots] of Object.entries(WINDOWS)) {
      if (!this.litHouses.has(house)) continue;
      for (const [x, y] of spots) {
        n++;
        // Gentle, per-window candle flicker.
        const flicker = 0.88 + 0.08 * Math.sin(this.t * 2.3 + n * 1.7) + 0.04 * Math.sin(this.t * 7.1 + n * 3.1);
        const a = dark * flicker;
        const halo = ctx.createRadialGradient(x, y, 0, x, y, 70);
        halo.addColorStop(0, `rgba(255, 170, 70, ${0.32 * a})`);
        halo.addColorStop(0.4, `rgba(255, 140, 50, ${0.12 * a})`);
        halo.addColorStop(1, 'rgba(255, 120, 40, 0)');
        ctx.fillStyle = halo;
        ctx.fillRect(x - 70, y - 70, 140, 140);
        const core = ctx.createRadialGradient(x, y, 0, x, y, 16);
        core.addColorStop(0, `rgba(255, 226, 140, ${0.75 * a})`);
        core.addColorStop(1, 'rgba(255, 200, 100, 0)');
        ctx.fillStyle = core;
        ctx.fillRect(x - 16, y - 16, 32, 32);
      }
    }
    ctx.restore();
  }

  /** A small lantern-like pool of light around Rick after dark (map coords). */
  drawPlayerLight(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const dark = this.shown.dark;
    if (dark < 0.02) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, y - 30, 0, x, y - 30, 90);
    g.addColorStop(0, `rgba(255, 190, 110, ${0.22 * dark})`);
    g.addColorStop(1, 'rgba(255, 160, 80, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 90, y - 120, 180, 180);
    ctx.restore();
  }

  /** Night vignette, in screen space. */
  drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const dark = this.shown.dark;
    if (dark < 0.02) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
    g.addColorStop(0, 'rgba(6, 6, 20, 0)');
    g.addColorStop(1, `rgba(6, 6, 20, ${0.35 * dark})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}
