import { StrategyContent } from 'components/strategies/overview';
import { useGetUserStrategies } from 'libs/queries';
import { useWeb3 } from 'libs/web3';

export const StrategiesOverviewPage = () => {
  const { user } = useWeb3();
  const strategies = useGetUserStrategies({ user });

  return <StrategyContent strategies={strategies} />;
};
