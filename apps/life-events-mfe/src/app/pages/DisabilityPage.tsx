import * as React from 'react';
import { ServiceLinksSection } from '../kit/ServiceLinksSection';
import { ServiceLink } from '../kit/ServiceLink';
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
      <ServiceLinksSection headingKey="journey.serviceLinks.heading">
        <ServiceLink
          titleKey="journey.serviceLinks.disability.cdcp.title"
          descriptionKey="journey.serviceLinks.disability.cdcp.description"
          href="/dashboard"
        />
        <ServiceLink
          titleKey="journey.serviceLinks.disability.disabilityTaxCredit.title"
          descriptionKey="journey.serviceLinks.disability.disabilityTaxCredit.description"
          href="/dashboard"
        />
      </ServiceLinksSection>
    </LifeEventLayout>
  );
}

export const disabilityPage: LifeEventPageModule = { id: 'disability', Component: DisabilityPage };
