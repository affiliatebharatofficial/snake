import React, { useEffect, useState } from 'react';
import { Radio, X, Users } from 'lucide-react';
import { sound } from '../../game/soundEngine';

interface QuickMatchModalProps {
  isOpen: boolean;
  onMatchFound: () => void;
  onCancel: () => void;
}

export const QuickMatchModal: React.FC<QuickMatchModalProps> = ({
  isOpen,
  onMatchFound,
  onCancel,
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    const timer = setTimeout(() => {
      onMatchFound();
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isOpen, onMatchFound]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm p-6 rounded-3xl bg-[#29221b] border-2 border-[#523d2b] shadow-2xl flex flex-col items-center text-center space-y-5">
        <button
          onClick={() => {
            sound.playClick();
            onCancel();
          }}
          className="absolute top-4 right-4 p-2 text-[#a8998a] hover:text-[#fffdfa] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pulse Radar Indicator */}
        <div className="relative w-20 h-20 rounded-full bg-[#1c1814] border border-[#523d2b] flex items-center justify-center shadow-inner">
          <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-ping" />
          <Radio className="w-8 h-8 text-amber-400 animate-pulse" />
        </div>

        <div>
          <h3 className="font-heading font-black text-xl text-[#fffdfa]">Finding Players...</h3>
          <p className="text-xs text-[#a8998a] mt-1">
            Searching for online opponents (00:{seconds.toString().padStart(2, '0')})
          </p>
        </div>

        <div className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-[#1c1814] border border-[#382f27] text-xs text-[#d6c9ba]">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Quick Match Queue</span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onCancel();
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-[#382e25] hover:bg-[#473b30] text-[#d6c9ba] hover:text-white text-xs font-bold border border-[#524336] transition-colors cursor-pointer"
        >
          Cancel Search
        </button>
      </div>
    </div>
  );
};
