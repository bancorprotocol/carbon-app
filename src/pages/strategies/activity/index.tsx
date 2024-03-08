import { ActivitySection } from 'components/activity/ActivitySection';
import { useActivity } from 'components/activity/useActivity';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { useStrategyCtx } from 'hooks/useStrategies';
import { useWeb3 } from 'libs/web3';

export const StrategiesActivityPage = () => {
  const { user } = useWeb3();
  const query = useActivity();
  const { strategies, isLoading } = useStrategyCtx();

  if (isLoading || query.isLoading) return 'Loading';

  if (!strategies.length) return <StrategyCreateFirst />;

  const activities = (query.data ?? []).filter((activity) => {
    if (activity.strategy.owner === user) return true;
    if (activity.changes.owner === user) return true;
    return false;
  });

  if (!activities.length) return 'No activities found';

  return <ActivitySection activities={activities} />;
};
