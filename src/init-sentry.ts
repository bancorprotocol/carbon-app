import * as Sentry from '@sentry/react';
import config from 'config';
import { router } from 'libs/routing';

if (config.sentryDSN) {
  Sentry.init({
    dsn: config.sentryDSN,
    integrations: [
      Sentry.tanstackRouterBrowserTracingIntegration(router),
      Sentry.captureConsoleIntegration({ levels: ['error'] }),
      Sentry.thirdPartyErrorFilterIntegration({
        filterKeys: [
          import.meta.env.VITE_SENTRY_APPLICATION_KEY ||
            'custom_application_key_carbon_app',
        ],
        behaviour: 'drop-error-if-contains-third-party-frames',
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  });
}

export {};
