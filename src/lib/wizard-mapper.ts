import type { WizardState } from '@/types/wizard';

/**
 * Maps wizard answers to the User model structure.
 * Transforms raw wizard state into structured user data for the database.
 * 
 * @param answers - The wizard state containing user answers keyed by step ID
 * @returns Structured user data ready for database persistence
 */
export function mapWizardToUser(answers: WizardState) {
  // Extract basic info (plaintext for email, will be encrypted for name)
  const name = answers.name as string;
  const email = answers.email as string;

  // Map kitchen habits
  const kitchenHabits = {
    chef: answers['who-cooks'] as string,
    cookingSkill: answers['cooking-skill'] as number,
  };

  // Map dietary preferences (combine hated foods and specific exclusions)
  const blacklisted = [
    ...(Array.isArray(answers['hated-foods']) 
      ? (answers['hated-foods'] as string[]) 
      : [answers['hated-foods']].filter(Boolean)),
    ...(Array.isArray(answers['specific-exclusions']) 
      ? (answers['specific-exclusions'] as string[]) 
      : []),
  ];

  const dietaryPrefs = {
    blacklisted,
    dietType: answers['diet-type'] as string,
    allergies: Array.isArray(answers['allergies-search'])
      ? (answers['allergies-search'] as string[])
      : [],
  };

  // Map activity profile
  const activityProfile = {
    level: answers['activity-level'] as string,
    frequency: answers['activity-frequency'] as string,
  };

  // Map lifestyle profile
  const lifestyleProfile = {
    socialLife: answers['social-life'] as string,
    sweetSavory: answers['sweet-savory'] as string,
  };

  // Map body metrics
  const bodyMetrics = {
    gender: answers.gender as string,
    age: answers.age as number,
    weight: answers.weight as number,
    height: answers.height as number,
  };

  return {
    name,
    email,
    kitchenHabits,
    dietaryPrefs,
    activityProfile,
    lifestyleProfile,
    bodyMetrics,
  };
}

/**
 * Type representing the structured output of mapWizardToUser
 */
export type MappedUserData = ReturnType<typeof mapWizardToUser>;
