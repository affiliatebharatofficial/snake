import React from 'react';
import { CELL_COORDINATES_MAP } from '../../game/boardConfig';
import { LADDER_CONFIG } from '../../game/boardGeometry';

interface LadderSvgProps {
  startCell: number; // Bottom
  endCell: number;   // Top
  id: string;
}

export const LadderSvg: React.FC<LadderSvgProps> = ({ startCell, endCell, id }) => {
  const startCoord = CELL_COORDINATES_MAP[startCell];
  const endCoord = CELL_COORDINATES_MAP[endCell];

  if (!startCoord || !endCoord) return null;

  const ladderCfg = LADDER_CONFIG[id];
  const offsetX = ladderCfg?.offsetX || 0;
  const offsetY = ladderCfg?.offsetY || 0;

  const x1 = startCoord.x + offsetX;
  const y1 = startCoord.y + offsetY;
  const x2 = endCoord.x + offsetX;
  const y2 = endCoord.y + offsetY;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length === 0) return null;

  // Rail separation offset
  const railOffset = ladderCfg?.railWidth || 1.1;
  const nx = (-dy / length) * railOffset;
  const ny = (dx / length) * railOffset;

  // Left rail coordinates
  const lx1 = x1 + nx;
  const ly1 = y1 + ny;
  const lx2 = x2 + nx;
  const ly2 = y2 + ny;

  // Right rail coordinates
  const rx1 = x1 - nx;
  const ry1 = y1 - ny;
  const rx2 = x2 - nx;
  const ry2 = y2 - ny;

  // Calculate rungs
  const rungCount = ladderCfg?.rungCount || Math.max(3, Math.floor(length / 5));
  const rungs = [];

  for (let i = 1; i <= rungCount; i++) {
    const t = i / (rungCount + 1);
    const rlx = lx1 + (lx2 - lx1) * t;
    const rly = ly1 + (ly2 - ly1) * t;
    const rrx = rx1 + (rx2 - rx1) * t;
    const rry = ry1 + (ry2 - ry1) * t;

    rungs.push({
      key: `${id}_rung_${i}`,
      x1: rlx,
      y1: rly,
      x2: rrx,
      y2: rry,
    });
  }

  return (
    <g className="ladder-element pointer-events-none select-none">
      {/* Subtle Depth Shadow */}
      <line
        x1={`${lx1 + 0.3}%`}
        y1={`${ly1 + 0.5}%`}
        x2={`${lx2 + 0.3}%`}
        y2={`${ly2 + 0.5}%`}
        stroke="#2c221a"
        strokeWidth="2.8"
        strokeLinecap="round"
        opacity="0.3"
      />
      <line
        x1={`${rx1 + 0.3}%`}
        y1={`${ry1 + 0.5}%`}
        x2={`${rx2 + 0.3}%`}
        y2={`${ry2 + 0.5}%`}
        stroke="#2c221a"
        strokeWidth="2.8"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Main Wooden Rails (Deep Warm Timber) */}
      <line
        x1={`${lx1}%`}
        y1={`${ly1}%`}
        x2={`${lx2}%`}
        y2={`${ly2}%`}
        stroke="#78350f"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1={`${lx1}%`}
        y1={`${ly1}%`}
        x2={`${lx2}%`}
        y2={`${ly2}%`}
        stroke="#d97706"
        strokeWidth="0.8"
        strokeLinecap="round"
      />

      <line
        x1={`${rx1}%`}
        y1={`${ry1}%`}
        x2={`${rx2}%`}
        y2={`${ry2}%`}
        stroke="#78350f"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1={`${rx1}%`}
        y1={`${ry1}%`}
        x2={`${rx2}%`}
        y2={`${ry2}%`}
        stroke="#d97706"
        strokeWidth="0.8"
        strokeLinecap="round"
      />

      {/* Cross Wooden Rungs */}
      {rungs.map(r => (
        <React.Fragment key={r.key}>
          <line
            x1={`${r.x1}%`}
            y1={`${r.y1}%`}
            x2={`${r.x2}%`}
            y2={`${r.y2}%`}
            stroke="#92400e"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1={`${r.x1}%`}
            y1={`${r.y1}%`}
            x2={`${r.x2}%`}
            y2={`${r.y2}%`}
            stroke="#f59e0b"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
        </React.Fragment>
      ))}

      {/* Wooden Cap Accents at ends */}
      <circle cx={`${lx1}%`} cy={`${ly1}%`} r="1.4" fill="#78350f" />
      <circle cx={`${rx1}%`} cy={`${ry1}%`} r="1.4" fill="#78350f" />
      <circle cx={`${lx2}%`} cy={`${ly2}%`} r="1.4" fill="#78350f" />
      <circle cx={`${rx2}%`} cy={`${ry2}%`} r="1.4" fill="#78350f" />
    </g>
  );
};
