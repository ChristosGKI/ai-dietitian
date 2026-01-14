'use server';

import { encrypt } from '@/lib/crypto';
import { prisma } from '@/lib/prisma';
import { mapWizardToUser } from '@/lib/wizard-mapper';
import type { WizardState } from '@/types/wizard';

/**
 * Result type for the submit wizard action
 */
export interface SubmitWizardResult {
  success: boolean;
  userId?: string;
  redirectUrl?: string;
  error?: string;
}

/**
 * Submits wizard answers to the database.
 * - Validates required fields (name, email)
 * - Encrypts PII (name)
 * - Upserts user record
 * - Returns redirect to Stripe payment page
 * 
 * @param answers - The wizard state containing all user answers
 * @returns Result object with success status and redirect URL or error message
 */
export async function submitWizardAction(answers: WizardState): Promise<SubmitWizardResult> {
  try {
    // Validate required fields
    const name = answers.name as string;
    const email = answers.email as string;

    if (!name || !email) {
      return {
        success: false,
        error: 'Name and email are required to submit the wizard',
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Please provide a valid email address',
      };
    }

    // Map wizard answers to user data structure
    const userData = mapWizardToUser(answers);

    // Encrypt the name (PII protection)
    const encryptedName = encrypt(name);

    // Upsert user record
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: encryptedName,
        status: 'STARTED',
        kitchenHabits: userData.kitchenHabits,
        dietaryPrefs: userData.dietaryPrefs,
        activityProfile: userData.activityProfile,
        lifestyleProfile: userData.lifestyleProfile,
      },
      update: {
        name: encryptedName,
        status: 'STARTED',
        kitchenHabits: userData.kitchenHabits,
        dietaryPrefs: userData.dietaryPrefs,
        activityProfile: userData.activityProfile,
        lifestyleProfile: userData.lifestyleProfile,
      },
    });

    // Return success with redirect to payment checkout
    return {
      success: true,
      userId: user.id,
      redirectUrl: '/payment/checkout',
    };
  } catch (error) {
    console.error('Error submitting wizard:', error);
    return {
      success: false,
      error: 'Failed to submit wizard. Please try again.',
    };
  }
}
