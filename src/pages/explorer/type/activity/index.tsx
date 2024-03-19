import { ActivityProvider } from 'components/activity/ActivityProvider';
import { ActivitySection } from 'components/activity/ActivitySection';
import { useActivity } from 'components/activity/useActivity';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { ExplorerEmptyError, useExplorerParams } from 'components/explorer';
import { QueryActivityParams } from 'libs/queries/extApi/activity';

export const ExplorerActivityPage = () => {
  const { type, slug } = useExplorerParams();
  const params: QueryActivityParams = {};
  if (type === 'wallet') params.ownerId = slug;
  if (type === 'token-pair') {
    const [base, quote] = slug.split('_');
    params.token0 = base;
    params.token1 = quote;
  }
  const query = useActivity(params);

  if (query.isLoading) {
    return (
      <CarbonLogoLoading className="h-[100px] self-center justify-self-center" />
    );
  }

  const activities = (query.data ?? []).filter((activity) => {
    if (type === 'wallet') {
      if (activity.strategy.owner.toLowerCase() === slug) return true;
      if (activity.changes?.owner?.toLowerCase() === slug) return true;
      return false;
    } else {
      const base = activity.strategy.base.address.toLowerCase();
      const quote = activity.strategy.quote.address.toLowerCase();
      return slug.includes(base) && slug.includes(quote);
    }
  });

  if (!activities.length) return <ExplorerEmptyError type="activities" />;

  return (
    <ActivityProvider activities={activities}>
      <ActivitySection
        filters={type === 'wallet' ? ['ids', 'pairs'] : ['ids']}
      />
    </ActivityProvider>
  );
};
