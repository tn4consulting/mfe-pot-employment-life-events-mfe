import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { RemoteModuleLoaderContext, WidgetRegistryContext, WidgetRegistry } from '@tn4consulting/shared-federation-runtime';
import { WidgetSlot } from './WidgetSlot';

jest.mock('../asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

const REGISTRY: WidgetRegistry = {
  'payment-history': { remoteName: 'dashboard-mfe', exposedModule: './PaymentHistoryWidget', exportName: 'PaymentHistory' },
};

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () =>
      Promise.resolve({
        journey: { widgetUnavailable: 'This widget is temporarily unavailable.', widgetLoading: 'Loading...' },
      }),
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

function FakeWidget() {
  return <p>widget content</p>;
}

describe('WidgetSlot', () => {
  it('shows a loading spinner while the widget is still loading, then swaps to its content', async () => {
    let resolveModule!: (value: { PaymentHistory: typeof FakeWidget }) => void;
    const loadRemoteModuleMock = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveModule = resolve;
        }),
    );

    const { container } = render(
      <RemoteModuleLoaderContext.Provider value={loadRemoteModuleMock}>
        <WidgetRegistryContext.Provider value={REGISTRY}>
          <WidgetSlot widgetId="payment-history" />
        </WidgetRegistryContext.Provider>
      </RemoteModuleLoaderContext.Provider>,
    );

    await waitFor(() => expect(container.querySelector('scds-spinner')?.getAttribute('label')).toBe('Loading...'));

    resolveModule({ PaymentHistory: FakeWidget });

    expect(await screen.findByText('widget content')).toBeInTheDocument();
    expect(container.querySelector('scds-spinner')).not.toBeInTheDocument();
  });

  it('does not show the spinner once the widget has failed to load', async () => {
    const { container } = render(
      <RemoteModuleLoaderContext.Provider value={jest.fn().mockRejectedValue(new Error('unreachable'))}>
        <WidgetRegistryContext.Provider value={REGISTRY}>
          <WidgetSlot widgetId="payment-history" />
        </WidgetRegistryContext.Provider>
      </RemoteModuleLoaderContext.Provider>,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('This widget is temporarily unavailable.');
    expect(container.querySelector('scds-spinner')).not.toBeInTheDocument();
  });
});
