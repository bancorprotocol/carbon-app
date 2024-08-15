import { StrategyContent } from 'components/strategies/overview';
import { useStrategyCtx } from 'hooks/useStrategies';
import { NotFound } from 'components/common/NotFound';

export const ExplorerTypeOverviewPage = () => {
  const { strategies, filteredStrategies, isPending } = useStrategyCtx();
  const isFilterTooNarrow =
    strategies.length > 0 && filteredStrategies.length === 0;

  const empty = isFilterTooNarrow ? (
    <NotFound
      variant="error"
      title="There are no results for your filter"
      text="Please adjust your search and/or filters."
      bordered
    />
  ) : (
    <NotFound
      variant="error"
      title="We couldn't find any strategies"
      text="Try entering a different wallet address or choose a different token pair."
      bordered
    />
  );

  return (
    <>
      <StrategyContent
        strategies={filteredStrategies}
        isExplorer
        isPending={isPending}
        emptyElement={empty}
      />
    </>
  );
};
