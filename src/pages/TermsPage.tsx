import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { FileText, ShieldAlert, Scale, Ban, AlertTriangle, Copyright, Mail, ArrowLeft } from 'lucide-react';
import { sound } from '../game/soundEngine';
import { useI18n } from '../i18n';

export const TermsPage: React.FC = () => {
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
        "name": t('footer.termsOfService'),
        "item": `${window.location.origin}${getLocalizedUrl('/terms')}`
      }
    ]
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title={t('seo.termsTitle')}
        description={t('seo.termsDesc')}
        canonicalPath="/terms"
        jsonLd={breadcrumbLd}
      />

      {/* Header */}
      <header className="space-y-4 text-center sm:text-left">
        <nav aria-label="Breadcrumb" className="text-xs text-[#a8998a] flex items-center justify-center sm:justify-start space-x-2">
          <Link to={getLocalizedUrl('/')} className="hover:text-[#fffdfa] transition-colors">{t('nav.home')}</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">{t('footer.termsOfService')}</span>
        </nav>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#29221b] text-amber-400 text-xs font-bold border border-[#523d2b]">
          <FileText className="w-3.5 h-3.5" />
          <span>{t('footer.termsOfService')}</span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#fffdfa] tracking-tight">
          {t('terms.title')}
        </h1>

        <div className="flex items-center space-x-2 text-xs text-[#a8998a]">
          <span>{t('common.lastUpdated')}</span>
        </div>
      </header>

      {/* Introduction */}
      <section className="space-y-4 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
        <p>{t('terms.introP1')}</p>
        <p>{t('terms.introP2')}</p>
      </section>

      {/* Structured Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-[#d6c9ba] leading-relaxed">
        {/* Section 1: Acceptance & Use */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Scale className="w-5 h-5 text-amber-400" />
            <span>{t('terms.s1Title')}</span>
          </h2>
          <p>{t('terms.s1Desc1')}</p>
          <p>{t('terms.s1Desc2')}</p>
        </section>

        {/* Section 2: User Conduct & Prohibited Activities */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Ban className="w-5 h-5 text-rose-400" />
            <span>{t('terms.s2Title')}</span>
          </h2>
          <p>{t('terms.s2Desc')}</p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#a8998a]">
            <li>{t('terms.s2Item1')}</li>
            <li>{t('terms.s2Item2')}</li>
            <li>{t('terms.s2Item3')}</li>
            <li>{t('terms.s2Item4')}</li>
            <li>{t('terms.s2Item5')}</li>
          </ul>
        </section>

        {/* Section 3: Intellectual Property */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Copyright className="w-5 h-5 text-sky-400" />
            <span>{t('terms.s3Title')}</span>
          </h2>
          <p>{t('terms.s3Desc1')}</p>
          <p>{t('terms.s3Desc2')}</p>
        </section>

        {/* Section 4: Disclaimer of Warranties */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>{t('terms.s4Title')}</span>
          </h2>
          <p>{t('terms.s4Desc1')}</p>
          <p>{t('terms.s4Desc2')}</p>
        </section>

        {/* Section 5: Limitation of Liability */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <span>{t('terms.s5Title')}</span>
          </h2>
          <p>{t('terms.s5Desc')}</p>
        </section>

        {/* Section 6: Third-Party Links & Advertising */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <FileText className="w-5 h-5 text-sky-400" />
            <span>{t('terms.s6Title')}</span>
          </h2>
          <p>{t('terms.s6Desc')}</p>
        </section>

        {/* Section 7: Changes & Contact */}
        <section className="space-y-3 bg-[#241f1a] p-6 sm:p-8 rounded-3xl border border-[#3d342c]">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-[#fffdfa] flex items-center space-x-2 border-b border-[#3d342c] pb-3">
            <Mail className="w-5 h-5 text-amber-400" />
            <span>{t('terms.s7Title')}</span>
          </h2>
          <p>{t('terms.s7Desc')}</p>
          <div className="p-4 rounded-xl bg-[#1c1814] border border-[#382f27] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#fffdfa]">{t('terms.s7EmailTitle')}</span>
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
              {t('terms.s7ContactBtn')}
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
