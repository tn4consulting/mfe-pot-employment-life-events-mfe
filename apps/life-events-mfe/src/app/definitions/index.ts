import type { LifeEventDefinition } from '../kit/life-event-schema';
import { JOB_LOSS } from './job-loss';
import { BIRTH } from './birth';
import { DISABILITY } from './disability';

/**
 * The actual authoring surface the whole kit exists for: adding a 6th life
 * event should mean adding one new `definitions/<id>.ts` file and one line
 * here, nothing else in this app and no change to the shell beyond its own
 * hub-tile CMS content and (if it embeds a not-yet-registered widget) the
 * shell's widget registry. `birth`/`disability` prove the easy and hard
 * ends of that claim -- `death`/`caregiving` follow the same shape.
 */
export const LIFE_EVENT_DEFINITIONS: Record<string, LifeEventDefinition> = {
  [JOB_LOSS.id]: JOB_LOSS,
  [BIRTH.id]: BIRTH,
  [DISABILITY.id]: DISABILITY,
};

export function getLifeEventDefinition(lifeEventId: string): LifeEventDefinition | undefined {
  return LIFE_EVENT_DEFINITIONS[lifeEventId];
}
