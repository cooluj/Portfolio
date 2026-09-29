import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import './reskin.css';
import './case.css';
import './styles/toolkit.css';
import './styles/scatter.css';
import './styles/bodymap.css';
import './styles/stats.css';
import './styles/tilt.css';
import './styles/motion.css';
import './styles/superpowr.css';
import './styles/caseshell.css';

// Hash routing only for the single-file preview build, where there is no server to rewrite paths.
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <App />
    </Router>
  </React.StrictMode>,
);
