import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { RemoteModuleLoaderContext, WidgetRegistryContext } from '@tn4consulting/shared-federation-runtime';
import { JobLossPage } from './JobLossPage';

jest.mock('../asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

beforeEach(() => {
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
          jobLoss: {
            departure: {
              heading: 'Steps to take when you leave your job',
              roe: { title: 'Get your Record of Employment (ROE)', body: 'Ask your employer for your ROE.' },
              finalPay: { title: 'Confirm your final pay and vacation pay', body: 'Check your final pay.' },
              benefitsContinuation: { title: 'Ask about continuing your workplace benefits', body: 'Find out about conversion.' },
              returnProperty: { title: 'Return company property', body: 'Return equipment.' },
              reference: { title: 'Ask for a letter of reference', body: 'Request a reference letter.' },
              keepRecords: { title: 'Keep records for your EI application', body: 'Keep your ROE and pay stubs.' },
            },
            employability: {
              heading: 'Make yourself more employable',
              updateCv: { title: 'Update your résumé and LinkedIn profile', body: 'Add your most recent role.' },
              training: { title: 'Look into training and upskilling', body: 'Look for government-funded programs.' },
            },
            benefits: {
              heading: 'Benefits you might now be eligible for',
              taxCredits: { title: 'GST/HST credit and other income-tested benefits', body: 'A lower income could change what you receive.' },
              provincial: { title: 'Provincial or territorial supports', body: 'Check your province.' },
            },
          },
          serviceLinks: {
            heading: 'Other services that may help',
            jobLoss: {
              cdcp: { title: 'Canadian Dental Care Plan (CDCP)', description: 'Losing job-related dental coverage.' },
            },
          },
        },
      }),
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

/**
 * The composite case: 3 ChecklistSection calls (one interleaving a bespoke
 * child), a ServiceLinksSection, EiChecklistItems rendered inline, and a
 * payment-history WidgetSlot -- all as plain JSX in one page, no schema
 * dispatch. No widget registry entries in this test, so every
 * widget-backed piece degrades gracefully to its "unavailable" state,
 * same as JobLossPage's real behaviour without a host.
 */
describe('JobLossPage', () => {
  it('renders every kind of content the page composes', async () => {
    const { container } = render(
      <RemoteModuleLoaderContext.Provider value={jest.fn().mockRejectedValue(new Error('no widget in this test'))}>
        <WidgetRegistryContext.Provider value={{}}>
          <JobLossPage lifeEventId="job-loss" contentClient={null} />
        </WidgetRegistryContext.Provider>
      </RemoteModuleLoaderContext.Provider>,
    );

    expect(await screen.findByRole('heading', { name: 'Other services that may help' })).toBeInTheDocument();
    expect(container.querySelector('scds-card')?.getAttribute('card-title')).toBe('Canadian Dental Care Plan (CDCP)');

    // checklist-heading/item-title are attributes passed to
    // scds-checklist/scds-checklist-item (light-DOM slot content), not
    // rendered text -- assert on the attribute directly, same convention
    // App.spec.tsx's own birth-life-event test uses. All of this content
    // (including the checklist/service-link content, since this repo's
    // 2026-08 kit rework) is translated via t(), so wait for it via
    // findBy* rather than reading synchronously right after render.
    await screen.findByText('Apply for EI');
    const checklistHeadings = Array.from(container.querySelectorAll('scds-checklist')).map((el) => el.getAttribute('checklist-heading'));
    expect(checklistHeadings).toContain('Steps to take when you leave your job');
    expect(checklistHeadings).toContain('Make yourself more employable');
    expect(checklistHeadings).toContain('Benefits you might now be eligible for');
    expect(checklistHeadings).toContain('Apply for EI and keep up with reporting');

    const itemTitles = Array.from(container.querySelectorAll('scds-checklist-item')).map((el) => el.getAttribute('item-title'));
    expect(itemTitles).toContain('Get your Record of Employment (ROE)');
    expect(itemTitles).toContain('Update your résumé and LinkedIn profile');
    expect(itemTitles).toContain('GST/HST credit and other income-tested benefits');

    expect(screen.getByRole('heading', { name: 'Your payments at a glance' })).toBeInTheDocument();
    expect((await screen.findAllByText('This widget is temporarily unavailable.')).length).toBeGreaterThan(0);
  });
});
