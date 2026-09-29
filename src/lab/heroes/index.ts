import type { ComponentType } from 'react';
import Columns from './Columns';
import Covers from './Covers';
import Field from './Field';
import Kinetic from './Kinetic';
import Ledger from './Ledger';
import Nameplate from './Nameplate';
import Split from './Split';
import Statement from './Statement';
import Terminal from './Terminal';
import Toggle from './Toggle';
import Typewriter from './Typewriter';

/** Hero variants by registry id. */
export const HEROES: Record<string, ComponentType> = {
  statement: Statement,
  nameplate: Nameplate,
  split: Split,
  kinetic: Kinetic,
  typewriter: Typewriter,
  field: Field,
  toggle: Toggle,
  covers: Covers,
  columns: Columns,
  terminal: Terminal,
  ledger: Ledger,
};
