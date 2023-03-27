import { Button } from 'components/common/button';
import { SearchInput } from 'components/common/searchInput';
import { FC } from 'react';
import { Link, PathNames } from 'libs/routing';
import {
  StrategySort,
  StrategyFilter,
  StrategyFilterSort,
} from 'components/strategies/overview/StrategyFilterSort';
import { Events, sendEvent } from 'services/googleTagManager';

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
    <div className="grid grid-cols-2 gap-10 md:flex md:items-center md:gap-20">
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
      <Link to={PathNames.createStrategy}>
        <Button
          variant="white"
          onClick={() =>
            sendEvent({ event: Events.Strategy.new_strategy_create_click })
          }
        >
          Create Strategy
        </Button>
      </Link>
    </div>
  );
};
