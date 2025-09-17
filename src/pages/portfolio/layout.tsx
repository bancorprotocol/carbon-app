import { useWagmi } from 'libs/wagmi';
import { WalletConnect } from 'components/common/walletConnect';
import { useGetUserStrategies } from 'libs/queries';
import { Page } from 'components/common/page';
import { Outlet } from 'libs/routing';
import { PortfolioHeader } from 'components/strategies/PortfolioHeader';
import { ExplorerTabs } from 'components/explorer/ExplorerTabs';
import { StrategyProvider } from 'components/strategies/StrategyProvider';
import style from 'components/explorer/ExplorerLayout.module.css';
import { ExplorerSearch } from 'components/explorer/ExplorerSearch';

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
    <div className="grid content-start">
      <StrategyProvider url="/portfolio" query={query}>
        <PortfolioHeader />
        <Page className={style.layout}>
          <ExplorerSearch url="/portfolio" />
          <ExplorerTabs url="/portfolio" />
          {/* Hidden tag to target in E2E */}
          <Outlet />
        </Page>
        {query.isFetching && (
          <div
            className="pointer-events-none fixed opacity-0"
            aria-hidden="true"
            data-testid="fetch-strategies"
          ></div>
        )}
      </StrategyProvider>
    </div>
  );
};
