import { useMemo, useState } from 'react';
import { QueryKey, useQueryClient } from 'libs/queries';
import { useCreateStrategyQuery } from 'libs/queries';
import { useNavigate } from 'libs/routing';
import { useWeb3 } from 'libs/web3';
import { useApproval } from 'hooks/useApproval';
import { useModal } from 'hooks/useModal';
import { useNotifications } from 'hooks/useNotifications';
import { handleTxStatusAndRedirectToOverview } from 'components/strategies/create/utils';
import { Token } from 'libs/tokens';
import config from 'config';

const spenderAddress = config.addresses.carbon.carbonController;

export type UseStrategyCreateReturn = ReturnType<typeof useCreateStrategy>;

interface Props {
  base?: Token;
  quote?: Token;
  order0: { min: string; max: string; marginalPrice?: string; budget: string };
  order1: { min: string; max: string; marginalPrice?: string; budget: string };
}

export const useCreateStrategy = (props: Props) => {
  const { base, quote, order0, order1 } = props;
  const cache = useQueryClient();
  const navigate = useNavigate();
  const { user, provider } = useWeb3();
  const { openModal } = useModal();
  const { dispatchNotification } = useNotifications();

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
            // TODO: add back
            // carbonEvents.strategy.strategyCreate(strategyEventData);
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
        buttonLabel: 'Create Strategy',
        eventData: {
          // ...strategyEventData, // TODO: add back
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
    hasApprovalError: approval.isError,
    isAwaiting: mutation.isLoading,
    createStrategy,
    isProcessing,
  };
};
