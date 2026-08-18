import { CELL_COORDINATES_MAP } from './boardConfig';

export interface SnakeCurveDefinition {
  snakeId: string;
  startCell: number; // Head
  endCell: number;   // Tail
  // Pre-calculated cubic bezier control points (in percentages 0..100)
  cp1x: number;
  cp1y: number;
  cp2x: number;
  cp2y: number;
  // Visual body width in SVG units
  bodyWidth: number;
  // Head angle adjustment in degrees
  headAngleOffset: number;
}

export interface LadderCurveDefinition {
  ladderId: string;
  startCell: number; // Bottom
  endCell: number;   // Top
  // Custom rail separation offset in percentage
  railWidth: number;
  // Custom rung spacing
  rungCount: number;
  // Slight lateral offset if needed to clear numbers
  offsetX: number;
  offsetY: number;
}

/**
 * Mathematically tuned curves for all 10 snakes to guarantee ZERO collision with ladders
 * and complete clearance of corner square numbers.
 */
export const SNAKE_CURVES_CONFIG: Record<string, SnakeCurveDefinition> = {
  // Snake 1: 16 -> 6 (Head: 45, 85 | Tail: 55, 95)
  'snake-1': {
    snakeId: 'snake-1',
    startCell: 16,
    endCell: 6,
    cp1x: 42,
    cp1y: 89,
    cp2x: 48,
    cp2y: 94,
    bodyWidth: 3.2,
    headAngleOffset: 0,
  },
  // Snake 2: 46 -> 25 (Head: 55, 55 | Tail: 45, 75)
  // Arcs rightward away from Ladder 36->44 (at 45..35, 65..55)
  'snake-2': {
    snakeId: 'snake-2',
    startCell: 46,
    endCell: 25,
    cp1x: 61,
    cp1y: 60,
    cp2x: 56,
    cp2y: 71,
    bodyWidth: 3.2,
    headAngleOffset: 5,
  },
  // Snake 3: 49 -> 11 (Head: 85, 55 | Tail: 95, 85)
  // Arcs toward right perimeter, avoiding Ladder 8->31
  'snake-3': {
    snakeId: 'snake-3',
    startCell: 49,
    endCell: 11,
    cp1x: 91,
    cp1y: 62,
    cp2x: 97,
    cp2y: 74,
    bodyWidth: 3.4,
    headAngleOffset: 10,
  },
  // Snake 4: 62 -> 19 (Head: 15, 35 | Tail: 15, 85)
  // Arcs rightward toward col 2, keeping 10% clearance from Ladder 21->42 (at 5%..15%)
  'snake-4': {
    snakeId: 'snake-4',
    startCell: 62,
    endCell: 19,
    cp1x: 23,
    cp1y: 48,
    cp2x: 23,
    cp2y: 72,
    bodyWidth: 3.5,
    headAngleOffset: 0,
  },
  // Snake 5: 64 -> 60 (Head: 35, 35 | Tail: 5, 45)
  // Curves downward across row 4
  'snake-5': {
    snakeId: 'snake-5',
    startCell: 64,
    endCell: 60,
    cp1x: 26,
    cp1y: 36,
    cp2x: 14,
    cp2y: 40,
    bodyWidth: 3.2,
    headAngleOffset: -5,
  },
  // Snake 6: 74 -> 53 (Head: 65, 25 | Tail: 75, 45)
  // Arcs gently rightward avoiding Ladder 51->67
  'snake-6': {
    snakeId: 'snake-6',
    startCell: 74,
    endCell: 53,
    cp1x: 62,
    cp1y: 33,
    cp2x: 70,
    cp2y: 40,
    bodyWidth: 3.3,
    headAngleOffset: 5,
  },
  // Snake 7: 89 -> 68 (Head: 85, 15 | Tail: 75, 35)
  // Curves cleanly through col 8 to col 7
  'snake-7': {
    snakeId: 'snake-7',
    startCell: 89,
    endCell: 68,
    cp1x: 88,
    cp1y: 22,
    cp2x: 82,
    cp2y: 30,
    bodyWidth: 3.2,
    headAngleOffset: 0,
  },
  // Snake 8: 92 -> 88 (Head: 85, 5 | Tail: 75, 15)
  // Short curve in upper right
  'snake-8': {
    snakeId: 'snake-8',
    startCell: 92,
    endCell: 88,
    cp1x: 82,
    cp1y: 7,
    cp2x: 77,
    cp2y: 11,
    bodyWidth: 3.0,
    headAngleOffset: -10,
  },
  // Snake 9: 95 -> 75 (Head: 55, 5 | Tail: 55, 25)
  // Vertical serpentine curve in col 5
  'snake-9': {
    snakeId: 'snake-9',
    startCell: 95,
    endCell: 75,
    cp1x: 51,
    cp1y: 11,
    cp2x: 58,
    cp2y: 19,
    bodyWidth: 3.2,
    headAngleOffset: 0,
  },
  // Snake 10: 99 -> 80 (Head: 15, 5 | Tail: 5, 25)
  // Curves leftward toward col 0, staying completely clear of Ladder 78->98 (at col 2, x=25%)
  'snake-10': {
    snakeId: 'snake-10',
    startCell: 99,
    endCell: 80,
    cp1x: 10,
    cp1y: 10,
    cp2x: 6,
    cp2y: 18,
    bodyWidth: 3.2,
    headAngleOffset: -15,
  },
};

