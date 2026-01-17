# Features

The Foodbrain application provides a comprehensive personalized diet planning experience with a multi-step onboarding process, seamless payment integration, and GDPR-compliant language selection.

## Core Features

### 1. Config-Driven Wizard

A 6-phase, 13-step progressive form that collects user data for personalized diet recommendations. The wizard is configured in code (not hardcoded), enabling flexible modification.

| Phase | Steps | Purpose |
|-------|-------|---------|
| Get Started | 2 | Name and email capture |
| The Basics | 4 | Gender, age, weight, height |
| Kitchen Reality | 2 | Cooking habits and skill level |
| The Blacklist | 2 | Food exclusions and allergies |
| Movement | 1 | Activity level |
| Vices & Lifestyle | 2 | Social preferences |

**Key Features:**
- Config-driven architecture (Define once, render everywhere)
- Progress bar visualization
- Step-by-step navigation (Next/Back buttons)
- Form data persistence to localStorage
- Server-side submission with PII encryption
- Responsive design
- i18n support for all text

### 2. Language Selector with GDPR Consent

A persistent language selector modal that appears for first-time visitors, integrating GDPR consent functionality.

**Features:**
- Modal appears only when no `NEXT_LOCALE` cookie exists
- Supports English, Spanish, and Greek with native names and flags
- Instant language switching without page reload using `router.replace()`
- Automatic cookie persistence via next-intl middleware
- EU user detection via 50+ European timezones
- Subtle GDPR consent text with links to Privacy Policy and Cookie Policy
- Modal excluded from legal pages (privacy-policy, cookie-policy, data-protection)

**User Flow:**
1. First-time visitor sees language modal on home page
2. User can click GDPR links to read legal documentation
3. Legal pages have read-only language switcher (doesn't save preference)
4. Legal pages have "Back to Home" button with Lucide icon
5. User selects language to proceed, cookie is set, modal closes

**Cookie Behavior:**
- Cookie name: `NEXT_LOCALE` (managed by next-intl)
- Set automatically when user selects language
- Checked on client side to determine modal visibility
- Language switcher on legal pages uses `Link` component (no cookie set)

### 3. Legal Documentation Pages

Dedicated pages for privacy-related documentation with full i18n support.

| Page | Route | Description |
|------|-------|-------------|
| Privacy Policy | `/[locale]/privacy-policy` | Data collection, usage, and user rights |
| Cookie Policy | `/[locale]/cookie-policy` | Cookie types, management, and third-party cookies |
| Data Protection | `/[locale]/data-protection` | Processing activities, security, and user rights |

**Features:**
- Consistent layout across all legal pages
- Read-only language switcher at top of page
- "Back to Home" button with arrow icon
- Full translations in English, Spanish, and Greek
- Dedicated translation files for maintainability

### 4. Form Validation with Zod

Robust validation using Zod schemas with user-friendly error messages.

**Validation Features:**
- Real-time field validation on step transition
- Custom validation rules per field type
- Email format validation
- Numeric range validation (age, weight, height)
- Required vs optional field handling
- Error messages displayed inline

### 5. Local Storage Persistence

Form data is automatically saved to localStorage for better user experience.

**Persistence Features:**
- Auto-save on form changes
- Restore saved data on page reload
- Persist userId for returning users
- Cross-step data retention

### 6. Server Actions

Backend logic handled through Next.js Server Actions.

| Action | File | Purpose |
|--------|------|---------|
| `submitWizardAction` | [`submit-wizard.ts`](src/app/actions/submit-wizard.ts) | Submit wizard data with PII encryption |
| `createCheckoutSession` | [`payment.ts`](src/app/actions/payment.ts) | Creates Stripe checkout session |

### 7. Stripe Payment Integration

Seamless payment processing with Stripe Checkout.

**Payment Flow:**
1. User completes onboarding form
2. User clicks "Proceed to Payment" on Step 4
3. Server creates Stripe checkout session
4. User redirected to Stripe checkout page
5. User completes payment
6. User redirected to success/cancel page

**Payment Features:**
- Euro currency (EUR)
- Fixed price: €6.99
- Secure checkout via Stripe
- Session metadata for webhook processing
- Success and cancel URL handling

### 8. User Progress Saving

Data is saved to PostgreSQL database via Prisma ORM.

**Progress Saving Features:**
- Upsert operation (create if new, update if exists)
- Email-based user identification
- Step-by-step validation
- Error handling with user feedback

### 9. Payment Success Flow

Dedicated success page after payment completion.

**Success Page Features:**
- Confirmation message
- Email delivery notification
- Return home button
- i18n support

### 10. Payment Cancel Flow

Graceful handling of cancelled payments.

**Cancel Page Features:**
- Cancellation notification
- "Try Again" button returning to onboarding
- i18n support

### 11. Lead Generation

The wizard's first phase captures user contact information for follow-up and payment processing.

**Lead Capture Features:**
- Name field (minimum 2 characters)
- Email field (validated format)
- Immediate PII encryption on submission
- Email-based user identification for upsert operations
- Prevents duplicate leads

### 12. PII Encryption

Personally identifiable information is encrypted using AES-256-GCM before database storage.

**Encryption Features:**
- AES-256-GCM authenticated encryption
- 32-byte key from environment variable
- Random IV per encryption
- Auth tag for tamper detection
- Encrypted data format: `iv:authTag:ciphertext`
- Only name field is encrypted (email remains plaintext for identification)

### 13. Data Mapping

Wizard answers are transformed into structured JSON data for efficient storage and future AI processing.

**Mapping Features:**
- `kitchenHabits`: Cooking information and skill level
- `dietaryPrefs`: Food exclusions, diet type, allergies
- `activityProfile`: Activity level and frequency
- `lifestyleProfile`: Social preferences and food preferences
- JSON structure enables flexible queries without schema changes

## Internationalization

The application supports three languages with dedicated translation files:

| Locale | Language | Status |
|--------|----------|--------|
| `en` | English | Complete |
| `es` | Spanish | Complete |
| `el` | Greek | Complete |

**Translation File Structure:**
- `messages/{locale}.json` - Main application translations
- `messages/legal/privacy-policy.{locale}.json` - Privacy Policy translations
- `messages/legal/cookie-policy.{locale}.json` - Cookie Policy translations
- `messages/legal/data-protection.{locale}.json` - Data Protection translations

## Planned Features

The following features are planned for future implementation:

| Feature | Description | Status |
|---------|-------------|--------|
| Stripe Webhooks | Handle payment confirmation events | Planned |
| AI Diet Generation | Generate personalized diet plans using OpenAI | Planned |
| PDF Export | Export diet plan as PDF document | Planned |
| Email Delivery | Send diet plan via Resend email | Planned |
| Dashboard | User dashboard to view diet plans | Planned |
| User Authentication | Full auth system (currently email-based) | Planned |

## Technical Highlights

- **Server-Side Rendering**: Next.js App Router for optimal performance
- **Type Safety**: Full TypeScript with Zod schema inference
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Semantic HTML and ARIA labels
- **Error Handling**: Graceful error handling with toast notifications
- **Loading States**: Visual feedback during async operations
- **GDPR Compliance**: Consent management with timezone detection
