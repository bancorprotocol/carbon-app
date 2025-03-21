import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { tokenAmount } from 'utils/helpers';
import { EditStrategyPriceField } from 'components/strategies/edit/EditPriceFields';
import { StrategyDirection, StrategySettings } from 'libs/routing';
import { EditOrderBlock } from 'components/strategies/common/types';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  emptyOrder,
  isEmptyOrder,
  isLimitOrder,
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { EditStrategyForm } from 'components/strategies/edit/EditStrategyForm';
import { useSetDisposableOrder } from 'components/strategies/common/useSetOrder';
import { getTotalBudget, getWithdraw } from 'components/strategies/edit/utils';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { OnPriceUpdates } from 'components/strategies/common/d3Chart';
import { useCallback } from 'react';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import { SafeDecimal } from 'libs/safedecimal';
import { Strategy } from 'libs/queries';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';

export interface EditDisposableStrategySearch {
  priceStart?: string;
  priceEnd?: string;
  editType: 'editPrices' | 'renew';
  min?: string;
  max?: string;
  settings?: StrategySettings;
  direction?: StrategyDirection;
  action?: 'deposit' | 'withdraw';
  budget?: string;
  marginalPrice?: MarginalPriceOptions;
}

const getOrder = (
  strategy: Strategy,
  search: EditDisposableStrategySearch,
  marketPrice?: number
): EditOrderBlock => {
  const { order0, order1 } = strategy;
  const defaultDirection = !isEmptyOrder(order0) ? 'buy' : 'sell';
  const direction = search.direction ?? defaultDirection;
  const isBuy = direction === 'buy';
  const order = isBuy ? order0 : order1;
  const defaultSettings = isLimitOrder(order) ? 'limit' : 'range';
  const settings = search.settings ?? defaultSettings;
  const action = search.action ?? 'deposit';
  const defaultPrice = isBuy ? order0.startRate : order1.endRate;
  const price = isZero(defaultPrice) ? marketPrice : defaultPrice;

  const defaultMin = () => {
    const multiplier = (() => {
      if (isZero(defaultPrice)) {
        if (isBuy) return settings === 'limit' ? 0.9 : 0.8;
        else return settings === 'limit' ? 1.1 : 1.1;
      } else {
        if (isBuy) return settings === 'limit' ? 1 : 0.9;
        else return settings === 'limit' ? 1 : 1;
      }
    })();
    return new SafeDecimal(price ?? 0).mul(multiplier).toString();
  };
  const defaultMax = () => {
    const multiplier = (() => {
      if (isZero(defaultPrice)) {
        if (isBuy) return settings === 'limit' ? 0.9 : 0.9;
        else return settings === 'limit' ? 1.1 : 1.2;
      } else {
        if (isBuy) return settings === 'limit' ? 1 : 1;
        else return settings === 'limit' ? 1 : 1.1;
      }
    })();
    return new SafeDecimal(price ?? 0).mul(multiplier).toString();
  };
  return {
    settings,
    action,
    min: search.min ?? defaultMin()?.toString() ?? '0',
    max: search.max ?? defaultMax()?.toString() ?? '0',
    budget: getTotalBudget(action, order.balance, search.budget),
    marginalPrice: search.marginalPrice,
  };
};

const url = '/strategies/edit/$strategyId/prices/disposable';
export const EditPricesStrategyDisposablePage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote, order0, order1 } = strategy;
  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });

  const { marketPrice } = useMarketPrice({ base, quote });

  const isBuy = search.direction !== 'sell';
  const { setOrder } = useSetDisposableOrder(url);

  const setSearch = useCallback(
    (next: Partial<EditDisposableStrategySearch>) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, ...next }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  const setDirection = (direction: StrategyDirection) => {
    setSearch({
      direction,
      budget: undefined,
      min: undefined,
      max: undefined,
      marginalPrice: undefined,
    });
  };

  const onPriceUpdates: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      if (isBuy) setSearch({ min: buy.min, max: buy.max });
      else setSearch({ min: sell.min, max: sell.max });
    },
    [setSearch, isBuy]
  );

  const initialOrder = isBuy ? order0 : order1;

  const order: EditOrderBlock = getOrder(strategy, search, marketPrice);
  const orders = {
    buy: isBuy ? order : emptyOrder(),
    sell: isBuy ? emptyOrder() : order,
  };
  const isLimit = {
    buy: order.settings !== 'range',
    sell: order.settings !== 'range',
  };

  const hasPriceChanged = (() => {
    if (orders.buy.min !== order0.startRate) return true;
    if (orders.buy.max !== order0.endRate) return true;
    if (orders.sell.min !== order1.startRate) return true;
    if (orders.sell.max !== order1.endRate) return true;
    return false;
  })();
  const hasChanged = hasPriceChanged || !isZero(search.budget);

  // Warnings
  const outSideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.min,
    max: search.max,
    buy: isBuy,
  });

  // Check if inactive budget changed
  const buyBudgetChanges = !isBuy && orders.buy.budget !== order0.balance;
  const buyWithdraw = getWithdraw(order0.balance, orders.buy.budget);
  const sellBudgetChanges = isBuy && orders.sell.budget !== order1.balance;
  const sellWithdraw = getWithdraw(order1.balance, orders.sell.budget);

  return (
    <EditStrategyLayout editType={search.editType}>
      <EditStrategyForm
        strategyType="disposable"
        editType={search.editType}
        orders={orders}
        hasChanged={hasChanged}
      >
        <EditStrategyPriceField
          order={order}
          budget={search.budget ?? ''}
          initialOrder={initialOrder}
          setOrder={setOrder}
          warnings={[outSideMarket]}
          buy={isBuy}
          hasPriceChanged={hasPriceChanged}
          settings={
            <div className="p-16 pb-0">
              <TabsMenu>
                <TabsMenuButton
                  onClick={() => setDirection('buy')}
                  variant={isBuy ? 'buy' : 'black'}
                  data-testid="tab-buy"
                >
                  Buy
                </TabsMenuButton>
                <TabsMenuButton
                  onClick={() => setDirection('sell')}
                  variant={!isBuy ? 'sell' : 'black'}
                  data-testid="tab-sell"
                >
                  Sell
                </TabsMenuButton>
              </TabsMenu>
            </div>
          }
        />
        {(buyBudgetChanges || sellBudgetChanges) && (
          <article
            id="budget-changed"
            className="warning-message bg-background-900 p-16"
          >
            <div className="border-warning/40 rounded-10 grid gap-16 border p-16">
              <h3 className="text-16 text-warning font-weight-500 flex items-center gap-8">
                <IconWarning className="size-16" />
                Notice
              </h3>
              {buyBudgetChanges && (
                <p className="text-14 text-white/80">
                  You will withdraw&nbsp;
                  {tokenAmount(buyWithdraw, quote)} from the inactive buy order
                  to your wallet.
                </p>
              )}
              {sellBudgetChanges && (
                <p className="text-14 text-white/80">
                  You will withdraw&nbsp;
                  {tokenAmount(sellWithdraw, base)} from the inactive sell order
                  to your wallet.
                </p>
              )}
            </div>
          </article>
        )}
      </EditStrategyForm>
      <StrategyChartSection>
        <StrategyChartHistory
          type="disposable"
          base={base}
          quote={quote}
          order0={orders.buy}
          order1={orders.sell}
          isLimit={isLimit}
          direction={search.direction ?? 'sell'}
          onPriceUpdates={onPriceUpdates}
        />
      </StrategyChartSection>
    </EditStrategyLayout>
  );
};
