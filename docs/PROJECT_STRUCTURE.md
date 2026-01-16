# Project Structure

The AI Dietitian project follows a clean, modular architecture using Next.js App Router with organized directories for better maintainability.

## Directory Overview

```
foodbrain/
├── docs/                          # Documentation files
├── prisma/                        # Database schema and migrations
├── public/                        # Static assets
├── messages/                      # i18n translation files
├── src/
│   ├── app/                       # Next.js App Router pages and API routes
│   ├── components/                # React components
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utility functions and configurations
│   └── i18n/                      # Internationalization configuration
└── configuration files
```

## Detailed Structure

### `/prisma`

| Path | Description |
|------|-------------|
| [`prisma/schema.prisma`](../prisma/schema.prisma) | Database schema defining User model and relationships |
| `prisma/migrations/` | Database migration files (auto-generated) |

### `/messages`

| Path | Description |
|------|-------------|
| [`messages/en.json`](../messages/en.json) | English translations (primary language) |
| `messages/es.json` | Spanish translations |
| `messages/el.json` | Greek translations |
| `messages/legal/` | Dedicated translation files for legal pages |

#### `/messages/legal`

Dedicated translation files for legal documentation pages to improve maintainability.

| Path | Description |
|------|-------------|
| `messages/legal/privacy-policy.{locale}.json` | Privacy Policy translations |
| `messages/legal/cookie-policy.{locale}.json` | Cookie Policy translations |
| `messages/legal/data-protection.{locale}.json` | Data Protection translations |

### `/src/i18n`

