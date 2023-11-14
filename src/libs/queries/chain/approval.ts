import { useWeb3 } from 'libs/web3';
import { useMutation, useQueries } from '@tanstack/react-query';
import { NULL_APPROVAL_CONTRACTS, UNLIMITED_WEI } from 'utils/approval';
import { expandToken, shrinkToken } from 'utils/tokens';
import { SafeDecimal } from 'libs/safedecimal';
import { QueryKey } from 'libs/queries/queryKey';
import { config } from 'services/web3/config';
import { useContract } from 'hooks/useContract';
import { Token } from 'libs/tokens';
import { ContractTransaction } from 'ethers';

export type GetUserApprovalProps = Pick<
  Token,
  'address' | 'decimals' | 'symbol'
> & {
  spender: string;
};

export const useGetUserApproval = (data: GetUserApprovalProps[]) => {
  const { user } = useWeb3();
  const { Token } = useContract();

  return useQueries({
    queries: data.map((t) => ({
      queryKey: QueryKey.approval(user!, t.address, t.spender),
      queryFn: async () => {
        if (!user) {
          throw new Error('useGetUserApproval no user provided');
        }
        if (!t.address) {
          throw new Error('useGetUserApproval no tokenAddress provided');
        }
        if (!t.spender) {
          throw new Error('useGetUserApproval no spenderAddress provided');
        }

        const isETH = t.address === config.tokens.ETH;
        if (isETH) {
          return new SafeDecimal(shrinkToken(UNLIMITED_WEI, t.decimals));
        }

        const allowance = await Token(t.address).read.allowance(
          user,
          t.spender
        );

        return new SafeDecimal(shrinkToken(allowance.toString(), t.decimals));
      },
      enabled: !!user,
      onError: (error: any) => {
        console.error('useGetUserApproval error', error);
      },
    })),
  });
};

export type SetUserApprovalProps = GetUserApprovalProps & {
  amount: string;
  isLimited: boolean;
};

export const useSetUserApproval = () => {
  const { user } = useWeb3();
  const { Token } = useContract();

  return useMutation(
    async ({
      address,
      spender,
      amount,
      decimals,
      isLimited,
    }: SetUserApprovalProps): Promise<
      [ContractTransaction, ContractTransaction | undefined]
    > => {
      const isETH = address === config.tokens.ETH;
      if (isETH) {
        throw new Error('useSetUserApproval cannot approve ETH');
      }
      if (!user) {
        throw new Error('useSetUserApproval no user provided');
      }
      if (!address) {
        throw new Error('useSetUserApproval no tokenAddress provided');
      }
      if (!spender) {
        throw new Error('useSetUserApproval no spenderAddress provided');
      }

      if (parseFloat(amount) < 0) {
        throw new Error('useSetUserApproval negative amount provided');
      }

      const amountWei = isLimited
        ? expandToken(amount, decimals)
        : UNLIMITED_WEI;

      const isNullApprovalContract = NULL_APPROVAL_CONTRACTS.includes(
        address.toLowerCase()
      );

      let revokeTx = undefined;

      if (isNullApprovalContract) {
        const allowanceWei = await Token(address).read.allowance(user, spender);
        if (allowanceWei.gt(0)) {
          revokeTx = await Token(address).write.approve(spender, '0');
          await revokeTx.wait();
        }
      }
      const approveTx = await Token(address).write.approve(spender, amountWei);

      return [approveTx, revokeTx];
    }
  );
};
