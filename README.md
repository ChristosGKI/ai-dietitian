# AI Dietitian

A comprehensive personalized diet planning web application built with Next.js 16, featuring a multi-step onboarding process, seamless payment integration, and GDPR-compliant language selection.

## 🌟 Features

### Config-Driven Wizard
A 6-phase, 13-step progressive form that collects user data for personalized diet recommendations:
- **Get Started** - Name and email capture
- **The Basics** - Gender, age, weight, height
- **Kitchen Reality** - Cooking habits and skill level
- **The Blacklist** - Food exclusions and allergies
- **Movement** - Activity level
- **Vices & Lifestyle** - Social preferences

### Multi-Language Support
Full internationalization with support for:
- 🇺🇸 English (en)
- 🇪🇸 Spanish (es)
- 🇬🇷 Greek (el)

### GDPR-Compliant Language Selector
- Modal appears for first-time visitors
- Sets both locale and legal acceptance cookies
- Links to legal documentation
- EU timezone detection for GDPR compliance

### Legal Documentation
Dedicated pages with full i18n support:
- Privacy Policy
- Cookie Policy
- Data Protection
- Terms of Service

### Payment Integration
Stripe checkout integration for premium subscriptions:
- Euro currency (EUR)
- Fixed price: €6.99
- Secure checkout with webhook support

### Security
- AES-256-GCM encryption for PII (Personally Identifiable Information)
- Secure cookie handling
- GDPR compliance

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Payments**: Stripe
- **i18n**: next-intl 4.7.0
- **Forms**: React Hook Form 7 + Zod
- **Icons**: Lucide React

## 📁 Project Structure

```
foodbrain/
├── docs/                    # Documentation
├── prisma/                  # Database schema & migrations
├── public/                  # Static assets
├── messages/                # Translation files (i18n)
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── [locale]/        # Localized routes
│   │   ├── actions/         # Server actions
│   │   └── api/             # API routes
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── wizard/          # Wizard form components
│   │   └── onboarding/      # Onboarding components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities & configurations
│   ├── i18n/                # Internationalization config
│   └── types/               # TypeScript types
└── configuration files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd foodbrain
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/foodbrain"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENCRYPTION_KEY="your-32-byte-encryption-key"
```

5. Set up the database:
```bash
npx prisma migrate dev
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Documentation

- [Project Structure](docs/PROJECT_STRUCTURE.md) - Detailed directory overview
- [Tech Stack](docs/TECH_STACK.md) - Technologies used
- [Features](docs/FEATURES.md) - Complete feature list
- [Form Wizard](docs/FORM_WIZARD.md) - Wizard configuration guide
- [GDPR](docs/GDPR.md) - Privacy and compliance information
- [Database](docs/DATABASE.md) - Schema documentation

## 🌍 Internationalization

The application supports three languages. Translation files are located in:
- `messages/en.json` - English
- `messages/es.json` - Spanish
- `messages/el.json` - Greek
- `messages/legal/` - Legal document translations

## 🔐 Security

- All PII (name, email) is encrypted using AES-256-GCM
- Cookies are secured with SameSite=Lax
- GDPR compliant consent management
- Stripe webhook signature verification

## 📝 License

This project is proprietary software.

## 🤝 Support

For support, please contact the development team.

---

Built with ❤️ using Next.js and modern web technologies.
