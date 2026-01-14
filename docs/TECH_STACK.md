# Tech Stack

The AI Dietitian project is built with modern, scalable technologies to provide a robust and performant web application.

## Core Technologies

### Framework & Runtime

- **Next.js 16.1.1** - React framework with App Router for server-side rendering and static site generation
- **React 19.2.3** - UI library for building component-based interfaces
- **TypeScript 5** - Static typing for improved code quality and developer experience

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - Reusable components built with Radix UI primitives
- **class-variance-authority (CVA)** - Type-safe component variants
- **tw-animate-css** - CSS animation utilities

### Database & ORM

- **Prisma 7.2.0** - Next-generation ORM for type-safe database operations
- **PostgreSQL** - Relational database (configured in schema)
- **@prisma/adapter-pg** - PostgreSQL adapter for Prisma

### Payments

- **Stripe** - Payment processing platform
- **stripe SDK** - Official Stripe JavaScript/TypeScript SDK

### Form Handling & Validation

- **React Hook Form 7.71.0** - Performant form management library
- **Zod 4.3.5** - Schema validation and type inference
- **@hookform/resolvers** - Zod resolver for React Hook Form

### Internationalization

- **next-intl 4.7.0** - Internationalization framework for Next.js
- **Translation files** - JSON-based locale files (English, Spanish)

### Notifications

- **Sonner 2.0.7** - Toast notifications for user feedback

### AI Integration

- **OpenAI 6.16.0** - AI-powered diet recommendations and meal planning

### Email

- **Resend 6.7.0** - Email delivery service for notifications and diet plan delivery

### Additional Dependencies

- **Lucide React** - Icon library
- **clsx** - Utility for constructing className strings
- **tailwind-merge** - Merge Tailwind CSS classes
- **dotenv** - Environment variable management
- **pg** - PostgreSQL client

## Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS transformation
- **@types/*** - TypeScript type definitions

## Project Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration |
| `tsconfig.json` | TypeScript configuration |
| `eslint.config.mjs` | ESLint configuration |
| `postcss.config.mjs` | PostCSS configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `prisma.config.ts` | Prisma configuration |
