'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { CookiePreferencesModal } from './CookiePreferencesModal';

export function CookieSettingsLink() {
  const t = useTranslations('cookieConsent');
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
      >
        {t('footer.linkText')}
      </button>

      <CookiePreferencesModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
