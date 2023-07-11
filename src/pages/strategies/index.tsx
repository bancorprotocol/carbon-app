import { StrategyPageTabs } from 'components/strategies/StrategyPageTabs';
import { useWeb3 } from 'libs/web3';
import { WalletConnect } from 'components/common/walletConnect';
import { StrategyPageTitleWidget } from 'components/strategies/overview/StrategyPageTitleWidget';
import { useGetUserStrategies } from 'libs/queries';
import { Page } from 'components/common/page';
import { useMemo } from 'react';
import { Outlet, useLocation } from 'libs/routing';
import { useStore } from 'store';
import { cn } from 'utils/helpers';

export const StrategiesPage = () => {
  const {
    current: { pathname },
  } = useLocation();
  const { user } = useWeb3();
  const strategies = useGetUserStrategies();
  const {
    strategies: { search, setSearch, sort, setSort, filter, setFilter },
  } = useStore();

  const showFilter = useMemo(() => {
    if (strategies.data) {
      return strategies.data.length > 2;
    }

    return false;
  }, [strategies.data]);

  return (
    <Page>
      <div className={cn('mb-20 flex items-center justify-between')}>
        <StrategyPageTabs
          currentPathname={pathname}
          strategyCount={strategies.data?.length || 0}
        />

        <StrategyPageTitleWidget
          sort={sort}
          filter={filter}
          setSort={setSort}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          showFilter={showFilter}
        />
      </div>

      {user ? <Outlet /> : <WalletConnect />}
    </Page>
  );
};
