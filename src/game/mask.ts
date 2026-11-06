import maskUrl from '../data/walkable-mask.png';
import { MAP_H, MAP_W } from './constants';
import { loadImage } from './assets';

/** One mask pixel covers MASK_CELL × MASK_CELL map pixels. */
export const MASK_CELL = 4;
const MW = Math.ceil(MAP_W / MASK_CELL);
const MH = Math.ceil(MAP_H / MASK_CELL);

/**
 * Where the player may stand. White = walkable, black = blocked.
 * Stored as src/data/walkable-mask.png at a quarter of the map's resolution.
 */
export class WalkMask {
  readonly w = MW;
  readonly h = MH;
  readonly data = new Uint8Array(MW * MH);

  static async load(): Promise<WalkMask> {
    const mask = new WalkMask();
    try {
      const img = await loadImage(maskUrl);
      const c = document.createElement('canvas');
      c.width = MW;
      c.height = MH;
      const ctx = c.getContext('2d', { willReadFrequently: true })!;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, MW, MH);
      const px = ctx.getImageData(0, 0, MW, MH).data;
      for (let i = 0; i < mask.data.length; i++) mask.data[i] = px[i * 4] > 127 ? 1 : 0;
    } catch {
      // No mask yet: everything walkable, so the editor can still be used.
      mask.data.fill(1);
    }
    return mask;
  }

  /** Is the map point walkable? Outside the map is never walkable. */
  at(mx: number, my: number): boolean {
    if (mx < 0 || my < 0 || mx >= MAP_W || my >= MAP_H) return false;
    return this.data[Math.floor(my / MASK_CELL) * MW + Math.floor(mx / MASK_CELL)] === 1;
  }

  /** True if every sample in the rectangle (map px) is walkable. */
  rectFree(x: number, y: number, w: number, h: number): boolean {
    const step = MASK_CELL;
    for (let yy = y; yy <= y + h; yy += step) {
      for (let xx = x; xx <= x + w; xx += step) if (!this.at(xx, yy)) return false;
      if (!this.at(x + w, yy)) return false;
    }
    for (let xx = x; xx <= x + w; xx += step) if (!this.at(xx, y + h)) return false;
    return this.at(x + w, y + h);
  }

  /** Paint a disc (map px). Returns the touched cell bounds, or null. */
  paint(mx: number, my: number, radius: number, walkable: boolean) {
    const cx = mx / MASK_CELL;
    const cy = my / MASK_CELL;
    const r = Math.max(radius / MASK_CELL, 0.5);
    const x0 = Math.max(0, Math.floor(cx - r));
    const x1 = Math.min(MW - 1, Math.ceil(cx + r));
    const y0 = Math.max(0, Math.floor(cy - r));
    const y1 = Math.min(MH - 1, Math.ceil(cy + r));
    if (x0 > x1 || y0 > y1) return null;
    const v = walkable ? 1 : 0;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;
        if (dx * dx + dy * dy <= r * r) this.data[y * MW + x] = v;
      }
    }
    return { x0, y0, x1, y1 };
  }

  snapshot() {
    return this.data.slice();
  }

  restore(snap: Uint8Array) {
    this.data.set(snap);
  }

  toPng(): Promise<Blob> {
    const c = document.createElement('canvas');
    c.width = MW;
    c.height = MH;
    const ctx = c.getContext('2d')!;
    const img = ctx.createImageData(MW, MH);
    for (let i = 0; i < this.data.length; i++) {
      const v = this.data[i] ? 255 : 0;
      img.data[i * 4] = v;
      img.data[i * 4 + 1] = v;
      img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return new Promise((resolve, reject) =>
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not encode the mask'))), 'image/png'),
    );
  }
}
