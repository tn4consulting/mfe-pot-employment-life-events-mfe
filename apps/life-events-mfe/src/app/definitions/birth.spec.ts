import { BIRTH } from './birth';
import { collectLifeEventDefinitionIssues } from '../kit/validate-life-event-definition';

describe('BIRTH definition', () => {
  it('has no shape issues (non-empty bilingual text, unique ids)', () => {
    expect(collectLifeEventDefinitionIssues(BIRTH)).toEqual([]);
  });
});
