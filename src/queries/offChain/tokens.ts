import { useQuery } from '@tanstack/react-query';
import { buildTokenList, fetchTokenLists } from 'tokens';

export const useTokenLists = () =>
  useQuery(['token_lists'], fetchTokenLists, {
    staleTime: 24 * 60 * 60 * 1000,
  });

export const useTokensQuery = () => {
  const tokenListQuery = useTokenLists();
  return useQuery(['tokens'], () => buildTokenList(tokenListQuery.data!), {
    staleTime: 24 * 60 * 60 * 1000,
    enabled: !!tokenListQuery.data?.length,
  });
};
