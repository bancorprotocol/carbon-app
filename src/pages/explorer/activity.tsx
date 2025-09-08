import { useSearch } from '@tanstack/react-router';
import { ActivityLayout } from 'components/activity/ActivityLayout';
import { ActivityProvider } from 'components/activity/ActivityProvider';
import { usePairs } from 'hooks/usePairs';
import { QueryActivityParams } from 'libs/queries/extApi/activity';
import { useMemo } from 'react';

export const ExplorerActivityPage = () => {
  const { search = '' } = useSearch({ from: '/explore/activity' });
  const pairs = usePairs();
  const type = pairs.getType(search);
  const params = useMemo(() => {
    const params: QueryActivityParams = {};
    if (type === 'pair') {
      const [base, quote] = search.split('_');
      params.token0 = base;
      params.token1 = quote;
    } else if (type === 'token') {
      params.token0 = search;
    } else if (type === 'wallet') {
      params.ownerId = search;
    }
    return params;
  }, [type, search]);

  return (
    <div className="grid-area-[list]">
      <ActivityProvider params={params} url="/explore/activity">
        <ActivityLayout
          filters={type === 'wallet' ? ['ids', 'pairs'] : ['ids']}
        />
      </ActivityProvider>
    </div>
  );
};
