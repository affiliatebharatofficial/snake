import React from 'react';
import { Link } from 'react-router-dom';
import { Dices, Sparkles, Mail, ShieldCheck, FileText, Info, BookOpen, HelpCircle } from 'lucide-react';
import { sound } from '../../game/soundEngine';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[#382f27] bg-[#14110e] text-[#a8998a] text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#29221b]">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link
              to="/"
              onClick={() => sound.playClick()}
              className="flex items-center space-x-2.5 group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md">
                <Dices className="w-4 h-4" />
              </div>
              <span className="font-heading font-extrabold text-sm text-[#f5ebd9] group-hover:text-amber-300 transition-colors">
                Snake &amp; Ladder
              </span>
            </Link>
            <p className="text-[#8c7e72] text-xs leading-relaxed">
              Free, browser-based online multiplayer Snake and Ladder game. Play instantly with friends, family, or smart AI bots with zero registration required.
            </p>
            <div className="text-[11px] text-[#6b5d50] flex items-center space-x-1.5 pt-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Real-time Multiplayer Experience</span>
            </div>
          </div>

          {/* Col 2: Quick Play & Guides */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#d6c9ba]">
              Game &amp; Guides
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <Dices className="w-3.5 h-3.5 text-amber-500" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/play"
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors"
                >
                  Play Snake and Ladder
                </Link>
              </li>
              <li>
                <Link
                  to="/how-to-play"
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                  <span>How to Play</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/snake-and-ladder-rules"
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Snake and Ladder Rules</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: About & Contact */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#d6c9ba]">
              Company &amp; Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-amber-500" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <a
                  href="mailto:fkdigitalmedia@gmail.com"
                  className="text-[11px] text-[#8c7e72] hover:text-amber-400 transition-colors block break-all font-mono"
                >
                  fkdigitalmedia@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#d6c9ba]">
              Legal &amp; Trust
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li className="text-[11px] text-[#736557] pt-1">
                Guest gameplay is anonymous and privacy-friendly.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6b5d50] gap-3">
          <p>© {currentYear} Snake &amp; Ladder Online. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Designed for seamless family board gaming across all modern desktop and mobile browsers.
          </p>
        </div>
      </div>
    </footer>
  );
};
