import { ActivityProvider } from 'components/activity/ActivityProvider';
import { ActivitySection } from 'components/activity/ActivitySection';
import { useActivity } from 'components/activity/useActivity';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { useExplorerParams } from 'components/explorer';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { useStrategyCtx } from 'hooks/useStrategies';

export const ExplorerActivityPage = () => {
  const query = useActivity();
  const { type, slug } = useExplorerParams();
  const { strategies, isLoading } = useStrategyCtx();

  if (isLoading || query.isLoading) {
    return (
      <CarbonLogoLoading className="h-[100px] self-center justify-self-center" />
    );
  }

  if (!strategies.length) return <StrategyCreateFirst />;

  const activities = (query.data ?? []).filter((activity) => {
    if (type === 'wallet') {
      if (activity.strategy.owner.toLowerCase() === slug) return true;
      if (activity.changes.owner?.toLowerCase() === slug) return true;
      return false;
    } else {
      const base = activity.strategy.base.address.toLowerCase();
      const quote = activity.strategy.quote.address.toLowerCase();
      return slug.includes(base) && slug.includes(quote);
    }
  });

  if (!activities.length) return 'No activities found';

  return (
    <ActivityProvider activities={activities}>
      <ActivitySection
        filters={type === 'wallet' ? ['ids', 'pairs'] : ['ids']}
      />
    </ActivityProvider>
  );
};
