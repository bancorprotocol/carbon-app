import { Page } from 'components/common/page';
import { Outlet, Navigate, useNavigate } from 'libs/routing';
import {
  ExplorerSearch,
  useExplorer,
  useExplorerParams,
} from 'components/explorer';
import { StrategyProvider, useStrategyCtx } from 'hooks/useStrategies';
import { ExplorerTabs } from 'components/explorer/ExplorerTabs';
import { useEffect, useState } from 'react';
import { explorerEvents } from 'services/events/explorerEvents';
import { lsService } from 'services/localeStorage';

const url = '/explore/$type';
export const ExplorerPage = () => {
  const { slug, type } = useExplorerParams(url);
  const navigate = useNavigate({ from: url });

  useEffect(() => {
    if (slug && type === 'token-pair') {
      // Set last visited pair
      const [base, quote] = slug.split('_');
      lsService.setItem('tradePair', [base, quote]);
      return;
    }
  }, [slug, navigate, type]);

  const query = useExplorer();
  if (type !== 'wallet' && type !== 'token-pair') {
    return <Navigate to="/explore/$type" params={{ type: 'token-pair' }} />;
  }

  return (
    <Page hideTitle>
      <StrategyProvider query={query}>
        <ExplorerEvents />
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
  const { slug, type } = useExplorerParams(url);
  const { filteredStrategies, isPending, filter, sort } = useStrategyCtx();

  useEffect(() => {
    if (!mounted) return;
    explorerEvents.typeChange(type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (!slug || isPending) return;
    explorerEvents.search({
      type,
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
      type,
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
      type,
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
