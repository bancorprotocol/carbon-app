import { useMemo, useState } from 'react';
import { CreateStrategyParams, QueryKey, useQueryClient } from 'libs/queries';
import { useCreateStrategyQuery } from 'libs/queries';
import { useWagmi } from 'libs/wagmi';
import { useApproval } from 'hooks/useApproval';
import { useModal } from 'hooks/useModal';
import { useNotifications } from 'hooks/useNotifications';
import { FormStaticOrder } from 'components/strategies/common/types';
import { Token } from 'libs/tokens';
import config from 'config';
import { carbonEvents } from 'services/events';
import { handleTxStatusAndRedirectToOverview } from './utils';
import { getStrategyType } from '../common/utils';
import { useNavigate } from '@tanstack/react-router';

const spenderAddress = config.addresses.carbon.carbonController;

export type UseStrategyCreateReturn = ReturnType<typeof useCreateStrategy>;

export const toCreateStrategyParams = (
  base: Token,
  quote: Token,
  buy: FormStaticOrder,
  sell: FormStaticOrder,
): CreateStrategyParams => ({
  base: base.address,
  quote: quote.address,
  buy: {
    budget: buy.budget || '0',
    min: buy.min || '0',
    max: buy.max || '0',
    marginalPrice: buy.marginalPrice ?? '',
  },
  sell: {
    budget: sell.budget || '0',
    min: sell.min || '0',
    max: sell.max || '0',
    marginalPrice: sell.marginalPrice ?? '',
  },
});

interface Props {
  base?: Token;
  quote?: Token;
  buy: FormStaticOrder;
  sell: FormStaticOrder;
}

export const useCreateStrategy = (props: Props) => {
  const { base, quote, buy, sell } = props;
  const cache = useQueryClient();
  const navigate = useNavigate();
  const { user } = useWagmi();
  const { openModal } = useModal();
  const { dispatchNotification } = useNotifications();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const approvalTokens = useMemo(() => {
    const arr = [];

    if (base && +sell.budget > 0) {
      arr.push({
        ...base,
        spender: spenderAddress,
        amount: sell.budget,
      });
    }
    if (quote && +buy.budget > 0) {
      arr.push({
        ...quote,
        spender: spenderAddress,
        amount: buy.budget,
      });
    }

    return arr;
  }, [base, quote, buy.budget, sell.budget]);

  const approval = useApproval(approvalTokens);
  const mutation = useCreateStrategyQuery();

  const createStrategy = async () => {
    if (!base || !quote) return;
    if (!user) return openModal('wallet', undefined);

    const onConfirm = () => {
      return mutation.mutate(toCreateStrategyParams(base, quote, buy, sell), {
        onSuccess: async (tx) => {
          handleTxStatusAndRedirectToOverview(setIsProcessing, navigate);
          dispatchNotification('createStrategy', { txHash: tx.hash });
          carbonEvents.strategy.createStrategy({
            token_pair: `${base.symbol}/${quote.symbol}`,
            strategy_base_token: base.symbol,
            strategy_quote_token: quote.symbol,
            strategy_category: 'static',
            strategy_type: getStrategyType({ buy, sell }),
          });
          await tx.wait();
          cache.invalidateQueries({
            queryKey: QueryKey.strategiesByUser(user),
          });
          cache.invalidateQueries({
            queryKey: QueryKey.balance(user, base.address),
          });
          cache.invalidateQueries({
            queryKey: QueryKey.balance(user, quote.address),
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
      });
    };

    if (!+buy.budget && !+sell.budget) {
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
        buttonLabel: 'Create',
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
