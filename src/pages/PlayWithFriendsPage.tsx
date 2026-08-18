import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { Users, Sparkles, MessageCircle, Share2, PlusCircle, ArrowRight, DoorOpen } from 'lucide-react';
import { sound } from '../game/soundEngine';
import { CreateRoomModal } from '../components/modals/CreateRoomModal';
import { JoinRoomModal } from '../components/modals/JoinRoomModal';
import { NicknameModal } from '../components/modals/NicknameModal';
import { getOrCreateGuestSession, updateGuestNickname } from '../services/guestService';
import { MultiplayerService } from '../services/multiplayerService';
import { GameRules } from '../game/types';

export const PlayWithFriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(getOrCreateGuestSession());
  const [isNickModalOpen, setIsNickModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'create' | 'join' | null>(null);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": window.location.origin
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Play With Friends",
        "item": `${window.location.origin}/play-with-friends`
      }
    ]
  };

  const handleAction = (action: 'create' | 'join') => {
    sound.playClick();
    if (!session.nickname) {
      setPendingAction(action);
      setIsNickModalOpen(true);
    } else if (action === 'create') {
      setIsCreateModalOpen(true);
    } else {
      setIsJoinModalOpen(true);
    }
  };

  const handleNicknameConfirm = (nick: string) => {
    const updated = updateGuestNickname(nick);
    setSession(updated);
    setIsNickModalOpen(false);
    if (pendingAction === 'create') setIsCreateModalOpen(true);
    if (pendingAction === 'join') setIsJoinModalOpen(true);
    setPendingAction(null);
  };

  const handleCreateRoom = async (maxPlayers: 2 | 3 | 4, rules: GameRules) => {
    try {
      const room = await MultiplayerService.createRoom(
        session.guestId,
        session.nickname,
        'private',
        maxPlayers,
        rules
      );
      setIsCreateModalOpen(false);
      navigate(`/game/${room.roomCode}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleJoinRoom = async (roomCode: string) => {
    try {
      const room = await MultiplayerService.joinRoom(
        roomCode,
        session.guestId,
        session.nickname
      );
      setIsJoinModalOpen(false);
      navigate(`/game/${room.roomCode}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title="Play Snake and Ladder With Friends Online – Free Private Rooms"
        description="Play Snake and Ladder online with friends in real-time. Create private rooms, share instant WhatsApp links, and race to square 100 together with no login."
        canonicalPath="/play-with-friends"
        jsonLd={breadcrumbLd}
      />

      {/* Header */}
      <header className="space-y-4 text-center sm:text-left">
        <nav aria-label="Breadcrumb" className="text-xs text-[#a8998a] flex items-center justify-center sm:justify-start space-x-2">
          <Link to="/" className="hover:text-[#fffdfa]">Home</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">Play With Friends</span>
        </nav>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#29221b] text-amber-400 text-xs font-bold border border-[#523d2b]">
          <Users className="w-3.5 h-3.5" />
          <span>Real-Time Multiplayer</span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#fffdfa] tracking-tight">
          Play Snake and Ladder With Friends
        </h1>

        <p className="text-sm sm:text-base text-[#d6c9ba] max-w-2xl leading-relaxed">
          Create a private multiplayer room in seconds. Invite your friends, family, or colleagues with a direct link or 6-digit room code and enjoy classic tabletop competition anywhere.
        </p>

        {/* Quick Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => handleAction('create')}
            className="py-4 px-6 rounded-2xl btn-secondary text-white font-heading font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Private Game Room</span>
          </button>

          <button
            onClick={() => handleAction('join')}
            className="py-4 px-6 rounded-2xl bg-[#29221b] hover:bg-[#382e25] border border-[#523d2b] text-[#f5ebd9] font-heading font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95 shadow-md"
          >
            <DoorOpen className="w-5 h-5 text-amber-400" />
            <span>Join Existing Room</span>
          </button>
        </div>
      </header>

      {/* Guide Content */}
      <section className="space-y-6">
        <h2 className="font-heading font-black text-2xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
          How to Set Up a Multiplayer Game
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
            <span className="text-2xl font-black text-amber-500 font-mono">01</span>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">Create Room</h3>
            <p className="text-xs text-[#a8998a] leading-relaxed">
              Click create room and select your desired player capacity (2, 3, or 4 players) along with any custom rules.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
            <span className="text-2xl font-black text-amber-500 font-mono">02</span>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">Share Link</h3>
            <p className="text-xs text-[#a8998a] leading-relaxed">
              Copy the unique 6-digit room code or click "Share on WhatsApp" to send the direct game invitation link.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
            <span className="text-2xl font-black text-amber-500 font-mono">03</span>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">Roll &amp; Race</h3>
            <p className="text-xs text-[#a8998a] leading-relaxed">
              Once players join, the host clicks Start Game. Synchronized dice rolls and animations take over instantly!
            </p>
          </div>
        </div>
      </section>

      {/* Modals */}
      <NicknameModal
        isOpen={isNickModalOpen}
        initialNickname={session.nickname}
        onConfirm={handleNicknameConfirm}
        onClose={() => setIsNickModalOpen(false)}
      />

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onCreate={handleCreateRoom}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onJoin={handleJoinRoom}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </article>
  );
};
