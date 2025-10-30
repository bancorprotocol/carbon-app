import { RawPairRow } from './types';
import config from 'config';

interface PairFilterMap {
  all: string;
  large: string;
  rewards?: string;
}

export const pairFilter: PairFilterMap = {
  all: 'All',
  large: 'Only significant liquidity',
};
if (config.ui.rewardUrl) {
  pairFilter.rewards = 'Only Rewards';
}
export type PairFilter = keyof PairFilterMap;

export const pairSort = {
  pairAsc: 'Pair (A->Z)',
  pairDesc: 'Pair (Z->A)',
  trades: 'Total Trades',
  trades24h: 'Trades (24h)',
  liquidity: 'Liquidity',
  strategyAmount: 'Strategies',
};

export type PairSort = keyof typeof pairSort;

type SortFn = (a: RawPairRow, b: RawPairRow) => number;
export const sortPairFn: Record<PairSort, SortFn> = {
  pairAsc: (a, b) => {
    return (
      a.base.symbol.localeCompare(b.base.symbol) ||
      a.quote.symbol.localeCompare(b.quote.symbol)
    );
  },
  pairDesc: (a, b) => {
    return (
      b.base.symbol.localeCompare(a.base.symbol) ||
      b.quote.symbol.localeCompare(a.quote.symbol)
    );
  },
  trades: (a, b) => b.tradeCount - a.tradeCount,
  trades24h: (a, b) => b.tradeCount24h - a.tradeCount24h,
  strategyAmount: (a, b) => b.strategyAmount - a.strategyAmount,
  liquidity: (a, b) => {
    return a.liquidity.minus(b.liquidity).times(-1).toNumber();
  },
};
