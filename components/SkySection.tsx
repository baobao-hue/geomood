
import React, { useEffect, useState } from 'react';
import { SurfaceState } from '../types';
import { SpritePig, SpriteFlower, SpriteBee, SpriteButterfly } from './PixelSprites';

interface SkySectionProps {
  surfaceState: SurfaceState;
}

const SkySection: React.FC<SkySectionProps> = ({ surfaceState }) => {
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsDay(hour > 6 && hour < 18);
  }, []);

  return (
    <div 
      className={`relative w-full h-[30%] border-b-4 border-[#3e2723] transition-colors duration-2000 overflow-hidden ${
        isDay 
          ? 'bg-[#a3d6f5]' // Softer SDV blue
          : 'bg-[#181830]'
      }`}
    >
      {/* Pixel Sun / Moon */}
      <div 
        className={`absolute top-8 right-8 w-12 h-12 transition-all duration-1000 animate-float`}
      >
        {isDay ? (
            <div className="w-full h-full bg-[#fdd835] shadow-[4px_4px_0_rgba(0,0,0,0.1),inset_4px_4px_0_#fff176,inset_-4px_-4px_0_#fbc02d]">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#fbc02d]" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#fbc02d]" />
                <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-2 h-2 bg-[#fbc02d]" />
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-2 bg-[#fbc02d]" />
            </div>
        ) : (
            <div className="w-full h-full bg-[#e0e0e0] shadow-[4px_4px_0_rgba(0,0,0,0.2),inset_2px_2px_0_#fff]">
                <div className="absolute top-2 right-2 w-2 h-2 bg-[#bdbdbd]" />
                <div className="absolute bottom-3 left-3 w-3 h-3 bg-[#bdbdbd]" />
            </div>
        )}
      </div>

      {/* Clouds */}
      {isDay && (
         <div className="absolute top-12 left-10 opacity-90 animate-float" style={{ animationDuration: '6s' }}>
            <div className="relative w-24 h-10 bg-white shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
                <div className="absolute -top-4 left-4 w-12 h-4 bg-white" />
                <div className="absolute top-2 -right-4 w-4 h-6 bg-white" />
                <div className="absolute top-2 -left-4 w-4 h-6 bg-white" />
            </div>
         </div>
      )}

      {/* Surface Objects */}
      <div className="absolute bottom-0 left-0 w-full flex items-end justify-center px-4 pb-0 z-10">
        
        {/* Grass Layer */}
        <div className="absolute bottom-0 w-full h-8 bg-[#4caf50] border-t-4 border-[#2e7d32]">
           <div className="absolute top-1 left-10 w-2 h-2 bg-[#81c784]" />
           <div className="absolute top-3 left-20 w-2 h-2 bg-[#81c784]" />
           <div className="absolute top-2 right-10 w-2 h-2 bg-[#81c784]" />
        </div>

        {/* Dynamic Elements */}
        <div className="z-10 mb-6 transition-all duration-500 flex items-end gap-8">
          
          {/* HOUSE STATE -> Pig + House */}
          {surfaceState === SurfaceState.HOUSE && (
            <>
              <div className="relative">
                 {/* CSS House */}
                 <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[24px] border-b-[#d32f2f] relative -top-[1px]" />
                 <div className="absolute -top-1 left-2 w-2 h-4 bg-[#b71c1c]" /> 
                 <div className="w-12 h-10 bg-[#eac086] border-2 border-[#5d4037] flex justify-center items-end relative shadow-lg">
                     <div className="absolute top-1 left-1 w-3 h-3 bg-[#a1887f] border border-[#5d4037]" /> 
                     <div className="w-4 h-6 bg-[#5d4037]" />
                 </div>
              </div>
              <div className="mb-2 animate-bounce-slow">
                 <SpritePig size={3} />
              </div>
              {isDay && <div className="absolute -top-10 right-0 animate-float"><SpriteBee size={2} /></div>}
            </>
          )}

          {/* FLOWER STATE -> Flowers + Butterfly */}
          {surfaceState === SurfaceState.FLOWER && (
            <>
               {[1,2,3].map(i => (
                 <div key={i} className="flex flex-col items-center" style={{ animation: `bounce 3s infinite ${i*0.5}s` }}>
                   <SpriteFlower size={3} />
                   <div className="w-1 h-2 bg-green-700" />
                 </div>
               ))}
               {isDay && <div className="absolute -top-12 left-0 animate-float"><SpriteButterfly size={3} /></div>}
            </>
          )}

          {/* BARREN -> Just Grass (handled by container) */}
        </div>
      </div>
    </div>
  );
};

export default SkySection;
