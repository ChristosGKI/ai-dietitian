# Cookie Consent Legal Compliance Requirements Specification

**Document Version:** 1.0  
**Created:** January 2026  
**Related Issues:** Issue 5 - Cookie Consent Non-Compliance (Audit Report)  
**Compliance Standard:** GDPR (EU) 2016/679 + ePrivacy Directive 2002/58/EC

---

## 1. Executive Summary

This document specifies the requirements for implementing GDPR-compliant cookie consent in the AI Dietitian application. The current implementation violates the ePrivacy Directive by automatically setting non-essential cookies upon language selection without explicit user consent for each cookie category.

### Current Violations Identified

| Violation | Severity | Location | Impact |
|-----------|----------|----------|--------|
| Implicit consent for non-essential cookies | HIGH | [`LanguageSelectorPopup.tsx:127-128`](src/components/LanguageSelectorPopup.tsx:127) | Automatically sets `legal_accepted` cookie |
| No granular consent options | HIGH | [`LanguageSelectorPopup.tsx`](src/components/LanguageSelectorPopup.tsx) | Cannot consent to specific cookie categories |
| Missing "Reject All" button | HIGH | [`LanguageSelectorPopup.tsx:162-175`](src/components/LanguageSelectorPopup.tsx:162) | Only "Accept All" behavior available |
| No consent withdrawal mechanism | MEDIUM | [`useHasLegalAcceptance.ts`](src/hooks/useHasLegalAcceptance.ts) | Users cannot withdraw consent |
| Pre-ticked consent categories | HIGH | N/A | Violates opt-in requirement |

### Compliance Target

| Metric | Current State | Target State |
|--------|---------------|--------------|
| Cookie Compliance Score | 40% | 100% |
| Explicit Opt-in Required | ❌ No | ✅ Yes |
| Granular Consent | ❌ No | ✅ Yes |
| Reject All Available | ❌ No | ✅ Yes |
| Consent Withdrawal | ❌ No | ✅ Yes |

---

## 2. GDPR/ePrivacy Cookie Consent Requirements

### 2.1 Explicit Opt-in Requirements (Article 4(11) GDPR)

**Regulatory Requirement:** Consent must be a freely given, specific, informed, and unambiguous indication of the data subject's agreement.

#### Implementation Requirements:

1. **Prior Consent (Article 6(1)(a))**
   - Non-essential cookies must NOT be set before explicit user action
   - Essential cookies only: `NEXT_LOCALE` for language preference
   - All other cookies require prior consent

2. **Affirmative Action (ePrivacy Directive)**
   - Cookie setting requires positive action from user
   - Silence, pre-ticked boxes, or continued browsing do NOT constitute consent
   - Users must actively accept or reject each category

3. **Granularity Requirements**
   - Users must be able to consent to some categories and not others
   - Essential cookies cannot be disabled (they are necessary for basic functionality)
   - Non-essential categories must be optional

### 2.2 Required Cookie Categories

| Category | Required | Justification | Default State |
|----------|----------|---------------|---------------|
| **Essential** | ✅ Yes | Required for website functionality (language selection, security, session management) | Always Active |
| **Functional** | ✅ Yes | User preferences, UI customization,记住 settings | Pre-unticked |
| **Analytics** | ✅ Yes | Website improvement, performance monitoring | Pre-unticked |
| **Marketing** | ✅ No | Targeted advertising, cross-site tracking | Pre-unticked (if implemented) |

#### Category Definitions:

**Essential Cookies (Strictly Necessary)**
- `NEXT_LOCALE`: Stores user's selected language preference
- Session security tokens
- Load balancing identifiers
- No consent required - these are technically necessary

**Functional Cookies (Enhanced Functionality)**
- Remember UI preferences (font size, theme, layout)
- Save form data during multi-step processes
- Region-specific content delivery preferences
- **Legal Basis:** Legitimate interest + explicit consent

