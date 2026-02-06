import { Outlet } from 'libs/routing';
import { ExplorerHeader } from 'components/explorer/ExplorerHeader';
import { ExplorerTabs, baseTabs } from 'components/explorer/ExplorerTabs';
import { ExplorerSearch } from 'components/explorer/ExplorerSearch';
import { StrategyProvider } from 'components/strategies/StrategyProvider';
import { Page } from 'components/common/page';
import { useExplorer } from 'components/explorer/useExplorer';
import style from 'components/explorer/ExplorerLayout.module.css';
import config from 'config';

export const ExplorerLayout = () => {
  const query = useExplorer();

  return (
    <>
      {config.ui.tradeCount && <ExplorerHeader />}
      <Page className={style.layout}>
        <ExplorerSearch url="/explore" />
        <ExplorerTabs url="/explore" tabs={baseTabs} />
        <StrategyProvider url="/explore" query={query}>
          <Outlet />
        </StrategyProvider>
      </Page>
    </>
  );
};
