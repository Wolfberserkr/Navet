/**
 * Buildings that Rick can walk behind. Each outline is cut from the map and
 * drawn again over Rick while his feet are above `baseY` (the bottom of the
 * front wall), so roofs hide him as he passes behind a house.
 * Measured on village-map-v2.png (map px).
 */
export interface Occluder {
  id: string;
  baseY: number;
  poly: [number, number][];
}

export const OCCLUDERS: Occluder[] = [
  { id: 'maarten', baseY: 500, poly: [[461, 500], [461, 245], [711, 245], [711, 500]] },
  { id: 'marisol', baseY: 505, poly: [[822, 505], [822, 251], [876, 225], [876, 170], [958, 170], [958, 225], [1018, 251], [1018, 505]] },
  { id: 'rhod', baseY: 497, poly: [[1131, 497], [1131, 122], [1221, 122], [1221, 52], [1288, 0], [1355, 52], [1355, 122], [1449, 122], [1449, 497]] },
  { id: 'rhod-left', baseY: 574, poly: [[1092, 574], [1092, 286], [1211, 286], [1211, 574]] },
  { id: 'rhod-right', baseY: 574, poly: [[1363, 574], [1363, 286], [1484, 286], [1484, 574]] },
  { id: 'ruben', baseY: 505, poly: [[1579, 505], [1579, 255], [1795, 255], [1795, 505]] },
  { id: 'yara', baseY: 505, poly: [[1893, 505], [1891, 270], [1940, 270], [1940, 209], [1978, 209], [1978, 270], [2174, 270], [2179, 505]] },
  { id: 'ivo', baseY: 788, poly: [[629, 788], [629, 556], [902, 556], [902, 788]] },
  { id: 'stall-west', baseY: 1015, poly: [[1046, 1015], [1046, 860], [1170, 860], [1170, 1015]] },
  { id: 'stall-1', baseY: 742, poly: [[1685, 742], [1685, 595], [1806, 595], [1806, 742]] },
  { id: 'stall-2', baseY: 750, poly: [[1839, 750], [1839, 595], [1994, 595], [1994, 750]] },
  { id: 'liv', baseY: 1200, poly: [[654, 1211], [654, 1069], [721, 902], [773, 860], [938, 762], [981, 770], [1046, 979], [1038, 1166], [961, 1200]] },
  { id: 'gisela', baseY: 1163, poly: [[1324, 1163], [1324, 896], [1638, 896], [1638, 1163]] },
  { id: 'elvin', baseY: 1097, poly: [[1762, 902], [1767, 824], [1835, 773], [2061, 752], [2097, 765], [2143, 889], [2143, 1007], [2061, 1084], [1971, 1097], [1904, 1088], [1842, 1030], [1771, 992]] },
];
