// See App.tsx's own comment on this same import -- required for the
// classic JSX transform this app's tsconfig uses.
import * as React from 'react';
import { ComponentType, useCallback, useEffect, useState } from 'react';
import { useWidgetLoader } from '@tn4consulting/shared-federation-runtime';
import { useLocale, useTranslations } from '@tn4consulting/shared-i18n';
import { assetBaseUrl } from './asset-base-url';

/**
 * employment-insurance's EiReportingStatus shape, duck-typed here rather
 * than imported -- `employment-insurance-data-access` is an Nx lib
 * internal to mfe-pot-employment-insurance-mfe's own repo/build, not a
 * published package this separately-deployed repo can depend on. Only the
 * field this component actually reads is typed.
 */
interface LoadedReportingStatus {
  status: 'not_yet_due' | 'due_soon' | 'overdue';
}

/**
 * The EI section of the job-loss journey: "apply" and "keep up with
 * reporting" both derive real completion from the one
 * employment-insurance ReportingStatus widget, loaded host-mediated by
 * widget id ("ei-reporting-status") via the shell's generic widget
 * registry. Only one widget instance is mounted (its own fetch is
 * per-citizen, not per-item) and its `onStatusLoaded` callback drives both
 * items: `status === null` means no claim yet (apply not complete); once a
 * claim exists, reporting itself only counts as "complete" while
 * `status === 'not_yet_due'` -- `due_soon`/`overdue` mean a report is
 * actually owed right now, which the checklist should keep surfacing as
 * an open task, not a done one. The widget mounts as soon as it resolves
 * (needed for its fetch effect to run and the callback to fire); it's
 * only made visible once there's a claim to show, under the "report" item
 * since that's the ongoing task once applied.
 *
 * Self-contained (no props, owns its own `scds-checklist` wrapper and
 * heading) -- this is job-loss's `kind: 'custom'` section, the escape
 * hatch a life event uses when its content doesn't fit the standard
 * checklist/links/widget shapes as cleanly (here: two items sharing one
 * widget instance).
 */
export function EiChecklistItems() {
  const locale = useLocale();
  const { t } = useTranslations(assetBaseUrl, locale);
  const loadWidget = useWidgetLoader('ei-reporting-status');
  const [Widget, setWidget] = useState<ComponentType<Record<string, unknown>> | null>(null);
  const [widgetLoadError, setWidgetLoadError] = useState(false);
  const [reportingStatus, setReportingStatus] = useState<LoadedReportingStatus | null | undefined>(undefined);

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
        console.error('Failed to load EI reporting-status widget', err);
        if (!cancelled) {
          setWidgetLoadError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [loadWidget]);

  const handleStatusLoaded = useCallback((status: LoadedReportingStatus | null) => {
    setReportingStatus(status);
  }, []);

  const applied = reportingStatus !== undefined && reportingStatus !== null;
  const reportingUpToDate = applied && reportingStatus?.status === 'not_yet_due';

  return (
    <scds-checklist checklist-heading={t('journey.eiHeading')}>
      <scds-checklist-item
        item-title={t('journey.eiApply.title')}
        description={t('journey.eiApply.body')}
        complete={applied}
        complete-label={t('journey.completed')}
      >
        <scds-link href="/employment-insurance" icon-name="arrow-right">
          {applied ? t('journey.status') : t('journey.eiApply.action')}
        </scds-link>
        {widgetLoadError && <p role="alert">{t('journey.widgetUnavailable')}</p>}
      </scds-checklist-item>
      <scds-checklist-item
        item-title={t('journey.eiReport.title')}
        description={t('journey.eiReport.body')}
        complete={reportingUpToDate}
        complete-label={t('journey.completed')}
      >
        <scds-link href="/employment-insurance" icon-name="arrow-right">
          {reportingUpToDate ? t('journey.status') : t('journey.eiReport.action')}
        </scds-link>
        {Widget && (
          <div style={{ display: applied ? 'block' : 'none', marginTop: '0.5rem' }}>
            <Widget onStatusLoaded={handleStatusLoaded} />
          </div>
        )}
      </scds-checklist-item>
    </scds-checklist>
  );
}
