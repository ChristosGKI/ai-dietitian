'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Button } from '@/components/ui/button';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CookiePreferencesModal({ isOpen, onClose }: CookiePreferencesModalProps) {
  const t = useTranslations('cookieConsent');
  const { preferences, savePreferences, withdrawConsent } = useCookieConsent();
  
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    savePreferences({ functional, analytics, marketing });
    onClose();
  };

  const handleAcceptAll = () => {
    setFunctional(true);
    setAnalytics(true);
    setMarketing(true);
  };

  const handleRejectAll = () => {
    setFunctional(false);
    setAnalytics(false);
    setMarketing(false);
  };

  const handleWithdraw = () => {
    withdrawConsent();
    setShowWithdrawConfirm(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('modal.title')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-600">
            {t('modal.description')}
          </p>

          {/* Essential Cookies */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">
                  {t('modal.categories.essential.title')}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t('modal.categories.essential.description')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {t('modal.categories.essential.alwaysActive')}
                </span>
                <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Functional Cookies */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h3 className="font-medium text-gray-900">
                  {t('modal.categories.functional.title')}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t('modal.categories.functional.description')}
                </p>
              </div>
              <button
                onClick={() => setFunctional(!functional)}
                className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  functional ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={functional}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    functional ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h3 className="font-medium text-gray-900">
                  {t('modal.categories.analytics.title')}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t('modal.categories.analytics.description')}
                </p>
              </div>
              <button
                onClick={() => setAnalytics(!analytics)}
                className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  analytics ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={analytics}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    analytics ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h3 className="font-medium text-gray-900">
                  {t('modal.categories.marketing.title')}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t('modal.categories.marketing.description')}
                </p>
              </div>
              <button
                onClick={() => setMarketing(!marketing)}
                className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  marketing ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={marketing}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    marketing ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleRejectAll}
              className="flex-1 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {t('banner.rejectAll')}
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-4 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              {t('banner.acceptAll')}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setShowWithdrawConfirm(true)}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              {t('modal.withdraw')}
            </button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {t('modal.save')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Confirmation Dialog */}
      {showWithdrawConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('modal.withdraw')}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {t('modal.confirmWithdraw')}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowWithdrawConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleWithdraw}
              >
                Withdraw All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
