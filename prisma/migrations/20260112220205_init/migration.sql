-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('STARTED', 'PAID', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "age" TEXT,
    "weight" TEXT,
    "height" TEXT,
    "gender" TEXT,
    "goals" TEXT,
    "allergies" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'STARTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
