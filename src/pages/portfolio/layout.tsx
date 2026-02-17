import { useWagmi } from 'libs/wagmi';
import { WalletConnect } from 'components/common/walletConnect';
import { Page } from 'components/common/page';
import { Outlet } from 'libs/routing';
import { PortfolioHeader } from 'components/strategies/PortfolioHeader';
import {
  baseTabs,
  ExplorerTab,
  ExplorerTabs,
} from 'components/explorer/ExplorerTabs';
import { StrategyProvider } from 'components/strategies/StrategyProvider';
import { ExplorerSearch } from 'components/explorer/ExplorerSearch';
import { usePortfolio } from 'components/explorer/usePortfolio';
import IconMigrate from 'assets/icons/migrate.svg?react';
import config from 'config';

import style from 'components/explorer/ExplorerLayout.module.css';

const tabs: ExplorerTab[] = [...baseTabs];
if (config.ui.useEIP7702) {
  tabs.push({
    label: 'Migration',
    href: 'migrate',
    icon: <IconMigrate className="hidden md:block size-24" />,
    testid: 'migrate-tab',
  });
}

export const PortfolioLayout = () => {
  const { user } = useWagmi();
  const query = usePortfolio({ user });

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
          <ExplorerTabs url="/portfolio" tabs={tabs} />
          <Outlet />
        </Page>
        {/* Hidden tag to target in E2E */}
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
