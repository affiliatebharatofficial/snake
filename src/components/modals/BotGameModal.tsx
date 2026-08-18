import React, { useState } from 'react';
import { BotDifficulty } from '../../game/types';
import { Bot, Play, X, Zap, Shield, Flame } from 'lucide-react';
import { sound } from '../../game/soundEngine';

interface BotGameModalProps {
  isOpen: boolean;
  onStart: (botCount: number, difficulty: BotDifficulty) => void;
  onClose: () => void;
}

export const BotGameModal: React.FC<BotGameModalProps> = ({
  isOpen,
  onStart,
  onClose,
}) => {
  const [botCount, setBotCount] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<BotDifficulty>('medium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    onStart(botCount, difficulty);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#29221b] border-2 border-[#523d2b] shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#a8998a] hover:text-[#fffdfa] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#382b1e] border border-[#5a432f] flex items-center justify-center text-amber-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-[#fffdfa]">Play With AI Bots</h3>
            <p className="text-xs text-[#a8998a]">Practice offline or challenge AI opponents</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Opponent Bot Count */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#d6c9ba]">Number of AI Opponents</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setBotCount(count);
                  }}
                  className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    botCount === count
                      ? 'bg-amber-600 border-amber-400 text-white shadow-sm'
                      : 'bg-[#1c1814] border-[#382f27] text-[#d6c9ba] hover:bg-[#332b23]'
                  }`}
                >
                  {count} {count === 1 ? 'Bot' : 'Bots'}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#d6c9ba]">Bot Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'easy', label: 'Easy', icon: Shield, color: 'text-emerald-400' },
                { id: 'medium', label: 'Medium', icon: Zap, color: 'text-amber-400' },
                { id: 'hard', label: 'Hard', icon: Flame, color: 'text-rose-400' },
              ].map(d => {
                const Icon = d.icon;
                const isSelected = difficulty === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setDifficulty(d.id as BotDifficulty);
                    }}
                    className={`p-2.5 rounded-xl flex flex-col items-center justify-center space-y-1 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#382e25] border-amber-500 text-white shadow-sm'
                        : 'bg-[#1c1814] border-[#382f27] text-[#8c7e72] hover:bg-[#332b23]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${d.color}`} />
                    <span className="text-xs font-bold">{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-heading font-extrabold text-sm sm:text-base btn-primary text-white flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Bot Game</span>
          </button>
        </form>
      </div>
    </div>
  );
};
