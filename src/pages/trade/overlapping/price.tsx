import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { ForwardArrow } from 'components/common/forwardArrow';
import { TradeChartSection } from 'components/trade/TradeChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { TradeOverlappingSearch } from 'libs/routing/routes/trade';
import { cn } from 'utils/helpers';
import { CreateStepper } from 'components/strategies/create/CreateStepper';
import { CreateOverlappingPrice } from 'components/strategies/create/CreateOverlappingPrice';
import { OverlappingInitMarketPrice } from 'components/strategies/overlapping/OverlappingMarketPrice';
import {
  getOverlappingOrders,
  initSpread,
} from 'components/strategies/create/utils';
import style from 'components/strategies/common/stepper.module.css';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';

const url = '/trade/overview/overlapping/price';
export const TradeOverlappingPrice = () => {
  const navigate = useNavigate({ from: url });
  const { base, quote } = useTradeCtx();
  const search = useSearch({ strict: false }) as TradeOverlappingSearch;
  const { marketPrice: externalPrice, isPending } = useMarketPrice({
    base,
    quote,
  });
  const marketPrice = search.marketPrice ?? externalPrice?.toString();

  const orders = getOverlappingOrders(search, base, quote, marketPrice);

  if (isPending) {
    return <CarbonLogoLoading className="h-[80px]" />;
  }

  if (!marketPrice) {
    const setMarketPrice = (price: string) => {
      navigate({
        search: (previous) => ({ ...previous, marketPrice: price }),
        replace: true,
        resetScroll: false,
      });
    };
    return (
      <div className="flex flex-col gap-20">
        <article
          key="marketPrice"
          className="rounded-10 bg-background-800 flex flex-col md:w-[440px]"
        >
          <OverlappingInitMarketPrice
            base={base}
            quote={quote}
            marketPrice={marketPrice}
            setMarketPrice={setMarketPrice}
          />
        </article>
      </div>
    );
  }

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
            from={url}
            to="../.."
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
          to="../budget"
          nextPage="Set Budget"
          variant="success"
        >
          <CreateOverlappingPrice
            base={base!}
            quote={quote!}
            marketPrice={marketPrice}
            order0={orders.buy}
            order1={orders.sell}
            spread={search.spread || initSpread}
          />
        </CreateStepper>
      </section>
      <TradeChartSection />
    </>
  );
};
