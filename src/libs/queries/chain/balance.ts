import { useQueries, useQuery } from '@tanstack/react-query';
import { useWagmi } from 'libs/wagmi';
import { Token } from 'libs/tokens';
import { shrinkToken } from 'utils/tokens';
import { QueryKey } from 'libs/queries/queryKey';
import { TEN_SEC_IN_MS } from 'utils/time';

export const useGetTokenBalance = (
  token?: Pick<Token, 'address' | 'decimals'>,
) => {
  const address = token?.address;
  const decimals = token?.decimals;
  const { user, provider, getBalance } = useWagmi();

  return useQuery({
    queryKey: QueryKey.balance(user!, address!),
    queryFn: async () => {
      if (!user) {
        throw new Error('useGetTokenBalance no user provided');
      }
      if (!provider) {
        throw new Error('useGetTokenBalance no provider provided');
      }
      if (!address) {
        throw new Error('useGetTokenBalance no token address provided');
      }
      if (!decimals) {
        throw new Error('useGetTokenBalance no token decimals provided');
      }
      const res = await getBalance(address);
      return shrinkToken(res.toString(), decimals, true);
    },
    meta: {
      errorMessage: 'useGetTokenBalances failed with error:',
    },
    enabled: !!user && !!address && !!decimals && !!provider,
    refetchInterval: TEN_SEC_IN_MS,
  });
};

export const useGetTokenBalances = (
  tokens: Pick<Token, 'address' | 'decimals'>[],
) => {
  const { user, provider, getBalance } = useWagmi();

  return useQueries({
    queries: tokens.map(({ address, decimals }) => ({
      queryKey: QueryKey.balance(user!, address),
      queryFn: async () => {
        if (!user) {
          throw new Error('useGetTokenBalances no user provided');
        }
        if (!provider) {
          throw new Error('useGetTokenBalances no provider provided');
        }
        const res = await getBalance(address);
        return shrinkToken(res.toString(), decimals);
      },
      meta: {
        errorMessage: 'useGetTokenBalances failed with error:',
      },
      enabled: !!user && !!provider,
    })),
  });
};
