import { useQuery } from '@tanstack/react-query';
import { useContract } from 'hooks/useContract';
import { useTokens } from 'hooks/useTokens';
import { QueryKey } from 'libs/queries/queryKey';
import { Token } from 'libs/tokens';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { ONE_DAY_IN_MS } from 'utils/time';

export const useGetTokenData = (address: string) => {
  const { Token } = useContract();

  return useQuery({
    queryKey: QueryKey.token(address),
    queryFn: () => fetchTokenData(Token, address),
    retry: 1,
    staleTime: ONE_DAY_IN_MS,
  });
};

export const useGetMissingTokens = (addresses: string[]) => {
  const { tokensMap, isPending, importTokens } = useTokens();
  const { Token } = useContract();
  const missing = new Set<string>();
  for (const address of addresses) {
    if (!tokensMap.has(address.toLowerCase())) missing.add(address);
  }
  const missingTokens = Array.from(missing);

  return useQuery({
    queryKey: QueryKey.missingTokens(missingTokens),
    queryFn: async () => {
      const getTokens = missingTokens.map((address) => {
        return fetchTokenData(Token, address);
      });
      const tokens: Token[] = [];
      const responses = await Promise.allSettled(getTokens);
      for (const res of responses) {
        if (res.status === 'fulfilled') {
          tokens.push(res.value);
        } else {
          console.error(res.reason);
        }
      }
      importTokens(tokens);
    },
    enabled: !isPending,
  });
};
