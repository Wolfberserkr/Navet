/**
 * Window, door and lantern positions on village-map-v2.png (map px).
 * At night these glow. In Phase 1 every house glows; from Phase 2 only the
 * houses whose director is running a task will.
 */
export const WINDOWS: Record<string, [number, number][]> = {
  rhod: [[1288, 254], [1288, 444]],
  marisol: [[863, 434], [917, 457]],
  ruben: [[1624, 451], [1750, 451], [1624, 395], [1685, 395], [1748, 395]],
  yara: [[1951, 451], [2081, 451], [2017, 383]],
  ivo: [[692, 734], [831, 734]],
  maarten: [[522, 431], [653, 431], [590, 367]],
  liv: [[1014, 1059], [975, 1108]],
  gisela: [[1400, 1104], [1566, 1104], [1480, 1030], [1359, 1097], [1426, 1097], [1529, 1097], [1597, 1097]],
  elvin: [[1909, 921], [2012, 1015], [2096, 966], [1855, 969]],
};

/** Chimney tops that smoke. */
export const CHIMNEYS: [number, number][] = [
  [1960, 219], // Yara
  [2048, 814], // Elvin
];
