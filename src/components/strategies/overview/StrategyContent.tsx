import { useMemo, useState } from 'react';
import { StrategyStatus, useGetUserStrategies } from 'libs/queries';
import {
  StrategyFilter,
  StrategySort,
} from 'components/strategies/overview/StrategyFilterSort';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { Page } from 'components/common/page';
import { StrategyPageTitleWidget } from './StrategyPageTitleWidget';
import { StrategyNotFound } from './StrategyNotFound';
import { m, mListVariant } from 'libs/motion';
import { StrategyBlock } from 'components/strategies/overview/strategyBlock';
import { StrategyBlockCreate } from 'components/strategies/overview/strategyBlock';
import { getCompareFunctionBySortType } from './utils';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';

export const StrategyContent = () => {
  const strategies = useGetUserStrategies();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(StrategySort.Old);
  const [filter, setFilter] = useState(StrategyFilter.All);
  const compareFunction = getCompareFunctionBySortType(sort);

  const filteredStrategies = useMemo(() => {
    const searchLC = search.toLowerCase();

    const filtered = strategies.data?.filter(
      (strategy) =>
        (strategy.base.symbol.toLowerCase().includes(searchLC) ||
          strategy.quote.symbol.toLowerCase().includes(searchLC)) &&
        (filter === StrategyFilter.All ||
          (filter === StrategyFilter.Active &&
            strategy.status === StrategyStatus.Active) ||
          (filter === StrategyFilter.Inactive &&
            strategy.status !== StrategyStatus.Active))
    );

    return filtered?.sort((a, b) => {
      return compareFunction(a, b);
    });
  }, [search, strategies.data, filter, compareFunction]);

  if (strategies && strategies.data && strategies.data.length === 0)
    return <StrategyCreateFirst />;

  return (
    <Page
      title={`${strategies.data?.length || ''} Strategies`}
      widget={
        <StrategyPageTitleWidget
          sort={sort}
          filter={filter}
          setSort={setSort}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          showFilter={!!(strategies.data && strategies.data.length > 2)}
        />
      }
    >
      {!filteredStrategies ||
      filteredStrategies.length === 0 ||
      strategies.isLoading ? (
        <>
          {strategies.isLoading ? (
            <div className={'flex h-[80%] items-center justify-center'}>
              <div className={'h-80'}>
                <CarbonLogoLoading />
              </div>
            </div>
          ) : (
            <StrategyNotFound />
          )}
        </>
      ) : (
        <m.div
          className={
            'grid grid-cols-1 gap-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:gap-25'
          }
          variants={mListVariant}
          initial={'hidden'}
          animate={'visible'}
        >
          {filteredStrategies?.map((s) => (
            <StrategyBlock key={s.id} strategy={s} />
          ))}
          <StrategyBlockCreate />
        </m.div>
      )}
    </Page>
  );
};
