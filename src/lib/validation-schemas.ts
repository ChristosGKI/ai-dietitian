import { z } from 'zod';
import { genderEnum } from './schemas';

// Step 1: Lead Capture with goals
export const step1ValidationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  goals: z.string().min(10, 'Please describe your goals in at least 10 characters'),
});

// Step 2: Bio Data (optional during entry)
export const step2ValidationSchema = z.object({
  age: z.number().min(13, 'You must be at least 13 years old').max(120, 'Invalid age').optional(),
  weight: z.number().min(30, 'Weight must be at least 30kg').max(300, 'Weight seems invalid').optional(),
  height: z.number().min(100, 'Height must be at least 100cm').max(250, 'Height seems invalid').optional(),
  gender: genderEnum.optional(),
});

// Step 3: Details (allergies only)
export const step3ValidationSchema = z.object({
  allergies: z.string().optional(),
});
