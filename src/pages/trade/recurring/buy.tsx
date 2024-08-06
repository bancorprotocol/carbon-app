import { Link, useSearch } from '@tanstack/react-router';
import { ForwardArrow } from 'components/common/forwardArrow';
import { OrderBlock } from 'components/strategies/common/types';
import { useSetRecurringOrder } from 'components/strategies/common/useSetOrder';
import { outSideMarketWarning } from 'components/strategies/common/utils';
import { CreateOrder } from 'components/strategies/create/CreateOrder';
import {
  checkIfOrdersOverlap,
  checkIfOrdersReversed,
} from 'components/strategies/utils';
import { TradeChartSection } from 'components/trade/TradeChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { TradeRecurringSearch } from 'libs/routing/routes/trade';
import { cn } from 'utils/helpers';
import style from 'components/strategies/common/stepper.module.css';
import { CreateStepper } from 'components/strategies/create/CreateStepper';

const getError = (search: TradeRecurringSearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const buyOrder = { min: buyMin ?? '', max: buyMax ?? '' };
  const sellOrder = { min: sellMin ?? '', max: sellMax ?? '' };
  if (checkIfOrdersReversed(buyOrder, sellOrder)) {
    return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid an immediate loss of funds upon creation.';
  }
};

const getWarning = (search: TradeRecurringSearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const buyOrder = { min: buyMin ?? '', max: buyMax ?? '' };
  const sellOrder = { min: sellMin ?? '', max: sellMax ?? '' };
  if (checkIfOrdersOverlap(buyOrder, sellOrder)) {
    return 'Notice: your Buy and Sell orders overlap';
  }
};

const url = '/trade/overview/recurring/buy';
export const TradeRecurringBuy = () => {
  const search = useSearch({ strict: false }) as TradeRecurringSearch;
  const { base, quote } = useTradeCtx();
  const { marketPrice } = useMarketPrice({ base, quote });
  const { setBuyOrder } = useSetRecurringOrder<typeof search>(url);
  const buyOrder: OrderBlock = {
    min: search.buyMin ?? '',
    max: search.buyMax ?? '',
    budget: search.buyBudget ?? '',
    settings: search.buySettings ?? 'range',
  };
  const buyOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.buyMin,
    max: search.buyMax,
    buy: false,
  });
  return (
    <>
      <section
        aria-labelledby="trade-form-title"
        className={cn(
          style.stepper,
          'bg-background-800 flex flex-col gap-20 overflow-auto rounded p-20'
        )}
      >
        <header className="flex items-center gap-8">
          <Link
            from="/trade/overview/recurring/buy"
            to="../sell"
            search
            className="grid size-28 place-items-center rounded-full bg-black"
          >
            <ForwardArrow className="size-14 rotate-180" />
          </Link>
          <h2 id="trade-form-title" className="text-18">
            Recurring Trade
          </h2>
          <h3 className="font-weight-500 text-16 text-buy border-buy rounded-8 bg-buy/10 ml-auto border px-8 py-4">
            Buy Low
          </h3>
        </header>
        <CreateStepper
          from={url}
          to="../summary"
          nextPage="Summary"
          variant="buy"
        >
          <CreateOrder
            type="recurring"
            base={base}
            quote={quote}
            order={buyOrder}
            setOrder={setBuyOrder}
            error={getError(search)}
            warnings={[buyOutsideMarket, getWarning(search)]}
            buy
          />
        </CreateStepper>
      </section>
      <TradeChartSection />
    </>
  );
};
