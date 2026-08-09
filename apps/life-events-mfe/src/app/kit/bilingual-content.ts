import type { Locale } from '@tn4consulting/shared-i18n';

/**
 * Static, bilingual, presentation-only content -- used directly (not via
 * i18n keys) by the handful of kit/page pieces still authoring literal
 * text: `WidgetSlot`'s `heading` prop and `DisabilityApplicationStepper`'s
 * own steps. Checklist and service-link content moved to
 * `public/assets/i18n/{en,fr}.json` i18n keys instead (see
 * `ChecklistItem`/`ServiceLink`); each life event's own hub-tile
 * title/description (shown on the shell's /life-events page) is
 * CMS-driven, via its own CMS intro key -- see kit/LifeEventLayout.tsx.
 */
export interface BilingualText {
  en: string;
  fr: string;
}

export function text(value: BilingualText, locale: Locale): string {
  return locale === 'fr' ? value.fr : value.en;
}
