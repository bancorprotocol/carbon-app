import { Link } from '@tanstack/react-router';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ForwardArrow } from 'components/common/forwardArrow';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { CreateOverlappingSummary } from 'components/strategies/create/CreateOverlappingSummary';
import {
  getOverlappingOrders,
  initSpread,
} from 'components/strategies/create/utils';
import { useTradeCtx } from 'components/trade/TradeContext';
import { TradeOverlappingChart } from 'components/trade/TradeOverlappingChart';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { TradeOverlappingSearch } from 'libs/routing/routes/trade';
import { useEffect } from 'react';

const url = '/trade/overview/overlapping/summary';
export const TradeOverlappingSummary = () => {
  const navigate = useNavigate({ from: url });
  const { base, quote } = useTradeCtx();
  const search = useSearch({ strict: false }) as TradeOverlappingSearch;
  const { marketPrice: externalPrice } = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? externalPrice?.toString();
  const orders = getOverlappingOrders(search, base, quote, marketPrice);

  useEffect(() => {
    if (!marketPrice) {
      navigate({ from: url, to: '../price', search: true, replace: true });
    }
  }, [navigate, marketPrice]);

  if (!marketPrice) return;
  return (
    <>
      <section
        aria-labelledby="trade-form-title"
        className="bg-background-900 flex flex-col gap-20 overflow-auto rounded p-20"
      >
        <CreateForm
          type="overlapping"
          base={base}
          quote={quote}
          order0={orders.buy}
          order1={orders.sell}
        >
          <header className="flex items-center gap-8">
            <Link
              from={url}
              to="../budget"
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
          <CreateOverlappingSummary
            base={base}
            quote={quote}
            order0={orders.buy}
            order1={orders.sell}
            spread={search.spread ?? initSpread}
          />
        </CreateForm>
      </section>
      <TradeOverlappingChart />
    </>
  );
};
