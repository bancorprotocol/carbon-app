import { FormEvent, useCallback, useState } from 'react';
import { useNavigate, useRouter, useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { EditStrategyOverlapTokens } from 'components/strategies/edit/EditStrategyOverlapTokens';
import { cn, roundSearchParam } from 'utils/helpers';
import { EditStrategyOrderField } from 'components/strategies/edit/NewEditOrderFields';
import { StrategyDirection, StrategySettings } from 'libs/routing';
import { BaseOrder, OrderBlock } from 'components/strategies/common/types';
import { Button } from 'components/common/button';
import { getStatusTextByTxStatus } from 'components/strategies/utils';
import { handleTxStatusAndRedirectToOverview } from 'components/strategies/create/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Order, QueryKey, useUpdateStrategyQuery } from 'libs/queries';
import { useNotifications } from 'hooks/useNotifications';
import { useWeb3 } from 'libs/web3';
import { carbonEvents } from 'services/events';
import { useStrategyEvent } from 'components/strategies/create/useStrategyEventData';
import style from 'components/strategies/common/form.module.css';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { EditPriceNav } from 'components/strategies/edit/EditPriceNav';
import { outSideMarketWarning } from 'components/strategies/common/utils';
import { useMarketPrice } from 'hooks/useMarketPrice';

export interface EditRecurringStrategySearch {
  buyMin: string;
  buyMax: string;
  buySettings: StrategySettings;
  sellMin: string;
  sellMax: string;
  sellSettings: StrategySettings;
}

// TODO: merge that with create
type OrderKey = keyof EditRecurringStrategySearch;
const toOrderSearch = (
  order: Partial<OrderBlock>,
  direction: 'buy' | 'sell'
) => {
  const search: Partial<EditRecurringStrategySearch> = {};
  for (const [key, value] of Object.entries(order)) {
    const camelCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
    const searchKey = `${direction}${camelCaseKey}` as OrderKey;
    search[searchKey] = value as any;
  }
  return search;
};

const getWarning = (search: EditRecurringStrategySearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const sellMinInRange =
    buyMin && buyMax && sellMin && +sellMin >= +buyMin && +sellMin < +buyMax;
  const buyMaxInRange =
    sellMin && sellMax && buyMax && +buyMax >= +sellMin && +buyMax < +sellMax;
  if (sellMinInRange || buyMaxInRange) {
    return 'Notice: your Buy and Sell orders overlap';
  }
};

const getError = (search: EditRecurringStrategySearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const minReversed = buyMin && sellMin && +buyMin > +sellMin;
  const maxReversed = buyMax && sellMax && +buyMax > +sellMax;
  if (minReversed || maxReversed) {
    return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid an immediate loss of funds upon creation.';
  }
};

const url = '/strategies/edit/$strategyId/prices/recurring';

export const EditStrategyRecurringPage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;
  const { history } = useRouter();
  const { dispatchNotification } = useNotifications();
  const navigate = useNavigate({ from: url });
  const search = useSearch({ from: url });
  const { user } = useWeb3();
  const marketPrice = useMarketPrice({ base, quote });
  // TODO: support also renew
  const type = 'editPrices';

  const [isProcessing, setIsProcessing] = useState(false);
  const updateMutation = useUpdateStrategyQuery();
  const cache = useQueryClient();

  const isAwaiting = updateMutation.isLoading;
  const isLoading = isAwaiting || isProcessing;
  const loadingChildren = getStatusTextByTxStatus(isAwaiting, isProcessing);

  const orders = {
    buy: {
      min: search.buyMin,
      max: search.buyMax,
      budget: '',
      marginalPrice: '',
      settings: search.buySettings,
    },
    sell: {
      min: search.sellMin,
      max: search.sellMax,
      budget: '',
      marginalPrice: '',
      settings: search.sellSettings,
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

  const hasChanged = (() => {
    const { order0, order1 } = strategy;
    if (search.buyMin !== roundSearchParam(order0.startRate)) return true;
    if (search.buyMax !== roundSearchParam(order0.endRate)) return true;
    if (search.sellMin !== roundSearchParam(order1.startRate)) return true;
    if (search.sellMax !== roundSearchParam(order1.endRate)) return true;
    return false;
  })();

  // Warnings
  const sellOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.sellMin,
    max: search.sellMax,
    buy: false,
  });
  const buyOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.buyMin,
    max: search.buyMax,
    buy: true,
  });

  const error = getError(search);

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

  const getMarginalOption = (oldOrder: Order, newOrder: BaseOrder) => {
    if (type !== 'editPrices') return;
    if (oldOrder.startRate !== newOrder.min) return MarginalPriceOptions.reset;
    if (oldOrder.endRate !== newOrder.max) return MarginalPriceOptions.reset;
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled(e.currentTarget)) return;
    updateMutation.mutate(
      {
        id: strategy.id,
        encoded: strategy.encoded,
        fieldsToUpdate: {
          buyPriceLow: search.buyMin,
          buyPriceHigh: search.buyMax,
          sellPriceLow: search.sellMin,
          sellPriceHigh: search.sellMax,
        },
        buyMarginalPrice: getMarginalOption(strategy.order0, orders.buy),
        sellMarginalPrice: getMarginalOption(strategy.order1, orders.sell),
      },
      {
        onSuccess: async (tx) => {
          handleTxStatusAndRedirectToOverview(setIsProcessing, navigate);
          const notif =
            type === 'editPrices' ? 'changeRatesStrategy' : 'renewStrategy';
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
      <EditPriceNav />
      <EditStrategyOverlapTokens strategy={strategy} />
      <EditStrategyOrderField
        type="editPrices"
        order={orders.sell}
        initialBudget={strategy.order1.balance}
        setOrder={setSellOrder}
        warnings={[sellOutsideMarket, getWarning(search)]}
        error={error}
      />
      <EditStrategyOrderField
        type="editPrices"
        order={orders.buy}
        initialBudget={strategy.order0.balance}
        setOrder={setBuyOrder}
        warnings={[buyOutsideMarket, getWarning(search)]}
        error={error}
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
        {type === 'editPrices' ? 'Confirm Changes' : 'Renew Strategy'}
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
