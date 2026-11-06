import { Camera } from './camera';
import { MAP_H, MAP_W } from './constants';
import { Input } from './input';
import { MaskEditor, type MaskEditorState } from './mask-editor';
import type { WalkMask } from './mask';

export interface UiState {
  editor: MaskEditorState;
}

/**
 * Owns the world state and draws it on the canvas every frame.
 * React only mounts the canvas and shows panels on top.
 */
export class VillageEngine {
  readonly camera = new Camera();
  readonly input = new Input();
  readonly editor: MaskEditor;
  private ctx: CanvasRenderingContext2D;
  private raf = 0;
  private last = 0;
  private focus = { x: MAP_W / 2, y: MAP_H / 2 };

  constructor(
    private canvas: HTMLCanvasElement,
    private map: HTMLImageElement,
    readonly mask: WalkMask,
    private onUi: (ui: UiState) => void,
  ) {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D is not available');
    this.ctx = ctx;
    this.editor = new MaskEditor(mask, this.camera, canvas, () => this.emitUi());
  }

  start() {
    this.resize();
    this.camera.snapTo(this.focus.x, this.focus.y);
    this.last = performance.now();
    this.emitUi();
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
    this.input.dispose();
    this.editor.dispose();
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

  private emitUi() {
    this.onUi({ editor: this.editor.state });
  }

  private setOverview(on: boolean) {
    this.camera.overview = on;
    this.camera.resize(this.canvas.width, this.canvas.height);
    this.camera.snapTo(this.focus.x, this.focus.y);
    this.emitUi();
  }

  private handleActions() {
    for (const a of this.input.takeActions()) {
      switch (a) {
        case 'toggleMask':
          this.editor.open = !this.editor.open;
          this.editor.status = '';
          this.setOverview(this.editor.open);
          break;
        case 'overview':
          if (this.editor.open) this.setOverview(!this.camera.overview);
          break;
        case 'save':
          if (this.editor.open) void this.editor.save();
          break;
        case 'undo':
          if (this.editor.open) this.editor.undoLast();
          break;
        case 'brushUp':
          if (this.editor.open) this.editor.setBrush(this.editor.brush * 1.25);
          break;
        case 'brushDown':
          if (this.editor.open) this.editor.setBrush(this.editor.brush / 1.25);
          break;
        case 'close':
          if (this.editor.open) {
            this.editor.open = false;
            this.setOverview(false);
          }
          break;
        default:
          break;
      }
    }
  }

  private update(dt: number) {
    this.handleActions();
    if (this.editor.open && !this.camera.overview) {
      // Zoomed-in editing: arrows/WASD pan freely, ignoring the mask.
      const m = this.input.move;
      const speed = this.input.running ? 900 : 450;
      this.focus.x = Math.min(MAP_W, Math.max(0, this.focus.x + m.x * speed * dt));
      this.focus.y = Math.min(MAP_H, Math.max(0, this.focus.y + m.y * speed * dt));
    }
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

    this.editor.draw(ctx);
  }
}
