import { useNavigate, useSearch } from '@tanstack/react-router';
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
import { TradeLayout } from 'components/trade/TradeLayout';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { useCallback } from 'react';
import { OnPriceUpdates } from 'components/strategies/common/d3Chart';
import { OverlappingInitMarketPrice } from 'components/strategies/overlapping/OverlappingMarketPrice';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';

const url = '/trade/recurring';
export const TradeRecurring = () => {
  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });
  const { base, quote } = useTradeCtx();
  const { setSellOrder, setBuyOrder } = useSetRecurringOrder(url);
  const marketQuery = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? marketQuery.marketPrice?.toString();

  const onPriceUpdates: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      setBuyOrder({ min: buy.min, max: buy.max });
      setSellOrder({ min: sell.min, max: sell.max });
    },
    [setBuyOrder, setSellOrder]
  );

  const sellOrder = getDefaultOrder(
    'sell',
    {
      min: search.sellMin,
      max: search.sellMax,
      budget: search.sellBudget,
      settings: search.sellSettings,
    },
    marketPrice
  );
  const buyOrder = getDefaultOrder(
    'buy',
    {
      min: search.buyMin,
      max: search.buyMax,
      budget: search.buyBudget,
      settings: search.buySettings,
    },
    marketPrice
  );

  const sellOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: sellOrder.min,
    max: sellOrder.max,
    buy: false,
  });
  const buyOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: buyOrder.min,
    max: buyOrder.max,
    buy: true,
  });
  const isLimit = {
    buy: buyOrder.settings === 'limit',
    sell: sellOrder.settings === 'limit',
  };

  const setMarketPrice = useCallback(
    (marketPrice: string) => {
      navigate({
        search: (previous) => ({ ...previous, marketPrice }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  if (!marketPrice && marketQuery.isPending) {
    return (
      <TradeLayout>
        <CarbonLogoLoading className="h-[80px] place-self-center" />
      </TradeLayout>
    );
  }

  if (!marketPrice) {
    return (
      <>
        <TradeLayout>
          <article
            key="marketPrice"
            className="bg-background-900 rounded-ee rounded-es"
          >
            <OverlappingInitMarketPrice
              base={base}
              quote={quote}
              setMarketPrice={(price) => setMarketPrice(price)}
            />
          </article>
        </TradeLayout>
        <StrategyChartSection>
          <StrategyChartHistory
            type="recurring"
            base={base}
            quote={quote}
            order0={buyOrder}
            order1={sellOrder}
            isLimit={isLimit}
            onPriceUpdates={onPriceUpdates}
          />
        </StrategyChartSection>
      </>
    );
  }

  return (
    <>
      <TradeLayout>
        <CreateForm
          base={base!}
          quote={quote!}
          order0={buyOrder}
          order1={sellOrder}
        >
          <CreateOrder
            type="recurring"
            base={base}
            quote={quote}
            order={sellOrder}
            setOrder={setSellOrder}
            error={getRecurringError(search)}
            warnings={[sellOutsideMarket, getRecurringWarning(search)]}
          />
          <CreateOrder
            type="recurring"
            base={base}
            quote={quote}
            order={buyOrder}
            setOrder={setBuyOrder}
            error={getRecurringError(search)}
            warnings={[buyOutsideMarket, getRecurringWarning(search)]}
            buy
          />
        </CreateForm>
      </TradeLayout>
      <StrategyChartSection>
        <StrategyChartHistory
          type="recurring"
          base={base}
          quote={quote}
          order0={buyOrder}
          order1={sellOrder}
          isLimit={isLimit}
          onPriceUpdates={onPriceUpdates}
        />
      </StrategyChartSection>
    </>
  );
};
