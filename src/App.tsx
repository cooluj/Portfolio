import { Link, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Eventully from './pages/Eventully';
import Superpowr from './pages/Superpowr';
import PainSights from './pages/PainSights';

function NotFound() {
  return (
    <section className="cs gutter" style={{ minHeight: '70vh' }}>
      <h1 className="cs-title">Not here</h1>
      <p className="cs-lede">That page doesn't exist.</p>
      <Link to="/" className="cs-back" style={{ marginTop: '2rem' }}>&larr; Back home</Link>
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
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
