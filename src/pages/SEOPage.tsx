import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { sound } from '../game/soundEngine';

interface SEOPageProps {
  title?: string;
  subtitle?: string;
}

export const SEOPage: React.FC<SEOPageProps> = ({
  title = "Play Snake & Ladder Online - Free Multiplayer Board Game",
  subtitle = "The ultimate online Snake & Ladder experience. Roll the dice, climb the ladders, avoid the snakes, and play with friends or AI bots with zero login."
}) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Snake & Ladder Online",
    "url": window.location.origin,
    "description": subtitle,
    "potentialAction": {
      "@type": "PlayAction",
      "target": window.location.origin
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="text-center space-y-3">
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#fffdfa]">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-[#d6c9ba] max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-[#241f1a] border border-[#3d342c] space-y-5">
        <h2 className="font-heading font-bold text-xl text-[#fffdfa] flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Real-Time Online Board Game</span>
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed">
          <p>
            Snake & Ladder is one of the most timeless and iconic board games in history. Our digital edition brings the tabletop experience to life with physical 3D dice, collision-free smooth board graphics, synchronized sounds, and multi-player rooms.
          </p>
          <p>
            Create a private room in one click and share a direct link or WhatsApp message with your friends. No apps to install, no accounts to create, and no passwords required.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#1c1814] border border-[#382f27]">
            <h4 className="font-bold text-[#fffdfa] text-sm">Instant Play</h4>
            <p className="text-xs text-[#8c7e72] mt-1">Open link, type name, and start playing immediately.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#1c1814] border border-[#382f27]">
            <h4 className="font-bold text-[#fffdfa] text-sm">Mobile Optimized</h4>
            <p className="text-xs text-[#8c7e72] mt-1">Responsive board layout that fits every mobile screen.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#1c1814] border border-[#382f27]">
            <h4 className="font-bold text-[#fffdfa] text-sm">Play with Bots</h4>
            <p className="text-xs text-[#8c7e72] mt-1">Practice with Easy, Medium, or Hard AI bots anytime.</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="p-6 rounded-3xl bg-[#241f1a] border border-[#3d342c] space-y-4">
        <h3 className="font-heading font-bold text-xl text-[#fffdfa] flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl bg-[#1c1814] border border-[#382f27]">
            <h4 className="font-bold text-[#fffdfa]">Do I need to sign up or register?</h4>
            <p className="text-[#a8998a] mt-1">No! The game is completely login-free. You can pick any nickname and start playing.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1c1814] border border-[#382f27]">
            <h4 className="font-bold text-[#fffdfa]">How do I invite friends?</h4>
            <p className="text-[#a8998a] mt-1">Click "Play With Friends" to generate a 6-digit room code and copy the invitation link.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1c1814] border border-[#382f27]">
            <h4 className="font-bold text-[#fffdfa]">Does rolling 6 give an extra roll?</h4>
            <p className="text-[#a8998a] mt-1">Yes, rolling a 6 gives an extra turn by default according to official rules.</p>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link
          to="/"
          onClick={() => sound.playClick()}
          className="inline-flex items-center space-x-2 py-4 px-8 rounded-2xl btn-primary text-white font-heading font-extrabold text-base transition-all hover:scale-105"
        >
          <span>Start Playing Online Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
