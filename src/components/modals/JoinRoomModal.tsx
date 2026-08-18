import React, { useState } from 'react';
import { DoorOpen, X, KeyRound, Clipboard } from 'lucide-react';
import { sound } from '../../game/soundEngine';

interface JoinRoomModalProps {
  isOpen: boolean;
  onJoin: (roomCode: string) => void;
  onClose: () => void;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  isOpen,
  onJoin,
  onClose,
}) => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePaste = async () => {
    try {
      sound.playClick();
      const text = await navigator.clipboard.readText();
      const match = text.match(/([A-Za-z0-9]{6})$/);
      if (match) {
        setRoomCode(match[1].toUpperCase());
      } else {
        setRoomCode(text.trim().toUpperCase().slice(0, 6));
      }
      setError('');
    } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = roomCode.trim().toUpperCase();
    if (clean.length < 4) {
      setError('Please enter a valid 6-character room code.');
      return;
    }
    sound.playClick();
    onJoin(clean);
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
            <DoorOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-[#fffdfa]">Join Private Game</h3>
            <p className="text-xs text-[#a8998a]">Enter the room code shared by your friend</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#d6c9ba]">Room Code</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={roomCode}
                onChange={e => {
                  setRoomCode(e.target.value.toUpperCase());
                  setError('');
                }}
                maxLength={8}
                placeholder="e.g. AB7K9P"
                autoFocus
                className="flex-1 bg-[#1a1613] border border-[#4a3b30] rounded-xl px-4 py-3 text-base text-amber-400 placeholder-[#615347] focus:outline-none focus:border-amber-500 font-mono font-extrabold tracking-widest uppercase text-center"
              />
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from Clipboard"
                className="p-3 bg-[#382e25] hover:bg-[#473b30] border border-[#524336] rounded-xl text-amber-400 transition-colors cursor-pointer"
              >
                <Clipboard className="w-5 h-5" />
              </button>
            </div>
            {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-heading font-extrabold text-sm sm:text-base btn-primary text-white flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
          >
            <KeyRound className="w-4 h-4" />
            <span>Join Room</span>
          </button>
        </form>
      </div>
    </div>
  );
};
