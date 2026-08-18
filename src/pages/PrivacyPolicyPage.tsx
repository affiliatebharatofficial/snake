import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
      <div className="flex items-center space-x-2 text-indigo-400 font-bold">
        <ShieldCheck className="w-5 h-5" />
        <span>Privacy Policy</span>
      </div>
      <h1 className="font-heading font-black text-2xl sm:text-4xl text-white">
        Privacy Policy for Snake & Ladder Online
      </h1>
      <p className="text-slate-400">Last updated: August 2026</p>

      <section className="space-y-2">
        <h2 className="font-heading font-bold text-base text-white">1. Anonymous & Login-Free Privacy</h2>
        <p>
          We believe in complete user privacy. Our multiplayer game is 100% login-free and does not require or collect personal identification information such as your real name, email address, password, or physical location.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading font-bold text-base text-white">2. Guest Sessions and Local Storage</h2>
        <p>
          We use browser local storage solely to remember your chosen player nickname, game sound settings, and temporary game rooms for seamless reconnection.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading font-bold text-base text-white">3. Multiplayer Game Data</h2>
        <p>
          Game moves, temporary chat messages, and room states are transmitted over secure channels to synchronize multiplayer state and are automatically expired after games conclude.
        </p>
      </section>
    </div>
  );
};
