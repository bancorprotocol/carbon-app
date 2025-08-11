import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { tokenAmount } from 'utils/helpers';
import { EditStrategyPriceField } from 'components/strategies/edit/EditPriceFields';
import { StrategyDirection, StrategySettings } from 'libs/routing';
import { EditOrderBlock, Order } from 'components/strategies/common/types';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  getStrategyType,
  isEmptyOrder,
  isLimitOrder,
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { useSetDisposableOrder } from 'components/strategies/common/useSetOrder';
import { getTotalBudget } from 'components/strategies/edit/utils';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { OnPriceUpdates } from 'components/strategies/common/d3Chart';
import { useCallback } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { Strategy } from 'components/strategies/common/types';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { useDebouncePrices } from 'components/strategies/common/d3Chart/useDebouncePrices';
import { D3ChartDisposable } from 'components/strategies/common/d3Chart/disposable/D3ChartDisposable';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { D3PricesAxis } from 'components/strategies/common/d3Chart/D3PriceAxis';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import { EditPricesForm } from 'components/strategies/edit/EditPricesForm';
import { EditMarketPrice } from 'components/strategies/common/InitMarketPrice';

export interface EditDisposableStrategySearch {
  marketPrice?: string;
  chartStart?: string;
  chartEnd?: string;
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
  marketPrice?: string,
): EditOrderBlock => {
  const { buy, sell } = strategy;
  const defaultDirection = !isEmptyOrder(buy) ? 'buy' : 'sell';
  const direction = search.direction ?? defaultDirection;
  const isBuy = direction === 'buy';
  const order = isBuy ? buy : sell;
  const defaultSettings = isLimitOrder(order) ? 'limit' : 'range';
  const settings = search.settings ?? defaultSettings;
  const action = search.action ?? 'deposit';
  const defaultPrice = isBuy ? buy.min : sell.max;
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
    budget: getTotalBudget(action, order.budget, search.budget),
    marginalPrice: search.marginalPrice,
  };
};

const resetOrder = (order: Order, resetBudget: boolean) => ({
  min: '0',
  max: '0',
  budget: resetBudget ? '0' : order.budget,
});

const url = '/strategies/edit/$strategyId/prices/disposable';
export const EditPricesStrategyDisposablePage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote, buy, sell } = strategy;
  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });
  const marketQuery = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? marketQuery.marketPrice?.toString();

  const direction = search.direction ?? 'sell';
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
    [navigate],
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

  const updatePrices: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      if (isBuy) setSearch({ min: buy.min, max: buy.max });
      else setSearch({ min: sell.min, max: sell.max });
    },
    [setSearch, isBuy],
  );

  const initialType = getStrategyType(strategy);
  const initialDirection = isEmptyOrder(buy) ? 'sell' : 'buy';
  const resetBudget =
    initialType !== 'disposable' || initialDirection !== direction;
  const initialOrder = isBuy ? buy : sell;

  const order: EditOrderBlock = getOrder(strategy, search, marketPrice);
  const orders = {
    buy: isBuy ? order : resetOrder(buy, resetBudget),
    sell: isBuy ? resetOrder(sell, resetBudget) : order,
  };
  const isLimit = {
    buy: order.settings !== 'range',
    sell: order.settings !== 'range',
  };
  const { prices, setPrices } = useDebouncePrices(
    orders.buy,
    orders.sell,
    updatePrices,
  );

  const hasPriceChanged = (() => {
    if (orders.buy.min !== buy.min) return true;
    if (orders.buy.max !== buy.max) return true;
    if (orders.sell.min !== sell.min) return true;
    if (orders.sell.max !== sell.max) return true;
    return false;
  })();
  const hasChanged = hasPriceChanged || !isZero(search.budget);

  // Warnings
  const outSideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.min,
    max: search.max,
    isBuy,
  });

  // Check if inactive budget changed
  const buyBudgetChanges = resetBudget && !isBuy && !isZero(buy.budget);
  const sellBudgetChanges = resetBudget && isBuy && !isZero(sell.budget);

  return (
    <EditStrategyLayout editType={search.editType}>
      <StrategyChartSection
        editMarketPrice={<EditMarketPrice base={base} quote={quote} />}
      >
        <StrategyChartHistory
          base={base}
          quote={quote}
          buy={orders.buy}
          sell={orders.sell}
          direction={search.direction ?? 'sell'}
        >
          <D3ChartDisposable
            isLimit={isLimit}
            prices={prices}
            onChange={setPrices}
          />
          <TradeChartContent />
          <D3PricesAxis prices={prices} />
        </StrategyChartHistory>
      </StrategyChartSection>
      <EditPricesForm
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
          direction={search.direction}
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
              <h3 className="text-16 text-warning font-medium flex items-center gap-8">
                <IconWarning className="size-16" />
                Notice
              </h3>
              {buyBudgetChanges && (
                <p className="text-14 text-white/80">
                  You will withdraw&nbsp;
                  {tokenAmount(buy.budget, quote)} from the inactive buy order
                  to your wallet.
                </p>
              )}
              {sellBudgetChanges && (
                <p className="text-14 text-white/80">
                  You will withdraw&nbsp;
                  {tokenAmount(sell.budget, base)} from the inactive sell order
                  to your wallet.
                </p>
              )}
            </div>
          </article>
        )}
      </EditPricesForm>
    </EditStrategyLayout>
  );
};
