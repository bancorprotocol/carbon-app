import {
  StrategyPageTabs,
  StrategyTab,
} from 'components/strategies/StrategyPageTabs';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useWeb3 } from 'libs/web3';
import { WalletConnect } from 'components/common/walletConnect';
import { StrategyPageTitleWidget } from 'components/strategies/overview/StrategyPageTitleWidget';
import { useGetUserStrategies } from 'libs/queries';
import { Page } from 'components/common/page';
import { useMemo } from 'react';
import { Outlet, PathNames, useLocation } from 'libs/routing';
import { useStore } from 'store';
import { cn } from 'utils/helpers';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';

export const StrategiesPage = () => {
  const {
    current: { pathname },
  } = useLocation();
  const { belowBreakpoint } = useBreakpoints();
  const { user } = useWeb3();
  const strategies = useGetUserStrategies({ user });
  const {
    strategies: { search, setSearch, sort, setSort, filter, setFilter },
  } = useStore();

  const showFilter = useMemo(() => {
    if (pathname !== PathNames.strategies) {
      return false;
    }

    if (belowBreakpoint('lg')) {
      return false;
    }

    if (strategies.data) {
      return strategies.data.length > 2;
    }

    return false;
  }, [belowBreakpoint, pathname, strategies.data]);

  const tabs: StrategyTab[] = [
    {
      label: 'Overview',
      href: PathNames.strategies,
      hrefMatches: [PathNames.strategies],
      icon: <IconOverview className={'h-18 w-18'} />,
      badge: strategies.data?.length || 0,
    },
    {
      label: 'Portfolio',
      href: PathNames.portfolio,
      hrefMatches: [PathNames.portfolio, PathNames.portfolioToken('0x')],
      icon: <IconPieChart className={'h-18 w-18'} />,
    },
  ];

  return (
    <Page hideTitle={true}>
      <div className={cn('mb-20 flex items-center justify-between')}>
        <StrategyPageTabs currentPathname={pathname} tabs={tabs} />

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