**Analytics Cookies (Performance & Measurement)**
- Page view tracking
- Session duration measurement
- Error reporting
- A/B testing (if implemented)
- **Legal Basis:** Legitimate interest + explicit consent
- Must use anonymized/pseudonymized data where possible

**Marketing Cookies (Advertising & Tracking)**
- Cross-site user profiling
- Targeted advertising
- Remarketing pixels
- **Legal Basis:** Explicit consent only (not legitimate interest)
- May require additional disclosures

### 2.3 "Reject All" Button Requirements

**Regulatory Requirement:** Users must have the same ease of rejecting consent as accepting it.

#### UI Requirements:

1. **Equal Prominence**
   - "Reject All" button must have equal visual weight to "Accept All"
   - Same size, color prominence, and positioning
   - Cannot be hidden in submenus or require additional clicks

2. **Button Copy Requirements**

| Button | Required Copy | Translation Keys |
|--------|---------------|------------------|
| Accept All | "Accept All" | `cookieConsent.acceptAll` |
| Reject All | "Reject All" | `cookieConsent.rejectAll` |
| Save Preferences | "Save Preferences" | `cookieConsent.savePreferences` |
| Customize | "Customize" | `cookieConsent.customize` |

3. **Button Hierarchy (Recommended)**
   ```
   ┌─────────────────────────────────────┐
   │  [ Accept All ]    [ Reject All ]  │  ← Equal prominence
   │         [ Customize ]              │  ← Secondary option
   └─────────────────────────────────────┘
   ```

### 2.4 Pre-ticked vs. Pre-unticked Requirements

**Critical Rule:** All non-essential cookie categories MUST be pre-unticked by default.

| Category | Pre-ticked? | Legal Consequence |
|----------|-------------|-------------------|
| Essential | N/A (always active) | No consent required |
| Functional | ❌ NO (MUST be unticked) | Violation if pre-ticked |
| Analytics | ❌ NO (MUST be unticked) | Violation if pre-ticked |
| Marketing | ❌ NO (MUST be unticked) | Violation if pre-ticked |

**Visual Design Requirements:**
- Toggles/switches must default to OFF position
- Checkboxes must be unchecked by default
- No "soft opt-out" or partial selection by default
- Users must actively enable each category

### 2.5 Consent Withdrawal Mechanism

**Regulatory Requirement:** Users must be able to withdraw consent as easily as they gave it (Article 7(3) GDPR).

#### Implementation Requirements:

1. **Withdrawal Access**
   - Clear "Cookie Settings" link in footer
   - Visible on all pages after initial consent
   - Maximum 2 clicks from any page

2. **Withdrawal Actions**
   - "Withdraw Consent" button in settings
   - Immediate effect: cookies deleted within 24 hours
   - Confirmation message displayed

3. **Cookie Deletion Requirements**

| Cookie Type | Deletion Method | Timeline |
|-------------|-----------------|----------|
| Analytics | JavaScript deletion | Immediate |
| Marketing | JavaScript deletion + opt-out pixels | Immediate |
| Functional | JavaScript deletion | Immediate |
| All consent records | Backend deletion | 24 hours |

4. **Consent Record Deletion**
   ```typescript
   // Required API endpoint
   DELETE /api/consent/withdraw
   - Requires authentication
   - Deletes all consent records
   - Triggers cookie cleanup
   - Returns confirmation
   ```

---

## 3. Data Maximization Opportunities

While maintaining full GDPR compliance, there are legitimate opportunities to maximize data collection through proper consent presentation and legitimate interest.

### 3.1 Legitimate Interest Basis (Article 6(1)(f))

**Categories Where Legitimate Interest Applies:**

| Category | Legitimate Interest | Implementation Note |
|----------|--------------------|---------------------|
| Analytics | Improve service quality | Must anonymize IP, short retention |
| Functional | Enhance user experience | Store preferences only, no tracking |
| Security | Fraud prevention | Short-lived tokens, session-based |

