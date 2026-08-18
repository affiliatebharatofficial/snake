import React from 'react';
import { GameEvent } from '../../game/types';
import { ScrollText, Trophy, Dices, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';

interface GameEventLogProps {
  events: GameEvent[];
}

export const GameEventLog: React.FC<GameEventLogProps> = ({ events }) => {
  const getEventIcon = (type: GameEvent['type']) => {
    switch (type) {
      case 'win':
        return <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'ladder':
        return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case 'snake':
        return <ArrowDownRight className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
      case 'roll':
        return <Dices className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'entry':
        return <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />;
      default:
        return <span className="w-1.5 h-1.5 rounded-full bg-[#786c62] shrink-0" />;
    }
  };

  return (
    <div className="w-full flex flex-col p-3 rounded-2xl bg-[#241f1a] border border-[#3d342c] shadow-lg max-h-[160px] sm:max-h-[180px]">
      <div className="flex items-center space-x-1.5 pb-2 border-b border-[#3d342c]">
        <ScrollText className="w-4 h-4 text-amber-500" />
        <h4 className="font-heading font-bold text-xs sm:text-sm text-[#f5ebd9]">
          Game Events
        </h4>
      </div>

      <div className="flex flex-col space-y-1.5 mt-2 overflow-y-auto pr-1">
        {events.length === 0 ? (
          <p className="text-xs text-[#8c7e72] italic py-2 text-center">No game events yet.</p>
        ) : (
          events.map(evt => (
            <div
              key={evt.id}
              className="flex items-center space-x-2 text-[11px] sm:text-xs py-1 px-2 rounded-lg bg-[#1c1814]/80 border border-[#382f27] text-[#e0d6cb] leading-tight"
            >
              {getEventIcon(evt.type)}
              <span className="truncate">{evt.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
