import { Outlet } from 'libs/routing';
import { StrategyProvider } from 'hooks/useStrategies';
import { ExplorerHeader } from 'components/explorer/ExplorerHeader';
import { useGetAllStrategies } from 'libs/queries';
import { StrategyPageTabs } from 'components/strategies/StrategyPageTabs';
import { ExplorerSearch } from 'components/explorer/ExplorerSearch';
import style from './root.module.css';
import config from 'config';

export const ExplorerPage = () => {
  const query = useGetAllStrategies();

  return (
    <div className={style.root}>
      {config.ui.tradeCount && <ExplorerHeader />}
      <ExplorerSearch />
      <StrategyProvider url="/explore" query={query}>
        <StrategyPageTabs />
        <Outlet />
      </StrategyProvider>
    </div>
  );
};
