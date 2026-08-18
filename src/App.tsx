import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { GamePage } from './pages/GamePage';
import { HowToPlayPage } from './pages/HowToPlayPage';
import { RulesPage } from './pages/RulesPage';
import { PlayWithFriendsPage } from './pages/PlayWithFriendsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { I18nProvider } from './i18n';

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1613] text-[#f7f3ed] selection:bg-amber-500 selection:text-stone-950">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          {/* ========================================================================= */}
          {/* Standard Root Routes (English / Default) */}
          {/* ========================================================================= */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/play" element={<LandingPage />} />
          <Route path="/snake-and-ladder-online" element={<LandingPage />} />
          <Route path="/snake-and-ladder-game" element={<LandingPage />} />
          <Route path="/snake-and-ladder" element={<LandingPage />} />

          <Route path="/how-to-play" element={<HowToPlayPage />} />
          <Route path="/snake-and-ladder-rules" element={<RulesPage />} />
          <Route path="/play-with-friends" element={<PlayWithFriendsPage />} />
          <Route path="/multiplayer-snake-and-ladder" element={<PlayWithFriendsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/game/:roomCode" element={<GamePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* ========================================================================= */}
          {/* Localized Prefixed Routes (/:lang/...) */}
          {/* ========================================================================= */}
          <Route path="/:lang" element={<LandingPage />} />
          <Route path="/:lang/play" element={<LandingPage />} />
          <Route path="/:lang/how-to-play" element={<HowToPlayPage />} />
          <Route path="/:lang/snake-and-ladder-rules" element={<RulesPage />} />
          <Route path="/:lang/play-with-friends" element={<PlayWithFriendsPage />} />
          <Route path="/:lang/about" element={<AboutPage />} />
          <Route path="/:lang/contact" element={<ContactPage />} />
          <Route path="/:lang/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/:lang/terms" element={<TermsPage />} />
          <Route path="/:lang/game/:roomCode" element={<GamePage />} />

          {/* ========================================================================= */}
          {/* Protected / Direct Admin Route (Hidden from public navigation) */}
          {/* ========================================================================= */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Fallback */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AppRoutes />
      </I18nProvider>
    </BrowserRouter>
  );
}

export default App;
