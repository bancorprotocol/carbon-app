import { useContract } from 'hooks/useContract';
import { useWeb3 } from 'web3';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

enum ServerStateKeysEnum {
  Approval = 'approval',
}

type GetUserApprovalProps = {
  tokenAddress: string;
  spenderAddress: string;
};

export const useGetUserApproval = ({
  tokenAddress,
  spenderAddress,
}: GetUserApprovalProps) => {
  const { Token } = useContract();
  const { user } = useWeb3();

  return useQuery(
    [ServerStateKeysEnum.Approval, tokenAddress, spenderAddress, user],
    async () => {
      if (!tokenAddress) {
        throw new Error('useGetUserApproval no tokenAddress provided');
      }
      if (!spenderAddress) {
        throw new Error('useGetUserApproval no spenderAddress provided');
      }

      return Token(tokenAddress).read.allowance(user!, spenderAddress);
    },
    {
      enabled: !!user,
    }
  );
};

export type SetUserApprovalProps = GetUserApprovalProps & {
  amount: string;
  decimals: number;
  symbol: string;
};

export const useSetUserApproval = () => {
  const { Token } = useContract();
  const { user } = useWeb3();
  const cache = useQueryClient();

  return useMutation(
    async ({ tokenAddress, spenderAddress, amount }: SetUserApprovalProps) => {
      if (!tokenAddress) {
        throw new Error('useGetUserApproval no tokenAddress provided');
      }
      if (!spenderAddress) {
        throw new Error('useGetUserApproval no spenderAddress provided');
      }
      if (parseFloat(amount) < 0) {
        throw new Error('useGetUserApproval negative amount provided');
      }

      // TODO fix GAS limit
      return Token(tokenAddress).write.approve(spenderAddress, amount, {
        gasLimit: '99999999999999999',
      });
    },
    {
      onSuccess: (data, variables) =>
        cache.invalidateQueries([
          ServerStateKeysEnum.Approval,
          variables.tokenAddress,
          variables.spenderAddress,
          user,
        ]),
      onError: () => {
        // TODO: proper error handling
        console.error('could not set approval');
      },
    }
  );
};
