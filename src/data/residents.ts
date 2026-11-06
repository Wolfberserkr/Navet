import rhod from '../../assets/portraits/portrait-rhod.png';
import marisol from '../../assets/portraits/portrait-marisol.png';
import ruben from '../../assets/portraits/portrait-ruben.png';
import yara from '../../assets/portraits/portrait-yara.png';
import ivo from '../../assets/portraits/portrait-ivo.png';
import maarten from '../../assets/portraits/portrait-maarten.png';
import liv from '../../assets/portraits/portrait-liv.png';
import gisela from '../../assets/portraits/portrait-gisela.png';
import elvin from '../../assets/portraits/portrait-elvin.png';

export interface Hotspot {
  id: string;
  /** Door label, e.g. "Marisol — Post Cottage". */
  label: string;
  /** Where Rick stands to use the door (map px, feet position). */
  x: number;
  y: number;
  /** How close (map px) Rick must be for the label to show. */
  radius: number;
  resident?: {
    name: string;
    role: string;
    house: string;
    personality: string;
    portrait: string;
  };
  /** Text for places without a resident. */
  blurb?: string;
}

/**
 * Door positions were measured on village-map-v1.png (2576×1438).
 * The Phase 1 brief gave rough percentages; these are the checked spots in
 * front of each door.
 */
export const HOTSPOTS: Hotspot[] = [
  {
    id: 'rhod',
    label: 'Rhod — Town Hall',
    x: 985,
    y: 810,
    radius: 95,
    resident: {
      name: 'Rhod',
      role: 'Chief of staff',
      house: 'Stone town hall with the clock and bell tower',
      personality: "Straight-talking friend; tells you what you're avoiding.",
      portrait: rhod,
    },
  },
  {
    id: 'marisol',
    label: 'Marisol — Post Cottage',
    x: 1230,
    y: 505,
    radius: 80,
    resident: {
      name: 'Marisol',
      role: 'Inbox & Calendar',
      house: 'Red cottage with a pigeon loft and a clock on the gable',
      personality: 'Fast, organized, never misses a deadline.',
      portrait: marisol,
    },
  },
  {
    id: 'ruben',
    label: 'Ruben — Counting House',
    x: 1450,
    y: 535,
    radius: 80,
    resident: {
      name: 'Ruben',
      role: 'Finance',
      house: 'Stone counting house with a gold coin sign',
      personality: 'Calm, careful, slightly old-school.',
      portrait: ruben,
    },
  },
  {
    id: 'yara',
    label: 'Yara — Kitchen Cottage',
    x: 1688,
    y: 628,
    radius: 80,
    resident: {
      name: 'Yara',
      role: 'Nutrition',
      house: 'Kitchen cottage with a cooking-pot sign, behind the market stalls',
      personality: 'Practical, plans ahead, hates waste.',
      portrait: yara,
    },
  },
  {
    id: 'ivo',
    label: 'Ivo — Training House',
    x: 2088,
    y: 742,
    radius: 80,
    resident: {
      name: 'Ivo',
      role: 'Fitness',
      house: 'Slate-roof training house with a crossed-swords shield, sparring dummy and bicycle',
      personality: 'High energy, keeps score of everything.',
      portrait: ivo,
    },
  },
  {
    id: 'maarten',
    label: 'Maarten — Academy',
    x: 545,
    y: 892,
    radius: 85,
    resident: {
      name: 'Maarten',
      role: 'Education',
      house: 'Red academy with a telescope on the roof; the five ALTER agents work inside',
      personality: 'Curious professor, asks hard questions.',
      portrait: maarten,
    },
  },
  {
    id: 'liv',
    label: 'Liv — Longhouse',
    x: 1015,
    y: 1188,
    radius: 85,
    resident: {
      name: 'Liv',
      role: 'Languages',
      house: 'Viking longhouse by the west bridge, with dragon heads and a Norwegian flag',
      personality: 'Dry humor, switches languages mid-sentence.',
      portrait: liv,
    },
  },
  {
    id: 'gisela',
    label: 'Gisela — The Inn',
    x: 1530,
    y: 1272,
    radius: 85,
    resident: {
      name: 'Gisela',
      role: 'Relationships',
      house: 'The village inn below the fountain, with a foaming mug sign and lanterns',
      personality: "Warm, remembers everyone's details.",
      portrait: gisela,
    },
  },
  {
    id: 'elvin',
    label: 'Elvin — Workshop',
    x: 1885,
    y: 1100,
    radius: 85,
    resident: {
      name: 'Elvin',
      role: 'Home & family',
      house: "Carpenter's workshop with a lean-to and work yard",
      personality: 'Dependable fixer, handles errands.',
      portrait: elvin,
    },
  },
  {
    id: 'fountain',
    label: 'The Fountain',
    x: 1292,
    y: 872,
    radius: 70,
    blurb: 'The heart of the plaza. Every path in the village starts here.',
  },
];
