import React from 'react';
import { Link } from 'react-router-dom';
import { Dices, Sparkles, Mail, ShieldCheck, FileText, Info, BookOpen, HelpCircle } from 'lucide-react';
import { sound } from '../../game/soundEngine';
import { useI18n } from '../../i18n';

export const Footer: React.FC = () => {
  const { t, getLocalizedUrl } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[#382f27] bg-[#14110e] text-[#a8998a] text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#29221b]">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link
              to={getLocalizedUrl('/')}
              onClick={() => sound.playClick()}
              className="flex items-center space-x-2.5 group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md">
                <Dices className="w-4 h-4" />
              </div>
              <span className="font-heading font-extrabold text-sm text-[#f5ebd9] group-hover:text-amber-300 transition-colors">
                Snake &amp; Ladder
              </span>
            </Link>
            <p className="text-[#8c7e72] text-xs leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="text-[11px] text-[#6b5d50] flex items-center space-x-1.5 pt-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{t('footer.tag')}</span>
            </div>
          </div>

          {/* Col 2: Quick Play & Guides */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#d6c9ba]">
              {t('footer.gamesAndGuides')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to={getLocalizedUrl('/')}
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <Dices className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('footer.home')}</span>
                </Link>
              </li>
              <li>
                <Link
                  to={getLocalizedUrl('/play')}
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors"
                >
                  {t('footer.playSnakeAndLadder')}
                </Link>
              </li>
              <li>
                <Link
                  to={getLocalizedUrl('/how-to-play')}
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('footer.howToPlay')}</span>
                </Link>
              </li>
              <li>
                <Link
                  to={getLocalizedUrl('/snake-and-ladder-rules')}
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('footer.rules')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: About & Contact */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#d6c9ba]">
              {t('footer.companyAndSupport')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to={getLocalizedUrl('/about')}
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('footer.aboutUs')}</span>
                </Link>
              </li>
              <li>
                <Link
                  to={getLocalizedUrl('/contact')}
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('footer.contactUs')}</span>
                </Link>
              </li>
              <li>
                <a
                  href="mailto:fkdigitalmedia@gmail.com"
                  className="text-[11px] text-[#8c7e72] hover:text-amber-400 transition-colors block break-all font-mono"
                >
                  fkdigitalmedia@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#d6c9ba]">
              {t('footer.legalAndTrust')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to={getLocalizedUrl('/privacy-policy')}
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('footer.privacyPolicy')}</span>
                </Link>
              </li>
              <li>
                <Link
                  to={getLocalizedUrl('/terms')}
                  onClick={() => sound.playClick()}
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('footer.termsOfService')}</span>
                </Link>
              </li>
              <li className="text-[11px] text-[#736557] pt-1">
                {t('footer.guestNotice')}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6b5d50] gap-3">
          <p>© {currentYear} Snake &amp; Ladder Online. {t('footer.allRightsReserved')}</p>
          <p className="text-center sm:text-right">
            {t('footer.crossDeviceNotice')}
          </p>
        </div>
      </div>
    </footer>
  );
};
