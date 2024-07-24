import ethereumDev from './ethereum/development';
import ethereumProd from './ethereum/production';
import seiDev from './sei/development';
import seiProd from './sei/production';
export { pairsToExchangeMapping } from './utils';

const configs = {
  ethereum: {
    development: ethereumDev,
    production: ethereumProd,
  },
  sei: {
    development: seiDev,
    production: seiProd,
  },
};
type Network = keyof typeof configs;
type Mode = 'development' | 'production';

export const network = (import.meta.env.VITE_NETWORK || 'ethereum') as Network;
const mode = import.meta.env.MODE as Mode;

if (!configs[network]) {
  const networks = Object.keys(configs).join(' or ');
  throw new Error(`VITE_NETWORK should be ${networks}, got "${network}"`);
}
if (!configs[network][mode]) {
  const modes = Object.keys(configs[network]).join(' or ');
  throw new Error(`NODE_ENV should be ${modes}, got "${mode}"`);
}

export const networkConfigs = Object.fromEntries(
  Object.entries(configs).map(([network, config]) => [network, config[mode]])
);

export default configs[network][mode];
