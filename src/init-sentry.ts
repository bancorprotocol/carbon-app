import * as Sentry from '@sentry/react';
import config from 'config';
import { router } from 'libs/routing';

if (config.sentryDSN) {
  Sentry.init({
    dsn: config.sentryDSN,
    integrations: [
      Sentry.tanstackRouterBrowserTracingIntegration(router),
      Sentry.captureConsoleIntegration({ levels: ['error'] }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  });
}

export {};
