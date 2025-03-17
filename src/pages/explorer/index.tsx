import { Page } from 'components/common/page';
import { Outlet, useNavigate, useParams } from 'libs/routing';

import { StrategyProvider, useStrategyCtx } from 'hooks/useStrategies';
import { ExplorerTabs } from 'components/explorer/ExplorerTabs';
import { ExplorerHeader } from 'components/explorer/ExplorerHeader';
import { useEffect, useState } from 'react';
import { explorerEvents } from 'services/events/explorerEvents';
import { lsService } from 'services/localeStorage';
import { ExplorerSearch } from 'components/explorer/ExplorerSearch';
import { useExplorer } from 'components/explorer/useExplorer';
import config from 'config';

const url = '/explore/$slug';
export const ExplorerPage = () => {
  const { slug } = useParams({ from: url });
  const navigate = useNavigate({ from: url });

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
        <ExplorerEvents />
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

const ExplorerEvents = () => {
  const [mounted, setMounted] = useState(false);
  const { slug } = useParams({ from: url });
  const { filteredStrategies, isPending, filter, sort } = useStrategyCtx();

  useEffect(() => {
    if (!slug || isPending) return;
    explorerEvents.search({
      slug,
      strategies: filteredStrategies,
      filter,
      sort,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, isPending]);

  useEffect(() => {
    if (!mounted || !slug) return;
    explorerEvents.resultsFilter({
      slug,
      strategies: filteredStrategies,
      filter,
      sort,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if (!mounted || !slug) return;
    explorerEvents.resultsSort({
      slug,
      strategies: filteredStrategies,
      filter,
      sort,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  // This ensure all useEffect have been triggered once before setting mounted to true
  useEffect(() => setMounted(true), [setMounted]);
  return <></>;
};
