import React, { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <main css={{ position: 'relative', width: '100%' }}>
      <App />
    </main>
  </React.StrictMode>
);
