import {
  GetUserApprovalProps,
  useGetUserApproval,
} from 'libs/queries/chain/approval';
import { useCallback, useMemo } from 'react';
import { sanitizeNumber } from 'utils/helpers';
import { NULL_APPROVAL_CONTRACTS } from 'utils/approval';
import config from 'config';
import { useTokens } from './useTokens';
import { useContract } from './useContract';
import { NATIVE_TOKEN_ADDRESS } from 'utils/tokens';
import { formatUnits, TransactionRequest } from 'ethers';

export interface Asset {
  address: string;
  rawAmount: string;
}
export interface TxCustomData {
  spender: string;
  assets: Asset[];
}

export type ApprovalToken = GetUserApprovalProps & {
  amount: string;
};

export type ApprovalTokenResult = ApprovalToken & {
  allowance: string;
  approvalRequired: boolean;
  nullApprovalRequired: boolean;
  isNullApprovalToken: boolean;
};

export const useApproval = (data: ApprovalToken[]) => {
  if (config.network.name === 'TON') data = [];
  const approvalQuery = useGetUserApproval(data);

  const result = useMemo(() => {
    return approvalQuery.map((q, i) => {
      const amount = sanitizeNumber(data[i].amount, data[i].decimals);
      const isNullApprovalToken = NULL_APPROVAL_CONTRACTS.includes(
        data[i].address.toLowerCase(),
      );
      const newData: ApprovalTokenResult | undefined = q.data && {
        ...data[i],
        allowance: q.data.toString(),
        approvalRequired: q.data.lt(amount),
        isNullApprovalToken,
        nullApprovalRequired:
          isNullApprovalToken && q.data.gt(0) && q.data.lt(amount),
      };
      return {
        ...q,
        data: newData,
      };
    });
  }, [approvalQuery, data]);

  const approvalRequired = useMemo(
    () => result.some((x) => x.data?.approvalRequired),
    [result],
  );

  const isPending = useMemo(() => result.some((x) => x.isPending), [result]);
  const isError = useMemo(() => result.some((x) => x.isError), [result]);
  const error = useMemo(() => result.find((x) => x.isError)?.error, [result]);

  return {
    approvalQuery: result,
    approvalRequired,
    isPending,
    isError,
    error,
    tokens: data,
  };
};

/** Extract approval information based on transaction custom data information */
export const useGetApprovalTokens = () => {
  const { getTokenById } = useTokens();
  const { Token } = useContract();

  return useCallback(
    async (user: string, txCustomData: TxCustomData[]) => {
      const approval: Record<string, bigint> = {};

      // Group approvals
      for (const customData of txCustomData) {
        const assets = customData?.assets ?? [];
        const spender = customData?.spender as string;
        for (const asset of assets) {
          const { address, rawAmount } = asset as Asset;
          const key = `${address}_${spender}` as const;
          approval[key] ||= BigInt(0);
          approval[key] += BigInt(rawAmount);
        }
      }

      const approvalTokens: ApprovalToken[] = [];
      for (const [key, amount] of Object.entries(approval)) {
        if (amount === 0n) continue;
        const [address, spender] = key.split('_');
        const token = getTokenById(address);
        if (!token) throw new Error('Could not find token');
        if (address === NATIVE_TOKEN_ADDRESS) continue;
        const allowance = await Token(address).read.allowance(user, spender);
        if (allowance < amount) {
          const tokenAmount = formatUnits(amount, token.decimals);
          approvalTokens.push({ spender, amount: tokenAmount, ...token });
        }
      }
      return approvalTokens;
    },
    [Token, getTokenById],
  );
};

/** Create approval transaction information based on transaction custom data information */
export const useGetApprovalTxs = () => {
  const { getTokenById } = useTokens();
  const { Token } = useContract();
  return useCallback(
    async (user: string, txCustomData: TxCustomData[]) => {
      const approval: Record<string, bigint> = {};

      // Group approvals
      for (const customData of txCustomData) {
        const assets = customData?.assets ?? [];
        const spender = customData?.spender as string;
        for (const asset of assets) {
          const { address, rawAmount } = asset as Asset;
          const key = `${address}_${spender}` as const;
          approval[key] ||= BigInt(0);
          approval[key] += BigInt(rawAmount);
        }
      }

      const approvalTxs: TransactionRequest[] = [];
      for (const [key, amount] of Object.entries(approval)) {
        if (amount === 0n) continue;
        const [address, spender] = key.split('_');
        const token = getTokenById(address);
        if (!token) throw new Error('Could not find token');
        if (address === NATIVE_TOKEN_ADDRESS) continue;

        const allowance = await Token(address).read.allowance(user, spender);
        const isNullApprovalContract = NULL_APPROVAL_CONTRACTS.includes(
          address.toLowerCase(),
        );
        const { populateTransaction } = Token(address).write.approve;
        if (isNullApprovalContract) {
          if (allowance && allowance < amount) {
            const revokeTx = await populateTransaction(spender, '0');
            approvalTxs.push(revokeTx);
          }
        }
        if (allowance < amount) {
          const approval = await populateTransaction(spender, amount);
          approvalTxs.push(approval);
        }
      }
      return approvalTxs;
    },
    [Token, getTokenById],
  );
};
