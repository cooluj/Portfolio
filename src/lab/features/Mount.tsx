import LabCursor from './Cursor';
import LabExtras from './Extras';

/** Mounted once in Layout; each piece decides for itself whether it is switched on. */
export default function LabMount() {
  return (
    <>
      <LabCursor />
      <LabExtras />
    </>
  );
}
