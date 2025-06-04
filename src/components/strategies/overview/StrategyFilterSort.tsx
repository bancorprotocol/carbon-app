import { FC, FormEvent, useId } from 'react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { getSortAndFilterItems } from './utils';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { lsService } from 'services/localeStorage';
import { useStrategyCtx } from 'hooks/useStrategies';
import { cn } from 'utils/helpers';

export const getSortFromLS = (): StrategySort => {
  const sort = lsService.getItem('strategyOverviewSort');
  if (!sort || !(sort in strategySort)) return 'trades';
  return sort;
};

export const getFilterFromLS = (): StrategyFilter => {
  const filter = lsService.getItem('strategyOverviewFilter');
  if (!filter || !(filter in strategyFilter)) return 'all';
  return filter;
};

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
  totalBudgetDesc: 'Total Budget',
  trades: 'Trades',
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
    <div className="flex gap-8">
      <DropdownMenu
        placement="bottom-end"
        className="min-w-[300px] p-16"
        button={(attr) => (
          <button
            type="button"
            className={cn(
              'border-background-800 flex h-40 flex-1 items-center justify-center gap-8 overflow-hidden rounded-full border-2 px-16 py-8 md:flex-auto',
              'hover:bg-white/10',
              'active:bg-white/20',
              props.className,
            )}
            {...attr}
          >
            <span className="text-14 truncate">
              <b>View</b>: {strategyFilter[filter]}
            </span>
            <IconChevron className="w-14 shrink-0" />
          </button>
        )}
      >
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
      <DropdownMenu
        placement="bottom-end"
        className="min-w-[300px] p-16"
        button={(attr) => (
          <button
            type="button"
            className={cn(
              'border-background-800 flex h-40 flex-1 items-center justify-center gap-8 overflow-hidden rounded-full border-2 px-16 py-8 md:flex-auto',
              'hover:bg-white/10',
              'active:bg-white/20',
              props.className,
            )}
            {...attr}
          >
            <span className="text-14 truncate">
              <b>Sort</b>: {strategySort[sort]}
            </span>
            <IconChevron className="w-14 shrink-0" />
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
      </DropdownMenu>
    </div>
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
