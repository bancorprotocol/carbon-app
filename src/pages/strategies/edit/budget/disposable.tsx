import { FormEvent, useCallback, useState } from 'react';
import { useNavigate, useRouter, useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { EditStrategyOverlapTokens } from 'components/strategies/edit/EditStrategyOverlapTokens';
import { cn } from 'utils/helpers';
import { OrderBlock } from 'components/strategies/common/types';
import { Button } from 'components/common/button';
import { getStatusTextByTxStatus } from 'components/strategies/utils';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKey, useUpdateStrategyQuery } from 'libs/queries';
import { useNotifications } from 'hooks/useNotifications';
import { useWeb3 } from 'libs/web3';
import { useStrategyEvent } from 'components/strategies/create/useStrategyEventData';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { EditStrategyBudgetField } from 'components/strategies/edit/NewEditBudgetFields';
import { getDeposit, getTotalBudget } from 'components/strategies/edit/utils';
import {
  emptyOrder,
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { useApproval } from 'hooks/useApproval';
import { useModal } from 'hooks/useModal';
import { handleTxStatusAndRedirectToOverview } from 'components/strategies/create/utils';
import { carbonEvents } from 'services/events';
import config from 'config';
import style from 'components/strategies/common/form.module.css';

export interface EditBudgetDisposableStrategySearch {
  action: 'deposit' | 'withdraw';
  budget?: string;
  marginalPrice?: string;
}

const spenderAddress = config.addresses.carbon.carbonController;
const url = '/strategies/edit/$strategyId/budget/disposable';

export const EditBudgetDisposablePage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;
  const { history } = useRouter();
  const { openModal } = useModal();
  const { dispatchNotification } = useNotifications();
  const navigate = useNavigate({ from: url });
  const search = useSearch({ from: url });
  const { user } = useWeb3();
  const marketPrice = useMarketPrice({ base, quote });

  const [isProcessing, setIsProcessing] = useState(false);
  const updateMutation = useUpdateStrategyQuery();
  const cache = useQueryClient();

  const isAwaiting = updateMutation.isLoading;
  const isLoading = isAwaiting || isProcessing;
  const loadingChildren = getStatusTextByTxStatus(isAwaiting, isProcessing);

  const buy = isZero(strategy.order1.startRate);
  const initialOrder = buy ? strategy.order0 : strategy.order1;

  const totalBudget = getTotalBudget(
    search.action,
    initialOrder.balance,
    search.budget
  );

  const order = {
    min: initialOrder.startRate,
    max: initialOrder.endRate,
    budget: totalBudget,
    marginalPrice: search.marginalPrice,
  };

  // TODO: move useStrategyEvent to common
  const strategyEventData = useStrategyEvent(
    'disposable',
    base,
    quote,
    buy ? order : emptyOrder(),
    buy ? emptyOrder() : order
  );

  const hasChanged = !isZero(search.budget);

  // Warnings
  const outsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: order.min,
    max: order.max,
    buy: buy,
  });
  // TODO: create a utils for that
  const setOrder = useCallback(
    (order: Partial<OrderBlock>) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, ...order }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  const isDisabled = (form: HTMLFormElement) => {
    if (!form.checkValidity()) return true;
    if (!!form.querySelector('.error-message')) return true;
    const warnings = form.querySelector('.warning-message');
    if (!warnings) return false;
    return !form.querySelector<HTMLInputElement>('#approve-warnings')?.checked;
  };

  const approvalTokens = (() => {
    const arr = [];
    if (search.action === 'withdraw') return [];
    const token = buy ? quote : base;
    const deposit = getDeposit(initialOrder.balance, order.budget);
    if (!isZero(deposit)) {
      arr.push({
        ...token,
        spender: spenderAddress,
        amount: deposit,
      });
    }
    return arr;
  })();
  const approval = useApproval(approvalTokens);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled(e.currentTarget)) return;
    if (isZero(order.budget)) {
      return openModal('genericInfo', {
        title: 'Empty Strategy Warning',
        text: 'You are about to update a strategy with no associated budget. It will be inactive until you deposit funds.',
        variant: 'warning',
        onConfirm: update,
      });
    }

    if (approval.approvalRequired) {
      return openModal('txConfirm', {
        approvalTokens,
        onConfirm: update,
        buttonLabel: 'Confirm Deposit',
        eventData: {
          ...strategyEventData,
          productType: 'strategy',
          approvalTokens,
          buyToken: base,
          sellToken: quote,
          blockchainNetwork: config.network.name,
        },
        context: 'depositStrategyFunds',
      });
    }
    return update();
  };

  const update = () => {
    console.log({
      buyBudget: buy ? order.budget : strategy.order1.balance,
      sellBudget: buy ? strategy.order0.balance : order.budget,
    });
    updateMutation.mutate(
      {
        id: strategy.id,
        encoded: strategy.encoded,
        fieldsToUpdate: {
          buyBudget: buy ? order.budget : strategy.order0.balance,
          sellBudget: buy ? strategy.order1.balance : order.budget,
        },
        buyMarginalPrice: buy ? order.marginalPrice : undefined,
        sellMarginalPrice: buy ? undefined : order.marginalPrice,
      },
      {
        onSuccess: async (tx) => {
          handleTxStatusAndRedirectToOverview(setIsProcessing, navigate);
          const notif =
            search.action === 'deposit'
              ? 'depositStrategy'
              : 'withdrawStrategy';
          dispatchNotification(notif, { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();
          cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          carbonEvents.strategyEdit.strategyEditPrices({
            ...strategyEventData,
            strategyId: strategy.id,
          });
          console.log('tx confirmed');
        },
        onError: (e) => {
          setIsProcessing(false);
          console.error('update mutation failed', e);
        },
      }
    );
  };

  return (
    <form
      onSubmit={submit}
      onReset={() => history.back()}
      className={cn('flex w-full flex-col gap-20 md:w-[440px]', style.form)}
      data-testid="edit-form"
    >
      <EditStrategyOverlapTokens strategy={strategy} />
      <EditStrategyBudgetField
        action={search.action}
        order={order}
        budget={search.budget ?? ''}
        initialBudget={initialOrder.balance}
        setOrder={setOrder}
        warning={search.action === 'deposit' ? outsideMarket : ''}
        buy={buy}
      />
      <label
        htmlFor="approve-warnings"
        className={cn(
          style.approveWarnings,
          'rounded-10 bg-background-900 text-14 font-weight-500 flex items-center gap-8 p-20 text-white/60'
        )}
      >
        <input
          id="approve-warnings"
          type="checkbox"
          name="approval"
          data-testid="approve-warnings"
        />
        I've reviewed the warning(s) but choose to proceed.
      </label>

      <Button
        type="submit"
        disabled={!hasChanged}
        loading={isLoading}
        loadingChildren={loadingChildren}
        variant="white"
        size="lg"
        fullWidth
        data-testid="edit-submit"
      >
        Confirm Changes
      </Button>
      <Button
        type="reset"
        disabled={isLoading}
        variant="secondary"
        size="lg"
        fullWidth
      >
        Cancel
      </Button>
    </form>
  );
};
