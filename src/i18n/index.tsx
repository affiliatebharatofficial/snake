import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SupportedLanguage, LanguageInfo, TranslationSchema } from './types';
import { en } from './locales/en';
import { hi } from './locales/hi';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { pt } from './locales/pt';
import { it } from './locales/it';
import { id } from './locales/id';
import { tr } from './locales/tr';
import { ar } from './locales/ar';
import { ru } from './locales/ru';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', englishName: 'English', dir: 'ltr', ogLocale: 'en_US' },
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', dir: 'ltr', ogLocale: 'hi_IN' },
  { code: 'es', name: 'Español', englishName: 'Spanish', dir: 'ltr', ogLocale: 'es_ES' },
  { code: 'fr', name: 'Français', englishName: 'French', dir: 'ltr', ogLocale: 'fr_FR' },
  { code: 'de', name: 'Deutsch', englishName: 'German', dir: 'ltr', ogLocale: 'de_DE' },
  { code: 'pt', name: 'Português', englishName: 'Portuguese', dir: 'ltr', ogLocale: 'pt_PT' },
  { code: 'it', name: 'Italiano', englishName: 'Italian', dir: 'ltr', ogLocale: 'it_IT' },
  { code: 'id', name: 'Bahasa Indonesia', englishName: 'Indonesian', dir: 'ltr', ogLocale: 'id_ID' },
  { code: 'tr', name: 'Türkçe', englishName: 'Turkish', dir: 'ltr', ogLocale: 'tr_TR' },
  { code: 'ar', name: 'العربية', englishName: 'Arabic', dir: 'rtl', ogLocale: 'ar_SA' },
  { code: 'ru', name: 'Русский', englishName: 'Russian', dir: 'ltr', ogLocale: 'ru_RU' },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const LOCALES: Record<SupportedLanguage, TranslationSchema> = {
  en,
  hi,
  es,
  fr,
  de,
  pt,
  it,
  id,
  tr,
  ar,
  ru,
};

const LANG_STORAGE_KEY = 'snake_ladder_lang';

export function isSupportedLanguage(code: string): code is SupportedLanguage {
  return SUPPORTED_LANGUAGES.some(l => l.code === code);
}

export function getLanguageInfo(code: SupportedLanguage): LanguageInfo {
  return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
}

/**
 * Extract language code from URL pathname (e.g. "/hi/about" -> "hi", "/about" -> "en")
 */
export function getLanguageFromPath(pathname: string): SupportedLanguage {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && isSupportedLanguage(parts[0])) {
    return parts[0];
  }
  return DEFAULT_LANGUAGE;
}

/**
 * Remove language prefix from URL pathname (e.g. "/hi/about" -> "/about", "/about" -> "/about", "/hi" -> "/")
 */
export function stripLanguageFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && isSupportedLanguage(parts[0])) {
    const remaining = parts.slice(1).join('/');
    return remaining ? `/${remaining}` : '/';
  }
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

/**
 * Construct localized path (e.g. getLocalizedPath('/about', 'hi') -> "/hi/about", getLocalizedPath('/about', 'en') -> "/about")
 */
export function getLocalizedPath(path: string, lang: SupportedLanguage = DEFAULT_LANGUAGE): string {
  const cleanPath = stripLanguageFromPath(path);
  if (lang === DEFAULT_LANGUAGE) {
    return cleanPath || '/';
  }
  if (cleanPath === '/' || cleanPath === '') {
    return `/${lang}`;
  }
  return `/${lang}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
}

/**
 * Retrieve saved language preference or browser locale
 */
export function getStoredLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && isSupportedLanguage(saved)) {
      return saved;
    }
  } catch {
    // Ignore storage issues
  }

  // Detect browser language
  if (typeof navigator !== 'undefined' && navigator.language) {
    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    if (isSupportedLanguage(browserLang)) {
      return browserLang;
    }
  }

  return DEFAULT_LANGUAGE;
}

export function setStoredLanguage(lang: SupportedLanguage): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Ignore storage issues
  }
}

interface I18nContextType {
  currentLang: SupportedLanguage;
  langInfo: LanguageInfo;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
  t: (path: string, params?: Record<string, string | number>) => string;
  changeLanguage: (newLang: SupportedLanguage) => void;
  getLocalizedUrl: (path: string, targetLang?: SupportedLanguage) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Current language derived strictly from current URL path
  const currentLang = useMemo(() => {
    return getLanguageFromPath(location.pathname);
  }, [location.pathname]);

  const langInfo = useMemo(() => getLanguageInfo(currentLang), [currentLang]);
  const isRTL = langInfo.dir === 'rtl';

  // Sync document HTML attributes (lang and dir)
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = langInfo.dir;
    if (isRTL) {
      document.documentElement.classList.add('rtl-layout');
    } else {
      document.documentElement.classList.remove('rtl-layout');
    }
    setStoredLanguage(currentLang);
  }, [currentLang, langInfo, isRTL]);

  // Translation function with deep lookup and English fallback
  const t = (pathKey: string, params?: Record<string, string | number>): string => {
    const keys = pathKey.split('.');
    let current: any = LOCALES[currentLang];
    let fallback: any = LOCALES[DEFAULT_LANGUAGE];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        current = undefined;
      }

      if (fallback && typeof fallback === 'object' && key in fallback) {
        fallback = fallback[key];
      } else {
        fallback = undefined;
      }
    }

    let result = (typeof current === 'string' ? current : typeof fallback === 'string' ? fallback : pathKey);

    if (params) {
      for (const [pKey, pVal] of Object.entries(params)) {
        result = result.replace(new RegExp(`{{${pKey}}}`, 'g'), String(pVal));
      }
    }

    return result;
  };

  // Switch language while preserving current page path
  const changeLanguage = (newLang: SupportedLanguage) => {
    if (newLang === currentLang) return;
    setStoredLanguage(newLang);
    const cleanCurrentPath = stripLanguageFromPath(location.pathname);
    const targetUrl = getLocalizedPath(cleanCurrentPath, newLang);
    navigate(targetUrl + location.search + location.hash);
  };

  const getLocalizedUrl = (path: string, targetLang: SupportedLanguage = currentLang): string => {
    return getLocalizedPath(path, targetLang);
  };

  return (
    <I18nContext.Provider
      value={{
        currentLang,
        langInfo,
        dir: langInfo.dir,
        isRTL,
        t,
        changeLanguage,
        getLocalizedUrl,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
