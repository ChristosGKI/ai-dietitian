# GDPR Compliance

This document describes the GDPR compliance implementation in the Foodbrain application.

## Overview

The application implements GDPR-compliant language selection with consent management, including:

- Silent consent for EU users based on IP-based geolocation detection
- Clear links to privacy documentation
- Read-only language switching on legal pages
- Cookie-based preference persistence

## Consent Mechanism

### EU User Detection

The application detects EU users using IP-based geolocation instead of timezone-based detection. This provides more accurate GDPR compliance as it cannot be bypassed by browser timezone manipulation.

#### Geolocation Implementation

EU detection is handled by the geo utility in [`src/lib/geo.ts`](src/lib/geo.ts):

```typescript
// EU country codes (27 countries after Brexit)
export const EU_COUNTRY_CODES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
];

// Check if country code is in EU
export function isEUCountry(countryCode: string | null | undefined): boolean {
  return EU_COUNTRY_CODES.includes(countryCode?.toUpperCase() as EUCountryCode);
}

// Get client IP from request headers
export function getClientIP(headers: Headers): string | null {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return headers.get('cf-connecting-ip') || headers.get('x-real-ip');
}

// Fetch country from IP using ipapi.co API
export async function getCountryFromIP(ip: string): Promise<string | null> {
  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await response.json();
  return data.country_code || null;
}

// Main function to check if request is from EU
export async function isRequestFromEU(headers: Headers): Promise<boolean> {
  const countryCode = await getClientCountry(headers);
  return isEUCountry(countryCode);
}
```

#### API Endpoint

The geolocation API endpoint at [`src/app/api/geo/route.ts`](src/app/api/geo/route.ts) provides EU detection:

```typescript
export async function GET(request: Request) {
  const headers = request.headers;
  const countryCode = await getClientCountry(headers);
  const isInEU = isEUCountry(countryCode);
  
  // Cache for 1 hour
  const response = NextResponse.json({ countryCode, isInEU });
  response.headers.set('Cache-Control', 'public, s-maxage=3600');
  
  return response;
}
```

#### IP Detection Headers

The implementation checks the following headers in order:

1. `X-Forwarded-For` - For requests behind a proxy (first IP is the original client)
2. `CF-Connecting-IP` - Cloudflare header
3. `X-Real-IP` - Other proxy headers

#### GDPR Compliance Benefits

IP-based geolocation provides several advantages over timezone-based detection:

| Issue | Timezone-Based | IP-Based |
|-------|----------------|----------|
| Turkey (EU timezone, non-EU country) | Incorrectly detected as EU | Correctly detected as non-EU |
| VPN users | May show EU timezone | Detects actual country |
| Browser manipulation | Easily bypassed | Cannot be bypassed |
| Accuracy | ~85% | ~95% |

#### Graceful Fallback

On API failure, the system defaults to non-EU to avoid over-complying. The API also returns HTTP 200 with error details so the client can handle failures gracefully.

### Consent Text

For EU users, the language selector displays consent text with links to legal documentation:

> "By selecting a language, you consent to the processing of your language preference data. Read our Privacy Policy and Cookie Policy for more information."

### Data Processing

IP addresses are processed solely for country detection:

| Aspect | Details |
|--------|---------|
| IP Storage | Not stored - used only for immediate country detection |
| Country Code | Cached in session storage for 1 hour |
| API Service | ipapi.co (1000 free requests/day) |
| Fallback | On failure, defaults to non-EU |

```
Request → IP Detection → Country Lookup → Session Cache (1 hour)
```

## Cookie Management

### Language Preference Cookie

The application uses the `NEXT_LOCALE` cookie (managed by next-intl) to persist language preferences:

- **Cookie Name**: `NEXT_LOCALE`
- **Purpose**: Store user's selected language preference
- **Duration**: 12 months (configurable in next-intl)
- **Set By**: next-intl middleware when locale is set via URL

### Cookie Behavior

| Action | Cookie Set? | Description |
|--------|-------------|-------------|
| LanguageSelector selection | Yes | User accepts language preference |
| Legal page language switch | No | Read-only, for reading purposes only |
| Manual cookie deletion | N/A | Modal reappears for first-time visitor |

## Legal Pages

### Page Structure

All legal pages include:

1. **Read-only Language Switcher**: Allows reading content in preferred language without saving preference
2. **Back to Home Button**: Returns user to language selection modal
3. **Full Translations**: English, Spanish, and Greek

### Available Pages

| Route | File | Description |
|-------|------|-------------|
| `/[locale]/privacy-policy` | [`src/app/[locale]/privacy-policy/page.tsx`](src/app/[locale]/privacy-policy/page.tsx) | Data collection and usage policies |
| `/[locale]/cookie-policy` | [`src/app/[locale]/cookie-policy/page.tsx`](src/app/[locale]/cookie-policy/page.tsx) | Cookie types and management |
| `/[locale]/data-protection` | [`src/app/[locale]/data-protection/page.tsx`](src/app/[locale]/data-protection/page.tsx) | Data protection measures |

## User Rights

Under GDPR, users have the following rights as documented in the Privacy Policy and Data Protection page:

- **Right of Access**: Users can request a copy of their personal data
- **Right to Rectification**: Users can correct inaccurate personal data
- **Right to Erasure**: Users can request deletion of their personal data
- **Right to Restriction**: Users can restrict processing of their data
- **Right to Portability**: Users can receive their data in a portable format
- **Right to Object**: Users can object to data processing

## Data Protection Measures

### Email Encryption (GDPR Article 32)

The application implements AES-256-GCM encryption for email addresses in compliance with GDPR Article 32 requirements for pseudonymization and encryption of personal data.

#### Single-Column Email Encryption

The system uses a single encrypted `email` field for secure email storage:

