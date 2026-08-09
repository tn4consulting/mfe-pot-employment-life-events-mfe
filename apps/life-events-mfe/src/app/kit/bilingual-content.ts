import type { Locale } from '@tn4consulting/shared-i18n';

/**
 * Static, bilingual, presentation-only content -- there's no upstream
 * owner (CMS or BFF) for this shape of content, it's guided-journey
 * narrative specific to each life event, not test data or a reusable label
 * set. See mfe-pot's own CLAUDE.md ("CMS content scope") for why this
 * stays out of Strapi. Only each life event's hub-tile title/description
 * (shown on the shell's /life-events page) is CMS-driven, via its own CMS
 * intro key -- see kit/LifeEventLayout.tsx.
 */
export interface BilingualText {
  en: string;
  fr: string;
}

export function text(value: BilingualText, locale: Locale): string {
  return locale === 'fr' ? value.fr : value.en;
}

export interface StaticChecklistItem {
  id: string;
  title: BilingualText;
  body: BilingualText;
  /** Present only for items that route out to another app's own page. */
  linkHref?: string;
  linkLabel?: BilingualText;
}

export interface ServiceLink {
  id: string;
  title: BilingualText;
  description?: BilingualText;
  href: string;
}
