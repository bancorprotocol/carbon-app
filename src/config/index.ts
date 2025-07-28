import ethereumDev from './ethereum/development';
import ethereumProd from './ethereum/production';
import seiDev from './sei/development';
import seiProd from './sei/production';
import celoDev from './celo/development';
import celoProd from './celo/production';
import cotiDev from './coti/development';
import cotiProd from './coti/production';
import blastDev from './blast/development';
import blastProd from './blast/production';
import tacDev from './tac/development';
import tacProd from './tac/production';
import { handleConfigOverrides } from './utils';

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
  coti: {
    development: cotiDev,
    production: cotiProd,
  },
  blast: {
    development: blastDev,
    production: blastProd,
  },
  tac: {
    development: tacDev,
    production: tacProd,
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

export { pairsToExchangeMapping } from './utils';

export const networks = Object.entries(configs)
  .filter(([id, config]) => config[mode].hidden !== true || network === id)
  .map(([id, config]) => {
    return {
      id,
      name: config[mode].network.name,
      logoUrl: config[mode].network.logoUrl,
      chainId: config[mode].network.chainId,
      isCurrentNetwork: network === id,
      appUrl: config[mode].appUrl,
    };
  });

export const defaultConfig = configs[network][mode];
const currentConfig = handleConfigOverrides(defaultConfig);
// Force showCart to false if no batcher address
if (!!currentConfig.ui.showCart && !currentConfig.addresses.carbon.batcher) {
  console.error(
    '[Config] config.ui.showCart is true but the address of the batcher contract is not set.',
  );
  currentConfig.ui.showCart = false;
}
export default currentConfig;
