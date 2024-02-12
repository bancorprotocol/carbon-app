import { AppConfig } from '../types';
import { commonConfig } from './common';

const config: AppConfig = {
  ...commonConfig,
  mode: 'production',
  sentryDNS:
    'https://d4f067982bcb46678dd07a0dc54e7270@o1249488.ingest.sentry.io/4505074584584192',
};
export default config;
