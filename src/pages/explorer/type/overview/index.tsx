import { StrategyContent } from 'components/strategies/overview';
import { ExplorerEmptyError } from 'components/explorer';
import { useStrategyCtx } from 'hooks/useStrategies';
import { Route } from '@tanstack/react-router';
import { explorerResultLayout } from 'pages/explorer';

export const ExplorerTypeOverviewPage = () => {
  const { strategies, isLoading } = useStrategyCtx();

  return (
    <>
      <StrategyContent
        strategies={strategies}
        isExplorer
        isLoading={isLoading}
        emptyElement={<ExplorerEmptyError />}
      />
    </>
  );
};

export const explorerOverviewPage = new Route({
  getParentRoute: () => explorerResultLayout,
  path: '/',
  component: ExplorerTypeOverviewPage,
});
