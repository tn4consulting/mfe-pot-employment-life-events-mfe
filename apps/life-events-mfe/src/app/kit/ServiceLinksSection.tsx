import * as React from 'react';
import { ReactNode } from 'react';
import { useLocale, useTranslations } from '@tn4consulting/shared-i18n';
import { assetBaseUrl } from '../asset-base-url';

export interface ServiceLinksSectionProps {
  headingKey: string;
  children: ReactNode;
}

/**
 * Renders a life event's "links to other services" as a `scds-card` grid
 * -- a heading + grid wrapper; the cards themselves are authored as
 * ordinary `ServiceLink` JSX children rather than a mapped data array,
 * reused by every life event page. Same plain CSS-grid layout
 * mfe-pot-dashboard-mfe's Overview.tsx already uses for its own card grid
 * -- there's no dedicated `scds-card-grid` component in the design system
 * yet (tracked in mfe-pot/TODO.md).
 */
export function ServiceLinksSection({ headingKey, children }: ServiceLinksSectionProps) {
  const locale = useLocale();
  const { t } = useTranslations(assetBaseUrl, locale);

  return (
    <section>
      <h2>{t(headingKey)}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))', gap: 'var(--scds-space-4, 1rem)' }}>
        {children}
      </div>
    </section>
  );
}
