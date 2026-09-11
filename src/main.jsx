import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { HeroRayColumnPortal } from './components/HeroRayColumnPortal.jsx';
import './styles/global.css';
import './styles/site-fidelity.css';
import './styles/public-artwork.css';
import './styles/hero-mobile-grid-fix.css';
import './styles/hero-raycolumn-experiment.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <HeroRayColumnPortal />
  </React.StrictMode>,
);
