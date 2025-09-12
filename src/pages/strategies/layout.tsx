import { useWagmi } from 'libs/wagmi';
import { WalletConnect } from 'components/common/walletConnect';
import { useGetUserStrategies } from 'libs/queries';
import { Page } from 'components/common/page';
import { Outlet } from 'libs/routing';
import { MyStrategiesHeader } from 'components/strategies/MyStrategiesHeader';
import { ExplorerTabs } from 'components/explorer/ExplorerTabs';
import { StrategyProvider } from 'components/strategies/StrategyProvider';
import style from 'components/explorer/ExplorerLayout.module.css';

export const PortfolioLayout = () => {
  const { user } = useWagmi();
  const query = useGetUserStrategies({ user });

  if (!user) {
    return (
      <Page>
        <WalletConnect />
      </Page>
    );
  }

  return (
    <Page>
      <StrategyProvider url="/portfolio" query={query}>
        <MyStrategiesHeader />
        <div className={style.layout}>
          <ExplorerTabs url="/portfolio" />
          {/* Hidden tag to target in E2E */}
          <Outlet />
        </div>
        {query.isFetching && (
          <div
            className="pointer-events-none fixed opacity-0"
            aria-hidden="true"
            data-testid="fetch-strategies"
          ></div>
        )}
      </StrategyProvider>
    </Page>
  );
};