**Requirements for Legitimate Interest:**
- Document legitimate interest assessment
- Provide opt-out mechanism
- Regular review of interest balancing test
- Transparency in privacy policy

### 3.2 Maximizing Analytics Consent

**User Benefits to Emphasize:**

| Benefit | Presentation |
|---------|-------------|
| Faster loading pages | "Helps us optimize website speed" |
| Bug-free experience | "Identifies and fixes technical issues" |
| Better content | "Shows you the most useful information" |
| Performance insights | "Understands which features are popular" |

**Consent Copy Recommendations:**

**English:**
> "Analytics cookies help us improve our website by showing us which pages are most popular and how visitors move around the site. This helps us create a better experience for everyone."

**Spanish:**
> "Las cookies de análisis nos ayudan a mejorar nuestro sitio web mostrándonos las páginas más populares y cómo los visitantes navegan por el sitio. Esto nos ayuda a crear una mejor experiencia para todos."

**Greek:**
> "Τα αναλυτικά cookies μας βοηθούν να βελτιώσουμε τον ιστότοπό μας δείχνοντάς μας τις πιο δημοφιλείς σελίδες και πώς οι επισκέπτες περιηγούνται στον ιστότοπο. Αυτό μας βοηθά να δημιουργήσουμε μια καλύτερη εμπειρία για όλους."

### 3.3 Maximizing Functional Consent

**User Benefits to Emphasize:**

| Benefit | Presentation |
|---------|-------------|
| Remember preferences | "Remembers your settings so you don't have to set them each time" |
| Saved progress | "Saves your progress so you don't lose your data" |
| Consistent experience | "Keeps your experience consistent as you navigate" |

### 3.4 Consent UI Optimization (Compliant)

**High-Conforming Design Pattern:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    🍪 Cookie Preferences                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Essential (Always Active)                                          │
│  ✓ Required for the website to function properly                    │
│                                                                     │
│  ────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Functional Cookies                                                 │
│  [ ] Remember your preferences and UI settings                      │
│      Benefits: Remembers your language and display preferences      │
│                                                                     │
│  ────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Analytics Cookies                                                 │
│  [ ] Help us improve our website performance                        │
│      Benefits: Identifies popular content, optimizes loading times  │
│                                                                     │
│  ────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [ Reject All ]        [ Customize ]        [ Accept All ]  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Compliance Elements:**
1. Essential always visible, always active
2. Clear benefit statements for each optional category
3. Pre-unticked checkboxes (all OFF by default)
4. Equal prominence for Accept/Reject buttons
5. "Customize" as secondary option

---

## 4. Specific Requirements for AI Dietitian Project

### 4.1 Cookie Categories to Implement

#### Required Cookies Table:

| Cookie Name | Category | Purpose | Duration | First/Third Party |
|-------------|----------|---------|----------|-------------------|
| `NEXT_LOCALE` | Essential | Language preference | 12 months | First-party |
| `consent_essential` | Essential | Consent record | 12 months | First-party |
| `consent_functional` | Functional | Functional consent | 12 months | First-party |
| `consent_analytics` | Analytics | Analytics consent | 12 months | First-party |
| `consent_marketing` | Marketing | Marketing consent | 12 months | First-party |
| `_ga` | Analytics | Google Analytics | 2 years | Third-party |
| `_gid` | Analytics | Google Analytics | 24 hours | Third-party |
| _fbp | Marketing | Facebook Pixel | 3 months | Third-party |

### 4.2 Required UI Components

#### 4.2.1 Cookie Consent Banner

**Location:** Display on first visit for EU users (detected via IP geolocation)

**Structure:**
```typescript
interface CookieConsentBannerProps {
  isVisible: boolean;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onCustomize: () => void;
  onManagePreferences: () => void;
}
```

