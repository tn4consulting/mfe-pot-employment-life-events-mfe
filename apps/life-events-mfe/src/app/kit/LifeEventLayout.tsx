import * as React from 'react';
import { useEffect, useState, type ReactNode } from 'react';
import type { ContentClient, PageContent } from '@tn4consulting/shared-content-client';
import { useLocale, useTranslations } from '@tn4consulting/shared-i18n';
import { assetBaseUrl } from '../asset-base-url';

export interface LifeEventLayoutProps {
  lifeEventId: string;
  /**
   * Nullable -- App.tsx bootstraps this once, asynchronously; a page
   * renders immediately even before it resolves, only the intro block
   * waits (matching this app's pre-existing behaviour).
   */
  contentClient: ContentClient | null;
  children: ReactNode;
}

/**
 * The one piece of chrome every life-event page shares: fetches and
 * renders this life event's CMS intro block, keyed by convention as
 * `life-events.<id>.intro`, then renders `children`. This is the kit's
 * "consistency" half -- everything below the intro is fully free-form per
 * page, this wrapper imposes no other shape.
 */
export function LifeEventLayout({ lifeEventId, contentClient, children }: LifeEventLayoutProps) {
  const [intro, setIntro] = useState<PageContent | null>(null);
  const [introLoadError, setIntroLoadError] = useState(false);
  const locale = useLocale();
  const { t } = useTranslations(assetBaseUrl, locale);

  // CMS content (unlike the i18n chrome text above) isn't reactive by
  // default, so this re-fetches whenever the cross-remote active locale
  // changes -- same pattern as job-bank's/dashboard's App.
  useEffect(() => {
    if (!contentClient) {
      return;
    }
    let cancelled = false;
    contentClient
      .getPageContent(`life-events.${lifeEventId}.intro`, locale === 'fr' ? 'fr' : 'en')
      .then((content) => {
        if (!cancelled) {
          setIntro(content);
          setIntroLoadError(false);
        }
      })
      .catch((err) => {
        console.error(`Failed to load life-event intro content for "${lifeEventId}"`, err);
        if (!cancelled) {
          setIntroLoadError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [contentClient, lifeEventId, locale]);

  return (
    <>
      {intro ? (
        <section>
          <h1>{intro.title}</h1>
          <p>{intro.body}</p>
        </section>
      ) : introLoadError ? (
        <p role="alert">{t('errors.contentUnavailable')}</p>
      ) : null}
      {children}
    </>
  );
}
