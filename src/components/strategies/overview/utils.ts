import BigNumber from 'bignumber.js';
import { Strategy } from 'libs/queries';
import { StrategyFilter, StrategySort } from './StrategyFilterSort';

export const getCompareFunctionBySortType = (sortType: StrategySort) => {
  let firstPairComparison: number;

  switch (sortType) {
    case StrategySort.Recent:
      return (a: Strategy, b: Strategy) =>
        new BigNumber(a.idDisplay).minus(b.idDisplay).times(-1).toNumber();
    case StrategySort.Old:
      return (a: Strategy, b: Strategy) =>
        new BigNumber(a.idDisplay).minus(b.idDisplay).toNumber();
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
    case StrategySort.RoiAscending:
      return (a: Strategy, b: Strategy) => a.roi.minus(b.roi).toNumber();
    case StrategySort.RoiDescending:
      return (a: Strategy, b: Strategy) =>
        a.roi.minus(b.roi).times(-1).toNumber();
    default:
      return (a: Strategy, b: Strategy) =>
        new BigNumber(a.idDisplay).minus(b.idDisplay).times(-1).toNumber();
  }
};
export const getSortAndFilterItems = () => {
  const sortItems = [
    {
      title: 'Recently Created',
      item: StrategySort.Recent,
    },
    {
      title: 'Oldest Created',
      item: StrategySort.Old,
    },
    {
      title: 'Pair (A->Z)',
      item: StrategySort.PairAscending,
    },
    {
      title: 'Pair (Z->A)',
      item: StrategySort.PairDescending,
    },
    {
      title: 'ROI (Ascending)',
      item: StrategySort.RoiAscending,
    },
    {
      title: 'ROI (Descending)',
      item: StrategySort.RoiDescending,
    },
  ];

  const filterItems = [
    {
      title: 'All',
      item: StrategyFilter.All,
    },
    {
      title: 'Active',
      item: StrategyFilter.Active,
    },
    {
      title: 'Inactive',
      item: StrategyFilter.Inactive,
    },
  ];

  return { sortItems, filterItems };
};
