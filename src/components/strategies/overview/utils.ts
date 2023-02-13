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
        firstPairComparison = a.token0.symbol.localeCompare(b.token0.symbol);
        if (firstPairComparison !== 0) {
          return firstPairComparison;
        }
        return a.token1.symbol.localeCompare(b.token1.symbol);
      };
    case StrategySort.PairDescending:
      return (a: Strategy, b: Strategy) => {
        firstPairComparison = b.token0.symbol.localeCompare(a.token0.symbol);
        if (firstPairComparison !== 0) {
          return firstPairComparison;
        }
        return b.token1.symbol.localeCompare(a.token1.symbol);
      };
    default:
      return (a: Strategy, b: Strategy) =>
        new BigNumber(a.id).minus(b.id).times(-1).toNumber();
  }
};
