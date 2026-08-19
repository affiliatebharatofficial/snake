import React from 'react';
import { Player } from '../../game/types';
import { CELL_COORDINATES_MAP } from '../../game/boardConfig';
import { Bot } from 'lucide-react';

interface PlayerTokenProps {
  player: Player;
  isCurrentTurn: boolean;
  totalTokensInSquare: number;
  tokenIndexInSquare: number;
  isMoving?: boolean;
  isSpecialMoving?: boolean;
}

const TOKEN_COLOR_THEMES: Record<string, {
  bg: string;
  border: string;
  shadow: string;
  topHighlight: string;
}> = {
  red: {
    bg: '#dc2626',
    border: '#991b1b',
    shadow: 'rgba(153, 27, 27, 0.4)',
    topHighlight: '#f87171',
  },
  blue: {
    bg: '#2563eb',
    border: '#1e40af',
    shadow: 'rgba(30, 64, 175, 0.4)',
    topHighlight: '#60a5fa',
  },
  green: {
    bg: '#16a34a',
    border: '#166534',
    shadow: 'rgba(22, 101, 52, 0.4)',
    topHighlight: '#4ade80',
  },
  yellow: {
    bg: '#d97706',
    border: '#92400e',
    shadow: 'rgba(146, 64, 14, 0.4)',
    topHighlight: '#fbbf24',
  },
};

export const PlayerToken: React.FC<PlayerTokenProps> = ({
  player,
  isCurrentTurn,
  totalTokensInSquare,
  tokenIndexInSquare,
  isMoving = false,
  isSpecialMoving = false,
}) => {
  let x = 0;
  let y = 0;

  if (player.position === 0) {
    // Waiting dock area clearly visible at square 1 start base
    const dockOffsets = [
      { x: 3.5, y: 96.5 },
      { x: 6.5, y: 96.5 },
      { x: 3.5, y: 93.5 },
      { x: 6.5, y: 93.5 },
    ];
    const offset = dockOffsets[(player.playerNumber - 1) % 4] || { x: 5, y: 95 };
    x = offset.x;
    y = offset.y;
  } else {
    const coords = CELL_COORDINATES_MAP[player.position];
    if (coords) {
      x = coords.x;
      y = coords.y;

      // Smart orbital clustering when multiple tokens share square
      if (totalTokensInSquare > 1) {
        const offsets = [
          { dx: -1.8, dy: -1.8 },
          { dx: 1.8, dy: -1.8 },
          { dx: -1.8, dy: 1.8 },
          { dx: 1.8, dy: 1.8 },
        ];
        const offset = offsets[tokenIndexInSquare % 4];
        x += offset.dx;
        y += offset.dy;
      }
    }
  }

  const theme = TOKEN_COLOR_THEMES[player.color] || TOKEN_COLOR_THEMES.red;

  return (
    <div
      className={`absolute z-30 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
        isMoving ? 'scale-125 z-40' : ''
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transition: isSpecialMoving
          ? 'left 900ms cubic-bezier(0.4, 0, 0.2, 1), top 900ms cubic-bezier(0.4, 0, 0.2, 1), transform 350ms ease-out'
          : isMoving
          ? 'left 380ms ease-in-out, top 380ms ease-in-out, transform 200ms ease-out'
          : 'left 300ms ease-out, top 300ms ease-out, transform 200ms ease-out',
      }}
      title={`${player.nickname} (Position: ${player.position})`}
    >
      {/* Active Turn Subtle Pulse */}
      {isCurrentTurn && (
        <div
          className="absolute -inset-1.5 rounded-full animate-ping opacity-40 pointer-events-none"
          style={{ backgroundColor: theme.bg }}
        />
      )}

      {/* Tactile Board Game Piece */}
      <div
        className={`relative w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-white transition-transform ${
          isCurrentTurn ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-[#2b1f16] scale-110' : ''
        }`}
        style={{
          backgroundColor: theme.bg,
          border: `2px solid ${theme.border}`,
          boxShadow: `0 3px 8px ${theme.shadow}, inset 0 1px 1px ${theme.topHighlight}`,
        }}
      >
        {player.isBot ? (
          <Bot className="w-3.5 h-3.5 text-white drop-shadow" />
        ) : (
          <span className="text-[11px] sm:text-xs font-black drop-shadow tracking-tight">
            {player.nickname.charAt(0).toUpperCase()}
          </span>
        )}

        {/* Small player number badge */}
        <span
          className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#1e1711] text-[8px] font-extrabold flex items-center justify-center border border-white/40 text-amber-200"
        >
          {player.playerNumber}
        </span>
      </div>
    </div>
  );
};
