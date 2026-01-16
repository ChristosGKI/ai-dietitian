'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useHasLegalAcceptance } from '@/hooks/useHasLegalAcceptance';
import { usePathname, useRouter } from '@/i18n/routing';
import { useEffect, useState } from 'react';

type Locale = 'en' | 'es' | 'el';

interface LanguageOption {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
];

export function LanguageSelector() {
  const hasLegalAcceptance = useHasLegalAcceptance();
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');

  useEffect(() => {
    // Get current locale from URL
    const match = window.location.pathname.match(/^\/([a-z]{2})(\/|$)/);
    if (match) {
      setCurrentLocale(match[1] as Locale);
    }

    if (!hasLegalAcceptance) {
      // Show modal after a short delay for smooth UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [hasLegalAcceptance]);

  const handleLanguageSelect = (locale: Locale) => {
    // Set locale cookie only (cookie consent is handled separately)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year expiry
    
    document.cookie = `NEXT_LOCALE=${locale}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax; Secure`;
    
    // Set legal acceptance cookie so user can access protected routes
    document.cookie = `legal_accepted=true; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax; Secure`;
    
    // Close the modal first
    setIsVisible(false);
    
    // Strip the locale prefix from pathname to avoid duplicate locales
    const cleanPathname = pathname.replace(/^\/[^/]+\//, '/');
    
    // Force a hard reload to the new locale to ensure all data is fresh
    window.location.href = `/${locale}${cleanPathname}`;
  };

  // Don't show if user has already accepted legal terms
  if (hasLegalAcceptance) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-md mx-4 shadow-xl animate-in zoom-in-95 duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Choose Your Language
          </CardTitle>
          <CardDescription>
            Select your preferred language to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant="outline"
              className="w-full justify-start gap-3 h-12 text-base"
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-muted-foreground text-sm ml-auto">
                {lang.name}
              </span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
