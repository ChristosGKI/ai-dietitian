'use client';

import { Button } from '@/components/ui/button';
import { usePathname } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function LegalPageLanguageSwitcher() {
  const pathname = usePathname();
  const t = useTranslations('common');
  
  // Get locale directly from URL pathname on client side
  const [currentLocale, setCurrentLocale] = useState('en');
  
  useEffect(() => {
    const match = window.location.pathname.match(/^\/([a-z]{2})(\/|$)/);
    setCurrentLocale(match ? match[1] : 'en');
  }, []);
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  ];

  const handleLocaleChange = (newLocale: string) => {
    // Get the full current path including locale
    const fullPath = window.location.pathname;
    
    // Replace the locale at the start of the path
    // Match pattern: /locale/rest-of-path
    const newPath = fullPath.replace(/^\/[a-z]{2}(\/|$)/, `/${newLocale}$1`);
    
    window.location.href = newPath;
  };

  const handleBackToHome = () => {
    window.location.replace(`/${currentLocale}/`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      {/* Language Switcher */}
      <div className="flex gap-2">
        {languages
          .filter((lang) => lang.code !== currentLocale)
          .map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLocaleChange(lang.code)}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              {lang.flag} {lang.name}
            </button>
          ))}
      </div>

      {/* Back to Home Button */}
      <Button variant="outline" size="sm" onClick={handleBackToHome}>
        <ArrowLeft className="size-4" />
        {t('backToHome')}
      </Button>
    </div>
  );
}