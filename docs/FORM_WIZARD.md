# Form Wizard Documentation

The Foodbrain onboarding system uses a config-driven multi-step wizard architecture. Questions, phases, and options are defined in configuration files, not hardcoded in JSX, enabling the "Define once, render everywhere" philosophy with full i18n support.

---

## Wizard Architecture

### Six-Phase Structure

The wizard is organized into six distinct phases, each collecting specific types of user information for personalized diet recommendations.

| Phase ID | Title | Steps | Purpose |
|----------|-------|-------|---------|
| `lead-capture` | Welcome | 2 | Name and email capture |
| `basics` | The Basics | 4 | Gender, age, weight, height |
| `kitchen` | Kitchen Reality | 2 | Who cooks, cooking skill level |
| `blacklist` | The Blacklist | 2 | Hated foods, specific exclusions |
| `activity` | Movement | 1 | Activity level |
| `lifestyle` | Vices & Lifestyle | 2 | Social life, sweet vs savory preference |

**Total Steps: 13**

### Configuration Hierarchy

```
wizardData (WizardConfig)
├── id: 'foodbrain'
├── name: 'wizard.name.aiDietitian'
└── phases: WizardPhase[]
    ├── lead-capture phase
    │   └── steps: [name, email]
    ├── basics phase
    │   └── steps: [gender, age, weight, height]
    ├── kitchen phase
    │   └── steps: [who-cooks, cooking-skill]
    ├── blacklist phase
    │   └── steps: [hated-foods, specific-exclusions]
    ├── activity phase
    │   └── steps: [activity-level]
    └── lifestyle phase
        └── steps: [social-life, sweet-savory]
```

---

## Configuration Structure

### File: `src/config/wizard-data.ts`

The main wizard configuration file defines all phases, steps, and options using TypeScript. All text fields use i18n keys—actual text is resolved at runtime.

### Phase Definition

```typescript
const leadCapturePhase: WizardPhase = {
  id: 'lead-capture',           // kebab-case identifier
  title: 'phases.leadCapture.title',       // i18n key
  description: 'phases.leadCapture.description', // i18n key
  steps: [nameStep, emailStep],
};
```

### Step Definition

```typescript
const nameStep: WizardStep = {
  id: 'name',                              // kebab-case identifier
  question: 'steps.name.question',         // i18n key
  questionType: 'text-input',              // Question type
  config: {
    placeholder: 'steps.name.placeholder', // i18n key
    type: 'text' | 'email',
  },
};
```

### Option Definition

```typescript
const genderOptions: WizardOption[] = [
  {
    id: 'male',
    label: 'wizard.options.male',          // i18n key
    value: 'male',
    icon: 'User',                          // Lucide icon name
  },
];
```

### Key Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Phase IDs | kebab-case | `lead-capture`, `activity-level` |
| Step IDs | kebab-case | `who-cooks`, `cooking-skill` |
| Option IDs | kebab-case | `sweet-tooth`, `party-animal` |
| i18n keys | camelCase | `leadCapture`, `whoCooks` |

---

## i18n Translation System

### Translation Key Pattern

All translation keys follow the pattern: `wizard.phases.{phase}.{element}.{id}`

**Structure:**
```
wizard                          # Root namespace
├── phases                      # Phase translations
│   └── {phaseId}               # Phase ID (kebab-case in config, camelCase in translation files)
│       ├── title               # Phase title
│       └── description         # Phase description
├── steps                       # Step translations
│   └── {stepId}                # Step ID
│       ├── question            # Question text
│       └── placeholder         # Placeholder text (optional)
├── options                     # Option label translations
│   └── {optionId}              # Option ID
├── rating                      # Rating scale labels
│   ├── veryLow
│   ├── low
│   ├── medium
│   ├── high
│   └── veryHigh
├── buttons                     # Button text
│   ├── back
│   ├── next
│   ├── submit
│   └── submitting
└── name                        # Wizard name
    └── aiDietitian
```

