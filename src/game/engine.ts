import { Camera } from './camera';
import { MAP_H, MAP_W } from './constants';

/**
 * Owns the world state and draws it on the canvas every frame.
 * React only mounts the canvas and shows panels on top.
 */
export class VillageEngine {
  readonly camera = new Camera();
  private ctx: CanvasRenderingContext2D;
  private raf = 0;
  private last = 0;
  private focus = { x: MAP_W / 2, y: MAP_H / 2 };

  constructor(
    private canvas: HTMLCanvasElement,
    private map: HTMLImageElement,
  ) {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D is not available');
    this.ctx = ctx;
  }

  start() {
    this.resize();
    this.camera.snapTo(this.focus.x, this.focus.y);
    this.last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - this.last) / 1000, 0.1);
      this.last = now;
      this.update(dt);
      this.render();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop() {
    cancelAnimationFrame(this.raf);
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(this.canvas.clientWidth * dpr);
    const h = Math.round(this.canvas.clientHeight * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.camera.resize(w, h);
    this.camera.snapTo(this.focus.x, this.focus.y);
  }

  private update(dt: number) {
    this.camera.follow(this.focus.x, this.focus.y, dt);
  }

  private render() {
    const { ctx, camera } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#16182a';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Above 1:1 keep hard pixel edges. Below 1:1 (e.g. a 1080p TV shows the map
    // at ~0.75) nearest-neighbour would drop whole rows of pixels and shimmer,
    // so the browser's filter is used for that one downscale only.
    ctx.imageSmoothingEnabled = camera.scale < 1;
    ctx.imageSmoothingQuality = 'high';
    ctx.setTransform(camera.scale, 0, 0, camera.scale, camera.offsetX, camera.offsetY);
    ctx.drawImage(this.map, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }
}
