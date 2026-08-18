import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { HelpCircle, Sparkles, Play, ShieldAlert, Award, RefreshCw, Milestone } from 'lucide-react';
import { sound } from '../game/soundEngine';
import { useI18n } from '../i18n';

export const RulesPage: React.FC = () => {
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
        "name": t('nav.rules'),
        "item": `${window.location.origin}${getLocalizedUrl('/snake-and-ladder-rules')}`
      }
    ]
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title={t('seo.rulesTitle')}
        description={t('seo.rulesDesc')}
        canonicalPath="/snake-and-ladder-rules"
        jsonLd={breadcrumbLd}
      />

      {/* Header */}
      <header className="space-y-4 text-center sm:text-left">
        <nav aria-label="Breadcrumb" className="text-xs text-[#a8998a] flex items-center justify-center sm:justify-start space-x-2">
          <Link to={getLocalizedUrl('/')} className="hover:text-[#fffdfa]">{t('nav.home')}</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">{t('nav.rules')}</span>
        </nav>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#29221b] text-amber-400 text-xs font-bold border border-[#523d2b]">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t('nav.rules')}</span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#fffdfa] tracking-tight">
          {t('rulesPage.title')}
        </h1>

        <p className="text-sm sm:text-base text-[#d6c9ba] max-w-xl leading-relaxed">
          {t('rulesPage.subtitle')}
        </p>
      </header>

      {/* Structured Rules List */}
      <div className="space-y-4">
        <section className="p-6 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#382b1e] border border-[#523d2b] flex items-center justify-center text-amber-400 font-bold text-sm">
              <Milestone className="w-4 h-4" />
            </div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#fffdfa]">{t('rulesPage.rule1Title')}</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#d6c9ba] pl-11 leading-relaxed">
            {t('rulesPage.rule1Desc')}
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#382b1e] border border-[#523d2b] flex items-center justify-center text-amber-400 font-bold text-sm">
              <RefreshCw className="w-4 h-4" />
            </div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#fffdfa]">{t('rulesPage.rule2Title')}</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#d6c9ba] pl-11 leading-relaxed">
            {t('rulesPage.rule2Desc')}
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#1b382b] border border-[#2d5f47] flex items-center justify-center text-emerald-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#fffdfa]">{t('rulesPage.rule3Title')}</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#d6c9ba] pl-11 leading-relaxed">
            {t('rulesPage.rule3Desc')}
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#382b1e] border border-[#523d2b] flex items-center justify-center text-amber-400 font-bold text-sm">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#fffdfa]">{t('rulesPage.rule4Title')}</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#d6c9ba] pl-11 leading-relaxed">
            {t('rulesPage.rule4Desc')}
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#29221b] border border-[#523d2b] flex items-center justify-center text-sky-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#fffdfa]">{t('rulesPage.rule5Title')}</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#d6c9ba] pl-11 leading-relaxed">
            {t('rulesPage.rule5Desc')}
          </p>
        </section>
      </div>

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
