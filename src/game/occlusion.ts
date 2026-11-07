import { OCCLUDERS, type Occluder } from '../data/occluders';

/** Rick's sprite box around his feet (map px), slightly generous. */
const HALF_W = 30;
const HEIGHT = 80;

interface Prepared extends Occluder {
  path: Path2D;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

const PREPARED: Prepared[] = OCCLUDERS.map((o) => {
  const path = new Path2D();
  o.poly.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)));
  path.closePath();
  const xs = o.poly.map((p) => p[0]);
  const ys = o.poly.map((p) => p[1]);
  return { ...o, path, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
});

/**
 * Redraw the parts of the map that stand in front of Rick: every building whose
 * front wall is below his feet and whose outline overlaps his sprite.
 * Call with the map transform set, right after drawing the player.
 */
export function drawOccluders(ctx: CanvasRenderingContext2D, map: HTMLImageElement, px: number, py: number) {
  const bx0 = px - HALF_W;
  const bx1 = px + HALF_W;
  const by0 = py - HEIGHT;
  for (const o of PREPARED) {
    if (py >= o.baseY) continue;
    if (bx1 < o.x0 || bx0 > o.x1 || py < o.y0 || by0 > o.y1) continue;
    ctx.save();
    ctx.clip(o.path);
    ctx.drawImage(map, 0, 0);
    ctx.restore();
  }
}
