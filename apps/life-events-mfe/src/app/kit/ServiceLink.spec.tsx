import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ServiceLink } from './ServiceLink';

jest.mock('../asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ journey: { title: 'Link title', description: 'Link description' } }),
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ServiceLink', () => {
  it('renders a card with its translated title, description, and href', async () => {
    const { container } = render(<ServiceLink titleKey="journey.title" descriptionKey="journey.description" href="/somewhere" />);

    await waitFor(() => expect(container.querySelector('scds-card')?.getAttribute('card-title')).toBe('Link title'));
    const card = container.querySelector('scds-card');
    expect(card?.getAttribute('description')).toBe('Link description');
    expect(card?.getAttribute('href')).toBe('/somewhere');
  });
});
