import React, { useState } from 'react';
import { generateDefaultNickname, sanitizeNickname } from '../../services/guestService';
import { Dices, User, Sparkles, X } from 'lucide-react';
import { sound } from '../../game/soundEngine';

interface NicknameModalProps {
  isOpen: boolean;
  initialNickname?: string;
  onConfirm: (nickname: string) => void;
  onClose: () => void;
  title?: string;
}

export const NicknameModal: React.FC<NicknameModalProps> = ({
  isOpen,
  initialNickname = '',
  onConfirm,
  onClose,
  title = "What's your name?",
}) => {
  const [nickname, setNickname] = useState(initialNickname || generateDefaultNickname());
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRandomize = () => {
    sound.playDiceRoll();
    setNickname(generateDefaultNickname());
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sanitizeNickname(nickname);
    if (clean.length < 2) {
      setError('Nickname must be at least 2 characters.');
      return;
    }
    sound.playClick();
    onConfirm(clean);
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
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-[#fffdfa]">{title}</h3>
            <p className="text-xs text-[#a8998a]">Instant play • No password or account needed</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#d6c9ba]">Player Nickname</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={nickname}
                onChange={e => {
                  setNickname(e.target.value);
                  setError('');
                }}
                maxLength={20}
                placeholder="Enter nickname..."
                autoFocus
                className="flex-1 bg-[#1a1613] border border-[#4a3b30] rounded-xl px-4 py-3 text-sm text-[#fffdfa] placeholder-[#786c62] focus:outline-none focus:border-amber-500 font-semibold"
              />
              <button
                type="button"
                onClick={handleRandomize}
                title="Generate Random Nickname"
                className="p-3 bg-[#382e25] hover:bg-[#473b30] border border-[#524336] rounded-xl text-amber-400 transition-colors cursor-pointer"
              >
                <Dices className="w-5 h-5" />
              </button>
            </div>
            {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-heading font-extrabold text-sm sm:text-base btn-primary text-white flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
          >
            <span>Continue to Game</span>
            <Sparkles className="w-4 h-4 text-amber-200" />
          </button>
        </form>
      </div>
    </div>
  );
};
