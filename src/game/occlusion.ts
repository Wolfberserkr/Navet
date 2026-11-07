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
 * The outline's lowest point straight below x: the foot of the building's front
 * wall there. For angled buildings this follows the slope of the wall.
 */
function bottomAt(o: Prepared, x: number): number {
  const cx = Math.min(Math.max(x, o.x0), o.x1);
  let bottom = -Infinity;
  const n = o.poly.length;
  for (let i = 0; i < n; i++) {
    const [ax, ay] = o.poly[i];
    const [bx, by] = o.poly[(i + 1) % n];
    if (cx < Math.min(ax, bx) || cx > Math.max(ax, bx)) continue;
    const y = ax === bx ? Math.max(ay, by) : ay + ((cx - ax) / (bx - ax)) * (by - ay);
    if (y > bottom) bottom = y;
  }
  return bottom;
}

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
    if (bx1 < o.x0 || bx0 > o.x1 || py < o.y0 || by0 > o.y1) continue;
    if (py >= bottomAt(o, px)) continue;
    ctx.save();
    ctx.clip(o.path);
    ctx.drawImage(map, 0, 0);
    ctx.restore();
  }
}
