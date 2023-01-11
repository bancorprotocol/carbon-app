import { useWeb3 } from 'libs/web3';
import { useMutation, useQueries } from '@tanstack/react-query';
import { NULL_APPROVAL_CONTRACTS, UNLIMITED_WEI } from 'utils/approval';
import { expandToken, shrinkToken } from 'utils/tokens';
import BigNumber from 'bignumber.js';
import { QueryKey } from 'libs/queries/queryKey';
import { config } from 'services/web3/config';
import { useContract } from 'hooks/useContract';
import { Token } from 'libs/tokens';

export type GetUserApprovalProps = Pick<Token, 'address' | 'decimals'> & {
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
          return new BigNumber(shrinkToken(UNLIMITED_WEI, t.decimals));
        }

        const allowance = await Token(t.address).read.allowance(
          user,
          t.spender
        );
        console.log('allowance', allowance.toString());

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
  const { user } = useWeb3();
  const { Token } = useContract();

  return useMutation(
    async ({
      address,
      spender,
      amount,
      decimals,
      isLimited,
    }: SetUserApprovalProps) => {
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

      const isNullApprovalContract = NULL_APPROVAL_CONTRACTS.includes(address);

      if (isNullApprovalContract) {
        const allowanceWei = await Token(address).read.allowance(user, spender);
        if (allowanceWei.gt(0)) {
          const tx = await Token(address).write.approve(spender, '0', {
            // TODO fix GAS limit
            gasLimit: '99999999999999999',
          });
          await tx.wait();
        }
      }
      return Token(address).write.approve(spender, amountWei, {
        // TODO fix GAS limit
        gasLimit: '99999999999999999',
      });
    }
  );
};
