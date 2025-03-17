import { useParams } from '@tanstack/react-router';
import { ActivityLayout } from 'components/activity/ActivityLayout';
import { ActivityProvider } from 'components/activity/ActivityProvider';
import { usePairs } from 'hooks/usePairs';
import { QueryActivityParams } from 'libs/queries/extApi/activity';
import { useMemo } from 'react';

export const ExplorerActivityPage = () => {
  const { slug } = useParams({ from: '/explore/$slug/activity' });
  const pairs = usePairs();
  const type = pairs.getType(slug);
  const params = useMemo(() => {
    const params: QueryActivityParams = {};
    if (type === 'pair') {
      const [base, quote] = slug.split('_');
      params.token0 = base;
      params.token1 = quote;
    } else if (type === 'token') {
      params.token0 = slug;
    } else {
      params.ownerId = slug;
    }
    return params;
  }, [type, slug]);

  return (
    <ActivityProvider params={params} url="/explore/$slug/activity">
      <ActivityLayout
        filters={type === 'wallet' ? ['ids', 'pairs'] : ['ids']}
      />
    </ActivityProvider>
  );
};
