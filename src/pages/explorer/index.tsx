import { Page } from 'components/common/page';
import { Outlet, useNavigate, useParams } from 'libs/routing';
import { StrategyProvider } from 'hooks/useStrategies';
import { ExplorerTabs } from 'components/explorer/ExplorerTabs';
import { ExplorerHeader } from 'components/explorer/ExplorerHeader';
import { useEffect } from 'react';
import { lsService } from 'services/localeStorage';
import { ExplorerSearch } from 'components/explorer/ExplorerSearch';
import { useExplorer } from 'components/explorer/useExplorer';
import config from 'config';
import { carbonEvents } from 'services/events';

const url = '/explore/$slug';
export const ExplorerPage = () => {
  const { slug } = useParams({ from: url });
  const navigate = useNavigate({ from: url });

  useEffect(() => {
    if (!slug) return;
    carbonEvents.explore.exploreSearch({
      explore_search: slug,
    });
  }, [slug]);

  useEffect(() => {
    if (slug) {
      // Set last visited pair
      const [base, quote] = slug.split('_');
      if (base && quote) lsService.setItem('tradePair', [base, quote]);
    }
  }, [slug, navigate]);

  const query = useExplorer();

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
