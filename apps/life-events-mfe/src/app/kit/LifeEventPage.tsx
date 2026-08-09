import * as React from 'react';
import type { LifeEventDefinition, LifeEventSection } from './life-event-schema';
import { ChecklistSection } from './ChecklistSection';
import { ServiceLinksSection } from './ServiceLinksSection';
import { WidgetSlot } from './WidgetSlot';

/**
 * The consistency engine: dispatches each section of a `LifeEventDefinition`
 * to the matching renderer by `kind`. `kind: 'custom'` is the deliberate
 * escape hatch -- a life event with good reason to diverge (e.g.
 * disability's stepper) supplies its own `render()` and fully opts out of
 * the schema for that section, without needing a different page component.
 * Adding a new life event should only ever mean adding a new
 * `definitions/<id>.ts` file, never touching this file.
 */
export function LifeEventPage({ definition }: { definition: LifeEventDefinition }) {
  return (
    <>
      {definition.sections.map((section) => (
        <LifeEventSectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
}

function LifeEventSectionRenderer({ section }: { section: LifeEventSection }) {
  switch (section.kind) {
    case 'checklist':
      return <ChecklistSection section={section} />;
    case 'links':
      return <ServiceLinksSection section={section} />;
    case 'widget':
      return <WidgetSlot widgetId={section.widgetId} heading={section.heading} />;
    case 'custom':
      return <>{section.render()}</>;
  }
}
