import { loadImage } from './assets';

const cache = new Map<string, Promise<string>>();

/**
 * Remove the flat magenta (#FF00FF) background from a portrait.
 * Gemini's magenta isn't perfectly uniform, so pixels within a tolerance of
 * pure magenta become transparent, with a soft ramp and a little despill at
 * the edges. Returns an object URL of the keyed PNG (cached per portrait).
 */
export function keyedPortrait(url: string, maxSize = 1024): Promise<string> {
  let p = cache.get(url);
  if (!p) {
    p = build(url, maxSize);
    cache.set(url, p);
  }
  return p;
}

/** Distance from pure magenta below which a pixel is fully transparent. */
const HARD = 110;
/** ...and above which it is fully opaque. */
const SOFT = 170;

async function build(url: string, maxSize: number): Promise<string> {
  const img = await loadImage(url);
  const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = scale < 1;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h);
  const d = data.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const dist = Math.sqrt((255 - r) ** 2 + g * g + (255 - b) ** 2);
    if (dist < HARD) {
      d[i + 3] = 0;
    } else if (dist < SOFT) {
      const a = (dist - HARD) / (SOFT - HARD);
      d[i + 3] = Math.round(255 * a);
      // Despill: pull the pink fringe toward neutral.
      const cap = Math.max(g, Math.min(r, b) * a);
      d[i] = Math.min(r, Math.max(cap, g + 30));
      d[i + 2] = Math.min(b, Math.max(cap, g + 30));
    }
  }
  ctx.putImageData(data, 0, 0);
  const blob = await new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('encode'))), 'image/png'));
  return URL.createObjectURL(blob);
}
