import React from 'react';
import { getSnakePath } from '../../game/boardGeometry';

interface SnakeSvgProps {
  startCell: number; // Head
  endCell: number;   // Tail
  id: string;
}

export const SnakeSvg: React.FC<SnakeSvgProps> = ({ startCell, endCell, id }) => {
  const { hx, hy, tx, ty, cp1x, cp1y, cp2x, cp2y, bodyWidth, headAngleOffset } = getSnakePath(
    id,
    startCell,
    endCell
  );

  const pathD = `M ${hx} ${hy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tx} ${ty}`;

  // Calculate tangent angle at head for eyes and tongue
  const headAngle = Math.atan2(cp1y - hy, cp1x - hx) * (180 / Math.PI) + headAngleOffset;

  return (
    <g className="snake-element pointer-events-none select-none">
      {/* Subtle Drop Shadow on Table/Board */}
      <path
        d={pathD}
        fill="none"
        stroke="#2c1a14"
        strokeWidth={bodyWidth + 1.2}
        strokeLinecap="round"
        opacity="0.25"
        transform="translate(0.3, 0.5)"
      />

      {/* Dark Outer Contour for crisp definition */}
      <path
        d={pathD}
        fill="none"
        stroke="#4a1515"
        strokeWidth={bodyWidth + 0.8}
        strokeLinecap="round"
      />

      {/* Main Snake Body (Rich Terracotta / Crimson) */}
      <path
        d={pathD}
        fill="none"
        stroke="#b91c1c"
        strokeWidth={bodyWidth}
        strokeLinecap="round"
      />

      {/* Subtle Scale Pattern Highlight */}
      <path
        d={pathD}
        fill="none"
        stroke="#fca5a5"
        strokeWidth={bodyWidth * 0.25}
        strokeDasharray="1.5, 4"
        strokeLinecap="round"
      />

      {/* Compact, Refined Snake Head (Size <= 1 cell) */}
      <g transform={`translate(${hx}, ${hy}) rotate(${headAngle})`}>
        {/* Head Contour */}
        <ellipse cx="0" cy="0" rx="3.2" ry="2.6" fill="#4a1515" />
        {/* Head Body */}
        <ellipse cx="0" cy="0" rx="2.8" ry="2.2" fill="#b91c1c" />

        {/* Small Eyes */}
        <circle cx="1.2" cy="-1.3" r="0.8" fill="#fef08a" />
        <circle cx="1.2" cy="-1.3" r="0.4" fill="#1a1a1a" />
        <circle cx="1.2" cy="1.3" r="0.8" fill="#fef08a" />
        <circle cx="1.2" cy="1.3" r="0.4" fill="#1a1a1a" />

        {/* Delicate Forked Tongue */}
        <line x1="-2.4" y1="0" x2="-4.6" y2="0" stroke="#f87171" strokeWidth="0.6" strokeLinecap="round" />
        <line x1="-4.6" y1="0" x2="-5.8" y2="-0.8" stroke="#f87171" strokeWidth="0.5" strokeLinecap="round" />
        <line x1="-4.6" y1="0" x2="-5.8" y2="0.8" stroke="#f87171" strokeWidth="0.5" strokeLinecap="round" />
      </g>

      {/* Small Tapered Tail */}
      <circle cx={tx} cy={ty} r="1.4" fill="#7f1d1d" />
    </g>
  );
};
