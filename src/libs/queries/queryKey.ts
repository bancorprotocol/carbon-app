import { MatchActionBNStr, TokenPair } from '@bancor/carbon-sdk';
import { TokenPriceHistorySearch } from 'libs/queries/extApi/tokenPrice';
import { SimulatorResultSearch } from 'libs/routing';
import { buildTokenPairKey } from 'utils/helpers';
import { QueryActivityParams } from './extApi/activity';
import { Dexes } from 'services/uniswap/utils';

export const sdk = ['sdk'];
export const chain = ['chain'];
export const extAPI = ['ext-api'];
export const aggregator = ['dex-aggregator'];
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
  tokenPrice: (address?: string) => [...extAPI, 'token-price', address],
  tokensPrice: () => [...extAPI, 'tokens-price'],
  tokenListPrice: (addresses: string[]) => [
    ...extAPI,
    'token-list-price',
    ...addresses,
  ],

  tokenPriceHistory: (params: TokenPriceHistorySearch) => [
    ...extAPI,
    'token-price-history',
    params,
  ],
  trending: () => [...extAPI, 'trending'],
  reward: (pair: string) => [...extAPI, 'reward', pair],
  rewards: () => [...extAPI, 'reward', 'all'],
  allChainsRewards: () => [...extAPI, 'all-chains', 'reward', 'all'],

  strategyAll: () => [...sdk, 'strategy', 'all'],
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

  missingTokens: () => [...chain, 'missing-token'],
  token: (token: string) => [...chain, 'token', token],
  canBatch: (user?: string) => [...chain, 'can-batch', user],
  pairs: () => [...sdk, 'pairs'],

  sdkTradeData: (pair: TokenPair, isTradeBySource: boolean, amount: string) => [
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

  tradeSDKLiquidity: (pair: TokenPair) => [
    ...sdk,
    buildTokenPairKey(pair),
    'liquidity',
  ],

  tradeMaxSourceAmount: (pair: TokenPair) => [
    ...sdk,
    buildTokenPairKey(pair),
    'trade-max-source-amount',
  ],

  dexAggregatorTradeData: (
    pair: TokenPair,
    isTradeBySource: boolean,
    amount: string,
    slippage: string,
  ) => [
    ...aggregator,
    buildTokenPairKey(pair),
    'trade-data',
    isTradeBySource,
    amount,
    slippage,
  ],
  dexMigration: (dex: Dexes, user: string) => ['migration', dex, user],
};
