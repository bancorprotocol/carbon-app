import { StrategyContent } from 'components/strategies/overview';
import { StrategyNotFound } from 'components/strategies/overview/StrategyNotFound';
import { useGetUserStrategies } from 'libs/queries';
import { useWeb3 } from 'libs/web3';

export const StrategiesOverviewPage = () => {
  const { user } = useWeb3();
  const strategies = useGetUserStrategies({ user });

  return (
    <StrategyContent
      strategies={strategies.data}
      isLoading={strategies.isLoading}
      emptyElement={<StrategyNotFound />}
    />
  );
};
