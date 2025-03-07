import { Page } from 'components/common/page';
import { Outlet, Navigate, useNavigate } from 'libs/routing';
import {
  ExplorerSearch,
  useExplorer,
  useExplorerParams,
} from 'components/explorer';
import { StrategyProvider } from 'hooks/useStrategies';
import { ExplorerTabs } from 'components/explorer/ExplorerTabs';
import { ExplorerHeader } from 'components/explorer/ExplorerHeader';
import { useEffect } from 'react';
import { lsService } from 'services/localeStorage';
import config from 'config';

const url = '/explore/$type';
export const ExplorerPage = () => {
  const { slug, type } = useExplorerParams(url);
  const navigate = useNavigate({ from: url });

  useEffect(() => {
    if (slug && type === 'token-pair') {
      // Set last visited pair
      const [base, quote] = slug.split('_');
      if (base && quote) lsService.setItem('tradePair', [base, quote]);
    }
  }, [slug, navigate, type]);

  const query = useExplorer();
  if (type !== 'wallet' && type !== 'token-pair') {
    return <Navigate to="/explore/$type" params={{ type: 'token-pair' }} />;
  }

  return (
    <Page hideTitle>
      <StrategyProvider query={query}>
        {config.ui.tradeCount && <ExplorerHeader />}
        <div className="gap-30 flex flex-grow flex-col">
          <ExplorerSearch />
          {slug && <ExplorerTabs />}
          <Outlet />
        </div>
      </StrategyProvider>
    </Page>
  );
};
