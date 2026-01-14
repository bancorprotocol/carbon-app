import { BigNumberish, TransactionRequest } from 'ethers';
import { useContract } from 'hooks/useContract';
import { useTokens } from 'hooks/useTokens';
import { useCallback, useRef } from 'react';
import { NULL_APPROVAL_CONTRACTS } from 'utils/approval';
import { NATIVE_TOKEN_ADDRESS } from 'utils/tokens';
import config from 'config';
import { useNotifications } from 'hooks/useNotifications';

interface Capabilities {
  alternateGasFees: {
    supported: boolean;
  };
  atomic: {
    status: 'ready' | 'supported' | 'unsupported';
  };
  auxiliaryFunds: {
    supported: boolean;
  };
}

interface Call {
  value: string;
  to: string;
  data: string;
}

interface CallStatus {
  /**
   * - 100: Pending
   * - 200: Confirmed
   * - 400: Failed offchain
   * - 500: Reverted
   * - 600: Partially reverted
   */
  status: 100 | 200 | 400 | 500 | 600;
  version: string;
  id: string;
  chainId: string;
  /** true if the wallet executed the calls atomically. false if the wallet executed the calls non-atomically. */
  atomic: boolean;
  receipts: {
    logs: [];
    status: '0x1' | '0x0';
    blockHash: string;
    blockNumber: number;
    gasUsed: string;
    transactionHash: string;
  }[];
}

interface Asset {
  address: string;
  rawAmount: string;
}

async function repeat<T>(cb: () => Promise<T>): Promise<T> {
  let remaining = 60;
  while (remaining) {
    try {
      const value = await cb();
      if (value) return value;
    } catch {
      // Do nothing
    } finally {
      --remaining;
      await new Promise((res) => setTimeout(res, 1_000));
    }
  }
  throw new Error('Too many attempts');
}

export const useBatchTransaction = () => {
  const { dispatchNotification, dismissAlert } = useNotifications();
  const { getTokenById } = useTokens();
  const { Token } = useContract();

  const allowBatch = useRef<boolean>(null);
  // Note: can can't access user from useWagmi because `useBatchTransaction` is used in useWagmi

  const canBatchTransactions = useCallback(async (user: string) => {
    if (!config.ui.useEIP7702) return false;
    if (!window.ethereum) return false;
    if (typeof allowBatch.current !== 'boolean') {
      try {
        const chainId = `0x${config.network.chainId.toString(16)}`;
        const res: Record<string, Capabilities> = await window.ethereum.request(
          {
            method: 'wallet_getCapabilities',
            params: [user, [chainId]],
          },
        );
        const atomic = res[chainId]?.atomic.status;
        allowBatch.current = atomic === 'ready' || atomic === 'supported';
      } catch {
        allowBatch.current = false;
      }
    }
    return allowBatch.current;
  }, []);

  const batchTransaction = useCallback(
    async (user: string, tx: TransactionRequest | TransactionRequest[]) => {
      if (!user) {
        throw new Error('No user connected');
      }
      if (!window.ethereum) {
        throw new Error('No Eip1193Provider found');
      }
      const toHexValue = (value?: BigNumberish | null) => {
        if (!value) return '0x0';
        return `0x${value.toString(16)}`;
      };
      const txs = Array.isArray(tx) ? tx : [tx];
      const calls: Call[] = [];

      const amounts: Record<string, bigint> = {};

      // Add approvals
      for (const transaction of txs) {
        const assets = transaction.customData?.assets ?? [];
        const spender = transaction.customData.spender as string;
        for (const asset of assets) {
          const { address, rawAmount } = asset as Asset;
          const key = `${address}_${spender}`;
          amounts[key] ||= BigInt(0);
          amounts[key] += BigInt(rawAmount);
        }
      }
      for (const [key, amount] of Object.entries(amounts)) {
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
            calls.push({
              to: revokeTx.to,
              value: toHexValue(revokeTx.value),
              data: revokeTx.data,
            });
          }
        }
        if (allowance < amount) {
          const approval = await populateTransaction(spender, amount);
          calls.push({
            to: approval.to,
            value: toHexValue(approval.value),
            data: approval.data,
          });
        }
      }

      for (const transaction of txs) {
        if (typeof transaction.to !== 'string') continue;
        calls.push({
          to: transaction.to,
          value: toHexValue(transaction.value),
          data: transaction.data ?? '0x0',
        });
      }

      if (calls.length === 1) {
        throw new Error('Use regular sendTransaction for single transaction');
      }

      const canBatch = await canBatchTransactions(user);
      if (!canBatch) {
        throw new Error('Batch transaction not supported');
      }
      const chainId = `0x${config.network.chainId.toString(16)}`;

      const params = [
        {
          version: '2.0.0',
          from: user,
          chainId: chainId,
          atomicRequired: true,
          calls: calls,
        },
      ];
      const { id } = await window.ethereum.request({
        method: 'wallet_sendCalls',
        params: params,
      });
      const notificationId = dispatchNotification('generic', {
        title: 'Batch Transactions',
        description: 'Batch transaction has been submitted.',
        status: 'pending',
        showAlert: true,
        testid: 'batch-transaction',
      });
      const result = await repeat(async () => {
        const res: CallStatus = await window.ethereum.request({
          method: 'wallet_getCallsStatus',
          params: [id],
        });
        if (res.status >= 400) return res;
        if (res.status === 200) return res;
      });
      dismissAlert(notificationId);
      const hash = result?.receipts[0].transactionHash;
      return {
        hash: hash || '',
        wait: async () => true,
      };
    },
    [
      Token,
      canBatchTransactions,
      dismissAlert,
      dispatchNotification,
      getTokenById,
    ],
  );

  return { batchTransaction, canBatchTransactions };
};
