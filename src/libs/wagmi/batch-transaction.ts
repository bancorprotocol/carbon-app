import { TransactionRequest } from 'ethers';
import { useContract } from 'hooks/useContract';
import { useTokens } from 'hooks/useTokens';
import { useCallback } from 'react';
import { NULL_APPROVAL_CONTRACTS } from 'utils/approval';
import { NATIVE_TOKEN_ADDRESS } from 'utils/tokens';
import config from 'config';

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
   * 100 - Pending
   * 200 - Confirmed
   * 400 - Failed offchain
   * 500 - Reverted
   * 600 - Partially reverted
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
      await new Promise((res) => setTimeout(res, 5_000));
    }
  }
  throw new Error('Too many attempts');
}

export const useBatchTransaction = () => {
  const { getTokenById } = useTokens();
  const { Token } = useContract();
  const batchTransaction = useCallback(
    async (user: string, tx: TransactionRequest) => {
      if (!window.ethereum) {
        throw new Error('No Eip1193Provider found');
      }
      const toHexValue = (value: bigint = BigInt(0)) =>
        `0x${value.toString(16)}`;
      const calls: Call[] = [];
      const spender = tx.customData.spender as string;
      for (const asset of tx.customData?.assets ?? []) {
        const { address, rawAmount } = asset as Asset;
        const amount = BigInt(rawAmount);
        if (amount === 0n) continue;
        const token = getTokenById(address);
        if (!token) throw new Error('Could not find token');
        if (address === NATIVE_TOKEN_ADDRESS) continue;

        const allowance = await Token(address).read.allowance(user, spender);
        const isNullApprovalContract = NULL_APPROVAL_CONTRACTS.includes(
          address.toLowerCase(),
        );
        const { populateTransaction } = Token(address).write.approve;
        if (isNullApprovalContract && allowance > 0) {
          const revokeTx = await populateTransaction(spender, '0');
          calls.push({
            to: revokeTx.to,
            value: toHexValue(revokeTx.value),
            data: revokeTx.data,
          });
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

      const chainId = `0x${config.network.chainId.toString(16)}`;
      const res: Record<string, Capabilities> = await window.ethereum.request({
        method: 'wallet_getCapabilities',
        params: [user, [chainId]],
      });
      const atomic = res[chainId]?.atomic.status;
      if (!atomic || atomic === 'unsupported') {
        throw new Error('Batch transaction not supported');
      }
      const params = [
        {
          version: '2.0.0',
          from: user,
          chainId: chainId,
          atomicRequired: true,
          calls: [
            ...calls,
            {
              to: tx.to,
              value: `0x${tx.value?.toString(16)}`,
              data: tx.data,
            },
          ],
        },
      ];
      const { id } = await window.ethereum.request({
        method: 'wallet_sendCalls',
        params: params,
      });
      const result = await repeat(async () => {
        const res: CallStatus = await window.ethereum.request({
          method: 'wallet_getCallsStatus',
          params: [id],
        });
        if (res.status >= 400) return res;
        if (res.status === 200) return res;
      });
      const hash = result?.receipts[0].transactionHash;
      return {
        hash: hash || '',
        wait: async () => true,
      };
    },
    [Token, getTokenById],
  );

  return { batchTransaction };
};
