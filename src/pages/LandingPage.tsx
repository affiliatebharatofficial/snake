import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Dices,
  Users,
  DoorOpen,
  Bot,
  Play,
  Sparkles,
  Zap,
  Shield,
  Smartphone,
  History,
  ArrowRight,
  HelpCircle,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
} from 'lucide-react';
import { sound } from '../game/soundEngine';
import { SEOHead } from '../components/common/SEOHead';
import { NicknameModal } from '../components/modals/NicknameModal';
import { CreateRoomModal } from '../components/modals/CreateRoomModal';
import { JoinRoomModal } from '../components/modals/JoinRoomModal';
import { QuickMatchModal } from '../components/modals/QuickMatchModal';
import { BotGameModal } from '../components/modals/BotGameModal';
import {
  getOrCreateGuestSession,
  updateGuestNickname,
  getRecentGames,
  RecentGame,
} from '../services/guestService';
import { MultiplayerService } from '../services/multiplayerService';
import { BotDifficulty, GameRules } from '../game/types';
import { GameBoard } from '../components/board/GameBoard';
import { useI18n } from '../i18n';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, getLocalizedUrl } = useI18n();
  const [session, setSession] = useState(getOrCreateGuestSession());
  const [recentGames] = useState<RecentGame[]>(getRecentGames());

  const [pendingAction, setPendingAction] = useState<
    'quick' | 'private' | 'join' | 'bot' | null
  >(null);
  const [isNickModalOpen, setIsNickModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isQuickMatchOpen, setIsQuickMatchOpen] = useState(false);
  const [isBotModalOpen, setIsBotModalOpen] = useState(false);

  const handleActionClick = (action: 'quick' | 'private' | 'join' | 'bot') => {
    sound.playClick();
    if (!session.nickname) {
      setPendingAction(action);
      setIsNickModalOpen(true);
    } else {
      triggerAction(action);
    }
  };

  const triggerAction = (action: 'quick' | 'private' | 'join' | 'bot') => {
    switch (action) {
      case 'quick':
        setIsQuickMatchOpen(true);
        break;
      case 'private':
        setIsCreateModalOpen(true);
        break;
      case 'join':
        setIsJoinModalOpen(true);
        break;
      case 'bot':
        setIsBotModalOpen(true);
        break;
    }
  };

  const handleNicknameConfirm = (nickname: string) => {
    const updated = updateGuestNickname(nickname);
    setSession(updated);
    setIsNickModalOpen(false);

    if (pendingAction) {
      triggerAction(pendingAction);
      setPendingAction(null);
    }
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
      navigate(getLocalizedUrl(`/game/${room.roomCode}`));
    } catch (err: any) {
      alert(err.message || t('errors.unknownError'));
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
      navigate(getLocalizedUrl(`/game/${room.roomCode}`));
    } catch (err: any) {
      alert(err.message || t('errors.invalidRoomCode'));
    }
  };

  const handleQuickMatchFound = async () => {
    try {
      const room = await MultiplayerService.createRoom(
        session.guestId,
        session.nickname,
        'quick',
        2,
        undefined,
        1,
        'medium'
      );
      setIsQuickMatchOpen(false);
      navigate(getLocalizedUrl(`/game/${room.roomCode}`));
    } catch (err) {
      setIsQuickMatchOpen(false);
    }
  };

  const handleStartBotGame = async (
    botCount: number,
    difficulty: BotDifficulty
  ) => {
    try {
      const room = await MultiplayerService.createRoom(
        session.guestId,
        session.nickname,
        'bot',
        (botCount + 1) as 2 | 3 | 4,
        undefined,
        botCount,
        difficulty
      );
      setIsBotModalOpen(false);
      navigate(getLocalizedUrl(`/game/${room.roomCode}`));
    } catch (err: any) {
      alert(err.message || t('errors.unknownError'));
    }
  };

  const showcasePlayers = [
    {
      id: 'show_1',
      nickname: 'Player 1',
      playerNumber: 1 as const,
      color: 'red' as const,
      position: 84,
      isConnected: true,
      isBot: false,
      isReady: true,
      joinedAt: 0,
      lastSeenAt: 0,
    },
    {
      id: 'show_2',
      nickname: 'Player 2',
      playerNumber: 2 as const,
      color: 'blue' as const,
      position: 42,
      isConnected: true,
      isBot: false,
      isReady: true,
      joinedAt: 0,
      lastSeenAt: 0,
    },
  ];

  // Structured Data (JSON-LD)
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Snake & Ladder Online",
      "url": window.location.origin,
      "description": t('seo.homeDesc'),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": t('home.faq1Q'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('home.faq1A')
          }
        },
        {
          "@type": "Question",
          "name": t('home.faq2Q'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('home.faq2A')
          }
        },
        {
          "@type": "Question",
          "name": t('home.faq3Q'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('home.faq3A')
          }
        },
        {
          "@type": "Question",
          "name": t('home.faq4Q'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('home.faq4A')
          }
        },
        {
          "@type": "Question",
          "name": t('home.faq5Q'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('home.faq5A')
          }
        }
      ]
    }
  ];

  return (
    <main className="w-full min-h-screen flex flex-col">
      <SEOHead
        title={t('seo.homeTitle')}
        description={t('seo.homeDesc')}
        canonicalPath="/"
        jsonLd={structuredData}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero Content & CTA */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#29221b] border border-[#523d2b] text-amber-400 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('home.heroBadge')}</span>
            </div>

            {/* Main Single Primary H1 */}
            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-[#fffdfa] tracking-tight leading-[1.1]">
              {t('home.title')}
            </h1>

            <p className="text-base sm:text-lg text-[#d6c9ba] max-w-xl leading-relaxed">
              {t('home.heroSubtitle')}
            </p>

            {/* Action Cards Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <button
                onClick={() => handleActionClick('quick')}
                className="p-4 rounded-2xl btn-primary text-white flex items-center justify-between group transition-all cursor-pointer active:scale-95 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center">
                    <Dices className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-heading font-extrabold text-base leading-tight">
                      {t('home.quickPlayBtn')}
                    </div>
                    <div className="text-[11px] text-amber-100 font-medium">
                      {t('common.playNow')}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleActionClick('private')}
                className="p-4 rounded-2xl btn-secondary text-white flex items-center justify-between group transition-all cursor-pointer active:scale-95 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-heading font-extrabold text-base leading-tight">
                      {t('home.createRoomBtn')}
                    </div>
                    <div className="text-[11px] text-emerald-100 font-medium">
                      {t('playWithFriends.title')}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleActionClick('join')}
                className="p-4 rounded-2xl bg-[#29221b] hover:bg-[#332b23] border border-[#523d2b] text-[#f5ebd9] flex items-center justify-between group transition-all cursor-pointer active:scale-95 text-left shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1c1814] flex items-center justify-center text-amber-400">
                    <DoorOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-heading font-extrabold text-base leading-tight">
                      {t('home.joinRoomBtn')}
                    </div>
                    <div className="text-[11px] text-[#a8998a] font-medium">
                      {t('game.roomCode')}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#a8998a] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleActionClick('bot')}
                className="p-4 rounded-2xl bg-[#29221b] hover:bg-[#332b23] border border-[#523d2b] text-[#f5ebd9] flex items-center justify-between group transition-all cursor-pointer active:scale-95 text-left shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1c1814] flex items-center justify-center text-amber-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-heading font-extrabold text-base leading-tight">
                      {t('home.botMatchBtn')}
                    </div>
                    <div className="text-[11px] text-[#a8998a] font-medium">
                      AI Offline / Solo
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#a8998a] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Board Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center z-10">
            <figure className="w-full max-w-[420px] relative">
              <GameBoard players={showcasePlayers} currentTurnGuestId="show_1" />
              <figcaption className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#241f1a] border border-[#523d2b] py-1.5 px-4 rounded-full text-xs font-bold text-[#f5ebd9] shadow-xl flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t('home.title')} (10×10)</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Live Stats Strip */}
      <section className="border-y border-[#382f27] bg-[#211c18] py-5 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-2">
            <div className="font-heading font-black text-2xl sm:text-3xl text-emerald-400">1,840+</div>
            <div className="text-xs text-[#a8998a] font-medium mt-0.5">{t('home.onlinePlayers')}</div>
          </div>
          <div className="p-2">
            <div className="font-heading font-black text-2xl sm:text-3xl text-amber-400">520+</div>
            <div className="text-xs text-[#a8998a] font-medium mt-0.5">{t('home.activePlayers')}</div>
          </div>
          <div className="p-2">
            <div className="font-heading font-black text-2xl sm:text-3xl text-[#d4a373]">2–4</div>
            <div className="text-xs text-[#a8998a] font-medium mt-0.5">{t('game.playerCount')}</div>
          </div>
          <div className="p-2">
            <div className="font-heading font-black text-2xl sm:text-3xl text-amber-300">100%</div>
            <div className="text-xs text-[#a8998a] font-medium mt-0.5">Free Web Game</div>
          </div>
        </div>
      </section>

      {/* Recent Local Games */}
      {recentGames.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-8 w-full">
          <div className="flex items-center space-x-2 mb-4">
            <History className="w-4 h-4 text-amber-400" />
            <h3 className="font-heading font-bold text-base text-[#f5ebd9]">
              Recent Games on this Browser
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentGames.slice(0, 4).map(g => (
              <div
                key={g.id}
                className="p-3 rounded-xl bg-[#241f1a] border border-[#3d342c] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-[#f5ebd9]">Room {g.roomCode}</span>
                  <span className="text-[#8c7e72] text-[10px] ml-2">{new Date(g.date).toLocaleDateString()}</span>
                  <div className="text-[11px] text-[#a8998a] mt-0.5">
                    Winner: <strong className="text-[#f5ebd9]">{g.winnerNickname}</strong>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    g.isWon ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-[#1c1814] text-[#8c7e72]'
                  }`}
                >
                  {g.isWon ? '🏆 Victory' : `Square ${g.finalPosition}`}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Narrative and Informative Sections */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-[#d6c9ba]">
        
        {/* Section 1: Play Snake and Ladder Online */}
        <article className="space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
            {t('home.seoArticleTitle')}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            {t('home.seoArticleP1')}
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            {t('home.seoArticleP2')}
          </p>
        </article>

        {/* Section 2: How to Play in 4 Easy Steps */}
        <article className="space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
            {t('home.howToPlayQuick')}
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm">
            <li className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c] space-y-1">
              <strong className="text-[#fffdfa] block text-sm">1. {t('howToPlay.step1Title')}</strong>
              <span>{t('home.howToPlayStep1')}</span>
            </li>
            <li className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c] space-y-1">
              <strong className="text-[#fffdfa] block text-sm">2. {t('howToPlay.step2Title')}</strong>
              <span>{t('home.howToPlayStep2')}</span>
            </li>
            <li className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c] space-y-1">
              <strong className="text-[#fffdfa] block text-sm">3. {t('howToPlay.step3Title')}</strong>
              <span>{t('home.howToPlayStep3')}</span>
            </li>
            <li className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c] space-y-1">
              <strong className="text-[#fffdfa] block text-sm">4. {t('howToPlay.step4Title')}</strong>
              <span>{t('home.howToPlayStep4')}</span>
            </li>
          </ol>
        </article>

        {/* Section 3: Why Play Snake and Ladder Online? */}
        <article className="space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
            {t('home.featuresTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading font-bold text-base text-[#fffdfa]">{t('home.feature1Title')}</h3>
              <p className="text-xs text-[#a8998a] leading-relaxed">
                {t('home.feature1Desc')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <h3 className="font-heading font-bold text-base text-[#fffdfa]">{t('home.feature2Title')}</h3>
              <p className="text-xs text-[#a8998a] leading-relaxed">
                {t('home.feature2Desc')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
              <Smartphone className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading font-bold text-base text-[#fffdfa]">{t('home.feature3Title')}</h3>
              <p className="text-xs text-[#a8998a] leading-relaxed">
                {t('home.feature3Desc')}
              </p>
            </div>
          </div>
        </article>

        {/* Section 4: FAQ Section */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <HelpCircle className="w-6 h-6 text-amber-400" />
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#fffdfa]">
              {t('home.faqTitle')}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c]">
              <h3 className="font-bold text-[#fffdfa] text-sm sm:text-base">{t('home.faq1Q')}</h3>
              <p className="text-xs sm:text-sm text-[#a8998a] mt-1.5 leading-relaxed">
                {t('home.faq1A')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c]">
              <h3 className="font-bold text-[#fffdfa] text-sm sm:text-base">{t('home.faq2Q')}</h3>
              <p className="text-xs sm:text-sm text-[#a8998a] mt-1.5 leading-relaxed">
                {t('home.faq2A')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c]">
              <h3 className="font-bold text-[#fffdfa] text-sm sm:text-base">{t('home.faq3Q')}</h3>
              <p className="text-xs sm:text-sm text-[#a8998a] mt-1.5 leading-relaxed">
                {t('home.faq3A')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c]">
              <h3 className="font-bold text-[#fffdfa] text-sm sm:text-base">{t('home.faq4Q')}</h3>
              <p className="text-xs sm:text-sm text-[#a8998a] mt-1.5 leading-relaxed">
                {t('home.faq4A')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c]">
              <h3 className="font-bold text-[#fffdfa] text-sm sm:text-base">{t('home.faq5Q')}</h3>
              <p className="text-xs sm:text-sm text-[#a8998a] mt-1.5 leading-relaxed">
                {t('home.faq5A')}
              </p>
            </div>
          </div>
        </section>

        {/* Safe Ad Container */}
        <div className="p-4 rounded-xl bg-[#1c1814] border border-dashed border-[#382f27] text-center text-[#6b5d50] text-xs">
          <span>Advertisement</span>
        </div>
      </section>

      {/* Modals */}
      <NicknameModal
        isOpen={isNickModalOpen}
        initialNickname={session.nickname}
        onConfirm={handleNicknameConfirm}
        onClose={() => {
          setIsNickModalOpen(false);
          setPendingAction(null);
        }}
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

      <QuickMatchModal
        isOpen={isQuickMatchOpen}
        onMatchFound={handleQuickMatchFound}
        onCancel={() => setIsQuickMatchOpen(false)}
      />

      <BotGameModal
        isOpen={isBotModalOpen}
        onStart={handleStartBotGame}
        onClose={() => setIsBotModalOpen(false)}
      />
    </main>
  );
};
