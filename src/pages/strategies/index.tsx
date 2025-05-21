import {
  StrategyPageTabs,
  StrategyTab,
} from 'components/strategies/StrategyPageTabs';
import { useWagmi } from 'libs/wagmi';
import { WalletConnect } from 'components/common/walletConnect';
import { StrategySearch } from 'components/strategies/overview/StrategySearch';
import { useGetUserStrategies } from 'libs/queries';
import { Page } from 'components/common/page';
import { useMemo } from 'react';
import { Outlet, useRouterState, useMatchRoute } from 'libs/routing';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';
import { ReactComponent as IconActivity } from 'assets/icons/activity.svg';
import { StrategyProvider } from 'hooks/useStrategies';
import { StrategyFilterSort } from 'components/strategies/overview/StrategyFilterSort';
import { StrategySelectLayout } from 'components/strategies/StrategySelectLayout';
import { MyStrategiesHeader } from 'components/strategies/MyStrategiesHeader';

export const StrategiesPage = () => {
  const { pathname } = useRouterState().location;
  const { user } = useWagmi();
  const query = useGetUserStrategies({ user });
  const match = useMatchRoute();

  const isStrategiesPage = match({ to: '/portfolio', includeSearch: false });

  const showFilter = useMemo(() => {
    if (!isStrategiesPage) return false;
    return !!(query.data && query.data.length > 2);
  }, [isStrategiesPage, query.data]);

  const tabs: StrategyTab[] = [
    {
      label: 'Strategies',
      href: '/portfolio',
      icon: <IconOverview className="size-18" />,
      badge: query.data?.length,
    },
    {
      label: 'Distribution',
      href: '/portfolio/strategies/portfolio',
      icon: <IconPieChart className="size-18" />,
    },
    {
      label: 'Activity',
      href: '/portfolio/strategies/activity',
      icon: <IconActivity className="size-18" />,
    },
  ];

  if (!user) {
    return (
      <Page hideTitle={true}>
        <WalletConnect />
      </Page>
    );
  }

  return (
    <Page hideTitle={true}>
      <StrategyProvider query={query}>
        <div className="grid gap-20">
          <MyStrategiesHeader />
          <header
            role="toolbar"
            className="mb-20 flex flex-col flex-wrap gap-20 md:flex-row md:items-center"
          >
            <StrategyPageTabs currentPathname={pathname} tabs={tabs} />
            {showFilter && (
              <>
                <StrategySearch />
                <StrategyFilterSort />
                <StrategySelectLayout from="myStrategy" />
              </>
            )}
          </header>
          {/* Hidden tag to target in E2E */}
          {query.isFetching && (
            <div
              className="pointer-events-none fixed opacity-0"
              aria-hidden="true"
              data-testid="fetch-strategies"
            ></div>
          )}
          <Outlet />
        </div>
      </StrategyProvider>
    </Page>
  );
};
