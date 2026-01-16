//privacy-policy
import LegalPageLanguageSwitcher from '@/components/LanguageSwitcher';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: 'Privacy Policy | AI Dietitian',
    description: 'Learn about how AI Dietitian collects, uses, and protects your personal data.',
  };
}

export default async function PrivacyPolicyPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'privacyPolicy' });

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <main className="mx-auto max-w-4xl py-16 px-4 sm:px-6 lg:px-8">
          {/* Language Switcher & Back Button */}
          <LegalPageLanguageSwitcher />

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              {t('lastUpdated')}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-zinc dark:prose-invert mx-auto">
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                Introduction
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('intro')}
              </p>
            </section>

            {/* Data Collection */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('sections.dataCollection.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('sections.dataCollection.content')}
              </p>
            </section>

            {/* How We Use Your Data */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('sections.dataUsage.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('sections.dataUsage.content')}
              </p>
            </section>

            {/* GDPR Rights */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('sections.userRights.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('sections.userRights.content')}
              </p>
            </section>

            {/* Data Protection */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('sections.dataProtection.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('sections.dataProtection.content')}
              </p>
            </section>

            {/* Data Sharing */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('sections.dataSharing.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('sections.dataSharing.content')}
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('sections.contact.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('sections.contact.content')}
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                Changes to This Policy
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </section>
          </div>
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