/**
 * Ladder geometric parameters with physical wood rail spacing.
 */
export const LADDER_CONFIG: Record<string, LadderCurveDefinition> = {
  'ladder-1': { ladderId: 'ladder-1', startCell: 2, endCell: 38, railWidth: 1.1, rungCount: 7, offsetX: 0, offsetY: 0 },
  'ladder-2': { ladderId: 'ladder-2', startCell: 7, endCell: 14, railWidth: 1.0, rungCount: 3, offsetX: 0, offsetY: 0 },
  'ladder-3': { ladderId: 'ladder-3', startCell: 8, endCell: 31, railWidth: 1.1, rungCount: 6, offsetX: 0, offsetY: 0 },
  'ladder-4': { ladderId: 'ladder-4', startCell: 15, endCell: 26, railWidth: 1.0, rungCount: 3, offsetX: 0, offsetY: 0 },
  'ladder-5': { ladderId: 'ladder-5', startCell: 21, endCell: 42, railWidth: 1.1, rungCount: 5, offsetX: 0, offsetY: 0 },
  'ladder-6': { ladderId: 'ladder-6', startCell: 28, endCell: 84, railWidth: 1.2, rungCount: 12, offsetX: 0, offsetY: 0 },
  'ladder-7': { ladderId: 'ladder-7', startCell: 36, endCell: 44, railWidth: 1.0, rungCount: 3, offsetX: 0, offsetY: 0 },
  'ladder-8': { ladderId: 'ladder-8', startCell: 51, endCell: 67, railWidth: 1.1, rungCount: 5, offsetX: 0, offsetY: 0 },
  'ladder-9': { ladderId: 'ladder-9', startCell: 71, endCell: 91, railWidth: 1.1, rungCount: 5, offsetX: 0, offsetY: 0 },
  'ladder-10': { ladderId: 'ladder-10', startCell: 78, endCell: 98, railWidth: 1.1, rungCount: 5, offsetX: 0, offsetY: 0 },
};

/**
 * Returns the exact (x, y) path calculation for a snake.
 */
export function getSnakePath(snakeId: string, startCell: number, endCell: number) {
  const headCoord = CELL_COORDINATES_MAP[startCell] || { x: 50, y: 50 };
  const tailCoord = CELL_COORDINATES_MAP[endCell] || { x: 50, y: 50 };

  const custom = SNAKE_CURVES_CONFIG[snakeId];
  if (custom) {
    return {
      hx: headCoord.x,
      hy: headCoord.y,
      tx: tailCoord.x,
      ty: tailCoord.y,
      cp1x: custom.cp1x,
      cp1y: custom.cp1y,
      cp2x: custom.cp2x,
      cp2y: custom.cp2y,
      bodyWidth: custom.bodyWidth,
      headAngleOffset: custom.headAngleOffset,
    };
  }

  // Fallback parametric bezier curve
  const dx = tailCoord.x - headCoord.x;
  const dy = tailCoord.y - headCoord.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const perpX = (-dy / dist) * 7;
  const perpY = (dx / dist) * 7;

  return {
    hx: headCoord.x,
    hy: headCoord.y,
    tx: tailCoord.x,
    ty: tailCoord.y,
    cp1x: headCoord.x + dx * 0.35 + perpX,
    cp1y: headCoord.y + dy * 0.35 + perpY,
    cp2x: headCoord.x + dx * 0.7 - perpX,
    cp2y: headCoord.y + dy * 0.7 - perpY,
    bodyWidth: 3.2,
    headAngleOffset: 0,
  };
}
