import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChecklistSection } from './ChecklistSection';

jest.mock('../asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ journey: { markDone: 'Mark as done', completed: 'Completed' } }),
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ChecklistSection', () => {
  it('renders its heading and items', () => {
    const { container } = render(
      <ChecklistSection
        id="section"
        heading={{ en: 'Checklist heading', fr: 'Titre de la liste' }}
        items={[{ id: 'item-1', title: { en: 'Item title', fr: 'Titre de l’élément' }, body: { en: 'Item body', fr: 'Corps' } }]}
      />,
    );

    expect(container.querySelector('scds-checklist')?.getAttribute('checklist-heading')).toBe('Checklist heading');
    expect(container.querySelector('scds-checklist-item')?.getAttribute('item-title')).toBe('Item title');
  });

  it('renders a leadingItem before the mapped items', () => {
    const { container } = render(
      <ChecklistSection
        id="section"
        heading={{ en: 'Heading', fr: 'Titre' }}
        items={[{ id: 'item-1', title: { en: 'Item title', fr: 'Titre' }, body: { en: 'Body', fr: 'Corps' } }]}
        leadingItem={<p>leading content</p>}
      />,
    );

    expect(screen.getByText('leading content')).toBeInTheDocument();
    expect(container.querySelector('scds-checklist-item')?.getAttribute('item-title')).toBe('Item title');
  });

  it('toggles an item to complete when its checkbox is checked', async () => {
    render(
      <ChecklistSection
        id="section"
        heading={{ en: 'Heading', fr: 'Titre' }}
        items={[{ id: 'item-1', title: { en: 'Item title', fr: 'Titre' }, body: { en: 'Body', fr: 'Corps' } }]}
      />,
    );

    await userEvent.click(screen.getByRole('checkbox'));

    expect(await screen.findByText('Completed')).toBeInTheDocument();
  });
});
