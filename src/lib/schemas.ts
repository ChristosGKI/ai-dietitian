import { z } from 'zod';

// Gender enum for validation
export const genderEnum = z.enum(['male', 'female', 'other', 'prefer_not_to_say']);

// Step 1: Lead Capture (strictly required)
export const step1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

// Step 2: Bio Data (optional during entry)
export const step2Schema = z.object({
  age: z.number().min(13, 'You must be at least 13 years old').max(120, 'Invalid age').optional(),
  weight: z.number().min(30, 'Weight must be at least 30kg').max(300, 'Weight seems invalid').optional(),
  height: z.number().min(100, 'Height must be at least 100cm').max(250, 'Height seems invalid').optional(),
  gender: genderEnum.optional(),
});

// Step 3: Details (goals required, allergies optional)
export const step3Schema = z.object({
  goals: z.string().min(10, 'Please describe your goals in at least 10 characters').optional(),
  allergies: z.string().optional(),
});

// Combined onboarding schema - all fields optional for partial updates
export const onboardingSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(z.object({
  kitchenHabits: z.unknown().optional(),
  dietaryPrefs: z.unknown().optional(),
  activityProfile: z.unknown().optional(),
  lifestyleProfile: z.unknown().optional(),
})).partial();

export type OnboardingData = z.infer<typeof onboardingSchema>;
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;

// User update schema for partial updates
export const userUpdateSchema = onboardingSchema;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;
