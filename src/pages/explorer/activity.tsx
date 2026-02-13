import { useSearch } from '@tanstack/react-router';
import { ActivityLayout } from 'components/activity/ActivityLayout';
import { ActivityProvider } from 'components/activity/ActivityProvider';
import { extractExplorerPair, usePairs } from 'hooks/usePairs';
import { QueryActivityParams } from 'libs/queries/extApi/activity';
import { useMemo } from 'react';

export const ExplorerActivityPage = () => {
  const { search = '' } = useSearch({ from: '/explore/activity' });
  const pairs = usePairs();
  const type = pairs.getType(search);
  const params = useMemo(() => {
    const params: QueryActivityParams = {};
    if (type === 'pair') {
      const [base, quote] = extractExplorerPair(search);
      params.token0 = base;
      params.token1 = quote;
    } else if (type === 'token') {
      params.token0 = search;
    } else if (type === 'wallet') {
      params.ownerId = search;
    }
    return params;
  }, [type, search]);

  const filters = useMemo(() => {
    if (type === 'pair') return ['ids' as const];
    return ['ids' as const, 'pairs' as const];
  }, [type]);

  return (
    <ActivityProvider params={params} url="/explore/activity">
      <ActivityLayout filters={filters} />
    </ActivityProvider>
  );
};
