import { Page } from 'components/common/page';
import { Outlet, PathNames, Navigate } from 'libs/routing';
import { ExplorerSearch, useExplorerParams } from 'components/explorer';
import { ExplorerTabs } from 'components/explorer/ExplorerTabs';
import { PairProvider } from 'components/explorer/usePairSearch';

export const ExplorerPage = () => {
  const { slug, type } = useExplorerParams();
  if (type !== 'wallet' && type !== 'token-pair') {
    return <Navigate to={PathNames.explorer('wallet')} />;
  }

  return (
    <PairProvider>
      <Page hideTitle>
        <div className={'flex flex-grow flex-col space-y-30'}>
          <ExplorerSearch />
          {slug && <ExplorerTabs />}
          <Outlet />
        </div>
      </Page>
    </PairProvider>
  );
};
