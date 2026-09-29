import type { ComponentType } from 'react';
import Blocks from './Blocks';

/** Work layout variants by registry id. The work agent adds the rest. */
export const WORK: Record<string, ComponentType> = {
  blocks: Blocks,
};
