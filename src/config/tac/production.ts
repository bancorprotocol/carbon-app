import { AppConfig } from '../types';
import { commonConfig } from './common';

const config: AppConfig = {
  ...commonConfig,
  mode: 'production',
  network: {
    ...commonConfig.network,
    rpc: {
      url: 'https://rpc.ankr.com/tac/fa8610ec591a5bec6d5a4412d00b3892c774b8f3cfba3dae4be715aaaf64bdc4',
    },
  },
  sentryDSN:
    'https://1aaa1b99875949cdb08089743dcc1ec5@o1249488.ingest.us.sentry.io/4505074572197888',
};
export default config;
