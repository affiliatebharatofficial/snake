import React from 'react';
import { Trophy, Flag } from 'lucide-react';

interface BoardCellProps {
  cellNumber: number;
  hasSnakeHead?: boolean;
  hasLadderBottom?: boolean;
}

export const BoardCell: React.FC<BoardCellProps> = ({
  cellNumber,
  hasSnakeHead,
  hasLadderBottom,
}) => {
  const is100 = cellNumber === 100;
  const is1 = cellNumber === 1;

  // Checkerboard warm cream and ivory pattern
  const row = Math.floor((cellNumber - 1) / 10);
  const col = (cellNumber - 1) % 10;
  const isAlt = (row + col) % 2 === 1;

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between p-1 select-none border border-[#e8ded1] transition-colors ${
        is100
          ? 'bg-gradient-to-br from-[#fef3c7] to-[#fde68a] border-[#f59e0b]'
          : is1
          ? 'bg-gradient-to-br from-[#d1fae5] to-[#a7f3d0] border-[#10b981]'
          : isAlt
          ? 'bg-[#f7f2ea]'
          : 'bg-[#fffcf7]'
      }`}
    >
      {/* High-Contrast Corner Number */}
      <div className="flex items-center justify-between pointer-events-none z-20">
        <span
          className={`text-[11px] sm:text-xs font-bold leading-none tracking-tight ${
            is100
              ? 'text-amber-900 font-extrabold'
              : is1
              ? 'text-emerald-900 font-extrabold'
              : 'text-[#4a3b32]'
          }`}
        >
          {cellNumber}
        </span>

        {is100 && (
          <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 animate-bounce" />
        )}

        {is1 && (
          <Flag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
        )}
      </div>

      {/* Subtle indicator dots */}
      <div className="flex items-center justify-end space-x-1 pointer-events-none">
        {hasSnakeHead && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#c84b31]/70" title="Snake Head" />
        )}
        {hasLadderBottom && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f]/70" title="Ladder Base" />
        )}
      </div>
    </div>
  );
};
