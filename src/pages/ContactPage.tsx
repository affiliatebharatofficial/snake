import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { Mail, HelpCircle, Wrench, MessageSquare, ShieldAlert, ArrowLeft, Copy, Check } from 'lucide-react';
import { sound } from '../game/soundEngine';

export const ContactPage: React.FC = () => {
  const [copied, setCopied] = React.useState(false);
  const email = 'fkdigitalmedia@gmail.com';

  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        "name": "Contact Us",
        "item": `${window.location.origin}/contact`
      }
    ]
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title="Contact Us – Snake and Ladder Online"
        description="Contact the Snake and Ladder Online team for technical support, bug reports, game feedback, or privacy inquiries at fkdigitalmedia@gmail.com."
        canonicalPath="/contact"
        jsonLd={breadcrumbLd}
      />

      {/* Header */}
      <header className="space-y-4 text-center sm:text-left">
        <nav aria-label="Breadcrumb" className="text-xs text-[#a8998a] flex items-center justify-center sm:justify-start space-x-2">
          <Link to="/" className="hover:text-[#fffdfa] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">Contact Us</span>
        </nav>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#29221b] text-amber-400 text-xs font-bold border border-[#523d2b]">
          <Mail className="w-3.5 h-3.5" />
          <span>Support &amp; Inquiries</span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#fffdfa] tracking-tight">
          Contact Us – Snake and Ladder Online
        </h1>

        <p className="text-sm sm:text-base text-[#d6c9ba] max-w-2xl leading-relaxed">
          If you have questions, feedback, suggestions, technical issues, or concerns about the website, we are here to assist you.
        </p>
      </header>

      {/* Main Email Hero Card */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#241f1a] border-2 border-amber-500/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-heading font-bold text-lg text-[#fffdfa] flex items-center space-x-2">
              <Mail className="w-5 h-5 text-amber-400" />
              <span>Direct Email Support</span>
            </h2>
            <p className="text-xs text-[#a8998a]">
              Please email us directly and we will respond as soon as possible.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`mailto:${email}`}
              onClick={() => sound.playClick()}
              className="py-2.5 px-5 rounded-xl btn-primary text-white font-heading font-bold text-xs flex items-center space-x-2 transition-all hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              <span>Send Email</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="py-2.5 px-4 rounded-xl bg-[#2e2620] hover:bg-[#3d332b] border border-[#523d2b] text-[#f5ebd9] font-heading font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              title="Copy email to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#a8998a]" />}
              <span>{copied ? 'Copied!' : 'Copy Email'}</span>
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#1c1814] border border-[#3d342c] font-mono text-xs sm:text-sm text-amber-300 font-bold break-all flex items-center justify-between">
          <span>{email}</span>
        </div>
      </section>

      {/* Structured Inquiries Grid */}
      <section className="space-y-4">
        <h2 className="font-heading font-black text-xl sm:text-2xl text-[#fffdfa]">
          How We Can Help
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Section 1: General Questions */}
          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#332a22] border border-[#523d2b] flex items-center justify-center text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">General Questions</h3>
            <p className="text-xs text-[#a8998a] leading-relaxed">
              Have questions about game modes, how to invite friends to private rooms, or how rules like the exact 100 win condition work? Check out our <Link to="/how-to-play" className="text-amber-400 underline hover:text-amber-300">How to Play</Link> guide or email us for assistance.
            </p>
          </div>

          {/* Section 2: Technical Issues */}
          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#332a22] border border-[#523d2b] flex items-center justify-center text-rose-400">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">Technical Issues &amp; Bug Reports</h3>
            <p className="text-xs text-[#a8998a] leading-relaxed">
              Encountering game loading problems, multiplayer connection drops, browser compatibility glitches, sound issues, or game-room synchronization errors? Please specify your browser and device when reporting.
            </p>
          </div>

          {/* Section 3: Feedback & Suggestions */}
          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#332a22] border border-[#523d2b] flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">Feedback &amp; Suggestions</h3>
            <p className="text-xs text-[#a8998a] leading-relaxed">
              We welcome ideas from the community! If you have suggestions for new gameplay modes, cosmetic themes, customizable board rules, or general quality-of-life improvements, let us know.
            </p>
          </div>

          {/* Section 4: Privacy & Legal Questions */}
          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#332a22] border border-[#523d2b] flex items-center justify-center text-sky-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">Privacy &amp; Legal Inquiries</h3>
            <p className="text-xs text-[#a8998a] leading-relaxed">
              For any questions regarding our <Link to="/privacy-policy" className="text-amber-400 underline hover:text-amber-300">Privacy Policy</Link>, <Link to="/terms" className="text-amber-400 underline hover:text-amber-300">Terms of Service</Link>, local storage usage, or data practices, contact us at the same address.
            </p>
          </div>
        </div>
      </section>

      {/* Helpful Tips Section */}
      <section className="space-y-3 text-xs text-[#a8998a] leading-relaxed bg-[#241f1a] p-5 rounded-2xl border border-[#3d342c]">
        <h3 className="font-heading font-bold text-sm text-[#fffdfa]">
          When Submitting a Technical Report:
        </h3>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Include the device model and browser version (e.g., Chrome on Windows 11, Safari on iPhone).</li>
          <li>If applicable, include the 6-character room code you were playing in.</li>
          <li>Describe what happened just before the issue occurred.</li>
        </ul>
      </section>

      {/* Back to Game */}
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
