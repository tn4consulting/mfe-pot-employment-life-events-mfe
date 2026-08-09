import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { RemoteModuleLoaderContext, WidgetRegistryContext } from '@tn4consulting/shared-federation-runtime';
import { LifeEventPage } from './LifeEventPage';
import type { LifeEventDefinition } from './life-event-schema';

jest.mock('../asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () =>
      Promise.resolve({
        journey: { markDone: 'Mark as done', completed: 'Completed', widgetUnavailable: 'This widget is temporarily unavailable.' },
      }),
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

/**
 * One fixture definition exercising all four section kinds -- proves the
 * dispatcher wires each kind to the right renderer, independent of any
 * real life event's own content (see definitions/job-loss.spec.ts for
 * shape validation of the real definitions).
 */
const FIXTURE: LifeEventDefinition = {
  id: 'fixture',
  introContentKey: 'life-events.fixture.intro',
  sections: [
    {
      kind: 'checklist',
      id: 'checklist-section',
      heading: { en: 'Checklist heading', fr: 'Titre de la liste' },
      items: [{ id: 'item-1', title: { en: 'Item title', fr: 'Titre de l’élément' }, body: { en: 'Item body', fr: 'Corps de l’élément' } }],
    },
    {
      kind: 'links',
      id: 'links-section',
      heading: { en: 'Links heading', fr: 'Titre des liens' },
      links: [{ id: 'link-1', title: { en: 'Link title', fr: 'Titre du lien' }, href: '/somewhere' }],
    },
    {
      kind: 'widget',
      id: 'widget-section',
      widgetId: 'fixture-widget',
      heading: { en: 'Widget heading', fr: 'Titre du widget' },
    },
    {
      kind: 'custom',
      id: 'custom-section',
      render: () => <p>custom section content</p>,
    },
  ],
};

describe('LifeEventPage', () => {
  it('dispatches every section kind to its matching renderer', async () => {
    const { container } = render(
      <RemoteModuleLoaderContext.Provider value={jest.fn().mockRejectedValue(new Error('no widget in this test'))}>
        <WidgetRegistryContext.Provider value={{}}>
          <LifeEventPage definition={FIXTURE} />
        </WidgetRegistryContext.Provider>
      </RemoteModuleLoaderContext.Provider>,
    );

    // checklist
    expect(container.querySelector('scds-checklist')?.getAttribute('checklist-heading')).toBe('Checklist heading');
    expect(container.querySelector('scds-checklist-item')?.getAttribute('item-title')).toBe('Item title');

    // links
    expect(screen.getByRole('heading', { name: 'Links heading' })).toBeInTheDocument();
    expect(container.querySelector('scds-card')?.getAttribute('card-title')).toBe('Link title');
    expect(container.querySelector('scds-card')?.getAttribute('href')).toBe('/somewhere');

    // widget (no registry entry for 'fixture-widget' -> degrades to unavailable)
    expect(screen.getByRole('heading', { name: 'Widget heading' })).toBeInTheDocument();
    expect(await screen.findByText('This widget is temporarily unavailable.')).toBeInTheDocument();

    // custom escape hatch
    expect(screen.getByText('custom section content')).toBeInTheDocument();
  });
});
