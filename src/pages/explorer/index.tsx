import { Page } from 'components/common/page';
import { Outlet, PathNames, Navigate } from 'libs/routing';
import { ExplorerSearch, useExplorerParams } from 'components/explorer';
import { ExplorerTabs } from 'components/explorer/ExplorerTabs';

export const ExplorerPage = () => {
  const { slug, type } = useExplorerParams();
  if (type !== 'wallet' && type !== 'token-pair') {
    return <Navigate to={PathNames.explorer('wallet')} />;
  }

  return (
    <Page hideTitle>
      <div className={'flex flex-grow flex-col space-y-30'}>
        <ExplorerSearch />
        {slug && <ExplorerTabs />}
        <Outlet />
      </div>
    </Page>
  );
};
