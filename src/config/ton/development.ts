import { AppConfig } from '../types';
import { commonConfig } from './common';

const addresses = {
  TAC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  TON: '0xe3a2296bE422768a630eb35014978A808D106899',
  USDT: '0xbA7EbAC1D2bB8a68F808cd235BB6A50E7B9F9220',
  ZERO: '0x0000000000000000000000000000000000000000',
};
const popularTokens = [addresses.TON, addresses.USDT];

const config: AppConfig = {
  ...commonConfig,
  mode: 'development',
  tonApi: 'https://rp-testnet.turin.tac.build/api/v3',
  tokenLists: [
    {
      uri: '/tokens/tac/testnet.json',
      parser: 'tokenTonToTacParser',
    },
  ],
  defaultTokenPair: [addresses.TON, addresses.USDT],
  popularPairs: [[addresses.TON, addresses.USDT]],
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
      smartAccountFactory: '0x5919D1D0D1b36F08018d7C9650BF914AEbC6BAd6',
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
      url: 'https://spb.rpc.tac.build',
    },
  },
};
export default config;
