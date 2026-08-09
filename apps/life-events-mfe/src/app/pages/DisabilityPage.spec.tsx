import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { DisabilityPage } from './DisabilityPage';

jest.mock('../asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () =>
      Promise.resolve({
        journey: {
          serviceLinks: {
            heading: 'Other services that may help',
            disability: {
              cdcp: { title: 'Canadian Dental Care Plan (CDCP)', description: 'You may be eligible for the CDCP.' },
              disabilityTaxCredit: { title: 'Disability Tax Credit (DTC)', description: 'A non-refundable tax credit.' },
            },
          },
        },
      }),
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('DisabilityPage', () => {
  it('renders the DisabilityApplicationStepper directly, plus its links section', async () => {
    const { container } = render(<DisabilityPage lifeEventId="disability" contentClient={null} />);

    expect(screen.getByRole('heading', { name: 'Applying for disability benefits' })).toBeInTheDocument();
    expect(screen.getByText('Confirm your eligibility')).toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: 'Other services that may help' })).toBeInTheDocument();
    const card = container.querySelector('scds-card');
    expect(card?.getAttribute('card-title')).toBe('Canadian Dental Care Plan (CDCP)');
  });
});
