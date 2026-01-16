'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
];

export default function PageLanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current locale from params
  const currentLocale = (params?.locale as string) || 'en';
  const currentLangObj = LANGUAGES.find(l => l.code === currentLocale) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    // Set locale cookie for persistence
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;

    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 py-4" ref={dropdownRef}>
      
      {/* Language Dropdown */}
      <div className="relative z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full shadow-sm transition-all duration-200 group"
          disabled={isPending}
          aria-label="Select language"
          aria-expanded={isOpen}
        >
          <Globe className={cn(
            "w-4 h-4 text-gray-500 group-hover:text-emerald-600 transition-colors",
            isPending && "animate-pulse"
          )} />
          <span className="text-sm font-medium text-gray-700">{currentLangObj.name}</span>
          <ChevronDown className={cn(
            "w-3.5 h-3.5 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{ transformOrigin: 'top right' }}
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-black/5"
            >
              <div className="p-1.5 flex flex-col gap-0.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLocaleChange(lang.code)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors",
                      currentLocale === lang.code
                        ? "bg-emerald-50 text-emerald-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    aria-current={currentLocale === lang.code ? 'true' : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg leading-none" aria-hidden="true">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                    {currentLocale === lang.code && (
                      <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}