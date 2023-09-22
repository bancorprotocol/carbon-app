import { StrategyContent } from 'components/strategies/overview';
import { StrategyNotFound } from 'components/strategies/overview/StrategyNotFound';
import { useStrategyCtx } from 'hooks/useStrategies';

export const StrategiesOverviewPage = () => {
  const { strategies, isLoading } = useStrategyCtx();
  return (
    <StrategyContent
      strategies={strategies}
      isLoading={isLoading}
      emptyElement={<StrategyNotFound />}
    />
  );
};
