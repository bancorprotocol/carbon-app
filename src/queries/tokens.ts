import { useQuery } from '@tanstack/react-query';
import { fetchTokenLists, TokenList, tokenList } from 'services/tokens';

export const useTokens = () => {
  const query = useQuery(['tokens'], tokenList);
  const tokens = query.data;

  return { tokens };
};

export const useTokenLists = () => {
  const query = useQuery(['token_lists'], fetchTokenLists);
  const tokenLists: TokenList[] | undefined = query.data;

  return { tokenLists };
};
