import type { BilingualText, LifeEventDefinition } from './life-event-schema';

/**
 * Cheap, generic shape check every `definitions/<id>.ts` file runs against
 * itself in its own spec -- this is what makes adding a 6th life event
 * cheap to test, not just cheap to author: one shared assertion helper
 * instead of a bespoke test per definition.
 */
export function collectLifeEventDefinitionIssues(definition: LifeEventDefinition): string[] {
  const issues: string[] = [];

  function checkBilingual(label: string, value: BilingualText | undefined) {
    if (!value) {
      return;
    }
    if (!value.en.trim()) {
      issues.push(`${label}: empty "en" text`);
    }
    if (!value.fr.trim()) {
      issues.push(`${label}: empty "fr" text`);
    }
  }

  if (!definition.id.trim()) {
    issues.push('definition.id is empty');
  }
  if (!definition.introContentKey.trim()) {
    issues.push('definition.introContentKey is empty');
  }

  const sectionIds = new Set<string>();
  for (const section of definition.sections) {
    if (sectionIds.has(section.id)) {
      issues.push(`duplicate section id: ${section.id}`);
    }
    sectionIds.add(section.id);

    if (section.kind === 'checklist') {
      checkBilingual(`section "${section.id}" heading`, section.heading);
      const itemIds = new Set<string>();
      for (const item of section.items) {
        if (itemIds.has(item.id)) {
          issues.push(`section "${section.id}": duplicate item id ${item.id}`);
        }
        itemIds.add(item.id);
        checkBilingual(`section "${section.id}" item "${item.id}" title`, item.title);
        checkBilingual(`section "${section.id}" item "${item.id}" body`, item.body);
      }
    } else if (section.kind === 'links') {
      checkBilingual(`section "${section.id}" heading`, section.heading);
      const linkIds = new Set<string>();
      for (const link of section.links) {
        if (linkIds.has(link.id)) {
          issues.push(`section "${section.id}": duplicate link id ${link.id}`);
        }
        linkIds.add(link.id);
        checkBilingual(`section "${section.id}" link "${link.id}" title`, link.title);
        if (!link.href.trim()) {
          issues.push(`section "${section.id}" link "${link.id}": empty href`);
        }
      }
    } else if (section.kind === 'widget') {
      checkBilingual(`section "${section.id}" heading`, section.heading);
      if (!section.widgetId.trim()) {
        issues.push(`section "${section.id}": empty widgetId`);
      }
    }
  }

  return issues;
}
