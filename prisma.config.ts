import "dotenv/config";
import { defineConfig } from "prisma/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// For PostgreSQL with Supabase, use a separate shadow database URL if available
// Otherwise, let Prisma handle it automatically
const shadowDatabaseUrl = process.env.DIRECT_URL && process.env.DIRECT_URL !== process.env.DATABASE_URL
  ? process.env.DIRECT_URL
  : undefined;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
    shadowDatabaseUrl,
  },
});
