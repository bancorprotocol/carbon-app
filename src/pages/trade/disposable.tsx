import { useNavigate, useSearch } from '@tanstack/react-router';
import { OnPriceUpdates } from 'components/strategies/common/d3Chart';
import {
  emptyOrder,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { CreateOrder } from 'components/strategies/create/CreateOrder';
import { getDefaultOrder } from 'components/strategies/create/utils';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useTradeCtx } from 'components/trade/context';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { StrategyDirection } from 'libs/routing';
import {
  StrategySettings,
  TradeDisposableSearch,
} from 'libs/routing/routes/trade';
import { useCallback } from 'react';
import { D3ChartDisposable } from 'components/strategies/common/d3Chart/disposable/D3ChartDisposable';
import { useDebouncePrices } from 'components/strategies/common/d3Chart/useDebouncePrices';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { D3PricesAxis } from 'components/strategies/common/d3Chart/D3PriceAxis';
import { CreateLayout } from 'components/strategies/create/CreateLayout';
import { EditMarketPrice } from 'components/strategies/common/InitMarketPrice';

const url = '/trade/disposable';
export const TradeDisposable = () => {
  const { base, quote } = useTradeCtx();
  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });
  const marketQuery = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? marketQuery.marketPrice?.toString();

  const direction = search.direction || 'sell';
  const order = getDefaultOrder(direction, search, marketPrice);
  const setSearch = useCallback(
    (next: TradeDisposableSearch) => {
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
    setSearch({ direction, budget: undefined, min: undefined, max: undefined });
  };
  const setSettings = (settings: StrategySettings) => {
    const { min, max } = getDefaultOrder(direction, { settings }, marketPrice);
    setSearch({ settings, min, max });
  };

  const updatePrices: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      if (direction === 'buy') setSearch({ min: buy.min, max: buy.max });
      else setSearch({ min: sell.min, max: sell.max });
    },
    [setSearch, direction],
  );

  // Warnings
  const outSideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: order.min,
    max: order.max,
    isBuy: direction === 'buy',
  });
  const buy = direction === 'buy' ? order : emptyOrder();
  const sell = direction === 'sell' ? order : emptyOrder();
  const isLimit = {
    buy: order.settings !== 'range',
    sell: order.settings !== 'range',
  };

  const { prices, setPrices } = useDebouncePrices(buy, sell, updatePrices);

  return (
    <>
      <StrategyChartSection
        editMarketPrice={<EditMarketPrice base={base} quote={quote} />}
      >
        <StrategyChartHistory
          base={base}
          quote={quote}
          buy={buy}
          sell={sell}
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
      <CreateLayout url={url}>
        <CreateForm base={base} quote={quote} buy={buy} sell={sell}>
          <CreateOrder
            type="disposable"
            base={base}
            quote={quote}
            direction={search.direction}
            order={order}
            setOrder={setSearch}
            warnings={[outSideMarket]}
            setDirection={setDirection}
            setSettings={setSettings}
          />
        </CreateForm>
      </CreateLayout>
    </>
  );
};
