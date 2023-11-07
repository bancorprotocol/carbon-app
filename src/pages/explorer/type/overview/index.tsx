import { StrategyContent } from 'components/strategies/overview';
import { ExplorerEmptyError } from 'components/explorer';
import { useStrategyCtx } from 'hooks/useStrategies';

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
