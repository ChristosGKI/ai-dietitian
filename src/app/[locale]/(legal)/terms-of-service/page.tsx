// terms-of-service.tsx
import LegalPageLanguageSwitcher from '@/components/LanguageSwitcher';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: 'Terms of Service | AI Dietitian',
    description: 'Terms and conditions for using the AI Dietitian service.',
  };
}

export default async function TermsOfServicePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'termsOfService' });

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto max-w-4xl py-16 px-4 sm:px-6 lg:px-8">
        <LegalPageLanguageSwitcher />

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            {t('lastUpdated')}
          </p>
        </div>

        <div className="prose prose-zinc dark:prose-invert mx-auto">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
              {t('introduction.title')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              {t('introduction.content')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
              {t('acceptance.title')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              {t('acceptance.content')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
              {t('medicalDisclaimer.title')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7 font-medium">
              {t('medicalDisclaimer.content')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
              {t('userAccounts.title')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              {t('userAccounts.content')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
              {t('prohibited.title')}
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>{t('prohibited.item1')}</li>
              <li>{t('prohibited.item2')}</li>
              <li>{t('prohibited.item3')}</li>
              <li>{t('prohibited.item4')}</li>
              <li>{t('prohibited.item5')}</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
              {t('intellectualProperty.title')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              {t('intellectualProperty.content')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
              {t('termination.title')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              {t('termination.content')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
              {t('limitationOfLiability.title')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              {t('limitationOfLiability.content')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
              {t('governingLaw.title')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              {t('governingLaw.content')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
              {t('changes.title')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              {t('changes.content')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              {t('contact.content')}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
