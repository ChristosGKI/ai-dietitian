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

// European time zones for GDPR detection
const euTimezones = [
  'Europe/Amsterdam',
  'Europe/Andorra',
  'Europe/Athens',
  'Europe/Belgrade',
  'Europe/Berlin',
  'Europe/Bratislava',
  'Europe/Brussels',
  'Europe/Bucharest',
  'Europe/Budapest',
  'Europe/Chisinau',
  'Europe/Copenhagen',
  'Europe/Dublin',
  'Europe/Gibraltar',
  'Europe/Guernsey',
  'Europe/Helsinki',
  'Europe/Isle_of_Man',
  'Europe/Istanbul',
  'Europe/Jersey',
  'Europe/Kaliningrad',
  'Europe/Kiev',
  'Europe/Lisbon',
  'Europe/Ljubljana',
  'Europe/London',
  'Europe/Luxembourg',
  'Europe/Madrid',
  'Europe/Malta',
  'Europe/Mariehamn',
  'Europe/Minsk',
  'Europe/Monaco',
  'Europe/Moscow',
  'Europe/Nicosia',
  'Europe/Oslo',
  'Europe/Paris',
  'Europe/Podgorica',
  'Europe/Prague',
  'Europe/Riga',
  'Europe/Rome',
  'Europe/San_Marino',
  'Europe/Sarajevo',
  'Europe/Simferopol',
  'Europe/Skopje',
  'Europe/Sofia',
  'Europe/Stockholm',
  'Europe/Tallinn',
  'Europe/Tirane',
  'Europe/Tiraspol',
  'Europe/Uzhgorod',
  'Europe/Vaduz',
  'Europe/Vatican',
  'Europe/Vienna',
  'Europe/Vilnius',
  'Europe/Warsaw',
  'Europe/Zagreb',
  'Europe/Zaporozhye',
  'Europe/Zurich',
];

function isInEU(): boolean {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return euTimezones.includes(timezone);
  } catch {
    return false;
  }
}

export function LanguageSelector() {
  const hasAccepted = useHasLegalAcceptance();
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [showGdpr, setShowGdpr] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');

  useEffect(() => {
    // Get current locale from URL
    const match = window.location.pathname.match(/^\/([a-z]{2})(\/|$)/);
    if (match) {
      setCurrentLocale(match[1] as Locale);
    }

    if (!hasAccepted) {
      // Show modal after a short delay for smooth UX
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Check if we should show GDPR consent (EU users)
        setShowGdpr(isInEU());
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasAccepted]);

  const handleLanguageSelect = (locale: Locale) => {
    // Set locale cookie with legal acceptance timestamp
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year expiry
    
    document.cookie = `NEXT_LOCALE=${locale}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
    
    // Set legal acceptance cookie
    const acceptanceDate = new Date().toISOString();
    document.cookie = `legal_accepted=${acceptanceDate}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
    
    // Close the modal first
    setIsVisible(false);
    
    // Force a hard reload to the new locale to ensure all data is fresh
    window.location.href = `/${locale}${pathname}`;
  };

  // Don't show if user has already accepted
  if (hasAccepted) {
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
              // variant={lang.code === currentLocale ? "default" : "outline"}
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
        <div className="px-6 pb-6">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            By selecting a language, you accept our{' '}
            <a
              href={`/${currentLocale}/privacy-policy`}
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            {', '}
            <a
              href={`/${currentLocale}/cookie-policy`}
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              Cookie Policy
            </a>
            {showGdpr && ', '}
            {showGdpr && (
              <a
                href={`/${currentLocale}/terms-of-service`}
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                Terms of Service
              </a>
            )}
            {showGdpr && ', '}
            {showGdpr && (
              <a
                href={`/${currentLocale}/data-protection`}
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                Data Protection
              </a>
            )}
            {showGdpr && ' and consent to the processing of your language preference data'}
            .
          </p>
        </div>
      </Card>
    </div>
  );
}
