import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ChecklistSection } from './ChecklistSection';

jest.mock('../asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ journey: { heading: 'Checklist heading' } }),
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ChecklistSection', () => {
  it('renders its translated heading and children', async () => {
    const { container } = render(
      <ChecklistSection headingKey="journey.heading">
        <p>child content</p>
      </ChecklistSection>,
    );

    await waitFor(() => expect(container.querySelector('scds-checklist')?.getAttribute('checklist-heading')).toBe('Checklist heading'));
    expect(screen.getByText('child content')).toBeInTheDocument();
  });
});
