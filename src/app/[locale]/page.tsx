import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { UrgencyBanner } from '@/components/landing/UrgencyBanner';
import { HeroSection } from '@/components/landing/HeroSection';
import { TrustBanner } from '@/components/landing/TrustBanner';
import { ComparisonSection } from '@/components/landing/ComparisonSection';
import { ProductShowcase } from '@/components/landing/ProductShowcase';
import { SocialProof } from '@/components/landing/SocialProof';
import { CredibilityFooter } from '@/components/landing/CredibilityFooter';
import { StickyCTA } from '@/components/landing/StickyCTA';
import { ExitPopup } from '@/components/landing/ExitPopup';
import PageLanguageSwitcher from '@/components/LanguageSwitcher';
import { FAQSection } from '@/components/landing/FAQSection';

export default async function Home({
  params
}: {
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <main className="min-h-screen bg-white relative selection:bg-emerald-100 selection:text-emerald-900">
        
        {/* 1. FOMO Strip */}
        <UrgencyBanner />

        <div className="relative z-10 flex flex-col">
          
          {/* WRAPPER: Contains Hero + Floating Language Switcher */}
          <div className="relative">
            {/* Floating Language Switcher (Top Right) */}
            <div className="absolute top-4 right-4 md:top-6 md:right-8 z-50">
              <PageLanguageSwitcher />
            </div>

            {/* 2. THE HOOK */}
            <HeroSection />
          </div>

          {/* 3. SAFETY (Immediate Trust) */}
          <TrustBanner />

          {/* 4. LOGIC (Us vs Them) */}
          <ComparisonSection />

          {/* 5. DESIRE (The Product) */}
          <ProductShowcase />

          {/* 6. VALIDATION (Social Proof) */}
          <SocialProof />

          {/* 7. FAQ */}
          <FAQSection />

          {/* 8. TRUST (Footer) */}
          <CredibilityFooter />
        </div>

        {/* --- CONVERSION OVERLAYS --- */}
        <StickyCTA />
        <ExitPopup />
        
      </main>
    </NextIntlClientProvider>
  );
}