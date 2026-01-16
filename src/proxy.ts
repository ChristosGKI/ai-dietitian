import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// Routes that require legal acceptance to access
// NOTE: Protection is handled by LanguageSelectorWrapper which shows on all pages
// until legal_accepted cookie is set. The middleware no longer blocks access.
const PROTECTED_ROUTES = ['/onboarding', '/payment'];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if this is a locale-prefixed path
  const pathnameIsMissingLocale = routing.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
  
  // Redirect to locale-prefixed path if missing
  if (pathnameIsMissingLocale) {
    // Check if user has already accepted (has NEXT_LOCALE cookie)
    const userLocale = request.cookies.get('NEXT_LOCALE')?.value;
    const locale = userLocale && routing.locales.includes(userLocale as any) 
      ? userLocale 
      : routing.defaultLocale;
    
    // Preserve query strings
    const search = request.nextUrl.search;
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}${search}`, request.url)
    );
  }
  
  // Get the locale from the pathname
  const locale = pathname.split('/')[1];
  
  // Check if we're on a legal page (these are always accessible)
  const isLegalPage = pathname.includes('/privacy-policy') || 
                      pathname.includes('/cookie-policy') || 
                      pathname.includes('/data-protection') || 
                      pathname.includes('/terms-of-service') ||
                      pathname.includes('/legal');
  
  // NOTE: Legal acceptance check has been moved to client-side (LanguageSelectorWrapper)
  // The language selector shows on all non-legal pages until user accepts
  // This allows navigation to protected routes so users can accept on those pages
  
  // Check legal acceptance for locale cookie setting
  // Cookie is set when user selects language from the selector
  const legalAccepted = request.cookies.get('legal_accepted')?.value;
  const hasLegalAcceptance = legalAccepted !== undefined && legalAccepted !== '';
  
  // Create response for locale-prefixed paths
  const response = NextResponse.next();
  
  // Don't set/update locale cookie on legal pages
  // Legal pages should not affect locale cookie so users can read policies before accepting
  if (isLegalPage) {
    return response;
  }
  
  // Only set the locale cookie if user has already accepted legal terms
  // This prevents the cookie from being set before they see the modal
  if (hasLegalAcceptance) {
    if (routing.locales.includes(locale as any)) {
      response.cookies.set('NEXT_LOCALE', locale, {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }
  }
  
  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next`, `/_vercel` or `/_WIP`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // - … the static files (public folder)
  matcher: ['/((?!api|trpc|_next|_vercel|_WIP|.*\\..*).*)']
};
