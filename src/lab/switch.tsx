import { useLab } from './LabContext';
import { HEROES } from './heroes';
import { WORK } from './work';

export function HeroSwitch() {
  const { sel } = useLab();
  const Hero = HEROES[sel.hero] || HEROES.statement;
  return <Hero />;
}

export function WorkSwitch() {
  const { sel } = useLab();
  const Work = WORK[sel.work] || WORK.blocks;
  return <Work />;
}
