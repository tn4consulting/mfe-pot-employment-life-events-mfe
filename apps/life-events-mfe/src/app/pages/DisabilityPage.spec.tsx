import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { DisabilityPage } from './DisabilityPage';

jest.mock('../asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve({}) }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('DisabilityPage', () => {
  it('renders the DisabilityApplicationStepper directly, plus its links section', () => {
    const { container } = render(<DisabilityPage lifeEventId="disability" contentClient={null} />);

    expect(screen.getByRole('heading', { name: 'Applying for disability benefits' })).toBeInTheDocument();
    expect(screen.getByText('Confirm your eligibility')).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Other services that may help' })).toBeInTheDocument();
    const card = container.querySelector('scds-card');
    expect(card?.getAttribute('card-title')).toBe('Canadian Dental Care Plan (CDCP)');
  });
});
