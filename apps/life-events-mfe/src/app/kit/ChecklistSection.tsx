import * as React from 'react';
import { ReactNode, useState } from 'react';
import { useLocale, useTranslations } from '@tn4consulting/shared-i18n';
import type { BilingualText, StaticChecklistItem } from './bilingual-content';
import { text } from './bilingual-content';
import { assetBaseUrl } from '../asset-base-url';

export interface ChecklistSectionProps {
  id: string;
  heading: BilingualText;
  items: StaticChecklistItem[];
  /**
   * An extra checklist item rendered before this section's static items,
   * inside the same list -- lets a widget-backed item (real completion
   * signal from another federated app, e.g. job search) sit inline with a
   * section's otherwise self-reported items.
   */
  leadingItem?: ReactNode;
}

/**
 * Renders a life event's self-reported checklist items (no owning remote
 * to derive real completion from) as a `scds-checklist` -- self-reported
 * via a plain checkbox slotted into each `scds-checklist-item`, not backed
 * by another app's live data. Completion state is session-only (not
 * persisted) -- no BFF of this app's own to persist it to, and
 * re-confirming on a fresh visit is an acceptable trade-off for a
 * proof-of-technology guided journey.
 *
 * Self-serves locale/translations (generalized kit component, shared
 * across every life-event page) rather than taking them as props -- React
 * has no per-bundle DI-singleton-identity concept for two call sites of
 * `useTranslations` to collide over, unlike the Angular version this
 * family migrated away from (see App.tsx's own comment).
 */
export function ChecklistSection({ id, heading, items, leadingItem }: ChecklistSectionProps) {
  const locale = useLocale();
  const { t } = useTranslations(assetBaseUrl, locale);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  function toggle(itemId: string) {
    setChecked((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  }

  return (
    <scds-checklist checklist-heading={text(heading, locale)}>
      {leadingItem}
      {items.map((item) => {
        const itemChecked = checked[item.id] ?? false;
        const checkboxId = `${id}-${item.id}`;
        return (
          <scds-checklist-item
            key={item.id}
            item-title={text(item.title, locale)}
            description={text(item.body, locale)}
            complete={itemChecked}
            complete-label={t('journey.completed')}
          >
            <label htmlFor={checkboxId}>
              <input id={checkboxId} type="checkbox" checked={itemChecked} onChange={() => toggle(item.id)} />{' '}
              {itemChecked ? t('journey.completed') : t('journey.markDone')}
            </label>
            {item.linkHref && item.linkLabel && (
              <scds-link href={item.linkHref} icon-name="arrow-right">
                {text(item.linkLabel, locale)}
              </scds-link>
            )}
          </scds-checklist-item>
        );
      })}
    </scds-checklist>
  );
}
