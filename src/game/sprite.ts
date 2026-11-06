/**
 * Placeholder player sprite, drawn in code: Rick in a dark watchman's coat,
 * brimmed hat and a brass spyglass at his belt. Real sprites come later.
 *
 * Each frame is painted on a 16×24 art-pixel grid, then given a 1 px dark
 * outline, so cells in the sheet are 18×26.
 */
export type Facing = 'down' | 'up' | 'left' | 'right';

export const ART_W = 16;
export const ART_H = 24;
export const CELL_W = ART_W + 2;
export const CELL_H = ART_H + 2;
export const WALK_FRAMES = 4;

const C = {
  outline: '#120e18',
  hat: '#26222e',
  hatLight: '#3a3546',
  band: '#7a4a26',
  hair: '#3b2516',
  skin: '#e2aa7e',
  skinShade: '#b87a54',
  eye: '#1a1420',
  coat: '#2c3858',
  coatLight: '#46568a',
  coatDark: '#1f2740',
  belt: '#5b3a1e',
  gold: '#e8b64a',
  pants: '#2b2b33',
  boots: '#3d2414',
  brass: '#c99a3e',
};

type Paint = (x: number, y: number, w: number, h: number, color: string) => void;

/** step: 0 stand, 1 left foot forward, 2 stand, 3 right foot forward */
function front(p: Paint, step: number, back: boolean) {
  const swing = step === 1 ? 1 : step === 3 ? -1 : 0;
  // hat
  p(5, 0, 6, 3, C.hat);
  p(6, 0, 3, 1, C.hatLight);
  p(5, 2, 6, 1, C.band);
  p(3, 3, 10, 1, C.hat);
  // head
  if (back) {
    p(5, 4, 6, 5, C.hair);
    p(5, 8, 6, 1, C.skinShade);
  } else {
    p(5, 4, 6, 5, C.skin);
    p(5, 4, 6, 1, C.hair);
    p(5, 5, 1, 2, C.hair);
    p(10, 5, 1, 2, C.hair);
    p(6, 6, 1, 1, C.eye);
    p(9, 6, 1, 1, C.eye);
    p(5, 8, 6, 1, C.skinShade);
  }
  // collar + coat
  p(5, 9, 6, 1, C.coatLight);
  p(4, 10, 8, 7, C.coat);
  p(4, 10, 1, 7, C.coatLight);
  p(3, 17, 10, 2, C.coatDark);
  p(4, 14, 8, 1, C.belt);
  if (!back) {
    p(7, 10, 1, 7, C.coatDark); // lapel line
    p(8, 11, 1, 1, C.gold);
    p(8, 13, 1, 1, C.gold);
    p(7, 14, 2, 1, C.gold); // buckle
    p(11, 13, 1, 4, C.brass); // spyglass on the belt
  } else {
    p(7, 15, 2, 4, C.coatDark); // back vent
    p(4, 13, 1, 4, C.brass);
  }
  // arms (swing opposite to legs)
  p(2, 10 + swing, 2, 6, C.coatDark);
  p(2, 16 + swing, 2, 1, C.skin);
  p(12, 10 - swing, 2, 6, C.coatDark);
  p(12, 16 - swing, 2, 1, C.skin);
  // legs
  const lUp = step === 1 ? 1 : 0;
  const rUp = step === 3 ? 1 : 0;
  p(5, 19, 2, 3 - lUp, C.pants);
  p(4, 22 - lUp, 3, 2, C.boots);
  p(9, 19, 2, 3 - rUp, C.pants);
  p(9, 22 - rUp, 3, 2, C.boots);
}

/** Facing left; "right" is drawn mirrored. */
function side(p: Paint, step: number) {
  // hat, brim reaching forward
  p(5, 0, 6, 3, C.hat);
  p(6, 0, 3, 1, C.hatLight);
  p(5, 2, 6, 1, C.band);
  p(2, 3, 11, 1, C.hat);
  // head
  p(5, 4, 5, 5, C.skin);
  p(7, 4, 3, 4, C.hair);
  p(4, 6, 1, 1, C.skin); // nose
  p(5, 6, 1, 1, C.eye);
  p(5, 8, 5, 1, C.skinShade);
  // coat
  p(6, 9, 4, 1, C.coatLight);
  p(5, 10, 6, 7, C.coat);
  p(4, 17, 8, 2, C.coatDark);
  p(5, 14, 6, 1, C.belt);
  p(9, 12, 1, 5, C.brass); // spyglass at the hip
  // legs
  if (step === 1 || step === 3) {
    const fwd = step === 1;
    p(fwd ? 4 : 5, 19, 2, 3, C.pants);
    p(fwd ? 3 : 4, 22, 3, 2, C.boots);
    p(fwd ? 9 : 8, 19, 2, 3, C.pants);
    p(fwd ? 9 : 8, 22, 3, 2, C.boots);
  } else {
    p(6, 19, 2, 3, C.pants);
    p(8, 19, 2, 3, C.pants);
    p(5, 22, 3, 2, C.boots);
    p(8, 22, 3, 2, C.boots);
  }
  // arm in front of the body, swinging
  const ax = step === 1 ? 8 : step === 3 ? 6 : 7;
  p(ax, 10, 2, 6, C.coatDark);
  p(ax, 16, 2, 1, C.skin);
}

const ROWS: Facing[] = ['down', 'up', 'left', 'right'];

/** Build the sprite sheet: rows = facing, columns = walk frames. */
export function buildPlayerSheet(): HTMLCanvasElement {
  const sheet = document.createElement('canvas');
  sheet.width = CELL_W * WALK_FRAMES;
  sheet.height = CELL_H * ROWS.length;
  const ctx = sheet.getContext('2d')!;

  ROWS.forEach((facing, row) => {
    for (let f = 0; f < WALK_FRAMES; f++) {
      const cell = document.createElement('canvas');
      cell.width = CELL_W;
      cell.height = CELL_H;
      const c = cell.getContext('2d')!;
      const paint: Paint = (x, y, w, h, color) => {
        c.fillStyle = color;
        c.fillRect(x + 1, y + 1, w, h);
      };
      if (facing === 'down') front(paint, f, false);
      else if (facing === 'up') front(paint, f, true);
      else side(paint, f);
      outline(c);
      if (facing === 'right') {
        ctx.save();
        ctx.translate(f * CELL_W + CELL_W, row * CELL_H);
        ctx.scale(-1, 1);
        ctx.drawImage(cell, 0, 0);
        ctx.restore();
      } else {
        ctx.drawImage(cell, f * CELL_W, row * CELL_H);
      }
    }
  });
  return sheet;
}

export function sheetRow(facing: Facing) {
  return ROWS.indexOf(facing);
}

function outline(c: CanvasRenderingContext2D) {
  const img = c.getImageData(0, 0, CELL_W, CELL_H);
  const d = img.data;
  const solid = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < CELL_W && y < CELL_H && d[(y * CELL_W + x) * 4 + 3] > 0;
  const add: number[] = [];
  for (let y = 0; y < CELL_H; y++) {
    for (let x = 0; x < CELL_W; x++) {
      if (solid(x, y)) continue;
      if (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1)) add.push(x, y);
    }
  }
  c.fillStyle = C.outline;
  for (let i = 0; i < add.length; i += 2) c.fillRect(add[i], add[i + 1], 1, 1);
}
