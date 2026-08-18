import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { Users, Share2, Play, Dices, ArrowRight } from 'lucide-react';
import { sound } from '../game/soundEngine';
import { useI18n } from '../i18n';

export const PlayWithFriendsPage: React.FC = () => {
  const { t, getLocalizedUrl } = useI18n();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": t('nav.home'),
        "item": `${window.location.origin}${getLocalizedUrl('/')}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": t('nav.playWithFriends'),
        "item": `${window.location.origin}${getLocalizedUrl('/play-with-friends')}`
      }
    ]
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title={t('seo.playWithFriendsTitle')}
        description={t('seo.playWithFriendsDesc')}
        canonicalPath="/play-with-friends"
        jsonLd={breadcrumbLd}
      />

      {/* Header */}
      <header className="space-y-4 text-center sm:text-left">
        <nav aria-label="Breadcrumb" className="text-xs text-[#a8998a] flex items-center justify-center sm:justify-start space-x-2">
          <Link to={getLocalizedUrl('/')} className="hover:text-[#fffdfa]">{t('nav.home')}</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">{t('nav.playWithFriends')}</span>
        </nav>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#29221b] text-amber-400 text-xs font-bold border border-[#523d2b]">
          <Users className="w-3.5 h-3.5" />
          <span>{t('nav.playWithFriends')}</span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#fffdfa] tracking-tight">
          {t('playWithFriends.title')}
        </h1>

        <p className="text-sm sm:text-base text-[#d6c9ba] max-w-xl leading-relaxed">
          {t('playWithFriends.subtitle')}
        </p>
      </header>

      {/* Steps Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#382b1e] border border-[#523d2b] flex items-center justify-center text-amber-400 font-heading font-bold">
            1
          </div>
          <h2 className="font-heading font-bold text-lg text-[#fffdfa]">{t('playWithFriends.step1Title')}</h2>
          <p className="text-xs text-[#a8998a] leading-relaxed">
            {t('playWithFriends.step1Desc')}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#382b1e] border border-[#523d2b] flex items-center justify-center text-amber-400 font-heading font-bold">
            2
          </div>
          <h2 className="font-heading font-bold text-lg text-[#fffdfa]">{t('playWithFriends.step2Title')}</h2>
          <p className="text-xs text-[#a8998a] leading-relaxed">
            {t('playWithFriends.step2Desc')}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#382b1e] border border-[#523d2b] flex items-center justify-center text-amber-400 font-heading font-bold">
            3
          </div>
          <h2 className="font-heading font-bold text-lg text-[#fffdfa]">{t('playWithFriends.step3Title')}</h2>
          <p className="text-xs text-[#a8998a] leading-relaxed">
            {t('playWithFriends.step3Desc')}
          </p>
        </div>
      </section>

      {/* CTA Box */}
      <section className="p-8 rounded-3xl bg-gradient-to-br from-[#29221b] to-[#1f1914] border border-[#523d2b] text-center space-y-6">
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="font-heading font-bold text-2xl text-[#fffdfa]">
            {t('playWithFriends.ctaTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#a8998a]">
            {t('playWithFriends.ctaDesc')}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to={getLocalizedUrl('/')}
            onClick={() => sound.playClick()}
            className="py-4 px-8 rounded-2xl btn-primary text-white font-heading font-extrabold text-base flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{t('home.createRoomBtn')}</span>
          </Link>
        </div>
      </section>
    </article>
  );
};
