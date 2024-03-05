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
import { Outlet, useRouterState, useMatchRoute } from 'libs/routing';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';
import { StrategyProvider } from 'hooks/useStrategies';

export const StrategiesPage = () => {
  const { pathname } = useRouterState().location;
  const { belowBreakpoint } = useBreakpoints();
  const { user } = useWeb3();
  const query = useGetUserStrategies({ user });
  const match = useMatchRoute();
  const isStrategiesPage = match({ to: '/' });

  const showFilter = useMemo(() => {
    if (!isStrategiesPage) return false;
    if (belowBreakpoint('lg')) return false;
    return !!(query.data && query.data.length > 2);
  }, [belowBreakpoint, isStrategiesPage, query.data]);

  const tabs: StrategyTab[] = [
    {
      label: 'Overview',
      href: '/',
      icon: <IconOverview className="h-18 w-18" />,
      badge: query.data?.length,
    },
    {
      label: 'Portfolio',
      href: '/strategies/portfolio',
      icon: <IconPieChart className="h-18 w-18" />,
    },
  ];

  return (
    <Page hideTitle={true}>
      <StrategyProvider query={query}>
        {user && (
          <header
            role="toolbar"
            className="mb-20 flex items-center justify-between"
          >
            <StrategyPageTabs currentPathname={pathname} tabs={tabs} />
            <StrategyPageTitleWidget showFilter={showFilter} />
          </header>
        )}

        {user ? <Outlet /> : <WalletConnect />}
      </StrategyProvider>
    </Page>
  );
};
