import React from 'react';
import { Dices } from 'lucide-react';
import { sound } from '../../game/soundEngine';

interface Dice3DProps {
  value?: number;
  isRolling: boolean;
  isMyTurn: boolean;
  disabled: boolean;
  onRoll: () => void;
}

export const Dice3D: React.FC<Dice3DProps> = ({
  value = 1,
  isRolling,
  isMyTurn,
  disabled,
  onRoll,
}) => {
  const handleRollClick = () => {
    if (disabled || isRolling || !isMyTurn) return;
    sound.playDiceRoll();
    onRoll();
  };

  const renderDots = (num: number) => {
    switch (num) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#dc2626] shadow-inner" />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full flex justify-between p-2">
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#1c1917] self-start" />
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#1c1917] self-end" />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex justify-between p-2">
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#1c1917] self-start" />
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#1c1917] self-center" />
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#1c1917] self-end" />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 gap-2 p-2 place-items-center">
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#1c1917]" />
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#1c1917]" />
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#1c1917]" />
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#1c1917]" />
          </div>
        );
      case 5:
        return (
          <div className="relative w-full h-full grid grid-cols-2 gap-2 p-2 place-items-center">
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#1c1917]" />
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#1c1917]" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#dc2626]" />
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#1c1917]" />
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#1c1917]" />
          </div>
        );
      case 6:
      default:
        return (
          <div className="w-full h-full grid grid-cols-2 gap-1.5 p-2 place-items-center">
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#dc2626]" />
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#dc2626]" />
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#dc2626]" />
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#dc2626]" />
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#dc2626]" />
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#dc2626]" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3.5 p-4 rounded-2xl bg-[#241f1a] border border-[#3d342c] shadow-lg w-full">
      {/* 3D Physical Ivory Die */}
      <div className="relative flex items-center justify-center p-2">
        <div
          className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#fffef9] border-2 border-[#e8dfd3] shadow-[0_12px_24px_-4px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.1)] flex items-center justify-center select-none transition-transform duration-300 ${
            isRolling ? 'dice-rolling scale-110' : ''
          }`}
        >
          {renderDots(value)}
        </div>
      </div>

      {/* Roll Button */}
      <button
        onClick={handleRollClick}
        disabled={disabled || isRolling || !isMyTurn}
        className={`w-full py-3.5 px-6 rounded-xl font-heading font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all select-none min-h-[50px] ${
          isMyTurn && !isRolling && !disabled
            ? 'btn-primary text-white cursor-pointer active:scale-95'
            : 'bg-[#1f1a16] text-[#786c62] cursor-not-allowed border border-[#382f28]'
        }`}
      >
        <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
        <span>{isRolling ? 'Rolling...' : isMyTurn ? 'ROLL DICE' : 'Waiting for Turn...'}</span>
      </button>
    </div>
  );
};
