import { AppConfig } from '../types';
import { commonConfig } from './common';

const config: AppConfig = {
  ...commonConfig,
  mode: 'production',
  network: {
    ...commonConfig.network,
    rpc: {
      url: 'https://blast-mainnet.g.alchemy.com/v2/f_KEcqgIh8MnLjcr5CXKBbekuvgWrX2e',
    },
  },
  sentryDSN:
    'https://1aaa1b99875949cdb08089743dcc1ec5@o1249488.ingest.us.sentry.io/4505074572197888',
};
export default config;
