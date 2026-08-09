import {
  ContentClient,
  FallbackContentClient,
  StaticContentClient,
  StrapiContentClient,
} from '@tn4consulting/shared-content-client';

/**
 * No CMS configured -> the bilingual fallback (`public/assets/content-fallback/<locale>.json`)
 * directly. CMS configured -> Strapi as primary, same fallback backing it up
 * if Strapi is unreachable/missing a key at runtime -- see `FallbackContentClient`.
 * One entry per life event's own `introContentKey` (see definitions/*.ts)
 * lives in the fallback JSON -- adding a new life event means adding its
 * intro copy there too, alongside its own definitions/<id>.ts file.
 */
export function createContentClient(strapiBaseUrl: string | undefined, assetBaseUrl: string): ContentClient {
  const fallback = new StaticContentClient(assetBaseUrl);
  return strapiBaseUrl ? new FallbackContentClient(new StrapiContentClient(strapiBaseUrl), fallback) : fallback;
}
