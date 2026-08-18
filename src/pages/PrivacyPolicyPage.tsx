import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { ShieldCheck, Lock, Eye, Database, Globe, Bell, Mail, ArrowLeft } from 'lucide-react';
import { sound } from '../game/soundEngine';
import { useI18n } from '../i18n';

export const PrivacyPolicyPage: React.FC = () => {
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
        "name": t('footer.privacyPolicy'),
        "item": `${window.location.origin}${getLocalizedUrl('/privacy-policy')}`
      }
    ]
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title={t('seo.privacyTitle')}
        description={t('seo.privacyDesc')}
        canonicalPath="/privacy-policy"
        jsonLd={breadcrumbLd}
      />

      {/* Header */}
      <header className="space-y-4 text-center sm:text-left">
        <nav aria-label="Breadcrumb" className="text-xs text-[#a8998a] flex items-center justify-center sm:justify-start space-x-2">
          <Link to={getLocalizedUrl('/')} className="hover:text-[#fffdfa] transition-colors">{t('nav.home')}</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">{t('footer.privacyPolicy')}</span>
        </nav>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#29221b] text-emerald-400 text-xs font-bold border border-[#523d2b]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t('footer.privacyPolicy')}</span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#fffdfa] tracking-tight">
          {t('privacy.title')}
        </h1>

        <div className="flex items-center space-x-2 text-xs text-[#a8998a]">
          <span>{t('common.lastUpdated')}</span>
        </div>
      </header>

      {/* Introduction */}
      <section className="space-y-4 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
        <p>{t('privacy.introP1')}</p>
        <p>{t('privacy.introP2')}</p>
      </section>

      {/* Detailed Policy Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Lock className="w-5 h-5 text-amber-400" />
            <span>{t('privacy.s1Title')}</span>
          </h2>
          <p>{t('privacy.s1Desc')}</p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#a8998a]">
            <li>{t('privacy.s1Item1')}</li>
            <li>{t('privacy.s1Item2')}</li>
            <li>{t('privacy.s1Item3')}</li>
            <li>{t('privacy.s1Item4')}</li>
            <li>{t('privacy.s1Item5')}</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>{t('privacy.s2Title')}</span>
          </h2>
          <p>{t('privacy.s2Desc')}</p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#a8998a]">
            <li>{t('privacy.s2Item1')}</li>
            <li>{t('privacy.s2Item2')}</li>
            <li>{t('privacy.s2Item3')}</li>
          </ul>
          <p>{t('privacy.s2Footer')}</p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Globe className="w-5 h-5 text-sky-400" />
            <span>{t('privacy.s3Title')}</span>
          </h2>
          <p>{t('privacy.s3Desc')}</p>
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-[#1c1814] border border-[#382f27]">
              <h3 className="font-heading font-bold text-sm text-[#fffdfa]">{t('privacy.s3CloudflareTitle')}</h3>
              <p className="text-xs text-[#a8998a] mt-1">{t('privacy.s3CloudflareDesc')}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#1c1814] border border-[#382f27]">
              <h3 className="font-heading font-bold text-sm text-[#fffdfa]">{t('privacy.s3AdsTitle')}</h3>
              <p className="text-xs text-[#a8998a] mt-1">{t('privacy.s3AdsDesc')}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#1c1814] border border-[#382f27]">
              <h3 className="font-heading font-bold text-sm text-[#fffdfa]">{t('privacy.s3AnalyticsTitle')}</h3>
              <p className="text-xs text-[#a8998a] mt-1">{t('privacy.s3AnalyticsDesc')}</p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Eye className="w-5 h-5 text-amber-400" />
            <span>{t('privacy.s4Title')}</span>
          </h2>
          <p>{t('privacy.s4Desc')}</p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Bell className="w-5 h-5 text-rose-400" />
            <span>{t('privacy.s5Title')}</span>
          </h2>
          <p>{t('privacy.s5Desc')}</p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Mail className="w-5 h-5 text-amber-400" />
            <span>{t('privacy.s6Title')}</span>
          </h2>
          <p>{t('privacy.s6Desc')}</p>
          <div className="p-4 rounded-xl bg-[#1c1814] border border-[#382f27] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#fffdfa]">{t('privacy.s6EmailTitle')}</span>
              <p className="font-mono text-amber-300 text-xs sm:text-sm mt-0.5">
                <a href="mailto:fkdigitalmedia@gmail.com" className="hover:underline">
                  fkdigitalmedia@gmail.com
                </a>
              </p>
            </div>
            <a
              href="mailto:fkdigitalmedia@gmail.com"
              onClick={() => sound.playClick()}
              className="py-2 px-4 rounded-xl btn-primary text-white font-heading font-bold text-xs"
            >
              {t('privacy.s6ContactBtn')}
            </a>
          </div>
        </section>
      </div>

      {/* Footer link */}
      <footer className="pt-2">
        <Link
          to={getLocalizedUrl('/')}
          onClick={() => sound.playClick()}
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#d6c9ba] hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.returnHome')}</span>
        </Link>
      </footer>
    </article>
  );
};
