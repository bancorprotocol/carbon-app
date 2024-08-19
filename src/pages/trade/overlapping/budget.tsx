import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { ForwardArrow } from 'components/common/forwardArrow';
import { useTradeCtx } from 'components/trade/TradeContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { TradeOverlappingSearch } from 'libs/routing/routes/trade';
import { cn } from 'utils/helpers';
import { CreateStepper } from 'components/strategies/create/CreateStepper';
import { CreateOverlappingBudget } from 'components/strategies/create/CreateOverlappingBudget';
import { getOverlappingOrders } from 'components/strategies/create/utils';
import { useEffect } from 'react';
import { TradeOverlappingChart } from 'components/trade/TradeOverlappingChart';
import style from 'components/strategies/common/stepper.module.css';

const url = '/trade/activity/overlapping/budget';
export const TradeOverlappingBudget = () => {
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
        className={cn(
          style.stepper,
          'bg-background-900 flex flex-col gap-20 overflow-auto rounded p-20'
        )}
      >
        <header className="flex items-center gap-8">
          <Link
            from={url}
            to="../price"
            search
            resetScroll={false}
            className="grid size-28 place-items-center rounded-full bg-black"
          >
            <ForwardArrow className="size-14 rotate-180" />
          </Link>
          <h2 id="trade-form-title" className="text-18">
            Concentrated Liquidity Trade
          </h2>
        </header>
        <CreateStepper
          from={url}
          to="../summary"
          nextPage="Summary"
          variant="success"
        >
          <CreateOverlappingBudget
            base={base}
            quote={quote}
            marketPrice={marketPrice}
            order0={orders.buy}
            order1={orders.sell}
          />
        </CreateStepper>
      </section>
      <TradeOverlappingChart />
    </>
  );
};
