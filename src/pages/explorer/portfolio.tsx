import { StrategyContent } from 'components/strategies/overview/StrategyContent';
import { useStrategyCtx } from 'hooks/useStrategies';
import { useSearch } from '@tanstack/react-router';

export const ExplorerPortfolio = () => {
  const strategies = useStrategyCtx();
  const search = useSearch({ from: '/explore/portfolio' });

  return (
    <StrategyContent
      strategies={strategies}
      isExplorer
      layout={search.layout}
    />
  );
};
