import { useSearch } from '@tanstack/react-router';
import { useSetRecurringOrder } from 'components/strategies/common/useSetOrder';
import { outSideMarketWarning } from 'components/strategies/common/utils';
import { CreateOrder } from 'components/strategies/create/CreateOrder';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  getDefaultOrder,
  getRecurringError,
  getRecurringWarning,
} from 'components/strategies/create/utils';
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

const url = '/trade/recurring';
export const TradeRecurring = () => {
  const search = useSearch({ from: url });
  const { base, quote } = useTradeCtx();
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

  const sellOrder = getDefaultOrder(
    'sell',
    {
      min: search.sellMin,
      max: search.sellMax,
      budget: search.sellBudget,
      settings: search.sellSettings,
    },
    marketPrice,
  );
  const buyOrder = getDefaultOrder(
    'buy',
    {
      min: search.buyMin,
      max: search.buyMax,
      budget: search.buyBudget,
      settings: search.buySettings,
    },
    marketPrice,
  );

  const setSellSetting = useCallback(
    (settings: StrategySettings) => {
      const { min, max } = getDefaultOrder('sell', { settings }, marketPrice);
      setSellOrder({ settings, min, max });
    },
    [marketPrice, setSellOrder],
  );
  const setBuySetting = useCallback(
    (settings: StrategySettings) => {
      const { min, max } = getDefaultOrder('buy', { settings }, marketPrice);
      setBuyOrder({ settings, min, max });
    },
    [marketPrice, setBuyOrder],
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

  return (
    <>
      <StrategyChartSection
        editMarketPrice={<EditMarketPrice base={base} quote={quote} />}
      >
        <StrategyChartHistory
          base={base}
          quote={quote}
          buy={buyOrder}
          sell={sellOrder}
        >
          <D3ChartRecurring
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
            error={getRecurringError(search)}
            warnings={[sellOutsideMarket, getRecurringWarning(search)]}
          />
          <CreateOrder
            type="recurring"
            direction="buy"
            base={base}
            quote={quote}
            order={buyOrder}
            setOrder={setBuyOrder}
            setSettings={setBuySetting}
            error={getRecurringError(search)}
            warnings={[buyOutsideMarket, getRecurringWarning(search)]}
          />
        </CreateForm>
      </CreateLayout>
    </>
  );
};
