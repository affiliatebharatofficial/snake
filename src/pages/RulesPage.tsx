import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { BookOpen, Dices, ArrowUpRight, ArrowDownRight, Trophy, Sparkles, CheckCircle2, Play } from 'lucide-react';
import { sound } from '../game/soundEngine';
import { DEFAULT_LADDERS, DEFAULT_SNAKES } from '../game/boardConfig';

export const RulesPage: React.FC = () => {
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
        "name": "Snake and Ladder Rules",
        "item": `${window.location.origin}/snake-and-ladder-rules`
      }
    ]
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title="Snake and Ladder Rules – Complete Game Rules Guide"
        description="Discover the official Snake and Ladder rules. Learn board setup, rolling the dice, climbing ladders, escaping snakes, bonus turns on 6, and exact 100 victory."
        canonicalPath="/snake-and-ladder-rules"
        jsonLd={breadcrumbLd}
      />

      {/* Header & Breadcrumb */}
      <header className="space-y-4 text-center sm:text-left">
        <nav aria-label="Breadcrumb" className="text-xs text-[#a8998a] flex items-center justify-center sm:justify-start space-x-2">
          <Link to="/" className="hover:text-[#fffdfa]">Home</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">Rules</span>
        </nav>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#29221b] text-amber-400 text-xs font-bold border border-[#523d2b]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Official Rulebook</span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#fffdfa] tracking-tight">
          Snake and Ladder Rules
        </h1>

        <p className="text-sm sm:text-base text-[#d6c9ba] max-w-2xl leading-relaxed">
          Master the traditional and modern rules of the Snake and Ladder board game. Understand turn order, movement mechanics, shortcut climbs, penalty slides, and winning conditions.
        </p>
      </header>

      {/* Core Rules Sections */}
      <section className="space-y-6">
        <h2 className="font-heading font-black text-2xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
          1. Board Setup and Starting Positions
        </h2>
        <div className="p-6 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-3 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed">
          <p>
            The <strong>Snake and Ladder board</strong> consists of exactly 100 squares arranged in a 10×10 grid. The squares are numbered sequentially from 1 to 100 in a serpentine track, alternating from left-to-right on odd rows and right-to-left on even rows.
          </p>
          <ul className="space-y-2 list-disc list-inside text-[#e0d6cb]">
            <li><strong>Starting Position:</strong> All players begin off the board at position 0.</li>
            <li><strong>Turn Order:</strong> Players take turns clockwise or in the order assigned upon entering the room.</li>
            <li><strong>Dice Rolls:</strong> A single six-sided physical or digital dice (values 1 through 6) determines movement each turn.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-heading font-black text-2xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
          2. Movement, Ladders, and Snakes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1b382b] flex items-center justify-center text-emerald-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">Climbing Ladders 🪜</h3>
            <p className="text-xs sm:text-sm text-[#d6c9ba] leading-relaxed">
              When a player's token lands on a square that contains the base/foot of a ladder, the token immediately ascends straight to the square at the top of the ladder.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3d1d1a] flex items-center justify-center text-rose-400">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">Sliding Down Snakes 🐍</h3>
            <p className="text-xs sm:text-sm text-[#d6c9ba] leading-relaxed">
              When a player's token lands on a square with a snake's head, the piece is bitten and must immediately slide down the body to the square containing its tail.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-heading font-black text-2xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
          3. Special Rules &amp; Victory Conditions
        </h2>
        <div className="p-6 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-4 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#fffdfa] text-sm">Rolling a Six (Bonus Roll)</h4>
              <p className="text-xs text-[#a8998a] mt-0.5">
                Rolling a 6 earns the player an immediate extra turn. To prevent infinite turn loops, rolling three consecutive sixes results in a turn forfeiture.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#fffdfa] text-sm">Exact 100 to Win</h4>
              <p className="text-xs text-[#a8998a] mt-0.5">
                To win, a player must land exactly on square 100. If the rolled number exceeds 100, the piece does not move and the player awaits their next turn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Board Coordinates Table */}
      <section className="space-y-6">
        <h2 className="font-heading font-black text-2xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
          4. Official Board Shortcuts Table
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-4 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">10 Ladder Shortcuts</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {DEFAULT_LADDERS.map(l => (
                <div key={l.id} className="p-2 rounded-lg bg-[#1c1814] border border-[#382f27] flex justify-between text-[#d6c9ba]">
                  <span>Square {l.start}</span>
                  <span className="text-emerald-400 font-bold">➔ {l.end}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">10 Snake Hazards</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {DEFAULT_SNAKES.map(s => (
                <div key={s.id} className="p-2 rounded-lg bg-[#1c1814] border border-[#382f27] flex justify-between text-[#d6c9ba]">
                  <span>Square {s.start}</span>
                  <span className="text-rose-400 font-bold">➔ {s.end}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Play CTA */}
      <footer className="text-center pt-4">
        <Link
          to="/"
          onClick={() => sound.playClick()}
          className="inline-flex items-center space-x-2 py-4 px-8 rounded-2xl btn-primary text-white font-heading font-extrabold text-base transition-all hover:scale-105"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Play Snake and Ladder Online Now</span>
        </Link>
      </footer>
    </article>
  );
};
