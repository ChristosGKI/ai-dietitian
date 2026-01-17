/**
 * Foodbrain Wizard Configuration
 * Config-Driven Multi-Step Wizard for Foodbrain
 *
 * All text fields use i18n keys - actual text is resolved at runtime.
 */

import type { WizardConfig, WizardOption, WizardPhase, WizardStep } from '@/types/wizard';

// ============================================================================
// Common Options
// ============================================================================

const genderOptions: WizardOption[] = [
  {
    id: 'male',
    label: 'wizard.options.male',
    value: 'male',
    icon: 'User',
  },
  {
    id: 'female',
    label: 'wizard.options.female',
    value: 'female',
    icon: 'User',
  },
];

const whoCooksOptions: WizardOption[] = [
  {
    id: 'me',
    label: 'wizard.options.me',
    value: 'me',
    icon: 'Apron',
  },
  {
    id: 'partner-family',
    label: 'wizard.options.partnerFamily',
    value: 'partner_family',
    icon: 'Users',
  },
  {
    id: 'ordering-takeout',
    label: 'wizard.options.orderingTakeout',
    value: 'ordering_takeout',
    icon: 'Bike',
  },
];

const hatedFoodOptions: WizardOption[] = [
  {
    id: 'fish',
    label: 'wizard.options.fish',
    value: 'fish',
    icon: 'Fish',
    imageSrc: '/images/wizard/fish.png',
  },
  {
    id: 'broccoli',
    label: 'wizard.options.broccoli',
    value: 'broccoli',
    icon: 'Broccoli',
    imageSrc: '/images/wizard/broccoli.png',
  },
  {
    id: 'mushrooms',
    label: 'wizard.options.mushrooms',
    value: 'mushrooms',
    icon: 'Mushroom',
    imageSrc: '/images/wizard/mushrooms.png',
  },
  {
    id: 'avocado',
    label: 'wizard.options.avocado',
    value: 'avocado',
    icon: 'Avocado',
    imageSrc: '/images/wizard/avocado.png',
  },
  {
    id: 'dairy',
    label: 'wizard.options.dairy',
    value: 'dairy',
    icon: 'Milk',
    imageSrc: '/images/wizard/dairy.png',
  },
  {
    id: 'cilantro',
    label: 'wizard.options.cilantro',
    value: 'cilantro',
    icon: 'Leaf',
    imageSrc: '/images/wizard/cilantro.png',
  },
];

const activityLevelOptions: WizardOption[] = [
  {
    id: 'sedentary',
    label: 'wizard.options.sedentary',
    value: 'sedentary',
    icon: 'Armchair',
  },
  {
    id: 'light',
    label: 'wizard.options.light',
    value: 'light',
    icon: 'Walking',
  },
  {
    id: 'moderate',
    label: 'wizard.options.moderate',
    value: 'moderate',
    icon: 'Running',
  },
  {
    id: 'active',
    label: 'wizard.options.active',
    value: 'active',
    icon: 'Muscle',
  },
];

const socialLifeOptions: WizardOption[] = [
  {
    id: 'monk-mode',
    label: 'wizard.options.monkMode',
    value: 'monk_mode',
    icon: 'Laptop',
  },
  {
    id: 'social-butterfly',
    label: 'wizard.options.socialButterfly',
    value: 'social_butterfly',
    icon: 'Sparkles',
  },
  {
    id: 'party-animal',
    label: 'wizard.options.partyAnimal',
    value: 'party_animal',
    icon: 'PartyPopper',
  },
];

const sweetSavoryOptions: WizardOption[] = [
  {
    id: 'sweet-tooth',
    label: 'wizard.options.sweetTooth',
    value: 'sweet_tooth',
    icon: 'Candy',
  },
  {
    id: 'savory-cravings',
    label: 'wizard.options.savoryCravings',
    value: 'savory_cravings',
    icon: 'Pizza',
  },
];

// ============================================================================
// Step Definitions
// ============================================================================

// -------------------------------------------------------------------------
// Lead Capture Phase Steps
// -------------------------------------------------------------------------

const nameStep: WizardStep = {
  id: 'name',
  question: 'steps.name.question',
  questionType: 'text-input',
  config: {
    placeholder: 'steps.name.placeholder',
    type: 'text',
  },
};

const emailStep: WizardStep = {
  id: 'email',
  question: 'steps.email.question',
  questionType: 'text-input',
  config: {
    placeholder: 'steps.email.placeholder',
    type: 'email',
  },
};

// -------------------------------------------------------------------------
// Main Wizard Steps
// -------------------------------------------------------------------------

const genderStep: WizardStep = {
  id: 'gender',
  question: 'steps.gender.question',
  questionType: 'card-selection',
  options: genderOptions,
};

