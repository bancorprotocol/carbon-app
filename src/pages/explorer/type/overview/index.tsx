import { StrategyContent } from 'components/strategies/overview';
import { useStrategyCtx } from 'hooks/useStrategies';
import { NotFound } from 'components/common/NotFound';

export const ExplorerTypeOverviewPage = () => {
  const { strategies, isLoading } = useStrategyCtx();

  const empty = (
    <NotFound
      variant="error"
      title="We couldn't find any strategies"
      text="Try entering a different wallet address or choose a different token pair or reset your filters."
      bordered
    />
  );

  return (
    <>
      <StrategyContent
        strategies={strategies}
        isExplorer
        isLoading={isLoading}
        emptyElement={empty}
      />
    </>
  );
};
