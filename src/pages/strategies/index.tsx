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

export const StrategiesPage = () => {
  const { user } = useWeb3();
  const { currentBreakpoint } = useBreakpoints();
  const strategies = useGetUserStrategies();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(StrategySort.Old);
  const [filter, setFilter] = useState(StrategyFilter.All);

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
// ? <StrategyContent /> : <WalletConnect />
