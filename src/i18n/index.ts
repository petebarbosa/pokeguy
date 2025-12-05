export const locales = ['en-US', 'pt-BR', 'es-PE'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en-US';

// Import all translation files
import enUS from './en-US.json';
import ptBR from './pt-BR.json';
import esPE from './es-PE.json';

export const translations = {
  'en-US': enUS,
  'pt-BR': ptBR,
  'es-PE': esPE,
} as const;

export type Translations = typeof enUS;

// Helper to check if a string is a valid locale
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
