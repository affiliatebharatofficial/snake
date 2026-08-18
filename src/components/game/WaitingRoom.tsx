import React, { useState } from 'react';
import { GameRoom } from '../../game/types';
import { Copy, Check, Share2, Play, Bot, Crown, ArrowLeft, MessageCircle } from 'lucide-react';
import { sound } from '../../game/soundEngine';

interface WaitingRoomProps {
  room: GameRoom;
  myGuestId: string;
  onStartGame: () => void;
  onAddBot?: () => void;
  onLeaveRoom: () => void;
}

const PLAYER_BADGE_COLORS: Record<string, { bg: string; border: string }> = {
  red: { bg: '#dc2626', border: '#991b1b' },
  blue: { bg: '#2563eb', border: '#1e40af' },
  green: { bg: '#16a34a', border: '#166534' },
  yellow: { bg: '#d97706', border: '#92400e' },
};

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
  room,
  myGuestId,
  onStartGame,
  onAddBot,
  onLeaveRoom,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isHost = room.hostGuestId === myGuestId;
  const canStart = room.players.length >= 2 && isHost;
  const inviteUrl = `${window.location.origin}/game/${room.roomCode}`;

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(room.roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    sound.playClick();
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = () => {
    sound.playClick();
    const text = encodeURIComponent(
      `🎲 Join my Snake & Ladder online game! Click to play with me: ${inviteUrl} (Room Code: ${room.roomCode})`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#29221b] border-2 border-[#523d2b] shadow-2xl flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onLeaveRoom}
          className="flex items-center space-x-1.5 text-xs text-[#a8998a] hover:text-[#f5ebd9] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Room</span>
        </button>

        <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
          Waiting for Players ({room.players.length}/{room.maxPlayers})
        </span>
      </div>

      {/* Room Code Card */}
      <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#1c1814] border border-[#382f27] text-center space-y-2">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#a8998a] font-heading">
          Room Code
        </span>
        <div className="flex items-center space-x-3">
          <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-widest">
            {room.roomCode}
          </span>
          <button
            onClick={handleCopyCode}
            className="p-2 rounded-xl bg-[#382e25] hover:bg-[#473b30] text-[#f5ebd9] transition-colors cursor-pointer"
            title="Copy Room Code"
          >
            {copiedCode ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-xs text-[#8c7e72]">Share this code or invitation link with friends to play</p>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleCopyLink}
          className="py-3 px-4 rounded-xl bg-[#382e25] hover:bg-[#473b30] border border-[#524336] text-[#f5ebd9] text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
          <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
        </button>

        <button
          onClick={handleWhatsAppShare}
          className="py-3 px-4 rounded-xl bg-[#1b382b] hover:bg-[#234737] border border-[#2d5f47] text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>Share on WhatsApp</span>
        </button>
      </div>

      {/* Players List Grid */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#a8998a] uppercase tracking-wider">Players in Room</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {room.players.map(player => {
            const isMe = player.id === myGuestId;
            const isPlayerHost = player.id === room.hostGuestId;
            const badge = PLAYER_BADGE_COLORS[player.color] || PLAYER_BADGE_COLORS.red;

            return (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#1c1814] border border-[#382f27]"
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow border"
                    style={{ backgroundColor: badge.bg, borderColor: badge.border }}
                  >
                    {player.isBot ? <Bot className="w-4 h-4" /> : player.nickname.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-[#f5ebd9] flex items-center space-x-1">
                      <span>{player.nickname}</span>
                      {isPlayerHost && (
                        <span title="Host">
                          <Crown className="w-3.5 h-3.5 text-amber-400" />
                        </span>
                      )}
                      {isMe && <span className="text-[9px] text-amber-300 bg-amber-500/20 px-1 rounded">YOU</span>}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Ready</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty Placeholders */}
          {Array.from({ length: room.maxPlayers - room.players.length }).map((_, i) => (
            <div
              key={`empty_${i}`}
              className="flex items-center justify-between p-3 rounded-xl border border-dashed border-[#473a2e] text-[#6b5d50] bg-[#1c1814]/40"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full border border-dashed border-[#57473a] flex items-center justify-center text-xs">
                  +
                </div>
                <span className="text-xs italic">Waiting for player...</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-[#3d342c]">
        {onAddBot && isHost && room.players.length < room.maxPlayers && (
          <button
            onClick={() => {
              sound.playClick();
              onAddBot();
            }}
            className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-[#382e25] hover:bg-[#473b30] border border-[#524336] text-[#f5ebd9] text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span>+ Add Bot</span>
          </button>
        )}

        {isHost ? (
          <button
            onClick={() => {
              sound.playClick();
              onStartGame();
            }}
            disabled={!canStart}
            className={`w-full flex-1 py-3.5 px-6 rounded-xl font-heading font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all ${
              canStart
                ? 'btn-secondary text-white cursor-pointer'
                : 'bg-[#1f1a16] text-[#6b5d50] cursor-not-allowed border border-[#382f28]'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{canStart ? 'Start Game' : 'Waiting for at least 2 players...'}</span>
          </button>
        ) : (
          <div className="w-full py-3 text-center text-xs text-[#a8998a] italic">
            Waiting for host ({room.players[0]?.nickname || 'Host'}) to start the game...
          </div>
        )}
      </div>
    </div>
  );
};
