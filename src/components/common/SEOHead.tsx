import React, { useEffect } from 'react';
import { useI18n, SUPPORTED_LANGUAGES, stripLanguageFromPath, getLocalizedPath } from '../../i18n';

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath,
  ogImage = '/og-image.png',
  noIndex = false,
  jsonLd,
}) => {
  const { currentLang, langInfo } = useI18n();

  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to create or update meta tag
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // 2. Meta Description & Robots
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // 3. Base path determination
    const cleanPath = canonicalPath !== undefined ? stripLanguageFromPath(canonicalPath) : stripLanguageFromPath(window.location.pathname);
    const origin = window.location.origin;

    // 4. Self-referencing Canonical URL
    const localizedCanonicalPath = getLocalizedPath(cleanPath, currentLang);
    const fullCanonicalUrl = `${origin}${localizedCanonicalPath === '/' && currentLang === 'en' ? '' : localizedCanonicalPath}`;

    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = fullCanonicalUrl || `${origin}/`;

    // 5. Generate Hreflang Tags for all 10 supported languages + x-default
    // Remove existing dynamic hreflang tags
    document.querySelectorAll('link[rel="alternate"][data-i18n-hreflang="true"]').forEach(el => el.remove());

    // x-default -> English default path
    const xDefaultLink = document.createElement('link');
    xDefaultLink.rel = 'alternate';
    xDefaultLink.hreflang = 'x-default';
    xDefaultLink.href = `${origin}${getLocalizedPath(cleanPath, 'en')}`;
    xDefaultLink.setAttribute('data-i18n-hreflang', 'true');
    document.head.appendChild(xDefaultLink);

    // Language alternates
    SUPPORTED_LANGUAGES.forEach(lang => {
      const altLink = document.createElement('link');
      altLink.rel = 'alternate';
      altLink.hreflang = lang.code;
      altLink.href = `${origin}${getLocalizedPath(cleanPath, lang.code)}`;
      altLink.setAttribute('data-i18n-hreflang', 'true');
      document.head.appendChild(altLink);
    });

    // 6. Open Graph Tags
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${origin}${ogImage}`;
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', fullCanonicalUrl || `${origin}/`);
    setMetaTag('property', 'og:image', fullOgImage);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', 'Snake & Ladder Online');
    setMetaTag('property', 'og:locale', langInfo.ogLocale);

    // 7. Twitter / X Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', fullOgImage);

    // 8. JSON-LD Structured Data
    const existingScript = document.getElementById('dynamic-json-ld');
    if (existingScript) {
      existingScript.remove();
    }

    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'dynamic-json-ld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const scriptToRemove = document.getElementById('dynamic-json-ld');
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [title, description, canonicalPath, ogImage, noIndex, jsonLd, currentLang, langInfo]);

  return null;
};
