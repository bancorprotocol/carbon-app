import 'global-shim';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'utils/buffer';
import 'fonts.css';
import 'index.css';
import { App } from 'App';
import reportWebVitals from 'reportWebVitals';
import { Web3ReactWrapper } from 'libs/web3';
import { Router } from 'libs/routing';
import { LazyMotion } from 'libs/motion';
import { QueryProvider } from 'libs/queries';
import { StoreProvider } from 'store';

const SENTRY_DSN =
  process.env.NODE_ENV === 'production'
    ? 'https://3bd709257f3946c29dbdeb08181c6eae@o1335274.ingest.sentry.io/4505034453483520'
    : undefined;

if (SENTRY_DSN) {
  import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn: SENTRY_DSN,
      integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <QueryProvider>
      <StoreProvider>
        <Web3ReactWrapper>
          <LazyMotion>
            <Router>
              <App />
            </Router>
          </LazyMotion>
        </Web3ReactWrapper>
      </StoreProvider>
    </QueryProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