**Translation Keys Required:**
```json
{
  "cookieConsent": {
    "title": "We value your privacy",
    "description": "We use cookies to enhance your experience. Essential cookies are always active, and you can choose to enable or disable other types of cookies.",
    "acceptAll": "Accept All",
    "rejectAll": "Reject All",
    "customize": "Customize",
    "managePreferences": "Manage Preferences",
    "learnMore": "Learn More"
  }
}
```

#### 4.2.2 Cookie Preferences Modal

**Structure:**
```typescript
interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
}
```

**Sections Required:**
1. Essential Cookies (read-only, always active)
2. Functional Cookies (toggle switch, pre-unticked)
3. Analytics Cookies (toggle switch, pre-unticked)
4. Marketing Cookies (toggle switch, pre-unticked)

#### 4.2.3 Footer Link

**Requirements:**
- Link text: "Cookie Settings" or "Manage Cookies"
- Location: Footer, near Privacy Policy link
- Action: Opens Cookie Preferences Modal

### 4.3 Required API Endpoints

#### 4.3.1 Consent API

**File:** `src/app/api/consent/route.ts`

```typescript
// GET - Retrieve current consent status
GET /api/consent
Response: {
  essential: true,
  functional: boolean,
  analytics: boolean,
  marketing: boolean,
  timestamp: string,
  version: string
}

// POST - Save consent preferences
POST /api/consent
Body: {
  functional: boolean,
  analytics: boolean,
  marketing: boolean,
  version: string
}
Response: {
  success: true,
  consentId: string,
  timestamp: string
}

// DELETE - Withdraw all consent
DELETE /api/consent
Response: {
  success: true,
  message: "All consent withdrawn"
}
```

#### 4.3.2 Consent Record Database Schema

**Add to Prisma schema:**

```prisma
model CookieConsent {
  id            String   @id @default(cuid())
  userId        String?  @unique // Nullable for anonymous users
  sessionId     String   @unique // For anonymous tracking
  essential     Boolean  @default(true)
  functional    Boolean  @default(false)
  analytics     Boolean  @default(false)
  marketing     Boolean  @default(false)
  consentVersion String  @default("1.0")
  ipAddress     String   // Encrypted
  userAgent     String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  withdrawnAt   DateTime?
  
  @@index([userId])
  @@index([sessionId])
}
```

### 4.4 Cookie Storage Requirements

#### 4.4.1 Cookie Attributes

**Essential Cookies:**
```
Name: NEXT_LOCALE
Value: {locale}
Domain: {current domain}
Path: /
Expires: 12 months
SameSite: Lax
HttpOnly: false (needed for JS access)
Secure: true (HTTPS only)
```

**Consent Cookies:**
```
Name: consent_{category}
Value: {timestamp}
Domain: {current domain}
Path: /
Expires: 12 months
SameSite: Lax
HttpOnly: false
Secure: true
```

#### 4.4.2 Consent Storage Structure

```typescript
interface ConsentRecord {
  version: string;          // For future schema changes
  timestamp: string;        // ISO 8601
  categories: {
    essential: true;        // Always true
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  source: 'banner' | 'preferences';
}
```

### 4.5 Consent Record-Keeping Requirements

**Article 7(1) GDPR:** Controllers must be able to demonstrate that the data subject consented.

#### Required Records:

| Field | Required | Purpose |
|-------|----------|---------|
| Consent ID | ✅ Yes | Unique identifier |
| User/Session ID | ✅ Yes | Who consented |
| Timestamp | ✅ Yes | When consent given |
| Consent Version | ✅ Yes | What they consented to |
| Categories | ✅ Yes | Scope of consent |
| IP Address | ✅ Yes (encrypted) | Evidence of consent |
| User Agent | ✅ Yes | Browser context |
| Withdrawal Timestamp | ✅ Yes (if withdrawn) | Consent lifecycle |

#### Retention Period:

