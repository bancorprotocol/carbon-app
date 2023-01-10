import { StrategyStatus, useGetUserStrategies } from 'libs/queries';
import { useMemo, useState } from 'react';
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

export const StrategyContent = () => {
  const strategies = useGetUserStrategies();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(StrategySort.Old);
  const [filter, setFilter] = useState(StrategyFilter.All);

  const filteredStrategies = useMemo(() => {
    const searchLC = search.toLowerCase();

    const filtered = strategies.data?.filter(
      (strategy) =>
        (strategy.token0.symbol.toLowerCase().includes(searchLC) ||
          strategy.token1.symbol.toLowerCase().includes(searchLC)) &&
        (filter === StrategyFilter.All ||
          (filter === StrategyFilter.Active &&
            strategy.status === StrategyStatus.Active) ||
          (filter === StrategyFilter.Inactive &&
            strategy.status !== StrategyStatus.Active))
    );

    const sorterNum = sort === StrategySort.Recent ? -1 : 1;
    return filtered?.sort((a, b) => sorterNum * (Number(a.id) - Number(b.id)));
  }, [search, strategies.data, filter, sort]);

  if (strategies && strategies.data && strategies.data.length === 0)
    return <StrategyCreateFirst />;

  return (
    <Page
      title={'Strategies'}
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
      {(!filteredStrategies || filteredStrategies.length === 0) &&
      !strategies.isLoading ? (
        <StrategyNotFound />
      ) : (
        <m.div
          className={
            'grid grid-cols-1 gap-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:gap-25'
          }
          variants={mListVariant}
          initial={'hidden'}
          animate={'visible'}
        >
          {strategies.isLoading ? (
            <>
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="loading-skeleton h-[665px] w-full"
                />
              ))}
            </>
          ) : (
            <>
              {filteredStrategies?.map((s) => (
                <StrategyBlock key={s.id} strategy={s} />
              ))}

              <StrategyBlockCreate />
            </>
          )}
        </m.div>
      )}
    </Page>
  );
};
