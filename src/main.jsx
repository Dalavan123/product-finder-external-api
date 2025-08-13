import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// import-ordning spelar roll: index.css först, global.css sist
import './index.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
