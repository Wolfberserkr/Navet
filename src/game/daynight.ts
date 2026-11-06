import SunCalc from 'suncalc';
import { ARUBA_TZ, ORANJESTAD } from './constants';

export interface Sky {
  /** Multiply tint over the map (r, g, b, 0–255). */
  tint: [number, number, number];
  /** 0 by day … 1 deep night: drives window glows and the vignette. */
  dark: number;
  /** Sun altitude in degrees. */
  altitude: number;
  /** Short name for the debug readout. */
  phase: string;
}

type Key = [alt: number, rgb: [number, number, number]];

// Tint by sun altitude. Morning and evening differ: pink-gold dawns,
// orange-gold evenings, both passing through a blue twilight.
const MORNING: Key[] = [
  [-18, [84, 96, 160]],
  [-10, [98, 108, 170]],
  [-5, [144, 134, 196]], // blue hour
  [-1, [214, 150, 160]], // dawn pink
  [3, [250, 196, 160]],
  [8, [255, 228, 196]],
  [16, [255, 255, 255]],
];
const EVENING: Key[] = [
  [-18, [84, 96, 160]],
  [-10, [98, 108, 170]],
  [-5, [132, 124, 190]], // blue dusk
  [-1, [222, 132, 112]], // last light
  [3, [248, 172, 108]], // golden hour
  [8, [255, 214, 158]],
  [16, [255, 255, 255]],
];

function sample(keys: Key[], alt: number): [number, number, number] {
  if (alt <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [a1, c1] = keys[i];
    if (alt <= a1) {
      const [a0, c0] = keys[i - 1];
      const t = smooth((alt - a0) / (a1 - a0));
      return [c0[0] + (c1[0] - c0[0]) * t, c0[1] + (c1[1] - c0[1]) * t, c0[2] + (c1[2] - c0[2]) * t];
    }
  }
  return keys[keys.length - 1][1];
}

const smooth = (t: number) => t * t * (3 - 2 * t);

export function skyAt(date: Date): Sky {
  const { lat, lng } = ORANJESTAD;
  const altitude = (SunCalc.getPosition(date, lat, lng).altitude * 180) / Math.PI;
  const noon = SunCalc.getTimes(date, lat, lng).solarNoon;
  const morning = date.getTime() < noon.getTime();
  const tint = sample(morning ? MORNING : EVENING, altitude);
  const dark = Math.min(1, Math.max(0, (2 - altitude) / 12));
  let phase: string;
  if (altitude < -6) phase = 'Night';
  else if (altitude < 0) phase = morning ? 'Dawn (blue hour)' : 'Dusk (blue hour)';
  else if (altitude < 8) phase = morning ? 'Sunrise' : 'Golden hour';
  else phase = 'Day';
  return { tint, dark, altitude, phase };
}

/** Debug previews (key T): moments today, computed from Oranjestad's real sun times. */
export function previewTimes(now: Date): { name: string; at: Date }[] {
  const { lat, lng } = ORANJESTAD;
  const t = SunCalc.getTimes(now, lat, lng);
  const min = 60_000;
  return [
    { name: 'Dawn', at: new Date(t.sunrise.getTime() - 12 * min) },
    { name: 'Morning', at: new Date(t.sunrise.getTime() + 25 * min) },
    { name: 'Day', at: t.solarNoon },
    { name: 'Golden hour', at: new Date(t.sunset.getTime() - 35 * min) },
    { name: 'Dusk', at: new Date(t.sunset.getTime() + 15 * min) },
    { name: 'Night', at: new Date(t.sunset.getTime() + 150 * min) },
  ];
}

export function arubaClock(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: ARUBA_TZ,
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
