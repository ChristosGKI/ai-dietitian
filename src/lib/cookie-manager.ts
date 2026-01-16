// lib/cookie-manager.ts
'use client';

export interface CookiePreferences {
  essential: boolean;
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

class CookieManager {
  private readonly CONSENT_COOKIE = 'cookie_consent';
  private readonly VERSION = '1.0';
  private readonly EXPIRY_DAYS = 365;

  /**
   * Get the full consent record
   */
  getConsent(): ConsentRecord | null {
    if (typeof window === 'undefined') return null;

    try {
      const value = this.getCookie(this.CONSENT_COOKIE);
      if (!value) return null;

      const record = JSON.parse(decodeURIComponent(value)) as ConsentRecord;
      return record;
    } catch (error) {
      console.error('[CookieManager] Error parsing consent:', error);
      return null;
    }
  }

  /**
   * Check if user has given any consent (shows/hides banner)
   */
  hasConsent(): boolean {
    return this.getConsent() !== null;
  }

  /**
   * Set consent preferences
   */
  setConsent(
    preferences: Omit<CookiePreferences, 'essential'>,
    source: 'banner' | 'preferences' = 'banner'
  ): void {
    const fullPreferences: CookiePreferences = {
      essential: true,
      ...preferences,
    };

    const record: ConsentRecord = {
      version: this.VERSION,
      timestamp: new Date().toISOString(),
      categories: fullPreferences,
      source,
    };

    // Save the consent record
    this.setCookie(
      this.CONSENT_COOKIE,
      JSON.stringify(record),
      this.EXPIRY_DAYS
    );

    // Set individual category cookies for easier checking
    this.setCategoryCookies(fullPreferences);

    // Set legal acceptance cookie
    this.setCookie('legal_accepted', 'true', this.EXPIRY_DAYS);

    // Trigger analytics/marketing scripts based on preferences
    this.triggerScripts(fullPreferences);
  }

  /**
   * Accept all cookies
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
   * Reject all non-essential cookies
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
   * Withdraw all consent
   */
  withdraw(): void {
    // Remove all consent cookies
    this.deleteCookie(this.CONSENT_COOKIE);
    this.deleteCookie('consent_essential');
    this.deleteCookie('consent_functional');
    this.deleteCookie('consent_analytics');
    this.deleteCookie('consent_marketing');
    
    // Don't remove legal_accepted as they can still access the site
    // but reset to show banner again

    // Clear any analytics/marketing scripts
    this.clearScripts();
  }

  /**
   * Check if a specific category is allowed
   */
  isAllowed(category: keyof CookiePreferences): boolean {
    const consent = this.getConsent();
    if (!consent) return category === 'essential';
    return consent.categories[category];
  }

  /**
   * Set individual category cookies for easier server-side checking
   */
  private setCategoryCookies(preferences: CookiePreferences): void {
    Object.entries(preferences).forEach(([category, allowed]) => {
      this.setCookie(
        `consent_${category}`,
        allowed.toString(),
        this.EXPIRY_DAYS
      );
    });
  }

  /**
   * Trigger analytics and marketing scripts based on consent
   */
  private triggerScripts(preferences: CookiePreferences): void {
    if (typeof window === 'undefined') return;

    // Dispatch custom event for third-party integrations to listen to
    window.dispatchEvent(
      new CustomEvent('cookieConsentUpdate', {
        detail: { preferences },
      })
    );

    // Google Analytics 4
    if (preferences.analytics) {
      this.initializeGA4();
    }

    // Google Tag Manager
    if (preferences.analytics || preferences.marketing) {
      this.initializeGTM();
    }

    // Meta Pixel
    if (preferences.marketing) {
      this.initializeMetaPixel();
    }

    // Vercel Analytics
    if (preferences.analytics) {
      this.initializeVercelAnalytics();
    }
  }

  /**
   * Initialize Google Analytics 4
   */
  private initializeGA4(): void {
    if (typeof window === 'undefined') return;

    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (!GA_MEASUREMENT_ID) return;

    // Check if already initialized
    if ((window as any).gtag) return;

    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      cookie_flags: 'SameSite=Lax;Secure',
      anonymize_ip: true,
    });
  }

  /**
   * Initialize Google Tag Manager
   */
  private initializeGTM(): void {
    if (typeof window === 'undefined') return;

    const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
    if (!GTM_ID) return;

    // Check if already initialized
    if ((window as any).google_tag_manager) return;

    // Initialize dataLayer
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });

    // Load GTM script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(script);
  }

  /**
   * Initialize Meta Pixel
   */
  private initializeMetaPixel(): void {
    if (typeof window === 'undefined') return;

    const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    if (!META_PIXEL_ID) return;

    // Check if already initialized
    if ((window as any).fbq) return;

    // Initialize Meta Pixel
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );

    (window as any).fbq('init', META_PIXEL_ID);
    (window as any).fbq('track', 'PageView');
  }

  /**
   * Initialize Vercel Analytics
   */
  private initializeVercelAnalytics(): void {
    if (typeof window === 'undefined') return;

    // Vercel Analytics is typically loaded via package
    // This is a placeholder for custom initialization if needed
    const event = new CustomEvent('vercelAnalyticsConsent', {
      detail: { granted: true },
    });
    window.dispatchEvent(event);
  }

  /**
   * Clear analytics and marketing scripts
   */
  private clearScripts(): void {
    if (typeof window === 'undefined') return;

    // Clear Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }

    // Clear Meta Pixel
    if ((window as any).fbq) {
      (window as any).fbq('consent', 'revoke');
    }

    // Dispatch custom event
    window.dispatchEvent(
      new CustomEvent('cookieConsentUpdate', {
        detail: {
          preferences: {
            essential: true,
            functional: false,
            analytics: false,
            marketing: false,
          },
        },
      })
    );
  }

  /**
   * Helper: Get cookie value
   */
  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  /**
   * Helper: Set cookie
   */
  private setCookie(name: string, value: string, days: number): void {
    if (typeof document === 'undefined') return;

    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax;Secure`;
  }

  /**
   * Helper: Delete cookie
   */
  private deleteCookie(name: string): void {
    if (typeof document === 'undefined') return;

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
}

export const cookieManager = new CookieManager();