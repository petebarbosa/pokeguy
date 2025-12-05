import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale, isValidLocale } from './i18n';

// Paths that should be skipped by middleware
const SKIP_PATHS = [
  '/_next',
  '/api',
  '/favicon.ico',
  '/file.svg',
  '/globe.svg',
  '/next.svg',
  '/vercel.svg',
  '/window.svg',
];

function shouldSkip(pathname: string): boolean {
  // Skip static files and internal paths
  return SKIP_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.includes('.');
}

function getLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  if (potentialLocale && isValidLocale(potentialLocale)) {
    return potentialLocale;
  }
  
  return null;
}

function parseAcceptLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) return defaultLocale;

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

  for (const { code } of languages) {
    if (isValidLocale(code)) {
      return code;
    }

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

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip static files and internal paths
  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  // Check if pathname already has a valid locale
  const pathnameLocale = getLocaleFromPathname(pathname);

  if (pathnameLocale) {
    // Valid locale in URL, proceed
    return NextResponse.next();
  }

  // Detect locale priority:
  // 1. Cookie preference (NEXT_LOCALE)
  // 2. Accept-Language header
  // 3. Default locale
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  
  let preferredLocale: string;
  
  if (cookieLocale && isValidLocale(cookieLocale)) {
    preferredLocale = cookieLocale;
  } else {
    preferredLocale = parseAcceptLanguage(
      request.headers.get('Accept-Language')
    );
  }

  // Redirect to locale-prefixed URL
  const newUrl = new URL(`/${preferredLocale}${pathname}${request.nextUrl.search}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
