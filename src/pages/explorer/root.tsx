import { Outlet } from 'libs/routing';
import { ExplorerHeader } from 'components/explorer/ExplorerHeader';
import { useGetAllStrategies } from 'libs/queries';
import { ExplorerTabs } from 'components/explorer/ExplorerTabs';
import { ExplorerSearch } from 'components/explorer/ExplorerSearch';
import { StrategyProvider } from 'components/strategies/StrategyProvider';
import style from './root.module.css';
import config from 'config';

export const ExplorerPage = () => {
  const query = useGetAllStrategies();

  return (
    <div className={style.root}>
      {config.ui.tradeCount && <ExplorerHeader />}
      <ExplorerSearch />
      <ExplorerTabs />
      <StrategyProvider url="/explore" query={query}>
        <Outlet />
      </StrategyProvider>
    </div>
  );
};
