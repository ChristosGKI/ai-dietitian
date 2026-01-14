import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { XCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

interface CancelPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CancelPage({ params }: CancelPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'paymentCancel' });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription className="text-base">
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full" size="lg" variant="outline">
            <Link href="/onboarding">
              {t('tryAgain')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
