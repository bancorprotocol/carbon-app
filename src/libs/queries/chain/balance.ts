import { useQueries, useQuery } from '@tanstack/react-query';
import { useWagmi } from 'libs/wagmi';
import { Token } from 'libs/tokens';
import { shrinkToken } from 'utils/tokens';
import config from 'config';
import { QueryKey } from 'libs/queries/queryKey';
import { useContract } from 'hooks/useContract';
import { TEN_SEC_IN_MS } from 'utils/time';
import { NATIVE_TOKEN_ADDRESS } from 'utils/tokens';

export const useGetTokenBalance = (
  token?: Pick<Token, 'address' | 'decimals'>,
) => {
  const address = token?.address;
  const decimals = token?.decimals;
  const { Token } = useContract();
  const { user, provider } = useWagmi();

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

      if (address === NATIVE_TOKEN_ADDRESS) {
        const res = await provider.getBalance(user!);
        return shrinkToken(res.toString(), decimals, true);
      } else {
        const res = await Token(address).read.balanceOf(user);
        return shrinkToken(res.toString(), decimals, true);
      }
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
  const { user, provider } = useWagmi();
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

        if (address === NATIVE_TOKEN_ADDRESS) {
          const res = await provider.getBalance(user);
          return shrinkToken(res.toString(), config.network.gasToken.decimals);
        } else {
          const res = await Token(address).read.balanceOf(user);
          return shrinkToken(res.toString(), decimals);
        }
      },
      meta: {
        errorMessage: 'useGetTokenBalances failed with error:',
      },
      enabled: !!user && !!provider,
    })),
  });
};
