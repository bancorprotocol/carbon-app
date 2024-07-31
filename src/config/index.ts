import ethereumDev from './ethereum/development';
import ethereumProd from './ethereum/production';
import seiDev from './sei/development';
import seiProd from './sei/production';
import celoDev from './celo/development';
import celoProd from './celo/production';
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
};
type Network = keyof typeof configs;
type Mode = 'development' | 'production';

const mode = import.meta.env.MODE as Mode;
const useStoredChainSwitch = !!import.meta.env.VITE_USE_STORED_CHAIN_SWITCH;

export const network = ((useStoredChainSwitch
  ? localStorage.getItem('currentNetwork')
  : undefined) ||
  import.meta.env.VITE_NETWORK ||
  'ethereum') as Network;

if (!configs[network]) {
  const networks = Object.keys(configs).join(' or ');
  throw new Error(`VITE_NETWORK should be ${networks}, got "${network}"`);
}
if (!configs[network][mode]) {
  const modes = Object.keys(configs[network]).join(' or ');
  throw new Error(`NODE_ENV should be ${modes}, got "${mode}"`);
}

export const networks = Object.entries(configs).map(([id, config]) => {
  return {
    id,
    name: config[mode].network.name,
    logoUrl: config[mode].network.logoUrl,
    isCurrentNetwork: network === id,
    selectNetwork: () => {
      if (useStoredChainSwitch) {
        localStorage.setItem('currentNetwork', id);
        window.location.reload();
      } else {
        window.location.href = config[mode].appUrl;
      }
    },
  };
});

export default configs[network][mode];
