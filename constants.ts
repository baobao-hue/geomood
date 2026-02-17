
import { MineralType, SurfaceState, Entry } from './types';

export const APP_STORAGE_KEY = 'geomood_entries_v2';
export const GRAIN_SIZE = 6; // Visual size of one grain in CSS pixels
export const LOGICAL_COLUMNS = 60; // How many grains wide the world is

export const MINERAL_PALETTES = {
  [MineralType.OBSIDIAN]: {
    base: '#2d1b2e',
    dark: '#1a0f1a',
    light: '#4a2c4a',
    highlight: '#6d4c6d'
  },
  [MineralType.LAPIS]: {
    base: '#1e3a8a', // Blue-900
    dark: '#172554',
    light: '#3b82f6', // Blue-500
    highlight: '#60a5fa'
  },
  [MineralType.MOONSTONE]: {
    base: '#cfd8dc', // Blue Grey
    dark: '#90a4ae',
    light: '#eceff1',
    highlight: '#ffffff'
  },
  [MineralType.SANDSTONE]: { // Legacy/Fallback
    base: '#d9a066',
    dark: '#8b5a2b',
    light: '#e6b98a',
    highlight: '#f4d0a3'
  },
  [MineralType.CITRINE]: {
    base: '#ffb300',
    dark: '#c68400',
    light: '#ffca28',
    highlight: '#ffe082'
  },
  [MineralType.GOLD]: {
    base: '#ffd700',
    dark: '#c79100',
    light: '#ffe57f',
    highlight: '#fff8e1'
  }
};

export const MOOD_COLORS = {
  [MineralType.OBSIDIAN]: '#2d1b2e',
  [MineralType.LAPIS]: '#1e3a8a',
  [MineralType.MOONSTONE]: '#cfd8dc',
  [MineralType.SANDSTONE]: '#d9a066',
  [MineralType.CITRINE]: '#ffb300',
  [MineralType.GOLD]: '#ffd700',
};

export const MINERAL_NAMES = {
  [MineralType.OBSIDIAN]: '黑曜石层',
  [MineralType.LAPIS]: '青金石层',
  [MineralType.MOONSTONE]: '月光石层',
  [MineralType.SANDSTONE]: '砂岩层',
  [MineralType.CITRINE]: '黄水晶层',
  [MineralType.GOLD]: '金矿脉',
};

export const getMineralType = (score: number): MineralType => {
  if (score < 0.2) return MineralType.OBSIDIAN;
  if (score < 0.4) return MineralType.LAPIS;
  if (score < 0.6) return MineralType.MOONSTONE;
  if (score < 0.8) return MineralType.CITRINE;
  return MineralType.GOLD;
};

// With the grain system, thickness is exactly the character count (number of grains)
export const calculateThickness = (text: string): number => {
  return text.length;
};

export const calculateSurfaceState = (entries: Entry[]): SurfaceState => {
  if (entries.length < 3) return SurfaceState.BARREN;
  const last3 = entries.slice(0, 3);
  const avgMood = last3.reduce((acc, e) => acc + e.moodScore, 0) / 3;

  if (avgMood > 0.6) return SurfaceState.HOUSE;
  if (avgMood < 0.3) return SurfaceState.FLOWER; 
  return SurfaceState.BARREN;
};

export const determineGem = (text: string, mood: number, streak: number): boolean => {
  const isLong = text.length > 80;
  const extremeMood = mood > 0.9 || mood < 0.15;
  return isLong || (extremeMood && Math.random() > 0.5);
};
