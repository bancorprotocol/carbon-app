import { FC } from 'react';
import { carbonEvents } from 'services/events';
import { Link, PathNames } from 'libs/routing';
import { useTranslation } from 'libs/translations';
import { Button } from 'components/common/button';
import { SearchInput } from 'components/common/searchInput';
import {
  StrategySort,
  StrategyFilter,
  StrategyFilterSort,
} from 'components/strategies/overview/StrategyFilterSort';

export const StrategyPageTitleWidget: FC<{
  search: string;
  setSearch: (value: string) => void;
  showFilter: boolean;
  sort: StrategySort;
  filter: StrategyFilter;
  setSort: (sort: StrategySort) => void;
  setFilter: (sort: StrategyFilter) => void;
}> = ({ search, setSearch, showFilter, sort, filter, setSort, setFilter }) => {
  const { t } = useTranslation();

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
          variant="success"
          onClick={() =>
            carbonEvents.strategy.newStrategyCreateClick(undefined)
          }
        >
          {t('pages.strategyOverview.header.actionButtons.actionButton1')}
        </Button>
      </Link>
    </div>
  );
};
