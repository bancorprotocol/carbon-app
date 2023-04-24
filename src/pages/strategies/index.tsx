import { useWeb3 } from 'libs/web3';
import { WalletConnect } from 'components/common/walletConnect';
import { StrategyContent } from 'components/strategies/overview';
import { StrategyPageTitleWidget } from 'components/strategies/overview/StrategyPageTitleWidget';
import { useGetUserStrategies } from 'libs/queries';
import { Page } from 'components/common/page';
import { useState } from 'react';
import {
  StrategyFilter,
  StrategySort,
} from 'components/strategies/overview/StrategyFilterSort';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { lsService } from 'services/localeStorage';

export const StrategiesPage = () => {
  const { user } = useWeb3();
  const { currentBreakpoint } = useBreakpoints();
  const strategies = useGetUserStrategies();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(StrategySort.Old);
  const [filter, _setFilter] = useState(
    lsService.getItem('strategyOverviewFilter') || StrategyFilter.All
  );

  const setFilter = (filter: StrategyFilter) => {
    _setFilter(filter);
    lsService.setItem('strategyOverviewFilter', filter);
  };

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
      hideTitle={currentBreakpoint === 'sm' && !user}
    >
      {user ? (
        <StrategyContent
          strategies={strategies}
          search={search}
          filter={filter}
          sort={sort}
        />
      ) : (
        <WalletConnect />
      )}
    </Page>
  );
};
