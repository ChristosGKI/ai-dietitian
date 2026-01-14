/**
 * Wizard Configuration Skeleton
 * Config-Driven Multi-Step Wizard for AI Dietitian
 * 
 * This file demonstrates the configuration structure for the wizard.
 * All text fields use i18n keys - actual text is resolved at runtime.
 */

import type { WizardConfig, WizardOption, WizardPhase, WizardStep } from '@/types/wizard';

// ============================================================================
// Sample Configuration: Onboarding Wizard
// ============================================================================

const sampleOptions: WizardOption[] = [
  {
    id: 'weight-loss',
    label: 'wizard.options.weightLoss',
    value: 'weight_loss',
    icon: 'TrendingDown',
  },
  {
    id: 'muscle-gain',
    label: 'wizard.options.muscleGain',
    value: 'muscle_gain',
    icon: 'TrendingUp',
  },
  {
    id: 'maintenance',
    label: 'wizard.options.maintenance',
    value: 'maintenance',
    icon: 'Minus',
  },
  {
    id: 'health-improvement',
    label: 'wizard.options.healthImprovement',
    value: 'health_improvement',
    icon: 'Heart',
  },
];

const activityLevelOptions: WizardOption[] = [
  { id: 'sedentary', label: 'wizard.options.sedentary', value: 1.2, icon: 'Armchair' },
  { id: 'light', label: 'wizard.options.light', value: 1.375, icon: 'Walking' },
  { id: 'moderate', label: 'wizard.options.moderate', value: 1.55, icon: 'Activity' },
  { id: 'active', label: 'wizard.options.active', value: 1.725, icon: 'Zap' },
  { id: 'very-active', label: 'wizard.options.veryActive', value: 1.9, icon: 'Flame' },
];

const dietTypeOptions: WizardOption[] = [
  { id: 'omnivore', label: 'wizard.options.omnivore', value: 'omnivore' },
  { id: 'vegetarian', label: 'wizard.options.vegetarian', value: 'vegetarian' },
  { id: 'vegan', label: 'wizard.options.vegan', value: 'vegan' },
  { id: 'keto', label: 'wizard.options.keto', value: 'keto' },
  { id: 'paleo', label: 'wizard.options.paleo', value: 'paleo' },
];

// ============================================================================
// Step Definitions
// ============================================================================

const goalStep: WizardStep = {
  id: 'goal-selection',
  question: 'steps.goal.question',
  questionType: 'card-selection',
  options: sampleOptions,
};

const activityStep: WizardStep = {
  id: 'activity-level',
  question: 'steps.activity.question',
  questionType: 'card-selection',
  options: activityLevelOptions,
};

const ageStep: WizardStep = {
  id: 'age-input',
  question: 'steps.age.question',
  questionType: 'slider',
  config: {
    min: 18,
    max: 100,
    step: 1,
    unit: 'years',
  },
};

const weightStep: WizardStep = {
  id: 'weight-input',
  question: 'steps.weight.question',
  questionType: 'slider',
  config: {
    min: 30,
    max: 200,
    step: 0.5,
    unit: 'kg',
  },
};

const heightStep: WizardStep = {
  id: 'height-input',
  question: 'steps.height.question',
  questionType: 'slider',
  config: {
    min: 100,
    max: 250,
    step: 1,
    unit: 'cm',
  },
};

const dietTypeStep: WizardStep = {
  id: 'diet-type',
  question: 'steps.dietType.question',
  questionType: 'image-grid',
  options: dietTypeOptions,
};

const allergiesStep: WizardStep = {
  id: 'allergies-search',
  question: 'steps.allergies.question',
  questionType: 'search-list',
  config: {
    searchPlaceholder: 'steps.allergies.placeholder',
    multiSelect: true,
    maxSelections: 10,
  },
};

const satisfactionStep: WizardStep = {
  id: 'satisfaction-rating',
  question: 'steps.satisfaction.question',
  questionType: 'rating',
  config: {
    max: 5,
    icon: 'Star',
  },
};

// ============================================================================
// Phase Definitions
// ============================================================================

const goalsPhase: WizardPhase = {
  id: 'goals',
  title: 'phases.goals.title',
  description: 'phases.goals.description',
  steps: [goalStep],
};

const bodyMetricsPhase: WizardPhase = {
  id: 'body-metrics',
  title: 'phases.bodyMetrics.title',
  description: 'phases.bodyMetrics.description',
  steps: [ageStep, weightStep, heightStep, activityStep],
};

const nutritionPhase: WizardPhase = {
  id: 'nutrition',
  title: 'phases.nutrition.title',
  description: 'phases.nutrition.description',
  steps: [dietTypeStep, allergiesStep],
};

const feedbackPhase: WizardPhase = {
  id: 'feedback',
  title: 'phases.feedback.title',
  steps: [satisfactionStep],
};

// ============================================================================
// Main Configuration Export
// ============================================================================

export const wizardConfig: WizardConfig = {
  id: 'onboarding',
  name: 'wizard.name.onboarding',
  phases: [goalsPhase, bodyMetricsPhase, nutritionPhase, feedbackPhase],
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
