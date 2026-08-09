import { DISABILITY } from './disability';
import { collectLifeEventDefinitionIssues } from '../kit/validate-life-event-definition';

describe('DISABILITY definition', () => {
  it('has no shape issues (non-empty bilingual text, unique ids)', () => {
    expect(collectLifeEventDefinitionIssues(DISABILITY)).toEqual([]);
  });
});
