'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, Leaf } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CardSelector,
  ImageGrid,
  ModernSlider,
  SearchList,
  TextInput,
  VisualRating,
} from '@/components/wizard/inputs';
import { wizardData } from '@/config/wizard-data';
import { useWizard } from '@/hooks/use-wizard';
import type { RatingConfig, SearchListConfig, SliderConfig, WizardPhase } from '@/types/wizard';

// Helper to check if a value is valid (not null, undefined, empty string, or empty array)
function isValidAnswer(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

// Helper to translate phase title with fallback
function getPhaseTitle(t: ReturnType<typeof useTranslations>, phase: WizardPhase): string {
  return t(`phases.${phase.id}.title`, { defaultMessage: phase.title });
}

// Helper to translate phase description with fallback
function getPhaseDescription(t: ReturnType<typeof useTranslations>, phase: WizardPhase): string | undefined {
  if (!phase.description) return undefined;
  return t(`phases.${phase.id}.description`, { defaultMessage: phase.description });
}

export function WizardEngine() {
  const t = useTranslations('wizard');
  
  const {
    currentStep,
    currentPhase,
    currentPhaseIndex,
    currentStepIndex,
    progress,
    answers,
    isSubmitting,
    handleOptionSelect,
    handleNext,
    handleBack,
  } = useWizard();

  // Scroll to top when step or phase changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepIndex, currentPhaseIndex]);

  // Determine if current step is answered
  const currentAnswer = answers[currentStep.id];
  const isCurrentStepAnswered = isValidAnswer(currentAnswer);

  // Check if on first step
  const isFirstStep = currentPhaseIndex === 0 && currentStepIndex === 0;

  // Check if on last step
  const totalPhases = wizardData.phases.length;
  const isLastPhase = currentPhaseIndex === totalPhases - 1;
  const isLastStepInPhase = currentStepIndex === currentPhase.steps.length - 1;
  const isLastStep = isLastPhase && isLastStepInPhase;

  // Render the appropriate input component based on question type
  const renderInput = () => {
    switch (currentStep.questionType) {
      case 'card-selection':
        return (
          <CardSelector
            options={currentStep.options || []}
            value={(currentAnswer as string) || ''}
            onChange={(val: string | string[]) => handleOptionSelect(currentStep.id, val)}
          />
        );
      case 'image-grid':
        return (
          <ImageGrid
            options={currentStep.options || []}
            value={(currentAnswer as string[]) || []}
            onChange={(val: string[]) => handleOptionSelect(currentStep.id, val)}
          />
        );
      case 'slider': {
        const config = currentStep.config as SliderConfig | undefined;
        return (
          <ModernSlider
            min={config?.min ?? 0}
            max={config?.max ?? 100}
            step={config?.step}
            unit={config?.unit}
            value={(currentAnswer as number) || config?.min || 0}
            onChange={(val: number) => handleOptionSelect(currentStep.id, val)}
          />
        );
      }
      case 'search-list': {
        const config = currentStep.config as SearchListConfig | undefined;
        return (
          <SearchList
            options={currentStep.options || []}
            value={(currentAnswer as string[]) || []}
            placeholder={config?.searchPlaceholder ? t(config.searchPlaceholder) : undefined}
            onChange={(val: string[]) => handleOptionSelect(currentStep.id, val)}
          />
        );
      }
      case 'rating': {
        const config = currentStep.config as RatingConfig | undefined;
        // Create labels for rating component
        const labels: Record<number, string> = {
          1: 'wizard.rating.veryLow',
          2: 'wizard.rating.low',
          3: 'wizard.rating.medium',
          4: 'wizard.rating.high',
          5: 'wizard.rating.veryHigh',
        };
        return (
          <VisualRating
            max={config?.max ?? 5}
            value={(currentAnswer as number) || 0}
            onChange={(val: number) => handleOptionSelect(currentStep.id, val)}
            labels={labels}
            icon={config?.icon === 'Flame' ? 'chefHat' : 'star'}
          />
        );
      }
      case 'text-input':
        return (
          <TextInput
            value={(currentAnswer as string) || ''}
            onChange={(val: string) => handleOptionSelect(currentStep.id, val)}
            placeholder={currentStep.question}
            type="text"
            label={currentStep.question}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="font-semibold text-foreground">
              {t('name.aiDietitian')}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {t('phases.stepCounter', { current: currentStepIndex + 1, total: currentPhase.steps.length })}
          </span>
        </div>
        
        {/* Progress Bar */}
        <Progress value={progress} className="h-2" />
      </header>

      {/* Body */}
      <motion.div
        key={`${currentPhaseIndex}-${currentStepIndex}`}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Phase Title */}
        <div className="mb-2">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-foreground"
          >
            {getPhaseTitle(t, currentPhase)}
          </motion.h2>
          {currentPhase.description && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-muted-foreground mt-1"
            >
              {getPhaseDescription(t, currentPhase)}
            </motion.p>
          )}
        </div>

        {/* Question */}
        <div className="mb-8">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-medium text-foreground"
          >
            {t(currentStep.question)}
          </motion.h3>
        </div>

        {/* Input Area */}
        <div className="mb-8">
          {renderInput()}
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={isFirstStep || isSubmitting}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('buttons.back')}
        </Button>

        <Button
          variant="default"
          onClick={handleNext}
          disabled={!isCurrentStepAnswered || isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <span className="animate-pulse">{t('buttons.submitting')}</span>
          ) : isLastStep ? (
            <>
              {t('buttons.submit')}
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              {t('buttons.next')}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </footer>
    </div>
  );
}
