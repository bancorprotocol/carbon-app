import { Outlet } from 'libs/routing';
import { ExplorerHeader } from 'components/explorer/ExplorerHeader';
import { useGetAllStrategies } from 'libs/queries';
import { ExplorerTabs } from 'components/explorer/ExplorerTabs';
import { ExplorerSearch } from 'components/explorer/ExplorerSearch';
import { StrategyProvider } from 'components/strategies/StrategyProvider';
import style from 'components/explorer/ExplorerLayout.module.css';
import config from 'config';
import { Page } from 'components/common/page';

export const ExplorerLayout = () => {
  const query = useGetAllStrategies();

  return (
    <Page className={style.layout}>
      {config.ui.tradeCount && <ExplorerHeader />}
      <ExplorerSearch />
      <ExplorerTabs url="/explore" />
      <StrategyProvider url="/explore" query={query}>
        <Outlet />
      </StrategyProvider>
    </Page>
  );
};
