import { StrategyContent } from 'components/strategies/overview';
import { ExplorerEmptyError, useExplorer } from 'components/explorer';

export const ExplorerTypeOverviewPage = () => {
  const { strategies, isLoading } = useExplorer();
  return (
    <StrategyContent
      strategies={strategies}
      isExplorer
      isLoading={isLoading}
      emptyElement={<ExplorerEmptyError />}
    />
  );
};
