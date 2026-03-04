import { useNavigate, useSearch } from '@tanstack/react-router';
import { CreateOverlappingBudget } from 'components/strategies/create/CreateOverlappingBudget';
import { CreateOverlappingPrice } from 'components/strategies/create/CreateOverlappingPrice';
import { getOverlappingOrders } from 'components/strategies/create/utils';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { TradeOverlappingSearch } from 'libs/routing/routes/trade';
import { FormEvent, useCallback, useMemo } from 'react';
import { D3ChartOverlapping } from 'components/strategies/common/d3Chart/overlapping/D3ChartOverlapping';
import { OnPriceUpdates } from 'components/strategies/common/d3Chart';
import {
  defaultEnd,
  defaultStart,
  oneYearAgo,
} from 'components/strategies/common/utils';
import { cn } from 'utils/helpers';
import { isEmptyHistory } from 'components/strategies/common/d3Chart/utils';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { D3PricesAxis } from 'components/strategies/common/d3Chart/D3PriceAxis';
import { useDebouncePrices } from 'components/strategies/common/d3Chart/useDebouncePrices';
import { useStrategyFormCtx } from 'components/strategies/common/StrategyFormContext';
import style from 'components/strategies/common/form.module.css';

export const SimulatorInputOverlappingPage = () => {
  const search = useSearch({ from: '/simulate/overlapping' });
  const navigate = useNavigate({ from: '/simulate/overlapping' });
  const { base, quote, marketPrice } = useStrategyFormCtx();

  const priceHistory = useGetTokenPriceHistory({
    baseToken: search.base,
    quoteToken: search.quote,
    start: oneYearAgo(),
    end: defaultEnd(),
  });

  const orders = useMemo(() => {
    return getOverlappingOrders(search, base, quote, marketPrice);
  }, [marketPrice, base, quote, search]);

  const emptyHistory = useMemo(
    () => isEmptyHistory(priceHistory.data),
    [priceHistory.data],
  );
  const loadingText = priceHistory.isPending && 'Loading price history...';
  const noBudgetByOrders =
    Number(orders.buy.budget) + Number(orders.sell.budget) <= 0;
  const noBudgetText =
    !emptyHistory && noBudgetByOrders && 'Please add Sell and/or Buy budgets';
  const btnDisabled = emptyHistory || noBudgetByOrders;

  const submit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (btnDisabled) return;
      const chartStart = search.chartStart ?? defaultStart();
      const chartEnd = search.chartEnd ?? defaultEnd();

      if (!base || !quote || !marketPrice) return;
      if (e.currentTarget.querySelector('.error-message')) return;

      const searchParams = {
        base: base.address,
        quote: quote.address,
        buyMin: orders.buy.min,
        buyMax: orders.buy.max,
        buyBudget: orders.buy.budget,
        buyMarginal: orders.buy.marginalPrice,
        buyIsRange: true,
        sellMin: orders.sell.min,
        sellMax: orders.sell.max,
        sellBudget: orders.sell.budget,
        sellMarginal: orders.sell.marginalPrice,
        sellIsRange: true,
        chartStart: chartStart,
        chartEnd: chartEnd,
        type: 'overlapping' as const,
        spread: search.spread,
      };

      navigate({ to: '/simulate/result', search: searchParams });
    },
    [
      btnDisabled,
      search.chartStart,
      search.chartEnd,
      search.spread,
      base,
      quote,
      marketPrice,
      orders,
      navigate,
    ],
  );

  const set = useCallback(
    (next: TradeOverlappingSearch) => {
      navigate({
        search: (previous) => ({ ...previous, ...next }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const updatePrices: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      set({ min: buy.min, max: sell.max });
    },
    [set],
  );
  const { prices, setPrices } = useDebouncePrices(
    orders.buy,
    orders.sell,
    updatePrices,
  );

  return (
    <>
      <section
        aria-labelledby="price-chart-title"
        className="surface grid-area-[chart] sticky top-[96px] sm:flex max-h-[600px] min-h-[500px] flex-col gap-20 rounded-2xl p-20 animate-scale-up hidden"
      >
        <header className="flex flex-wrap items-center gap-20">
          <h2 id="price-chart-title" className="text-18">
            Price Chart
          </h2>
        </header>
        <StrategyChartHistory
          base={base}
          quote={quote}
          buy={orders.buy}
          sell={orders.sell}
        >
          <D3ChartOverlapping
            base={base}
            quote={quote}
            prices={prices}
            onChange={setPrices}
            spread={Number(search.spread)}
          />
          <TradeChartContent />
          <D3PricesAxis prices={prices} />
        </StrategyChartHistory>
      </section>
      <form
        onSubmit={submit}
        className={cn(
          style.form,
          'grid gap-16 grid-area-[form] content-start animate-scale-up',
        )}
        data-testid="create-simulation-form"
      >
        <div className="surface grid content-start rounded-2xl">
          <CreateOverlappingPrice
            base={base}
            quote={quote}
            buy={orders.buy}
            sell={orders.sell}
            spread={search.spread}
            anchor={search.anchor}
            set={set}
          />
          <CreateOverlappingBudget
            base={base}
            quote={quote}
            buy={orders.buy}
            sell={orders.sell}
            anchor={search.anchor}
            budget={search.budget}
            set={set}
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
