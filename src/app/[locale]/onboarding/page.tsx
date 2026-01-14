import { Toaster } from '@/components/ui/sonner';
import { WizardEngine } from '@/components/wizard/WizardEngine';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function OnboardingPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <OnboardingContent locale={locale} />
    </NextIntlClientProvider>
  );
}

function OnboardingContent({ locale }: { locale: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center gap-6">
          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              {/* Title is rendered by WizardEngine */}
            </h1>
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400 max-w-xl">
              {/* Description is rendered by WizardEngine */}
            </p>
          </div>
          
          <WizardEngine />
        </div>
      </main>
      <Toaster />
    </div>
  );
}
