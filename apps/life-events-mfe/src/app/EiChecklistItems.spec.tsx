import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { RemoteModuleLoaderContext, WidgetRegistryContext } from '@tn4consulting/shared-federation-runtime';
import { EiChecklistItems } from './EiChecklistItems';

jest.mock('./asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

type FakeStatus = { status: 'not_yet_due' | 'due_soon' | 'overdue' } | null;

interface FakeWidgetProps {
  onStatusLoaded?: (status: FakeStatus) => void;
}

function makeFakeWidget(status: FakeStatus) {
  return function FakeWidget({ onStatusLoaded }: FakeWidgetProps) {
    React.useEffect(() => {
      onStatusLoaded?.(status);
    }, [onStatusLoaded]);
    return <p>fake reporting status widget</p>;
  };
}

const REGISTRY = {
  'ei-reporting-status': {
    remoteName: 'employment-insurance-mfe',
    exposedModule: './EiReportingStatusWidget',
    exportName: 'ReportingStatus',
  },
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
          eiHeading: 'Apply for EI and keep up with reporting',
          eiApply: { title: 'Apply for Employment Insurance', body: 'Apply as soon as you stop working.', action: 'Apply for EI' },
          eiReport: { title: 'Submit your EI report', body: 'Report every two weeks.', action: 'Submit your report' },
        },
      }),
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

function renderWithRegistry(status: FakeStatus | 'reject') {
  const loadRemoteModule =
    status === 'reject'
      ? jest.fn().mockRejectedValue(new Error('load failed'))
      : jest.fn().mockResolvedValue({ ReportingStatus: makeFakeWidget(status) });

  return render(
    <RemoteModuleLoaderContext.Provider value={loadRemoteModule}>
      <WidgetRegistryContext.Provider value={REGISTRY}>
        <EiChecklistItems />
      </WidgetRegistryContext.Provider>
    </RemoteModuleLoaderContext.Provider>,
  );
}

describe('EiChecklistItems', () => {
  it('shows both action links, neither complete, when there is no claim on file', async () => {
    renderWithRegistry(null);

    // scds-link's slotted label text stays in the light DOM regardless of
    // whether the real Stencil custom element is registered/hydrated -- but
    // its `role="link"` inference does require real hydration jsdom
    // doesn't do here, so this asserts on the text itself rather than the
    // role.
    expect(await screen.findByText('Apply for EI')).toBeInTheDocument();
    expect(screen.getByText('Submit your report')).toBeInTheDocument();
    expect(screen.queryByText('View status')).not.toBeInTheDocument();
  });

  it('marks both apply and report complete once a claim exists and reporting is up to date', async () => {
    renderWithRegistry({ status: 'not_yet_due' });

    expect(await screen.findAllByText('View status')).toHaveLength(2);
  });

  it('marks apply complete but keeps report open when a report is due soon or overdue', async () => {
    renderWithRegistry({ status: 'overdue' });

    expect(await screen.findByText('View status')).toBeInTheDocument();
    expect(screen.getByText('Submit your report')).toBeInTheDocument();
  });

  it('shows the degraded state when the reporting-status widget fails to load', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    renderWithRegistry('reject');

    expect(await screen.findByRole('alert')).toHaveTextContent('This widget is temporarily unavailable.');
  });
});
