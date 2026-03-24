import { useSearch } from '@tanstack/react-router';
import { useSetRecurringOrder } from 'components/strategies/common/useSetOrder';
import { outSideMarketWarning } from 'components/strategies/common/utils';
import { CreateOrder } from 'components/strategies/create/CreateOrder';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useStrategyFormCtx } from 'components/strategies/common/StrategyFormContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { getTradeOrder } from 'components/strategies/create/utils';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { useCallback } from 'react';
import { OnPriceUpdates } from 'components/strategies/common/d3Chart';
import { StrategySettings } from 'libs/routing';
import { useDebouncePrices } from 'components/strategies/common/d3Chart/useDebouncePrices';
import { D3ChartRecurring } from 'components/strategies/common/d3Chart/recurring/D3ChartRecurring';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { D3PricesAxis } from 'components/strategies/common/d3Chart/D3PriceAxis';
import { CreateLayout } from 'components/strategies/create/CreateLayout';
import { EditMarketPrice } from 'components/strategies/common/InitMarketPrice';
import {
  checkIfOrdersOverlap,
  checkIfOrdersReversed,
} from 'components/strategies/utils';
import { OrderBlock } from 'components/strategies/common/types';

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

const url = '/trade/recurring';
export const TradeRecurring = () => {
  const search = useSearch({ from: url });
  const { base, quote } = useStrategyFormCtx();
  const { setSellOrder, setBuyOrder } = useSetRecurringOrder(url);
  const marketQuery = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? marketQuery.marketPrice?.toString();

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

  const error = getRecurringError(buyOrder, sellOrder);
  const warning = getRecurringWarning(buyOrder, sellOrder);

  return (
    <>
      <StrategyChartSection
        editMarketPrice={<EditMarketPrice base={base} quote={quote} />}
      >
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
      <CreateLayout url={url}>
        <CreateForm base={base!} quote={quote!} buy={buyOrder} sell={sellOrder}>
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
        </CreateForm>
      </CreateLayout>
    </>
  );
};
