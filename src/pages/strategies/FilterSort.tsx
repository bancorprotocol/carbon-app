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

export const FilterSort: FC<{
  filter: StrategyFilter;
  sort: StrategySort;
  setSort: (sort: StrategySort) => void;
  setFilter: (sort: StrategyFilter) => void;
}> = ({ sort, filter, setSort, setFilter }) => {
  return (
    <DropdownMenu
      button={
        <Button variant="tertiary" className="flex items-center gap-10">
          Filter & Sort <IconChevron className="w-14" />
        </Button>
      }
    >
      <div className="grid w-[300px] gap-20 p-10">
        <div className="text-secondary text-20">Sort By</div>
        <button
          onClick={() => setSort(StrategySort.Recent)}
          className="flex items-center justify-between"
        >
          Recently Created
          {sort === StrategySort.Recent && <IconCheck />}
        </button>
        <button
          onClick={() => setSort(StrategySort.Old)}
          className="flex items-center justify-between"
        >
          Oldest Created
          {sort === StrategySort.Old && <IconCheck />}
        </button>
        <hr className="border-2 border-silver dark:border-emphasis" />
        <div className="text-secondary">View</div>
        <button
          onClick={() => setFilter(StrategyFilter.All)}
          className="flex items-center justify-between"
        >
          All
          {filter === StrategyFilter.All && <IconCheck />}
        </button>
        <button
          onClick={() => setFilter(StrategyFilter.Active)}
          className="flex items-center justify-between"
        >
          Active
          {filter === StrategyFilter.Active && <IconCheck />}
        </button>
        <button
          onClick={() => setFilter(StrategyFilter.OffCurve)}
          className="flex items-center justify-between"
        >
          Off curve
          {filter === StrategyFilter.OffCurve && <IconCheck />}
        </button>
      </div>
    </DropdownMenu>
  );
};
