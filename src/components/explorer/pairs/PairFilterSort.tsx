import { Dispatch, FC, FormEvent, SetStateAction, useId } from 'react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { cn } from 'utils/helpers';
import { pairFilter, PairFilter, pairSort, PairSort } from './utils';

const sortItems = Object.entries(pairSort)
  .filter(([, title]) => !!title)
  .map(([item, title]) => {
    return { item: item as PairSort, title };
  });

interface SortProps {
  sort: PairSort;
  setSort: Dispatch<SetStateAction<PairSort>>;
  className?: string;
}

export const PairSortDropdown: FC<SortProps> = (props) => {
  const { sort, setSort } = props;

  const onSortChange = (event: FormEvent<HTMLFieldSetElement>) => {
    if (event.target instanceof HTMLInputElement) {
      setSort(event.target.value as PairSort);
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
            'btn-on-background flex items-center justify-center gap-8 overflow-hidden rounded-full ',
            props.className,
          )}
          {...attr}
        >
          <p className="flex gap-8 text-14 truncate">
            <b>Sort</b>:
            <span className="text-start sm:min-w-115">{pairSort[sort]}</span>
          </p>
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
  filter: PairFilter;
  setFilter: Dispatch<SetStateAction<PairFilter>>;
  className?: string;
}
export const PairFilterDropdown: FC<FilterProps> = (props) => {
  const { filter, setFilter } = props;

  const onFilterChange = (event: FormEvent<HTMLFieldSetElement>) => {
    if (event.target instanceof HTMLInputElement) {
      setFilter(event.target.value as PairFilter);
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
            'btn-on-background flex items-center justify-center gap-8 overflow-hidden rounded-full ',
            props.className,
          )}
          {...attr}
        >
          <p className="flex gap-8 text-14 truncate">
            <b>View:</b>
            <span className="text-start">{pairFilter[filter]}</span>
          </p>
          <IconChevron className="w-14 shrink-0" />
        </button>
      )}
    >
      <fieldset onChange={onFilterChange}>
        <legend className="text-14 px-16 py-8 text-white/60">Status</legend>
        {Object.entries(pairFilter).map(([key, label]) => (
          <FilterSortItem
            name="filter"
            key={key}
            item={key as PairFilter}
            title={label}
            selectedItem={filter}
          />
        ))}
      </fieldset>
    </DropdownMenu>
  );
};

const FilterSortItem: FC<{
  name: string;
  title: string;
  item: PairFilter | PairSort;
  selectedItem: PairFilter | PairSort;
}> = ({ title, item, selectedItem, name }) => {
  const id = useId();
  return (
    <div className="relative">
      <input
        id={id}
        type="radio"
        name={name}
        value={item}
        checked={selectedItem === item}
        className="peer absolute opacity-0"
      />
      <label
        htmlFor={id}
        className="rounded-sm flex cursor-pointer items-center justify-between px-16 py-8 hover:bg-main-900/40 peer-focus-visible:outline-solid peer-focus-visible:outline-1 peer-checked:bg-main-900/60"
      >
        {title}
        {selectedItem === item && <IconCheck />}
      </label>
    </div>
  );
};
