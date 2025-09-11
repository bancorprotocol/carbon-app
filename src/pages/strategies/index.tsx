import { useWagmi } from 'libs/wagmi';
import { WalletConnect } from 'components/common/walletConnect';
import { useGetUserStrategies } from 'libs/queries';
import { Page } from 'components/common/page';
import { useMemo } from 'react';
import { Outlet, useRouterState, useMatchRoute } from 'libs/routing';
import { MyStrategiesHeader } from 'components/strategies/MyStrategiesHeader';
import { ExplorerTabs } from 'components/explorer/ExplorerTabs';
import { StrategyProvider } from 'components/strategies/StrategyProvider';

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

  if (!user) {
    return (
      <Page hideTitle={true}>
        <WalletConnect />
      </Page>
    );
  }

  return (
    <Page hideTitle={true}>
      <StrategyProvider url="/portfolio" query={query}>
        <div className="grid gap-20">
          <MyStrategiesHeader />
          <ExplorerTabs />
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
