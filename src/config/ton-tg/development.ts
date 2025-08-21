import { AppConfig } from '../types';
import { commonConfig } from './common';

// const addresses = {
//   TAC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
//   TON: '0xe3a2296bE422768a630eb35014978A808D106899',
//   AIOTX: '0xCa0399fF49526D38D54d201ED50521C9201C1ef7',
//   USDT: '0x19dd649b2132c6e66afC00717714ab831A60C00F',
//   ZERO: '0x0000000000000000000000000000000000000000',
// };
// const popularTokens = [addresses.USDT, addresses.AIOTX];

const config: AppConfig = {
  ...commonConfig,
  mode: 'development',
  // tokenLists: [{
  //   uri: '/tokens/tac/testnet.json',
  //   parser: 'tokenTonToTacParser',
  // }],
  // defaultTokenPair: [addresses.USDT, addresses.AIOTX],
  // popularPairs: [[addresses.USDT, addresses.AIOTX]],
  // popularTokens: {
  //   base: popularTokens,
  //   quote: popularTokens,
  // },
  // addresses: {
  //   tokens: addresses,
  //   carbon: {
  //     carbonController: '0xe4816658ad10bF215053C533cceAe3f59e1f1087',
  //     voucher: '0xA4682A2A5Fe02feFF8Bd200240A41AD0E6EaF8d5',
  //     batcher: '0x5E994Ac7d65d81f51a76e0bB5a236C6fDA8dBF9A',
  //   },
  // },
};
export default config;
