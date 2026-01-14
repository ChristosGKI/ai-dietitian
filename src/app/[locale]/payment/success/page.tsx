import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { CheckCircle2 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

interface SuccessPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SuccessPage({ params }: SuccessPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'paymentSuccess' });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription className="text-base">
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              {t('emailNotice')}
            </div>
            <Button asChild className="w-full" size="lg">
              <Link href="/">
                {t('returnHome')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
