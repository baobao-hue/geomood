
import React, { useMemo } from 'react';
import { MineralType } from '../types';

interface PixelArtProps {
  size?: number; // size of one pixel
  className?: string;
  style?: React.CSSProperties;
}

// Helper to render pixel grid from string array
// Characters map to colors provided in palette
const PixelGrid: React.FC<{
  map: string[];
  palette: Record<string, string>;
  size: number;
}> = ({ map, palette, size }) => {
  const pixels = useMemo(() => {
    const rects: React.ReactNode[] = [];
    map.forEach((row, y) => {
      row.split('').forEach((char, x) => {
        if (char !== ' ' && palette[char]) {
          rects.push(
            <rect
              key={`${x}-${y}`}
              x={x * size}
              y={y * size}
              width={size}
              height={size}
              fill={palette[char]}
            />
          );
        }
      });
    });
    return rects;
  }, [map, palette, size]);

  const width = map[0].length * size;
  const height = map.length * size;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {pixels}
    </svg>
  );
};

// --- Sprites Definitions ---

// 1. Shovel (Iron part + Wooden handle)
// Palette: s=silver, d=dark metal, w=wood, b=dark wood
const SHOVEL_MAP = [
  "      bb  ",
  "     bb   ",
  "    wbb   ",
  "   w w    ",
  "  w w     ",
  " s w      ",
  "sds       ",
  "sds       ",
  " s        "
];
export const SpriteShovel: React.FC<PixelArtProps> = ({ size = 3, className, style }) => (
  <div className={className} style={style}>
    <PixelGrid
      size={size}
      map={SHOVEL_MAP}
      palette={{
        s: '#b0bec5', d: '#546e7a', w: '#8d6e63', b: '#3e2723'
      }}
    />
  </div>
);

// 2. Journal (Brown cover, white pages)
const JOURNAL_MAP = [
  " bbbbb    ",
  "bccccbkk  ",
  "bcwwcb k  ",
  "bcwwcb k  ",
  "bcwwcb k  ",
  "bcwwcb k  ",
  "bccccb k  ",
  " bbbbbkk  ",
  "  kkkkk   "
];
export const SpriteJournal: React.FC<PixelArtProps> = ({ size = 3, className, style }) => (
  <div className={className} style={style}>
    <PixelGrid
      size={size}
      map={JOURNAL_MAP}
      palette={{
        b: '#3e2723', c: '#5d4037', w: '#efebe9', k: '#1a0f0a'
      }}
    />
  </div>
);

// 3. Minerals

// Purple Crystal (Moonstone)
const CRYSTAL_PURPLE_MAP = [
  "   l   ",
  "  lml  ",
  " lmmml ",
  " lmmml ",
  "lmmmml ",
  " lmmd  ",
  "  dd   "
];
// Obsidian (Black/Dark Grey)
const CRYSTAL_BLACK_MAP = [
  "  dd  ",
  " dlld ",
  "dlmmld",
  "dmmmld",
  " dmmd ",
  "  dd  "
];
// Citrine (Orange/Yellow Hex)
const CRYSTAL_ORANGE_MAP = [
  "  ll  ",
  " lmml ",
  "lmmmml",
  "lmmmml",
  " ddmm ",
  "  dd  "
];
// Lapis (Blue Oval)
const CRYSTAL_BLUE_MAP = [
  "  ll  ",
  " lmmd ",
  "lmmmdl",
  "lmmmdl",
  " dmmd ",
  "  dd  "
];
// Gold Nugget
const CRYSTAL_GOLD_MAP = [
  "  ll  ",
  " llml ",
  "lmmmml",
  " dmml ",
  "  dd  "
];
// Fossil/Generic (Spiral)
const FOSSIL_MAP = [
  "  ddd ",
  " dlsld",
  "dlsssd",
  "dsslsd",
  " dssd ",
  "  dd  "
];

const MINERAL_PALETTES: Record<MineralType, Record<string, string>> = {
  [MineralType.MOONSTONE]: { l: '#e1bee7', m: '#9c27b0', d: '#4a148c' },
  [MineralType.OBSIDIAN]:  { l: '#cfd8dc', m: '#37474f', d: '#263238' },
  [MineralType.CITRINE]:   { l: '#ffecb3', m: '#ffb300', d: '#ff6f00' },
  [MineralType.LAPIS]:     { l: '#90caf9', m: '#1e88e5', d: '#0d47a1' },
  [MineralType.GOLD]:      { l: '#fff8e1', m: '#ffca28', d: '#ff6f00' },
  [MineralType.SANDSTONE]: { l: '#e0e0e0', m: '#a1887f', d: '#5d4037', s: '#d7ccc8' }
};

