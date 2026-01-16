'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { CookiePreferencesModal } from './CookiePreferencesModal';

interface CookieConsentBannerProps {
  position?: 'bottom' | 'top';
}

export function CookieConsentBanner({ position = 'bottom' }: CookieConsentBannerProps) {
  const t = useTranslations('cookieConsent');
  const locale = useLocale();
  const { acceptAll, rejectAll, hasConsented } = useCookieConsent();
  const [showModal, setShowModal] = useState(false);

  // Don't show if user has already consented
  if (hasConsented) {
    return null;
  }

  const handleAcceptAll = () => {
    acceptAll('banner');
  };

  const handleRejectAll = () => {
    rejectAll('banner');
  };

  const handleCustomize = () => {
    setShowModal(true);
  };

  return (
    <>
      <div
        className={`fixed ${
          position === 'bottom' ? 'bottom-0' : 'top-0'
        } left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-bottom duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Text Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🍪</span>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('banner.title')}
                </h3>
              </div>
              <p className="text-sm text-gray-600 max-w-2xl">
                {t('banner.description')}
              </p>
              <a
                href={`/${locale}/cookie-policy`}
                className="text-sm text-emerald-600 hover:text-emerald-700 underline mt-1 inline-block"
              >
                {t('banner.learnMore')}
              </a>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors min-w-[120px]"
              >
                {t('banner.acceptAll')}
              </button>
              <button
                onClick={handleRejectAll}
                className="px-6 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors min-w-[120px]"
              >
                {t('banner.rejectAll')}
              </button>
              <button
                onClick={handleCustomize}
                className="px-4 py-2.5 text-emerald-600 font-medium hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                {t('banner.customize')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for banner at bottom */}
      {position === 'bottom' && !hasConsented && (
        <div className="h-32" aria-hidden="true" />
      )}

      {/* Preferences Modal */}
      <CookiePreferencesModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
