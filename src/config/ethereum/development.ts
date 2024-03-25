import { AppConfig } from '../types';
import { commonConfig } from './common';

const config: AppConfig = {
  ...commonConfig,
  mode: 'development',
  // TODO switch back to prod url
  carbonApi: 'https://carbon-apis-staging-ptdczarhfq-nw.a.run.app/v1/',
};
export default config;
