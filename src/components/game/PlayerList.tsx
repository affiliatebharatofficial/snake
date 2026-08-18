import React from 'react';
import { Player } from '../../game/types';
import { Bot, User, Wifi, WifiOff, Crown } from 'lucide-react';

interface PlayerListProps {
  players: Player[];
  currentTurnGuestId?: string;
  myGuestId?: string;
  hostGuestId?: string;
}

const PLAYER_BADGE_COLORS: Record<string, { bg: string; border: string }> = {
  red: { bg: '#dc2626', border: '#991b1b' },
  blue: { bg: '#2563eb', border: '#1e40af' },
  green: { bg: '#16a34a', border: '#166534' },
  yellow: { bg: '#d97706', border: '#92400e' },
};

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  currentTurnGuestId,
  myGuestId,
  hostGuestId,
}) => {
  return (
    <div className="w-full flex flex-col space-y-2 p-3 sm:p-4 rounded-2xl bg-[#241f1a] border border-[#3d342c] shadow-lg">
      <div className="flex items-center justify-between pb-2 border-b border-[#3d342c]">
        <h3 className="font-heading font-bold text-xs sm:text-sm text-[#f5ebd9] flex items-center space-x-1.5">
          <User className="w-4 h-4 text-amber-500" />
          <span>Players ({players.length})</span>
        </h3>
        <span className="text-[10px] font-semibold text-[#a8998a] bg-[#1a1613] px-2 py-0.5 rounded-full">
          Goal: 100
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
        {players.map(player => {
          const isTurn = player.id === currentTurnGuestId;
          const isMe = player.id === myGuestId;
          const isHost = player.id === hostGuestId;
          const badge = PLAYER_BADGE_COLORS[player.color] || PLAYER_BADGE_COLORS.red;

          return (
            <div
              key={player.id}
              className={`relative flex items-center justify-between p-2 rounded-xl border transition-all ${
                isTurn
                  ? 'bg-[#2f2721] border-amber-500/70 shadow-sm scale-[1.01]'
                  : 'bg-[#1c1814]/70 border-[#382f27]'
              }`}
            >
              <div className="flex items-center space-x-2 min-w-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white shadow-sm shrink-0 border"
                  style={{ backgroundColor: badge.bg, borderColor: badge.border }}
                >
                  {player.isBot ? (
                    <Bot className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <span className="text-xs font-black">
                      {player.nickname.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center space-x-1">
                    <span
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        isMe ? 'text-amber-300' : 'text-[#f5ebd9]'
                      }`}
                    >
                      {player.nickname}
                    </span>
                    {isMe && (
                      <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-bold">
                        YOU
                      </span>
                    )}
                    {isHost && (
                      <span title="Host">
                        <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#9c8e80] flex items-center space-x-1">
                    <span>Square: <strong className="text-[#f5ebd9]">{player.position}</strong></span>
                    {player.isConnected ? (
                      <Wifi className="w-2.5 h-2.5 text-emerald-400 ml-1" />
                    ) : (
                      <WifiOff className="w-2.5 h-2.5 text-rose-400 ml-1" />
                    )}
                  </span>
                </div>
              </div>

              {isTurn && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-stone-950 shrink-0">
                  TURN
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
