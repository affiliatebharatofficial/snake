import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { FileText, ShieldAlert, Scale, Ban, AlertTriangle, Copyright, Mail, ArrowLeft } from 'lucide-react';
import { sound } from '../game/soundEngine';

export const TermsPage: React.FC = () => {
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
        "name": "Terms of Service",
        "item": `${window.location.origin}/terms`
      }
    ]
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title="Terms of Service – Snake and Ladder Online"
        description="Review the Terms of Service for Snake and Ladder Online. Understand rules for fair play, guest access, multiplayer guidelines, prohibited conduct, and intellectual property rights."
        canonicalPath="/terms"
        jsonLd={breadcrumbLd}
      />

      {/* Header */}
      <header className="space-y-4 text-center sm:text-left">
        <nav aria-label="Breadcrumb" className="text-xs text-[#a8998a] flex items-center justify-center sm:justify-start space-x-2">
          <Link to="/" className="hover:text-[#fffdfa] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">Terms of Service</span>
        </nav>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#29221b] text-amber-400 text-xs font-bold border border-[#523d2b]">
          <FileText className="w-3.5 h-3.5" />
          <span>User Agreement</span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#fffdfa] tracking-tight">
          Terms of Service – Snake and Ladder Online
        </h1>

        <div className="flex items-center space-x-2 text-xs text-[#a8998a]">
          <span>Last Updated: August 18, 2026</span>
        </div>
      </header>

      {/* Introduction */}
      <section className="space-y-4 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
        <p>
          Welcome to <strong>Snake &amp; Ladder Online</strong>. By accessing or playing on our website, you agree to comply with and be bound by the following Terms of Service. Please read them carefully before using our platform.
        </p>
        <p>
          If you do not agree with any part of these Terms, you should discontinue using the website immediately.
        </p>
      </section>

      {/* Structured Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed">
        {/* Section 1: Acceptance & Use */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Scale className="w-5 h-5 text-amber-400" />
            <span>1. Acceptance of Terms &amp; Guest Access</span>
          </h2>
          <p>
            Snake &amp; Ladder Online provides free, browser-based digital tabletop gameplay. By using this service, you represent that you are authorized to access the web and participate in casual games.
          </p>
          <p>
            Users participate as guests using temporary session tokens. You agree not to attempt impersonating other players, exploiting temporary guest identifiers, or tampering with room tokens.
          </p>
        </section>

        {/* Section 2: User Conduct & Prohibited Activities */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Ban className="w-5 h-5 text-rose-400" />
            <span>2. Fair Play &amp; Prohibited Conduct</span>
          </h2>
          <p>
            To ensure an enjoyable, safe environment for all players, you agree not to engage in any of the following prohibited activities:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#a8998a]">
            <li><strong>Cheating &amp; Game State Tampering:</strong> Attempting to manipulate dice rolls, token positions, turn sequences, or server responses via modified client scripts or packet interception.</li>
            <li><strong>Automated Abuse &amp; Bot Flooding:</strong> Injecting automated bots, scraping tools, or spam scripts into public matchmaking queues or game rooms.</li>
            <li><strong>Infrastructure Attacks:</strong> Initiating denial-of-service (DDoS) attacks, scanning for security vulnerabilities, or attempting to overload Cloudflare edge workers and WebSocket gateways.</li>
            <li><strong>Harassment &amp; Inappropriate Content:</strong> Using hateful, defamatory, obscene, or abusive text in chosen nicknames or in-game chat messages.</li>
            <li><strong>Commercial Exploitation:</strong> Reselling, sublicensing, or mirroring game assets and backend services without prior written permission.</li>
          </ul>
        </section>

        {/* Section 3: Intellectual Property */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Copyright className="w-5 h-5 text-sky-400" />
            <span>3. Intellectual Property Rights</span>
          </h2>
          <p>
            The historic, traditional concept and underlying mathematical layout of the Snake and Ladder board game are in the public domain.
          </p>
          <p>
            However, all original elements of this website—including its proprietary source code, user interface designs, custom SVG graphics, dynamic sound engine, visual styling, branding, and written editorial content—are protected by copyright and intellectual property laws. You may not copy, redistribute, or reverse engineer these original assets without express written consent.
          </p>
        </section>

        {/* Section 4: Disclaimer of Warranties */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>4. Entertainment Disclaimer &amp; Service Availability</span>
          </h2>
          <p>
            Snake and Ladder Online is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis solely for casual entertainment purposes.
          </p>
          <p>
            While we continuously endeavor to provide a seamless, uninterrupted gaming experience, we do not warrant that the website will be entirely bug-free, error-free, or continuously available at all times. Multiplayer connections may occasionally be subject to internet latency, browser quirks, or scheduled network maintenance.
          </p>
        </section>

        {/* Section 5: Limitation of Liability */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <span>5. Limitation of Liability</span>
          </h2>
          <p>
            To the fullest extent permitted by applicable law, the creators and operators of Snake &amp; Ladder Online shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to, use of, or inability to use the game or website.
          </p>
        </section>

        {/* Section 6: Third-Party Links & Advertising */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <FileText className="w-5 h-5 text-sky-400" />
            <span>6. Third-Party Services &amp; Advertisements</span>
          </h2>
          <p>
            The website may display advertisements served by third-party ad networks (such as Google AdSense) or links to external websites. We do not control or endorse third-party content and are not responsible for their terms or privacy policies.
          </p>
        </section>

        {/* Section 7: Changes & Contact */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Mail className="w-5 h-5 text-amber-400" />
            <span>7. Modifications &amp; Contact Information</span>
          </h2>
          <p>
            We reserve the right to modify or update these Terms of Service at any time. Continued use of the website following any modifications constitutes your acceptance of the revised Terms.
          </p>
          <div className="p-4 rounded-xl bg-[#1c1814] border border-[#382f27] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#fffdfa]">Questions Regarding Terms:</span>
              <p className="font-mono text-amber-300 text-xs sm:text-sm mt-0.5">fkdigitalmedia@gmail.com</p>
            </div>
            <a
              href="mailto:fkdigitalmedia@gmail.com"
              onClick={() => sound.playClick()}
              className="py-2 px-4 rounded-xl btn-primary text-white font-heading font-bold text-xs"
            >
              Contact Us
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