| Record Type | Retention | Justification |
|-------------|-----------|---------------|
| Active consent | Duration of consent + 1 year | Legal defense |
| Withdrawn consent | 3 years | Statute of limitations |
| Anonymous analytics | 14 months | Industry standard |

#### Audit Log Structure:

```typescript
interface ConsentAuditLog {
  id: string;
  consentId: string;
  action: 'created' | 'updated' | 'withdrawn' | 'viewed';
  timestamp: DateTime;
  ipAddress: string;  // Encrypted
  userAgent: string;
  previousState?: ConsentRecord;
  newState?: ConsentRecord;
}
```

---

## 5. Legal Text Requirements

### 5.1 Cookie Policy Updates

**Update Required:** [`messages/legal/cookie-policy.en.json`](messages/legal/cookie-policy.en.json)

#### New Sections to Add:

**1. Legal Basis Section:**
```json
"legalBasis": {
  "title": "Legal Basis for Cookie Usage",
  "content": "Under the GDPR and ePrivacy Directive, we require your explicit consent before setting non-essential cookies on your device. Essential cookies are necessary for the website to function and do not require consent.",
  "essentialNote": "Essential cookies are strictly necessary for the website to function and cannot be disabled.",
  "explicitConsent": "We obtain your explicit consent for functional, analytics, and marketing cookies through our cookie consent banner."
}
```

**2. Consent Management Section:**
```json
"consentManagement": {
  "title": "Managing Your Cookie Preferences",
  "content": "You have the right to accept or reject non-essential cookies, and to withdraw your consent at any time.",
  "howToManage": {
    "title": "How to Manage Your Preferences",
    "banner": "When you first visit our website, you can accept all cookies or customize your preferences.",
    "footer": "You can change your preferences at any time by clicking 'Cookie Settings' in our footer.",
    "withdraw": "To withdraw all consent, visit your account settings or contact us."
  },
  "withdrawRights": {
    "title": "Your Rights",
    "right1": "Accept or reject non-essential cookies",
    "right2": "Change your preferences at any time",
    "right3": "Withdraw all consent with immediate effect",
    "right4": "Request a copy of your consent records"
  }
}
```

**3. Third-Party Disclosure Update:**
```json
"thirdParty": {
  "title": "Third-Party Cookies and Services",
  "content": "Some cookies are placed by third-party services that appear on our pages.",
  "providers": {
    "analytics": {
      "title": "Analytics Services",
      "description": "We use analytics services to understand how visitors interact with our website. These services may set cookies to collect information about your use of our website.",
      "providers": ["Google Analytics"]
    },
    "payment": {
      "title": "Payment Processing",
      "description": "Our payment processor may set cookies necessary for transaction processing.",
      "providers": ["Stripe"]
    }
  },
  "optOut": "You can opt out of third-party tracking through your browser settings or our cookie preferences."
}
```

### 5.2 Privacy Policy Updates

**Required Updates to Privacy Policy:**

Add new section "Cookie Consent and Management":

```json
"cookieConsent": {
  "title": "Cookie Consent",
  "intro": "We respect your right to privacy and comply with GDPR requirements for cookie consent.",
  "explicitConsent": {
    "title": "Explicit Consent Required",
    "content": "Non-essential cookies (functional, analytics, and marketing) are only set after you provide explicit consent through our cookie consent banner."
  },
  "granularControl": {
    "title": "Granular Control",
    "content": "You can choose which types of cookies to accept. Essential cookies are always active as they are necessary for the website to function."
  },
  "withdrawal": {
    "title": "Withdrawing Consent",
    "content": "You may withdraw your consent at any time by using the 'Cookie Settings' link in our footer or by contacting us."
  },
  "recordKeeping": {
    "title": "Consent Records",
    "content": "We maintain records of your consent choices, including the timestamp, categories consented to, and version of our consent policy."
  }
}
```

---

## 6. Implementation Checklist

