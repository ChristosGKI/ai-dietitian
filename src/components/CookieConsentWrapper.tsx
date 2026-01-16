'use client';

import { CookieConsentBanner } from './CookieConsentBanner';
import { usePathname } from '@/i18n/routing';

export function CookieConsentWrapper() {
  const pathname = usePathname();

  // Hide cookie banner on legal pages
  const isLegalPage = pathname.startsWith('/en/legal') || 
                      pathname.startsWith('/es/legal') || 
                      pathname.startsWith('/el/legal') ||
                      pathname.includes('/cookie-policy') ||
                      pathname.includes('/privacy-policy') ||
                      pathname.includes('/terms-of-service') ||
                      pathname.includes('/data-protection');

  if (isLegalPage) {
    return null;
  }

  return <CookieConsentBanner position="bottom" />;
}
