import type { ComponentType } from 'react';
import Blocks from './Blocks';
import Covers from './Covers';
import Strip from './Strip';
import Stack from './Stack';
import List from './List';
import Grid from './Grid';
import Numbers from './Numbers';
import Tabs from './Tabs';
import Filmstrip from './Filmstrip';
import Magazine from './Magazine';

/** Work layout variants by registry id. */
export const WORK: Record<string, ComponentType> = {
  blocks: Blocks,
  covers: Covers,
  strip: Strip,
  stack: Stack,
  list: List,
  grid: Grid,
  numbers: Numbers,
  tabs: Tabs,
  filmstrip: Filmstrip,
  magazine: Magazine,
};
