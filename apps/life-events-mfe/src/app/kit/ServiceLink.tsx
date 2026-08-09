import * as React from 'react';
import { useLocale, useTranslations } from '@tn4consulting/shared-i18n';
import { assetBaseUrl } from '../asset-base-url';

export interface ServiceLinkProps {
  titleKey: string;
  descriptionKey?: string;
  href: string;
}

/**
 * A single service-link card inside a `ServiceLinksSection`'s grid. Self-serves
 * locale/translations, same convention as every other kit component.
 */
export function ServiceLink({ titleKey, descriptionKey, href }: ServiceLinkProps) {
  const locale = useLocale();
  const { t } = useTranslations(assetBaseUrl, locale);

  return (
    <scds-card card-title={t(titleKey)} card-title-tag="h3" description={descriptionKey ? t(descriptionKey) : undefined} href={href} />
  );
}
