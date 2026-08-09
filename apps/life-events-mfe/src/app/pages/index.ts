import { jobLossPage } from './JobLossPage';
import { birthPage } from './BirthPage';
import { disabilityPage } from './DisabilityPage';
import type { LifeEventPageComponent, LifeEventPageModule } from './types';

/**
 * Builds the id -> component map, throwing at construction (module load)
 * time on a duplicate id -- the one bug class worth guarding against now
 * that there's no schema left to validate. Exported separately from the
 * real registry so pages/index.spec.ts can exercise the duplicate-id
 * failure mode with a synthetic fixture, without needing an actual
 * duplicate page file to exist in the app.
 */
export function buildLifeEventPageRegistry(modules: LifeEventPageModule[]): Map<string, LifeEventPageComponent> {
  const registry = new Map<string, LifeEventPageComponent>();
  for (const { id, Component } of modules) {
    if (registry.has(id)) {
      throw new Error(`Duplicate life event id in page registry: "${id}"`);
    }
    registry.set(id, Component);
  }
  return registry;
}

/**
 * The actual authoring surface the whole kit exists for: adding a 4th
 * life event should mean adding one new `pages/<Id>Page.tsx` and one line
 * here, nothing else in this app and no change to the shell beyond its
 * own hub-tile CMS content and (if it embeds a not-yet-registered widget)
 * the shell's widget registry.
 */
const PAGES: LifeEventPageModule[] = [jobLossPage, birthPage, disabilityPage];

export const LIFE_EVENT_PAGES = buildLifeEventPageRegistry(PAGES);

export function getLifeEventPage(lifeEventId: string): LifeEventPageComponent | undefined {
  return LIFE_EVENT_PAGES.get(lifeEventId);
}