### Translation Files

| Locale | File | Status |
|--------|------|--------|
| English | `messages/en.json` | Complete |
| Greek | `messages/el.json` | Complete |
| Spanish | `messages/es.json` | Complete |

### Example: English Translation File

```json
{
  "wizard": {
    "phases": {
      "lead-capture": {
        "title": "Welcome",
        "description": "Let's start with your contact details"
      },
      "basics": {
        "title": "The Basics",
        "description": "Let's start with the fundamentals"
      }
    },
    "steps": {
      "name": {
        "question": "What is your name?",
        "placeholder": "Enter your full name"
      }
    }
  }
}
```

### Adding New Translations

To add a new locale:

1. Create `messages/{locale}.json`
2. Copy the structure from an existing file
3. Translate all string values
4. Add the locale to `src/i18n/routing.ts`

---

## Component Architecture

### WizardEngine.tsx

The main orchestrator component that renders the wizard UI. Located at `src/components/wizard/WizardEngine.tsx`.

**Responsibilities:**
- Manage wizard header, body, and footer
- Render appropriate input component based on question type
- Handle phase and step navigation
- Apply Framer Motion animations for transitions

**Key Functions:**

```typescript
// Translate phase title with fallback
function getPhaseTitle(t, phase) {
  return t(`phases.${phase.id}.title`, { defaultMessage: phase.title });
}

// Translate phase description with fallback
function getPhaseDescription(t, phase) {
  if (!phase.description) return undefined;
  return t(`phases.${phase.id}.description`, { defaultMessage: phase.description });
}
```

### use-wizard Hook

State management hook located at `src/hooks/use-wizard.ts`.

**State Variables:**
- `currentPhaseIndex`: Current phase position (0-5)
- `currentStepIndex`: Current step position within phase
- `answers`: User responses stored by step ID
- `isSubmitting`: Submission in progress flag

**Return Values:**

```typescript
{
  currentStep,           // Current WizardStep
  currentPhase,          // Current WizardPhase
  currentPhaseIndex,     // Phase position
  currentStepIndex,      // Step position
  totalSteps,            // Total steps count
  answers,               // User responses
  progress,              // Overall progress (0-100)
  handleOptionSelect,    // Save answer
  handleNext,            // Navigate forward
  handleBack,            // Navigate backward
  submitWizard,          // Submit all answers
  resetWizard,           // Reset to initial state
}
```

### Input Components

Located in `src/components/wizard/inputs/`:

| Component | Purpose | Props |
|-----------|---------|-------|
| `TextInput` | Text/email input | value, onChange, placeholder, type |
| `CardSelector` | Grid of selectable cards | options, value, onChange, multiSelect |
| `ImageGrid` | Grid with images | options, value, onChange |
| `ModernSlider` | Range slider | min, max, step, unit, value, onChange |
| `VisualRating` | Star/flame rating | max, value, onChange, labels, icon |
| `SearchList` | Searchable combobox | options, value, onChange, placeholder |

---

## Question Types

### TextInput

For text and email fields. Used in the lead-capture phase.

```typescript
const nameStep: WizardStep = {
  id: 'name',
  question: 'steps.name.question',
  questionType: 'text-input',
  config: {
    placeholder: 'steps.name.placeholder',
    type: 'text' | 'email',
  },
};
```

### CardSelector

For card-based selection. Displays options in a responsive grid.

```typescript
const genderStep: WizardStep = {
  id: 'gender',
  question: 'steps.gender.question',
  questionType: 'card-selection',
  options: genderOptions,
};
```

### ModernSlider

For numeric values with a range. Supports units.

```typescript
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
```

### VisualRating

For skill levels and satisfaction ratings. Supports star or chef hat icons.

```typescript
const cookingSkillStep: WizardStep = {
  id: 'cooking-skill',
  question: 'steps.cookingSkill.question',
  questionType: 'rating',
  config: {
    max: 5,
    icon: 'Flame',
  },
};
```

