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
  if (typeof filter !== 'object') {
    return {
      status: 'all',
      // type: 'all',
    };
  }
  return filter;
};

export const strategyFilter = {
  status: {
    all: 'All',
    active: 'Active',
    inactive: 'Inactive',
  },
  // @todo(gradient)
  // type: {
  //   all: 'All',
  //   static: 'Static',
  //   gradient: 'Gradient',
  // },
};
export type FilterStatus = keyof (typeof strategyFilter)['status'];
// export type FilterType = keyof (typeof strategyFilter)['type'];
export type AllFilter = FilterStatus; // | FilterType;
export type StrategyFilter = {
  status: FilterStatus;
  // type: FilterType;
};

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
  const onFilterStatusChange = (event: FormEvent<HTMLFieldSetElement>) => {
    if (event.target instanceof HTMLInputElement) {
      const status = event.target.value as FilterStatus;
      setFilter((filter) => ({ ...filter, status }));
    }
  };
  // const onFilterTypeChange = (event: FormEvent<HTMLFieldSetElement>) => {
  //   if (event.target instanceof HTMLInputElement) {
  //     const type = event.target.value as FilterType;
  //     setFilter((filter) => ({ ...filter, type }));
  //   }
  // };

  // @todo(gradient)
  const displayFilter = strategyFilter.status[filter.status];
  // const displayFilter = useMemo(() => {
  //   if (filter.status === 'all' && filter.type === 'all') return 'All';
  //   const typeLabel = strategyFilter.type[filter.type];
  //   const statusLabel = strategyFilter.status[filter.status];
  //   if (filter.status === 'all') return typeLabel;
  //   if (filter.type === 'all') return statusLabel;
  //   return `${typeLabel}, ${statusLabel}`;
  // }, [filter.status, filter.type]);

  return (
    <div className="flex gap-8">
      <DropdownMenu
        placement="bottom-end"
        className="min-w-[300px] p-16"
        button={(attr) => (
          <button
            type="button"
            className={cn(
              'btn-tertiary-gradient flex h-40 flex-1 items-center justify-center gap-8 overflow-hidden rounded-full px-16 py-8 md:flex-auto',
              props.className,
            )}
            {...attr}
          >
            <span className="text-14 truncate">
              <b>View:</b> {displayFilter}
            </span>
            <IconChevron className="w-14 shrink-0" />
          </button>
        )}
      >
        <fieldset onChange={onFilterStatusChange}>
          <legend className="text-14 px-16 py-8 text-white/60">Status</legend>
          {Object.entries(filterItems.status).map(([key, label]) => (
            <FilterSortItem
              name="filter"
              key={key}
              item={key as FilterStatus}
              title={label}
              selectedItem={filter.status}
            />
          ))}
        </fieldset>
        {/* <fieldset onChange={onFilterTypeChange}>
          <legend className="text-14 px-16 py-8 text-white/60">Type</legend>
          {Object.entries(filterItems.type).map(([key, label]) => (
            <FilterSortItem
              name="filter"
              key={key}
              item={key as FilterType}
              title={label}
              selectedItem={filter.type}
            />
          ))}
        </fieldset> */}
      </DropdownMenu>
      <DropdownMenu
        placement="bottom-end"
        className="min-w-[300px] p-16"
        button={(attr) => (
          <button
            type="button"
            className={cn(
              'btn-tertiary-gradient flex h-40 flex-1 items-center justify-center gap-8 overflow-hidden rounded-full px-16 py-8 md:flex-auto',
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
  item: AllFilter | StrategySort;
  selectedItem: AllFilter | StrategySort;
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
          rounded-sm flex cursor-pointer items-center justify-between px-16
          py-8 hover:bg-black/90
          peer-focus-visible:outline-solid peer-focus-visible:outline-1
        "
      >
        {title}
        {selectedItem === item && <IconCheck />}
      </label>
    </div>
  );
};