export const SpriteMineral: React.FC<PixelArtProps & { type: MineralType }> = ({ type, size = 4, className, style }) => {
  let map = CRYSTAL_PURPLE_MAP;
  let palette = MINERAL_PALETTES[type] || MINERAL_PALETTES[MineralType.SANDSTONE];

  switch (type) {
    case MineralType.OBSIDIAN: map = CRYSTAL_BLACK_MAP; break;
    case MineralType.CITRINE: map = CRYSTAL_ORANGE_MAP; break;
    case MineralType.LAPIS: map = CRYSTAL_BLUE_MAP; break;
    case MineralType.GOLD: map = CRYSTAL_GOLD_MAP; break;
    case MineralType.SANDSTONE: map = FOSSIL_MAP; break;
    default: map = CRYSTAL_PURPLE_MAP;
  }

  return (
    <div className={className} style={style}>
      <PixelGrid size={size} map={map} palette={palette} />
    </div>
  );
};

// 4. Animals & Plants

// Pig (Pink)
const PIG_MAP = [
  "      ",
  "  pp  ",
  " ppppk",
  " ppppp",
  "  p p "
];
export const SpritePig: React.FC<PixelArtProps> = ({ size = 4, className, style }) => (
  <div className={className} style={style}>
    <PixelGrid size={size} map={PIG_MAP} palette={{ p: '#f48fb1', k: '#f06292' }} />
  </div>
);

// Bee (Yellow/Black)
const BEE_MAP = [
  " ww   ",
  "ybkb  ",
  " byb  "
];
export const SpriteBee: React.FC<PixelArtProps> = ({ size = 3, className, style }) => (
  <div className={className} style={style}>
    <PixelGrid size={size} map={BEE_MAP} palette={{ y: '#ffeb3b', b: '#000', w: '#fff', k: '#212121' }} />
  </div>
);

// Butterfly (Blue)
const BUTTERFLY_MAP = [
  "b k b",
  "bbkbb",
  " bkb ",
  " bkb "
];
export const SpriteButterfly: React.FC<PixelArtProps> = ({ size = 3, className, style }) => (
  <div className={className} style={style}>
    <PixelGrid size={size} map={BUTTERFLY_MAP} palette={{ b: '#4fc3f7', k: '#000' }} />
  </div>
);

// Flower (Red/Yellow)
const FLOWER_MAP = [
  " r r ",
  "ryyr ",
  " rgr ",
  "  g  ",
  " g g "
];
export const SpriteFlower: React.FC<PixelArtProps> = ({ size = 3, className, style }) => (
  <div className={className} style={style}>
    <PixelGrid size={size} map={FLOWER_MAP} palette={{ r: '#e53935', y: '#ffeb3b', g: '#43a047' }} />
  </div>
);

// 5. UI Elements

// Face Yellow (Neutral/Ok)
const FACE_YELLOW_MAP = [
  " yyy ",
  "ybyby",
  "yyyyy",
  "ymmmy",
  " yyy "
];
export const SpriteFaceYellow: React.FC<PixelArtProps> = ({ size = 3, className, style }) => (
  <div className={className} style={style}>
    <PixelGrid size={size} map={FACE_YELLOW_MAP} palette={{ y: '#ffeb3b', b: '#000', m: '#fbc02d' }} />
  </div>
);

// Face Red (Angry/Sad)
const FACE_RED_MAP = [
  " rrr ",
  "rbrbr",
  "rrrrr",
  "rmmmr",
  " rrr "
];
export const SpriteFaceRed: React.FC<PixelArtProps> = ({ size = 3, className, style }) => (
  <div className={className} style={style}>
    <PixelGrid size={size} map={FACE_RED_MAP} palette={{ r: '#ef5350', b: '#000', m: '#b71c1c' }} />
  </div>
);

// BURY Sign (Wooden)
const BURY_SIGN_MAP = [
  "bbbbbbbbbb",
  "bwwwwwwwwb",
  "bwwwwwwwwb",
  "bwwwwwwwwb",
  "bbbbbbbbbb"
];
// We will just use this as a background graphic or CSS styled div, 
// but here is a specific small icon if needed. 
// For the button, better to use CSS to scale properly.

