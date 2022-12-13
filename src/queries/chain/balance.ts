import { useQueries, useQuery } from '@tanstack/react-query';
import { useContract } from 'hooks/useContract';
import { useWeb3 } from 'web3';
import { Token } from 'tokens';
import { shrinkToken } from 'utils/tokens';
import { ethToken } from 'services/web3/config';
import {
  NotificationType,
  useNotifications,
} from 'notifications/NotificationsProvider';

enum ServerStateKeysEnum {
  Balance = 'balance',
}

export const useGetTokenBalance = (
  token?: Pick<Token, 'address' | 'decimals'>
) => {
  const { dispatchNotification } = useNotifications();
  const address = token?.address;
  const decimals = token?.decimals;
  const { Token } = useContract();
  const { user, provider } = useWeb3();

  return useQuery(
    [ServerStateKeysEnum.Balance, user, address],
    async () => {
      if (address === ethToken) {
        const res = await provider!.getBalance(user!);
        return shrinkToken(res.toString(), 18);
      } else {
        const res = await Token(address!).read.balanceOf(user!);
        return shrinkToken(res.toString(), decimals!);
      }
    },
    {
      enabled: !!user && !!provider && !!token,
      onError: (e: any) => {
        console.error('useGetTokenBalance failed with error:', e);
        dispatchNotification({
          type: NotificationType.Failed,
          title: 'useGetTokenBalance Failed',
          description: e.message || 'Unknown error, please check console logs.',
        });
      },
    }
  );
};

export const useGetTokenBalances = (
  tokens: Pick<Token, 'address' | 'decimals'>[]
) => {
  const { Token } = useContract();
  const { user, provider } = useWeb3();

  return useQueries({
    queries: tokens.map(({ address, decimals }) => ({
      queryKey: [ServerStateKeysEnum.Balance, user, address],
      queryFn: async () => {
        if (address === ethToken) {
          const res = await provider!.getBalance(user!);
          return shrinkToken(res.toString(), 18);
        } else {
          const res = await Token(address).read.balanceOf(user!);
          return shrinkToken(res.toString(), decimals);
        }
      },
      enabled: !!user && !!provider && !!address && !!decimals,
    })),
  });
};