### ImageGrid

For visual selection with images. Used for hated foods.

```typescript
const hatedFoodsStep: WizardStep = {
  id: 'hated-foods',
  question: 'steps.hatedFoods.question',
  questionType: 'image-grid',
  options: hatedFoodOptions,
};
```

### SearchList

For searchable multi-select. Used for specific exclusions.

```typescript
const specificExclusionsStep: WizardStep = {
  id: 'specific-exclusions',
  question: 'steps.specificExclusions.question',
  questionType: 'search-list',
  config: {
    searchPlaceholder: 'steps.specificExclusions.placeholder',
    multiSelect: true,
  },
};
```

---

## Recent Fixes

### Import Fix: wizard-config → wizard-data

The main wizard configuration was moved from `wizard-config.ts` to `wizard-data.ts` to avoid confusion with the skeleton/example configuration file.

**Before:**
```typescript
import { wizardConfig } from '@/config/wizard-config';
```

**After:**
```typescript
import { wizardData } from '@/config/wizard-data';
```

### i18n Key Standardization

Translation keys were standardized to use kebab-case in the JSON files to match the phase IDs used in `WizardEngine.tsx`.

**Affected keys:**
- `lead-capture` (was `leadCapture` in en.json)
- `body-metrics` (was `bodyMetrics` in en.json)

**Translation key pattern:**
```typescript
// WizardEngine.tsx uses phase.id directly
t(`phases.${phase.id}.title`)

// For phase.id = 'lead-capture', this resolves to:
t('phases.lead-capture.title')
```

---

## Usage

### Running the Wizard

```bash
npm run dev
```

Access at: `http://localhost:3000/en/onboarding`

### Adding a New Phase

1. Define steps in `src/config/wizard-data.ts`
2. Define the phase with the steps
3. Add the phase to the `phases` array
4. Add translation keys to all locale files

```typescript
// Step definition
const newStep: WizardStep = {
  id: 'new-step',
  question: 'steps.newStep.question',
  questionType: 'card-selection',
  options: newOptions,
};

// Phase definition
const newPhase: WizardPhase = {
  id: 'new-phase',
  title: 'phases.newPhase.title',
  description: 'phases.newPhase.description',
  steps: [newStep],
};

// Add to phases array
export const wizardData: WizardConfig = {
  id: 'foodbrain',
  name: 'wizard.name.aiDietitian',
  phases: [
    leadCapturePhase,
    // ...existing phases
    newPhase,  // Add here
  ],
};
```

### Adding a New Translation

1. Add keys to `messages/{locale}.json` following the established pattern
2. Keys use camelCase for nested objects
3. String values contain the translated text

```json
{
  "wizard": {
    "phases": {
      "new-phase": {
        "title": "New Phase Title",
        "description": "Phase description"
      }
    },
    "steps": {
      "newStep": {
        "question": "What is your question?",
        "placeholder": "Placeholder text"
      }
    }
  }
}
```

---

## File Reference

| File | Purpose |
|------|---------|
| [`src/config/wizard-data.ts`](../src/config/wizard-data.ts) | Main wizard configuration |
| [`src/config/wizard-config.ts`](../src/config/wizard-config.ts) | Example/skeleton configuration |
| [`src/components/wizard/WizardEngine.tsx`](../src/components/wizard/WizardEngine.tsx) | Main wizard component |
| [`src/hooks/use-wizard.ts`](../src/hooks/use-wizard.ts) | Wizard state management |
| [`src/components/wizard/inputs/`](../src/components/wizard/inputs/) | Input component library |
| [`src/types/wizard.ts`](../src/types/wizard.ts) | TypeScript type definitions |
| [`messages/en.json`](../messages/en.json) | English translations |
| [`messages/el.json`](../messages/el.json) | Greek translations |
| [`messages/es.json`](../messages/es.json) | Spanish translations |
