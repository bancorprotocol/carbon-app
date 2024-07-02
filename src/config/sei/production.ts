import { AppConfig } from '../types';
import { commonConfig } from './common';

const config: AppConfig = {
  ...commonConfig,
  mode: 'production',
  network: {
    ...commonConfig.network,
    customRpc: {
      url: 'https://holy-frequent-sky.sei-pacific.quiknode.pro/8d454102397f7c651636c3c832e6451a5a7f5928/',
    },
  },
  sentryDSN:
    'https://1aaa1b99875949cdb08089743dcc1ec5@o1249488.ingest.us.sentry.io/4505074572197888',
};
export default config;
