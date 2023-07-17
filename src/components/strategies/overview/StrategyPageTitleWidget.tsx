import { CreateStrategyCTA } from 'components/strategies/create/CreateStrategyCTA';
import { FC } from 'react';
import { SearchInput } from 'components/common/searchInput';
import {
  StrategySort,
  StrategyFilter,
  StrategyFilterSort,
} from 'components/strategies/overview/StrategyFilterSort';
import { cn } from 'utils/helpers';

export const StrategyPageTitleWidget: FC<{
  search: string;
  setSearch: (value: string) => void;
  showFilter: boolean;
  sort: StrategySort;
  filter: StrategyFilter;
  setSort: (sort: StrategySort) => void;
  setFilter: (sort: StrategyFilter) => void;
}> = ({ search, setSearch, showFilter, sort, filter, setSort, setFilter }) => {
  return (
    <div className="flex items-center gap-20">
      {showFilter && (
        <>
          <div className={'order-last col-span-2 md:order-first'}>
            <SearchInput
              value={search}
              setValue={setSearch}
              className="h-40 w-full"
            />
          </div>
          <StrategyFilterSort
            sort={sort}
            filter={filter}
            setSort={setSort}
            setFilter={setFilter}
          />
        </>
      )}

      <div className={cn('hidden', 'md:block')}>
        <CreateStrategyCTA />
      </div>
    </div>
  );
};
