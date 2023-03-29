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
import { m, mItemVariant, mListVariant } from 'libs/motion';
import { StrategyBlock } from 'components/strategies/overview/strategyBlock';
import { StrategyBlockCreate } from 'components/strategies/overview/strategyBlock';
import { getCompareFunctionBySortType } from './utils';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { AnimatePresence } from 'framer-motion';

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
      <AnimatePresence exitBeforeEnter={true}>
        {!filteredStrategies ||
        filteredStrategies.length === 0 ||
        strategies.isLoading ? (
          <>
            {strategies.isLoading ? (
              <m.div
                key={'loading'}
                className={'flex h-[80%] items-center justify-center'}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className={'h-80'}>
                  <CarbonLogoLoading />
                </div>
              </m.div>
            ) : (
              <StrategyNotFound />
            )}
          </>
        ) : (
          <m.div
            key={'strategies'}
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
            <m.div variants={mItemVariant}>
              <StrategyBlockCreate />
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </Page>
  );
};
