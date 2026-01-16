'use client';

import { usePathname } from '@/i18n/routing';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

const LanguageSelector = dynamic(
  () => import('./LanguageSelectorPopup').then((mod) => mod.LanguageSelector),
  { ssr: false }
);

function isLegalPage(pathname: string): boolean {
  const legalPaths = ['/privacy-policy', '/cookie-policy', '/data-protection', '/terms-of-service', '/legal'];
  return legalPaths.some(path => pathname.includes(path));
}

export function LanguageSelectorWrapper() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const hasCookieConsent = useCookieConsent();
  
  // Wait for mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Show language selector on all pages except legal pages
  // On legal pages, use LegalPageLanguageSwitcher instead
  if (!mounted || isLegalPage(pathname) || hasCookieConsent) {
    return null;
  }
  
  return <LanguageSelector />;
}