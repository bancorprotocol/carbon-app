import { MatchActionBNStr, TokenPair } from '@bancor/carbon-sdk';
import { TokenPriceHistorySearch } from 'libs/queries/extApi/tokenPrice';
import { SimulatorResultSearch } from 'libs/routing';
import { buildTokenPairKey } from 'utils/helpers';
import { QueryActivityParams } from './extApi/activity';

export const sdk = ['sdk'];
export const chain = ['chain'];
export const extAPI = ['ext-api'];
export const QueryKey = {
  activities: (params: QueryActivityParams) => [...extAPI, 'activity', params],
  activitiesMeta: (params: QueryActivityParams) => [
    ...extAPI,
    'activity-meta',
    params,
  ],

  roi: () => [...extAPI, 'roi'],
  simulator: (params: SimulatorResultSearch) => [
    ...extAPI,
    'simulator',
    params,
  ],

  tokens: () => [...extAPI, 'tokens'],
  tokenPrice: (address: string = '') => [...extAPI, 'token-price', address],

  tokenPriceHistory: (params: TokenPriceHistorySearch) => [
    ...extAPI,
    'token-price-history',
    params,
  ],
  trending: () => [...extAPI, 'trending'],

  strategy: (id: string) => [...sdk, 'strategy', id],
  strategyList: (ids: string[]) => [...sdk, 'strategy', ...ids],
  strategiesByUser: (user?: string) => [
    ...sdk,
    'strategies',
    'user',
    user?.toLowerCase(),
  ],
  strategiesByPair: (token0?: string, token1?: string) => [
    ...sdk,
    'strategies',
    'pair',
    token0,
    token1,
  ],
  strategiesByToken: (token?: string) => [...sdk, 'strategies', 'token', token],

  approval: (user: string, token: string, spender: string) => [
    ...chain,
    'approval',
    user,
    token,
    spender,
  ],

  ensToAddress: (user: string) => [...chain, 'ens', 'user', user],

  ensFromAddress: (address: string) => [...chain, 'ens', 'address', address],

  balance: (user: string, token: string) => [
    ...chain,
    'balance',
    user,
    token.toLowerCase(),
  ],

  voucherOwner: (id?: string) => [...chain, 'voucherOwner', id],

  token: (token: string) => [...chain, 'token', token],
  pairs: () => [...sdk, 'pairs'],

  tradeData: (pair: TokenPair, isTradeBySource: boolean, amount: string) => [
    ...sdk,
    buildTokenPairKey(pair),
    'trade-data',
    isTradeBySource,
    amount,
  ],

  tradeActions: (
    pair: TokenPair,
    isTradeBySource: boolean,
    actions: MatchActionBNStr[],
  ) => [
    ...sdk,
    buildTokenPairKey(pair),
    'trade-actions',
    isTradeBySource,
    actions,
  ],

  tradeLiquidity: (pair: TokenPair) => [
    ...sdk,
    buildTokenPairKey(pair),
    'liquidity',
  ],

  tradeMaxSourceAmount: (pair: TokenPair) => [
    ...sdk,
    buildTokenPairKey(pair),
    'trade-max-source-amount',
  ],

  tradeOrderBook: (pair: TokenPair, steps: number) => [
    ...sdk,
    buildTokenPairKey(pair),
    'trade-order-book',
    steps,
  ],

  tradeOrderBookLastTradeBuy: (pair: TokenPair) => [
    ...sdk,
    buildTokenPairKey(pair),
    'trade-order-book-last-trade-buy',
  ],
};
