import { useWagmi } from 'libs/wagmi';
import { useCallback, useMemo } from 'react';
import config from 'config';
import { TradeActionBNStr } from 'libs/sdk';
import { SafeDecimal } from 'libs/safedecimal';
import { QueryKey, useQueryClient, useTradeQuery } from 'libs/queries';
import { useNotifications } from 'hooks/useNotifications';
import { useStore } from 'store';
import { Token } from 'libs/tokens';
import { useApproval } from 'hooks/useApproval';
import { useRestrictedCountry } from 'hooks/useRestrictedCountry';

const spender = config.ui.useOpenocean
  ? config.addresses.openocean
  : config.addresses.carbon.carbonController;

type TradeProps = {
  source: Token;
  target: Token;
  tradeActions: TradeActionBNStr[];
  isTradeBySource: boolean;
  sourceInput: string;
  targetInput: string;
  quoteId?: string;
};

type Props = Pick<TradeProps, 'source' | 'isTradeBySource' | 'sourceInput'> & {
  onSuccess?: (hash: string) => any;
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
  const { checkRestriction } = useRestrictedCountry();
  const { dispatchNotification } = useNotifications();
  const cache = useQueryClient();
  const { user } = useWagmi();

  const calcMinReturn = useCallback(
    (amount: string) => {
      const slippageBn = new SafeDecimal(slippage).div(100);
      return new SafeDecimal(1).minus(slippageBn).times(amount).toString();
    },
    [slippage],
  );

  const calcMaxInput = useCallback(
    (amount: string) => {
      const slippageBn = new SafeDecimal(slippage).div(100);
      return new SafeDecimal(1).plus(slippageBn).times(amount).toString();
    },
    [slippage],
  );

  const calcDeadline = useCallback((value: string) => {
    const deadlineInMs = new SafeDecimal(value).times(60).times(1000);
    return deadlineInMs.plus(Date.now()).toString();
  }, []);

  const mutation = useTradeQuery();

  const trade = async ({
    source,
    target,
    isTradeBySource,
    sourceInput,
    targetInput,
    tradeActions,
    quoteId,
  }: TradeProps) => {
    const checked = await checkRestriction();
    if (!checked) return;
    if (!user) {
      throw new Error('No user');
    }

    return mutation.mutate(
      {
        source,
        target,
        isTradeBySource,
        tradeActions,
        sourceInput,
        targetInput,
        deadline,
        calcDeadline,
        calcMaxInput,
        calcMinReturn,
        quoteId,
      },
      {
        onSuccess: async (tx) => {
          dispatchNotification('trade', {
            txHash: tx.hash,
            amount: sourceInput,
            from: source.symbol,
            to: target.symbol,
          });

          await tx.wait();
          onSuccess?.(tx.hash);
          cache.invalidateQueries({
            queryKey: QueryKey.balance(user, source.address),
          });
          cache.invalidateQueries({
            queryKey: QueryKey.balance(user, target.address),
          });
          cache.invalidateQueries({
            queryKey: QueryKey.approval(user, source.address, spender),
          });
        },
        onError: (e: any) => {
          console.error(e);
        },
      },
    );
  };

  const approvalTokens = useMemo(
    () => [
      {
        ...source,
        spender: spender,
        amount: isTradeBySource ? sourceInput : calcMaxInput(sourceInput),
      },
    ],
    [calcMaxInput, sourceInput, isTradeBySource, source],
  );

  const approval = useApproval(approvalTokens);

  return {
    trade,
    calcMaxInput,
    calcMinReturn,
    calcDeadline,
    approval,
    isAwaiting: mutation.isPending,
  };
};
