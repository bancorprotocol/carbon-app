import { FC } from 'react';
import { Button } from 'components/common/button';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { getSortAndFilterItems } from './utils';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { lsService } from 'services/localeStorage';
import { useStrategyCtx } from 'hooks/useStrategies';

// [START] Used for localstorage migration: Remove it after Nov 2023
export enum EnumStrategySort {
  Recent,
  Old,
  PairAscending,
  PairDescending,
  RoiAscending,
  RoiDescending,
}
export const strategySortMapping: Record<EnumStrategySort, StrategySort> = {
  [EnumStrategySort.Recent]: 'recent',
  [EnumStrategySort.Old]: 'old',
  [EnumStrategySort.PairAscending]: 'pairAsc',
  [EnumStrategySort.PairDescending]: 'pairDesc',
  [EnumStrategySort.RoiAscending]: 'roiAsc',
  [EnumStrategySort.RoiDescending]: 'roiDesc',
};
const isEnumSort = (
  sort: StrategySort | EnumStrategySort
): sort is EnumStrategySort => sort in strategySortMapping;

export const getSortFromLS = (): StrategySort => {
  const sort = lsService.getItem('strategyOverviewSort');
  if (sort === undefined) return 'roiDesc';
  return isEnumSort(sort) ? strategySortMapping[sort] : sort;
};

export enum EnumStrategyFilter {
  All,
  Active,
  Inactive,
}
export const strategyFilterMapping: Record<EnumStrategyFilter, StrategyFilter> =
  {
    [EnumStrategyFilter.All]: 'all',
    [EnumStrategyFilter.Active]: 'active',
    [EnumStrategyFilter.Inactive]: 'inactive',
  };

const isEnumFilter = (
  filter: StrategyFilter | EnumStrategyFilter
): filter is EnumStrategyFilter => filter in strategyFilterMapping;

export const getFilterFromLS = (): StrategyFilter => {
  const filter = lsService.getItem('strategyOverviewFilter');
  if (filter === undefined) return 'all';
  return isEnumFilter(filter) ? strategyFilterMapping[filter] : filter;
};
// [END]

export const strategyFilter = {
  all: 'All',
  active: 'Active',
  inactive: 'Inactive',
};
export type StrategyFilter = keyof typeof strategyFilter;

export const strategySort = {
  recent: 'Recently Created',
  old: 'Oldest Created',
  pairAsc: 'Pair (A->Z)',
  pairDesc: 'Pair (Z->A)',
  roiAsc: 'ROI (Ascending)',
  roiDesc: 'ROI (Descending)',
};
export type StrategySort = keyof typeof strategySort;

export const StrategyFilterSort = () => {
  const { filter, sort, setFilter, setSort } = useStrategyCtx();
  const { sortItems, filterItems } = getSortAndFilterItems();

  return (
    <DropdownMenu
      button={(onClick) => (
        <Button
          onClick={onClick}
          variant="secondary"
          className="flex items-center gap-10"
        >
          Filter & Sort <IconChevron className="w-14" />
        </Button>
      )}
    >
      <div className="grid w-[300px] gap-20 p-10">
        <div className="text-secondary text-20">Sort By</div>
        <>
          {sortItems.map((sortItem) => (
            <FilterSortItem
              key={sortItem.title}
              item={sortItem.item}
              selectedItem={sort}
              setItem={setSort}
              title={sortItem.title}
            />
          ))}
        </>

        <hr className="border-2 border-silver dark:border-emphasis" />
        <div className="text-secondary">View</div>

        <>
          {filterItems.map((filterItem) => (
            <FilterSortItem
              key={filterItem.title}
              item={filterItem.item}
              selectedItem={filter}
              setItem={setFilter}
              title={filterItem.title}
            />
          ))}
        </>
      </div>
    </DropdownMenu>
  );
};

const FilterSortItem: FC<{
  title: string;
  item: StrategyFilter | StrategySort;
  selectedItem: StrategyFilter | StrategySort;
  setItem: (filter: any) => void;
}> = ({ title, item, selectedItem, setItem }) => {
  return (
    <button
      onClick={() => setItem(item)}
      className="flex items-center justify-between"
    >
      {title}
      {selectedItem === item && <IconCheck />}
    </button>
  );
};
