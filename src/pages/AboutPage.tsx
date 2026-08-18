import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { Dices, Shield, Zap, Sparkles, Play } from 'lucide-react';
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
        "name": "About",
        "item": `${window.location.origin}/about`
      }
    ]
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title="About Snake and Ladder Online – Free Multiplayer Board Game"
        description="Learn about the history and development of Snake and Ladder Online, built with modern web technologies for instant, login-free tabletop gaming."
        canonicalPath="/about"
        jsonLd={breadcrumbLd}
      />

      <header className="space-y-4 text-center sm:text-left">
        <nav aria-label="Breadcrumb" className="text-xs text-[#a8998a] flex items-center justify-center sm:justify-start space-x-2">
          <Link to="/" className="hover:text-[#fffdfa]">Home</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">About</span>
        </nav>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#29221b] text-amber-400 text-xs font-bold border border-[#523d2b]">
          <Dices className="w-3.5 h-3.5" />
          <span>Our Story &amp; Vision</span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#fffdfa] tracking-tight">
          About Snake and Ladder Online
        </h1>

        <p className="text-sm sm:text-base text-[#d6c9ba] max-w-2xl leading-relaxed">
          Bringing the beloved classic board game to the modern web with instant accessibility, zero friction, and real-time multiplayer excitement.
        </p>
      </header>

      <section className="space-y-4 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed">
        <h2 className="font-heading font-black text-2xl text-[#fffdfa] border-b border-[#3d342c] pb-3">
          Our Mission: Frictionless Tabletop Fun
        </h2>
        <p>
          Traditional board games are meant to be simple, social, and immediately enjoyable. In today's digital world, many games force players through registration walls, password verifications, intrusive permissions, and excessive advertisements.
        </p>
        <p>
          <strong>Snake &amp; Ladder Online</strong> was created with a single mission: to allow anyone on any device to open the web page, choose a player nickname, and start rolling dice in 5 seconds.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
          <Zap className="w-6 h-6 text-amber-400" />
          <h3 className="font-heading font-bold text-base text-[#fffdfa]">Zero Account Barrier</h3>
          <p className="text-xs text-[#a8998a] leading-relaxed">
            No emails or logins required. Temporary cryptographically random sessions keep games private and effortless.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
          <Shield className="w-6 h-6 text-emerald-400" />
          <h3 className="font-heading font-bold text-base text-[#fffdfa]">Real-Time Anti-Cheat</h3>
          <p className="text-xs text-[#a8998a] leading-relaxed">
            Moves and dice rolls are computed authoritatively on the backend, ensuring a fair experience for everyone.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
          <h3 className="font-heading font-bold text-base text-[#fffdfa]">Board Game Polish</h3>
          <p className="text-xs text-[#a8998a] leading-relaxed">
            Collision-free bezier snakes, realistic wooden ladders, physical ivory dice, and tactile audio feedback.
          </p>
        </div>
      </section>

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
