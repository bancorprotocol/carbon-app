import { StrategyContent } from 'components/strategies/overview';
import { useStrategyCtx } from 'hooks/useStrategies';
import { NotFound } from 'components/common/NotFound';

export const ExplorerTypeOverviewPage = () => {
  const { strategies, filteredStrategies, isPending } = useStrategyCtx();
  const isFilterTooNarrow =
    strategies.length > 0 && filteredStrategies.length === 0;

  const emptyProps = isFilterTooNarrow
    ? {
        title: 'There are no results for your filter',
        text: 'Please adjust your search and/or filters.',
      }
    : {
        title: "We couldn't find any strategies",
        text: 'Try entering a different wallet address or choose a different token pair.',
      };

  const empty = <NotFound variant="error" bordered {...emptyProps} />;

  return (
    <StrategyContent
      strategies={filteredStrategies}
      isExplorer
      isPending={isPending}
      emptyElement={empty}
    />
  );
};
