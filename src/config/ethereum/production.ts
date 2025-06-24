import { AppConfig } from '../types';
import { commonConfig } from './common';

const config: AppConfig = {
  ...commonConfig,
  mode: 'production',
  network: {
    ...commonConfig.network,
    rpc: {
      url: 'https://eth-mainnet.alchemyapi.io/v2/F_rd_k1L6YXk5hWDA1WQQnwsMdFLzlc1',
    },
  },
  sentryDSN:
    'https://1aaa1b99875949cdb08089743dcc1ec5@o1249488.ingest.us.sentry.io/4505074572197888',
};
export default config;
