import React, { useState } from 'react';
import { GameRules } from '../../game/types';
import { DEFAULT_GAME_RULES } from '../../game/gameRules';
import { Users, Settings, X, PlusCircle } from 'lucide-react';
import { sound } from '../../game/soundEngine';

interface CreateRoomModalProps {
  isOpen: boolean;
  onCreate: (maxPlayers: 2 | 3 | 4, rules: GameRules) => void;
  onClose: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onCreate,
  onClose,
}) => {
  const [maxPlayers, setMaxPlayers] = useState<2 | 3 | 4>(4);
  const [rules, setRules] = useState<GameRules>({ ...DEFAULT_GAME_RULES });
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    onCreate(maxPlayers, rules);
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
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-[#fffdfa]">Create Private Game</h3>
            <p className="text-xs text-[#a8998a]">Configure player capacity and rules</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Max Players Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#d6c9ba]">Max Players</label>
            <div className="grid grid-cols-3 gap-2">
              {([2, 3, 4] as const).map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setMaxPlayers(num);
                  }}
                  className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    maxPlayers === num
                      ? 'bg-amber-600 border-amber-400 text-white shadow-sm'
                      : 'bg-[#1c1814] border-[#382f27] text-[#d6c9ba] hover:bg-[#332b23]'
                  }`}
                >
                  {num} Players
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible Rules Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide Custom Rules' : 'Customize Game Rules'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-3 p-3 rounded-2xl bg-[#1c1814] border border-[#382f27] space-y-2.5">
                <label className="flex items-center justify-between text-xs text-[#d6c9ba] cursor-pointer">
                  <span>Rolling 6 gives extra turn</span>
                  <input
                    type="checkbox"
                    checked={rules.sixGivesExtraTurn}
                    onChange={e => setRules({ ...rules, sixGivesExtraTurn: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 bg-[#29221b] border-[#4a3b30]"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-[#d6c9ba] cursor-pointer">
                  <span>Exact 100 required to win</span>
                  <input
                    type="checkbox"
                    checked={rules.exact100ToWin}
                    onChange={e => setRules({ ...rules, exact100ToWin: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 bg-[#29221b] border-[#4a3b30]"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-[#d6c9ba] cursor-pointer">
                  <span>Must roll 6 to enter board</span>
                  <input
                    type="checkbox"
                    checked={rules.enterOnSix}
                    onChange={e => setRules({ ...rules, enterOnSix: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 bg-[#29221b] border-[#4a3b30]"
                  />
                </label>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-heading font-extrabold text-sm sm:text-base btn-secondary text-white flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Room & Get Code</span>
          </button>
        </form>
      </div>
    </div>
  );
};
