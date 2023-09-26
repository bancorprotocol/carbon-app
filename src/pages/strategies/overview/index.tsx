import { StrategyContent } from 'components/strategies/overview';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { StrategyNotFound } from 'components/strategies/overview/StrategyNotFound';
import { useStrategyCtx } from 'hooks/useStrategies';

export const StrategiesOverviewPage = () => {
  const { strategies, isLoading, search } = useStrategyCtx();
  const emptyElement = search ? <StrategyNotFound /> : <StrategyCreateFirst />;

  return (
    <StrategyContent
      strategies={strategies}
      isLoading={isLoading}
      emptyElement={emptyElement}
    />
  );
};
