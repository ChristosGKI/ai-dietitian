'use server';

import { decrypt, encrypt } from '@/lib/crypto';
import { prisma } from '@/lib/prisma';
import { userUpdateSchema, type UserUpdateData } from '@/lib/schemas';
import { step1ValidationSchema, step2ValidationSchema, step3ValidationSchema } from '@/lib/validation-schemas';
import type { ZodIssue } from 'zod';

export interface SaveProgressResult {
  success: boolean;
  userId?: string;
  error?: string;
}

export interface GetUserResult {
  success: boolean;
  user?: DecryptedUserData | null;
  error?: string;
}

export interface DecryptedUserData {
  id: string;
  email: string;
  name?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
  goals?: string;
  allergies?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type for user from Prisma (after schema update)
type PrismaUser = {
  id: string;
  email: string;
  name: string | null;
  age: string | null;
  weight: string | null;
  height: string | null;
  gender: string | null;
  goals: string | null;
  allergies: string | null;
  status: 'STARTED' | 'PAID' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Encrypts sensitive fields in user data before storage.
 * Converts numeric fields to strings before encryption.
 */
function encryptUserData(data: UserUpdateData): Record<string, string | undefined> {
  const encrypted: Record<string, string | undefined> = {};

  // Encrypt text fields
  if (data.name !== undefined) {
    encrypted.name = encrypt(data.name);
  }

  if (data.goals !== undefined) {
    encrypted.goals = encrypt(data.goals);
  }

  if (data.allergies !== undefined) {
    encrypted.allergies = encrypt(data.allergies);
  }

  // Convert and encrypt numeric fields
  if (data.age !== undefined) {
    encrypted.age = encrypt(String(data.age));
  }

  if (data.weight !== undefined) {
    encrypted.weight = encrypt(String(data.weight));
  }

  if (data.height !== undefined) {
    encrypted.height = encrypt(String(data.height));
  }

  // Non-sensitive fields (passed as-is)
  if (data.gender !== undefined) {
    encrypted.gender = data.gender;
  }

  return encrypted;
}

/**
 * Decrypts user data from database format to readable format.
 */
function decryptUserData(user: PrismaUser): DecryptedUserData {
  return {
    id: user.id,
    email: user.email,
    name: user.name ? decrypt(user.name) : undefined,
    age: user.age ? parseInt(decrypt(user.age), 10) : undefined,
    weight: user.weight ? parseFloat(decrypt(user.weight)) : undefined,
    height: user.height ? parseFloat(decrypt(user.height)) : undefined,
    gender: user.gender || undefined,
    goals: user.goals ? decrypt(user.goals) : undefined,
    allergies: user.allergies ? decrypt(user.allergies) : undefined,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function saveProgress(
  data: UserUpdateData,
  userId?: string,
  step?: number
): Promise<SaveProgressResult> {
  try {
    // For incremental steps (1-3), validate only that step's fields
    // For final submission (step 4+ or undefined), validate partial data
    let validationResult;
    
    if (step && step >= 1 && step <= 3) {
      // Validate only the current step's fields
      const stepSchema = [
        step1ValidationSchema,
        step2ValidationSchema,
        step3ValidationSchema,
      ][step - 1];
      validationResult = stepSchema.safeParse(data);
    } else {
      // Final submission - validate with partial schema
      validationResult = userUpdateSchema.safeParse(data);
    }
    
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map((e: ZodIssue) => e.message);
      return {
        success: false,
        error: errorMessages.join(', '),
      };
    }

    const validatedData = validationResult.data as UserUpdateData;

    // Build the where clause and data for upsert
    let whereClause: { id: string } | { email: string };
    
    if (userId) {
      whereClause = { id: userId };
    } else if (validatedData.email) {
      whereClause = { email: validatedData.email as string };
    } else {
      return {
        success: false,
        error: 'Either userId or email is required',
      };
    }

    // Encrypt sensitive fields
    const encryptedData = encryptUserData(validatedData);

    // Upsert the user with encrypted data
    const user = await prisma.user.upsert({
      where: whereClause,
      update: {
        ...encryptedData,
        // Ensure email is preserved on update if not provided in data
        email: validatedData.email || undefined,
      },
      create: {
        email: validatedData.email || '',
        name: encryptedData.name,
        age: encryptedData.age,
        weight: encryptedData.weight,
        height: encryptedData.height,
        gender: encryptedData.gender,
        goals: encryptedData.goals,
        allergies: encryptedData.allergies,
      },
    });

    return {
      success: true,
      userId: user.id,
    };
  } catch (error) {
    console.error('Error saving progress:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save progress',
    };
  }
}

export async function getUser(userId: string): Promise<GetUserResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      user: decryptUserData(user),
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user',
    };
  }
}

export async function getUserByEmail(email: string): Promise<GetUserResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      user: decryptUserData(user),
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user',
    };
  }
}
