import { EMAIL, RESUME } from './util';

/** Print-only masthead so the home page reads as a one-page resume. Hidden on screen; see features.css. */
export default function Print() {
  return (
    <div className="ft-print-head" aria-hidden="true">
      <p className="ft-print-name">Ujjawal Agrawal</p>
      <p className="ft-print-role">Product designer who writes the front-end. Seattle. HCDE at the University of Washington, class of 2027.</p>
      <p className="ft-print-links">
        <span>{EMAIL}</span>
        <span>linkedin.com/in/ujjawal-agrawal</span>
        <span>github.com/cooluj</span>
        <span>{`${location.origin}${RESUME}`}</span>
      </p>
    </div>
  );
}
