// components/CookiePreferencesModal.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Button } from '@/components/ui/button';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEUUser?: boolean;
}

export function CookiePreferencesModal({ 
  isOpen, 
  onClose,
  isEUUser = false 
}: CookiePreferencesModalProps) {
  const t = useTranslations('cookieConsent');
  const { preferences, savePreferences, withdrawConsent } = useCookieConsent();
  
  const [functional, setFunctional] = useState(preferences?.functional ?? false);
  const [analytics, setAnalytics] = useState(preferences?.analytics ?? false);
  const [marketing, setMarketing] = useState(preferences?.marketing ?? false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Update state when preferences change or modal opens
  useEffect(() => {
    if (isOpen && preferences) {
      setFunctional(preferences.functional);
      setAnalytics(preferences.analytics);
      setMarketing(preferences.marketing);
    }
  }, [isOpen, preferences]);

  if (!isOpen) {
    return null;
  }

  const handleSave = async () => {
    await savePreferences({ functional, analytics, marketing });
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

  const handleWithdraw = async () => {
    await withdrawConsent();
    setShowWithdrawConfirm(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Calculate what will be enabled
  const enabledCount = [functional, analytics, marketing].filter(Boolean).length + 1; // +1 for essential

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-gray-200 px-6 py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <span className="text-2xl">🍪</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t('modal.title')}
                </h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  {enabledCount} of 4 categories enabled
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-white/50"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-blue-900 font-medium">
                  {isEUUser ? '🇪🇺 GDPR Compliance' : 'Privacy Controls'}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  {t('modal.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Essential Cookies */}
          <div className="p-5 bg-emerald-50 rounded-xl border-2 border-emerald-200 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-bold text-gray-900">
                    {t('modal.categories.essential.title')}
                  </h3>
                </div>
                <p className="text-sm text-gray-700">
                  {t('modal.categories.essential.description')}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  {t('modal.categories.essential.alwaysActive')}
                </span>
                <div className="w-12 h-6 bg-emerald-500 rounded-full relative shadow-inner">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>
            </div>
          </div>

          {/* Functional Cookies */}
          <CookieCategory
            title={t('modal.categories.functional.title')}
            description={t('modal.categories.functional.description')}
            enabled={functional}
            onToggle={() => setFunctional(!functional)}
            color="emerald"
            details={
              <ul className="text-xs text-gray-600 space-y-1 mt-2">
                <li>• Language and region preferences</li>
                <li>• UI theme and customization</li>
                <li>• Enhanced accessibility features</li>
              </ul>
            }
            showDetails={showDetails === 'functional'}
            onToggleDetails={() => setShowDetails(showDetails === 'functional' ? null : 'functional')}
          />

          {/* Analytics Cookies */}
          <CookieCategory
            title={t('modal.categories.analytics.title')}
            description={t('modal.categories.analytics.description')}
            enabled={analytics}
            onToggle={() => setAnalytics(!analytics)}
            color="blue"
            details={
              <div className="mt-3 space-y-2">
                <div className="text-xs bg-white rounded-lg p-3 border border-blue-100">
                  <p className="font-semibold text-gray-900 mb-1">📊 Services Used:</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• <strong>Google Analytics 4</strong> - User behavior tracking</li>
                    <li>• <strong>Vercel Analytics</strong> - Performance metrics</li>
                    <li>• <strong>Error tracking</strong> - Bug detection & fixes</li>
                  </ul>
                </div>
                <p className="text-xs text-gray-500 italic">
                  Helps us understand how to improve your experience
                </p>
              </div>
            }
            showDetails={showDetails === 'analytics'}
            onToggleDetails={() => setShowDetails(showDetails === 'analytics' ? null : 'analytics')}
          />

          {/* Marketing Cookies */}
          <CookieCategory
            title={t('modal.categories.marketing.title')}
            description={t('modal.categories.marketing.description')}
            enabled={marketing}
            onToggle={() => setMarketing(!marketing)}
            color="purple"
            details={
              <div className="mt-3 space-y-2">
                <div className="text-xs bg-white rounded-lg p-3 border border-purple-100">
                  <p className="font-semibold text-gray-900 mb-1">🎯 Services Used:</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• <strong>Meta Pixel</strong> - Facebook & Instagram ads</li>
                    <li>• <strong>Google Ads</strong> - Search & display advertising</li>
                    <li>• <strong>Retargeting</strong> - Personalized ad campaigns</li>
                  </ul>
                </div>
                <p className="text-xs text-gray-500 italic">
                  Shows you relevant content and special offers
                </p>
              </div>
            }
            showDetails={showDetails === 'marketing'}
            onToggleDetails={() => setShowDetails(showDetails === 'marketing' ? null : 'marketing')}
          />

          {/* Quick Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleRejectAll}
              className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ❌ {t('banner.rejectAll')}
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
            >
              ✅ {t('banner.acceptAll')}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            {preferences && (
              <button
                onClick={() => setShowWithdrawConfirm(true)}
                className="text-sm text-red-600 hover:text-red-800 font-medium hover:underline flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t('modal.withdraw')}
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <Button variant="outline" onClick={onClose} className="min-w-[100px]">
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-emerald-600 hover:bg-emerald-700 min-w-[140px] font-semibold shadow-sm"
              >
                💾 {t('modal.save')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Confirmation Dialog */}
      {showWithdrawConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {t('modal.withdraw')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('modal.confirmWithdraw')}
                </p>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-800">
                ⚠️ This will remove all non-essential cookies and reset your preferences. You'll see the cookie banner again.
              </p>
            </div>
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
                className="font-semibold"
              >
                Withdraw All Consent
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Cookie Category Component
function CookieCategory({
  title,
  description,
  enabled,
  onToggle,
  color,
  details,
  showDetails,
  onToggleDetails,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  color: 'emerald' | 'blue' | 'purple';
  details?: React.ReactNode;
  showDetails?: boolean;
  onToggleDetails?: () => void;
}) {
  const colors = {
    emerald: {
      border: enabled ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white',
      toggle: enabled ? 'bg-emerald-500' : 'bg-gray-300',
      ring: 'focus:ring-emerald-500',
    },
    blue: {
      border: enabled ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white',
      toggle: enabled ? 'bg-blue-500' : 'bg-gray-300',
      ring: 'focus:ring-blue-500',
    },
    purple: {
      border: enabled ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white',
      toggle: enabled ? 'bg-purple-500' : 'bg-gray-300',
      ring: 'focus:ring-purple-500',
    },
  };

  const currentColors = colors[color];

  return (
    <div className={`p-4 rounded-xl border-2 transition-all ${currentColors.border}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900">{title}</h3>
            {onToggleDetails && (
              <button
                onClick={onToggleDetails}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                {showDetails ? 'Hide details' : 'Show details'}
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600">{description}</p>
          {showDetails && details}
        </div>
        <button
          onClick={onToggle}
          className={`relative w-12 h-6 rounded-full transition-all focus:outline-none focus:ring-2 ${currentColors.ring} focus:ring-offset-2 flex-shrink-0 ${currentColors.toggle}`}
          role="switch"
          aria-checked={enabled}
          aria-label={`Toggle ${title}`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
              enabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}