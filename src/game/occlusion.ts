import occludersUrl from '../data/occluders.png';
import { OCCLUDERS, type OccluderDepth } from '../data/occluders';
import { loadImage } from './assets';

/** Rick's sprite box around his feet (map px), slightly generous. */
const HALF_W = 30;
const HEIGHT = 80;

interface Cutout {
  depth: OccluderDepth;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** The object's own map pixels, transparent elsewhere. */
  image: HTMLCanvasElement;
  /** Per column (from x0): the lowest pixel of the object, or -1 if none. */
  bottom: Int32Array;
}

/**
 * Everything Rick can walk behind: buildings, stalls, the fountain, the tree,
 * the flag and posts. src/data/occluders.png (built by scripts/make-occluders.py)
 * marks each object's exact pixels; each is cut from the map once and drawn
 * again over Rick when it stands in front of him (see OccluderDepth).
 */
export class Occlusion {
  private cutouts: Cutout[] = [];

  static async load(map: HTMLImageElement): Promise<Occlusion> {
    const occ = new Occlusion();
    try {
      const maskImg = await loadImage(occludersUrl);
      occ.build(map, maskImg);
    } catch {
      // No cutouts: Rick is simply always drawn on top.
    }
    return occ;
  }

  private build(map: HTMLImageElement, maskImg: HTMLImageElement) {
    const W = maskImg.naturalWidth;
    const H = maskImg.naturalHeight;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(maskImg, 0, 0);
    const mask = ctx.getImageData(0, 0, W, H).data;

    // Bounding box per object index.
    const boxes = new Map<number, [number, number, number, number]>();
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const v = mask[(y * W + x) * 4];
        if (!v) continue;
        const b = boxes.get(v);
        if (!b) boxes.set(v, [x, y, x, y]);
        else {
          if (x < b[0]) b[0] = x;
          if (x > b[2]) b[2] = x;
          if (y > b[3]) b[3] = y;
        }
      }
    }

    for (const [v, [x0, y0, x1, y1]] of boxes) {
      const w = x1 - x0 + 1;
      const h = y1 - y0 + 1;
      const image = document.createElement('canvas');
      image.width = w;
      image.height = h;
      const ictx = image.getContext('2d')!;
      ictx.drawImage(map, -x0, -y0);
      const px = ictx.getImageData(0, 0, w, h);
      const bottom = new Int32Array(w).fill(-1);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const inside = mask[((y0 + y) * W + (x0 + x)) * 4] === v;
          if (inside) bottom[x] = y0 + y;
          else px.data[(y * w + x) * 4 + 3] = 0;
        }
      }
      ictx.putImageData(px, 0, 0);
      const depth = OCCLUDERS[v - 1]?.depth ?? 'column';
      this.cutouts.push({ depth, x0, y0, x1, y1, image, bottom });
    }
  }

  /**
   * Draw again every object that stands in front of Rick and overlaps him.
   * Call with the map transform set, right after drawing the player.
   */
  draw(ctx: CanvasRenderingContext2D, px: number, py: number) {
    const bx0 = px - HALF_W;
    const bx1 = px + HALF_W;
    const by0 = py - HEIGHT;
    for (const c of this.cutouts) {
      if (bx1 < c.x0 || bx0 > c.x1 || py < c.y0 || by0 > c.y1) continue;
      if (c.depth !== 'column') {
        // Trees, posts, signs, the fountain: one depth for the whole object.
        const base = c.depth === 'base' ? c.y1 : c.depth;
        if (py < base) ctx.drawImage(c.image, c.x0, c.y0);
        continue;
      }
      // Buildings and stalls: each column of the object is in front of Rick only
      // if that column reaches the ground below his feet. Draw those columns in runs.
      const from = Math.max(c.x0, Math.floor(bx0));
      const to = Math.min(c.x1, Math.ceil(bx1));
      let run = -1;
      for (let x = from; x <= to + 1; x++) {
        const front = x <= to && c.bottom[x - c.x0] > py;
        if (front && run < 0) run = x;
        else if (!front && run >= 0) {
          const sx = run - c.x0;
          const w = x - run;
          ctx.drawImage(c.image, sx, 0, w, c.image.height, run, c.y0, w, c.image.height);
          run = -1;
        }
      }
    }
  }
}
