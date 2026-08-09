import type { ReactNode } from 'react';
import type { Locale } from '@tn4consulting/shared-i18n';

/**
 * Static, bilingual, presentation-only content -- there's no upstream
 * owner (CMS or BFF) for this shape of content, it's guided-journey
 * narrative specific to each life event, not test data or a reusable label
 * set. See mfe-pot's own CLAUDE.md ("CMS content scope") for why this
 * stays out of Strapi. Only each life event's hub-tile title/description
 * (shown on the shell's /life-events page) is CMS-driven, via
 * `introContentKey`/`ContentClient` -- see LifeEventDefinition below.
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

/** Self-reported items with no owning app's data behind them. */
export interface ChecklistLifeEventSection {
  kind: 'checklist';
  id: string;
  heading: BilingualText;
  items: StaticChecklistItem[];
  /**
   * An extra checklist item rendered before this section's static items,
   * inside the same list -- lets a widget-backed item (real completion
   * signal from another federated app, e.g. job search) sit inline with a
   * section's otherwise self-reported items. A function, not a plain
   * ReactNode, so a definition module can reference a component without
   * eagerly constructing an element at module-eval time.
   */
  leadingItem?: () => ReactNode;
}

/** A flat list of links out to other services, rendered as link cards. */
export interface LinksLifeEventSection {
  kind: 'links';
  id: string;
  heading: BilingualText;
  links: ServiceLink[];
}

/** A cross-remote widget, loaded host-mediated via `useWidgetLoader`. */
export interface WidgetLifeEventSection {
  kind: 'widget';
  id: string;
  widgetId: string;
  heading?: BilingualText;
}

/**
 * The escape hatch: a life event with good reason to diverge from the
 * checklist/links/widget shapes (e.g. a multi-step wizard for disability)
 * supplies its own render function instead of being forced into one of the
 * standard section kinds.
 */
export interface CustomLifeEventSection {
  kind: 'custom';
  id: string;
  render: () => ReactNode;
}

export type LifeEventSection =
  | ChecklistLifeEventSection
  | LinksLifeEventSection
  | WidgetLifeEventSection
  | CustomLifeEventSection;

export interface LifeEventDefinition {
  /** e.g. 'job-loss' | 'birth' | 'death' | 'disability' | 'caregiving'. Matches the shell's /life-events/:lifeEventId param and the CMS hub-tile key prefix. */
  id: string;
  /** CMS content key for this life event's own intro block, e.g. 'life-events.birth.intro'. */
  introContentKey: string;
  sections: LifeEventSection[];
}
