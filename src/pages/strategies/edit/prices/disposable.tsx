import { useCallback } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { roundSearchParam } from 'utils/helpers';
import { EditStrategyPriceField } from 'components/strategies/edit/EditPriceFields';
import { StrategyDirection, StrategySettings } from 'libs/routing';
import { BaseOrder, OrderBlock } from 'components/strategies/common/types';
import { Order } from 'libs/queries';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  emptyOrder,
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import { EditStrategyForm } from 'components/strategies/edit/EditStrategyForm';

export interface EditDisposableStrategySearch {
  editType: 'editPrices' | 'renew';
  min: string;
  max: string;
  settings: StrategySettings;
  direction: StrategyDirection;
}

const url = '/strategies/edit/$strategyId/prices/disposable';

export const EditStrategyDisposablePage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;
  const navigate = useNavigate({ from: url });
  const search = useSearch({ from: url });
  const marketPrice = useMarketPrice({ base, quote });

  const buy = search.direction !== 'sell';
  const initialBudget = buy ? strategy.order0.balance : strategy.order1.balance;
  const order: OrderBlock = {
    min: search.min ?? '',
    max: search.max ?? '',
    budget: initialBudget,
    marginalPrice: '',
    settings: search.settings ?? 'limit',
  };
  const orders = {
    buy: buy ? order : emptyOrder(),
    sell: buy ? emptyOrder() : order,
  };

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
    if (orders.buy.min !== roundSearchParam(order0.startRate)) return true;
    if (orders.buy.max !== roundSearchParam(order0.endRate)) return true;
    if (orders.sell.min !== roundSearchParam(order1.startRate)) return true;
    if (orders.sell.max !== roundSearchParam(order1.endRate)) return true;
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

  // WHAT TO DO WITH THAT ???
  const getMarginalOption = (oldOrder: Order, newOrder: BaseOrder) => {
    if (search.editType !== 'editPrices') return;
    if (oldOrder.startRate !== newOrder.min) return MarginalPriceOptions.reset;
    if (oldOrder.endRate !== newOrder.max) return MarginalPriceOptions.reset;
  };

  const fromRecurring =
    !isZero(strategy.order0.startRate) && !isZero(strategy.order1.startRate);

  return (
    <EditStrategyForm
      strategyType="disposable"
      editType={search.editType}
      orders={orders}
      hasChanged={hasChanged}
    >
      <EditStrategyPriceField
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
    </EditStrategyForm>
  );
};
