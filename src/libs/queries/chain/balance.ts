import { useQueries, useQuery } from '@tanstack/react-query';
import { useWeb3 } from 'libs/web3';
import { Token } from 'libs/tokens';
import { shrinkToken } from 'utils/tokens';
import { config } from 'services/web3/config';
import { QueryKey } from 'libs/queries/queryKey';
import { useContract } from 'hooks/useContract';
import { TEN_SEC_IN_MS } from 'utils/time';

export const useGetTokenBalance = (
  token?: Pick<Token, 'address' | 'decimals'>
) => {
  const address = token?.address;
  const decimals = token?.decimals;
  const { Token } = useContract();
  const { user, provider } = useWeb3();

  return useQuery(
    QueryKey.balance(user!, address!),
    async () => {
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

      if (address === config.tokens.ETH) {
        const res = await provider.getBalance(user!);
        return shrinkToken(res.toString(), decimals, true);
      } else {
        const res = await Token(address).read.balanceOf(user);
        return shrinkToken(res.toString(), decimals, true);
      }
    },
    {
      enabled: !!user && !!address && !!decimals && !!provider,
      refetchInterval: TEN_SEC_IN_MS,
      onError: (e: any) =>
        console.error('useGetTokenBalance failed with error:', e),
    }
  );
};

export const useGetTokenBalances = (
  tokens: Pick<Token, 'address' | 'decimals'>[]
) => {
  const { user, provider } = useWeb3();
  const { Token } = useContract();

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

        if (address === config.tokens.ETH) {
          const res = await provider.getBalance(user);
          return shrinkToken(res.toString(), 18);
        } else {
          const res = await Token(address).read.balanceOf(user);
          return shrinkToken(res.toString(), decimals);
        }
      },
      enabled: !!user && !!provider,
      onError: (e: any) =>
        console.error('useGetTokenBalances failed with error:', e),
    })),
  });
};
