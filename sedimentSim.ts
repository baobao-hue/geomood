
import { Entry, MineralType } from './types';
import { LOGICAL_COLUMNS, MINERAL_PALETTES } from './constants';

export interface Grain {
  x: number;
  y: number; // 0 is bottom
  color: string;
  entryId: string;
}

export interface SimulationResult {
  grains: Grain[];
  maxHeight: number;
  gemLocations: { x: number; y: number; entry: Entry }[];
  dateMarkers: { y: number; date: string }[];
  skyline: number[]; // Height of each column
}

// Deterministic PRNG
const createPrng = (seedStr: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h >>> 0) / 4294967296;
  };
};

export const runSedimentSimulation = (entries: Entry[]): SimulationResult => {
  const cols = LOGICAL_COLUMNS;
  // Initialize skyline (height of each column)
  const skyline = new Array(cols).fill(0);
  
  const grains: Grain[] = [];
  const gemLocations: { x: number; y: number; entry: Entry }[] = [];
  const dateMarkers: { y: number; date: string }[] = [];
  
  let lastDate = '';

  // Process entries: Oldest first to build up layers naturally.
  // Assuming 'entries' prop is passed as Newest -> Oldest (standard UI sort),
  // we reverse it for physics simulation.
  const chronoEntries = [...entries].reverse();

  chronoEntries.forEach((entry) => {
    const prng = createPrng(entry.id);
    const count = entry.content.length; // 1 Char = 1 Grain
    const palette = MINERAL_PALETTES[entry.mineralType];
    
    // Check Date Marker (Before depositing grains for this entry)
    const entryDate = new Date(entry.date).toLocaleDateString('zh-CN');
    if (entryDate !== lastDate) {
      const currentMaxY = Math.max(...skyline);
      dateMarkers.push({ y: currentMaxY, date: entryDate });
      lastDate = entryDate;
    }

    const entryGrainPositions: {x: number, y: number}[] = [];

    // Deposit Grains
    for (let i = 0; i < count; i++) {
      // 1. Pick a random column to "drop" the grain
      // Heuristic: Pick 3 random columns, prefer the lowest one to fill gaps
      const candidates = [
        Math.floor(prng() * cols),
        Math.floor(prng() * cols),
        Math.floor(prng() * cols)
      ];
      
      let targetCol = candidates[0];
      let minH = skyline[targetCol];
      
      for(const c of candidates) {
        if (skyline[c] < minH) {
           minH = skyline[c];
           targetCol = c;
        }
      }

      // 2. Physics: Slide down (Sand Pile Logic)
      // If a neighbor is significantly lower, the grain slides there.
      // We do a simple 1-step or 2-step slide check.
      let settled = false;
      let steps = 0;
      while (!settled && steps < 3) {
        const h = skyline[targetCol];
        const left = targetCol > 0 ? targetCol - 1 : targetCol;
        const right = targetCol < cols - 1 ? targetCol + 1 : targetCol;
        
        // If left is lower than current height - 1 (steep drop)
        const leftDelta = h - skyline[left];
        const rightDelta = h - skyline[right];

        if (leftDelta > 1 && leftDelta >= rightDelta) {
          targetCol = left;
        } else if (rightDelta > 1 && rightDelta > leftDelta) {
          targetCol = right;
        } else {
          settled = true;
        }
        steps++;
      }

      // 3. Place Grain
      const finalY = skyline[targetCol];
      
      // Determine Color Variation
      let color = palette.base;
      const r = prng();
      if (r > 0.9) color = palette.highlight;
      else if (r > 0.75) color = palette.light;
      else if (r < 0.2) color = palette.dark;

      grains.push({
        x: targetCol,
        y: finalY,
        color: color,
        entryId: entry.id
      });
      
      entryGrainPositions.push({ x: targetCol, y: finalY });
      skyline[targetCol]++;
    }

    // Place Gem logic: Put it near the "center of mass" or top of this entry's pile
    if (entry.hasGem && entryGrainPositions.length > 0) {
      // Pick a random grain from this entry to attach the gem to
      const randomIdx = Math.floor(prng() * entryGrainPositions.length);
      const pos = entryGrainPositions[randomIdx];
      gemLocations.push({
        x: pos.x,
        y: pos.y,
        entry: entry
      });
    }
  });

  return {
    grains,
    maxHeight: Math.max(...skyline),
    gemLocations,
    dateMarkers,
    skyline
  };
};
