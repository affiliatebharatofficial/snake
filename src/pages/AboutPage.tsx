import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { Dices, Users, Shield, Zap, Sparkles, Play, MonitorSmartphone, Heart, ArrowRight } from 'lucide-react';
import { sound } from '../game/soundEngine';
import { useI18n } from '../i18n';

export const AboutPage: React.FC = () => {
  const { t, getLocalizedUrl, currentLang } = useI18n();

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
        "name": t('nav.about'),
        "item": `${window.location.origin}${getLocalizedUrl('/about')}`
      }
    ]
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title={t('seo.aboutTitle')}
        description={t('seo.aboutDesc')}
        canonicalPath="/about"
        jsonLd={breadcrumbLd}
      />

      {/* Header */}
      <header className="space-y-4 text-center sm:text-left">
        <nav aria-label="Breadcrumb" className="text-xs text-[#a8998a] flex items-center justify-center sm:justify-start space-x-2">
          <Link to={getLocalizedUrl('/')} className="hover:text-[#fffdfa] transition-colors">{t('nav.home')}</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">{t('nav.about')}</span>
        </nav>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#29221b] text-amber-400 text-xs font-bold border border-[#523d2b]">
          <Dices className="w-3.5 h-3.5" />
          <span>{t('nav.about')}</span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#fffdfa] tracking-tight">
          {t('about.title')}
        </h1>

        <p className="text-sm sm:text-base text-[#d6c9ba] max-w-2xl leading-relaxed">
          {t('about.subtitle')}
        </p>
      </header>

      {/* Main Narrative Section */}
      <section className="space-y-4 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
        <h2 className="font-heading font-black text-xl sm:text-2xl text-[#fffdfa] border-b border-[#3d342c] pb-3 flex items-center space-x-2">
          <Heart className="w-5 h-5 text-rose-400" />
          <span>{t('about.storyTitle')}</span>
        </h2>
        <p>{t('about.storyP1')}</p>
        <p>{t('about.storyP2')}</p>
        <p><strong>Snake &amp; Ladder Online</strong> {t('about.storyP3')}</p>
      </section>

      {/* Core Principles Grid */}
      <section className="space-y-4">
        <h2 className="font-heading font-black text-xl sm:text-2xl text-[#fffdfa]">
          {t('about.principlesTitle')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#332a22] border border-[#523d2b] flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">{t('about.zeroAccountTitle')}</h3>
            <p className="text-xs text-[#a8998a] leading-relaxed">
              {t('about.zeroAccountDesc')}
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#332a22] border border-[#523d2b] flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">{t('about.realtimeTitle')}</h3>
            <p className="text-xs text-[#a8998a] leading-relaxed">
              {t('about.realtimeDesc')}
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#332a22] border border-[#523d2b] flex items-center justify-center text-amber-400">
              <MonitorSmartphone className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">{t('about.crossDeviceTitle')}</h3>
            <p className="text-xs text-[#a8998a] leading-relaxed">
              {t('about.crossDeviceDesc')}
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#332a22] border border-[#523d2b] flex items-center justify-center text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#fffdfa]">{t('about.fairPlayTitle')}</h3>
            <p className="text-xs text-[#a8998a] leading-relaxed">
              {t('about.fairPlayDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* Board Craftsmanship Section */}
      <section className="space-y-4 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
        <h2 className="font-heading font-black text-xl sm:text-2xl text-[#fffdfa] border-b border-[#3d342c] pb-3 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{t('about.craftsmanshipTitle')}</span>
        </h2>
        <p>{t('about.craftsmanshipDesc')}</p>
      </section>

      {/* Getting in Touch & CTA */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#29221b] to-[#1f1914] border border-[#523d2b] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-heading font-bold text-lg text-[#fffdfa]">{t('about.ctaTitle')}</h3>
          <p className="text-xs text-[#a8998a] max-w-md">{t('about.ctaDesc')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={getLocalizedUrl('/contact')}
            onClick={() => sound.playClick()}
            className="py-3 px-5 rounded-xl btn-secondary text-white font-heading font-bold text-xs flex items-center space-x-1.5 transition-all"
          >
            <span>{t('nav.contact')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to={getLocalizedUrl('/')}
            onClick={() => sound.playClick()}
            className="py-3 px-6 rounded-xl btn-primary text-white font-heading font-extrabold text-xs flex items-center space-x-1.5 transition-all hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{t('common.playNow')}</span>
          </Link>
        </div>
      </section>
    </article>
  );
};
