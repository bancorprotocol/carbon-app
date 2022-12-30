import { Page } from 'components/Page';
import { StrategyBlock } from 'components/StrategyBlock';
import { StrategyBlockCreate } from 'components/StrategyBlock/create';
import { m, mListVariant } from 'motion';
import { StrategyStatus, useGetUserStrategies } from 'queries';
import { useMemo, useState } from 'react';
import { useWeb3 } from 'web3';
import { WalletConnect } from 'components/WalletConnect';
import { StrategyFilter, StrategySort } from './FilterSort';
import { CreateFirstStrategy } from './CreateFirstStrategy';
import { StrategyNotFound } from './StrategyNotFound';
import { StrategyPageTitleWidget } from './StrategyPageTitleWidget';

export const StrategiesPage = () => {
  const { user } = useWeb3();

  return user ? <StrategyContent /> : <WalletConnect />;
};

const StrategyContent = () => {
  const strategies = useGetUserStrategies();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(StrategySort.Recent);
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
    return filtered?.sort((a, b) => sorterNum * (a.id - b.id));
  }, [search, strategies.data, filter, sort]);

  if (strategies && strategies.data && strategies.data.length === 0)
    return <CreateFirstStrategy />;

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
      {!filteredStrategies || filteredStrategies.length === 0 ? (
        <StrategyNotFound />
      ) : (
        <m.div
          className={'grid grid-cols-1 gap-25 md:grid-cols-3'}
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
              {filteredStrategies.map((s) => (
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
