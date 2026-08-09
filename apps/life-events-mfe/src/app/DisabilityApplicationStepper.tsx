// See App.tsx's own comment on this same import -- required for the
// classic JSX transform this app's tsconfig uses.
import * as React from 'react';
import { useState } from 'react';
import { useLocale } from '@tn4consulting/shared-i18n';
import type { BilingualText } from './kit/bilingual-content';
import { text } from './kit/bilingual-content';

interface StepperStep {
  id: string;
  title: BilingualText;
  body: BilingualText;
}

const STEPS: StepperStep[] = [
  {
    id: 'confirm-eligibility',
    title: { en: 'Confirm your eligibility', fr: 'Confirmez votre admissibilité' },
    body: {
      en: 'Check whether your condition and work history meet the requirements for CPP disability benefits or provincial disability supports.',
      fr: 'Vérifiez si votre état de santé et vos antécédents de travail répondent aux exigences des prestations d’invalidité du RPC ou des soutiens provinciaux en matière d’invalidité.',
    },
  },
  {
    id: 'gather-documents',
    title: { en: 'Gather your medical documents', fr: 'Rassemblez vos documents médicaux' },
    body: {
      en: 'Ask your medical practitioner to complete a medical report, and collect records of your diagnosis and treatment history.',
      fr: 'Demandez à votre professionnel de la santé de remplir un rapport médical, et rassemblez vos dossiers de diagnostic et d’historique de traitement.',
    },
  },
  {
    id: 'submit-application',
    title: { en: 'Submit your application', fr: 'Soumettez votre demande' },
    body: {
      en: 'Submit your completed application online or by mail, along with your medical report.',
      fr: 'Soumettez votre demande complétée en ligne ou par la poste, accompagnée de votre rapport médical.',
    },
  },
];

const LABELS = {
  heading: { en: 'Applying for disability benefits', fr: 'Présenter une demande de prestations d’invalidité' },
  back: { en: 'Back', fr: 'Retour' },
  next: { en: 'Next', fr: 'Suivant' },
} satisfies Record<string, BilingualText>;

/**
 * Disability's bespoke content -- a linear multi-step flow doesn't fit
 * the checklist/links pattern cleanly, so `pages/DisabilityPage.tsx`
 * renders this directly instead of forcing it into a checklist. Uses
 * `scds-progress-bar` (`shared-ui-scds-core`) -- a plain proportional bar
 * + step-count text, already exactly what a step indicator needs here
 * with no new design-system component required.
 */
export function DisabilityApplicationStepper() {
  const locale = useLocale();
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  return (
    <section>
      <h2>{text(LABELS.heading, locale)}</h2>
      <scds-progress-bar current={stepIndex + 1} total={STEPS.length} step-label={text(step.title, locale)} />
      <h3>{text(step.title, locale)}</h3>
      <p>{text(step.body, locale)}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="button" disabled={stepIndex === 0} onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>
          {text(LABELS.back, locale)}
        </button>
        <button
          type="button"
          disabled={stepIndex === STEPS.length - 1}
          onClick={() => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))}
        >
          {text(LABELS.next, locale)}
        </button>
      </div>
    </section>
  );
}
