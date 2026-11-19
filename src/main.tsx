import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Support deep-link scrolling
const urlParams = new URLSearchParams(window.location.search);
const scrollY = urlParams.get('scroll');
if (scrollY) {
  setTimeout(() => window.scrollTo(0, parseInt(scrollY, 10)), 150);
}