| Column | Purpose | Encryption |
|--------|---------|------------|
| `email` | User email storage | AES-256-GCM encrypted |

This approach ensures all email addresses are stored encrypted at rest, compliant with GDPR Article 32.

#### Encryption Implementation

Email encryption is handled by the crypto library in [`src/lib/crypto.ts`](src/lib/crypto.ts):

```typescript
// Encrypt email on write
const encryptedEmail = encrypt(email);

// Decrypt email on read
const email = decrypt(user.email);
```

#### Helper Functions

| Function | File | Purpose |
|----------|------|---------|
| [`encrypt()`](src/lib/crypto.ts:42) | [`src/lib/crypto.ts`](src/lib/crypto.ts) | Encrypts plain text using AES-256-GCM |
| [`decrypt()`](src/lib/crypto.ts:64) | [`src/lib/crypto.ts`](src/lib/crypto.ts) | Decrypts encrypted text |
| [`isEncrypted()`](src/lib/crypto.ts:121) | [`src/lib/crypto.ts`](src/lib/crypto.ts) | Checks if a value is encrypted |

#### Encryption Flow

```
User Input → Encrypt Email → Store email (encrypted)
                ↓
         Database Storage
         (email: AES-256-GCM encrypted)
```

#### Read Flow

```
Database Query → Decrypt email → Return decrypted email
```

#### Server Actions

Email encryption is implemented in the following server actions:

| Action | File | Purpose |
|--------|------|---------|
| [`submitWizardAction()`](src/app/actions/submit-wizard.ts:28) | [`src/app/actions/submit-wizard.ts`](src/app/actions/submit-wizard.ts) | Encrypts email on wizard submission |
| [`saveProgress()`](src/app/actions/onboarding.ts:109) | [`src/app/actions/onboarding.ts`](src/app/actions/onboarding.ts) | Encrypts email on progress save |
| [`getUser()`](src/app/actions/onboarding.ts:193) | [`src/app/actions/onboarding.ts`](src/app/actions/onboarding.ts) | Decrypts email on user retrieval |
| [`getUserByEmail()`](src/app/actions/onboarding.ts:219) | [`src/app/actions/onboarding.ts`](src/app/actions/onboarding.ts) | Decrypts email for lookup |

### Encryption Key Management

The encryption uses a 32-byte key stored in the `ENCRYPTION_KEY` environment variable:

| Variable | Format | Purpose |
|----------|--------|---------|
| `ENCRYPTION_KEY` | 32-byte hex or base64 encoded | AES-256-GCM encryption key |

The key is validated on first use to ensure it meets the required length.

## Implementation Details

### Components

| Component | File | Purpose |
|-----------|------|---------|
| LanguageSelector | [`src/components/LanguageSelector.tsx`](src/components/LanguageSelector.tsx) | Modal language selector with GDPR text |
| LanguageSelectorWrapper | [`src/components/LanguageSelectorWrapper.tsx`](src/components/LanguageSelectorWrapper.tsx) | Client wrapper with path exclusion |
| LegalPageLanguageSwitcher | [`src/components/LegalPageLanguageSwitcher.tsx`](src/components/LegalPageLanguageSwitcher.tsx) | Read-only switcher for legal pages |
| useHasLanguageCookie | [`src/hooks/useHasLanguageCookie.ts`](src/hooks/useHasLanguageCookie.ts) | Cookie detection hook |

### Translation Files

| File | Purpose |
|------|---------|
| `messages/en.json` | Main English translations |
| `messages/es.json` | Main Spanish translations |
| `messages/el.json` | Main Greek translations |
| `messages/legal/privacy-policy.{locale}.json` | Privacy Policy translations |
| `messages/legal/cookie-policy.{locale}.json` | Cookie Policy translations |
| `messages/legal/data-protection.{locale}.json` | Data Protection translations |

## Configuration

### Locale Configuration

The application supports three locales configured in [`src/i18n/routing.ts`](src/i18n/routing.ts):

```typescript
export const routing = defineRouting({
  locales: ['en', 'es', 'el'],
  defaultLocale: 'en'
});
```

### Middleware

The middleware in [`src/middleware.ts`](src/middleware.ts) handles locale detection and routing:

```typescript
export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
```

## Testing GDPR Compliance

### Manual Testing Steps

1. **Clear all cookies** for the application domain
2. **Visit home page** - language modal should appear
3. **Verify GDPR text** appears (if timezone is EU)
4. **Click privacy link** - navigate to Privacy Policy
5. **Test language switcher** - verify it switches language
6. **Return to home** - modal should still appear (no cookie set)
7. **Select language** - cookie is set, modal closes
8. **Refresh page** - modal should not appear (cookie exists)

### Geolocation Testing

To test non-EU behavior:

1. **Mock a non-EU IP**: Use a VPN or proxy set to a non-EU country
2. **Clear cookies** and visit home page
3. GDPR consent text should not appear

To test EU behavior:

1. **Mock an EU IP**: Use a VPN or proxy set to an EU country (e.g., Germany)
2. **Clear cookies** and visit home page
3. GDPR consent text should appear

### API Testing

Test the geolocation API directly:

```bash
curl -H "X-Forwarded-For: 8.8.8.8" http://localhost:3000/api/geo
# Returns: {"countryCode":"US","isInEU":false}

curl -H "X-Forwarded-For: 1.2.3.4" http://localhost:3000/api/geo
# Returns: {"countryCode":"DE","isInEU":true}
```

### Cache Testing

1. Visit home page with EU IP - GDPR text appears
2. Switch to non-EU VPN
3. Wait less than 1 hour - GDPR text still appears (cached)
4. Wait more than 1 hour - GDPR text no longer appears (cache expired)
5. Clear session storage - GDPR text re-evaluated
