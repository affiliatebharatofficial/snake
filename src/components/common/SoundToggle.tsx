import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../../game/soundEngine';

export const SoundToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const handleToggle = () => {
    const nextState = sound.toggleMute();
    setIsMuted(nextState);
    if (!nextState) {
      sound.playClick();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all shadow-sm flex items-center justify-center cursor-pointer"
      title={isMuted ? 'Unmute Game Sounds' : 'Mute Game Sounds'}
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4 text-rose-400" />
      ) : (
        <Volume2 className="w-4 h-4 text-emerald-400" />
      )}
    </button>
  );
};
