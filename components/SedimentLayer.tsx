import React, { useRef, useEffect } from 'react';
import { MineralType } from '../types';
import { MINERAL_PALETTES } from '../constants';

interface SedimentLayerProps {
  height: number;
  mineralType: MineralType;
  seed: string; // To ensure the random generation is consistent for the same entry
}

const SedimentLayer: React.FC<SedimentLayerProps> = ({ height, mineralType, seed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get parent width
    const parent = canvas.parentElement;
    const canvasWidth = parent ? parent.clientWidth : window.innerWidth;
    
    // Set logical resolution (Physical pixels)
    canvas.width = canvasWidth;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvasWidth, height);
    
    // Pseudo-random number generator based on seed string
    const seedNum = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let rngState = seedNum;
    const random = () => {
      rngState = (rngState * 9301 + 49297) % 233280;
      return rngState / 233280;
    };

    const palette = MINERAL_PALETTES[mineralType];
    const PIXEL_SIZE = 4; // Size of one "grain"
    
    const cols = Math.ceil(canvasWidth / PIXEL_SIZE);
    const rows = Math.ceil(height / PIXEL_SIZE);

    // Draw background (Deep dirt color behind particles)
    ctx.fillStyle = '#1a0f0a'; // Dark earth
    ctx.fillRect(0, 0, canvasWidth, height);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const r = random();
        
        // Probability of particle existing
        // Top layers are sparser (uneven surface), bottom layers are packed
        const depthPercent = y / rows;
        const surfaceNoise = random();
        
        // Creating an uneven top edge
        if (y < 2 && surfaceNoise > 0.5) continue; // Skip some pixels at very top for jagged edge

        // Draw Pixel
        let color = palette.base;
        
        // Random Texture Variation
        if (r > 0.95) color = palette.highlight; // Sparkle/Gem spec
        else if (r > 0.8) color = palette.light;
        else if (r < 0.2) color = palette.dark;

        ctx.fillStyle = color;
        ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
      }
    }

    // Add "Clumps" or "Rocks"
    const rockCount = Math.floor(random() * 5) + 2;
    for (let i = 0; i < rockCount; i++) {
        const rx = Math.floor(random() * (cols - 4));
        const ry = Math.floor(random() * (rows - 4));
        
        // Draw a small 3x3 or 4x4 rock cluster
        ctx.fillStyle = palette.dark;
        ctx.fillRect(rx * PIXEL_SIZE, ry * PIXEL_SIZE, PIXEL_SIZE * 3, PIXEL_SIZE * 3);
        ctx.fillStyle = palette.light; // Highlight on rock
        ctx.fillRect((rx + 1) * PIXEL_SIZE, (ry + 1) * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    }

  }, [height, mineralType, seed]);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none pixel-rendering opacity-90"
    />
  );
};

export default SedimentLayer;