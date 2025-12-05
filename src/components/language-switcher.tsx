'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from '@/i18n/context';
import { locales, type Locale } from '@/i18n';
import { Button } from '@/components/ui/button';

const localeInfo: Record<Locale, { flag: string }> = {
  'en-US': { flag: '🇺🇸' },
  'pt-BR': { flag: '🇧🇷' },
  'es-PE': { flag: '🇵🇪' },
};

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-1"
        title={t(`language.${locale}`)}
      >
        <span className="text-base">{localeInfo[locale].flag}</span>
        <span className="hidden sm:inline text-xs">{t(`language.${locale}`)}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSelectLocale(loc)}
              className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                loc === locale ? 'bg-gray-50 dark:bg-gray-700/50' : ''
              }`}
            >
              <span className="text-base">{localeInfo[loc].flag}</span>
              <span className="text-sm dark:text-gray-200">{t(`language.${loc}`)}</span>
              {loc === locale && (
                <span className="ml-auto text-blue-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
