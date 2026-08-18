import React from 'react';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
      <div className="flex items-center space-x-2 text-indigo-400 font-bold">
        <FileText className="w-5 h-5" />
        <span>Terms of Service</span>
      </div>
      <h1 className="font-heading font-black text-2xl sm:text-4xl text-white">
        Terms of Service
      </h1>
      <p className="text-slate-400">Last updated: August 2026</p>

      <section className="space-y-2">
        <h2 className="font-heading font-bold text-base text-white">1. Free Fair Play</h2>
        <p>
          Snake & Ladder Online is provided for fair multiplayer entertainment. Players agree not to abuse the game via automated scripts, bots in human queues, or inappropriate in-game chat.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading font-bold text-base text-white">2. Service Availability</h2>
        <p>
          The service is provided on an "as is" and "as available" basis. We continuously strive for 99.9% uptime and zero-latency multiplayer synchronization.
        </p>
      </section>
    </div>
  );
};
