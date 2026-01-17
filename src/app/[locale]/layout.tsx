import { LanguageSelectorWrapper } from '@/components/LanguageSelectorWrapper';
import { CookieConsentWrapper } from '@/components/CookieConsentWrapper';
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  title: "Foodbrain",
  description: "Get your personalized diet plan powered by AI",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Use valid locale or fallback to default (middleware should handle invalid locales)
  const validLocale = routing.locales.includes(locale as any) 
    ? locale 
    : routing.defaultLocale;
  
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={validLocale}>
      {children}
      <LanguageSelectorWrapper />
      <CookieConsentWrapper />
    </NextIntlClientProvider>
  );
}
