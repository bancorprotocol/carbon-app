import { NotFound } from 'components/common/NotFound';
import { StrategyContent } from 'components/strategies/overview';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { useStrategyCtx } from 'hooks/useStrategies';

export const StrategiesOverviewPage = () => {
  const { strategies, filteredStrategies, isPending } = useStrategyCtx();
  const isFilterTooNarrow =
    strategies.length > 0 && filteredStrategies.length === 0;

  const emptyElement = isFilterTooNarrow ? (
    <NotFound
      variant="error"
      title="No Strategies Found"
      text="Please adjust your search and/or filters."
      bordered
    />
  ) : (
    <StrategyCreateFirst />
  );

  return (
    <StrategyContent
      strategies={filteredStrategies}
      isPending={isPending}
      emptyElement={emptyElement}
    />
  );
};
