import type { ComponentType } from 'react';
import Statement from './Statement';

/** Hero variants by registry id. The hero agent adds the rest. */
export const HEROES: Record<string, ComponentType> = {
  statement: Statement,
};
