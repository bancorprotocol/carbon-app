import { AppConfig } from '../types';
import { commonConfig } from './common';

const config: AppConfig = {
  ...commonConfig,
  mode: 'development',
  // network: {
  //   ...commonConfig.network,
  //   chainId: 2391,
  //   blockExplorer: {
  //     name: 'Tonscan',
  //     url: 'https://testnet.tonscan.org/',
  //   },
  //   rpc: {
  //     url: 'https://rpc.ankr.com/tac_spb',
  //   },
  // },
  // addresses: {
  //   ...commonConfig.addresses,
  //   carbon: {
  //     carbonController: '0xe4816658ad10bF215053C533cceAe3f59e1f1087',
  //     voucher: '0xA4682A2A5Fe02feFF8Bd200240A41AD0E6EaF8d5',
  //     batcher: '0x5E994Ac7d65d81f51a76e0bB5a236C6fDA8dBF9A',
  //   },
  // },
};
export default config;
