import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChecklistItem } from './ChecklistItem';

jest.mock('../asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () =>
      Promise.resolve({
        journey: {
          markDone: 'Mark as done',
          completed: 'Completed',
          title: 'Item title',
          body: 'Item body',
          linkLabel: 'Go there',
        },
      }),
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ChecklistItem', () => {
  it('renders its translated title and body', async () => {
    const { container } = render(<ChecklistItem id="item-1" titleKey="journey.title" bodyKey="journey.body" />);

    await waitFor(() => expect(container.querySelector('scds-checklist-item')?.getAttribute('item-title')).toBe('Item title'));
    expect(container.querySelector('scds-checklist-item')?.getAttribute('description')).toBe('Item body');
  });

  it('renders a link when linkHref and linkLabelKey are both present', async () => {
    render(
      <ChecklistItem
        id="item-1"
        titleKey="journey.title"
        bodyKey="journey.body"
        linkHref="/somewhere"
        linkLabelKey="journey.linkLabel"
      />,
    );

    expect(await screen.findByText('Go there')).toBeInTheDocument();
  });

  it('omits the link when linkLabelKey is missing', () => {
    render(<ChecklistItem id="item-1" titleKey="journey.title" bodyKey="journey.body" linkHref="/somewhere" />);

    expect(screen.queryByText('Go there')).not.toBeInTheDocument();
  });

  it('toggles to complete when its checkbox is checked', async () => {
    render(<ChecklistItem id="item-1" titleKey="journey.title" bodyKey="journey.body" />);

    await userEvent.click(screen.getByRole('checkbox'));

    expect(await screen.findByText('Completed')).toBeInTheDocument();
  });
});
