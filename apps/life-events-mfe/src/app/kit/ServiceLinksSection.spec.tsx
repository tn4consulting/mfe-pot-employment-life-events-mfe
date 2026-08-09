import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ServiceLinksSection } from './ServiceLinksSection';

jest.mock('../asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ journey: { heading: 'Links heading' } }),
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ServiceLinksSection', () => {
  it('renders its translated heading and children', async () => {
    render(
      <ServiceLinksSection headingKey="journey.heading">
        <p>child content</p>
      </ServiceLinksSection>,
    );

    expect(await screen.findByRole('heading', { name: 'Links heading' })).toBeInTheDocument();
    expect(screen.getByText('child content')).toBeInTheDocument();
  });
});
