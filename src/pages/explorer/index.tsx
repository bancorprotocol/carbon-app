import { Page } from 'components/common/page';
import { Outlet, PathNames, Navigate } from 'libs/routing';
import {
  ExplorerSearch,
  useExplorer,
  useExplorerParams,
} from 'components/explorer';
import { StrategyProvider, useStrategyCtx } from 'hooks/useStrategies';
import { ExplorerTabs } from 'components/explorer/ExplorerTabs';
import { useEffect, useState } from 'react';
import { explorerEvents } from 'services/events/explorerEvents';
import { appRoute } from 'App';
import { Route } from '@tanstack/react-router';
import { explorerTypePage } from './type';
import { explorerOverviewPage } from './type/overview';
import { explorerPortfolioLayout } from './type/portfolio';

export const ExplorerPage = () => {
  const { slug, type } = useExplorerParams();
  const query = useExplorer();
  if (type !== 'wallet' && type !== 'token-pair') {
    return <Navigate to={PathNames.explorer('wallet')} />;
  }

  return (
    <Page hideTitle>
      <StrategyProvider query={query}>
        <ExplorerEvents />
        <div className="flex flex-grow flex-col space-y-30">
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
  const { slug, type } = useExplorerParams();
  const { strategies, isLoading, filter, sort } = useStrategyCtx();

  useEffect(() => {
    if (!mounted) return;
    explorerEvents.typeChange(type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (!slug || isLoading) return;
    explorerEvents.search({ type, slug, strategies, filter, sort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, isLoading]);

  useEffect(() => {
    if (!mounted || !slug) return;
    explorerEvents.resultsFilter({ type, slug, strategies, filter, sort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if (!mounted || !slug) return;
    explorerEvents.resultsSort({ type, slug, strategies, filter, sort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  // This ensure all useEffect have been triggered once before setting mounted to true
  useEffect(() => setMounted(true), [setMounted]);
  return <></>;
};

export const explorerLayout = new Route({
  getParentRoute: () => appRoute,
  path: 'explorer',
});

const explorerRedirect = new Route({
  getParentRoute: () => explorerLayout,
  path: '/',
  component: () => <Navigate to="/explorer/wallet" />,
});

export const explorerPage = new Route({
  getParentRoute: () => explorerLayout,
  path: '$type',
  component: ExplorerPage,
});

export const explorerResultLayout = new Route({
  getParentRoute: () => explorerPage,
  path: '$slug',
});

explorerLayout.addChildren([explorerRedirect, explorerPage]);
explorerPage.addChildren([explorerTypePage, explorerResultLayout]);
explorerResultLayout.addChildren([
  explorerOverviewPage,
  explorerPortfolioLayout,
]);
