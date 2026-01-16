import { LanguageSelectorWrapper } from '@/components/LanguageSelectorWrapper';
import { CookieConsentWrapper } from '@/components/CookieConsentWrapper';
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Dietitian",
  description: "Get your personalized diet plan powered by AI",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  // Use valid locale or fallback to default (middleware should handle invalid locales)
  const validLocale = routing.locales.includes(locale as any) 
    ? locale 
    : routing.defaultLocale;
  
  const messages = await getMessages();

  return (
    <html lang={validLocale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages} locale={validLocale}>
          {children}
          <LanguageSelectorWrapper />
          <CookieConsentWrapper />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}