import './styles/index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { content } from './data/content.js';
import { prepareFirstScreen } from './lib/page-ready.js';
import './lib/preloader-scene.js';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

prepareFirstScreen(content.hero);
