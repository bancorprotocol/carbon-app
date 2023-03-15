import BigNumber from 'bignumber.js';
import { Strategy } from 'libs/queries';
import { StrategySort } from './StrategyFilterSort';

export const getCompareFunctionBySortType = (sortType: StrategySort) => {
  let firstPairComparison: number;

  switch (sortType) {
    case StrategySort.Recent:
      return (a: Strategy, b: Strategy) =>
        new BigNumber(a.id).minus(b.id).times(-1).toNumber();
    case StrategySort.Old:
      return (a: Strategy, b: Strategy) =>
        new BigNumber(a.id).minus(b.id).toNumber();
    case StrategySort.PairAscending:
      return (a: Strategy, b: Strategy) => {
        firstPairComparison = a.base.symbol.localeCompare(b.base.symbol);
        if (firstPairComparison !== 0) {
          return firstPairComparison;
        }
        return a.quote.symbol.localeCompare(b.quote.symbol);
      };
    case StrategySort.PairDescending:
      return (a: Strategy, b: Strategy) => {
        firstPairComparison = b.base.symbol.localeCompare(a.base.symbol);
        if (firstPairComparison !== 0) {
          return firstPairComparison;
        }
        return b.quote.symbol.localeCompare(a.quote.symbol);
      };
    default:
      return (a: Strategy, b: Strategy) =>
        new BigNumber(a.id).minus(b.id).times(-1).toNumber();
  }
};
