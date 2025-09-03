import { Page } from 'components/common/page';
import { Outlet } from 'libs/routing';
import { StrategyProvider } from 'hooks/useStrategies';
import { ExplorerTabs } from 'components/explorer/ExplorerTabs';
import { ExplorerHeader } from 'components/explorer/ExplorerHeader';
import { ExplorerSearch } from 'components/explorer/ExplorerSearch';
import config from 'config';
import { useGetAllStrategies } from 'libs/queries';

export const ExplorerPage = () => {
  const query = useGetAllStrategies();

  return (
    <Page hideTitle>
      <StrategyProvider url="/explore" query={query}>
        {config.ui.tradeCount && <ExplorerHeader />}
        <div className="gap-30 flex grow flex-col">
          <ExplorerSearch />
          <ExplorerTabs />
          <Outlet />
        </div>
      </StrategyProvider>
    </Page>
  );
};
