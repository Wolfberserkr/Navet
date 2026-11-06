import type { Camera } from './camera';
import { MASK_CELL, type WalkMask } from './mask';

export interface MaskEditorState {
  open: boolean;
  brush: number;
  overview: boolean;
  status: string;
  dirty: boolean;
}

/**
 * Hidden mask editor (key M). Left-drag paints walkable, right-drag or
 * Shift+drag paints blocked. Ctrl/Cmd+S saves to src/data/walkable-mask.png.
 */
export class MaskEditor {
  open = false;
  brush = 24; // map px radius
  dirty = false;
  status = '';
  private overlay: HTMLCanvasElement;
  private octx: CanvasRenderingContext2D;
  private img: ImageData;
  private painting: null | { walkable: boolean } = null;
  private lastPt: { x: number; y: number } | null = null;
  private undo: Uint8Array[] = [];
  hover: { x: number; y: number } | null = null;

  constructor(
    private mask: WalkMask,
    private camera: Camera,
    private canvas: HTMLCanvasElement,
    private onChange: () => void,
  ) {
    this.overlay = document.createElement('canvas');
    this.overlay.width = mask.w;
    this.overlay.height = mask.h;
    this.octx = this.overlay.getContext('2d')!;
    this.img = this.octx.createImageData(mask.w, mask.h);
    this.refresh(0, 0, mask.w - 1, mask.h - 1);
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('contextmenu', this.onContextMenu);
  }

  dispose() {
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('contextmenu', this.onContextMenu);
  }

  get state(): MaskEditorState {
    return {
      open: this.open,
      brush: this.brush,
      overview: this.camera.overview,
      status: this.status,
      dirty: this.dirty,
    };
  }

  setBrush(r: number) {
    this.brush = Math.max(4, Math.min(160, Math.round(r)));
    this.onChange();
  }

  undoLast() {
    const snap = this.undo.pop();
    if (!snap) return;
    this.mask.restore(snap);
    this.refresh(0, 0, this.mask.w - 1, this.mask.h - 1);
    this.dirty = true;
    this.status = 'Undone';
    this.onChange();
  }

  async save() {
    this.status = 'Saving…';
    this.onChange();
    const blob = await this.mask.toPng();
    try {
      const res = await fetch('/__village/mask', { method: 'POST', body: blob });
      if (!res.ok) throw new Error(String(res.status));
      this.status = 'Saved to src/data/walkable-mask.png';
    } catch {
      // Not running under `npm run dev`: hand the file over instead.
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'walkable-mask.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      this.status = 'Downloaded walkable-mask.png — put it in src/data/';
    }
    this.dirty = false;
    this.onChange();
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.open) return;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 0.42;
    ctx.drawImage(this.overlay, 0, 0, this.mask.w * MASK_CELL, this.mask.h * MASK_CELL);
    ctx.restore();
    if (this.hover) {
      ctx.save();
      ctx.lineWidth = 2 / this.camera.scale;
      ctx.strokeStyle = '#ffffff';
      ctx.setLineDash([6 / this.camera.scale, 4 / this.camera.scale]);
      ctx.beginPath();
      ctx.arc(this.hover.x, this.hover.y, this.brush, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  private refresh(x0: number, y0: number, x1: number, y1: number) {
    const { data } = this.img;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const i = y * this.mask.w + x;
        const walk = this.mask.data[i] === 1;
        data[i * 4] = walk ? 40 : 230;
        data[i * 4 + 1] = walk ? 210 : 30;
        data[i * 4 + 2] = walk ? 70 : 40;
        data[i * 4 + 3] = 255;
      }
    }
    this.octx.putImageData(this.img, 0, 0, x0, y0, x1 - x0 + 1, y1 - y0 + 1);
  }

  private toMap(e: PointerEvent) {
    const r = this.canvas.getBoundingClientRect();
    const dpr = this.canvas.width / r.width;
    return this.camera.screenToMap((e.clientX - r.left) * dpr, (e.clientY - r.top) * dpr);
  }

  private stamp(x: number, y: number, walkable: boolean) {
    const b = this.mask.paint(x, y, this.brush, walkable);
    if (b) this.refresh(b.x0, b.y0, b.x1, b.y1);
  }

  private onPointerDown = (e: PointerEvent) => {
    if (!this.open || e.pointerType === 'touch') return;
    e.preventDefault();
    const walkable = e.button === 0 && !e.shiftKey;
    if (e.button !== 0 && e.button !== 2) return;
    this.undo.push(this.mask.snapshot());
    if (this.undo.length > 40) this.undo.shift();
    this.painting = { walkable };
    const p = this.toMap(e);
    this.lastPt = p;
    this.stamp(p.x, p.y, walkable);
    this.dirty = true;
    this.status = '';
    this.onChange();
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.open) return;
    const p = this.toMap(e);
    this.hover = p;
    if (!this.painting || !this.lastPt) return;
    // Fill the gap between pointer events so fast strokes stay solid.
    const dx = p.x - this.lastPt.x;
    const dy = p.y - this.lastPt.y;
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / Math.max(2, this.brush / 2)));
    for (let i = 1; i <= steps; i++) {
      this.stamp(this.lastPt.x + (dx * i) / steps, this.lastPt.y + (dy * i) / steps, this.painting.walkable);
    }
    this.lastPt = p;
  };

  private onPointerUp = () => {
    this.painting = null;
    this.lastPt = null;
  };

  private onContextMenu = (e: Event) => {
    if (this.open) e.preventDefault();
  };
}
