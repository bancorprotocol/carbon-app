import ethereumDev from './ethereum/development';
import ethereumProd from './ethereum/production';
import seiDev from './sei/development';
import seiProd from './sei/production';
import celoDev from './celo/development';
import celoProd from './celo/production';
import blastDev from './blast/development';
import blastProd from './blast/production';
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
  celo: {
    development: celoDev,
    production: celoProd,
  },
  blast: {
    development: blastDev,
    production: blastProd,
  },
};
type Network = keyof typeof configs;
type Mode = 'development' | 'production';

const network = (import.meta.env.VITE_NETWORK || 'ethereum') as Network;
const mode = import.meta.env.MODE as Mode;

if (!configs[network]) {
  const networks = Object.keys(configs).join(' or ');
  throw new Error(`VITE_NETWORK should be ${networks}, got "${network}"`);
}
if (!configs[network][mode]) {
  const modes = Object.keys(configs[network]).join(' or ');
  throw new Error(`NODE_ENV should be ${modes}, got "${mode}"`);
}

export const networks = Object.entries(configs)
  .filter(([_id, config]) => config[mode].hidden !== true)
  .map(([id, config]) => {
    return {
      id,
      name: config[mode].network.name,
      logoUrl: config[mode].network.logoUrl,
      isCurrentNetwork: network === id,
      appUrl: config[mode].appUrl,
    };
  });

export default configs[network][mode];
