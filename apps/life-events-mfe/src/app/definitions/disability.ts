import * as React from 'react';
import type { LifeEventDefinition } from '../kit/life-event-schema';
import { DisabilityApplicationStepper } from '../DisabilityApplicationStepper';

/**
 * The "hard case" this kit's customization goal is judged against: a
 * linear multi-step application flow doesn't fit the checklist/links/
 * widget shapes cleanly, so this life event's main section is `kind:
 * 'custom'` -- a full opt-out of the schema, not a variation of it. The
 * `links` section alongside it shows the escape hatch composes fine with
 * ordinary schema-driven sections in the same definition; a life event
 * isn't all-custom-or-nothing.
 */
export const DISABILITY: LifeEventDefinition = {
  id: 'disability',
  introContentKey: 'life-events.disability.intro',
  sections: [
    {
      kind: 'custom',
      id: 'application-stepper',
      render: () => React.createElement(DisabilityApplicationStepper),
    },
    {
      kind: 'links',
      id: 'other-services',
      heading: {
        en: 'Other services that may help',
        fr: 'Autres services qui pourraient vous aider',
      },
      links: [
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
      ],
    },
  ],
};
