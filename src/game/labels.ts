import { GLYPH_H, drawPixelText, textWidth } from './pixel-font';

const INK = '#1b1424';
const PARCHMENT = '#f1e3c0';
const GOLD = '#c98f2a';

/** Pixel-style sign: parchment box, dark border, gold inner line, pointer below. */
export function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  hint: string,
  cx: number,
  bottom: number,
  px: number,
  viewW: number,
) {
  const padX = 4 * px;
  const padY = 3 * px;
  const gap = 3 * px;
  const hintPx = Math.max(1, Math.round(px * 0.75));
  const tw = textWidth(text, px);
  const hw = hint ? textWidth(hint, hintPx) : 0;
  const w = Math.max(tw, hw) + padX * 2;
  const h = GLYPH_H * px + (hint ? gap + GLYPH_H * hintPx : 0) + padY * 2;
  let x = Math.round(cx - w / 2);
  x = Math.max(px * 2, Math.min(viewW - w - px * 2, x));
  const y = Math.round(bottom - h - 4 * px);

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // drop shadow
  ctx.fillStyle = 'rgba(10, 8, 20, 0.45)';
  ctx.fillRect(x + px, y + px, w, h);
  // border + fill
  ctx.fillStyle = INK;
  ctx.fillRect(x - px, y - px, w + 2 * px, h + 2 * px);
  ctx.fillStyle = PARCHMENT;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = GOLD;
  ctx.fillRect(x + px, y + px, w - 2 * px, px);
  ctx.fillRect(x + px, y + h - 2 * px, w - 2 * px, px);
  // pointer
  const pxc = Math.round(cx);
  ctx.fillStyle = INK;
  for (let i = 0; i < 3; i++) ctx.fillRect(pxc - (3 - i) * px, y + h + i * px, (6 - 2 * i) * px, px);
  ctx.fillStyle = PARCHMENT;
  for (let i = 0; i < 2; i++) ctx.fillRect(pxc - (2 - i) * px, y + h + i * px - px, (4 - 2 * i) * px, px);

  drawPixelText(ctx, text, x + (w - tw) / 2, y + padY, px, INK);
  if (hint) drawPixelText(ctx, hint, x + (w - hw) / 2, y + padY + GLYPH_H * px + gap, hintPx, GOLD);
  ctx.restore();
}
