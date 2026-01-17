//cookie-policy
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
    title: 'Cookie Policy | Foodbrain',
    description: 'Learn about how Foodbrain uses cookies and similar technologies.',
  };
}

export default async function CookiePolicyPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'cookiePolicy' });

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
                {t('whatAreCookies.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('whatAreCookies.content')}
              </p>
            </section>

            {/* Types of Cookies */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('sections.typesOfCookies.title')}
              </h2>
              
              <h3 className="text-xl font-medium text-black dark:text-zinc-50 mb-3">
                {t('essential.title')}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-6">
                {t('essential.content')}
              </p>

              <h3 className="text-xl font-medium text-black dark:text-zinc-50 mb-3">
                {t('functional.title')}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-6">
                {t('functional.content')}
              </p>

              <h3 className="text-xl font-medium text-black dark:text-zinc-50 mb-3">
                {t('analytics.title')}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-6">
                {t('analytics.content')}
              </p>
            </section>

            {/* Language Selector Cookies */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('languageCookies.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
                {t('languageCookies.content')}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>{t('languageCookies.benefit1')}</li>
                <li>{t('languageCookies.benefit2')}</li>
                <li>{t('languageCookies.benefit3')}</li>
                <li>{t('languageCookies.benefit4')}</li>
              </ul>
            </section>

            {/* Cookie Duration */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('cookieDuration.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
                {t('cookieDuration.content')}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
                <li><strong>{t('cookieDuration.sessionTitle')}</strong> {t('cookieDuration.sessionContent')}</li>
                <li><strong>{t('cookieDuration.persistentTitle')}</strong> {t('cookieDuration.persistentContent')}</li>
              </ul>
            </section>

            {/* Third Party Cookies */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('thirdParty.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('thirdParty.content')}
              </p>
            </section>

            {/* Managing Cookies */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('manageCookies.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
                {t('manageCookies.content')}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 mb-6">
                <li>{t('manageCookies.option1')}</li>
                <li>{t('manageCookies.option2')}</li>
                <li>{t('manageCookies.option3')}</li>
                <li>{t('manageCookies.option4')}</li>
              </ul>
              <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg mb-4">
                <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                  {t('browserInstructions.title')}
                </p>
                <ul className="list-disc pl-6 mt-2 text-zinc-600 dark:text-zinc-400">
                  <li><strong>Chrome:</strong> {t('browserInstructions.chrome')}</li>
                  <li><strong>Firefox:</strong> {t('browserInstructions.firefox')}</li>
                  <li><strong>Safari:</strong> {t('browserInstructions.safari')}</li>
                  <li><strong>Edge:</strong> {t('browserInstructions.edge')}</li>
                </ul>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('manageCookies.warning')}
              </p>
            </section>

            {/* Do Not Track */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('dnt.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('dnt.content')}
              </p>
            </section>

            {/* Updates */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('updates.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('updates.content')}
              </p>
            </section>

            {/* Contact */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('contact.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('contact.content')}
              </p>
              <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                <p className="text-zinc-600 dark:text-zinc-400">
                  <strong>{t('contact.companyName')}</strong><br />
                  {t('contact.email')}<br />
                  {t('contact.address')}
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
