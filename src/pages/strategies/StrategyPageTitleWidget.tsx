import { Button } from 'components/Button';
import { SearchInput } from 'components/SearchInput';
import { FC } from 'react';
import { Link, PathNames } from 'routing';
import { StrategySort, StrategyFilter, FilterSort } from './FilterSort';

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
          <SearchInput
            value={search}
            setValue={setSearch}
            className="h-40 w-full"
          />
          <FilterSort
            sort={sort}
            filter={filter}
            setSort={setSort}
            setFilter={setFilter}
          />
        </>
      )}
      <Link to={PathNames.createStrategy}>
        <Button variant="secondary">Create Strategy</Button>
      </Link>
    </div>
  );
};
