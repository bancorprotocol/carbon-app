import { useWeb3 } from 'libs/web3';
import { useCallback, useMemo } from 'react';
import { config } from 'services/web3/config';
import { PopulatedTransaction } from 'ethers';
import { TradeActionStruct, carbonSDK } from 'libs/sdk';
import BigNumber from 'bignumber.js';
import { QueryKey, useQueryClient } from 'libs/queries';
import { useNotifications } from 'hooks/useNotifications';
import { useStore } from 'store';
import { Token } from 'libs/tokens';
import { useApproval } from 'hooks/useApproval';

type TradeProps = {
  source: Token;
  target: Token;
  tradeActions: TradeActionStruct[];
  isTradeBySource: boolean;
  sourceInput: string;
  targetInput: string;
};

type Props = Pick<TradeProps, 'source' | 'isTradeBySource' | 'sourceInput'> & {
  onSuccess?: Function;
};

export const useTradeAction = ({
  source,
  isTradeBySource,
  sourceInput,
  onSuccess,
}: Props) => {
  const {
    trade: {
      settings: { slippage, deadline },
    },
  } = useStore();
  const { dispatchNotification } = useNotifications();
  const cache = useQueryClient();
  const { user, signer } = useWeb3();

  const calcMinReturn = useCallback(
    (amount: string) => {
      const slippageBn = new BigNumber(slippage).div(100);
      return new BigNumber(1).minus(slippageBn).times(amount).toString();
    },
    [slippage]
  );

  const calcMaxInput = useCallback(
    (amount: string) => {
      const slippageBn = new BigNumber(slippage).div(100);
      return new BigNumber(1).plus(slippageBn).times(amount).toString();
    },
    [slippage]
  );

  const calcDeadline = useCallback((value: string) => {
    const deadlineInMs = new BigNumber(value).times(60).times(1000);
    return deadlineInMs.plus(Date.now()).toString();
  }, []);

  const trade = useCallback(
    async ({
      source,
      target,
      isTradeBySource,
      sourceInput,
      targetInput,
      tradeActions,
    }: TradeProps) => {
      if (!user || !signer) {
        throw new Error('No user or signer');
      }

      let unsignedTx: PopulatedTransaction;
      if (isTradeBySource) {
        unsignedTx = await carbonSDK.composeTradeBySourceTransaction(
          source.address,
          target.address,
          tradeActions,
          calcDeadline(deadline),
          calcMinReturn(targetInput)
        );
      } else {
        unsignedTx = await carbonSDK.composeTradeByTargetTransaction(
          source.address,
          target.address,
          tradeActions,
          calcDeadline(deadline),
          calcMaxInput(sourceInput)
        );
      }

      const tx = await signer.sendTransaction(unsignedTx);
      dispatchNotification('trade', {
        txHash: tx.hash,
        amount: sourceInput,
        from: source.symbol,
        to: target.symbol,
      });
      onSuccess?.(tx.hash);

      void cache.invalidateQueries(
        QueryKey.approval(user, source.address, config.carbon.carbonController)
      );

      await tx.wait();
      void cache.invalidateQueries(QueryKey.balance(user, source.address));
      void cache.invalidateQueries(QueryKey.balance(user, target.address));
    },
    [
      cache,
      calcDeadline,
      calcMaxInput,
      calcMinReturn,
      deadline,
      dispatchNotification,
      onSuccess,
      signer,
      user,
    ]
  );

  const approvalTokens = useMemo(
    () => [
      {
        ...source,
        spender: config.carbon.carbonController,
        amount: isTradeBySource ? sourceInput : calcMaxInput(sourceInput),
      },
    ],
    [calcMaxInput, sourceInput, isTradeBySource, source]
  );

  const approval = useApproval(approvalTokens);

  return {
    trade,
    calcMaxInput,
    calcMinReturn,
    calcDeadline,
    approval,
  };
};
