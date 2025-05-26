import { useMemo, useState } from 'react';
import { CreateStrategyParams, useQueryClient } from 'libs/queries';
import { useCreateStrategyQuery } from 'libs/queries';
import { useNavigate } from 'libs/routing';
import { useWagmi } from 'libs/wagmi';
import { useApproval } from 'hooks/useApproval';
import { useModal } from 'hooks/useModal';
import { useNotifications } from 'hooks/useNotifications';
// import { handleTxStatusAndRedirectToOverview } from 'components/strategies/create/utils';
import { BaseOrder } from 'components/strategies/common/types';
import { Token } from 'libs/tokens';
import config from 'config';
// import { carbonEvents } from 'services/events';
// import { getStrategyType, toOrder } from '../common/utils';
import { captureException } from '@sentry/react';

const spenderAddress = config.addresses.carbon.carbonController;

export type UseStrategyCreateReturn = ReturnType<typeof useCreateStrategy>;

export const toCreateStrategyParams = (
  base: Token,
  quote: Token,
  order0: BaseOrder,
  order1: BaseOrder
): CreateStrategyParams => ({
  base: base.address,
  quote: quote.address,
  order0: {
    budget: order0.budget || '0',
    min: order0.min || '0',
    max: order0.max || '0',
    marginalPrice: order0.marginalPrice ?? '',
  },
  order1: {
    budget: order1.budget || '0',
    min: order1.min || '0',
    max: order1.max || '0',
    marginalPrice: order1.marginalPrice ?? '',
  },
});

interface Props {
  base?: Token;
  quote?: Token;
  order0: BaseOrder;
  order1: BaseOrder;
}

export const useCreateStrategy = (props: Props) => {
  const { base, quote, order0, order1 } = props;
  const cache = useQueryClient();
  const navigate = useNavigate();
  const { user } = useWagmi();
  const { openModal } = useModal();
  const { dispatchNotification } = useNotifications();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState('');

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

  const approval = useApproval(approvalTokens);
  const mutation = useCreateStrategyQuery();

  const createStrategy = async () => {
    if (!base || !quote) return;
    if (!user) return openModal('wallet', undefined);

    const onConfirm = () => {
      return mutation.mutate(
        toCreateStrategyParams(base, quote, order0, order1),
        {
          onSuccess: async (tx) => {
            setError(JSON.stringify(tx));
            // handleTxStatusAndRedirectToOverview(setIsProcessing, navigate);
            // dispatchNotification('createStrategy', { txHash: tx.hash });
            // carbonEvents.strategy.createStrategy({
            //   token_pair: `${base.symbol}/${quote.symbol}`,
            //   strategy_base_token: base.symbol,
            //   strategy_quote_token: quote.symbol,
            //   strategy_category: 'static',
            //   strategy_type: getStrategyType({
            //     order0: toOrder(order0),
            //     order1: toOrder(order1),
            //   }),
            // });
            // await tx.wait();
            // cache.invalidateQueries({
            //   queryKey: QueryKey.strategiesByUser(user),
            // });
            // cache.invalidateQueries({
            //   queryKey: QueryKey.balance(user, base.address),
            // });
            // cache.invalidateQueries({
            //   queryKey: QueryKey.balance(user, quote.address),
            // });
            // navigate({ to: '/portfolio', search: {}, params: {} });
          },
          onError: (e: any) => {
            setIsProcessing(false);
            console.error('create mutation failed', e);
            captureException(e);
            setError(JSON.stringify(e));
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
    error,
  };
};
