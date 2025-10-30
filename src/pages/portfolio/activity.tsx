import { useSearch } from '@tanstack/react-router';
import { ActivityLayout } from 'components/activity/ActivityLayout';
import { ActivityProvider } from 'components/activity/ActivityProvider';
import { usePairs } from 'hooks/usePairs';
import { QueryActivityParams } from 'libs/queries/extApi/activity';
import { useWagmi } from 'libs/wagmi';
import { useMemo } from 'react';

export const PortfolioActivityPage = () => {
  const { user } = useWagmi();
  const { search = '' } = useSearch({ from: '/portfolio/activity' });
  const pairs = usePairs();
  const type = pairs.getType(search);
  const params = useMemo(() => {
    const params: QueryActivityParams = { ownerId: user };
    if (type === 'pair') {
      const [base, quote] = search.split('_');
      params.token0 = base;
      params.token1 = quote;
    } else if (type === 'token') {
      params.token0 = search;
    }
    return params;
  }, [type, search, user]);

  return (
    <ActivityProvider params={params} url="/portfolio/activity">
      <ActivityLayout filters={['ids', 'pairs']} />
    </ActivityProvider>
  );
};