Internationalization configuration using [next-intl](https://next-intl-docs.vercel.app/).

| Path | Description |
|------|-------------|
| [`src/i18n/routing.ts`](../src/i18n/routing.ts) | Centralized routing configuration with supported locales |
| [`src/i18n/request.ts`](../src/i18n/request.ts) | Request-scoped configuration for loading translation messages |

#### Locale Configuration

The application supports three locales: `en` (English), `es` (Spanish), and `el` (Greek). The routing configuration is defined in [`src/i18n/routing.ts`](src/i18n/routing.ts):

```typescript
export const routing = defineRouting({
  locales: ['en', 'es', 'el'],
  defaultLocale: 'en'
});
```

#### Message Loading

Translation messages are loaded dynamically based on the locale from the [`messages/`](messages/) directory. The configuration in [`src/i18n/request.ts`](src/i18n/request.ts) handles locale validation and message loading:

```typescript
export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

#### Middleware

The middleware in [`src/middleware.ts`](../src/middleware.ts) handles locale detection from the URL path and redirects invalid locales to the default:

```typescript
export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
```

The matcher excludes API routes, static assets, and Next.js internals from locale handling.

### `/src/app`

Next.js App Router directory containing pages, layouts, and API routes.

| Path | Description |
|------|-------------|
| [`src/app/layout.tsx`](src/app/layout.tsx) | Root layout with providers |
| [`src/app/globals.css`](src/app/globals.css) | Global styles |
| [`src/app/[locale]/`](src/app/[locale]/) | Localized routes |
| [`src/app/[locale]/page.tsx`](src/app/[locale]/page.tsx) | Home page |
| [`src/app/[locale]/onboarding/`](src/app/[locale]/onboarding/) | Onboarding flow |
| [`src/app/[locale]/payment/`](src/app/[locale]/payment/) | Payment pages |
| [`src/app/[locale]/privacy-policy/`](src/app/[locale]/privacy-policy/) | Privacy Policy page |
| [`src/app/[locale]/cookie-policy/`](src/app/[locale]/cookie-policy/) | Cookie Policy page |
| [`src/app/[locale]/data-protection/`](src/app/[locale]/data-protection/) | Data Protection page |
| [`src/app/actions/`](src/app/actions/) | Server actions |
| [`src/app/api/`](src/app/api/) | API routes (webhooks) |

#### `/src/app/[locale]`

Dynamic locale route segment for internationalization.

```
src/app/[locale]/
├── page.tsx                  # Homepage
├── privacy-policy/           # Privacy Policy page
│   └── page.tsx
├── cookie-policy/            # Cookie Policy page
│   └── page.tsx
├── data-protection/          # Data Protection page
│   └── page.tsx
├── onboarding/
│   └── page.tsx              # Onboarding wizard page
└── payment/
    ├── success/
    │   └── page.tsx          # Payment success page
    └── cancel/
        └── page.tsx          # Payment cancel page
```

#### `/src/app/actions`

Server actions for form submissions and side effects.

| File | Description |
|------|-------------|
| [`src/app/actions/onboarding.ts`](src/app/actions/onboarding.ts) | Legacy onboarding action (deprecated) |
| [`src/app/actions/submit-wizard.ts`](src/app/actions/submit-wizard.ts) | Handles wizard submission with PII encryption |
| [`src/app/actions/payment.ts`](src/app/actions/payment.ts) | Creates Stripe checkout sessions |

#### `/src/app/api`

API routes for handling external webhooks.

```
src/app/api/
└── webhooks/
    └── stripe/
        └── route.ts      # Stripe webhook handler (planned)
```

### `/src/components`

React components organized by feature.

| Path | Description |
|------|-------------|
| [`src/components/LanguageSelector.tsx`](../src/components/LanguageSelector.tsx) | Modal language selector with GDPR consent |
| [`src/components/LanguageSelectorWrapper.tsx`](../src/components/LanguageSelectorWrapper.tsx) | Client wrapper for LanguageSelector |
| [`src/components/LegalPageLanguageSwitcher.tsx`](../src/components/LegalPageLanguageSwitcher.tsx) | Read-only language switcher for legal pages |
| [`src/components/onboarding/`](../src/components/onboarding/) | Onboarding-specific components |
| [`src/components/ui/`](../src/components/ui/) | Reusable UI components (shadcn/ui) |
| [`src/components/wizard/`](../src/components/wizard/) | Wizard form components |

#### `/src/components/onboarding`

| File | Description |
|------|-------------|
| [`src/components/onboarding/WizardForm.tsx`](src/components/onboarding/WizardForm.tsx) | Multi-step form wizard component |

#### `/src/components/ui`

shadcn/ui components for building the UI.

| File | Description |
|------|-------------|
| [`src/components/ui/button.tsx`](src/components/ui/button.tsx) | Button component with variants |
| [`src/components/ui/card.tsx`](src/components/ui/card.tsx) | Card container component |
| [`src/components/ui/form.tsx`](src/components/ui/form.tsx) | Form with React Hook Form |
| [`src/components/ui/input.tsx`](src/components/ui/input.tsx) | Input field component |
| [`src/components/ui/label.tsx`](src/components/ui/label.tsx) | Label for form fields |
| [`src/components/ui/progress.tsx`](src/components/ui/progress.tsx) | Progress bar component |
| [`src/components/ui/select.tsx`](src/components/ui/select.tsx) | Select dropdown component |
| [`src/components/ui/sonner.tsx`](src/components/ui/sonner.tsx) | Toast notifications |
| [`src/components/ui/textarea.tsx`](src/components/ui/textarea.tsx) | Textarea component |

#### `/src/components/wizard/inputs`

Atomic input components for the config-driven wizard.

| File | Description |
|------|-------------|
| [`src/components/wizard/inputs/TextInput.tsx`](src/components/wizard/inputs/TextInput.tsx) | Text input for lead capture (name, email) |
| [`src/components/wizard/inputs/CardSelector.tsx`](src/components/wizard/inputs/CardSelector.tsx) | Card selection grid |
| [`src/components/wizard/inputs/ImageGrid.tsx`](src/components/wizard/inputs/ImageGrid.tsx) | Image grid for food exclusions |
| [`src/components/wizard/inputs/ModernSlider.tsx`](src/components/wizard/inputs/ModernSlider.tsx) | Range slider with value display |
| [`src/components/wizard/inputs/SearchList.tsx`](src/components/wizard/inputs/SearchList.tsx) | Searchable combobox |
| [`src/components/wizard/inputs/VisualRating.tsx`](src/components/wizard/inputs/VisualRating.tsx) | Icon-based rating selector |

### `/src/hooks`

Custom React hooks for reusable logic.

| Path | Description |
|------|-------------|
| [`src/hooks/useHasLanguageCookie.ts`](../src/hooks/useHasLanguageCookie.ts) | Detects if NEXT_LOCALE cookie exists |
| [`src/hooks/use-wizard.ts`](../src/hooks/use-wizard.ts) | Wizard form state management |

### `/src/lib`

Utility functions, configurations, and type definitions.

| Path | Description |
|------|-------------|
| [`src/lib/crypto.ts`](src/lib/crypto.ts) | AES-256-GCM encryption for PII |
| [`src/lib/openai.ts`](src/lib/openai.ts) | OpenAI client configuration (planned) |
| [`src/lib/prisma.ts`](src/lib/prisma.ts) | Prisma client singleton |
| [`src/lib/stripe.ts`](src/lib/stripe.ts) | Stripe client configuration |
| [`src/lib/utils.ts`](src/lib/utils.ts) | Utility functions (cn, tailwind merge) |
| [`src/lib/schemas.ts`](src/lib/schemas.ts) | Zod validation schemas (combined) |
| [`src/lib/validation-schemas.ts`](src/lib/validation-schemas.ts) | Step-specific validation schemas |
| [`src/lib/wizard-mapper.ts`](src/lib/wizard-mapper.ts) | Wizard-to-database data mapping |
| [`src/types/wizard.ts`](src/types/wizard.ts) | Wizard type definitions |

### `/src` (Root Level)

| Path | Description |
|------|-------------|
| [`src/i18n/routing.ts`](src/i18n/routing.ts) | i18n routing configuration |
| [`src/middleware.ts`](src/middleware.ts) | Next.js middleware (auth, i18n) |

## Configuration Files

| File | Description |
|------|-------------|
| `next.config.ts` | Next.js configuration with i18n support |
| `tsconfig.json` | TypeScript compiler options |
| `eslint.config.mjs` | ESLint configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `postcss.config.mjs` | PostCSS configuration |
| `prisma.config.ts` | Prisma configuration |
| `components.json` | shadcn/ui component configuration |
| `.env.local` | Local environment variables |
| `.env.local.example` | Environment variable template |

## Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User Input    │────▶│  Server Actions │────▶│   Database      │
│   (WizardForm)  │     │   (actions/)    │     │   (Prisma)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Stripe API    │
                       │   (Payments)    │
                       └─────────────────┘
```

## Environment Variables

Required environment variables (see `.env.local.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `NEXT_PUBLIC_APP_URL` - Application URL
- `ENCRYPTION_KEY` - 32-byte key for AES-256-GCM PII encryption
- `OPENAI_API_KEY` - OpenAI API key (planned)
- `RESEND_API_KEY` - Resend API key for emails (planned)
