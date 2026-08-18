import React from 'react';
import { Link } from 'react-router-dom';
import { Dices, Sparkles } from 'lucide-react';
import { sound } from '../../game/soundEngine';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#382f27] bg-[#14110e] text-[#a8998a] text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-amber-600 flex items-center justify-center text-stone-950">
              <Dices className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-sm text-[#f5ebd9]">
              Snake & Ladder Online
            </span>
          </div>
          <p className="text-[#8c7e72] text-center md:text-left text-[11px] max-w-sm">
            Login-free online multiplayer Snake & Ladder board game. Play with friends or AI bots in your browser.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[#a8998a] font-medium">
          <Link
            to="/how-to-play"
            onClick={() => sound.playClick()}
            className="hover:text-[#fffdfa] transition-colors"
          >
            How to Play
          </Link>
          <Link
            to="/snake-and-ladder-online"
            onClick={() => sound.playClick()}
            className="hover:text-[#fffdfa] transition-colors"
          >
            Online Guide
          </Link>
          <Link
            to="/snake-and-ladder-with-friends"
            onClick={() => sound.playClick()}
            className="hover:text-[#fffdfa] transition-colors"
          >
            Play with Friends
          </Link>
          <Link
            to="/privacy-policy"
            onClick={() => sound.playClick()}
            className="hover:text-[#fffdfa] transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            onClick={() => sound.playClick()}
            className="hover:text-[#fffdfa] transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            to="/admin"
            onClick={() => sound.playClick()}
            className="hover:text-[#fffdfa] transition-colors"
          >
            Admin
          </Link>
        </div>

        <div className="text-[#6b5d50] text-[11px] flex items-center space-x-1">
          <span>Classic Board Game Reimagined</span>
          <Sparkles className="w-3 h-3 text-amber-500" />
        </div>
      </div>
    </footer>
  );
};
