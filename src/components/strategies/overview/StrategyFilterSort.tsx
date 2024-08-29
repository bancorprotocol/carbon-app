import { FC, FormEvent, useId } from 'react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { getSortAndFilterItems } from './utils';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { ReactComponent as IconFilter } from 'assets/icons/filter.svg';
import { lsService } from 'services/localeStorage';
import { useStrategyCtx } from 'hooks/useStrategies';
import { cn } from 'utils/helpers';

// [START] Used for localStorage migration: Remove it after Nov 2023
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
  totalBudgetDesc: 'Total Budget',
};
export type StrategySort = keyof typeof strategySort;

interface Props {
  className?: string;
}

export const StrategyFilterSort: FC<Props> = (props) => {
  const { filter, sort, setFilter, setSort } = useStrategyCtx();
  const { sortItems, filterItems } = getSortAndFilterItems();

  const onSortChange = (event: FormEvent<HTMLFieldSetElement>) => {
    if (event.target instanceof HTMLInputElement) {
      setSort(event.target.value as StrategySort);
    }
  };
  const onFilterChange = (event: FormEvent<HTMLFieldSetElement>) => {
    if (event.target instanceof HTMLInputElement) {
      setFilter(event.target.value as StrategyFilter);
    }
  };

  return (
    <DropdownMenu
      placement="bottom-end"
      className="min-w-[300px] p-16"
      button={(attr) => (
        <button
          type="button"
          className={cn(
            'border-background-800 lg:px-30 grid h-40 min-w-[40px] items-center justify-center rounded-full border-2',
            'hover:bg-white/10',
            'active:bg-white/20',
            props.className
          )}
          {...attr}
        >
          <IconFilter className="size-18 lg:hidden" />
          <span className="hidden gap-10 lg:inline-flex lg:items-center">
            Filter & Sort <IconChevron className="w-14" />
          </span>
        </button>
      )}
    >
      <fieldset onChange={onSortChange}>
        <legend className="text-14 px-16 py-8 text-white/60">Sort By</legend>
        {sortItems.map((sortItem) => (
          <FilterSortItem
            name="sort"
            key={sortItem.title}
            item={sortItem.item}
            selectedItem={sort}
            title={sortItem.title}
          />
        ))}
      </fieldset>

      <fieldset onChange={onFilterChange}>
        <legend className="text-14 px-16 py-8 text-white/60">View</legend>
        {filterItems.map((filterItem) => (
          <FilterSortItem
            name="filter"
            key={filterItem.title}
            item={filterItem.item}
            selectedItem={filter}
            title={filterItem.title}
          />
        ))}
      </fieldset>
    </DropdownMenu>
  );
};

const FilterSortItem: FC<{
  name: string;
  title: string;
  item: StrategyFilter | StrategySort;
  selectedItem: StrategyFilter | StrategySort;
}> = ({ title, item, selectedItem, name }) => {
  const id = useId();
  return (
    <div className="relative">
      <input
        id={id}
        type="radio"
        name={name}
        value={item}
        className="peer absolute opacity-0"
      />
      <label
        htmlFor={id}
        className="
          rounded-6 flex cursor-pointer items-center justify-between px-16
          py-8 hover:bg-black/90
          peer-focus-visible:outline peer-focus-visible:outline-1
        "
      >
        {title}
        {selectedItem === item && <IconCheck />}
      </label>
    </div>
  );
};