### 6.1 Phase 1: Foundation (Week 1)

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Create Cookie Consent API endpoints | HIGH | 2 days | ⬜ |
| Add consent database schema | HIGH | 1 day | ⬜ |
| Create Cookie Preferences hook | MEDIUM | 1 day | ⬜ |
| Add cookie management utilities | MEDIUM | 1 day | ⬜ |

### 6.2 Phase 2: UI Components (Week 2)

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Create CookieConsentBanner component | HIGH | 2 days | ⬜ |
| Create CookiePreferencesModal component | HIGH | 2 days | ⬜ |
| Add footer link to cookie settings | MEDIUM | 0.5 day | ⬜ |
| Update LanguageSelectorPopup to separate concerns | HIGH | 1 day | ⬜ |

### 6.3 Phase 3: Integration (Week 2-3)

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Integrate consent banner on first visit | HIGH | 1 day | ⬜ |
| Implement cookie blocking until consent | HIGH | 1 day | ⬜ |
| Add consent to database sync | MEDIUM | 1 day | ⬜ |
| Implement withdrawal endpoint | HIGH | 1 day | ⬜ |

### 6.4 Phase 4: Legal Updates (Week 3)

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Update cookie policy translations | HIGH | 1 day | ⬜ |
| Update privacy policy translations | HIGH | 1 day | ⬜ |
| Add consent version tracking | MEDIUM | 0.5 day | ⬜ |
| Audit log implementation | MEDIUM | 1 day | ⬜ |

### 6.5 Phase 5: Testing & Validation (Week 4)

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| GDPR compliance audit | HIGH | 1 day | ⬜ |
| Cookie blocking verification | HIGH | 1 day | ⬜ |
| Cross-browser testing | MEDIUM | 1 day | ⬜ |
| Mobile responsiveness testing | MEDIUM | 0.5 day | ⬜ |
| Accessibility audit | MEDIUM | 0.5 day | ⬜ |

---

## 7. Technical Specifications

### 7.1 Cookie Manager Service

**File:** `src/lib/cookie-manager.ts`

```typescript
interface CookiePreferences {
  essential: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

class CookieManager {
  // Set consent cookie
  setConsent(preferences: CookiePreferences): void;
  
  // Get current consent
  getConsent(): CookiePreferences | null;
  
  // Check if category is allowed
  isAllowed(category: keyof CookiePreferences): boolean;
  
  // Withdraw all consent
  withdraw(): void;
  
  // Clear all consent cookies
  clearAll(): void;
  
  // Set specific cookie with consent check
  setCookie(name: string, value: string, options: CookieOptions): boolean;
}

export const cookieManager = new CookieManager();
```

### 7.2 Consent Hook

**File:** `src/hooks/useCookieConsent.ts`

```typescript
'use client';

import { useState, useCallback } from 'react';
import { CookiePreferences } from '@/lib/cookie-manager';

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [hasConsented, setHasConsented] = useState(false);

  const acceptAll = useCallback(async () => {
    const prefs: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    await saveConsent(prefs);
  }, []);

  const rejectAll = useCallback(async () => {
    const prefs: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    await saveConsent(prefs);
  }, []);

  const savePreferences = useCallback(async (prefs: Partial<CookiePreferences>) => {
    const fullPrefs: CookiePreferences = {
      essential: true,
      functional: prefs.functional ?? false,
      analytics: prefs.analytics ?? false,
      marketing: prefs.marketing ?? false,
    };
    await saveConsent(fullPrefs);
  }, []);

  return {
    preferences,
    hasConsented,
    acceptAll,
    rejectAll,
    savePreferences,
  };
}
```

### 7.3 Google Analytics Integration (Post-Consent)

**File:** `src/lib/analytics.ts`

```typescript
// Only initialize GA if consent is given
export async function initializeAnalytics(): Promise<void> {
  const consent = cookieManager.getConsent();
  
  if (!consent?.analytics) {
    console.log('[Analytics] Consent not granted, skipping initialization');
    return;
  }

  // Initialize Google Analytics
  // ... GA initialization code
}

// Initialize on page load with consent check
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeAnalytics();
  });
}
```

