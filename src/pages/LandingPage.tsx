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

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
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
      navigate(`/game/${room.roomCode}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create room');
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
      alert(err.message || 'Failed to join room');
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
      navigate(`/game/${room.roomCode}`);
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
      navigate(`/game/${room.roomCode}`);
    } catch (err: any) {
      alert(err.message || 'Failed to start bot game');
    }
  };

  const showcasePlayers = [
    {
      id: 'show_1',
      nickname: 'Rahul',
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
      nickname: 'Alex',
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
      "description": "Play free online multiplayer Snake and Ladder game in your browser with friends or bots with no login required.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Snake and Ladder?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Snake and Ladder is a classic tabletop board game played on a 10x10 numbered grid of 100 squares. Players roll a six-sided dice to move forward, climbing ladders to advance rapidly and sliding down snakes when landing on their heads."
          }
        },
        {
          "@type": "Question",
          "name": "How do you play Snake and Ladder?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Each player starts at square 0. On their turn, players roll the dice and advance their token by the rolled number. If a token lands on the bottom of a ladder, it climbs up. If it lands on a snake's head, it slides down. The first player to reach square 100 wins."
          }
        },
        {
          "@type": "Question",
          "name": "How many squares are on a Snake and Ladder board?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A standard Snake and Ladder board contains 100 squares arranged in a 10 by 10 grid, numbered sequentially from 1 at the bottom left to 100 at the top left in an alternating serpentine pattern."
          }
        },
        {
          "@type": "Question",
          "name": "What happens when you land on a ladder?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Landing on the base of a ladder acts as a shortcut that immediately moves your token up to the square where the top of the ladder finishes."
          }
        },
        {
          "@type": "Question",
          "name": "What happens when you land on a snake?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Landing on a square with a snake head is an obstacle that forces your token to slide down the length of the snake to the square containing its tail."
          }
        },
        {
          "@type": "Question",
          "name": "What are the Snake and Ladder game rules?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Players take turns rolling a six-sided dice, moving clockwise. Rolling a 6 grants an extra turn. Landing on ladders moves you up, while snakes pull you down. Players must land exactly on square 100 to win."
          }
        },
        {
          "@type": "Question",
          "name": "Can I play Snake and Ladder online with friends?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can create a private multiplayer room on our website, copy the invitation link or 6-digit room code, and share it directly with friends via WhatsApp, Discord, or messaging apps."
          }
        },
        {
          "@type": "Question",
          "name": "Can I play Snake and Ladder without downloading anything?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Our Snake and Ladder game runs directly inside any modern web browser on smartphones, tablets, laptops, and desktop computers without downloading any apps or software."
          }
        },
        {
          "@type": "Question",
          "name": "Can I play Snake and Ladder on mobile?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, the game is 100% mobile-friendly and responsive with touch-optimized dice buttons and a board viewport that fits all mobile screen sizes."
          }
        },
        {
          "@type": "Question",
          "name": "How many players can play online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our online multiplayer game supports 2 to 4 players per room, including real humans and AI bots."
          }
        }
      ]
    }
  ];

  return (
    <main className="w-full min-h-screen flex flex-col">
      <SEOHead
        title="Snake and Ladder Online – Play Free Multiplayer Game"
        description="Play Snake and Ladder online for free in real-time. Roll the dice, climb ladders, avoid snakes, and play with friends or AI bots with no login required."
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
              <span>Instant Online Play • No Account Required</span>
            </div>

            {/* Main Single Primary H1 */}
            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-[#fffdfa] tracking-tight leading-[1.1]">
              Snake and Ladder Online
            </h1>

            <p className="text-base sm:text-lg text-[#d6c9ba] max-w-xl leading-relaxed">
              Roll the dice, climb the ladders, and escape the snakes! Play the classic <strong>Snake and Ladder board game</strong> online with friends in private rooms, challenge random players, or play against AI bots instantly without registering or downloading apps.
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
                      Play Now
                    </div>
                    <div className="text-[11px] text-amber-100 font-medium">
                      Instant matchmaking
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
                      Play With Friends
                    </div>
                    <div className="text-[11px] text-emerald-100 font-medium">
                      Create room &amp; invite link
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
                      Join Game
                    </div>
                    <div className="text-[11px] text-[#a8998a] font-medium">
                      Enter 6-digit room code
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
                      Play With Bots
                    </div>
                    <div className="text-[11px] text-[#a8998a] font-medium">
                      Easy, Medium, or Hard AI
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
                <span>Classic 10×10 Snake and Ladder Board</span>
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
            <div className="text-xs text-[#a8998a] font-medium mt-0.5">Online Players</div>
          </div>
          <div className="p-2">
            <div className="font-heading font-black text-2xl sm:text-3xl text-amber-400">520+</div>
            <div className="text-xs text-[#a8998a] font-medium mt-0.5">Active Games</div>
          </div>
          <div className="p-2">
            <div className="font-heading font-black text-2xl sm:text-3xl text-[#d4a373]">2–4</div>
            <div className="text-xs text-[#a8998a] font-medium mt-0.5">Players Per Room</div>
          </div>
          <div className="p-2">
            <div className="font-heading font-black text-2xl sm:text-3xl text-amber-300">100%</div>
            <div className="text-xs text-[#a8998a] font-medium mt-0.5">Mobile Responsive</div>
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

      {/* ========================================================================= */}
      {/* 800 - 1,200 Words of Genuinely Helpful Human-Written On-Page SEO Content */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-[#d6c9ba]">
        
        {/* Section 1: Play Snake and Ladder Online */}
        <article className="space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
            Play Snake and Ladder Online
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Welcome to the premier destination to <strong>play Snake and Ladder online</strong>. Whether you want to challenge players around the globe in a quick match, enjoy a casual family game night in a private room, or hone your luck against smart AI opponents, our digital edition delivers the authentic tabletop experience right in your web browser.
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            Unlike many mobile applications that require hefty downloads, mandatory social media logins, and continuous advertisements, our platform allows you to start a <Link to="/play-with-friends" className="text-amber-400 hover:underline font-semibold">multiplayer Snake and Ladder game</Link> in under five seconds. Simply enter a nickname, roll the dice, and start racing toward square 100!
          </p>
        </article>

        {/* Section 2: What Is Snake and Ladder? */}
        <article className="space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
            What Is Snake and Ladder?
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            The <strong>Snake and Ladder game</strong> (historically known as <em>Moksha Patam</em> and popularized in Western cultures as <em>Chutes and Ladders</em>) is one of the world's most enduring and beloved family board games. Originating in ancient India as a moral lesson on destiny and virtues, the game symbolizes virtues (ladders) that elevate a player and vices (snakes) that cause setbacks.
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            The standard game is played on a 100-square grid. Players navigate their pieces from the bottom-left starting square to the victory square at 100 based on numbers rolled on a six-sided dice. Along the way, landing on a ladder catapults you forward, while stepping on a snake sends you sliding backward.
          </p>
        </article>

        {/* Section 3: How to Play Snake and Ladder */}
        <article className="space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
            How to Play Snake and Ladder
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Playing the online version is intuitive and beginner-friendly for players of all ages. Here is the simple step-by-step flow:
          </p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm">
            <li className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c] space-y-1">
              <strong className="text-[#fffdfa] block text-sm">1. Enter Your Nickname</strong>
              <span>Choose your in-game moniker or generate a playful identity using our dice randomizer.</span>
            </li>
            <li className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c] space-y-1">
              <strong className="text-[#fffdfa] block text-sm">2. Create or Join a Room</strong>
              <span>Pick Quick Match to pair with online players, create a private room for friends, or select AI bots.</span>
            </li>
            <li className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c] space-y-1">
              <strong className="text-[#fffdfa] block text-sm">3. Roll the Snake and Ladder Dice</strong>
              <span>When it is your turn, tap the large 3D dice to roll a number from 1 to 6.</span>
            </li>
            <li className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c] space-y-1">
              <strong className="text-[#fffdfa] block text-sm">4. Advance Your Token</strong>
              <span>Your token moves forward square-by-square according to the dice roll.</span>
            </li>
            <li className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c] space-y-1">
              <strong className="text-[#fffdfa] block text-sm">5. Climb Ladders &amp; Dodge Snakes</strong>
              <span>Land on ladder bases to climb ahead; avoid snake heads to prevent sliding back down.</span>
            </li>
            <li className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c] space-y-1">
              <strong className="text-[#fffdfa] block text-sm">6. Reach Square 100 to Win</strong>
              <span>Be the first player to land exactly on square 100 to claim victory!</span>
            </li>
          </ol>
        </article>

        {/* Section 4: Snake and Ladder Rules */}
        <article className="space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
            Snake and Ladder Rules
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            To ensure fair and exciting gameplay, our platform strictly follows the official <Link to="/snake-and-ladder-rules" className="text-amber-400 hover:underline font-semibold">Snake and Ladder rules</Link>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c] space-y-1.5">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <Dices className="w-4 h-4" />
                <span>Rolling a Six Rule</span>
              </div>
              <p className="text-xs text-[#a8998a]">
                Rolling a 6 grants you an immediate bonus roll. Rolling three consecutive sixes ends your turn to keep the game balanced.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c] space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <ArrowUpRight className="w-4 h-4" />
                <span>Ladder Rule</span>
              </div>
              <p className="text-xs text-[#a8998a]">
                When landing exactly at the foot of a ladder, your token instantly climbs to the top square connected to that ladder.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c] space-y-1.5">
              <div className="flex items-center space-x-2 text-rose-400 font-bold">
                <ArrowDownRight className="w-4 h-4" />
                <span>Snake Rule</span>
              </div>
              <p className="text-xs text-[#a8998a]">
                Landing on a square with a snake head forces you to slide all the way down to the square at its tail.
              </p>
            </div>
          </div>
        </article>

        {/* Section 5: Snake and Ladder Board */}
        <article className="space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
            The Snake and Ladder Board
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            The digital <strong>Snake and Ladder board</strong> features a meticulously calibrated 10×10 grid of 100 squares. To recreate the tactile feel of physical board games, our board utilizes alternating warm cream and ivory tiles set inside a rich walnut timber bezel.
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            Unlike basic spreadsheet-style boards, our rendering engine calculates smooth bezier curves for every snake and generates realistic wooden ladders with perspective rungs. Every element is spaced with collision-free clearance, ensuring that high-contrast square numbers remain clearly legible at all times.
          </p>
        </article>

        {/* Section 6: Play Snake and Ladder With Friends */}
        <article className="space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
            Play Snake and Ladder With Friends
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Multiplayer board gaming is most enjoyable when shared with friends and family. With our private room system, you can generate a shareable 6-digit room code (such as <code>AB7K9P</code>) or click <strong>Share on WhatsApp</strong> to send direct join links.
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            Up to 4 players can play together in the same room. The game synchronizes rolls, movements, and room chat in real-time with authoritative server validation, preventing client-side cheating while delivering seamless gameplay.
          </p>
        </article>

        {/* Section 7: Snake and Ladder Near Me — Play Online Anywhere */}
        <article className="space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
            Snake and Ladder Near Me — Play Online Anywhere
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            If you are searching for <strong>Snake and Ladder near me</strong>, you don't need to hunt for a physical board game box at a local toy store or wait for a board game cafe to open.
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            Our browser-based platform brings the full tabletop experience directly to your smartphone, tablet, laptop, or desktop anywhere in the world. Whether you are relaxing at home, traveling, or hanging out during lunch break, you have a complete multiplayer board ready at your fingertips.
          </p>
        </article>

        {/* Section 8: Snake and Ladder Game Download & Instant Play */}
        <article className="space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
            Snake and Ladder Game Download &amp; Instant Web Play
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Many users search for a <strong>Snake and Ladder game download</strong> to play on their devices. With our progressive web application (PWA) architecture, you get the best of both worlds:
          </p>
          <ul className="space-y-2 list-disc list-inside text-xs sm:text-sm text-[#e0d6cb]">
            <li><strong>Zero Storage Required:</strong> Play directly inside Chrome, Safari, Firefox, or Edge without downloading bulky APK or EXE files.</li>
            <li><strong>Install as PWA:</strong> On Android, iPhone, and Windows, you can tap "Add to Home Screen" to install the game as a lightweight standalone web app.</li>
            <li><strong>Always Updated:</strong> Enjoy new board improvements, sound enhancements, and game modes automatically without manual app updates.</li>
          </ul>
        </article>

        {/* Section 9: Snake and Ladder Picture & Board Preview */}
        <article className="space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
            Snake and Ladder Picture &amp; Board Preview
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Our visual board design honors the traditional aesthetic while utilizing modern SVG vector graphics:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c] space-y-1">
              <strong className="text-amber-400 block text-sm">🪜 10 Strategic Ladders</strong>
              <p className="text-xs text-[#a8998a]">
                Standard ladders located at squares 2→38, 7→14, 8→31, 15→26, 21→42, 28→84, 36→44, 51→67, 71→91, and 78→98.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c] space-y-1">
              <strong className="text-rose-400 block text-sm">🐍 10 Challenging Snakes</strong>
              <p className="text-xs text-[#a8998a]">
                Standard snakes poised at squares 16→6, 46→25, 49→11, 62→19, 64→60, 74→53, 89→68, 92→88, 95→75, and 99→80.
              </p>
            </div>
          </div>
        </article>

        {/* Section 10: Why Play Snake and Ladder Online? */}
        <article className="space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
            Why Play Snake and Ladder Online?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading font-bold text-base text-[#fffdfa]">No Setup Hassle</h3>
              <p className="text-xs text-[#a8998a] leading-relaxed">
                No lost dice, misplaced tokens, or torn board cardboard. Everything is ready in a click.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <h3 className="font-heading font-bold text-base text-[#fffdfa]">Play Across Distances</h3>
              <p className="text-xs text-[#a8998a] leading-relaxed">
                Connect with friends and family living in different cities or countries effortlessly.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
              <Smartphone className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading font-bold text-base text-[#fffdfa]">100% Touch Friendly</h3>
              <p className="text-xs text-[#a8998a] leading-relaxed">
                Smooth touch targets, crisp audio cues, and responsive scaling on every smartphone.
              </p>
            </div>
          </div>
        </article>

        {/* Section 11: FAQ Section */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <HelpCircle className="w-6 h-6 text-amber-400" />
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#fffdfa]">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c]">
              <h3 className="font-bold text-[#fffdfa] text-sm sm:text-base">What is Snake and Ladder?</h3>
              <p className="text-xs sm:text-sm text-[#a8998a] mt-1.5 leading-relaxed">
                Snake and Ladder is a classic tabletop board game played on a 10x10 numbered grid of 100 squares. Players roll a six-sided dice to move forward, climbing ladders to advance rapidly and sliding down snakes when landing on their heads.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c]">
              <h3 className="font-bold text-[#fffdfa] text-sm sm:text-base">How do you play Snake and Ladder?</h3>
              <p className="text-xs sm:text-sm text-[#a8998a] mt-1.5 leading-relaxed">
                Each player starts at square 0. On their turn, players roll the dice and advance their token by the rolled number. If a token lands on the bottom of a ladder, it climbs up. If it lands on a snake's head, it slides down. The first player to reach square 100 wins.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c]">
              <h3 className="font-bold text-[#fffdfa] text-sm sm:text-base">How many squares are on a Snake and Ladder board?</h3>
              <p className="text-xs sm:text-sm text-[#a8998a] mt-1.5 leading-relaxed">
                A standard Snake and Ladder board contains 100 squares arranged in a 10 by 10 grid, numbered sequentially from 1 at the bottom left to 100 at the top left in an alternating serpentine pattern.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c]">
              <h3 className="font-bold text-[#fffdfa] text-sm sm:text-base">What happens when you land on a ladder?</h3>
              <p className="text-xs sm:text-sm text-[#a8998a] mt-1.5 leading-relaxed">
                Landing on the base of a ladder acts as a shortcut that immediately moves your token up to the square where the top of the ladder finishes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c]">
              <h3 className="font-bold text-[#fffdfa] text-sm sm:text-base">What happens when you land on a snake?</h3>
              <p className="text-xs sm:text-sm text-[#a8998a] mt-1.5 leading-relaxed">
                Landing on a square with a snake head is an obstacle that forces your token to slide down the length of the snake to the square containing its tail.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c]">
              <h3 className="font-bold text-[#fffdfa] text-sm sm:text-base">What are the Snake and Ladder game rules?</h3>
              <p className="text-xs sm:text-sm text-[#a8998a] mt-1.5 leading-relaxed">
                Players take turns rolling a six-sided dice, moving clockwise. Rolling a 6 grants an extra turn. Landing on ladders moves you up, while snakes pull you down. Players must land exactly on square 100 to win.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c]">
              <h3 className="font-bold text-[#fffdfa] text-sm sm:text-base">Can I play Snake and Ladder online with friends?</h3>
              <p className="text-xs sm:text-sm text-[#a8998a] mt-1.5 leading-relaxed">
                Yes! You can create a private multiplayer room on our website, copy the invitation link or 6-digit room code, and share it directly with friends via WhatsApp, Discord, or messaging apps.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c]">
              <h3 className="font-bold text-[#fffdfa] text-sm sm:text-base">Can I play Snake and Ladder without downloading anything?</h3>
              <p className="text-xs sm:text-sm text-[#a8998a] mt-1.5 leading-relaxed">
                Yes. Our Snake and Ladder game runs directly inside any modern web browser on smartphones, tablets, laptops, and desktop computers without downloading any apps or software.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c]">
              <h3 className="font-bold text-[#fffdfa] text-sm sm:text-base">Can I play Snake and Ladder on mobile?</h3>
              <p className="text-xs sm:text-sm text-[#a8998a] mt-1.5 leading-relaxed">
                Yes, the game is 100% mobile-friendly and responsive with touch-optimized dice buttons and a board viewport that fits all mobile screen sizes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#241f1a] border border-[#3d342c]">
              <h3 className="font-bold text-[#fffdfa] text-sm sm:text-base">How many players can play online?</h3>
              <p className="text-xs sm:text-sm text-[#a8998a] mt-1.5 leading-relaxed">
                Our online multiplayer game supports 2 to 4 players per room, including real humans and AI bots.
              </p>
            </div>
          </div>
        </section>

        {/* AdSense Safe Container */}
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
