import { FC, useEffect, useState } from 'react';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { Strategy } from 'libs/queries';
import {
  getMaxBuyMin,
  getMinSellMax,
  getRoundedSpread,
  isMaxBelowMarket,
  isMinAboveMarket,
  isValidSpread,
} from 'components/strategies/overlapping/utils';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { useMarketIndication } from 'components/strategies/marketPriceIndication';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OverlappingStrategyGraph } from 'components/strategies/overlapping/OverlappingStrategyGraph';
import { OverlappingStrategySpread } from 'components/strategies/overlapping/OverlappingStrategySpread';
import { OverlappingRange } from 'components/strategies/overlapping/OverlappingRange';
import { EditOverlappingStrategyBudget } from './EditOverlappingStrategyBudget';
import { isValidRange } from 'components/strategies/utils';
import {
  calculateOverlappingBuyBudget,
  calculateOverlappingPrices,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';

interface Props {
  strategy: Strategy;
  order0: OrderCreate;
  order1: OrderCreate;
  setOverlappingError: (error: string) => void;
}

export const EditPriceOverlappingStrategy: FC<Props> = (props) => {
  const { strategy, order0, order1 } = props;
  const { base, quote } = strategy;
  const marketPrice = useMarketPrice({ base, quote })?.toString();
  const { marketPricePercentage } = useMarketIndication({
    base,
    quote,
    order: { min: order0.min, max: order1.max, price: '', isRange: true },
  });

  const [spread, setSpread] = useState(getRoundedSpread(strategy));
  const [anchoredOrder, setAnchoredOrder] = useState<'buy' | 'sell'>('buy');
  const [mounted, setMounted] = useState(false);

  const setBuyBudget = (
    sellBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote) return;
    if (!sellBudget) return order0.setBudget('');
    const buyBudget = calculateOverlappingBuyBudget(
      base.decimals,
      quote.decimals,
      buyMin,
      sellMax,
      marketPrice || '0',
      spread.toString(),
      sellBudget
    );
    order0.setBudget(buyBudget);
  };

  const setSellBudget = (
    buyBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote) return;
    if (!buyBudget) order1.setBudget('');
    const sellBudget = calculateOverlappingSellBudget(
      base.decimals,
      quote.decimals,
      buyMin,
      sellMax,
      marketPrice || '0',
      spread.toString(),
      buyBudget
    );
    order1.setBudget(sellBudget);
  };

  const setOverlappingParams = (min: string, max: string) => {
    // Set min & max.
    order0.setMin(min);
    order1.setMax(max);

    // If invalid range, wait for timeout to reset range
    if (!isValidRange(min, max) || !isValidSpread(spread)) return;
    const prices = calculateOverlappingPrices(
      min,
      max,
      marketPrice || '0',
      spread.toString()
    );

    // Set prices
    order0.setMax(prices.buyPriceHigh);
    order0.setMarginalPrice(prices.buyPriceMarginal);
    order1.setMin(prices.sellPriceLow);
    order1.setMarginalPrice(prices.sellPriceMarginal);

    // Set budgets
    const buyOrder = { min, marginalPrice: prices.buyPriceMarginal };
    const sellOrder = { max, marginalPrice: prices.sellPriceMarginal };
    if (isMinAboveMarket(buyOrder)) {
      setAnchoredOrder('sell');
      setBuyBudget(order1.budget, min, max);
    } else if (isMaxBelowMarket(sellOrder)) {
      setAnchoredOrder('buy');
      setSellBudget(order0.budget, min, max);
    } else {
      if (anchoredOrder === 'buy') setSellBudget(order0.budget, min, max);
      if (anchoredOrder === 'sell') setBuyBudget(order1.budget, min, max);
    }
  };

  const setMin = (min: string) => {
    if (!order1.max) return order0.setMin(min);
    setOverlappingParams(min, order1.max);
  };

  const setMax = (max: string) => {
    if (!order0.min) return order1.setMax(max);
    setOverlappingParams(order0.min, max);
  };

  // Initialize order when market price is available
  useEffect(() => {
    if (!quote || !base || !marketPrice) return;
    if (!mounted) return setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketPrice, spread]);

  // Update on buyMin changes
  useEffect(() => {
    if (!order0.min) return;
    if (!mounted) return setMounted(true);
    const timeout = setTimeout(async () => {
      const decimals = quote?.decimals ?? 18;
      const minSellMax = getMinSellMax(Number(order0.min), spread);
      if (Number(order1.max) < minSellMax) {
        setMax(minSellMax.toFixed(decimals));
      }
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.min]);

  // Update on sellMax changes
  useEffect(() => {
    if (!order1.max) return;
    if (!mounted) return setMounted(true);
    const timeout = setTimeout(async () => {
      const decimals = quote?.decimals ?? 18;
      const maxBuyMin = getMaxBuyMin(Number(order1.max), spread);
      if (Number(order0.min) > maxBuyMin) {
        setMin(maxBuyMin.toFixed(decimals));
      }
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order1.max]);

  return (
    <>
      <article className="rounded-10 bg-background-900 flex w-full flex-col gap-20 p-20">
        <header>
          <h2 className="text-18 font-weight-500 flex-1">Price Range</h2>
        </header>
        <OverlappingStrategyGraph
          base={base}
          quote={quote}
          order0={order0}
          order1={order1}
          marketPrice={marketPrice}
          spread={spread}
          marketPricePercentage={marketPricePercentage}
          setMin={setMin}
          setMax={setMax}
        />
      </article>
      <article className="rounded-10 bg-background-900 flex w-full flex-col gap-20 p-20">
        <header className="flex items-center gap-8">
          <h2 className="text-18 font-weight-500 flex-1">
            Edit Price Range&nbsp;
            <span className="text-white/40">
              ({quote?.symbol} per 1 {base?.symbol})
            </span>
          </h2>
          <Tooltip
            element="Indicate the strategy exact buy and sell prices."
            iconClassName="size-14 text-white/60"
          />
        </header>
        {base && quote && (
          <OverlappingRange
            base={base}
            quote={quote}
            order0={order0}
            order1={order1}
            marketPricePercentage={marketPricePercentage}
            setMin={setMin}
            setMax={setMax}
          />
        )}
      </article>
      <article className="rounded-10 bg-background-900 flex w-full flex-col gap-10 p-20">
        <header className="mb-10 flex items-center gap-8 ">
          <h2 className="text-18 font-weight-500 flex-1">Edit Spread</h2>
          <Tooltip
            element="The difference between the highest bidding (Sell) price, and the lowest asking (Buy) price"
            iconClassName="size-14 text-white/60"
          />
        </header>
        <OverlappingStrategySpread
          buyMin={+order0.min}
          sellMax={+order1.max}
          defaultValue={0.05}
          options={[0.01, 0.05, 0.1]}
          spread={spread}
          setSpread={setSpread}
        />
      </article>
      <EditOverlappingStrategyBudget
        {...props}
        marketPrice={marketPrice}
        anchoredOrder={anchoredOrder}
        setAnchoredOrder={setAnchoredOrder}
        setBuyBudget={setBuyBudget}
        setSellBudget={setSellBudget}
      />
    </>
  );
};
