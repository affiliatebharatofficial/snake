import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { ShieldCheck, Lock, Eye, Database, Globe, Bell, Mail, ArrowLeft } from 'lucide-react';
import { sound } from '../game/soundEngine';

export const PrivacyPolicyPage: React.FC = () => {
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
        "name": "Privacy Policy",
        "item": `${window.location.origin}/privacy-policy`
      }
    ]
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title="Privacy Policy – Snake and Ladder Online"
        description="Read the Privacy Policy for Snake and Ladder Online. Learn about our anonymous guest gameplay, local storage usage, advertising disclosures, and data protection practices."
        canonicalPath="/privacy-policy"
        jsonLd={breadcrumbLd}
      />

      {/* Header */}
      <header className="space-y-4 text-center sm:text-left">
        <nav aria-label="Breadcrumb" className="text-xs text-[#a8998a] flex items-center justify-center sm:justify-start space-x-2">
          <Link to="/" className="hover:text-[#fffdfa] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">Privacy Policy</span>
        </nav>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#29221b] text-emerald-400 text-xs font-bold border border-[#523d2b]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy &amp; Data Practices</span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#fffdfa] tracking-tight">
          Privacy Policy – Snake and Ladder Online
        </h1>

        <div className="flex items-center space-x-2 text-xs text-[#a8998a]">
          <span>Last Updated: August 18, 2026</span>
        </div>
      </header>

      {/* Introduction */}
      <section className="space-y-4 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
        <p>
          Welcome to <strong>Snake &amp; Ladder Online</strong>. We respect your privacy and are committed to maintaining transparent, fair data practices. This Privacy Policy explains how information is processed when you visit our website, use our multiplayer board game services, or interact with our platform.
        </p>
        <p>
          Our application is purposely built with an <strong>anonymous, login-free architecture</strong> so you can enjoy tabletop gaming without submitting personal identification details.
        </p>
      </section>

      {/* Detailed Policy Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Lock className="w-5 h-5 text-amber-400" />
            <span>1. Information We Collect &amp; Process</span>
          </h2>
          <p>
            Because Snake and Ladder Online is designed for instant guest play, <strong>we do not require you to create an account, register with an email address, or provide your real name, phone number, or password</strong>.
          </p>
          <p>
            When you interact with the game, our systems process minimal technical data necessary to operate the gameplay:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#a8998a]">
            <li><strong>Guest Session Identifier:</strong> A randomly generated cryptographic token created on your device to maintain your connection to active rooms.</li>
            <li><strong>Player Nickname:</strong> The display name you choose to represent your token during matches (defaulting to a generic guest handle).</li>
            <li><strong>Game Room Codes:</strong> 6-character room identifiers used to route players to the same multiplayer match.</li>
            <li><strong>Game Moves &amp; Outcomes:</strong> Turn numbers, dice roll values, token positions on the board (1 to 100), and match completion summaries.</li>
            <li><strong>Technical Connection Diagnostics:</strong> Basic network information (such as hashed IP headers, user-agent string, and timestamp) processed automatically by our hosting infrastructure for rate-limiting, DDoS defense, and anti-cheat validation.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>2. Local Storage &amp; Cookies</span>
          </h2>
          <p>
            We utilize standard web browser <strong>Local Storage</strong> solely to enhance your local gaming experience. Specifically, local storage stores:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#a8998a]">
            <li>Your preferred player nickname, so you don't have to retype it on each visit.</li>
            <li>Your audio toggle preference (sound on or muted).</li>
            <li>Your active guest session token to allow instant reconnection if your browser tab refreshes.</li>
          </ul>
          <p>
            We do not use first-party tracking cookies for user profiling. You can clear your local storage at any time via your browser's settings without losing access to the core game.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Globe className="w-5 h-5 text-sky-400" />
            <span>3. Third-Party Infrastructure &amp; Advertising</span>
          </h2>
          <p>
            To deliver global performance, real-time multiplayer synchronization, and keep the game free for all players, we partner with reputable third-party technology providers:
          </p>
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-[#1c1814] border border-[#382f27]">
              <h3 className="font-heading font-bold text-sm text-[#fffdfa]">Cloudflare</h3>
              <p className="text-xs text-[#a8998a] mt-1">
                Our application is hosted on Cloudflare's global edge network using Cloudflare Workers, Cloudflare D1 databases, and Cloudflare Durable Objects. Cloudflare provides DNS routing, DDoS protection, and secure WebSocket synchronization.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#1c1814] border border-[#382f27]">
              <h3 className="font-heading font-bold text-sm text-[#fffdfa]">Advertising &amp; Google AdSense</h3>
              <p className="text-xs text-[#a8998a] mt-1">
                This website may display advertisements provided by third-party advertising partners, including Google AdSense. Third-party advertising vendors may use cookies, web beacons, or device identifiers to serve advertisements based on a user's prior visits to this website or other websites on the internet. Users may manage or opt out of personalized advertising by visiting Google Ad Settings or through industry opt-out portals.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#1c1814] border border-[#382f27]">
              <h3 className="font-heading font-bold text-sm text-[#fffdfa]">Analytics &amp; Performance</h3>
              <p className="text-xs text-[#a8998a] mt-1">
                If web analytics are enabled, they are used strictly to aggregate high-level operational statistics (such as page views, device categories, and server latency) to ensure smooth gameplay across all supported browsers.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Eye className="w-5 h-5 text-amber-400" />
            <span>4. Data Retention &amp; Security</span>
          </h2>
          <p>
            We retain game-related technical information only for as long as reasonably necessary to support ongoing matches, resolve technical faults, enforce fair play anti-cheat measures, and comply with operational obligations. Completed room records and chat messages automatically expire.
          </p>
          <p>
            We implement reasonable and appropriate technical and organizational measures to safeguard data against unauthorized access, loss, or manipulation—including modern HTTPS encryption and server-side validation. However, no method of electronic storage or transmission over the Internet can be guaranteed 100% secure.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Bell className="w-5 h-5 text-rose-400" />
            <span>5. Children's Privacy</span>
          </h2>
          <p>
            Snake and Ladder Online is designed as a family-friendly board game. Because we do not require account registration or collect personal identification information, we do not knowingly solicit or collect personal data from children under the age of 13. We encourage parents and guardians to supervise their children's internet usage.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Mail className="w-5 h-5 text-amber-400" />
            <span>6. Policy Updates &amp; Contact Us</span>
          </h2>
          <p>
            We may periodically revise this Privacy Policy to reflect changes in our technical features, advertising practices, or regulatory requirements. Any updates will be posted on this page with an updated "Last Updated" effective date.
          </p>
          <p>
            If you have questions, comments, or requests regarding this Privacy Policy, please contact us directly:
          </p>
          <div className="p-4 rounded-xl bg-[#1c1814] border border-[#382f27] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#fffdfa]">Email Privacy Inquiries:</span>
              <p className="font-mono text-amber-300 text-xs sm:text-sm mt-0.5">fkdigitalmedia@gmail.com</p>
            </div>
            <a
              href="mailto:fkdigitalmedia@gmail.com"
              onClick={() => sound.playClick()}
              className="py-2 px-4 rounded-xl btn-primary text-white font-heading font-bold text-xs"
            >
              Contact Support
            </a>
          </div>
        </section>
      </div>

      {/* Footer link */}
      <footer className="pt-2">
        <Link
          to="/"
          onClick={() => sound.playClick()}
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#d6c9ba] hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage &amp; Play</span>
        </Link>
      </footer>
    </article>
  );
};
