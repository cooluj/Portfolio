import { createPortal } from 'react-dom';
import { useLab } from '../LabContext';
import { useFootSlot } from './util';

/** A Shuffle button in the footer: every visit could look different. */
export default function Shuffle() {
  const lab = useLab();
  const slot = useFootSlot();
  if (!slot) return null;
  return createPortal(
    <button type="button" className="ctl ft-shuffle" onClick={lab.shuffle} title="Randomise every dimension of the lab">
      Shuffle
    </button>,
    slot,
  );
}
