import { useContract } from 'hooks/useContract';
import { useWeb3 } from 'web3';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { NULL_APPROVAL_CONTRACTS } from 'utils/approval';
import { expandToken, shrinkToken } from 'utils/tokens';
import BigNumber from 'bignumber.js';
import { QueryKey } from '../queryKey';

export type GetUserApprovalProps = {
  tokenAddress: string;
  spenderAddress: string;
  decimals: number;
};

export const useGetUserApproval = (data: GetUserApprovalProps[]) => {
  const { Token } = useContract();
  const { user } = useWeb3();

  return useQueries({
    queries: data.map((t) => ({
      queryKey: QueryKey.approval(user!, t.tokenAddress, t.spenderAddress),
      queryFn: async () => {
        if (!user) {
          throw new Error('useGetUserApproval no user provided');
        }
        if (!t.tokenAddress) {
          throw new Error('useGetUserApproval no tokenAddress provided');
        }
        if (!t.spenderAddress) {
          throw new Error('useGetUserApproval no spenderAddress provided');
        }

        const allowance = await Token(t.tokenAddress).read.allowance(
          user,
          t.spenderAddress
        );

        return new BigNumber(shrinkToken(allowance.toString(), t.decimals));
      },
    })),
  });
};

export type SetUserApprovalProps = GetUserApprovalProps & {
  amount: string;
};

export const useSetUserApproval = () => {
  const { Token } = useContract();
  const { user } = useWeb3();
  const cache = useQueryClient();

  return useMutation(
    async ({
      tokenAddress,
      spenderAddress,
      amount,
      decimals,
    }: SetUserApprovalProps) => {
      if (!user) {
        throw new Error('useSetUserApproval no user provided');
      }
      if (!tokenAddress) {
        throw new Error('useSetUserApproval no tokenAddress provided');
      }
      if (!spenderAddress) {
        throw new Error('useSetUserApproval no spenderAddress provided');
      }
      if (parseFloat(amount) < 0) {
        throw new Error('useSetUserApproval negative amount provided');
      }

      const amountWei = expandToken(amount, decimals);

      const isNullApprovalContract =
        NULL_APPROVAL_CONTRACTS.includes(tokenAddress);

      if (isNullApprovalContract) {
        const allowanceWei = await Token(tokenAddress).read.allowance(
          user,
          spenderAddress
        );
        if (allowanceWei.gt(0)) {
          const tx = await Token(tokenAddress).write.approve(
            spenderAddress,
            '0',
            {
              // TODO fix GAS limit
              gasLimit: '99999999999999999',
            }
          );
          await tx.wait();
        }
      }

      const tx = await Token(tokenAddress).write.approve(
        spenderAddress,
        amountWei,
        {
          // TODO fix GAS limit
          gasLimit: '99999999999999999',
        }
      );

      await tx.wait();
      return tx;
    },
    {
      onSuccess: (data, variables) =>
        cache.invalidateQueries({
          queryKey: QueryKey.approval(
            user!,
            variables.tokenAddress,
            variables.spenderAddress
          ),
        }),
      onError: () => {
        // TODO: proper error handling
        console.error('could not set approval');
      },
    }
  );
};
