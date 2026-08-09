import * as React from 'react';
import { useState } from 'react';
import { useLocale, useTranslations } from '@tn4consulting/shared-i18n';
import { assetBaseUrl } from '../asset-base-url';

export interface ChecklistItemProps {
  /**
   * Used as the checkbox's `id`/`htmlFor` pair -- must be unique across
   * the whole page (not just within its own section), since this
   * component no longer has a parent `ChecklistSection` id to namespace
   * against. Prefer an already-scoped value, e.g. `"departure-roe"`
   * rather than just `"roe"`, if another section on the same page might
   * reuse a short id like `"roe"` too.
   */
  id: string;
  titleKey: string;
  bodyKey: string;
  /** Present only for items that route out to another app's own page. */
  linkHref?: string;
  linkLabelKey?: string;
}

/**
 * A single self-reported checklist item -- a plain checkbox slotted into
 * an `scds-checklist-item`, not backed by another app's live data.
 * Completion state is session-only (not persisted) -- no BFF of this
 * app's own to persist it to, and re-confirming on a fresh visit is an
 * acceptable trade-off for a proof-of-technology guided journey. Owns its
 * own completion state independently (no parent-orchestrated state) --
 * nothing today reads checked state across items, matching how
 * `JobSearchChecklistItem`/`EiChecklistItems` already self-manage theirs.
 *
 * Self-serves locale/translations, same convention as every other kit
 * component -- see `ChecklistSection`'s own comment for why.
 */
export function ChecklistItem({ id, titleKey, bodyKey, linkHref, linkLabelKey }: ChecklistItemProps) {
  const locale = useLocale();
  const { t } = useTranslations(assetBaseUrl, locale);
  const [checked, setChecked] = useState(false);
  const checkboxId = `checklist-item-${id}`;

  return (
    <scds-checklist-item
      item-title={t(titleKey)}
      description={t(bodyKey)}
      complete={checked}
      complete-label={t('journey.completed')}
    >
      <label htmlFor={checkboxId}>
        <input id={checkboxId} type="checkbox" checked={checked} onChange={() => setChecked((prev) => !prev)} />{' '}
        {checked ? t('journey.completed') : t('journey.markDone')}
      </label>
      {linkHref && linkLabelKey && (
        <scds-link href={linkHref} icon-name="arrow-right">
          {t(linkLabelKey)}
        </scds-link>
      )}
    </scds-checklist-item>
  );
}
