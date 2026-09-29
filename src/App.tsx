import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Eventully from './pages/Eventully';
import Superpowr from './pages/Superpowr';
import PainSights from './pages/PainSights';
import Lab from './pages/Lab';

function NotFound() {
  const { pathname } = useLocation();
  return (
    <section className="cs gutter" style={{ minHeight: '70vh' }}>
      <h1 className="cs-title">Not here</h1>
      <p className="cs-lede">That page doesn't exist.</p>
      <p className="mono-label nf-path">Nothing at <code>{pathname}</code></p>
      <Link to="/" className="cs-back" style={{ marginTop: '2rem' }} data-cursor="Home">&larr; Back home</Link>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="work/eventully" element={<Eventully />} />
        <Route path="work/superpowr" element={<Superpowr />} />
        <Route path="work/painsights" element={<PainSights />} />
        <Route path="lab" element={<Lab />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
