import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useI18n, SUPPORTED_LANGUAGES } from '../../i18n';
import { SupportedLanguage } from '../../i18n/types';
import { sound } from '../../game/soundEngine';

interface LanguageSelectorProps {
  isMobile?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isMobile = false }) => {
  const { currentLang, changeLanguage, langInfo, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: SupportedLanguage) => {
    sound.playClick();
    changeLanguage(code);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div className="pt-2 border-t border-[#382f27] space-y-2">
        <label className="text-xs font-bold text-[#a8998a] flex items-center space-x-1.5 uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('nav.selectLanguage')}</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center justify-between border transition-all text-left ${
                currentLang === lang.code
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                  : 'bg-[#29221b] hover:bg-[#382e25] border-[#4a3b30] text-[#d6c9ba]'
              }`}
            >
              <span>{lang.name}</span>
              {currentLang === lang.code && <Check className="w-3 h-3 text-amber-400" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          sound.playClick();
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-1.5 py-1.5 px-3 rounded-xl bg-[#29221b] hover:bg-[#382e25] border border-[#523d2b] text-[#f5ebd9] transition-all text-xs font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t('nav.selectLanguage')}
      >
        <Globe className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-medium">{langInfo.name}</span>
        <ChevronDown className={`w-3 h-3 text-[#a8998a] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#241f1a] border-2 border-[#523d2b] shadow-2xl z-50 py-1.5 max-h-80 overflow-y-auto focus:outline-none">
          <div className="px-3 py-1.5 text-[10px] font-bold text-[#8c7e72] uppercase tracking-wider border-b border-[#382f27] mb-1">
            {t('nav.selectLanguage')}
          </div>
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`w-full px-3 py-2 text-xs font-bold flex items-center justify-between transition-colors text-left ${
                currentLang === lang.code
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-[#d6c9ba] hover:bg-[#312a23] hover:text-[#fffdfa]'
              }`}
            >
              <div className="flex flex-col">
                <span>{lang.name}</span>
                <span className="text-[10px] text-[#8c7e72] font-normal">{lang.englishName}</span>
              </div>
              {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
