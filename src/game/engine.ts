import { Camera } from './camera';
import { Input } from './input';
import { MaskEditor, type MaskEditorState } from './mask-editor';
import type { WalkMask } from './mask';
import { Player } from './player';
import { TouchStick } from './touch';
import { HOTSPOTS, type Hotspot } from '../data/residents';
import { drawLabel } from './labels';

/** Where Rick appears: the plaza, between the town hall steps and the fountain. */
const SPAWN = { x: 1150, y: 830 };
const POS_KEY = 'village.player';

export interface UiState {
  editor: MaskEditorState;
  /** The building panel that is open, if any. */
  open: Hotspot | null;
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
  readonly player: Player;
  private touch: TouchStick;
  private saveT = 0;
  private near: Hotspot | null = null;
  private open: Hotspot | null = null;
  private readonly touchHint = window.matchMedia?.('(pointer: coarse)').matches ?? false;

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
    this.touch = new TouchStick(canvas, this.input);
    this.player = new Player(this.findStart(), mask);
  }

  /** Last position this session (survives a reload), else the plaza. */
  private findStart() {
    let start = SPAWN;
    try {
      const saved = JSON.parse(sessionStorage.getItem(POS_KEY) ?? 'null');
      if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') start = saved;
    } catch {
      /* storage unavailable */
    }
    if (this.mask.at(start.x, start.y)) return start;
    // Spiral out to the nearest walkable spot.
    for (let r = 8; r < 600; r += 8) {
      for (let a = 0; a < Math.PI * 2; a += 0.3) {
        const x = SPAWN.x + Math.cos(a) * r;
        const y = SPAWN.y + Math.sin(a) * r;
        if (this.mask.at(x, y)) return { x, y };
      }
    }
    return SPAWN;
  }

  private get focus() {
    return { x: this.player.x, y: this.player.y - 36 };
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
    this.touch.dispose();
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
    this.onUi({ editor: this.editor.state, open: this.open });
  }

  private setOverview(on: boolean) {
    this.camera.overview = on;
    this.camera.resize(this.canvas.width, this.canvas.height);
    this.camera.snapTo(this.focus.x, this.focus.y);
    this.emitUi();
  }

  closePanel() {
    this.open = null;
    this.emitUi();
  }

  private findNear(): Hotspot | null {
    let best: Hotspot | null = null;
    let bestD = Infinity;
    for (const h of HOTSPOTS) {
      const d = Math.hypot(h.x - this.player.x, h.y - this.player.y);
      if (d < h.radius && d < bestD) {
        best = h;
        bestD = d;
      }
    }
    return best;
  }

  private handleActions() {
    for (const a of this.input.takeActions()) {
      switch (a) {
        case 'toggleMask':
          if (this.open) break;
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
        case 'interact':
          if (this.editor.open) break;
          if (this.open) this.closePanel();
          else if (this.near) {
            this.open = this.near;
            this.emitUi();
          }
          break;
        case 'close':
          if (this.open) this.closePanel();
          else if (this.editor.open) {
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
    this.touch.enabled = !this.editor.open;
    // In the mask editor the player walks through everything, to reach any spot.
    const frozen = (this.editor.open && this.camera.overview) || this.open !== null;
    if (!frozen) this.player.update(dt, this.input.move, this.input.running, this.editor.open);
    this.camera.follow(this.focus.x, this.focus.y, dt);
    this.near = this.editor.open ? null : this.findNear();

    this.saveT += dt;
    if (this.saveT > 1) {
      this.saveT = 0;
      try {
        sessionStorage.setItem(POS_KEY, JSON.stringify({ x: Math.round(this.player.x), y: Math.round(this.player.y) }));
      } catch {
        /* storage unavailable */
      }
    }
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
    this.player.draw(ctx, camera);
    if (this.near && !this.open) {
      const px = Math.max(2, Math.round(Math.min(this.canvas.width, this.canvas.height) / 330));
      const anchor = camera.mapToScreen(this.near.x, this.near.y - 112);
      drawLabel(ctx, this.near.label, this.touchHint ? 'TAP' : 'PRESS ENTER', anchor.x, anchor.y, px, this.canvas.width);
    }
    this.touch.draw(ctx, window.devicePixelRatio || 1);
  }
}
