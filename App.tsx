
import React, { useState, useEffect } from 'react';
import { Entry, GemWisdom } from './types';
import { 
  APP_STORAGE_KEY, 
  getMineralType, 
  calculateThickness, 
  calculateSurfaceState, 
  determineGem,
  MINERAL_PALETTES
} from './constants';
import SkySection from './components/SkySection';
import UndergroundSection from './components/UndergroundSection';
import Laboratory from './components/Laboratory';
import GemModal from './components/GemModal';
import Museum from './components/Museum';
import ParticleSystem from './components/ParticleSystem';
import { SpriteJournal, SpriteShovel } from './components/PixelSprites';

const App: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLabOpen, setIsLabOpen] = useState(false);
  const [isMuseumOpen, setIsMuseumOpen] = useState(false);
  const [selectedGemEntry, setSelectedGemEntry] = useState<Entry | null>(null);
  
  // Animation State
  const [isAnimating, setIsAnimating] = useState(false);
  const [animColor, setAnimColor] = useState('#fff');
  const [pendingEntry, setPendingEntry] = useState<Entry | null>(null);

  // Load Data
  useEffect(() => {
    const stored = localStorage.getItem(APP_STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load entries", e);
      }
    }
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleOpenLab = () => setIsLabOpen(true);
  const handleCloseLab = () => setIsLabOpen(false);

  const handleDeposit = (content: string, moodScore: number) => {
    setIsLabOpen(false);

    const mineralType = getMineralType(moodScore);
    const hasGem = determineGem(content, moodScore, entries.length);
    const thickness = calculateThickness(content);
    
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      content,
      moodScore,
      thickness,
      mineralType,
      hasGem
    };

    const palette = MINERAL_PALETTES[mineralType] || MINERAL_PALETTES.SANDSTONE;
    setAnimColor(palette.base);
    
    setPendingEntry(newEntry);
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (pendingEntry) {
      setEntries(prev => [pendingEntry, ...prev]);
      setPendingEntry(null);
    }
    setIsAnimating(false);
  };
  
  const handleSaveGemWisdom = (entry: Entry, wisdom: GemWisdom) => {
    setEntries(prev => prev.map(e => {
        if (e.id === entry.id) {
            return { ...e, gemWisdom: wisdom };
        }
        return e;
    }));
  };

  const surfaceState = calculateSurfaceState(entries);

  return (
    <div className="flex flex-col h-screen w-full bg-[#1a0f0a] relative font-sans overflow-hidden">
      
      {/* Museum Button (Top Right) */}
      <button 
        onClick={() => setIsMuseumOpen(true)}
        className="absolute top-4 right-4 z-20 w-14 h-14 sdv-btn sdv-btn-menu rounded-none shadow-[4px_4px_0_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform hover:-translate-y-1 p-2"
        title="私人博物馆"
      >
        <SpriteJournal size={4} />
      </button>

      <SkySection surfaceState={surfaceState} />
      
      <UndergroundSection 
        entries={entries} 
        onGemClick={setSelectedGemEntry}
      />

      {/* Main Action Button - Shovel */}
      <button
        onClick={handleOpenLab}
        className="fixed bottom-8 right-6 z-30 w-16 h-16 sdv-btn shadow-[4px_4px_0_rgba(0,0,0,0.5)] flex items-center justify-center text-3xl hover:scale-105 active:scale-95 transition-all p-3"
        style={{ imageRendering: 'pixelated' }}
        aria-label="写日记"
        title="记录心情"
      >
        <SpriteShovel size={5} />
      </button>

      {isLabOpen && (
        <Laboratory 
          onClose={handleCloseLab} 
          onSubmit={handleDeposit} 
        />
      )}

      {selectedGemEntry && (
        <GemModal 
          entry={selectedGemEntry} 
          onClose={() => setSelectedGemEntry(null)}
          onSave={handleSaveGemWisdom}
        />
      )}
      
      {isMuseumOpen && (
        <Museum 
          entries={entries} 
          onClose={() => setIsMuseumOpen(false)} 
          onSelectGem={setSelectedGemEntry}
        />
      )}

      <ParticleSystem 
        isActive={isAnimating} 
        color={animColor}
        count={pendingEntry ? pendingEntry.thickness * 1.5 : 100} 
        onComplete={handleAnimationComplete}
      />
    </div>
  );
};

export default App;
