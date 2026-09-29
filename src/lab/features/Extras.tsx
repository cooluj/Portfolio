import { useLab } from '../LabContext';
import Palette from './Palette';
import Shortcuts from './Shortcuts';
import Inspect from './Inspect';
import Konami from './Konami';
import TabTitle from './TabTitle';
import Progress from './Progress';
import Greeting from './Greeting';
import Print from './Print';
import Shuffle from './Shuffle';
import Clock from './Clock';
import Sounds from './Sounds';
import Grid, { GridOverlay } from './Grid';

/** Feature toggles (data-l-features). Each one mounts only while it is switched on, so nothing runs otherwise. */
export default function LabExtras() {
  const { has } = useLab();
  return (
    <>
      {has('palette') && <Palette />}
      {has('shortcuts') && <Shortcuts />}
      {has('inspect') && <Inspect />}
      {has('konami') && <Konami />}
      {has('tabtitle') && <TabTitle />}
      {has('progress') && <Progress />}
      {has('greeting') && <Greeting />}
      {has('print') && <Print />}
      {has('clock') && <Clock />}
      {has('shuffle') && <Shuffle />}
      {has('sounds') && <Sounds />}
      {has('grid') && <Grid />}
      {(has('grid') || has('inspect')) && <GridOverlay />}
    </>
  );
}
