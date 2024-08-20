import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTradeCtx } from 'components/trade/TradeContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { TradeOverlappingSearch } from 'libs/routing/routes/trade';
import { CreateOverlappingPrice } from 'components/strategies/create/CreateOverlappingPrice';
import {
  OverlappingInitMarketPrice,
  OverlappingMarketPrice,
} from 'components/strategies/overlapping/OverlappingMarketPrice';
import {
  getOverlappingOrders,
  initSpread,
} from 'components/strategies/create/utils';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { TradeOverlappingChart } from 'components/trade/TradeOverlappingChart';
import { TradeLayout } from 'components/trade/TradeLayout';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { CreateOverlappingBudget } from 'components/strategies/create/CreateOverlappingBudget';

const url = '/trade/overlapping';
export const TradeOverlapping = () => {
  const navigate = useNavigate({ from: url });
  const { base, quote } = useTradeCtx();
  const search = useSearch({ strict: false }) as TradeOverlappingSearch;
  const marketQuery = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? marketQuery.marketPrice?.toString();

  const orders = getOverlappingOrders(search, base, quote, marketPrice);
  const setMarketPrice = (price: string) => {
    navigate({
      search: (previous) => ({ ...previous, marketPrice: price }),
      replace: true,
      resetScroll: false,
    });
  };

  if (!marketPrice && marketQuery.isPending) {
    return (
      <TradeLayout>
        <CarbonLogoLoading className="h-[80px] place-self-center" />
      </TradeLayout>
    );
  }

  if (!marketPrice) {
    return (
      <TradeLayout>
        <article
          key="marketPrice"
          className="rounded-10 bg-background-900 flex flex-col md:w-[440px]"
        >
          <OverlappingInitMarketPrice
            base={base}
            quote={quote}
            marketPrice={marketPrice}
            setMarketPrice={setMarketPrice}
          />
        </article>
      </TradeLayout>
    );
  }

  return (
    <>
      <TradeLayout>
        <CreateForm
          type="overlapping"
          base={base}
          quote={quote}
          order0={orders.buy}
          order1={orders.sell}
        >
          <CreateOverlappingPrice
            base={base!}
            quote={quote!}
            marketPrice={marketPrice}
            order0={orders.buy}
            order1={orders.sell}
            spread={search.spread || initSpread}
          />
          <CreateOverlappingBudget
            base={base}
            quote={quote}
            marketPrice={marketPrice}
            order0={orders.buy}
            order1={orders.sell}
          />
        </CreateForm>
      </TradeLayout>
      <TradeOverlappingChart>
        <OverlappingMarketPrice
          base={base}
          quote={quote}
          marketPrice={marketPrice}
          setMarketPrice={setMarketPrice}
        />
      </TradeOverlappingChart>
    </>
  );
};
