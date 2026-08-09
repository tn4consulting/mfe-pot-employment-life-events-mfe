import * as React from 'react';
import { ReactNode } from 'react';
import { useLocale, useTranslations } from '@tn4consulting/shared-i18n';
import { assetBaseUrl } from '../asset-base-url';

export interface ChecklistSectionProps {
  headingKey: string;
  children: ReactNode;
}

/**
 * Renders a life event's checklist as a `scds-checklist` -- purely a
 * heading + wrapper now; the items themselves are authored as ordinary
 * `ChecklistItem` (or other) JSX children rather than a mapped data array,
 * so a bespoke item (e.g. `JobSearchChecklistItem`, which has a real
 * completion signal from another federated app) sits inline as a plain
 * sibling instead of needing a dedicated `leadingItem` escape hatch.
 *
 * Self-serves locale/translations (generalized kit component, shared
 * across every life-event page) rather than taking them as props -- React
 * has no per-bundle DI-singleton-identity concept for two call sites of
 * `useTranslations` to collide over, unlike the Angular version this
 * family migrated away from (see App.tsx's own comment).
 */
export function ChecklistSection({ headingKey, children }: ChecklistSectionProps) {
  const locale = useLocale();
  const { t } = useTranslations(assetBaseUrl, locale);

  return <scds-checklist checklist-heading={t(headingKey)}>{children}</scds-checklist>;
}
