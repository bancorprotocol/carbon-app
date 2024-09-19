import { ActivityLayout } from 'components/activity/ActivityLayout';
import { ActivityProvider } from 'components/activity/ActivityProvider';
import { useExplorerParams } from 'components/explorer';
import { QueryActivityParams } from 'libs/queries/extApi/activity';

export const ExplorerActivityPage = () => {
  const { type, slug } = useExplorerParams('/explore/$type/$slug/activity');
  const params: QueryActivityParams = {};
  if (type === 'wallet') params.ownerId = slug;
  if (type === 'token-pair') {
    const [base, quote] = slug!.split('_');
    params.token0 = base;
    params.token1 = quote;
  }
  return (
    <ActivityProvider params={params} url="/explore/$type/$slug/activity">
      <ActivityLayout
        filters={type === 'wallet' ? ['ids', 'pairs'] : ['ids']}
      />
    </ActivityProvider>
  );
};
