'use client';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { Rocket } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useHasLegalAcceptance } from '@/hooks/useHasLegalAcceptance';

export default function HomeContent() {
  const t = useTranslations();
  const hasLegalAcceptance = useHasLegalAcceptance();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {t('homeTitle')}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {t('homeDescription')}
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 sm:items-start">
        {hasLegalAcceptance ? (
            <Link href="/onboarding" className="w-full sm:w-auto">
            <Button
                className="
                w-full sm:w-auto
                flex items-center justify-center gap-3
                text-base font-semibold
                px-8 py-6
                rounded-2xl
                transition-all
                hover:scale-[1.02]
                active:scale-[0.98]
                "
                aria-label="get-started-onboarding"
            >
                <Rocket className="h-5 w-5" />
                {t('homeGetStarted')}
            </Button>
            </Link>
        ) : (
            <div className="w-full sm:w-auto flex flex-col items-center gap-2">
            <Button
                className="
                w-full sm:w-auto
                flex items-center justify-center gap-3
                text-base font-semibold
                px-8 py-6
                rounded-2xl
                opacity-60
                cursor-not-allowed
                "
                aria-label="get-started-onboarding-disabled"
                disabled
            >
                <Rocket className="h-5 w-5" />
                {t('homeGetStarted')}
            </Button>
            </div>
        )}
        </div>
      </main>
    </div>
  );
}
