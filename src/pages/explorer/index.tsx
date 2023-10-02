import { Page } from 'components/common/page';
import { Outlet, PathNames, Navigate } from 'libs/routing';
import {
  ExplorerSearch,
  useExplorer,
  useExplorerParams,
} from 'components/explorer';
import { StrategyProvider } from 'hooks/useStrategies';
import { ExplorerTabs } from 'components/explorer/ExplorerTabs';
export const ExplorerPage = () => {
  const { slug, type } = useExplorerParams();
  const query = useExplorer();
  if (type !== 'wallet' && type !== 'token-pair') {
    return <Navigate to={PathNames.explorer('wallet')} />;
  }

  return (
    <Page hideTitle>
      <StrategyProvider query={query}>
        <div className={'flex flex-grow flex-col space-y-30'}>
          <ExplorerSearch />
          {slug && <ExplorerTabs />}
          <Outlet />
        </div>
      </StrategyProvider>
    </Page>
  );
};
