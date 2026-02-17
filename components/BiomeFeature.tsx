import React from 'react';
import { MineralType } from '../types';

interface BiomeFeatureProps {
  mineralType: MineralType;
  height: number;
}

const BiomeFeature: React.FC<BiomeFeatureProps> = ({ mineralType, height }) => {
  
  if (mineralType === MineralType.CITRINE || mineralType === MineralType.GOLD) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-200 animate-bounce-slow"
            style={{
              top: `${Math.random() * 60 + 20}%`,
              left: `${Math.random() * 80 + 10}%`,
              animationDuration: `${3 + i}s`,
              // Pixel Glow
              boxShadow: '2px 0 0 rgba(255,255,255,0.5), -2px 0 0 rgba(255,255,255,0.5), 0 2px 0 rgba(255,255,255,0.5), 0 -2px 0 rgba(255,255,255,0.5)' 
            }}
          >
            {/* Pixel Wings */}
            <div className="absolute -left-2 top-0 w-2 h-2 bg-yellow-500 opacity-80" />
            <div className="absolute -right-2 top-0 w-2 h-2 bg-yellow-500 opacity-80" />
          </div>
        ))}
      </div>
    );
  }

  if (mineralType === MineralType.LAPIS || mineralType === MineralType.OBSIDIAN) {
    return (
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Pixel Moss */}
        <div className="absolute left-0 bottom-0 w-16 h-16 flex flex-wrap content-end p-2 opacity-80">
           <div className="w-4 h-4 bg-green-600 mb-1 mr-1" />
           <div className="w-2 h-2 bg-green-400 animate-pulse" />
           <div className="w-4 h-2 bg-green-700" />
           <div className="w-2 h-4 bg-green-500" />
        </div>
      </div>
    );
  }

  if (mineralType === MineralType.MOONSTONE) {
    return (
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Pixel Drip */}
        <div className="absolute top-0 left-[20%] w-[2px] h-full bg-blue-400/20">
           <div className="w-2 h-2 bg-blue-100 animate-[ping_3s_linear_infinite] absolute top-1/2" style={{ borderRadius: 0 }} />
        </div>
      </div>
    );
  }

  return null;
};

export default BiomeFeature;