const ageStep: WizardStep = {
  id: 'age',
  question: 'steps.age.question',
  questionType: 'slider',
  config: {
    min: 18,
    max: 100,
    step: 1,
  },
};

const weightStep: WizardStep = {
  id: 'weight',
  question: 'steps.weight.question',
  questionType: 'slider',
  config: {
    min: 40,
    max: 200,
    step: 0.5,
    unit: 'kg',
  },
};

const heightStep: WizardStep = {
  id: 'height',
  question: 'steps.height.question',
  questionType: 'slider',
  config: {
    min: 140,
    max: 220,
    step: 1,
    unit: 'cm',
  },
};

const whoCooksStep: WizardStep = {
  id: 'who-cooks',
  question: 'steps.whoCooks.question',
  questionType: 'card-selection',
  options: whoCooksOptions,
};

const cookingSkillStep: WizardStep = {
  id: 'cooking-skill',
  question: 'steps.cookingSkill.question',
  questionType: 'rating',
  config: {
    max: 5,
    icon: 'Flame',
  },
};

const hatedFoodsStep: WizardStep = {
  id: 'hated-foods',
  question: 'steps.hatedFoods.question',
  questionType: 'image-grid',
  options: hatedFoodOptions,
};

const specificExclusionsStep: WizardStep = {
  id: 'specific-exclusions',
  question: 'steps.specificExclusions.question',
  questionType: 'search-list',
  config: {
    searchPlaceholder: 'steps.specificExclusions.placeholder',
    multiSelect: true,
  },
};

const activityLevelStep: WizardStep = {
  id: 'activity-level',
  question: 'steps.activityLevel.question',
  questionType: 'card-selection',
  options: activityLevelOptions,
};

const socialLifeStep: WizardStep = {
  id: 'social-life',
  question: 'steps.socialLife.question',
  questionType: 'card-selection',
  options: socialLifeOptions,
};

const sweetSavoryStep: WizardStep = {
  id: 'sweet-savory',
  question: 'steps.sweetSavory.question',
  questionType: 'card-selection',
  options: sweetSavoryOptions,
};

// ============================================================================
// Phase Definitions
// ============================================================================

// -------------------------------------------------------------------------
// Lead Capture Phase (Phase 0)
// -------------------------------------------------------------------------

const leadCapturePhase: WizardPhase = {
  id: 'lead-capture',
  title: 'phases.leadCapture.title',
  description: 'phases.leadCapture.description',
  steps: [nameStep, emailStep],
};

// -------------------------------------------------------------------------
// Main Phases
// -------------------------------------------------------------------------

const basicsPhase: WizardPhase = {
  id: 'basics',
  title: 'phases.basics.title',
  description: 'phases.basics.description',
  steps: [genderStep, ageStep, weightStep, heightStep],
};

const kitchenPhase: WizardPhase = {
  id: 'kitchen',
  title: 'phases.kitchen.title',
  description: 'phases.kitchen.description',
  steps: [whoCooksStep, cookingSkillStep],
};

const blacklistPhase: WizardPhase = {
  id: 'blacklist',
  title: 'phases.blacklist.title',
  description: 'phases.blacklist.description',
  steps: [hatedFoodsStep, specificExclusionsStep],
};

const activityPhase: WizardPhase = {
  id: 'activity',
  title: 'phases.activity.title',
  description: 'phases.activity.description',
  steps: [activityLevelStep],
};

const lifestylePhase: WizardPhase = {
  id: 'lifestyle',
  title: 'phases.lifestyle.title',
  description: 'phases.lifestyle.description',
  steps: [socialLifeStep, sweetSavoryStep],
};

// ============================================================================
// Main Configuration Export
// ============================================================================

export const wizardData: WizardConfig = {
  id: 'foodbrain',
  name: 'wizard.name.aiDietitian',
  phases: [leadCapturePhase, basicsPhase, kitchenPhase, blacklistPhase, activityPhase, lifestylePhase],
};

// ============================================================================
// Configuration Utilities
// ============================================================================

/**
 * Flatten all steps from a wizard config into a single array
 */
export function getAllSteps(config: WizardConfig): WizardStep[] {
  return config.phases.flatMap((phase) => phase.steps);
}

/**
 * Find a specific step by ID across all phases
 */
export function findStepById(config: WizardConfig, stepId: string): WizardStep | undefined {
  return getAllSteps(config).find((step) => step.id === stepId);
}

/**
 * Get the total number of steps in a wizard
 */
export function getTotalSteps(config: WizardConfig): number {
  return getAllSteps(config).length;
}

/**
 * Get step index within the entire wizard
 */
export function getStepIndex(config: WizardConfig, stepId: string): number {
  const steps = getAllSteps(config);
  return steps.findIndex((step) => step.id === stepId);
}
