// See below -- required for the classic JSX transform this app's tsconfig
// uses (react/jsx-runtime can't resolve once this bundle treats react as a
// federation-shared external, same documented issue as the shell repo's
// own App.tsx).
import * as React from 'react';
import { useEffect, useState } from 'react';
import { CLAIM_LIFE_EVENTS, getStoredSession, hasClaim, onSessionChange } from '@tn4consulting/shared-auth/core';
import type { ContentClient, PageContent } from '@tn4consulting/shared-content-client';
import { useLocale, useTranslations } from '@tn4consulting/shared-i18n';
import { createContentClient } from './content-client';
import { loadRuntimeConfig } from '../runtime-config';
import { assetBaseUrl } from './asset-base-url';
import { LifeEventPage } from './kit/LifeEventPage';
import { getLifeEventDefinition } from './definitions';
import './register-scds';

export interface AppProps {
  /**
   * Which life event to render -- a plain prop, not a router param this
   * component reads itself: `react-router-dom` isn't a federation-shared
   * singleton, so a remote's own bundled copy has a different Context
   * identity than the shell's, and `useParams()` here would silently
   * resolve to nothing. The shell reads its own route param and forwards
   * it via `RemoteRouteHost`'s `props` (see mfe-pot-msca-shell's
   * routes.tsx). Defaults to 'job-loss' so `nx serve` standalone (no
   * shell, no route) still renders something.
   */
  lifeEventId?: string;
}

/**
 * Does its own setup entirely -- no host-provided REMOTE_PROVIDERS
 * equivalent (see RemoteRouteHost in shared-federation-runtime for why).
 * Auth/claim check lives here, not in LifeEventPage -- defense in depth,
 * this app validates its own claim independently rather than assuming
 * "the shell let me navigate here, so I'm authorized" (see CLAUDE.md's
 * "Security: defense in depth" section).
 *
 * Looks up the requested life event in this app's own in-code registry
 * (definitions/index.ts) and renders its CMS-driven intro block plus its
 * schema-driven sections via LifeEventPage -- the kit's individual
 * section renderers self-serve their own translations, so this component
 * only needs its own `auth.signInRequired` chrome string.
 */
export function App({ lifeEventId = 'job-loss' }: AppProps) {
  const [hasAccess, setHasAccess] = useState(() => hasClaim(getStoredSession(), CLAIM_LIFE_EVENTS));
  const [contentClient, setContentClient] = useState<ContentClient | null>(null);
  const [intro, setIntro] = useState<PageContent | null>(null);
  const [introLoadError, setIntroLoadError] = useState(false);
  const locale = useLocale();
  const { t } = useTranslations(assetBaseUrl, locale);
  const definition = getLifeEventDefinition(lifeEventId);

  useEffect(() => onSessionChange((session) => setHasAccess(hasClaim(session, CLAIM_LIFE_EVENTS))), []);

  useEffect(() => {
    let cancelled = false;
    loadRuntimeConfig(assetBaseUrl).then((runtimeConfig) => {
      if (!cancelled) {
        setContentClient(createContentClient(runtimeConfig.strapiBaseUrl));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // CMS content (unlike the i18n chrome text above) isn't reactive by
  // default, so this app explicitly re-fetches whenever the cross-remote
  // active locale changes -- same pattern as job-bank's/dashboard's App.
  useEffect(() => {
    if (!contentClient || !definition) {
      return;
    }
    let cancelled = false;
    contentClient
      .getPageContent(definition.introContentKey, locale === 'fr' ? 'fr' : 'en')
      .then((content) => {
        if (!cancelled) {
          setIntro(content);
          setIntroLoadError(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load life-event intro content', err);
        if (!cancelled) {
          setIntroLoadError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [contentClient, definition, locale]);

  if (!hasAccess) {
    return <p role="alert">{t('auth.signInRequired')}</p>;
  }

  if (!definition) {
    return <p role="alert">Unknown life event: {lifeEventId}</p>;
  }

  return (
    <>
      {intro ? (
        <section>
          <h1>{intro.title}</h1>
          <p>{intro.body}</p>
        </section>
      ) : introLoadError ? (
        <p role="alert">Page content is temporarily unavailable.</p>
      ) : null}
      <LifeEventPage definition={definition} />
    </>
  );
}
