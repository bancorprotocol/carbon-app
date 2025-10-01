import { Dispatch, FC, FormEvent, SetStateAction, useId } from 'react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { cn } from 'utils/helpers';
import {
  AllFilter,
  FilterStatus,
  strategyFilter,
  StrategyFilter,
  strategySort,
  StrategySort,
} from './utils';

const sortItems = Object.entries(strategySort)
  .filter(([, title]) => !!title)
  .map(([item, title]) => {
    return { item: item as StrategySort, title };
  });

interface SortProps {
  sort: StrategySort;
  setSort: Dispatch<SetStateAction<StrategySort>>;
  className?: string;
}

export const StrategySortDropdown: FC<SortProps> = (props) => {
  const { sort, setSort } = props;

  const onSortChange = (event: FormEvent<HTMLFieldSetElement>) => {
    if (event.target instanceof HTMLInputElement) {
      setSort(event.target.value as StrategySort);
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
            'btn-tertiary-gradient flex h-40 items-center justify-center gap-8 overflow-hidden rounded-full px-16 py-8',
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
  );
};

interface FilterProps {
  filter: StrategyFilter;
  setFilter: Dispatch<SetStateAction<StrategyFilter>>;
  className?: string;
}
export const StrategyFilterDropdown: FC<FilterProps> = (props) => {
  const { filter, setFilter } = props;

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
    <DropdownMenu
      placement="bottom-end"
      className="min-w-[300px] p-16"
      button={(attr) => (
        <button
          type="button"
          className={cn(
            'btn-tertiary-gradient flex h-40 items-center justify-center gap-8 overflow-hidden rounded-full px-16 py-8',
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
        {Object.entries(strategyFilter.status).map(([key, label]) => (
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
