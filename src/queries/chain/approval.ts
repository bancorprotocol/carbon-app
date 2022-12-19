import { useContract } from 'hooks/useContract';
import { useWeb3 } from 'web3';
import { useMutation, useQueries } from '@tanstack/react-query';
import { NULL_APPROVAL_CONTRACTS, UNLIMITED_WEI } from 'utils/approval';
import { expandToken, shrinkToken } from 'utils/tokens';
import BigNumber from 'bignumber.js';
import { QueryKey } from '../queryKey';
import { config } from 'services/web3/config';

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

        const isETH = t.tokenAddress === config.tokens.ETH;
        if (isETH) {
          return new BigNumber(shrinkToken(UNLIMITED_WEI, t.decimals));
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
  isLimited: boolean;
};

export const useSetUserApproval = () => {
  const { Token } = useContract();
  const { user } = useWeb3();

  return useMutation(
    async ({
      tokenAddress,
      spenderAddress,
      amount,
      decimals,
      isLimited,
    }: SetUserApprovalProps) => {
      const isETH = tokenAddress === config.tokens.ETH;
      if (isETH) {
        throw new Error('useSetUserApproval cannot approve ETH');
      }
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

      const amountWei = isLimited
        ? expandToken(amount, decimals)
        : UNLIMITED_WEI;

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
      return Token(tokenAddress).write.approve(spenderAddress, amountWei, {
        // TODO fix GAS limit
        gasLimit: '99999999999999999',
      });
    }
  );
};
