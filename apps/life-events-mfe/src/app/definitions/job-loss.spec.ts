// job-loss.ts pulls in JobSearchChecklistItem/EiChecklistItems (its
// leadingItem/custom-section escape-hatch components), which import
// asset-base-url.ts -- `import.meta.url` is a syntax construct ts-jest
// can't downlevel to CommonJS, so it needs mocking even though this spec
// never exercises translations itself. See asset-base-url.ts's own doc
// comment.
jest.mock('../asset-base-url', () => ({ assetBaseUrl: 'http://localhost:4202/' }));

import { JOB_LOSS } from './job-loss';
import { collectLifeEventDefinitionIssues } from '../kit/validate-life-event-definition';

describe('JOB_LOSS definition', () => {
  it('has no shape issues (non-empty bilingual text, unique ids)', () => {
    expect(collectLifeEventDefinitionIssues(JOB_LOSS)).toEqual([]);
  });
});
