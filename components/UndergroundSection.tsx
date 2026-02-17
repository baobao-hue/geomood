
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client'; // Need for rendering sprites into portal/overlay if complex
import { Entry } from '../types';
import { runSedimentSimulation, SimulationResult } from '../sedimentSim';
import { LOGICAL_COLUMNS } from '../constants';
import { SpriteMineral } from './PixelSprites';

interface UndergroundSectionProps {
  entries: Entry[];
  onGemClick: (entry: Entry) => void;
}

const UndergroundSection: React.FC<UndergroundSectionProps> = ({ entries, onGemClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Interaction State
  const [clickedEntryId, setClickedEntryId] = useState<string | null>(null);
  const [hoveredEntryContent, setHoveredEntryContent] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  // 1. Run Simulation (Memoized)
  const simResult: SimulationResult = useMemo(() => {
    return runSedimentSimulation(entries);
  }, [entries]);

  // 2. Render Canvas (Pixels)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parentWidth = canvas.parentElement?.clientWidth || window.innerWidth;
    const realGrainSize = Math.floor(parentWidth / LOGICAL_COLUMNS); 
    const bottomPadding = 50;
    const topPadding = 100;
    const contentHeight = (simResult.maxHeight * realGrainSize);
    const totalHeight = Math.max(contentHeight + bottomPadding + topPadding, window.innerHeight * 0.6);

    canvas.width = parentWidth;
    canvas.height = totalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.imageSmoothingEnabled = false;

    // Fill Background
    ctx.fillStyle = '#1a0f0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render Grains
    const originY = canvas.height - bottomPadding;

    simResult.grains.forEach(g => {
        const cx = g.x * realGrainSize;
        const cy = originY - (g.y * realGrainSize) - realGrainSize;
        ctx.fillStyle = g.color;
        ctx.fillRect(cx, cy, realGrainSize, realGrainSize);
        // Simple shading
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(cx + realGrainSize/2, cy + realGrainSize/2, realGrainSize/2, realGrainSize/2);
    });

  }, [simResult, entries]);

  // 3. Interactions helpers
  const getSimCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const parentWidth = canvas.width;
    const realGrainSize = Math.floor(parentWidth / LOGICAL_COLUMNS);
    const bottomPadding = 50;
    const originY = canvas.height - bottomPadding;
    
    const simX = Math.floor(x / realGrainSize);
    const simY = Math.floor((originY - y) / realGrainSize);
    
    return { simX, simY };
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    const coords = getSimCoords(e.clientX, e.clientY);
    if (!coords) return;
    
    const hitGrain = simResult.grains.find(g => g.x === coords.simX && g.y === coords.simY);
    if (hitGrain) {
      const entry = entries.find(ent => ent.id === hitGrain.entryId);
      if (entry) {
        setClickedEntryId(entry.id);
        setTimeout(() => setClickedEntryId(null), 3000);
      }
    } else {
        setClickedEntryId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getSimCoords(e.clientX, e.clientY);
    if (!coords) return;

    const hitGrain = simResult.grains.find(g => g.x === coords.simX && g.y === coords.simY);
    if (hitGrain) {
        const entry = entries.find(ent => ent.id === hitGrain.entryId);
        if (entry && entry.content !== hoveredEntryContent) {
            setHoveredEntryContent(entry.content);
            setHoverPos({ x: e.clientX, y: e.clientY });
        }
    } else {
        setHoveredEntryContent(null);
    }
  };

  // 4. Render Overlays (Gems & Dates)
  // We use absolute positioning div/components on top of canvas
  const [ready, setReady] = useState(false);
  useEffect(() => { if (canvasRef.current) setReady(true); }, [simResult]);

  const renderOverlays = () => {
    if (!canvasRef.current) return null;
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;
    const s = Math.floor(w / LOGICAL_COLUMNS);
    const originY = h - 50;

    return (
        <>
        {/* Date Markers */}
        {simResult.dateMarkers.map((marker, i) => {
            const topPx = originY - (marker.y * s);
            return (
                <div 
                    key={`date-${i}`} 
                    className="absolute left-0 w-full pointer-events-none flex items-center"
                    style={{ top: topPx - 10 }}
                >
                     <div className="w-full border-t border-[#ffffff15] absolute top-1/2" />
                     <div className="bg-[#6d4c41] border-2 border-[#3e2723] px-2 py-0.5 ml-2 shadow-md relative z-10 text-[10px] text-[#ffcc80] font-pixel">
                        {marker.date}
                     </div>
                </div>
            );
        })}
        {/* Gems - Now using Pixel Sprites */}
        {simResult.gemLocations.map((gem, i) => {
            const topPx = originY - (gem.y * s) - s;
            const leftPx = gem.x * s;
            return (
                <button
                    key={`gem-${i}`}
                    onClick={(e) => { e.stopPropagation(); onGemClick(gem.entry); }}
                    className="absolute z-20 hover:scale-125 transition-transform animate-bounce-slow cursor-pointer"
                    style={{ 
                        left: leftPx - 8, 
                        top: topPx - 8,
                        width: '32px',
                        height: '32px'
                    }}
                    title="挖掘宝石"
                >
                   <div className="relative w-full h-full filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]">
                       <SpriteMineral type={gem.entry.mineralType} size={3} />
                   </div>
                </button>
            );
        })}
        </>
    );
  };
  
  return (
    <div 
      ref={containerRef}
      className="flex-grow w-full overflow-y-auto bg-[#1a0f0a] relative scroll-smooth border-t-4 border-[#3e2723]"
      style={{ boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.8)' }}
    >
      <div className="relative w-full min-h-full">
         <canvas 
           ref={canvasRef}
           onClick={handleCanvasClick}
           onMouseMove={handleMouseMove}
           className="block cursor-crosshair"
         />
         
         {ready && renderOverlays()}
         
         {clickedEntryId && (
            <div 
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fff9c4] p-4 border-4 border-[#fbc02d] shadow-xl z-50 max-w-xs font-journal text-[#3e2723] text-lg animate-fade-in pointer-events-none"
                style={{ imageRendering: 'pixelated' }}
            >
                {entries.find(e => e.id === clickedEntryId)?.content}
            </div>
         )}
         
         {hoveredEntryContent && !clickedEntryId && (
            <div 
                className="fixed z-40 bg-black/80 text-white p-2 text-xs font-pixel border border-white/20 pointer-events-none max-w-[200px] truncate"
                style={{ left: hoverPos.x + 10, top: hoverPos.y + 10 }}
            >
                {hoveredEntryContent}
            </div>
         )}
      </div>

      <div className="w-full h-20 bg-[#0d0505] flex items-center justify-center border-t-8 border-[#212121]">
         <span className="text-[#424242] text-xs font-pixel">BEDROCK</span>
      </div>
    </div>
  );
};

export default UndergroundSection;
