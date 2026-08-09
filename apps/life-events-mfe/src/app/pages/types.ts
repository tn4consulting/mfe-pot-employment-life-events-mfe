import type { ComponentType } from 'react';
import type { ContentClient } from '@tn4consulting/shared-content-client';

export interface LifeEventPageProps {
  lifeEventId: string;
  contentClient: ContentClient | null;
}

export type LifeEventPageComponent = ComponentType<LifeEventPageProps>;

/**
 * One life event's registry entry -- id and component paired at the
 * source (each page module exports its own), so pages/index.ts never has
 * to hand-type a string next to a component and risk them drifting apart.
 */
export interface LifeEventPageModule {
  id: string;
  Component: LifeEventPageComponent;
}
