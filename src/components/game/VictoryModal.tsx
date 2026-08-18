import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player } from '../../game/types';
import { Trophy, RotateCcw, Home, Sparkles } from 'lucide-react';
import { sound } from '../../game/soundEngine';

interface VictoryModalProps {
  winner: Player;
  players: Player[];
  turnCount: number;
  onRematch: () => void;
  onHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  players,
  turnCount,
  onRematch,
  onHome,
}) => {
  useEffect(() => {
    sound.playVictory();

    // Trigger celebratory confetti burst
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#d97706', '#2d6a4f', '#dc2626', '#2563eb'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const sortedPlayers = [...players].sort((a, b) => b.position - a.position);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#29221b] border-2 border-[#523d2b] shadow-2xl flex flex-col items-center text-center space-y-4">
        {/* Trophy icon */}
        <div className="relative w-18 h-18 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-lg border-2 border-amber-200">
          <Trophy className="w-9 h-9 text-stone-950 animate-bounce" />
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-200" />
        </div>

        {/* Title */}
        <div>
          <span className="text-xs uppercase tracking-widest font-extrabold text-amber-400 font-heading">
            Victory! Reached Square 100
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#fffdfa] mt-1">
            {winner.nickname} Wins!
          </h2>
          <p className="text-xs text-[#a8998a] mt-1">
            Game completed in {turnCount} turns.
          </p>
        </div>

        {/* Final Standings */}
        <div className="w-full flex flex-col space-y-1.5 p-3 rounded-2xl bg-[#1c1814] border border-[#382f27]">
          <span className="text-[11px] font-bold text-[#a8998a] text-left px-1">Final Standings:</span>
          {sortedPlayers.map((p, idx) => (
            <div
              key={p.id}
              className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold ${
                p.id === winner.id
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                  : 'bg-[#241f1a] border border-[#3d342c] text-[#d6c9ba]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-4 text-center font-bold text-[#8c7e72]">#{idx + 1}</span>
                <span className="truncate">{p.nickname}</span>
              </div>
              <span className="font-bold">Square {p.position}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onRematch}
            className="w-full py-3.5 px-5 rounded-xl font-heading font-extrabold text-sm sm:text-base btn-secondary text-white flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again / Rematch</span>
          </button>

          <button
            onClick={onHome}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-heading font-bold text-sm bg-[#382e25] hover:bg-[#473b30] text-[#f5ebd9] border border-[#524336] flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
