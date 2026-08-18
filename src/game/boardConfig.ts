import { Ladder, Snake, CellCoordinates, PlayerColor } from './types';

// Standard 10 Ladders as specified
export const DEFAULT_LADDERS: Ladder[] = [
  { id: 'ladder-1', start: 2, end: 38 },
  { id: 'ladder-2', start: 7, end: 14 },
  { id: 'ladder-3', start: 8, end: 31 },
  { id: 'ladder-4', start: 15, end: 26 },
  { id: 'ladder-5', start: 21, end: 42 },
  { id: 'ladder-6', start: 28, end: 84 },
  { id: 'ladder-7', start: 36, end: 44 },
  { id: 'ladder-8', start: 51, end: 67 },
  { id: 'ladder-9', start: 71, end: 91 },
  { id: 'ladder-10', start: 78, end: 98 },
];

// Standard 10 Snakes as specified
export const DEFAULT_SNAKES: Snake[] = [
  { id: 'snake-1', start: 16, end: 6 },
  { id: 'snake-2', start: 46, end: 25 },
  { id: 'snake-3', start: 49, end: 11 },
  { id: 'snake-4', start: 62, end: 19 },
  { id: 'snake-5', start: 64, end: 60 },
  { id: 'snake-6', start: 74, end: 53 },
  { id: 'snake-7', start: 89, end: 68 },
  { id: 'snake-8', start: 92, end: 88 },
  { id: 'snake-9', start: 95, end: 75 },
  { id: 'snake-10', start: 99, end: 80 },
];

export const PLAYER_COLORS: Record<PlayerColor, {
  name: string;
  bg: string;
  border: string;
  text: string;
  glow: string;
  hex: string;
  lightHex: string;
}> = {
  red: {
    name: 'Red',
    bg: 'bg-red-500',
    border: 'border-red-400',
    text: 'text-red-400',
    glow: 'shadow-neon-red',
    hex: '#ef4444',
    lightHex: '#f87171',
  },
  blue: {
    name: 'Blue',
    bg: 'bg-blue-500',
    border: 'border-blue-400',
    text: 'text-blue-400',
    glow: 'shadow-[0_0_20px_-5px_rgba(59,130,246,0.6)]',
    hex: '#3b82f6',
    lightHex: '#60a5fa',
  },
  green: {
    name: 'Green',
    bg: 'bg-emerald-500',
    border: 'border-emerald-400',
    text: 'text-emerald-400',
    glow: 'shadow-neon-green',
    hex: '#10b981',
    lightHex: '#34d399',
  },
  yellow: {
    name: 'Yellow',
    bg: 'bg-amber-500',
    border: 'border-amber-400',
    text: 'text-amber-400',
    glow: 'shadow-neon-gold',
    hex: '#f59e0b',
    lightHex: '#fbbf24',
  },
};

export const COLOR_ORDER: PlayerColor[] = ['red', 'blue', 'green', 'yellow'];

/**
 * Calculates (x, y) center percentages and row/col for each cell (1 to 100).
 * Row 0 is at bottom (squares 1..10 left-to-right).
 * Row 1 is squares 20..11 right-to-left.
 * Row 9 is top row (squares 100..91 right-to-left).
 */
export function getCellCoordinates(cellNum: number): CellCoordinates {
  if (cellNum < 1) cellNum = 1;
  if (cellNum > 100) cellNum = 100;

  const zeroIndexed = cellNum - 1;
  const row = Math.floor(zeroIndexed / 10); // 0 (bottom) to 9 (top)
  const isEvenRow = row % 2 === 0; // 0, 2, 4, 6, 8 go Left -> Right

  let col: number;
  if (isEvenRow) {
    col = zeroIndexed % 10; // 0..9 (Left -> Right)
  } else {
    col = 9 - (zeroIndexed % 10); // 9..0 (Right -> Left)
  }

  // Calculate percentage from top-left (0,0) to bottom-right (100,100)
  // Row 0 is bottom: y = 90% + 5% = 95% from top
  // Row 9 is top: y = 0% + 5% = 5% from top
  const x = col * 10 + 5;
  const y = (9 - row) * 10 + 5;

  return {
    cell: cellNum,
    row,
    col,
    x,
    y,
  };
}

/**
 * Pre-computed coordinates for all 100 cells for fast lookup.
 */
export const CELL_COORDINATES_MAP: Record<number, CellCoordinates> = (() => {
  const map: Record<number, CellCoordinates> = {};
  for (let i = 1; i <= 100; i++) {
    map[i] = getCellCoordinates(i);
  }
  return map;
})();
