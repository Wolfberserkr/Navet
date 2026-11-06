/**
 * Window, door and lantern positions on village-map-v1.png (map px).
 * At night these glow. In Phase 1 every house glows; from Phase 2 only the
 * houses whose director is running a task will.
 */
export const WINDOWS: Record<string, [number, number][]> = {
  rhod: [[560, 495], [628, 530], [693, 565], [875, 545]],
  marisol: [[1165, 415], [1225, 215]],
  ruben: [[1460, 325], [1570, 420], [1640, 390]],
  yara: [[1840, 520], [1895, 505], [1715, 550]],
  ivo: [[2008, 642]],
  maarten: [[430, 790], [553, 775], [495, 705], [320, 850]],
  liv: [[1010, 1070], [870, 1100]],
  gisela: [[1332, 1127], [1395, 1165], [1572, 1102], [1360, 1160], [1498, 1155]],
  elvin: [[1905, 930], [2010, 1020], [2090, 980]],
};

/** Chimney tops that smoke. */
export const CHIMNEYS: [number, number][] = [
  [1607, 215], // Ruben
  [1864, 352], // Yara
  [355, 577], // Maarten
  [1361, 932], // Gisela
  [2048, 814], // Elvin
];
