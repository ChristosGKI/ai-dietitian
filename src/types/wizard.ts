/**
 * Wizard Type Definitions
 * Config-Driven Multi-Step Wizard for Foodbrain
 * Philosophy: "Define once, render everywhere"
 */

/**
 * Represents a single option for selection-type questions
 */
export interface WizardOption {
  /** Unique identifier for this option */
  id: string;
  /** i18n key for the option label */
  label: string;
  /** The value to store when this option is selected */
  value: string | number;
  /** Optional Lucide icon name */
  icon?: string;
  /** Optional image URL for image-based selections */
  imageSrc?: string;
}

/**
 * Supported question types for wizard steps
 */
export type WizardQuestionType =
  | 'card-selection'
  | 'image-grid'
  | 'slider'
  | 'search-list'
  | 'rating'
  | 'text-input';

/**
 * Configuration options for different question types
 */
export interface SliderConfig {
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export interface RatingConfig {
  max: number;
  icon?: string;
}

export interface SearchListConfig {
  searchPlaceholder?: string;
  multiSelect?: boolean;
  maxSelections?: number;
}

export type StepConfig = SliderConfig | RatingConfig | SearchListConfig | Record<string, unknown>;

/**
 * Represents a single screen/question in the wizard
 */
export interface WizardStep {
  /** Unique identifier for this step */
  id: string;
  /** i18n key for the question text */
  question: string;
  /** The type of input/interaction for this step */
  questionType: WizardQuestionType;
  /** Available options for selection-type questions */
  options?: WizardOption[];
  /** Type-specific configuration (slider min/max, rating max, etc.) */
  config?: StepConfig;
}

/**
 * Groups related steps into a logical phase
 */
export interface WizardPhase {
  /** Unique identifier for this phase */
  id: string;
  /** i18n key for the phase title */
  title: string;
  /** i18n key for the phase description */
  description?: string;
  /** Steps belonging to this phase */
  steps: WizardStep[];
}

/**
 * Top-level wizard configuration
 */
export interface WizardConfig {
  /** Unique identifier for this wizard configuration */
  id: string;
  /** i18n key for the wizard name */
  name: string;
  /** Ordered list of phases in the wizard */
  phases: WizardPhase[];
}

/**
 * Represents the user's answers during wizard completion
 */
export interface WizardState {
  [stepId: string]: string | number | string[];
}

/**
 * Helper type for extracting step IDs from a wizard config
 */
export type ExtractStepIds<T extends WizardConfig> = T['phases'][number]['steps'][number]['id'];
