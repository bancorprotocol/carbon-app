import { TokenPair } from '@bancor/carbon-sdk';
import { MatchAction } from '@bancor/carbon-sdk/src/types';
import { buildTokenPairKey } from 'utils/helpers';

export namespace QueryKey {
  export const sdk = ['sdk'];
  export const chain = ['chain'];
  export const extAPI = ['ext-api'];

  export const tokens = () => [...extAPI, 'tokens'];
  export const tokenPrice = (address: string) => [
    ...extAPI,
    'token-price',
    address,
  ];
  export const strategies = (user?: string) => [...sdk, 'strategies', user];
  export const approval = (user: string, token: string, spender: string) => [
    ...chain,
    'approval',
    user,
    token,
    spender,
  ];

  export const balance = (user: string, token: string) => [
    ...chain,
    'balance',
    user,
    token,
  ];

  export const token = (token: string) => [...chain, 'token', token];
  export const pairs = () => [...sdk, 'pairs'];

  export const tradeData = (
    pair: TokenPair,
    isTradeBySource: boolean,
    amount: string
  ) => [...sdk, buildTokenPairKey(pair), 'trade-data', isTradeBySource, amount];

  export const tradeActions = (
    pair: TokenPair,
    isTradeBySource: boolean,
    actions: MatchAction[]
  ) => [
    ...sdk,
    buildTokenPairKey(pair),
    'trade-actions',
    isTradeBySource,
    actions,
  ];

  export const tradeLiquidity = (pair: TokenPair) => [
    ...sdk,
    buildTokenPairKey(pair),
    'liquidity',
  ];

  export const tradeOrderBook = (pair: TokenPair, buckets: number) => [
    ...sdk,
    buildTokenPairKey(pair),
    'trade-order-book',
    buckets,
  ];
}
