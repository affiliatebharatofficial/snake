import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { BookOpen, Dices, ArrowUpRight, ArrowDownRight, Trophy, Sparkles, Play } from 'lucide-react';
import { DEFAULT_LADDERS, DEFAULT_SNAKES } from '../game/boardConfig';
import { sound } from '../game/soundEngine';
import { useI18n } from '../i18n';

export const HowToPlayPage: React.FC = () => {
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
        "name": t('nav.howToPlay'),
        "item": `${window.location.origin}${getLocalizedUrl('/how-to-play')}`
      }
    ]
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title={t('seo.howToPlayTitle')}
        description={t('seo.howToPlayDesc')}
        canonicalPath="/how-to-play"
        jsonLd={breadcrumbLd}
      />

      {/* Header */}
      <header className="space-y-4 text-center sm:text-left">
        <nav aria-label="Breadcrumb" className="text-xs text-[#a8998a] flex items-center justify-center sm:justify-start space-x-2">
          <Link to={getLocalizedUrl('/')} className="hover:text-[#fffdfa]">{t('nav.home')}</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">{t('nav.howToPlay')}</span>
        </nav>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#29221b] text-amber-400 text-xs font-bold border border-[#523d2b]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t('nav.howToPlay')}</span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#fffdfa] tracking-tight">
          {t('howToPlay.title')}
        </h1>

        <p className="text-sm sm:text-base text-[#d6c9ba] max-w-xl leading-relaxed">
          {t('howToPlay.subtitle')}
        </p>
      </header>

      {/* Rules Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#382b1e] border border-[#523d2b] flex items-center justify-center text-amber-400">
            <Dices className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-lg text-[#fffdfa]">{t('howToPlay.step1Title')}</h2>
          <p className="text-xs sm:text-sm text-[#d6c9ba] leading-relaxed">
            {t('howToPlay.step1Desc')}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#1b382b] border border-[#2d5f47] flex items-center justify-center text-emerald-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-lg text-[#fffdfa]">{t('howToPlay.step2Title')}</h2>
          <p className="text-xs sm:text-sm text-[#d6c9ba] leading-relaxed">
            {t('howToPlay.step2Desc')}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#3d1d1a] border border-[#5c2d27] flex items-center justify-center text-rose-400">
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-lg text-[#fffdfa]">{t('howToPlay.step3Title')}</h2>
          <p className="text-xs sm:text-sm text-[#d6c9ba] leading-relaxed">
            {t('howToPlay.step3Desc')}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#382b1e] border border-[#523d2b] flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-lg text-[#fffdfa]">{t('howToPlay.step4Title')}</h2>
          <p className="text-xs sm:text-sm text-[#d6c9ba] leading-relaxed">
            {t('howToPlay.step4Desc')}
          </p>
        </div>
      </section>

      {/* Board Shortcuts Reference */}
      <section className="p-6 rounded-3xl bg-[#241f1a] border border-[#3d342c] space-y-6">
        <h2 className="font-heading font-bold text-xl text-[#fffdfa] flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{t('howToPlay.shortcutsTitle')}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Ladders Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {t('howToPlay.laddersHeader')}
            </h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
              {DEFAULT_LADDERS.map(l => (
                <div key={l.id} className="p-2 rounded-lg bg-[#1c1814] border border-[#382f27] text-[#d6c9ba] flex justify-between">
                  <span>{l.start}</span>
                  <span className="text-emerald-400 font-bold">➔ {l.end}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Snakes Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              {t('howToPlay.snakesHeader')}
            </h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
              {DEFAULT_SNAKES.map(s => (
                <div key={s.id} className="p-2 rounded-lg bg-[#1c1814] border border-[#382f27] text-[#d6c9ba] flex justify-between">
                  <span>{s.start}</span>
                  <span className="text-rose-400 font-bold">➔ {s.end}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <footer className="text-center pt-2">
        <Link
          to={getLocalizedUrl('/')}
          onClick={() => sound.playClick()}
          className="inline-flex items-center space-x-2 py-4 px-8 rounded-2xl btn-primary text-white font-heading font-extrabold text-base transition-all hover:scale-105 active:scale-95"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>{t('common.playNow')}</span>
        </Link>
      </footer>
    </article>
  );
};
