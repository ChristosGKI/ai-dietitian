//data-protection
import LegalPageLanguageSwitcher from '@/components/LegalPageLanguageSwitcher';
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
    title: 'Data Protection | AI Dietitian',
    description: 'Learn about how AI Dietitian protects your personal data and your rights under data protection laws.',
  };
}

export default async function DataProtectionPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'dataProtection' });

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
            {/* Overview */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('overview.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('overview.content')}
              </p>
            </section>

            {/* Data Processing Activities */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('processingActivities.title')}
              </h2>
              
              <h3 className="text-xl font-medium text-black dark:text-zinc-50 mb-3">
                {t('categories.title')}
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 mb-6">
                <li><strong>{t('categories.identityTitle')}</strong> {t('categories.identityContent')}</li>
                <li><strong>{t('categories.contactTitle')}</strong> {t('categories.contactContent')}</li>
                <li><strong>{t('categories.healthTitle')}</strong> {t('categories.healthContent')}</li>
                <li><strong>{t('categories.technicalTitle')}</strong> {t('categories.technicalContent')}</li>
                <li><strong>{t('categories.usageTitle')}</strong> {t('categories.usageContent')}</li>
                <li><strong>{t('categories.preferenceTitle')}</strong> {t('categories.preferenceContent')}</li>
              </ul>

              <h3 className="text-xl font-medium text-black dark:text-zinc-50 mb-3">
                {t('purposes.title')}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
                {t('purposes.content')}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>{t('purposes.purpose1')}</li>
                <li>{t('purposes.purpose2')}</li>
                <li>{t('purposes.purpose3')}</li>
                <li>{t('purposes.purpose4')}</li>
                <li>{t('purposes.purpose5')}</li>
                <li>{t('purposes.purpose6')}</li>
              </ul>
            </section>

            {/* Security Measures */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('securityMeasures.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
                {t('securityMeasures.intro')}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
                <li><strong>{t('securityMeasures.encryptionTitle')}</strong> {t('securityMeasures.encryptionContent')}</li>
                <li><strong>{t('securityMeasures.accessTitle')}</strong> {t('securityMeasures.accessContent')}</li>
                <li><strong>{t('securityMeasures.infrastructureTitle')}</strong> {t('securityMeasures.infrastructureContent')}</li>
                <li><strong>{t('securityMeasures.auditsTitle')}</strong> {t('securityMeasures.auditsContent')}</li>
                <li><strong>{t('securityMeasures.minimizationTitle')}</strong> {t('securityMeasures.minimizationContent')}</li>
                <li><strong>{t('securityMeasures.trainingTitle')}</strong> {t('securityMeasures.trainingContent')}</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('dataRetention.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
                {t('dataRetention.intro')}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 mb-4">
                <li>{t('dataRetention.factor1')}</li>
                <li>{t('dataRetention.factor2')}</li>
                <li>{t('dataRetention.factor3')}</li>
                <li>{t('dataRetention.factor4')}</li>
              </ul>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('dataRetention.healthNote')}
              </p>
            </section>

            {/* User Rights */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('userRights.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-6">
                {t('userRights.intro')}
              </p>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="font-medium text-black dark:text-zinc-50 mb-2">{t('userRights.accessTitle')}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t('userRights.accessContent')}
                  </p>
                </div>
                <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="font-medium text-black dark:text-zinc-50 mb-2">{t('userRights.rectificationTitle')}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t('userRights.rectificationContent')}
                  </p>
                </div>
                <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="font-medium text-black dark:text-zinc-50 mb-2">{t('userRights.erasureTitle')}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t('userRights.erasureContent')}
                  </p>
                </div>
                <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="font-medium text-black dark:text-zinc-50 mb-2">{t('userRights.restrictionTitle')}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t('userRights.restrictionContent')}
                  </p>
                </div>
                <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="font-medium text-black dark:text-zinc-50 mb-2">{t('userRights.portabilityTitle')}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t('userRights.portabilityContent')}
                  </p>
                </div>
                <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <h3 className="font-medium text-black dark:text-zinc-50 mb-2">{t('userRights.objectionTitle')}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t('userRights.objectionContent')}
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-medium text-black dark:text-zinc-50 mt-8 mb-3">
                {t('userRights.exerciseTitle')}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('userRights.exerciseContent')}
              </p>
            </section>

            {/* International Transfers */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('internationalTransfers.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
                {t('internationalTransfers.intro')}
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
                {t('internationalTransfers.safeguards')}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>{t('internationalTransfers.safeguard1')}</li>
                <li>{t('internationalTransfers.safeguard2')}</li>
                <li>{t('internationalTransfers.safeguard3')}</li>
                <li>{t('internationalTransfers.safeguard4')}</li>
              </ul>
            </section>

            {/* Complaint Procedures */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('complaints.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
                {t('complaints.intro')}
              </p>
              
              <h3 className="text-xl font-medium text-black dark:text-zinc-50 mb-3">
                {t('complaints.lodgeTitle')}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
                {t('complaints.lodgeContent')}
              </p>
              
              <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                <p className="text-zinc-600 dark:text-zinc-400">
                  <strong>{t('complaints.authoritiesTitle')}</strong><br />
                  {t('complaints.germany')}<br />
                  {t('complaints.france')}<br />
                  {t('complaints.greece')}
                </p>
              </div>
            </section>

            {/* Changes */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-4">
                {t('changes.title')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                {t('changes.content')}
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
