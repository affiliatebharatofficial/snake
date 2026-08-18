import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dices, User, Edit2, Shield, BookOpen, Menu, X } from 'lucide-react';
import { SoundToggle } from './SoundToggle';
import { NicknameModal } from '../modals/NicknameModal';
import { getOrCreateGuestSession, updateGuestNickname } from '../../services/guestService';
import { sound } from '../../game/soundEngine';

export const Navbar: React.FC = () => {
  const [session, setSession] = useState(getOrCreateGuestSession());
  const [isNickModalOpen, setIsNickModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleUpdateNickname = (newNick: string) => {
    const updated = updateGuestNickname(newNick);
    setSession(updated);
    setIsNickModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#382f27] bg-[#1a1613]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          to="/"
          onClick={() => sound.playClick()}
          className="flex items-center space-x-2.5 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 border border-amber-400/50 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Dices className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-base sm:text-lg text-[#fffdfa] tracking-tight leading-none group-hover:text-amber-300 transition-colors">
              Snake & Ladder
            </span>
            <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase leading-tight">
              Online Board Game
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs sm:text-sm font-semibold text-[#d6c9ba]">
          <Link
            to="/how-to-play"
            onClick={() => sound.playClick()}
            className="hover:text-[#fffdfa] transition-colors flex items-center space-x-1.5"
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>How to Play</span>
          </Link>
          <Link
            to="/snake-and-ladder-rules"
            onClick={() => sound.playClick()}
            className="hover:text-[#fffdfa] transition-colors"
          >
            Rules &amp; Board
          </Link>
          <Link
            to="/about"
            onClick={() => sound.playClick()}
            className="hover:text-[#fffdfa] transition-colors"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => sound.playClick()}
            className="hover:text-[#fffdfa] transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Right Controls: Sound & Guest Badge */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <SoundToggle />

          {/* Guest Identity Chip */}
          <button
            onClick={() => {
              sound.playClick();
              setIsNickModalOpen(true);
            }}
            className="flex items-center space-x-1.5 py-1.5 px-3 rounded-xl bg-[#29221b] hover:bg-[#382e25] border border-[#523d2b] text-[#f5ebd9] transition-all text-xs font-bold cursor-pointer"
            title="Click to edit your nickname"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="max-w-[90px] sm:max-w-[120px] truncate">
              {session.nickname || 'Guest Player'}
            </span>
            <Edit2 className="w-2.5 h-2.5 text-[#a8998a]" />
          </button>

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#29221b] border border-[#523d2b] text-[#d6c9ba]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#382f27] bg-[#211c18] px-4 py-4 space-y-3">
          <Link
            to="/how-to-play"
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(false);
            }}
            className="block text-sm font-semibold text-[#d6c9ba] py-1.5 hover:text-[#fffdfa]"
          >
            How to Play
          </Link>
          <Link
            to="/snake-and-ladder-rules"
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(false);
            }}
            className="block text-sm font-semibold text-[#d6c9ba] py-1.5 hover:text-[#fffdfa]"
          >
            Rules &amp; Board
          </Link>
          <Link
            to="/about"
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(false);
            }}
            className="block text-sm font-semibold text-[#d6c9ba] py-1.5 hover:text-[#fffdfa]"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(false);
            }}
            className="block text-sm font-semibold text-[#d6c9ba] py-1.5 hover:text-[#fffdfa]"
          >
            Contact
          </Link>
        </div>
      )}

      <NicknameModal
        isOpen={isNickModalOpen}
        initialNickname={session.nickname}
        onConfirm={handleUpdateNickname}
        onClose={() => setIsNickModalOpen(false)}
        title="Change Your Nickname"
      />
    </header>
  );
};
