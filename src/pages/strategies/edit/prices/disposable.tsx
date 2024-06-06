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
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { EditPriceNav } from 'components/strategies/edit/EditPriceNav';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  emptyOrder,
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import style from 'components/strategies/common/form.module.css';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';

export interface EditDisposableStrategySearch {
  min: string;
  max: string;
  settings: StrategySettings;
  direction: StrategyDirection;
}

const url = '/strategies/edit/$strategyId/prices/disposable';

export const EditStrategyDisposablePage = () => {
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

  const buy = search.direction !== 'sell';
  const initialBudget = buy ? strategy.order0.balance : strategy.order1.balance;
  const order: OrderBlock = {
    min: search.min ?? '',
    max: search.max ?? '',
    budget: '',
    marginalPrice: '',
    settings: search.settings ?? 'limit',
  };
  const buyOrder = buy ? order : emptyOrder();
  const sellOrder = buy ? emptyOrder() : order;

  const strategyEventData = useStrategyEvent(
    'disposable',
    base,
    quote,
    buyOrder,
    sellOrder
  );

  const setDirection = (direction: StrategyDirection) => {
    navigate({
      params: (params) => params,
      search: (previous) => ({
        ...previous,
        direction,
        min: '',
        max: '',
      }),
      replace: true,
      resetScroll: false,
    });
  };

  const hasChanged = (() => {
    const { order0, order1 } = strategy;
    if (buyOrder.min !== roundSearchParam(order0.startRate)) return true;
    if (buyOrder.max !== roundSearchParam(order0.endRate)) return true;
    if (sellOrder.min !== roundSearchParam(order1.startRate)) return true;
    if (sellOrder.max !== roundSearchParam(order1.endRate)) return true;
    return false;
  })();

  // Warnings
  const outSideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.min,
    max: search.max,
    buy: search.direction !== 'sell',
  });

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
          buyPriceLow: buyOrder.min,
          buyPriceHigh: buyOrder.max,
          sellPriceLow: sellOrder.min,
          sellPriceHigh: sellOrder.max,
        },
        buyMarginalPrice: getMarginalOption(strategy.order0, buyOrder),
        sellMarginalPrice: getMarginalOption(strategy.order1, sellOrder),
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

  const fromRecurring =
    !isZero(strategy.order0.startRate) && !isZero(strategy.order1.startRate);

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
        order={order}
        initialBudget={initialBudget}
        setOrder={setOrder}
        warnings={[outSideMarket]}
        buy={buy}
        settings={
          <TabsMenu>
            <TabsMenuButton
              onClick={() => setDirection('buy')}
              isActive={buy}
              data-testid="tab-buy"
            >
              Buy
            </TabsMenuButton>
            <TabsMenuButton
              onClick={() => setDirection('sell')}
              isActive={!buy}
              data-testid="tab-sell"
            >
              Sell
            </TabsMenuButton>
          </TabsMenu>
        }
      />
      {fromRecurring && (
        <WarningMessageWithIcon>
          {buy ? 'Sell High' : 'Buy Low'} order has been removed
        </WarningMessageWithIcon>
      )}

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
        {fromRecurring
          ? `I understand this change will remove ${
              buy ? 'Sell High' : 'Buy Low'
            } order`
          : "I've reviewed the warning(s) but choose to proceed."}
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
