import * as React from 'react';
import { ChecklistSection } from '../kit/ChecklistSection';
import { ChecklistItem } from '../kit/ChecklistItem';
import { ServiceLinksSection } from '../kit/ServiceLinksSection';
import { ServiceLink } from '../kit/ServiceLink';
import { WidgetSlot } from '../kit/WidgetSlot';
import { LifeEventLayout } from '../kit/LifeEventLayout';
import { JobSearchChecklistItem } from '../JobSearchChecklistItem';
import { EiChecklistItems } from '../EiChecklistItems';
import type { LifeEventPageModule, LifeEventPageProps } from './types';

/**
 * The original life event this whole family proves the pattern on. Two
 * pieces of content don't fit the kit's checklist/links/widget helpers
 * cleanly and are just rendered directly as JSX instead: JobSearchChecklistItem
 * (a real completion signal from job-bank, sitting inline with otherwise
 * self-reported items) and EiChecklistItems (two checklist items sharing
 * one widget instance) -- there's no schema seam between them and the
 * kit-driven sections around them.
 */
export function JobLossPage({ lifeEventId, contentClient }: LifeEventPageProps) {
  return (
    <LifeEventLayout lifeEventId={lifeEventId} contentClient={contentClient}>
      <ChecklistSection headingKey="journey.jobLoss.departure.heading">
        <ChecklistItem id="departure-roe" titleKey="journey.jobLoss.departure.roe.title" bodyKey="journey.jobLoss.departure.roe.body" />
        <ChecklistItem
          id="departure-final-pay"
          titleKey="journey.jobLoss.departure.finalPay.title"
          bodyKey="journey.jobLoss.departure.finalPay.body"
        />
        <ChecklistItem
          id="departure-benefits-continuation"
          titleKey="journey.jobLoss.departure.benefitsContinuation.title"
          bodyKey="journey.jobLoss.departure.benefitsContinuation.body"
        />
        <ChecklistItem
          id="departure-return-property"
          titleKey="journey.jobLoss.departure.returnProperty.title"
          bodyKey="journey.jobLoss.departure.returnProperty.body"
        />
        <ChecklistItem
          id="departure-reference"
          titleKey="journey.jobLoss.departure.reference.title"
          bodyKey="journey.jobLoss.departure.reference.body"
        />
        <ChecklistItem
          id="departure-keep-records"
          titleKey="journey.jobLoss.departure.keepRecords.title"
          bodyKey="journey.jobLoss.departure.keepRecords.body"
        />
      </ChecklistSection>
      <ChecklistSection headingKey="journey.jobLoss.employability.heading">
        {/* Excludes "search Job Bank" from the static items -- that one has
            a real completion signal (job-bank's own applications data),
            rendered here directly rather than as a ChecklistItem. */}
        <JobSearchChecklistItem />
        <ChecklistItem
          id="employability-update-cv"
          titleKey="journey.jobLoss.employability.updateCv.title"
          bodyKey="journey.jobLoss.employability.updateCv.body"
        />
        <ChecklistItem
          id="employability-training"
          titleKey="journey.jobLoss.employability.training.title"
          bodyKey="journey.jobLoss.employability.training.body"
        />
      </ChecklistSection>
      <ChecklistSection headingKey="journey.jobLoss.benefits.heading">
        <ChecklistItem
          id="benefits-tax-credits"
          titleKey="journey.jobLoss.benefits.taxCredits.title"
          bodyKey="journey.jobLoss.benefits.taxCredits.body"
        />
        <ChecklistItem
          id="benefits-provincial"
          titleKey="journey.jobLoss.benefits.provincial.title"
          bodyKey="journey.jobLoss.benefits.provincial.body"
        />
      </ChecklistSection>
      <ServiceLinksSection headingKey="journey.serviceLinks.heading">
        <ServiceLink
          titleKey="journey.serviceLinks.jobLoss.cdcp.title"
          descriptionKey="journey.serviceLinks.jobLoss.cdcp.description"
          href="/dashboard"
        />
      </ServiceLinksSection>
      <EiChecklistItems />
      <WidgetSlot
        widgetId="payment-history"
        heading={{
          en: 'Your payments at a glance',
          fr: "Vos paiements en un coup d'œil",
        }}
      />
    </LifeEventLayout>
  );
}

export const jobLossPage: LifeEventPageModule = { id: 'job-loss', Component: JobLossPage };
