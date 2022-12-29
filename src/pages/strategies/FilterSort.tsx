import { Button } from 'components/Button';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { DropdownMenu } from 'components/DropdownMenu';
import { FC } from 'react';

export enum StrategyFilter {
  All,
  Active,
  OffCurve,
}

export enum StrategySort {
  Recent,
  Old,
}

const sortItems = [
  {
    title: 'Recently Created',
    item: StrategySort.Recent,
  },
  {
    title: 'Oldest Created',
    item: StrategySort.Old,
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
    title: 'Off Curve',
    item: StrategyFilter.OffCurve,
  },
];

export const FilterSort: FC<{
  filter: StrategyFilter;
  sort: StrategySort;
  setSort: (sort: StrategySort) => void;
  setFilter: (sort: StrategyFilter) => void;
}> = ({ sort, filter, setSort, setFilter }) => {
  return (
    <DropdownMenu
      button={(onClick) => (
        <Button
          onClick={onClick}
          variant="tertiary"
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
