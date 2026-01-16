// components/CookieConsentBanner.tsx
'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { CookiePreferencesModal } from './CookiePreferencesModal';

interface CookieConsentBannerProps {
  position?: 'bottom' | 'top';
}

interface GeoData {
  countryCode: string | null;
  isInEU: boolean;
}

export function CookieConsentBanner({ position = 'bottom' }: CookieConsentBannerProps) {
  const t = useTranslations('cookieConsent');
  const locale = useLocale();
  const { acceptAll, rejectAll, hasConsented, isLoading } = useCookieConsent();
  const [showModal, setShowModal] = useState(false);
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [isGeoLoading, setIsGeoLoading] = useState(true);

  // Fetch user's geo location
  useEffect(() => {
    async function fetchGeoData() {
      try {
        const response = await fetch('/api/geo');
        const data = await response.json();
        setGeoData(data);
      } catch (error) {
        console.error('[CookieConsent] Failed to fetch geo data:', error);
        // Default to non-EU if detection fails
        setGeoData({ countryCode: null, isInEU: false });
      } finally {
        setIsGeoLoading(false);
      }
    }

    fetchGeoData();
  }, []);

  // Don't show banner if already consented or still loading
  if (hasConsented || isLoading || isGeoLoading) {
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

  // Smart defaults based on region
  const showRejectButton = geoData?.isInEU ?? true; // Show reject for EU users and by default
  const bannerIntensity = geoData?.isInEU ? 'strict' : 'balanced'; // EU gets stricter compliance
  
  return (
    <>
      <div
        className={`fixed ${
          position === 'bottom' ? 'bottom-0' : 'top-0'
        } left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl animate-in slide-in-from-bottom duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Text Content */}
            <div className="flex-1 max-w-3xl">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-2xl">🍪</span>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('banner.title')}
                </h3>
                {geoData?.isInEU && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    GDPR
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {geoData?.isInEU 
                  ? t('banner.descriptionEU') || t('banner.description')
                  : t('banner.description')
                }
              </p>
              <div className="flex items-center gap-4 mt-2">
                <a
                  href={`/${locale}/cookie-policy`}
                  className="text-sm text-emerald-600 hover:text-emerald-700 underline font-medium"
                >
                  {t('banner.learnMore')}
                </a>
                <a
                  href={`/${locale}/privacy-policy`}
                  className="text-sm text-gray-600 hover:text-gray-700 underline"
                >
                  Privacy Policy
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 sm:flex-shrink-0">
              {showRejectButton && (
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-2.5 bg-white text-gray-700 font-medium rounded-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all min-w-[120px]"
                >
                  {t('banner.rejectAll')}
                </button>
              )}
              <button
                onClick={handleCustomize}
                className="px-5 py-2.5 text-emerald-700 font-medium hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
              >
                {t('banner.customize')}
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md min-w-[120px]"
              >
                {t('banner.acceptAll')}
              </button>
            </div>
          </div>

          {/* EU Privacy Notice */}
          {geoData?.isInEU && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                🇪🇺 {t('banner.euNotice') || 'Under GDPR, you have the right to control your data. You can withdraw consent at any time through Cookie Settings in the footer.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Spacer for banner at bottom */}
      {position === 'bottom' && !hasConsented && (
        <div className="h-40 sm:h-32" aria-hidden="true" />
      )}

      {/* Preferences Modal */}
      <CookiePreferencesModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEUUser={geoData?.isInEU ?? false}
      />
    </>
  );
}