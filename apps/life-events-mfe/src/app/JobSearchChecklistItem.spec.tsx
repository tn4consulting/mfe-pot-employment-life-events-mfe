import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { RemoteModuleLoaderContext, WidgetRegistryContext } from '@tn4consulting/shared-federation-runtime';
import { JobSearchChecklistItem } from './JobSearchChecklistItem';

jest.mock('./asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

interface FakeWidgetProps {
  onApplicationsLoaded?: (applications: unknown[]) => void;
}

function makeFakeWidget(applications: unknown[]) {
  return function FakeWidget({ onApplicationsLoaded }: FakeWidgetProps) {
    React.useEffect(() => {
      onApplicationsLoaded?.(applications);
    }, [onApplicationsLoaded]);
    return <p>fake job applications widget</p>;
  };
}

const REGISTRY = {
  'job-applications': { remoteName: 'job-bank-mfe', exposedModule: './JobApplicationsWidget', exportName: 'JobApplicationsList' },
};

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () =>
      Promise.resolve({
        journey: {
          markDone: 'Mark as done',
          completed: 'Completed',
          status: 'View status',
          widgetUnavailable: 'This widget is temporarily unavailable.',
          jobSearch: {
            title: 'Search and apply for jobs on Job Bank',
            body: 'Browse job postings that match your skills.',
            action: 'Search Job Bank',
          },
        },
      }),
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

function renderWithRegistry(applications: unknown[] | 'reject') {
  const loadRemoteModule =
    applications === 'reject'
      ? jest.fn().mockRejectedValue(new Error('load failed'))
      : jest.fn().mockResolvedValue({ JobApplicationsList: makeFakeWidget(applications) });

  return render(
    <RemoteModuleLoaderContext.Provider value={loadRemoteModule}>
      <WidgetRegistryContext.Provider value={REGISTRY}>
        <ul>
          <JobSearchChecklistItem />
        </ul>
      </WidgetRegistryContext.Provider>
    </RemoteModuleLoaderContext.Provider>,
  );
}

describe('JobSearchChecklistItem', () => {
  it('shows the action link, not the status link, while there are no real applications on file', async () => {
    renderWithRegistry([]);

    // scds-link's slotted label text stays in the light DOM regardless of
    // whether the real Stencil custom element is registered/hydrated (see
    // App.spec.tsx's own convention) -- but its `role="link"` inference
    // does require real hydration jsdom doesn't do here, so this asserts
    // on the text itself rather than the role.
    expect(await screen.findByText('Search Job Bank')).toBeInTheDocument();
    expect(screen.queryByText('View status')).not.toBeInTheDocument();
  });

  it('marks the item complete and swaps to job-bank’s own status once a real application is on file', async () => {
    renderWithRegistry([{ id: 'app-1' }]);

    expect(await screen.findByText('View status')).toBeInTheDocument();
    expect(await screen.findByText('fake job applications widget')).toBeInTheDocument();
  });

  it('shows the degraded state when job-bank’s widget fails to load', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    renderWithRegistry('reject');

    expect(await screen.findByRole('alert')).toHaveTextContent('This widget is temporarily unavailable.');
  });
});
