'use client';

import { createContext, useContext, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Locale, translations, defaultLocale } from './index';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  locale: Locale;
}

export function LanguageProvider({ children, locale }: LanguageProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = useCallback(
    (newLocale: Locale) => {
      // Set cookie for preference persistence
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;

      // Replace locale in pathname and navigate
      const segments = pathname.split('/');
      segments[1] = newLocale;
      const newPathname = segments.join('/');
      router.push(newPathname);
    },
    [pathname, router]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
    }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Helper function to get nested value from object using dot notation
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

// Helper function to interpolate values into a string
function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return values[key] !== undefined ? String(values[key]) : `{${key}}`;
  });
}

export function useTranslations() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useTranslations must be used within a LanguageProvider');
  }

  const { locale, setLocale } = context;

  const t = useCallback(
    (key: string, values?: Record<string, string | number>): string => {
      const translation = getNestedValue(
        translations[locale] as unknown as Record<string, unknown>,
        key
      );

      // Fallback to default locale if translation not found
      const fallback =
        translation ??
        getNestedValue(
          translations[defaultLocale] as unknown as Record<string, unknown>,
          key
        );

      if (!fallback) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }

      return values ? interpolate(fallback, values) : fallback;
    },
    [locale]
  );

  return {
    t,
    locale,
    setLocale,
  };
}

// Hook to get translations without context (for use in components that don't need setLocale)
export function useLocale() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLocale must be used within a LanguageProvider');
  }
  return context.locale;
}
