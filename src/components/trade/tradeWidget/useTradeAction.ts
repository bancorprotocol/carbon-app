import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { config } from 'services/web3/config';
import { PopulatedTransaction } from 'ethers';
import { TradeActionBNStr, carbonSDK } from 'libs/sdk';
import BigNumber from 'bignumber.js';
import { QueryKey, useQueryClient } from 'libs/queries';
import { useNotifications } from 'hooks/useNotifications';
import { useStore } from 'store';
import { Token } from 'libs/tokens';
import { useApproval } from 'hooks/useApproval';
import { useAccount } from 'wagmi';
import { useEthersSigner } from 'libs/web3/useEthersSigner';

type TradeProps = {
  source: Token;
  target: Token;
  tradeActions: TradeActionBNStr[];
  isTradeBySource: boolean;
  sourceInput: string;
  targetInput: string;
  setIsAwaiting: Dispatch<SetStateAction<boolean>>;
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
  const { address: user } = useAccount();
  const signer = useEthersSigner();

  const calcMinReturn = useCallback(
    (amount: string) => {
      const slippageBn = new BigNumber(slippage).div(100);
      return new BigNumber(1).minus(slippageBn).times(amount).toFixed();
    },
    [slippage]
  );

  const calcMaxInput = useCallback(
    (amount: string) => {
      const slippageBn = new BigNumber(slippage).div(100);
      return new BigNumber(1).plus(slippageBn).times(amount).toFixed();
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
      setIsAwaiting,
    }: TradeProps) => {
      if (!user || !signer) {
        throw new Error('No user or signer');
      }
      try {
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
          QueryKey.approval(
            user,
            source.address,
            config.carbon.carbonController
          )
        );

        await tx.wait();
        void cache.invalidateQueries(QueryKey.balance(user, source.address));
        void cache.invalidateQueries(QueryKey.balance(user, target.address));
      } catch (error) {
        console.error(error);
        setIsAwaiting(false);
      }
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
