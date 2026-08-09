import * as React from 'react';
import { ChecklistSection } from '../kit/ChecklistSection';
import { ChecklistItem } from '../kit/ChecklistItem';
import { ServiceLinksSection } from '../kit/ServiceLinksSection';
import { ServiceLink } from '../kit/ServiceLink';
import { LifeEventLayout } from '../kit/LifeEventLayout';
import type { LifeEventPageModule, LifeEventPageProps } from './types';

/**
 * The "easy case": a pure checklist + links life event, no widgets, no
 * bespoke components. Compare the size of this file to JobLossPage.tsx --
 * this is the actual proof that adding a life event doesn't require
 * touching the shell or the kit.
 */
export function BirthPage({ lifeEventId, contentClient }: LifeEventPageProps) {
  return (
    <LifeEventLayout lifeEventId={lifeEventId} contentClient={contentClient}>
      <ChecklistSection headingKey="journey.birth.firstSteps.heading">
        <ChecklistItem
          id="first-steps-register-birth"
          titleKey="journey.birth.firstSteps.registerBirth.title"
          bodyKey="journey.birth.firstSteps.registerBirth.body"
        />
        <ChecklistItem
          id="first-steps-sin-application"
          titleKey="journey.birth.firstSteps.sinApplication.title"
          bodyKey="journey.birth.firstSteps.sinApplication.body"
        />
        <ChecklistItem
          id="first-steps-ei-maternity-parental"
          titleKey="journey.birth.firstSteps.eiMaternityParental.title"
          bodyKey="journey.birth.firstSteps.eiMaternityParental.body"
          linkHref="/employment-insurance"
          linkLabelKey="journey.birth.firstSteps.eiMaternityParental.linkLabel"
        />
      </ChecklistSection>
      <ServiceLinksSection headingKey="journey.serviceLinks.heading">
        <ServiceLink
          titleKey="journey.serviceLinks.birth.canadaChildBenefit.title"
          descriptionKey="journey.serviceLinks.birth.canadaChildBenefit.description"
          href="/dashboard"
        />
        <ServiceLink
          titleKey="journey.serviceLinks.birth.provincialFamilySupports.title"
          descriptionKey="journey.serviceLinks.birth.provincialFamilySupports.description"
          href="/dashboard"
        />
      </ServiceLinksSection>
    </LifeEventLayout>
  );
}

export const birthPage: LifeEventPageModule = { id: 'birth', Component: BirthPage };
