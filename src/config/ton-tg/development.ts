import { AppConfig } from '../types';
import { commonConfig } from './common';

const addresses = {
  TAC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  TON: '0xe3a2296bE422768a630eb35014978A808D106899',
  JFK: '0x6988C476CA404d59e9F368F0d14D1a74b49D0443',
  ZERO: '0x0000000000000000000000000000000000000000',
};
const popularTokens = [addresses.TON, addresses.JFK];

const config: AppConfig = {
  ...commonConfig,
  mode: 'development',
  tokenLists: [
    {
      uri: '/tokens/tac/testnet.json',
      parser: 'tokenTonToTacParser',
    },
  ],
  defaultTokenPair: [addresses.TON, addresses.JFK],
  popularPairs: [[addresses.TON, addresses.JFK]],
  popularTokens: {
    base: popularTokens,
    quote: popularTokens,
  },
  addresses: {
    tokens: addresses,
    carbon: {
      carbonController: '0xe4816658ad10bF215053C533cceAe3f59e1f1087',
      voucher: '0xA4682A2A5Fe02feFF8Bd200240A41AD0E6EaF8d5',
      batcher: '0x5E994Ac7d65d81f51a76e0bB5a236C6fDA8dBF9A',
    },
    tac: {
      proxy: '0x6D66139b6D31b1B8fFdf27fB725415585DeaCc78',
      smartAccountFactory: '0x510ee99eD721107851D692f761198E3dE4e9310D',
    },
  },
  network: {
    ...commonConfig.network,
    chainId: 2391,
    blockExplorer: {
      name: 'TAC Explorer',
      url: 'https://spb.explorer.tac.build/',
    },
    rpc: {
      url: 'https://rp-testnet.turin.tac.build',
    },
  },
};
export default config;
