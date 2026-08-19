import React, { useMemo } from 'react';
import { Player, Snake, Ladder } from '../../game/types';
import { DEFAULT_LADDERS, DEFAULT_SNAKES } from '../../game/boardConfig';
import { BoardCell } from './BoardCell';
import { LadderSvg } from './LadderSvg';
import { SnakeSvg } from './SnakeSvg';
import { PlayerToken } from './PlayerToken';

interface GameBoardProps {
  players: Player[];
  currentTurnGuestId?: string;
  movingPlayerId?: string;
  isSpecialMoving?: boolean;
  moveBanner?: { text: string; type: 'normal' | 'ladder' | 'snake' } | null;
  snakes?: Snake[];
  ladders?: Ladder[];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  players,
  currentTurnGuestId,
  movingPlayerId,
  isSpecialMoving = false,
  moveBanner = null,
  snakes = DEFAULT_SNAKES,
  ladders = DEFAULT_LADDERS,
}) => {
  // 10x10 Serpentine row configuration
  const boardCells = useMemo(() => {
    const rows = [];
    for (let r = 9; r >= 0; r--) {
      const isEvenRow = r % 2 === 0;
      const cellsInRow = [];
      for (let c = 0; c < 10; c++) {
        let cellNum: number;
        if (isEvenRow) {
          cellNum = r * 10 + c + 1; // 1..10, 21..30, etc.
        } else {
          cellNum = r * 10 + (10 - c); // 20..11, 40..31, 100..91
        }
        cellsInRow.push(cellNum);
      }
      rows.push(cellsInRow);
    }
    return rows;
  }, []);

  const snakeHeads = useMemo(() => new Set(snakes.map(s => s.start)), [snakes]);
  const ladderBottoms = useMemo(() => new Set(ladders.map(l => l.start)), [ladders]);

  const playersByPosition = useMemo(() => {
    const map = new Map<number, Player[]>();
    players.forEach(p => {
      const list = map.get(p.position) || [];
      list.push(p);
      map.set(p.position, list);
    });
    return map;
  }, [players]);

  return (
    <div className="relative w-full max-w-[580px] aspect-square mx-auto rounded-2xl p-2.5 sm:p-3.5 bg-[#2c1f16] border-4 border-[#523b2b] shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.1)] flex flex-col justify-center select-none">
      {/* Floating Action Banner */}
      {moveBanner && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none transition-all animate-bounce">
          <div
            className={`px-4 py-1.5 rounded-full font-heading font-extrabold text-xs sm:text-sm shadow-xl flex items-center space-x-2 border ${
              moveBanner.type === 'ladder'
                ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-amber-500/50'
                : moveBanner.type === 'snake'
                ? 'bg-red-600 text-white border-red-400 shadow-red-600/50'
                : 'bg-[#382b1e] text-amber-200 border-amber-500/50 shadow-black/60'
            }`}
          >
            <span>{moveBanner.text}</span>
          </div>
        </div>
      )}

      {/* Inner Cream Field Container */}
      <div className="relative w-full h-full grid grid-rows-10 grid-cols-10 rounded-lg overflow-hidden bg-[#fffcf7] border-2 border-[#d6c4b2] shadow-inner">
        {boardCells.map((rowCells, rIdx) => (
          <React.Fragment key={`row_${rIdx}`}>
            {rowCells.map(cellNum => (
              <BoardCell
                key={`cell_${cellNum}`}
                cellNumber={cellNum}
                hasSnakeHead={snakeHeads.has(cellNum)}
                hasLadderBottom={ladderBottoms.has(cellNum)}
              />
            ))}
          </React.Fragment>
        ))}

        {/* SVG Layer: Ladders & Snakes */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* 1. Ladders Layer (under snakes) */}
          {ladders.map(ladder => (
            <LadderSvg
              key={ladder.id}
              id={ladder.id}
              startCell={ladder.start}
              endCell={ladder.end}
            />
          ))}

          {/* 2. Snakes Layer (curved away from ladders with zero collision) */}
          {snakes.map(snake => (
            <SnakeSvg
              key={snake.id}
              id={snake.id}
              startCell={snake.start}
              endCell={snake.end}
            />
          ))}
        </svg>

        {/* 3. Player Tokens Layer (over snakes and ladders) */}
        {players.map(player => {
          const playersInSquare = playersByPosition.get(player.position) || [player];
          const tokenIdx = playersInSquare.findIndex(p => p.id === player.id);

          return (
            <PlayerToken
              key={player.id}
              player={player}
              isCurrentTurn={player.id === currentTurnGuestId}
              totalTokensInSquare={playersInSquare.length}
              tokenIndexInSquare={tokenIdx >= 0 ? tokenIdx : 0}
              isMoving={player.id === movingPlayerId}
              isSpecialMoving={player.id === movingPlayerId && isSpecialMoving}
            />
          );
        })}
      </div>
    </div>
  );
};
