import { ActivitySection } from 'components/activity/ActivitySection';
import { useActivity } from 'components/activity/useActivity';
import {
  ActivitySearchParams,
  activitySchema,
  filterActivity,
} from 'components/activity/utils';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { ListOptions, ListProvider } from 'hooks/useList';
import { useStrategyCtx } from 'hooks/useStrategies';
import { Activity } from 'libs/queries/extApi/activity';
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

  const listOptions: ListOptions<Activity, ActivitySearchParams> = {
    all: activities,
    defaultLimit: 10,
    schema: activitySchema,
    filter: filterActivity,
  };

  if (!activities.length) return 'No activities found';

  return (
    <ListProvider {...listOptions}>
      <ActivitySection />
    </ListProvider>
  );
};
