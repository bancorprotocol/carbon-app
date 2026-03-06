import { useNavigate, useSearch } from '@tanstack/react-router';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import {
  defaultEnd,
  defaultStart,
  oneYearAgo,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { FormEvent, useCallback, useMemo } from 'react';
import { D3ChartRecurring } from 'components/strategies/common/d3Chart/recurring/D3ChartRecurring';
import { OnPriceUpdates } from 'components/strategies/common/d3Chart';
import { getTradeOrder } from 'components/strategies/create/utils';
import { isEmptyHistory } from 'components/strategies/common/d3Chart/utils';
import { CreateOrder } from 'components/strategies/create/CreateOrder';
import {
  checkIfOrdersOverlap,
  checkIfOrdersReversed,
} from 'components/strategies/utils';
import { OrderBlock } from 'components/strategies/common/types';
import { StrategySettings } from 'libs/routing/routes/trade';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { D3PricesAxis } from 'components/strategies/common/d3Chart/D3PriceAxis';
import { useSetRecurringOrder } from 'components/strategies/common/useSetOrder';
import { useDebouncePrices } from 'components/strategies/common/d3Chart/useDebouncePrices';
import { useStrategyFormCtx } from 'components/strategies/common/StrategyFormContext';

const getRecurringError = (buy: OrderBlock, sell: OrderBlock) => {
  if (checkIfOrdersReversed(buy, sell)) {
    return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid an immediate loss of funds upon creation.';
  }
};

const getRecurringWarning = (buy: OrderBlock, sell: OrderBlock) => {
  if (checkIfOrdersOverlap(buy, sell)) {
    return 'Notice: your Buy and Sell orders overlap';
  }
};

const url = '/simulate/recurring';
export const SimulatorInputRecurringPage = () => {
  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });
  const { setSellOrder, setBuyOrder } = useSetRecurringOrder(url);
  const { base, quote, marketPrice } = useStrategyFormCtx();

  const priceHistory = useGetTokenPriceHistory({
    baseToken: search.base,
    quoteToken: search.quote,
    start: oneYearAgo(),
    end: defaultEnd(),
  });

  const updatePrices: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      setBuyOrder({ min: buy.min, max: buy.max });
      setSellOrder({ min: sell.min, max: sell.max });
    },
    [setBuyOrder, setSellOrder],
  );

  const sellOrder = getTradeOrder(
    {
      direction: 'sell',
      min: search.sellMin,
      max: search.sellMax,
      presetMin: search.sellPresetMin,
      presetMax: search.sellPresetMax,
      budget: search.sellBudget,
      settings: search.sellSettings,
    },
    marketPrice,
  );
  const buyOrder = getTradeOrder(
    {
      direction: 'buy',
      min: search.buyMin,
      max: search.buyMax,
      presetMin: search.buyPresetMin,
      presetMax: search.buyPresetMax,
      budget: search.buyBudget,
      settings: search.buySettings,
    },
    marketPrice,
  );

  const setSellSetting = useCallback(
    (settings: StrategySettings) => {
      setSellOrder({
        settings,
        min: undefined,
        max: undefined,
        presetMin: undefined,
        presetMax: undefined,
      });
    },
    [setSellOrder],
  );
  const setBuySetting = useCallback(
    (settings: StrategySettings) => {
      setBuyOrder({
        settings,
        min: undefined,
        max: undefined,
        presetMin: undefined,
        presetMax: undefined,
      });
    },
    [setBuyOrder],
  );

  const sellOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: sellOrder.min,
    max: sellOrder.max,
    isBuy: false,
  });
  const buyOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: buyOrder.min,
    max: buyOrder.max,
    isBuy: true,
  });
  const isLimit = {
    buy: buyOrder.settings === 'limit',
    sell: sellOrder.settings === 'limit',
  };
  const { prices, setPrices } = useDebouncePrices(
    buyOrder,
    sellOrder,
    updatePrices,
  );

  const emptyHistory = useMemo(
    () => isEmptyHistory(priceHistory.data),
    [priceHistory.data],
  );
  const loadingText = priceHistory.isPending && 'Loading price history...';
  const noBudgetByOrders =
    Number(buyOrder.budget) + Number(sellOrder.budget) <= 0;
  const noBudgetText =
    !emptyHistory && noBudgetByOrders && 'Please add Sell and/or Buy budgets';
  const btnDisabled = emptyHistory || noBudgetByOrders;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (btnDisabled || !base || !quote) return;
    if (e.currentTarget.querySelector('.error-message')) return;
    const chartStart = search.chartStart ?? defaultStart();
    const chartEnd = search.chartEnd ?? defaultEnd();

    navigate({
      to: '/simulate/result',
      search: {
        base: base.address,
        quote: quote.address,
        buyMin: buyOrder.min,
        buyMax: buyOrder.max,
        buyBudget: buyOrder.budget,
        buyIsRange: buyOrder.settings === 'range',
        sellMin: sellOrder.min,
        sellMax: sellOrder.max,
        sellBudget: sellOrder.budget,
        sellIsRange: sellOrder.settings === 'range',
        start: chartStart,
        end: chartEnd,
        type: 'recurring',
      },
    });
  };

  const error = getRecurringError(buyOrder, sellOrder);
  const warning = getRecurringWarning(buyOrder, sellOrder);

  return (
    <>
      <StrategyChartSection>
        <StrategyChartHistory buy={buyOrder} sell={sellOrder}>
          <D3ChartRecurring
            base={base}
            quote={quote}
            isLimit={isLimit}
            prices={prices}
            onChange={setPrices}
          />
          <TradeChartContent />
          <D3PricesAxis prices={prices} />
        </StrategyChartHistory>
      </StrategyChartSection>
      <form
        onSubmit={submit}
        className="form grid gap-16 grid-area-[form] content-start animate-scale-up"
        data-testid="create-simulation-form"
      >
        <div className="surface rounded-2xl overflow-clip">
          <CreateOrder
            type="recurring"
            direction="sell"
            base={base}
            quote={quote}
            order={sellOrder}
            setOrder={setSellOrder}
            setSettings={setSellSetting}
            error={error}
            warnings={[sellOutsideMarket, warning]}
          />
          <CreateOrder
            type="recurring"
            direction="buy"
            base={base}
            quote={quote}
            order={buyOrder}
            setOrder={setBuyOrder}
            setSettings={setBuySetting}
            error={error}
            warnings={[buyOutsideMarket, warning]}
          />
        </div>
        <input className="approve-warnings hidden" defaultChecked />
        <button
          type="submit"
          data-testid="start-simulation-btn"
          disabled={btnDisabled}
          className="btn-main-gradient text-16 py-12"
        >
          {loadingText || noBudgetText || 'Start Simulation'}
        </button>
      </form>
    </>
  );
};
