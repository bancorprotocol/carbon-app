import {
  StrategyPageTabs,
  StrategyTab,
} from 'components/strategies/StrategyPageTabs';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useWagmi } from 'libs/wagmi';
import { WalletConnect } from 'components/common/walletConnect';
import { StrategyPageTitleWidget } from 'components/strategies/overview/StrategyPageTitleWidget';
import { useGetUserStrategies } from 'libs/queries';
import { Page } from 'components/common/page';
import { useMemo } from 'react';
import { Outlet, useRouterState, useMatchRoute } from 'libs/routing';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';
import { ReactComponent as IconActivity } from 'assets/icons/activity.svg';
import { StrategyProvider } from 'hooks/useStrategies';

export const StrategiesPage = () => {
  const { pathname } = useRouterState().location;
  const { belowBreakpoint } = useBreakpoints();
  const { user } = useWagmi();
  const query = useGetUserStrategies({ user });
  const match = useMatchRoute();

  const isStrategiesPage = match({ to: '/', includeSearch: false });

  const showFilter = useMemo(() => {
    if (!isStrategiesPage) return false;
    if (belowBreakpoint('lg')) return false;
    return !!(query.data && query.data.length > 2);
  }, [belowBreakpoint, isStrategiesPage, query.data]);

  const tabs: StrategyTab[] = [
    {
      label: 'Overview',
      href: '/',
      icon: <IconOverview className="size-18" />,
      badge: query.data?.length,
    },
    {
      label: 'Portfolio',
      href: '/strategies/portfolio',
      icon: <IconPieChart className="size-18" />,
    },
    {
      label: 'Activity',
      href: '/strategies/activity',
      icon: <IconActivity className="size-18" />,
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
        {/* Hidden tag to target in E2E */}
        {query.isFetching && (
          <div
            className="pointer-events-none fixed opacity-0"
            aria-hidden="true"
            data-testid="fetch-strategies"
          ></div>
        )}
        {user ? <Outlet /> : <WalletConnect />}
      </StrategyProvider>
    </Page>
  );
};
