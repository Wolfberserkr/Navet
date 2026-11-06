import { MAP_H, MAP_W } from './constants';

/**
 * The camera works in device pixels.
 * `scale` = device pixels per map pixel. The map always covers the whole screen,
 * so on screens with a different aspect ratio the camera follows the player.
 */
export class Camera {
  scale = 1;
  /** Top-left of the view, in map pixels. */
  x = 0;
  y = 0;
  viewW = 1;
  viewH = 1;
  /** When true, show the whole map (letterboxed) — used by the mask editor. */
  overview = false;

  resize(deviceW: number, deviceH: number) {
    this.viewW = deviceW;
    this.viewH = deviceH;
    const cover = Math.max(deviceW / MAP_W, deviceH / MAP_H);
    const contain = Math.min(deviceW / MAP_W, deviceH / MAP_H);
    this.scale = this.overview ? contain : cover;
  }

  /** Width/height of the view in map pixels. */
  get spanW() {
    return this.viewW / this.scale;
  }
  get spanH() {
    return this.viewH / this.scale;
  }

  /** Centre on a map point, clamped to the map edges. */
  target(mx: number, my: number) {
    return {
      x: clampView(mx - this.spanW / 2, this.spanW, MAP_W),
      y: clampView(my - this.spanH / 2, this.spanH, MAP_H),
    };
  }

  snapTo(mx: number, my: number) {
    const t = this.target(mx, my);
    this.x = t.x;
    this.y = t.y;
  }

  /** Smooth follow (frame-rate independent). */
  follow(mx: number, my: number, dt: number) {
    const t = this.target(mx, my);
    const k = 1 - Math.exp(-dt * 6);
    this.x += (t.x - this.x) * k;
    this.y += (t.y - this.y) * k;
  }

  /** Offset in device pixels, snapped to whole pixels so the map never shimmers. */
  get offsetX() {
    return Math.round(-this.x * this.scale);
  }
  get offsetY() {
    return Math.round(-this.y * this.scale);
  }

  screenToMap(sx: number, sy: number) {
    return { x: (sx - this.offsetX) / this.scale, y: (sy - this.offsetY) / this.scale };
  }

  mapToScreen(mx: number, my: number) {
    return { x: mx * this.scale + this.offsetX, y: my * this.scale + this.offsetY };
  }
}

function clampView(v: number, span: number, size: number) {
  // If the view is bigger than the map (overview mode), centre the map.
  if (span >= size) return (size - span) / 2;
  return Math.min(Math.max(v, 0), size - span);
}
