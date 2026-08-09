import * as React from 'react';
import { ServiceLinksSection } from '../kit/ServiceLinksSection';
import { LifeEventLayout } from '../kit/LifeEventLayout';
import { DisabilityApplicationStepper } from '../DisabilityApplicationStepper';
import type { LifeEventPageModule, LifeEventPageProps } from './types';

/**
 * The "hard case" this kit's customization goal is judged against: a
 * linear multi-step application flow doesn't fit the checklist/links/
 * widget helpers cleanly, so this page renders its own bespoke component
 * (DisabilityApplicationStepper) directly, alongside an ordinary
 * ServiceLinksSection -- a life event isn't all-custom-or-nothing.
 */
export function DisabilityPage({ lifeEventId, contentClient }: LifeEventPageProps) {
  return (
    <LifeEventLayout lifeEventId={lifeEventId} contentClient={contentClient}>
      <DisabilityApplicationStepper />
      <ServiceLinksSection
        heading={{
          en: 'Other services that may help',
          fr: 'Autres services qui pourraient vous aider',
        }}
        links={[
          {
            id: 'cdcp',
            title: { en: 'Canadian Dental Care Plan (CDCP)', fr: 'Régime canadien de soins dentaires (RCSD)' },
            description: {
              en: 'You may be eligible for the CDCP — check your dashboard for a personalized look at your benefits.',
              fr: 'Vous pourriez être admissible au RCSD — consultez votre tableau de bord pour un aperçu personnalisé de vos prestations.',
            },
            href: '/dashboard',
          },
          {
            id: 'disability-tax-credit',
            title: { en: 'Disability Tax Credit (DTC)', fr: 'Crédit d’impôt pour personnes handicapées (CIPH)' },
            description: {
              en: 'A non-refundable tax credit that reduces the income tax you may have to pay.',
              fr: 'Un crédit d’impôt non remboursable qui réduit l’impôt sur le revenu que vous pourriez avoir à payer.',
            },
            href: '/dashboard',
          },
        ]}
      />
    </LifeEventLayout>
  );
}

export const disabilityPage: LifeEventPageModule = { id: 'disability', Component: DisabilityPage };
