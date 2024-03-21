import { ActivityProvider } from 'components/activity/ActivityProvider';
import { ActivitySection } from 'components/activity/ActivitySection';
import { useActivity } from 'components/activity/useActivity';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { NotFound } from 'components/common/NotFound';
import { useExplorerParams } from 'components/explorer';
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
  const activities = query.data ?? [];
  if (!activities.length) {
    return (
      <NotFound
        variant="error"
        title="We couldn't find any activities"
        text="Try entering a different wallet address or choose a different token pair or reset your filters."
        bordered
      />
    );
  }

  return (
    <ActivityProvider activities={activities}>
      <ActivitySection
        filters={type === 'wallet' ? ['ids', 'pairs'] : ['ids']}
      />
    </ActivityProvider>
  );
};
