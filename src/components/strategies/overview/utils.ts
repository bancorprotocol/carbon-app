import BigNumber from 'bignumber.js';
import { Strategy } from 'libs/queries';
import { TFunction } from 'libs/translations';
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
    default:
      return (a: Strategy, b: Strategy) =>
        new BigNumber(a.idDisplay).minus(b.idDisplay).times(-1).toNumber();
  }
};

export const getSortAndFilterItems = (
  t: TFunction<string, undefined, string>
) => {
  const sortItems = [
    {
      title: t('pages.strategyOverview.header.filterMenu.items.item1'),
      item: StrategySort.Recent,
    },
    {
      title: t('pages.strategyOverview.header.filterMenu.items.item2'),
      item: StrategySort.Old,
    },
    {
      title: t('pages.strategyOverview.header.filterMenu.items.item3'),
      item: StrategySort.PairAscending,
    },
    {
      title: t('pages.strategyOverview.header.filterMenu.items.item4'),
      item: StrategySort.PairDescending,
    },
  ];

  const filterItems = [
    {
      title: t('pages.strategyOverview.header.filterMenu.items.item5'),
      item: StrategyFilter.All,
    },
    {
      title: t('pages.strategyOverview.header.filterMenu.items.item6'),
      item: StrategyFilter.Active,
    },
    {
      title: t('pages.strategyOverview.header.filterMenu.items.item7'),
      item: StrategyFilter.Inactive,
    },
  ];

  return { sortItems, filterItems };
};