---

## 8. File References

| Current File | Changes Required |
|--------------|------------------|
| [`src/components/LanguageSelectorPopup.tsx`](src/components/LanguageSelectorPopup.tsx) | Separate legal acceptance from cookie consent |
| [`src/hooks/useHasLegalAcceptance.ts`](src/hooks/useHasLegalAcceptance.ts) | Refactor to check cookie consent specifically |
| [`src/app/api/geo/route.ts`](src/app/api/geo/route.ts) | No changes (already correctly implemented) |
| [`messages/legal/cookie-policy.en.json`](messages/legal/cookie-policy.en.json) | Add consent management sections |
| [`messages/legal/privacy-policy.en.json`](messages/legal/privacy-policy.en.json) | Add cookie consent section |
| `src/lib/cookie-manager.ts` | **NEW FILE** |
| `src/hooks/useCookieConsent.ts` | **NEW FILE** |
| `src/components/CookieConsentBanner.tsx` | **NEW FILE** |
| `src/components/CookiePreferencesModal.tsx` | **NEW FILE** |
| `src/app/api/consent/route.ts` | **NEW FILE** |

---

## 9. Compliance Verification Checklist

### Pre-Launch Verification

| Requirement | Verification Method | Status |
|-------------|--------------------|--------|
| No non-essential cookies set before consent | Browser dev tools | ⬜ |
| Essential cookies only set without consent | Cookie audit | ⬜ |
| All non-essential categories pre-unticked | UI inspection | ⬜ |
| "Reject All" button equal prominence | Visual audit | ⬜ |
| "Cookie Settings" link in footer | Navigation test | ⬜ |
| Consent withdrawal immediate effect | Functional test | ⬜ |
| Consent records stored in database | Database query | ⬜ |
| Audit log captures consent events | Log inspection | ⬜ |
| Cookie policy updated with consent info | Content review | ⬜ |
| Privacy policy updated with consent info | Content review | ⬜ |
| All translations complete | Translation audit | ⬜ |

### Automated Testing Requirements

```typescript
describe('Cookie Consent Compliance', () => {
  it('should not set non-essential cookies before consent', () => {
    // Clear all cookies
    // Visit page
    // Check no analytics/marketing cookies exist
    expect(cookies.get('_ga')).toBeUndefined();
    expect(cookies.get('_fbp')).toBeUndefined();
  });

  it('should set essential cookies without consent', () => {
    // Clear all cookies
    // Visit page
    // Check essential cookie is set
    expect(cookies.get('NEXT_LOCALE')).toBeDefined();
  });

  it('should pre-untick all non-essential categories', () => {
    // Open cookie preferences
    // Verify all toggles are OFF by default
  });

  it('should have equal prominence for Accept/Reject', () => {
    // Capture screenshot
    // Compare button dimensions and colors
    // Assert: buttons have equal visual weight
  });

  it('should delete cookies on withdrawal', async () => {
    // Give consent
    // Withdraw consent
    // Verify cookies are deleted
  });
});
```

---

## 10. Conclusion

This specification document provides comprehensive requirements for implementing GDPR-compliant cookie consent in the AI Dietitian application. Following these specifications will:

1. **Achieve 100% cookie compliance** with GDPR and ePrivacy Directive
2. **Eliminate legal risk** from current consent violations
3. **Provide users with control** over their data
4. **Enable legitimate data collection** through proper consent presentation
5. **Maintain audit trail** for regulatory compliance

**Estimated Implementation Time:** 4 weeks  
**Compliance Impact:** Critical (Current state violates GDPR)  
**Priority:** IMMEDIATE (Blocker for EU market launch)

---

*Document prepared for AI Dietitian development team*  
*Compliance Standard: GDPR (EU) 2016/679 + ePrivacy Directive 2002/58/EC*
