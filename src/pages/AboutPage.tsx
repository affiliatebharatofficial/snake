import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { Dices, Users, Shield, Zap, Sparkles, Play, MonitorSmartphone, Heart, ArrowRight } from 'lucide-react';
import { sound } from '../game/soundEngine';

export const AboutPage: React.FC = () => {
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
        "name": "About Us",
        "item": `${window.location.origin}/about`
      }
    ]
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title="About Us – Snake and Ladder Online"
        description="Learn about Snake and Ladder Online — a free, browser-based board game built for effortless multiplayer fun with friends, family, or bots on any device."
        canonicalPath="/about"
        jsonLd={breadcrumbLd}
      />

      {/* Header */}
      <header className="space-y-4 text-center sm:text-left">
        <nav aria-label="Breadcrumb" className="text-xs text-[#a8998a] flex items-center justify-center sm:justify-start space-x-2">
          <Link to="/" className="hover:text-[#fffdfa] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">About Us</span>
        </nav>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#29221b] text-amber-400 text-xs font-bold border border-[#523d2b]">
          <Dices className="w-3.5 h-3.5" />
          <span>About Our Platform</span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#fffdfa] tracking-tight">
          About Us – Snake and Ladder Online
        </h1>

        <p className="text-sm sm:text-base text-[#d6c9ba] max-w-2xl leading-relaxed">
          Making the timeless traditional Snake and Ladder board game effortlessly accessible to players everywhere directly inside modern web browsers.
        </p>
      </header>

      {/* Main Narrative Section */}
      <section className="space-y-4 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
        <h2 className="font-heading font-black text-xl sm:text-2xl text-[#fffdfa] border-b border-[#3d342c] pb-3 flex items-center space-x-2">
          <Heart className="w-5 h-5 text-rose-400" />
          <span>Our Story &amp; Purpose</span>
        </h2>
        <p>
          Snake and Ladder is one of the world's most cherished and enduring classic tabletop games. Generations of players have gathered around physical boards to experience the suspense of rolling dice, the joy of climbing tall ladders, and the tension of sliding down treacherous snakes.
        </p>
        <p>
          In modern digital gaming, enjoying a quick casual board game with loved ones or friends often comes with cumbersome hurdles: mandatory app downloads, account registrations, forgotten passwords, invasive tracking, and cluttered interfaces.
        </p>
        <p>
          <strong>Snake &amp; Ladder Online</strong> was created to eliminate those barriers. Our purpose is to provide a clean, free, browser-based online version of the traditional game that anyone can pick up and enjoy instantly—whether on a smartphone during a break, on a tablet with family in the living room, or on a desktop computer.
        </p>
      </section>

      {/* Core Principles Grid */}
      <section className="space-y-4">
        <h2 className="font-heading font-black text-xl sm:text-2xl text-[#fffdfa]">
          What We Focus On
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#332a22] border border-[#523d2b] flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">Instant Guest Gameplay</h3>
            <p className="text-xs text-[#a8998a] leading-relaxed">
              No registration forms or email verifications. Players can pick a nickname or use an automatic guest ID to create or join game rooms in seconds.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#332a22] border border-[#523d2b] flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">Real-Time Multiplayer</h3>
            <p className="text-xs text-[#a8998a] leading-relaxed">
              Play with 2 to 4 players simultaneously. Create private rooms with custom room codes to invite friends, or test your strategy against built-in AI bot opponents.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#332a22] border border-[#523d2b] flex items-center justify-center text-amber-400">
              <MonitorSmartphone className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">Cross-Device Accessibility</h3>
            <p className="text-xs text-[#a8998a] leading-relaxed">
              Fully optimized for responsive performance across all screen sizes—from mobile phones (320px+) to high-resolution desktop displays without app store installations.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#332a22] border border-[#523d2b] flex items-center justify-center text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">Authoritative Fair Play</h3>
            <p className="text-xs text-[#a8998a] leading-relaxed">
              Dice rolls, board shortcuts, and win conditions are calculated authoritatively on the backend engine to ensure reliable, cheat-free gameplay for every participant.
            </p>
          </div>
        </div>
      </section>

      {/* Board Craftsmanship Section */}
      <section className="space-y-4 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
        <h2 className="font-heading font-black text-xl sm:text-2xl text-[#fffdfa] border-b border-[#3d342c] pb-3 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Visual Polish &amp; Audio Experience</span>
        </h2>
        <p>
          While keeping the underlying rules faithful to classic tradition, we dedicated care to crafting an appealing visual presentation:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-[#a8998a]">
          <li><strong>Handcrafted Snake &amp; Ladder Vectors:</strong> Custom smooth SVG bezier curves that guide pieces cleanly without visual clutter.</li>
          <li><strong>Tactile Sound Engine:</strong> Dynamic synthetic audio feedback for rolling dice, climbing ladders, sliding snakes, and victory celebrations, easily toggleable at any time.</li>
          <li><strong>Smooth Piece Animations:</strong> Fluid step-by-step token movement along the 100 squares of the board so players can clearly follow every turn.</li>
        </ul>
      </section>

      {/* Getting in Touch & CTA */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#29221b] to-[#1f1914] border border-[#523d2b] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-heading font-bold text-lg text-[#fffdfa]">Have Feedback or Questions?</h3>
          <p className="text-xs text-[#a8998a] max-w-md">
            We are always listening to player feedback to refine the game. Visit our Contact page to reach us anytime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/contact"
            onClick={() => sound.playClick()}
            className="py-3 px-5 rounded-xl btn-secondary text-white font-heading font-bold text-xs flex items-center space-x-1.5 transition-all"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/"
            onClick={() => sound.playClick()}
            className="py-3 px-6 rounded-xl btn-primary text-white font-heading font-extrabold text-xs flex items-center space-x-1.5 transition-all hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Now</span>
          </Link>
        </div>
      </section>
    </article>
  );
};
