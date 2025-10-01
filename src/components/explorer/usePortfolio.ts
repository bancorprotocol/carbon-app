import { useGetUserStrategies } from 'libs/queries';
import { useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';
import { toPairSlug } from 'utils/pairSearch';

interface Props {
  user?: string;
}

type PortfolioQuery = ReturnType<typeof useGetUserStrategies>;

export const usePortfolio = ({ user }: Props) => {
  const { search = '' } = useSearch({ from: '/portfolio' });
  const query = useGetUserStrategies({ user });

  return useMemo(() => {
    if (!search) return query;
    if (query.isPending) return query;
    const strategies = query.data;
    const data = strategies?.filter(({ base, quote }) => {
      const slug = toPairSlug(base, quote);
      return slug.includes(search);
    });
    return { ...query, data } as PortfolioQuery;
  }, [query, search]);
};
