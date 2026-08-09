import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { clearSession, createMockSession, storeSession } from '@tn4consulting/shared-auth/core';
import { App } from './App';

jest.mock('./asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

jest.mock('../runtime-config', () => ({
  loadRuntimeConfig: jest.fn().mockResolvedValue({ strapiBaseUrl: undefined }),
}));

const getPageContentMock = jest.fn();
jest.mock('./content-client', () => ({
  createContentClient: () => ({ getPageContent: getPageContentMock }),
}));

describe('App', () => {
  beforeEach(() => {
    getPageContentMock.mockReset().mockResolvedValue(null);
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          journey: {
            widgetUnavailable: 'This widget is temporarily unavailable.',
            markDone: 'Mark as done',
            completed: 'Completed',
            status: 'View status',
            eiHeading: 'Apply for EI and keep up with reporting',
            jobSearch: { title: 'Search and apply for jobs on Job Bank', body: 'Browse job postings.', action: 'Search Job Bank' },
            eiApply: { title: 'Apply for Employment Insurance', body: 'Apply as soon as you stop working.', action: 'Apply for EI' },
            eiReport: { title: 'Submit your EI report', body: 'Report every two weeks.', action: 'Submit your report' },
          },
          auth: { signInRequired: 'You need to sign in to view your guided journey.' },
        }),
    }) as jest.Mock;
  });

  afterEach(() => {
    clearSession();
    jest.restoreAllMocks();
  });

  it('renders the guided journey when the claim is present', async () => {
    storeSession(createMockSession());
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Your payments at a glance' })).toBeInTheDocument();
  });

  it('renders intro content fetched via ContentClient', async () => {
    storeSession(createMockSession());
    getPageContentMock.mockResolvedValue({
      key: 'life-events.job-loss.intro',
      title: "You lost your job — here's what to do next",
      body: 'Guidance on CVs, job search, and Employment Insurance.',
    });

    render(<App />);

    expect(
      await screen.findByRole('heading', { name: "You lost your job — here's what to do next" }),
    ).toBeInTheDocument();
  });

  it('renders an alert for an unrecognized life event id', async () => {
    storeSession(createMockSession());
    render(<App lifeEventId="not-a-real-life-event" />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Unknown life event');
  });

  it('renders the birth life event (proof: pure checklist + links, no shell/kit changes needed)', async () => {
    storeSession(createMockSession());
    const { container } = render(<App lifeEventId="birth" />);

    // checklist-heading/item-title are attributes passed to
    // scds-checklist/scds-checklist-item, not light-DOM text -- see
    // this app's own convention (job-loss's prior GuidedJourney.spec.tsx)
    // for why this asserts on the attribute directly.
    await screen.findByRole('heading', { name: 'Other services that may help' });
    const checklistHeadings = Array.from(container.querySelectorAll('scds-checklist')).map((el) =>
      el.getAttribute('checklist-heading'),
    );
    expect(checklistHeadings).toContain('Steps to take after your baby is born');
    const itemTitles = Array.from(container.querySelectorAll('scds-checklist-item')).map((el) =>
      el.getAttribute('item-title'),
    );
    expect(itemTitles).toContain('Register the birth');
  });

  it('renders the disability life event (proof: the kind: "custom" escape hatch)', async () => {
    storeSession(createMockSession());
    render(<App lifeEventId="disability" />);

    expect(await screen.findByRole('heading', { name: 'Applying for disability benefits' })).toBeInTheDocument();
    expect(screen.getByText('Confirm your eligibility')).toBeInTheDocument();
  });

  it('blocks its own content when there is no active session, independent of the shell', async () => {
    clearSession();
    render(<App />);

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('sign in');
    expect(screen.queryByRole('heading', { name: 'Your payments at a glance' })).not.toBeInTheDocument();
  });
});
