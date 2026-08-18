import React from 'react';
import { Player } from '../../game/types';
import { Dices, Hourglass } from 'lucide-react';

interface TurnIndicatorProps {
  currentTurnPlayer?: Player;
  isMyTurn: boolean;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({
  currentTurnPlayer,
  isMyTurn,
}) => {
  if (!currentTurnPlayer) return null;

  return (
    <div
      className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-between transition-all border ${
        isMyTurn
          ? 'bg-[#382b1e] border-amber-500/80 shadow-md'
          : 'bg-[#241f1a] border-[#3d342c]'
      }`}
    >
      <div className="flex items-center space-x-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-[#9c8e80] font-bold">
            Current Turn
          </span>
          <span className="text-sm sm:text-base font-extrabold text-[#fffdfa] flex items-center space-x-1.5">
            <span className={isMyTurn ? 'text-amber-300' : 'text-[#f5ebd9]'}>
              {isMyTurn ? 'Your Turn' : `${currentTurnPlayer.nickname}'s Turn`}
            </span>
            {isMyTurn && (
              <span className="text-[10px] bg-amber-500 text-stone-950 font-bold px-1.5 py-0.2 rounded">
                Roll Dice!
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center text-[#9c8e80]">
        {isMyTurn ? (
          <Dices className="w-5 h-5 text-amber-400 animate-bounce" />
        ) : (
          <Hourglass className="w-4 h-4 text-[#9c8e80]" />
        )}
      </div>
    </div>
  );
};
