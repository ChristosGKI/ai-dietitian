export interface CookiePreferences {
  essential: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface ConsentRecord {
  version: string;
  timestamp: string;
  categories: CookiePreferences;
  source: 'banner' | 'preferences';
}

const CONSENT_VERSION = '1.0';
const CONSENT_COOKIE_EXPIRY_DAYS = 365;

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
}

/**
 * Set a cookie with the given options
 */
export function setCookie(name: string, value: string, _options?: Record<string, string>): void {
  if (typeof document === 'undefined') {
    return;
  }

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + CONSENT_COOKIE_EXPIRY_DAYS);

  const cookieString = [
    `${name}=${encodeURIComponent(value)}`,
    `path=/`,
    `expires=${expiryDate.toUTCString()}`,
    `SameSite=Lax`,
  ]
    .filter(Boolean)
    .join('; ');

  document.cookie = cookieString;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Cookie Manager for GDPR-compliant consent management
 */
export class CookieManager {
  /**
   * Get the consent record from cookies
   */
  getConsent(): ConsentRecord | null {
    const consentCookie = getCookie('consent_record');
    if (!consentCookie) {
      return null;
    }

    try {
      return JSON.parse(consentCookie) as ConsentRecord;
    } catch {
      return null;
    }
  }

  /**
   * Check if a specific category is allowed
   */
  isAllowed(category: keyof CookiePreferences): boolean {
    const consent = this.getConsent();
    if (!consent) {
      // No consent given yet - only essential is allowed
      return category === 'essential';
    }
    return consent.categories[category];
  }

  /**
   * Save consent preferences
   */
  setConsent(
    preferences: Omit<CookiePreferences, 'essential'>,
    source: 'banner' | 'preferences' = 'preferences'
  ): void {
    const record: ConsentRecord = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      categories: {
        essential: true,
        functional: preferences.functional ?? false,
        analytics: preferences.analytics ?? false,
        marketing: preferences.marketing ?? false,
      },
      source,
    };

    setCookie('consent_record', JSON.stringify(record));

    // Set individual category consent cookies for easy checking
    setCookie('consent_essential', 'true');
    setCookie('consent_functional', String(record.categories.functional));
    setCookie('consent_analytics', String(record.categories.analytics));
    setCookie('consent_marketing', String(record.categories.marketing));
  }

  /**
   * Accept all non-essential cookies
   */
  acceptAll(source: 'banner' | 'preferences' = 'banner'): void {
    this.setConsent(
      {
        functional: true,
        analytics: true,
        marketing: true,
      },
      source
    );
  }

  /**
   * Reject all non-essential cookies (keep only essential)
   */
  rejectAll(source: 'banner' | 'preferences' = 'banner'): void {
    this.setConsent(
      {
        functional: false,
        analytics: false,
        marketing: false,
      },
      source
    );
  }

  /**
   * Withdraw all consent - removes all non-essential cookies
   */
  withdraw(): void {
    // Clear consent record
    deleteCookie('consent_record');

    // Clear individual consent cookies
    deleteCookie('consent_essential');
    deleteCookie('consent_functional');
    deleteCookie('consent_analytics');
    deleteCookie('consent_marketing');

    // Clear third-party analytics cookies
    this.clearAnalyticsCookies();
  }

  /**
   * Clear analytics-related cookies
   */
  private clearAnalyticsCookies(): void {
    // Clear Google Analytics cookies
    const gaCookies = ['_ga', '_gid', '_gat', '_gat_gtag_'];
    for (const cookie of gaCookies) {
      deleteCookie(cookie);
    }

    // Clear Facebook Pixel cookies
    deleteCookie('_fbp');
    deleteCookie('_fbc');
    deleteCookie('fr');
  }

  /**
   * Check if consent has been given
   */
  hasConsent(): boolean {
    return getCookie('consent_record') !== null;
  }

  /**
   * Get current preferences as a partial object
   */
  getPreferences(): Partial<CookiePreferences> | null {
    const consent = this.getConsent();
    if (!consent) {
      return null;
    }
    return consent.categories;
  }

  /**
   * Check if the consent is expired (e.g., after policy update)
   */
  isConsentExpired(): boolean {
    const consent = this.getConsent();
    if (!consent) {
      return true;
    }

    // Check if consent version matches current version
    if (consent.version !== CONSENT_VERSION) {
      return true;
    }

    return false;
  }

  /**
   * Get consent timestamp
   */
  getConsentTimestamp(): Date | null {
    const consent = this.getConsent();
    if (!consent) {
      return null;
    }

    return new Date(consent.timestamp);
  }
}

export const cookieManager = new CookieManager();
