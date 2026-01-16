-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailEncrypted" TEXT;

-- Migrate existing email data to encrypted format
-- Note: This requires the ENCRYPTION_KEY environment variable to be set
-- The encryption is done at the application level, not in SQL
-- For existing data, we'll need to run a script that:
-- 1. Reads each user's email
-- 2. Encrypts it using the encrypt() function
-- 3. Updates the emailEncrypted field

-- For immediate encryption of existing records, you can run this SQL:
-- UPDATE "User" SET "emailEncrypted" = encrypt(email)
-- WHERE "emailEncrypted" IS NULL;
