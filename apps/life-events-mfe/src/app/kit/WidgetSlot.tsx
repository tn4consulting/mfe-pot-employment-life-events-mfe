import * as React from 'react';
import { ComponentType, useEffect, useState } from 'react';
import { useWidgetLoader } from '@tn4consulting/shared-federation-runtime';
import { useLocale, useTranslations } from '@tn4consulting/shared-i18n';
import type { BilingualText } from './bilingual-content';
import { text } from './bilingual-content';
import { assetBaseUrl } from '../asset-base-url';

export interface WidgetSlotProps {
  widgetId: string;
  heading?: BilingualText;
}

/**
 * Loads and mounts a cross-remote widget by id, host-mediated via
 * `useWidgetLoader` (shared-federation-runtime's generic keyed registry --
 * see mfe-pot-msca-shell's routes.tsx for what actually populates the
 * registry). Centralizes the load/error/unavailable UX that used to be
 * hand-rolled once per widget usage (GuidedJourney.tsx's payment-history
 * effect, JobSearchChecklistItem's, EiChecklistItems') into one place.
 */
export function WidgetSlot({ widgetId, heading }: WidgetSlotProps) {
  const locale = useLocale();
  const { t } = useTranslations(assetBaseUrl, locale);
  const loadWidget = useWidgetLoader(widgetId);
  const [Widget, setWidget] = useState<ComponentType<Record<string, unknown>> | null>(null);
  const [widgetLoadError, setWidgetLoadError] = useState(false);

  useEffect(() => {
    if (!loadWidget) {
      setWidgetLoadError(true);
      return;
    }
    let cancelled = false;
    loadWidget()
      .then(({ component }) => {
        if (!cancelled) {
          setWidget(() => component);
        }
      })
      .catch((err) => {
        console.error(`Failed to load widget "${widgetId}"`, err);
        if (!cancelled) {
          setWidgetLoadError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [loadWidget, widgetId]);

  return (
    <section>
      {heading && <h2>{text(heading, locale)}</h2>}
      {widgetLoadError && <p role="alert">{t('journey.widgetUnavailable')}</p>}
      {Widget && <Widget />}
    </section>
  );
}
