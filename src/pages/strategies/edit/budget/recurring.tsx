import { FormEvent, useCallback, useState } from 'react';
import { useNavigate, useRouter, useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { EditStrategyOverlapTokens } from 'components/strategies/edit/EditStrategyOverlapTokens';
import { cn } from 'utils/helpers';
import { StrategyDirection } from 'libs/routing';
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
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { useApproval } from 'hooks/useApproval';
import { useModal } from 'hooks/useModal';
import { handleTxStatusAndRedirectToOverview } from 'components/strategies/create/utils';
import { carbonEvents } from 'services/events';
import config from 'config';
import style from 'components/strategies/common/form.module.css';

export interface EditBudgetRecurringStrategySearch {
  action: 'deposit' | 'withdraw';
  buyBudget?: string;
  buyMarginalPrice?: string;
  sellBudget?: string;
  sellMarginalPrice?: string;
}

// TODO: merge that with create
type OrderKey = keyof EditBudgetRecurringStrategySearch;
const toOrderSearch = (
  order: Partial<OrderBlock>,
  direction: 'buy' | 'sell'
) => {
  const search: Partial<EditBudgetRecurringStrategySearch> = {};
  for (const [key, value] of Object.entries(order)) {
    const camelCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
    const searchKey = `${direction}${camelCaseKey}` as OrderKey;
    search[searchKey] = value as any;
  }
  return search;
};

const spenderAddress = config.addresses.carbon.carbonController;
const url = '/strategies/edit/$strategyId/budget/recurring';

export const EditBudgetRecurringPage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote, order0, order1 } = strategy;
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

  const totalBuyBudget = getTotalBudget(
    search.action,
    order0.balance,
    search.buyBudget
  );
  const totalSellBudget = getTotalBudget(
    search.action,
    order1.balance,
    search.sellBudget
  );

  const orders = {
    buy: {
      min: order0.startRate,
      max: order0.endRate,
      budget: totalBuyBudget,
      marginalPrice: search.buyMarginalPrice,
    },
    sell: {
      min: order1.startRate,
      max: order1.endRate,
      budget: totalSellBudget,
      marginalPrice: search.sellMarginalPrice,
    },
  };

  // TODO: move useStrategyEvent to common
  const strategyEventData = useStrategyEvent(
    'recurring',
    base,
    quote,
    orders.buy,
    orders.sell
  );

  const hasChanged = !isZero(search.buyBudget) || !isZero(search.sellBudget);

  // Warnings
  const sellOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: order1.startRate,
    max: order1.endRate,
    buy: false,
  });
  const buyOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: order0.startRate,
    max: order0.endRate,
    buy: true,
  });

  // TODO: create a utils for that
  const setOrder = useCallback(
    (order: Partial<OrderBlock>, direction: StrategyDirection) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({
          ...previous,
          ...toOrderSearch(order, direction),
        }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  const setSellOrder = useCallback(
    (order: Partial<OrderBlock>) => setOrder(order, 'sell'),
    [setOrder]
  );

  const setBuyOrder = useCallback(
    (order: Partial<OrderBlock>) => setOrder(order, 'buy'),
    [setOrder]
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
    const buyDeposit = getDeposit(strategy.order0.balance, orders.buy.budget);
    if (!isZero(buyDeposit)) {
      arr.push({
        ...quote,
        spender: spenderAddress,
        amount: buyDeposit,
      });
    }
    const sellDeposit = getDeposit(strategy.order1.balance, orders.sell.budget);
    if (!isZero(sellDeposit)) {
      arr.push({
        ...base,
        spender: spenderAddress,
        amount: sellDeposit,
      });
    }
    return arr;
  })();
  const approval = useApproval(approvalTokens);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled(e.currentTarget)) return;
    if (isZero(orders.buy.budget) && isZero(orders.sell.budget)) {
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
    updateMutation.mutate(
      {
        id: strategy.id,
        encoded: strategy.encoded,
        fieldsToUpdate: {
          buyBudget: orders.buy.budget,
          sellBudget: orders.sell.budget,
        },
        buyMarginalPrice: orders.buy.marginalPrice,
        sellMarginalPrice: orders.sell.marginalPrice,
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
        order={orders.sell}
        budget={search.sellBudget ?? ''}
        initialBudget={strategy.order1.balance}
        setOrder={setSellOrder}
        warning={search.action === 'deposit' ? sellOutsideMarket : ''}
      />
      <EditStrategyBudgetField
        action={search.action}
        order={orders.buy}
        budget={search.buyBudget ?? ''}
        initialBudget={strategy.order0.balance}
        setOrder={setBuyOrder}
        warning={search.action === 'deposit' ? buyOutsideMarket : ''}
        buy
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
