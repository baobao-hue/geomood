
import React, { useEffect, useState } from 'react';
import { Entry, GemWisdom } from '../types';
import { analyzeGemstone } from '../services/geminiService';
import { SpriteMineral } from './PixelSprites';

interface GemModalProps {
  entry: Entry | null;
  onClose: () => void;
  onSave?: (entry: Entry, wisdom: GemWisdom) => void;
}

const GemModal: React.FC<GemModalProps> = ({ entry, onClose, onSave }) => {
  const [wisdom, setWisdom] = useState<GemWisdom | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (entry && !entry.gemWisdom) {
      setLoading(true);
      analyzeGemstone(entry.content, entry.moodScore)
        .then((data) => {
          if (data) {
             setWisdom(data);
             if (onSave) onSave(entry, data);
          } else {
             setWisdom({
               mineralName: "未知结晶",
               composition: "100% 纯粹的神秘",
               quote: entry.content.substring(0, 20) + "...",
               advice: "这块石头沉默不语，但它记得一切。"
             });
          }
        })
        .finally(() => setLoading(false));
    } else if (entry && entry.gemWisdom) {
      setWisdom(entry.gemWisdom);
    }
  }, [entry, onSave]);

  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-fade-in backdrop-blur-sm">
      {/* SDV Style Dialog */}
      <div className="w-full max-w-sm sdv-panel relative">
        
        {/* Close X */}
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 sdv-btn sdv-btn-close w-10 h-10 flex items-center justify-center z-10 shadow-lg text-sm"
        >
          X
        </button>

        <div className="p-4 bg-[#fff3e0] border-2 border-[#d7ccc8] h-full shadow-inner">
           
           {/* Item Header */}
           <div className="flex items-center gap-4 mb-4 border-b-2 border-[#e0e0e0] pb-4">
              <div className="w-16 h-16 bg-[#d7ccc8] border-2 border-[#8d6e63] flex items-center justify-center shadow-inner relative">
                  <div className="transform scale-150 animate-pulse">
                     <SpriteMineral type={entry.mineralType} size={4} />
                  </div>
              </div>
              <div>
                 <h2 className="text-[#5d4037] text-lg font-pixel leading-tight">
                    {loading ? "鉴定中..." : wisdom?.mineralName}
                 </h2>
                 <p className="text-[#8d6e63] text-xs font-pixel mt-1">类型: 矿物</p>
                 <p className="text-[#8d6e63] text-xs font-pixel">价值: 无价</p>
              </div>
           </div>

           {/* Description Text */}
           <div className="space-y-4 font-journal text-xl text-[#4e342e]">
              <div className="bg-[#ffe0b2] p-2 border border-[#ffcc80]">
                 <p className="text-sm font-pixel text-[#e65100] mb-1">成分:</p>
                 <p>{loading ? "..." : wisdom?.composition}</p>
              </div>

              <div className="italic text-[#5d4037] border-l-4 border-[#8d6e63] pl-2">
                 "{loading ? "..." : wisdom?.quote}"
              </div>

              <p className="text-[#3e2723]">
                <span className="font-bold">馆长笔记:</span> {loading ? "..." : wisdom?.advice}
              </p>
           </div>
           
           {/* Footer Action */}
           <button 
             onClick={onClose}
             className="mt-6 w-full sdv-btn py-2 text-sm"
           >
             收入背包
           </button>

        </div>
      </div>
    </div>
  );
};

export default GemModal;
