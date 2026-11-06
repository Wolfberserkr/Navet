import type { WalkMask } from './mask';
import { CELL_H, CELL_W, WALK_FRAMES, buildPlayerSheet, sheetRow, type Facing } from './sprite';
import type { Camera } from './camera';

/** Map pixels per art pixel at 1:1. */
const ART_PX = 3;
const WALK_SPEED = 170; // map px / s
const RUN_SPEED = 310;
/** Collision box around the feet (map px). */
const FOOT_W = 24;
const FOOT_H = 10;
/** Largest single movement step, so fast frames can't tunnel through walls. */
const MAX_STEP = 3;

export class Player {
  x: number;
  y: number; // feet
  facing: Facing = 'down';
  moving = false;
  private dist = 0;
  private sheet = buildPlayerSheet();

  constructor(
    start: { x: number; y: number },
    private mask: WalkMask,
  ) {
    this.x = start.x;
    this.y = start.y;
  }

  /** Can the feet stand at (x, y)? */
  fits(x: number, y: number) {
    return this.mask.rectFree(x - FOOT_W / 2, y - FOOT_H, FOOT_W, FOOT_H);
  }

  update(dt: number, move: { x: number; y: number }, running: boolean, noclip = false) {
    let { x: mx, y: my } = move;
    const len = Math.hypot(mx, my);
    this.moving = len > 0.15;
    if (!this.moving) {
      this.dist = 0;
      return;
    }
    // Keyboard diagonals are normalised; the touch stick keeps its magnitude.
    if (len > 1) {
      mx /= len;
      my /= len;
    }
    if (Math.abs(mx) > Math.abs(my)) this.facing = mx < 0 ? 'left' : 'right';
    else this.facing = my < 0 ? 'up' : 'down';

    const speed = running ? RUN_SPEED : WALK_SPEED;
    const dx = mx * speed * dt;
    const dy = my * speed * dt;
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / MAX_STEP));
    const sx = dx / steps;
    const sy = dy / steps;
    let moved = 0;
    for (let i = 0; i < steps; i++) {
      // Separate axes, so the player slides along walls instead of sticking.
      if (noclip || this.fits(this.x + sx, this.y)) {
        this.x += sx;
        moved += Math.abs(sx);
      }
      if (noclip || this.fits(this.x, this.y + sy)) {
        this.y += sy;
        moved += Math.abs(sy);
      }
    }
    this.dist += moved;
    if (moved < 0.01) this.moving = false;
  }

  private get frame() {
    if (!this.moving) return 0;
    return Math.floor(this.dist / 16) % WALK_FRAMES;
  }

  /** Drawn in device pixels with a whole-number pixel size, so it stays crisp at any zoom. */
  draw(ctx: CanvasRenderingContext2D, camera: Camera) {
    const px = Math.max(1, Math.round(ART_PX * camera.scale));
    const w = CELL_W * px;
    const h = CELL_H * px;
    const feet = camera.mapToScreen(this.x, this.y);
    const left = Math.round(feet.x - w / 2);
    const top = Math.round(feet.y - h + px * 2);

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    // soft shadow
    ctx.fillStyle = 'rgba(10, 8, 20, 0.35)';
    ctx.beginPath();
    ctx.ellipse(Math.round(feet.x), Math.round(feet.y), 7 * px, 2.5 * px, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(this.sheet, this.frame * CELL_W, sheetRow(this.facing) * CELL_H, CELL_W, CELL_H, left, top, w, h);
    ctx.restore();
  }
}
