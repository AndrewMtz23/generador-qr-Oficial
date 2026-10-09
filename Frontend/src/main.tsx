import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import './i18n/config';
import 'react-international-phone/style.css';

const GA_ID = 'G-FERLP17VV6';

function loadGoogleAnalytics() {
  if (typeof window === 'undefined' || !import.meta.env.PROD) return;
  window.dataLayer = window.dataLayer || [];
  // gtag.js only processes the Arguments object; pushing a rest-params array is silently ignored.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', GA_ID);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

function AppWithAnalytics() {
  useEffect(() => {
    const defer = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 0));
    defer(loadGoogleAnalytics);
  }, []);
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AppWithAnalytics />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
