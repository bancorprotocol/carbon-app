import { useQuery } from '@tanstack/react-query';
import { buildTokenList, fetchTokenLists } from 'services/tokens';

export const useTokenLists = () => useQuery(['token_lists'], fetchTokenLists);

export const useTokensQuery = () => {
  const tokenListQuery = useTokenLists();
  return useQuery(['tokens'], () => buildTokenList(tokenListQuery.data!), {
    enabled: !!tokenListQuery.data?.length,
  });
};
