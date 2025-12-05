import { Locale, locales, defaultLocale, isValidLocale } from './index';

/**
 * Get locale from URL pathname
 */
export function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];

  if (potentialLocale && isValidLocale(potentialLocale)) {
    return potentialLocale;
  }

  return null;
}

/**
 * Parse Accept-Language header and return the best matching locale
 */
export function parseAcceptLanguage(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  // Parse the Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, qValue] = lang.trim().split(';q=');
      return {
        code: code.trim(),
        quality: qValue ? parseFloat(qValue) : 1.0,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find the best matching locale
  for (const { code } of languages) {
    // Try exact match first
    if (isValidLocale(code)) {
      return code;
    }

    // Try matching just the language part (e.g., 'en' matches 'en-US')
    const languageOnly = code.split('-')[0];
    const matchingLocale = locales.find((locale) =>
      locale.toLowerCase().startsWith(languageOnly.toLowerCase())
    );

    if (matchingLocale) {
      return matchingLocale;
    }
  }

  return defaultLocale;
}

/**
 * Remove locale prefix from pathname
 */
export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/');
  if (segments[1] && isValidLocale(segments[1])) {
    segments.splice(1, 1);
    return segments.join('/') || '/';
  }
  return pathname;
}
