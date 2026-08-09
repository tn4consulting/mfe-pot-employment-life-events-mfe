import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DisabilityApplicationStepper } from './DisabilityApplicationStepper';

describe('DisabilityApplicationStepper', () => {
  it('starts on step 1 with Back disabled', () => {
    render(<DisabilityApplicationStepper />);

    expect(screen.getByText('Confirm your eligibility')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  });

  it('advances to the next step and back again', async () => {
    render(<DisabilityApplicationStepper />);

    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Gather your medical documents')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText('Confirm your eligibility')).toBeInTheDocument();
  });

  it('disables Next on the final step', async () => {
    render(<DisabilityApplicationStepper />);

    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Submit your application')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
});
