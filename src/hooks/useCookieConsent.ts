'use client';

import { useState, useCallback, useEffect } from 'react';
import { cookieManager, type CookiePreferences } from '@/lib/cookie-manager';

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [hasConsented, setHasConsented] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from cookies on mount
  useEffect(() => {
    const consent = cookieManager.getConsent();
    if (consent) {
      setPreferences(consent.categories);
      setHasConsented(true);
    }
    setIsLoading(false);
  }, []);

  // Accept all non-essential cookies
  const acceptAll = useCallback(async (source: 'banner' | 'preferences' = 'banner') => {
    const newPreferences: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };

    cookieManager.acceptAll(source);
    setPreferences(newPreferences);
    setHasConsented(true);

    // Also set legal_accepted cookie so user can access protected routes
    // This is needed because middleware checks for legal_accepted cookie
    if (typeof document !== 'undefined') {
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      document.cookie = `legal_accepted=true; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
    }

    // Optionally sync with backend
    await syncConsentToBackend(newPreferences);
  }, []);

  // Reject all non-essential cookies
  const rejectAll = useCallback(async (source: 'banner' | 'preferences' = 'banner') => {
    const newPreferences: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };

    cookieManager.rejectAll(source);
    setPreferences(newPreferences);
    setHasConsented(true);

    // Also set legal_accepted cookie so user can access protected routes
    // This is needed because middleware checks for legal_accepted cookie
    if (typeof document !== 'undefined') {
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      document.cookie = `legal_accepted=true; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
    }

    // Optionally sync with backend
    await syncConsentToBackend(newPreferences);
  }, []);

  // Save custom preferences
  const savePreferences = useCallback(
    async (prefs: { functional?: boolean; analytics?: boolean; marketing?: boolean }) => {
      const newPreferences: CookiePreferences = {
        essential: true,
        functional: prefs.functional ?? false,
        analytics: prefs.analytics ?? false,
        marketing: prefs.marketing ?? false,
      };

      cookieManager.setConsent(prefs as Omit<CookiePreferences, 'essential'>, 'preferences');
      setPreferences(newPreferences);
      setHasConsented(true);

      // Also set legal_accepted cookie so user can access protected routes
      // This is needed because middleware checks for legal_accepted cookie
      if (typeof document !== 'undefined') {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `legal_accepted=true; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
      }

      // Optionally sync with backend
      await syncConsentToBackend(newPreferences);
    },
    []
  );

  // Withdraw all consent
  const withdrawConsent = useCallback(async () => {
    cookieManager.withdraw();

    const defaultPreferences: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };

    setPreferences(defaultPreferences);
    setHasConsented(false);

    // Notify backend of withdrawal
    await notifyWithdrawal();
  }, []);

  // Check if a specific category is allowed
  const isAllowed = useCallback(
    (category: keyof CookiePreferences): boolean => {
      return cookieManager.isAllowed(category);
    },
    []
  );

  return {
    preferences,
    hasConsented,
    isLoading,
    acceptAll,
    rejectAll,
    savePreferences,
    withdrawConsent,
    isAllowed,
  };
}

/**
 * Sync consent to backend API
 */
async function syncConsentToBackend(preferences: CookiePreferences): Promise<void> {
  try {
    await fetch('/api/consent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        functional: preferences.functional,
        analytics: preferences.analytics,
        marketing: preferences.marketing,
        version: '1.0',
      }),
    });
  } catch (error) {
    console.error('[useCookieConsent] Failed to sync consent to backend:', error);
  }
}

/**
 * Notify backend of consent withdrawal
 */
async function notifyWithdrawal(): Promise<void> {
  try {
    await fetch('/api/consent', {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('[useCookieConsent] Failed to notify withdrawal:', error);
  }
}
