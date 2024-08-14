import { StrategyContent } from 'components/strategies/overview';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { StrategyNotFound } from 'components/strategies/overview/StrategyNotFound';
import { useStrategyCtx } from 'hooks/useStrategies';

export const StrategiesOverviewPage = () => {
  const { filteredStrategies, isPending, search } = useStrategyCtx();
  const emptyElement = search ? <StrategyNotFound /> : <StrategyCreateFirst />;

  return (
    <StrategyContent
      strategies={filteredStrategies}
      isPending={isPending}
      emptyElement={emptyElement}
    />
  );
};
