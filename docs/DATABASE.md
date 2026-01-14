# Database Documentation

The AI Dietitian project uses PostgreSQL as the database and Prisma as the ORM for type-safe database operations.

## Database Schema

The database schema is defined in [`prisma/schema.prisma`](../prisma/schema.prisma) and contains the User model with JSON fields for structured diet data.

### User Model

```prisma
model User {
  id               String     @id @default(cuid())
  email            String     @unique
  name             String?    // Encrypted with AES-256-GCM
  kitchenHabits    Json?
  dietaryPrefs     Json?
  activityProfile  Json?
  lifestyleProfile Json?
  status           UserStatus @default(STARTED)
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt
}
```

### UserStatus Enum

```prisma
enum UserStatus {
  STARTED
  PAID
  COMPLETED
}
```

## Field Descriptions

### Primary Fields

| Field | Type | Unique | Optional | Description |
|-------|------|--------|----------|-------------|
| `id` | String | Yes | No | Unique identifier (Prisma cuid) |
| `email` | String | Yes | No | User's email address (unique) |
| `name` | String | No | Yes | User's full name (AES-256-GCM encrypted) |
| `createdAt` | DateTime | No | No | Record creation timestamp |
| `updatedAt` | DateTime | No | No | Last update timestamp |

### JSON Data Fields

| Field | Type | Optional | Description |
|-------|------|----------|-------------|
| `kitchenHabits` | Json | Yes | Cooking information (chef, cookingSkill) |
| `dietaryPrefs` | Json | Yes | Dietary restrictions (blacklisted, dietType, allergies) |
| `activityProfile` | Json | Yes | Activity level data |
| `lifestyleProfile` | Json | Yes | Lifestyle preferences |

### Status Field

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | UserStatus | STARTED | Current user progress status |

## UserStatus Values

| Status | Description |
|--------|-------------|
| `STARTED` | User has begun the onboarding process |
| `PAID` | User has completed payment |
| `COMPLETED` | User has received their diet plan |

## Relationships

### Current Structure

The User model is currently **standalone** with no foreign key relationships. This design allows for:

- Simple upsert operations based on email
- Flexible future relationship additions
- Quick onboarding without complex joins

### Planned Relationships

Future database expansion may include:

| Related Model | Relationship | Description |
|---------------|--------------|-------------|
| `Payment` | One-to-Many | Track multiple payments per user |
| `DietPlan` | One-to-One | Store generated diet plans |
| `Order` | One-to-Many | Track order history |

## Database Operations

### Prisma Client

The Prisma client is initialized as a singleton in [`lib/prisma.ts`](../src/lib/prisma.ts):

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Key Operations

#### Create or Update (Upsert)

```typescript
const user = await prisma.user.upsert({
  where: { email: email },
  create: {
    email,
    name: encryptedName,  // AES-256-GCM encrypted
    status: 'STARTED',
    kitchenHabits: { chef: 'me', cookingSkill: 3 },
    dietaryPrefs: { blacklisted: ['fish'], dietType: 'balanced' },
    activityProfile: { level: 'moderate', frequency: '3-4' },
    lifestyleProfile: { socialLife: 'social', sweetSavory: 'savory' },
  },
  update: {
    name: encryptedName,
    status: 'STARTED',
    kitchenHabits: data.kitchenHabits,
    dietaryPrefs: data.dietaryPrefs,
    activityProfile: data.activityProfile,
    lifestyleProfile: data.lifestyleProfile,
  },
});
```

#### Find by ID

```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
});
```

#### Find by Email

```typescript
const user = await prisma.user.findUnique({
  where: { email: email },
});
```

## Database Configuration

### Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  // ... fields as defined above
}
```

### Environment Variables

Required environment variables for database connection:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (格式: postgresql://user:password@host:port/database) |

### Connection Pool

The Prisma client manages connection pooling automatically. Key settings:

- **Connection Pool**: Managed by Prisma
- **Development**: Single connection in development
- **Production**: Connection pooling enabled

## Migrations

The current schema reflects the `professional_diet_schema` migration (20260113082200).

| Migration | Description |
|-----------|-------------|
| `20260113082200_professional_diet_schema` | Adds JSON fields for structured diet data and UserStatus enum |

Database migrations are handled by Prisma Migrate:

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Database Data Flow                         │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │   Wizard Form       │
                    │   (React Hook Form) │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Server Action     │
                    │   saveProgress()    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Zod Validation    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Prisma Upsert     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   PostgreSQL DB     │
                    │   (User Table)      │
                    └─────────────────────┘
```

## Best Practices

1. **Use Upsert for Onboarding**: Always use upsert to handle both new and returning users
2. **Validate Before Database**: Always validate input with Zod before database operations
3. **Handle Unique Constraints**: Email is unique, use appropriate error handling
4. **Use Prisma Types**: Leverage generated types for TypeScript safety
5. **Connection Management**: Prisma client is a singleton, don't create multiple instances
