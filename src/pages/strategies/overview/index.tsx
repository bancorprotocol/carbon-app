import { StrategyContent } from 'components/strategies/overview';
import { useGetUserStrategies } from 'libs/queries';

export const StrategiesOverviewPage = () => {
  const strategies = useGetUserStrategies();

  return <StrategyContent strategies={strategies} />;
};
