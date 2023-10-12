import { MatchActionBNStr, TokenPair } from '@bancor/carbon-sdk';
import { buildTokenPairKey } from 'utils/helpers';

export namespace QueryKey {
  export const sdk = ['sdk'];
  export const chain = ['chain'];
  export const extAPI = ['ext-api'];

  export const roi = () => [...extAPI, 'roi'];

  export const tokens = () => [...extAPI, 'tokens'];
  export const tokenPrice = (address: string) => [
    ...extAPI,
    'token-price',
    address,
  ];
  export const strategies = (user?: string) => [
    ...sdk,
    'strategies',
    'user',
    user,
  ];
  export const strategiesByPair = (token0?: string, token1?: string) => [
    ...sdk,
    'strategies',
    'pair',
    token0,
    token1,
  ];

  export const approval = (user: string, token: string, spender: string) => [
    ...chain,
    'approval',
    user,
    token,
    spender,
  ];

  export const ensToAddress = (user: string) => [...chain, 'ens', 'user', user];

  export const ensFromAddress = (address: string) => [
    ...chain,
    'ens',
    'address',
    address,
  ];

  export const balance = (user: string, token: string) => [
    ...chain,
    'balance',
    user,
    token,
  ];

  export const voucherOwner = (id?: string) => [...chain, 'voucherOwner', id];

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
    actions: MatchActionBNStr[]
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

  export const tradeMaxSourceAmount = (pair: TokenPair) => [
    ...sdk,
    buildTokenPairKey(pair),
    'trade-max-source-amount',
  ];

  export const tradeOrderBook = (pair: TokenPair, steps: number) => [
    ...sdk,
    buildTokenPairKey(pair),
    'trade-order-book',
    steps,
  ];

  export const tradeOrderBookLastTradeBuy = (pair: TokenPair) => [
    ...sdk,
    buildTokenPairKey(pair),
    'trade-order-book-last-trade-buy',
  ];
}
