import * as React from 'react';
import { render, screen } from '@testing-library/react';
import type { ContentClient } from '@tn4consulting/shared-content-client';
import { LifeEventLayout } from './LifeEventLayout';

jest.mock('../asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ errors: { contentUnavailable: 'Content is temporarily unavailable.' } }),
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

function fakeContentClient(getPageContent: ContentClient['getPageContent']): ContentClient {
  return { getPageContent };
}

describe('LifeEventLayout', () => {
  it('renders children immediately, even before the intro resolves', () => {
    const contentClient = fakeContentClient(() => new Promise(() => undefined));
    render(
      <LifeEventLayout lifeEventId="job-loss" contentClient={contentClient}>
        <p>page body</p>
      </LifeEventLayout>,
    );

    expect(screen.getByText('page body')).toBeInTheDocument();
  });

  it('renders children when contentClient is still null (not yet bootstrapped)', () => {
    render(
      <LifeEventLayout lifeEventId="job-loss" contentClient={null}>
        <p>page body</p>
      </LifeEventLayout>,
    );

    expect(screen.getByText('page body')).toBeInTheDocument();
  });

  it('fetches and renders the intro block keyed by life-events.<id>.intro', async () => {
    const getPageContent = jest.fn().mockResolvedValue({ key: 'life-events.job-loss.intro', title: 'Intro title', body: 'Intro body' });
    render(
      <LifeEventLayout lifeEventId="job-loss" contentClient={fakeContentClient(getPageContent)}>
        <p>page body</p>
      </LifeEventLayout>,
    );

    expect(await screen.findByRole('heading', { name: 'Intro title' })).toBeInTheDocument();
    expect(screen.getByText('Intro body')).toBeInTheDocument();
    expect(getPageContent).toHaveBeenCalledWith('life-events.job-loss.intro', 'en');
  });

  it('renders the error fallback when the intro fetch rejects', async () => {
    const getPageContent = jest.fn().mockRejectedValue(new Error('boom'));
    render(
      <LifeEventLayout lifeEventId="job-loss" contentClient={fakeContentClient(getPageContent)}>
        <p>page body</p>
      </LifeEventLayout>,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('Content is temporarily unavailable.');
    expect(screen.getByText('page body')).toBeInTheDocument();
  });
});
