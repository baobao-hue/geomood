
import React from 'react';
import { Entry } from '../types';
import { SpriteMineral } from './PixelSprites';

interface MuseumProps {
  entries: Entry[];
  onClose: () => void;
  onSelectGem: (entry: Entry) => void;
}

const Museum: React.FC<MuseumProps> = ({ entries, onClose, onSelectGem }) => {
  const gemEntries = entries.filter(e => e.hasGem);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in">
      
      {/* SDV Collection Panel */}
      <div className="w-full max-w-2xl h-[80vh] sdv-panel flex flex-col">
        
        {/* Header Tab */}
        <div className="flex justify-between items-center p-4 border-b-4 border-[#e6a05c] bg-[#ffcd82]">
           <div className="flex items-center gap-2">
             <span className="text-2xl filter drop-shadow">💎</span>
             <h1 className="text-[#57290d] text-lg font-pixel uppercase drop-shadow-sm">矿石与文物</h1>
           </div>
           <button 
            onClick={onClose}
            className="sdv-btn sdv-btn-close px-4 py-1 text-sm"
           >
             关闭
           </button>
        </div>

        {/* Content Area - Paper Background */}
        <div className="flex-grow overflow-y-auto p-6 bg-[#fff8e1] shadow-inner">
           
           {/* Grid */}
           <div className="grid grid-cols-5 gap-3 sm:gap-4">
              {gemEntries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => onSelectGem(entry)}
                  className="group relative aspect-square bg-[#d7ccc8] border-2 border-[#8d6e63] shadow-[inset_2px_2px_0_rgba(255,255,255,0.5),inset_-2px_-2px_0_rgba(0,0,0,0.2)] flex items-center justify-center hover:bg-[#e6d5a7] active:scale-95 transition-all"
                >
                   <div className="transform scale-125 group-hover:scale-150 transition-transform">
                     <SpriteMineral type={entry.mineralType} size={4} />
                   </div>
                   
                   {/* Hover Tooltip */}
                   <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-20 whitespace-nowrap bg-[#fff] border border-[#000] px-2 py-1 text-xs font-pixel shadow-lg pointer-events-none text-[#000]">
                      {new Date(entry.date).toLocaleDateString()}
                   </div>
                </button>
              ))}
              
              {/* Empty Slots Filler */}
              {Array.from({ length: Math.max(0, 20 - gemEntries.length) }).map((_, i) => (
                 <div key={`empty-${i}`} className="aspect-square bg-[#eceff1] border-2 border-[#cfd8dc] opacity-50 shadow-inner flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#b0bec5] rounded-full opacity-20" />
                 </div>
              ))}
           </div>
        </div>
        
        {/* Bottom Status Bar */}
        <div className="p-2 bg-[#ffcd82] border-t-4 border-[#e6a05c] flex justify-end">
           <span className="text-[#57290d] font-pixel text-xs">
              收集进度: {gemEntries.length}
           </span>
        </div>

      </div>
    </div>
  );
};

export default Museum;
