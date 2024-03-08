import { ActivitySection } from 'components/activity/ActivitySection';
import { useActivity } from 'components/activity/useActivity';
import { ActivitySearchParams } from 'components/activity/utils';
import { useExplorerParams } from 'components/explorer';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { ListOptions, ListProvider } from 'hooks/useList';
import { useStrategyCtx } from 'hooks/useStrategies';
import { Activity } from 'libs/queries/extApi/activity';

export const ExplorerActivityPage = () => {
  const query = useActivity();
  const { type, slug } = useExplorerParams();
  const { strategies, isLoading } = useStrategyCtx();

  if (isLoading || query.isLoading) return 'Loading';

  if (!strategies.length) return <StrategyCreateFirst />;

  const activities = (query.data ?? []).filter((activity) => {
    if (type === 'wallet') {
      if (activity.strategy.owner.toLowerCase() === slug) return true;
      if (activity.changes.owner?.toLowerCase() === slug) return true;
      return false;
    } else {
      const base = activity.strategy.base.address.toLowerCase();
      const quote = activity.strategy.base.address.toLowerCase();
      return slug.includes(base) && slug.includes(quote);
    }
  });

  const listOptions: ListOptions<Activity, ActivitySearchParams> = {
    all: activities,
    defaultLimit: 10,
    filter: (list, searchParams) => {
      const { action } = searchParams;
      return list.filter((activity) => {
        if (action && activity.action !== action) return false;
        return true;
      });
    },
  };

  if (!activities.length) return 'No activities found';

  return (
    <ListProvider {...listOptions}>
      <ActivitySection />
    </ListProvider>
  );
};
