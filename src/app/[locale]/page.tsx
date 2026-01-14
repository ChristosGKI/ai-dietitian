import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import HomeContent from '@/components/HomeContent';

export default async function Home({
  params
}: {
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <HomeContent />
    </NextIntlClientProvider>
  );
}



