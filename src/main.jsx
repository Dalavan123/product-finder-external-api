/**
 * src/main.jsx
 * Entrypoint (React 18)
 * Syfte: renderar <App/> i #root och laddar bas-CSS.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import './index.css';
import './styles/global.css';

createRoot(document.getElementById('root')).render(<App />);
