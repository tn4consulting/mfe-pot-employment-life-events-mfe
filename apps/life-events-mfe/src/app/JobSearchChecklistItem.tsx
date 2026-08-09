// See App.tsx's own comment on this same import -- required for the
// classic JSX transform this app's tsconfig uses.
import * as React from 'react';
import { ComponentType, useCallback, useEffect, useState } from 'react';
import { useWidgetLoader } from '@tn4consulting/shared-federation-runtime';
import { useLocale, useTranslations } from '@tn4consulting/shared-i18n';
import { assetBaseUrl } from './asset-base-url';

/**
 * job-bank's JobApplication shape, duck-typed here rather than imported --
 * `job-bank-data-access` is an Nx lib internal to mfe-pot-job-bank-mfe's
 * own repo/build, not a published package this separately-deployed repo
 * can depend on. Only the field this component actually reads is typed.
 */
interface LoadedJobApplication {
  id?: unknown;
}

/**
 * The one employability-checklist item with a real completion signal:
 * job-bank's own JobApplicationsList, loaded host-mediated by widget id
 * ("job-applications") via the shell's generic widget registry (see
 * mfe-pot-msca-shell's routes.tsx). Complete once the citizen has at least
 * one real application on file -- job-bank's component determines that
 * itself and reports it back via `onApplicationsLoaded`, not by this
 * component re-implementing the fetch. The widget mounts as soon as it
 * resolves (needed so its own fetch effect actually runs and the callback
 * fires); it's only made visible once there's something to show, so an
 * empty first mount doesn't render job-bank's own "no applications" copy
 * underneath a checklist item that already says the same thing via its
 * action label.
 *
 * Self-serves locale/translations (no props) -- `pages/JobLossPage.tsx`
 * renders this as an ordinary JSX child of `ChecklistSection`, alongside
 * its `ChecklistItem` siblings, so it needs no wrapper of its own either.
 */
export function JobSearchChecklistItem() {
  const locale = useLocale();
  const { t } = useTranslations(assetBaseUrl, locale);
  const loadWidget = useWidgetLoader('job-applications');
  const [Widget, setWidget] = useState<ComponentType<Record<string, unknown>> | null>(null);
  const [widgetLoadError, setWidgetLoadError] = useState(false);
  const [applications, setApplications] = useState<LoadedJobApplication[] | null>(null);

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
        console.error('Failed to load job-bank applications widget', err);
        if (!cancelled) {
          setWidgetLoadError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [loadWidget]);

  const handleApplicationsLoaded = useCallback((loaded: LoadedJobApplication[]) => {
    setApplications(loaded);
  }, []);

  const completed = applications !== null && applications.length > 0;

  return (
    <scds-checklist-item
      item-title={t('journey.jobSearch.title')}
      description={t('journey.jobSearch.body')}
      complete={completed}
      complete-label={t('journey.completed')}
    >
      <scds-link href="/job-bank" icon-name="arrow-right">
        {completed ? t('journey.status') : t('journey.jobSearch.action')}
      </scds-link>
      {widgetLoadError && <p role="alert">{t('journey.widgetUnavailable')}</p>}
      {Widget && (
        <div style={{ display: completed ? 'block' : 'none', marginTop: '0.5rem' }}>
          <Widget onApplicationsLoaded={handleApplicationsLoaded} />
        </div>
      )}
    </scds-checklist-item>
  );
}
