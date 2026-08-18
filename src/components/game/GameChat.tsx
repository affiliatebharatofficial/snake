import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../game/types';
import { MessageSquare, Send } from 'lucide-react';
import { sound } from '../../game/soundEngine';

interface GameChatProps {
  chat: ChatMessage[];
  myGuestId: string;
  onSendMessage: (msg: string) => void;
}

const QUICK_EMOJIS = ['🎲', '😂', '😱', '🔥', '👏', '🐍', '🪜', '🏆'];

export const GameChat: React.FC<GameChatProps> = ({
  chat,
  myGuestId,
  onSendMessage,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    sound.playClick();
    onSendMessage(input.trim());
    setInput('');
  };

  const handleEmojiClick = (emoji: string) => {
    sound.playClick();
    onSendMessage(emoji);
  };

  return (
    <div className="w-full flex flex-col p-3 rounded-2xl bg-[#241f1a] border border-[#3d342c] shadow-lg h-[210px] sm:h-[230px]">
      <div className="flex items-center justify-between pb-1.5 border-b border-[#3d342c]">
        <div className="flex items-center space-x-1.5">
          <MessageSquare className="w-4 h-4 text-amber-500" />
          <h4 className="font-heading font-bold text-xs sm:text-sm text-[#f5ebd9]">
            Room Chat
          </h4>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto space-y-1.5 py-2 pr-1">
        {chat.map((c, idx) => {
          const isMe = c.guestId === myGuestId;
          const isSys = c.isSystem;

          if (isSys) {
            return (
              <div key={`${c.id}_${idx}`} className="text-center my-1">
                <span className="text-[10px] text-[#a8998a] bg-[#1a1613] px-2 py-0.5 rounded-full border border-[#382f27]">
                  {c.message}
                </span>
              </div>
            );
          }

          return (
            <div
              key={`${c.id}_${idx}`}
              className={`flex flex-col text-xs max-w-[85%] rounded-xl px-2.5 py-1.5 ${
                isMe
                  ? 'ml-auto bg-[#3e2c1e] border border-amber-600/30 text-[#fffdfa]'
                  : 'mr-auto bg-[#1c1814] border border-[#382f27] text-[#e0d6cb]'
              }`}
            >
              <div className="flex items-center space-x-1.5 text-[10px] font-bold mb-0.5">
                <span className={isMe ? 'text-amber-400' : 'text-[#c2b2a3]'}>
                  {c.nickname}
                </span>
                <span className="text-[9px] text-[#786c62]">
                  {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <span className="break-words text-xs">{c.message}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reaction Emojis Bar */}
      <div className="flex items-center space-x-1 py-1 overflow-x-auto no-scrollbar">
        {QUICK_EMOJIS.map(emoji => (
          <button
            key={emoji}
            onClick={() => handleEmojiClick(emoji)}
            type="button"
            className="text-sm px-1.5 py-0.5 rounded hover:bg-[#332b24] transition-transform active:scale-90"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex items-center space-x-2 pt-1 border-t border-[#3d342c]">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Send a message..."
          maxLength={200}
          className="flex-1 bg-[#1a1613] border border-[#42372e] rounded-lg px-2.5 py-1.5 text-xs text-[#f5ebd9] placeholder-[#786c62] focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
