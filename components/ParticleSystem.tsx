
import React, { useEffect, useRef } from 'react';
import { Particle } from '../types';
import { LOGICAL_COLUMNS } from '../constants';

interface ParticleSystemProps {
  isActive: boolean;
  color: string;
  count: number;
  onComplete: () => void;
}

interface SandGrain extends Particle {
  targetCol: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ isActive, color, count, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use window dimensions for full screen overlay
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.imageSmoothingEnabled = false;

    // Grain size must match (visually) the underground section
    // Underground section uses width / LOGICAL_COLUMNS
    const realGrainSize = Math.floor(canvas.width / LOGICAL_COLUMNS); 
    
    // Setup initial grains
    const grains: SandGrain[] = [];
    const safeCount = Math.min(count, 500); // Cap particles for performance

    for (let i = 0; i < safeCount; i++) {
      grains.push({
        id: i,
        x: Math.random() * canvas.width, // Start scattered horizontally
        y: -10 - (Math.random() * 300), // Staggered start height
        targetCol: Math.floor(Math.random() * LOGICAL_COLUMNS), // Each grain targets a column
        color: color, // We could vary this slightly here too
        speed: 10 + Math.random() * 15,
        size: realGrainSize
      });
    }

    // Define "Ground"
    // In a real seamless integration, we'd fetch the actual skyline.
    // For this animation, we'll visually pile them up at roughly 30% screen height 
    // (where the underground starts).
    const horizonY = canvas.height * 0.3;
    // Local pile tracking to let them stack up during animation
    const localSkyline = new Array(LOGICAL_COLUMNS).fill(horizonY);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let activeCount = 0;

      grains.forEach(p => {
        const targetX = p.targetCol * realGrainSize;
        // The floor for this specific grain is where the pile is
        const floorY = localSkyline[p.targetCol];

        if (p.y < floorY) {
          // Falling
          p.y += p.speed;
          
          // Horizontal drift towards target column center
          // Simple lerp
          const drift = (targetX - p.x) * 0.15;
          p.x += drift;

          activeCount++;
        } else {
          // Landed
          p.y = floorY;
          p.x = targetX; // Snap to grid
          
          // "Stack" it visually for this animation frame so next one lands higher
          // We intentionally move the floor UP (smaller Y)
          // But only slightly to simulate piling up
          localSkyline[p.targetCol] -= (realGrainSize * 0.5); 
        }

        ctx.fillStyle = p.color;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      });

      if (activeCount > 0) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        // Give a moment for the user to see the pile before refreshing state
        setTimeout(onComplete, 100);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [isActive, count, color, onComplete]);

  if (!isActive) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-50 pointer-events-none pixel-rendering"
    />
  );
};

export default ParticleSystem;
