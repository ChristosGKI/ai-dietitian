-- Drop old columns that are being replaced by JSON fields
ALTER TABLE "User" DROP COLUMN IF EXISTS "age";
ALTER TABLE "User" DROP COLUMN IF EXISTS "weight";
ALTER TABLE "User" DROP COLUMN IF EXISTS "height";
ALTER TABLE "User" DROP COLUMN IF EXISTS "gender";
ALTER TABLE "User" DROP COLUMN IF EXISTS "goals";
ALTER TABLE "User" DROP COLUMN IF EXISTS "allergies";

-- Add new JSON columns for rich user data
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "kitchenHabits" JSONB;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "dietaryPrefs" JSONB;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "activityProfile" JSONB;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lifestyleProfile" JSONB;
