/**
 * use-wizard Hook
 * Config-Driven Multi-Step Wizard for AI Dietitian
 * Handles wizard state management, navigation, and persistence
 */

'use client';

import { getAllSteps, wizardData } from '@/config/wizard-data';
import { WizardPhase, WizardState, WizardStep } from '@/types/wizard';
import { useCallback, useEffect, useMemo, useState } from 'react';

const LOCALSTORAGE_KEY = 'wizard-answers';

/**
 * Check if a value is considered valid (not null, undefined, empty string, or empty array)
 */
function isValidAnswer(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

/**
 * Initialize answers from LocalStorage
 */
function initializeAnswers(): WizardState {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(LOCALSTORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.warn('Failed to load wizard answers from LocalStorage');
  }
  return {};
}

/**
 * Main wizard hook for managing wizard state and navigation
 */
export function useWizard() {
  // Track position within current phase
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Wizard answers state
  const [answers, setAnswers] = useState<WizardState>(() => initializeAnswers());
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist answers to LocalStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(answers));
    } catch {
      console.warn('Failed to persist wizard answers to LocalStorage');
    }
  }, [answers]);

  // Compute current phase
  const currentPhase: WizardPhase = useMemo(() => 
    wizardData.phases[currentPhaseIndex],
    [currentPhaseIndex]
  );

  // Compute current step
  const currentStep: WizardStep = useMemo(() => 
    currentPhase.steps[currentStepIndex],
    [currentPhase, currentStepIndex]
  );

  // Compute total steps across all phases
  const totalSteps: number = useMemo(() => 
    getAllSteps(wizardData).length,
    []
  );

  // Compute overall progress percentage (0-100)
  const progress: number = useMemo(() => {
    let globalStepIndex = 0;
    for (let i = 0; i < currentPhaseIndex; i++) {
      globalStepIndex += wizardData.phases[i].steps.length;
    }
    globalStepIndex += currentStepIndex;
    return (globalStepIndex / totalSteps) * 100;
  }, [currentPhaseIndex, currentStepIndex, totalSteps]);

  /**
   * Select an option for the current step
   */
  const handleOptionSelect = useCallback((stepId: string, value: string | number | string[]) => {
    setAnswers((prev: WizardState) => ({
      ...prev,
      [stepId]: value,
    }));
  }, []);

  /**
   * Navigate to the next step
   */
  const handleNext = useCallback(() => {
    // Check if current step has a valid answer
    const currentAnswer = answers[currentStep.id];
    if (!isValidAnswer(currentAnswer)) {
      console.warn('Current step does not have a valid answer');
      return;
    }

    // Check if we're at the last step
    const isLastStepInPhase = currentStepIndex >= currentPhase.steps.length - 1;
    const isLastPhase = currentPhaseIndex >= wizardData.phases.length - 1;

    if (isLastStepInPhase && isLastPhase) {
      // Last step of the entire wizard - submit
      submitWizard();
      return;
    }

    // Move to next step
    if (isLastStepInPhase) {
      // Move to first step of next phase
      setCurrentPhaseIndex((prev) => prev + 1);
      setCurrentStepIndex(0);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [answers, currentStep, currentStepIndex, currentPhase, currentPhaseIndex]);

  /**
   * Navigate to the previous step
   */
  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      // Stay in current phase, go to previous step
      setCurrentStepIndex((prev) => prev - 1);
    } else if (currentPhaseIndex > 0) {
      // Move to last step of previous phase
      const previousPhase = wizardData.phases[currentPhaseIndex - 1];
      setCurrentPhaseIndex((prev) => prev - 1);
      setCurrentStepIndex(previousPhase.steps.length - 1);
    }

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepIndex, currentPhaseIndex]);

  /**
   * Submit the wizard with all answers
   */
  const submitWizard = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      // Console log for now (mock submission)
      console.log('Wizard submitted with answers:', answers);
      
      // TODO: Submit to server
      // const result = await submitWizardToServer(answers);
      
      // Clear LocalStorage after successful submit
      localStorage.removeItem(LOCALSTORAGE_KEY);
      
    } catch (error) {
      console.error('Failed to submit wizard:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [answers]);

  /**
   * Reset wizard state
   */
  const resetWizard = useCallback(() => {
    setCurrentPhaseIndex(0);
    setCurrentStepIndex(0);
    setAnswers({});
    localStorage.removeItem(LOCALSTORAGE_KEY);
  }, []);

  return {
    // Current state
    currentStep,
    currentPhase,
    currentPhaseIndex,
    currentStepIndex,
    totalSteps,
    answers,
    isSubmitting,
    
    // Computed values
    progress,
    
    // Actions
    handleOptionSelect,
    handleNext,
    handleBack,
    submitWizard,
    resetWizard,
  };
}

export type UseWizardReturn = ReturnType<typeof useWizard>;
