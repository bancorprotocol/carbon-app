const _sdk = ['sdk'];
const _chain = ['chain'];
const _extAPI = ['ext-api'];

export namespace QueryKey {
  export const tokens = () => [..._extAPI, 'tokens'];
  export const tokenPrice = (address: string) => [
    ..._extAPI,
    'token-price',
    address,
  ];
  export const strategies = (user?: string) => [..._sdk, 'strategies', user];
  export const approval = (user: string, token: string, spender: string) => [
    ..._chain,
    'approval',
    user,
    token,
    spender,
  ];

  export const balance = (user: string, token: string) => [
    ..._chain,
    'balance',
    user,
    token,
  ];

  export const token = (token: string) => [..._chain, 'token', token];
  export const pairs = () => [..._sdk, 'pairs'];

  export const tradeData = (
    sourceToken: string,
    targetToken: string,
    isTradeBySource: boolean,
    amount: string
  ) => [
    ..._sdk,
    'trade-data',
    sourceToken,
    targetToken,
    isTradeBySource,
    amount,
  ];

  export const tradeLiquidity = (token0: string, token1: string) => [
    ..._sdk,
    'liquidity',
    token0,
    token1,
  ];

  export const tradeOrderBook = (base: string, quote: string) => [
    ..._sdk,
    'trade-order-book',
    base,
    quote,
  ];
}
