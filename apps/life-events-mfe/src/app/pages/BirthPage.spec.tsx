import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { BirthPage } from './BirthPage';

jest.mock('../asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ journey: { markDone: 'Mark as done', completed: 'Completed' } }),
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('BirthPage', () => {
  it('renders its checklist and links (the pure-composition case, no widgets or bespoke components)', async () => {
    const { container } = render(<BirthPage lifeEventId="birth" contentClient={null} />);

    await screen.findByRole('heading', { name: 'Other services that may help' });

    const checklistHeadings = Array.from(container.querySelectorAll('scds-checklist')).map((el) => el.getAttribute('checklist-heading'));
    expect(checklistHeadings).toContain('Steps to take after your baby is born');

    const itemTitles = Array.from(container.querySelectorAll('scds-checklist-item')).map((el) => el.getAttribute('item-title'));
    expect(itemTitles).toContain('Register the birth');

    const card = container.querySelector('scds-card');
    expect(card?.getAttribute('card-title')).toBe('Canada Child Benefit (CCB)');
  });
});
