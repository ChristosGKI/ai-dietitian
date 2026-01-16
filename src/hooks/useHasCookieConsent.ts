'use client';

import { useEffect, useState } from 'react';
import { cookieManager } from '@/lib/cookie-manager';

export function useHasCookieConsent(): boolean {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check if consent cookie exists
    setHasConsent(cookieManager.hasConsent());
  }, []);

  return hasConsent;
}
