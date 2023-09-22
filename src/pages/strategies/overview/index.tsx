import { StrategyContent } from 'components/strategies/overview';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { useStrategyCtx } from 'hooks/useStrategies';

export const StrategiesOverviewPage = () => {
  const { strategies, isLoading } = useStrategyCtx();
  return (
    <StrategyContent
      strategies={strategies}
      isLoading={isLoading}
      emptyElement={<StrategyCreateFirst />}
    />
  );
};
