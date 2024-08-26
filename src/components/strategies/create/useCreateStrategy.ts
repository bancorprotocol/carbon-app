import { useMemo, useState } from 'react';
import { QueryKey, useQueryClient } from 'libs/queries';
import { useCreateStrategyQuery } from 'libs/queries';
import { StrategyType, useNavigate } from 'libs/routing';
import { useWagmi } from 'libs/wagmi';
import { useApproval } from 'hooks/useApproval';
import { useModal } from 'hooks/useModal';
import { useNotifications } from 'hooks/useNotifications';
import { handleTxStatusAndRedirectToOverview } from 'components/strategies/create/utils';
import { BaseOrder } from 'components/strategies/common/types';
import { Token } from 'libs/tokens';
import { useStrategyEvent } from './useStrategyEventData';
import { carbonEvents } from 'services/events';
import { marketPricePercent } from '../marketPriceIndication/useMarketPercent';
import { useMarketPrice } from 'hooks/useMarketPrice';
import config from 'config';

const spenderAddress = config.addresses.carbon.carbonController;

export type UseStrategyCreateReturn = ReturnType<typeof useCreateStrategy>;

interface Props {
  type: StrategyType;
  base?: Token;
  quote?: Token;
  order0: BaseOrder;
  order1: BaseOrder;
}

export const useCreateStrategy = (props: Props) => {
  const { type, base, quote, order0, order1 } = props;
  const cache = useQueryClient();
  const navigate = useNavigate();
  const { user, provider } = useWagmi();
  const { openModal } = useModal();
  const { dispatchNotification } = useNotifications();
  const { marketPrice } = useMarketPrice({ base, quote });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const approvalTokens = useMemo(() => {
    const arr = [];

    if (base && +order1.budget > 0) {
      arr.push({
        ...base,
        spender: spenderAddress,
        amount: order1.budget,
      });
    }
    if (quote && +order0.budget > 0) {
      arr.push({
        ...quote,
        spender: spenderAddress,
        amount: order0.budget,
      });
    }

    return arr;
  }, [base, quote, order0.budget, order1.budget]);

  const strategyData = useStrategyEvent({ type, base, quote, order0, order1 });
  const buyMarketPricePercentage = {
    min: marketPricePercent(order0.min, marketPrice),
    max: marketPricePercent(order0.max, marketPrice),
    price: marketPricePercent('', marketPrice),
  };
  const sellMarketPricePercentage = {
    min: marketPricePercent(order1.min, marketPrice),
    max: marketPricePercent(order1.max, marketPrice),
    price: marketPricePercent('', marketPrice),
  };
  const approval = useApproval(approvalTokens);
  const mutation = useCreateStrategyQuery();

  const createStrategy = async () => {
    if (!base || !quote) return;
    if (!user) return openModal('wallet', undefined);

    const onConfirm = () => {
      return mutation.mutate(
        {
          base: base,
          quote: quote,
          order0: {
            budget: order0.budget,
            min: order0.min,
            marginalPrice: order0.marginalPrice ?? '',
            max: order0.max,
          },
          order1: {
            budget: order1.budget,
            min: order1.min,
            marginalPrice: order1.marginalPrice ?? '',
            max: order1.max,
          },
        },
        {
          onSuccess: async (tx) => {
            handleTxStatusAndRedirectToOverview(setIsProcessing, navigate);
            dispatchNotification('createStrategy', { txHash: tx.hash });
            await tx.wait();
            cache.invalidateQueries({
              queryKey: QueryKey.balance(user, base.address),
            });
            cache.invalidateQueries({
              queryKey: QueryKey.balance(user, quote.address),
            });
            navigate({ to: '/', search: {}, params: {} });
            carbonEvents.strategy.strategyCreate({
              ...strategyData,
              buyMarketPricePercentage,
              sellMarketPricePercentage,
            });
          },
          onError: (e: any) => {
            setIsProcessing(false);
            console.error('create mutation failed', e);
            // TODO add error notification
            // TODO handle user rejected transaction
            // dispatchNotification('generic', {
            //   status: 'failed',
            //   title: 'Strategy creation failed',
            //   description:
            //     e.message || 'Unknown error - please try again or contact support',
            //   showAlert: true,
            // });
          },
        }
      );
    };

    if (!+order0.budget && !+order1.budget) {
      return openModal('genericInfo', {
        title: 'Empty Strategy Warning',
        text: 'You are about to create a strategy with no associated budget. It will be inactive until you deposit funds.',
        variant: 'warning',
        onConfirm,
      });
    }

    if (approval.approvalRequired) {
      return openModal('txConfirm', {
        approvalTokens,
        onConfirm,
        buttonLabel: 'Create Doron',
        eventData: {
          ...strategyData,
          productType: 'strategy',
          approvalTokens,
          buyToken: base,
          sellToken: quote,
          blockchainNetwork: provider?.network?.name || '',
        },
        context: 'createStrategy',
      });
    }
    return onConfirm();
  };

  return {
    isLoading: approval.isPending && !!user,
    isAwaiting: mutation.isPending,
    createStrategy,
    isProcessing,
  };
};
