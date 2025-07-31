// index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18+ uses this
import App from './App';
import './index.css'; // Global styles

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
