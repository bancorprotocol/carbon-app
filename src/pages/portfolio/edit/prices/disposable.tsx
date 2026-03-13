import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { tokenAmount } from 'utils/helpers';
import { EditStrategyPriceField } from 'components/strategies/edit/EditPriceFields';
import { StrategyDirection } from 'libs/routing';
import { EditOrderBlock, Order } from 'components/strategies/common/types';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  getStrategyType,
  isEmptyOrder,
  isLimitOrder,
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { useSetDisposableOrder } from 'components/strategies/common/useSetOrder';
import { getTotalBudget } from 'components/strategies/edit/utils';
import IconWarning from 'assets/icons/warning.svg?react';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { OnPriceUpdates } from 'components/strategies/common/d3Chart';
import { useCallback } from 'react';
import { Strategy } from 'components/strategies/common/types';
import { useDebouncePrices } from 'components/strategies/common/d3Chart/useDebouncePrices';
import { D3ChartDisposable } from 'components/strategies/common/d3Chart/disposable/D3ChartDisposable';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { D3PricesAxis } from 'components/strategies/common/d3Chart/D3PriceAxis';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import { EditPricesForm } from 'components/strategies/edit/EditPricesForm';
import { EditMarketPrice } from 'components/strategies/common/InitMarketPrice';
import { OrderDirection } from 'components/strategies/common/OrderDirection';
import { getEditOrderPrices } from 'components/strategies/create/utils';
import { EditPriceDisposableSearch } from 'libs/routing/routes/strategyEdit';

type Search = EditPriceDisposableSearch;

const getOrder = (strategy: Strategy, search: Search, marketPrice?: string) => {
  const { buy, sell } = strategy;
  const defaultDirection = isEmptyOrder(buy) ? 'sell' : 'buy';
  const direction = search.direction ?? defaultDirection;
  const order = direction === 'buy' ? buy : sell;
  const defaultSettings = isLimitOrder(order) ? 'limit' : 'range';
  const settings = search.settings ?? defaultSettings;
  const action = search.action ?? 'deposit';

  const searchOrder = {
    direction: direction,
    settings: settings,
    min: search.min,
    max: search.max,
    presetMin: search.presetMin,
    presetMax: search.presetMax,
  };
  const prices = getEditOrderPrices(searchOrder, order, marketPrice);

  return {
    direction,
    settings,
    action,
    min: prices.min,
    max: prices.max,
    budget: getTotalBudget(action, order.budget, search.budget),
  } satisfies EditOrderBlock;
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
  const { marketPrice: externalPrice } = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? externalPrice?.toString();

  const order = getOrder(strategy, search, marketPrice);
  const isBuy = order.direction !== 'sell';
  const { setOrder } = useSetDisposableOrder(url);

  const setSearch = useCallback(
    (next: Partial<Search>) => {
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
      presetMin: undefined,
      presetMax: undefined,
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
  const directionChanged = initialDirection !== order.direction;
  const resetBudget = initialType !== 'disposable' || directionChanged;
  const initialOrder = isBuy ? buy : sell;

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
    min: order.min,
    max: order.max,
    isBuy,
  });

  // Check if inactive budget changed
  const buyBudgetChanges = resetBudget && !isBuy && !isZero(buy.budget);
  const sellBudgetChanges = resetBudget && isBuy && !isZero(sell.budget);

  return (
    <EditStrategyLayout
      editType={search.editType}
      marketPrice={Number(marketPrice)}
    >
      <StrategyChartSection
        editMarketPrice={<EditMarketPrice base={base} quote={quote} />}
      >
        <StrategyChartHistory
          buy={orders.buy}
          sell={orders.sell}
          direction={order.direction}
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
          direction={order.direction}
          hasPriceChanged={hasPriceChanged}
          settings={
            <OrderDirection
              direction={order.direction}
              setDirection={setDirection}
            />
          }
        />
        {(buyBudgetChanges || sellBudgetChanges) && (
          <article
            id="budget-changed"
            className="warning-message p-16 border-t border-main-0/40 bg-warning/5"
          >
            <h3 className="text-16 text-warning font-medium flex items-center gap-8">
              <IconWarning className="size-16" />
              Notice
            </h3>
            {buyBudgetChanges && (
              <p className="text-14 text-main-0/80">
                You will withdraw&nbsp;
                {tokenAmount(buy.budget, quote)} from the inactive buy order to
                your wallet.
              </p>
            )}
            {sellBudgetChanges && (
              <p className="text-14 text-main-0/80">
                You will withdraw&nbsp;
                {tokenAmount(sell.budget, base)} from the inactive sell order to
                your wallet.
              </p>
            )}
          </article>
        )}
      </EditPricesForm>
    </EditStrategyLayout>
  );
};
