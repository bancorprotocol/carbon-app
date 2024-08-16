import { Link, useSearch } from '@tanstack/react-router';
import { ForwardArrow } from 'components/common/forwardArrow';
import { CreateRecurringSummary } from 'components/strategies/create/CreateRecurringSummary';
import { OrderBlock } from 'components/strategies/common/types';
import { outSideMarketWarning } from 'components/strategies/common/utils';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { TradeChartSection } from 'components/trade/TradeChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { TradeRecurringSearch } from 'libs/routing/routes/trade';
import { getRecurringWarning } from 'components/strategies/create/utils';
import { exist } from 'utils/helpers/operators';

export const TradeRecurringSummary = () => {
  const search = useSearch({ strict: false }) as TradeRecurringSearch;
  const { base, quote } = useTradeCtx();
  const { marketPrice } = useMarketPrice({ base, quote });
  const buyOrder: OrderBlock = {
    min: search.buyMin ?? '',
    max: search.buyMax ?? '',
    budget: search.buyBudget ?? '',
    settings: search.buySettings ?? 'range',
  };
  const sellOrder: OrderBlock = {
    min: search.sellMin ?? '',
    max: search.sellMax ?? '',
    budget: search.sellBudget ?? '',
    settings: search.sellSettings ?? 'range',
  };
  // Warnings
  const overlap = getRecurringWarning(search);
  const sellOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.sellMin,
    max: search.sellMax,
    buy: false,
  });
  const sellWarnings = [overlap, sellOutsideMarket].filter(exist);
  const buyOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.buyMin,
    max: search.buyMax,
    buy: true,
  });
  const buyWarnings = [overlap, sellOutsideMarket].filter(exist);
  return (
    <>
      <section
        aria-labelledby="trade-form-title"
        className="bg-background-900 flex flex-col gap-20 overflow-auto rounded p-20"
      >
        <CreateForm
          type="recurring"
          base={base!}
          quote={quote!}
          order0={buyOrder}
          order1={sellOrder}
        >
          <header className="flex items-center gap-8">
            <Link
              from="/trade/overview/recurring/summary"
              to="../buy"
              search
              resetScroll={false}
              className="grid size-28 place-items-center rounded-full bg-black"
            >
              <ForwardArrow className="size-14 rotate-180" />
            </Link>
            <h2 id="trade-form-title" className="text-18">
              Trade Summary
            </h2>
          </header>
          <CreateRecurringSummary
            base={base}
            quote={quote}
            order={sellOrder}
            warnings={sellWarnings}
          />
          <CreateRecurringSummary
            base={base}
            quote={quote}
            order={buyOrder}
            warnings={buyWarnings}
            buy
          />
        </CreateForm>
      </section>
      <TradeChartSection />
    </>
  );
};
