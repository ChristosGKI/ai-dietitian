// lib/analytics.ts
'use client';

import { cookieManager } from './cookie-manager';

/**
 * Unified analytics tracking interface
 * Automatically checks consent before tracking
 */
export const analytics = {
  /**
   * Track page view
   */
  pageView(url: string, title?: string) {
    if (!cookieManager.isAllowed('analytics')) return;

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: url,
        page_title: title,
      });
    }

    // Vercel Analytics
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('pageview', { path: url });
    }

    console.log('[Analytics] Page view tracked:', url);
  },

  /**
   * Track custom event
   */
  event(eventName: string, params?: Record<string, any>) {
    if (!cookieManager.isAllowed('analytics')) return;

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }

    // Vercel Analytics
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('event', { name: eventName, data: params });
    }

    console.log('[Analytics] Event tracked:', eventName, params);
  },

  /**
   * Track conversion (requires marketing consent)
   */
  conversion(conversionName: string, value?: number, currency = 'USD') {
    if (!cookieManager.isAllowed('marketing')) return;

    // Google Ads
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID,
        value: value,
        currency: currency,
        transaction_id: '',
      });
    }

    // Meta Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', conversionName, {
        value: value,
        currency: currency,
      });
    }

    console.log('[Analytics] Conversion tracked:', conversionName, value);
  },

  /**
   * Track e-commerce purchase
   */
  purchase(params: {
    transactionId: string;
    value: number;
    currency?: string;
    items?: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
  }) {
    if (!cookieManager.isAllowed('marketing')) return;

    const { transactionId, value, currency = 'USD', items = [] } = params;

    // Google Analytics 4 - Enhanced E-commerce
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: currency,
        items: items,
      });
    }

    // Meta Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: value,
        currency: currency,
        content_ids: items.map((item) => item.id),
        content_type: 'product',
      });
    }

    console.log('[Analytics] Purchase tracked:', transactionId, value);
  },

  /**
   * Track user signup
   */
  signup(method?: string) {
    if (!cookieManager.isAllowed('analytics')) return;

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'sign_up', {
        method: method || 'email',
      });
    }

    // Meta Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'CompleteRegistration', {
        method: method,
      });
    }

    console.log('[Analytics] Signup tracked:', method);
  },

  /**
   * Track form submission
   */
  formSubmit(formName: string, formData?: Record<string, any>) {
    if (!cookieManager.isAllowed('analytics')) return;

    this.event('form_submit', {
      form_name: formName,
      ...formData,
    });
  },

  /**
   * Track button click
   */
  buttonClick(buttonName: string, location?: string) {
    if (!cookieManager.isAllowed('analytics')) return;

    this.event('button_click', {
      button_name: buttonName,
      location: location,
    });
  },

  /**
   * Track error
   */
  error(errorMessage: string, errorType?: string) {
    if (!cookieManager.isAllowed('analytics')) return;

    this.event('error', {
      error_message: errorMessage,
      error_type: errorType || 'unknown',
    });
  },

  /**
   * Set user properties (requires analytics consent)
   */
  setUser(userId: string, properties?: Record<string, any>) {
    if (!cookieManager.isAllowed('analytics')) return;

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        user_id: userId,
        ...properties,
      });
    }

    console.log('[Analytics] User properties set:', userId);
  },
};

/**
 * React hook for analytics tracking
 */
export function useAnalytics() {
  return {
    trackPageView: analytics.pageView,
    trackEvent: analytics.event,
    trackConversion: analytics.conversion,
    trackPurchase: analytics.purchase,
    trackSignup: analytics.signup,
    trackFormSubmit: analytics.formSubmit,
    trackButtonClick: analytics.buttonClick,
    trackError: analytics.error,
    setUser: analytics.setUser,
  };
}

/**
 * Track page views automatically in Next.js app router
 * Add to your root layout or a client component
 */
export function AnalyticsPageTracker() {
  if (typeof window === 'undefined') return null;

  // Track page view on mount and route changes
  React.useEffect(() => {
    const handleRouteChange = () => {
      analytics.pageView(window.location.pathname, document.title);
    };

    // Track initial page view
    handleRouteChange();

    // Listen for route changes (Next.js App Router)
    const observer = new MutationObserver(handleRouteChange);
    observer.observe(document.querySelector('title') || document.head, {
      subtree: true,
      characterData: true,
      childList: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

// Import React for the component
import React from 'react';