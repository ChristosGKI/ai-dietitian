# GDPR Compliance

This document describes the GDPR compliance implementation in the AI Dietitian application.

## Overview

The application implements GDPR-compliant language selection with consent management, including:

- Silent consent for EU users based on timezone detection
- Clear links to privacy documentation
- Read-only language switching on legal pages
- Cookie-based preference persistence

## Consent Mechanism

### EU User Detection

The application detects EU users by checking their timezone against a list of European timezones:

```typescript
const euTimezones = [
  'Europe/Amsterdam', 'Europe/Andorra', 'Europe/Athens', 'Europe/Belgrade',
  'Europe/Berlin', 'Europe/Bratislava', 'Europe/Brussels', 'Europe/Bucharest',
  'Europe/Budapest', 'Europe/Chisinau', 'Europe/Copenhagen', 'Europe/Dublin',
  'Europe/Gibraltar', 'Europe/Guernsey', 'Europe/Helsinki', 'Europe/Isle_of_Man',
  'Europe/Istanbul', 'Europe/Jersey', 'Europe/Kaliningrad', 'Europe/Kiev',
  'Europe/Lisbon', 'Europe/Ljubljana', 'Europe/London', 'Europe/Luxembourg',
  'Europe/Madrid', 'Europe/Malta', 'Europe/Mariehamn', 'Europe/Minsk',
  'Europe/Monaco', 'Europe/Moscow', 'Europe/Nicosia', 'Europe/Oslo',
  'Europe/Paris', 'Europe/Podgorica', 'Europe/Prague', 'Europe/Riga',
  'Europe/Rome', 'Europe/San_Marino', 'Europe/Sarajevo', 'Europe/Simferopol',
  'Europe/Skopje', 'Europe/Sofia', 'Europe/Stockholm', 'Europe/Tallinn',
  'Europe/Tirane', 'Europe/Tiraspol', 'Europe/Uzhgorod', 'Europe/Vaduz',
  'Europe/Vatican', 'Europe/Vienna', 'Europe/Vilnius', 'Europe/Warsaw',
  'Europe/Zagreb', 'Europe/Zaporozhye', 'Europe/Zurich'
];

function isInEU(): boolean {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return euTimezones.includes(timezone);
}
```

### Consent Text

For EU users, the language selector displays consent text with links to legal documentation:

> "By selecting a language, you consent to the processing of your language preference data. Read our Privacy Policy and Cookie Policy for more information."

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

### Timezone Testing

To test non-EU behavior:
1. Temporarily add a non-EU timezone to the `euTimezones` array
2. Clear cookies and visit home page
3. GDPR text should not appear
