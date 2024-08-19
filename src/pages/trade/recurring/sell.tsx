import { Link, useSearch } from '@tanstack/react-router';
import { ForwardArrow } from 'components/common/forwardArrow';
import { OrderBlock } from 'components/strategies/common/types';
import { useSetRecurringOrder } from 'components/strategies/common/useSetOrder';
import { outSideMarketWarning } from 'components/strategies/common/utils';
import { CreateOrder } from 'components/strategies/create/CreateOrder';
import { CreateStepper } from 'components/strategies/create/CreateStepper';
import {
  getRecurringError,
  getRecurringWarning,
} from 'components/strategies/create/utils';
import { TradeChartSection } from 'components/trade/TradeChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { TradeRecurringSearch } from 'libs/routing/routes/trade';

const url = '/trade/activity/recurring/sell';
export const TradeRecurringSell = () => {
  const search = useSearch({ strict: false }) as TradeRecurringSearch;
  const { base, quote } = useTradeCtx();
  const { marketPrice } = useMarketPrice({ base, quote });
  const { setSellOrder } = useSetRecurringOrder<typeof search>(url);
  const sellOrder: OrderBlock = {
    min: search.sellMin ?? '',
    max: search.sellMax ?? '',
    budget: search.sellBudget ?? '',
    settings: search.sellSettings ?? 'range',
  };
  const sellOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.sellMin,
    max: search.sellMax,
    buy: false,
  });
  return (
    <>
      <section
        aria-labelledby="trade-form-title"
        className="bg-background-900 flex flex-col gap-20 overflow-auto rounded p-20"
      >
        <header className="flex items-center gap-8">
          <Link
            from={url}
            to="../.."
            search
            resetScroll={false}
            className="grid size-28 place-items-center rounded-full bg-black"
          >
            <ForwardArrow className="size-14 rotate-180" />
          </Link>
          <h2 id="trade-form-title" className="text-18">
            Recurring Trade
          </h2>
          <h3 className="font-weight-500 text-16 text-sell border-sell rounded-8 bg-sell/10 ml-auto border px-8 py-4">
            Sell High
          </h3>
        </header>
        <CreateStepper from={url} to="../buy" nextPage="Buy Low" variant="sell">
          <CreateOrder
            type="recurring"
            base={base}
            quote={quote}
            order={sellOrder}
            setOrder={setSellOrder}
            error={getRecurringError(search)}
            warnings={[sellOutsideMarket, getRecurringWarning(search)]}
          />
        </CreateStepper>
      </section>
      <TradeChartSection />
    </>
  );
};
