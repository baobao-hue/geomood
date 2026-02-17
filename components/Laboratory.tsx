
import React, { useState } from 'react';
import { SpriteFaceYellow, SpriteFaceRed } from './PixelSprites';

interface LaboratoryProps {
  onClose: () => void;
  onSubmit: (content: string, mood: number) => void;
}

const Laboratory: React.FC<LaboratoryProps> = ({ onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(0.5);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content, mood);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-none p-4 animate-fade-in">
      {/* SDV Panel Container */}
      <div className="w-full max-w-md sdv-panel p-6 flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-[#c5a065] pb-2 mb-2">
            <div>
              <h2 className="text-xl font-pixel text-[#57290d] uppercase drop-shadow-sm">每日记录</h2>
              <p className="text-xs text-[#8d6e63] font-pixel mt-1">Day {new Date().getDate()}</p>
            </div>
            <button 
              onClick={onClose}
              className="sdv-btn sdv-btn-close w-8 h-8 flex items-center justify-center text-sm"
            >
              X
            </button>
        </div>

        {/* Paper Area */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="今天的心情是..."
            className="w-full h-48 sdv-input p-4 text-xl resize-none leading-relaxed focus:ring-0"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(93, 64, 55, 0.1) 31px, rgba(93, 64, 55, 0.1) 32px)',
              lineHeight: '32px'
            }}
          />
        </div>

        {/* Pixel Mood Slider */}
        <div className="bg-[#e6c07b] p-2 border-2 border-[#c98d50] shadow-inner flex items-center gap-2">
          {/* Sad/Angry/Red Face (Low value? Or High? Usually standard is Left=Sad, Right=Happy. 
             But sprite sheet shows Yellow-Left, Red-Right. 
             If Red is "Angry/Intense" maybe that's 0 or 1?
             Let's stick to standard: Left (0) = Sad/Red, Right (1) = Happy/Yellow.
             Wait, sprite has Yellow Left, Red Right. Let's assume Yellow=Neutral/Calm, Red=Angry/Stressed.
             If 0 is Stressed and 1 is Happy:
             Let's map 0 to Red, 1 to Yellow? 
             Visual placement: Left Red, Right Yellow to match "Negative -> Positive" intuition.
          */}
          <SpriteFaceRed size={4} />
          
          <div className="relative flex-grow h-8 bg-[#4e342e] border-2 border-[#3e2723] mx-2">
             {/* Background Pattern */}
             <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(90deg, #d32f2f, #fbc02d)' }} />
             
             <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={mood}
              onChange={(e) => setMood(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            
            {/* Knob */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-6 bg-[#bdbdbd] border-2 border-[#fff] shadow-[2px_2px_0_#000] z-10 pointer-events-none"
              style={{ 
                left: `${mood * 100}%`, 
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          <SpriteFaceYellow size={4} />
        </div>

        {/* BURY Button */}
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className={`group relative w-full h-16 transition-all active:scale-95 disabled:opacity-70 disabled:grayscale`}
        >
           {/* Wooden Sign Graphic constructed with CSS for responsiveness */}
           <div className="absolute inset-0 bg-[#5d4037] border-4 border-[#3e2723] shadow-[4px_4px_0_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="absolute inset-1 border-2 border-[#8d6e63] border-dashed opacity-50" />
              <span className="text-[#ffcc80] font-pixel text-xl tracking-widest uppercase drop-shadow-[2px_2px_0_#3e2723] group-hover:text-white">
                 BURY
              </span>
           </div>
           {/* Nails */}
           <div className="absolute top-2 left-2 w-1 h-1 bg-[#8d6e63]" />
           <div className="absolute top-2 right-2 w-1 h-1 bg-[#8d6e63]" />
           <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#8d6e63]" />
           <div className="absolute bottom-2 right-2 w-1 h-1 bg-[#8d6e63]" />
        </button>
      </div>
    </div>
  );
};

export default Laboratory;
