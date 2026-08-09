jest.mock('../asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

import { buildLifeEventPageRegistry, getLifeEventPage, LIFE_EVENT_PAGES } from './index';
import { JobLossPage } from './JobLossPage';

describe('life event page registry', () => {
  it('registers exactly job-loss, birth, and disability', () => {
    expect([...LIFE_EVENT_PAGES.keys()].sort()).toEqual(['birth', 'disability', 'job-loss']);
  });

  it('looks up a registered page by id', () => {
    expect(getLifeEventPage('job-loss')).toBe(JobLossPage);
  });

  it('returns undefined for an unrecognized id', () => {
    expect(getLifeEventPage('not-a-real-life-event')).toBeUndefined();
  });

  it('throws at construction time on a duplicate id -- the bug class this exists to catch', () => {
    const Dummy = () => null;
    expect(() =>
      buildLifeEventPageRegistry([
        { id: 'dup', Component: Dummy },
        { id: 'dup', Component: Dummy },
      ]),
    ).toThrow(/duplicate/i);
  });
});
