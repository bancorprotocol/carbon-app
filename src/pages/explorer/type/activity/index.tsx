import { ActivityProvider } from 'components/activity/ActivityProvider';
import { ActivitySection } from 'components/activity/ActivitySection';
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
  return (
    <ActivityProvider params={params}>
      <ActivitySection
        filters={type === 'wallet' ? ['ids', 'pairs'] : ['ids']}
      />
    </ActivityProvider>
  );
};
