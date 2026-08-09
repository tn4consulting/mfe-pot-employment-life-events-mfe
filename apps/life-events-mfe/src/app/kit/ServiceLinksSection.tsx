import * as React from 'react';
import { useLocale } from '@tn4consulting/shared-i18n';
import type { LinksLifeEventSection } from './life-event-schema';
import { text } from './life-event-schema';

export interface ServiceLinksSectionProps {
  section: LinksLifeEventSection;
}

/**
 * Renders a life event's "links to other services" as a `scds-card` grid
 * -- replaces the scattered literal hrefs that used to live directly in
 * checklist-data.ts/JobSearchChecklistItem.tsx/EiChecklistItems.tsx with
 * one schema (ServiceLink) and one renderer, reused by every life event.
 * Same plain CSS-grid layout mfe-pot-dashboard-mfe's Overview.tsx already
 * uses for its own card grid -- there's no dedicated `scds-card-grid`
 * component in the design system.
 */
export function ServiceLinksSection({ section }: ServiceLinksSectionProps) {
  const locale = useLocale();

  return (
    <section>
      <h2>{text(section.heading, locale)}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))', gap: 'var(--scds-space-4, 1rem)' }}>
        {section.links.map((link) => (
          <scds-card
            key={link.id}
            card-title={text(link.title, locale)}
            card-title-tag="h3"
            description={link.description ? text(link.description, locale) : undefined}
            href={link.href}
          />
        ))}
      </div>
    </section>
  );
}
