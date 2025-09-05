import { Outlet } from 'libs/routing';
import { StrategyProvider } from 'hooks/useStrategies';
import { ExplorerHeader } from 'components/explorer/ExplorerHeader';
import { useGetAllStrategies } from 'libs/queries';
import config from 'config';
import { StrategyPageTabs } from 'components/strategies/StrategyPageTabs';

export const ExplorerPage = () => {
  const query = useGetAllStrategies();

  return (
    <div className="grid gap-24 mx-auto max-w-[1280px] w-full content-start">
      {config.ui.tradeCount && <ExplorerHeader />}
      <StrategyPageTabs />
      <StrategyProvider url="/explore" query={query}>
        <div className="gap-30 grid">
          <Outlet />
        </div>
      </StrategyProvider>
    </div>
  );
};
