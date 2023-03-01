import { MatchAction } from '@bancor/carbon-sdk/src/types';

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
    sourceToken: string,
    targetToken: string,
    isTradeBySource: boolean,
    amount: string
  ) => [
    ...sdk,
    'trade-data',
    sourceToken,
    targetToken,
    isTradeBySource,
    amount,
  ];

  export const tradeActions = (
    sourceToken: string,
    targetToken: string,
    isTradeBySource: boolean,
    actions: MatchAction[]
  ) => [
    ...sdk,
    'trade-actions',
    sourceToken,
    targetToken,
    isTradeBySource,
    actions.map((a) => a.id.toString()).join('-'),
  ];

  export const tradeLiquidity = (token0: string, token1: string) => [
    ...sdk,
    'liquidity',
    token0,
    token1,
  ];

  export const tradeOrderBook = (
    base: string,
    quote: string,
    buckets: number
  ) => [...sdk, 'trade-order-book', base, quote, buckets];
}
